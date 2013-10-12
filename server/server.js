#!/usr/bin/env node
'use strict';

var http = require('http'),
    path = require('path'),
    fs = require('fs'),
    existsSync = fs.existsSync || path.existsSync,
    express = require('express'),
    commander = require('commander'),
    Watcher = require('./lib/watch'),
    tpl = require('./lib/template'),
    util = require('./lib/util'),
    sio = require('socket.io'),
    colors = require('colors'),
    keys = Object.keys,
    colorTheme = ['grey', 'green', 'yellow', 'red', 'blue', 'rainbow', 'cyan'];

// 开发服务器
var server = {
    controller: fs.realpathSync('./app.js'),
    server: express(),
    init: function (config) {
        var that = this,
            app = this.server,
            cfg;

        // 初始化服务器配置
        config = config || {};
        cfg = this.config = {
            name: config.name || 'Server',
            staticMapping: config.staticMapping || {
                '/public': 'public'
            },
            publicDir: config.publicDir || 'public',
            privateDir: config.privateDir || 'private',
            tplDir: config.tplDir,
            port: config.port || 0,
            pidFile: config.pidFile,
            debug: config.debug === false ? config.debug : true
        };

        cfg.tplDir = cfg.tplDir || path.join(cfg.publicDir, 'tpl');
        cfg.tplDir = path.resolve(cfg.tplDir);

        cfg.pidFile = cfg.pidFile ||
            path.join(cfg.privateDir, 'var', cfg.name.toLowerCase() + '.pid');
        cfg.pidFile = path.resolve(cfg.pidFile);
        util.mkdirp(path.dirname(cfg.pidFile));

        console.dir(cfg);
        // 初始化 express 配置
        keys(cfg.staticMapping).forEach(function (key) {
            app.use(key, express.static(cfg.staticMapping[key]));
        });
        // 修复 post 数据 req.body 为 {}, 需用 req.rawBody 获取，支持 json 类型
        app.use (function(req, res, next) {
            req.rawBody = '';
            req.setEncoding('utf8');
            req.on('data', function(chunk) { req.rawBody += chunk });
            req.on('end', function() {
                next();
            });
        });
        
        app.use(express.bodyParser());
        app.use(app.router);
        app.use(express.errorHandler({
            dumpExceptions: true,
            showStack: true
        }));

        // 初始化 controller
        this.reload();

        // 监视 controller 文件改动
        new Watcher(this.controller, function (changed, done) {
            if (changed[that.controller] === 'change') {
                that.reload();
            }
            done();
        });

        return this;
    },
    // 当 controller 发生变化时重载
    reload: function () {
        var method = ['get', 'post', 'put', 'delete'],
            keys = Object.keys,
            app = this.server,
            controller = this.controller,
            cfg = this.config,
            routes = app.routes;
        console.time('Reload');

        // 重载模块
        // TODO: 当 app.js 较大时（900+ 行）刷新时会报错，看起来像 app.js 没有读完
        delete require.cache[controller];
        controller = require(controller).call(app, cfg);

        // 更新路由
        keys(routes).forEach(function (key) {
            delete routes[key];
        });

        keys(controller).forEach(function (route) {
            var config = controller[route];
            method.forEach(function (m) {
                if (typeof config[m] === 'function') {
                    app[m].call(app, route, function () {
                        var handler = config[m],
                            req = arguments[0],
                            res = arguments[1],
                            data = handler.apply(config, arguments) || {},
                            tplFile;

                        // 若函数内声明了 'use manual' 则直接返回不做进一步处理
                        if (/(['"])use manual\1/.test(handler.toString())) {
                            return;
                        } else if (/(['"])use proxy\1/.test(handler.toString())) {
                            // TODO 完善 proxy 功能 ，需升级 expressjs 模块，移除修复代码
                            //console.log('requset data:', config.reqData); 请求数据日志

                            var option = {
                                host: config.option.host,
                                port: config.option.port,
                                path: config.option.path,
                                method: 'POST',
                                headers: {
                                    'Content-Type' : 'application/json; charset=UTF-8',
                                    'Content-Length' : Buffer.byteLength(config.reqData, 'utf8')
                                }
                            };

                            //console.log('requset body:', option); 发送请求的body日志

                            var reqPost = http.request(option, function(resPost) {
                                var status = resPost.statusCode;
                                res.status = status;
                                var responseString = '';
                                resPost.setEncoding('utf-8');
                                resPost.on('data', function(d) {
                                    resPost.setEncoding('utf-8');
                                    responseString += d;
                                }).on('end', function() {
                                    res.set('Content-Type','text/html');
                                    res.data = responseString;
                                    res.end(responseString);
                                });
                            });

                            reqPost.write(config.reqData);
                            reqPost.end();
                            reqPost.on('error', function(e) {
                                console.error(e);
                            });
                            return;
                        }

                        // 若设定了模板，响应 text/html
                        if (typeof config.template === 'string') {
                            tplFile = path.join(cfg.tplDir, config.template);
                            tpl.reload(tplFile);

                            //向模板 注入 socket.io.js 文件
                            var html = tpl.tmpl(tplFile, data),
                                headIndex = html.indexOf('<head>'),
                                htmlHead = html.substring(0, headIndex + 6);

                            res.setHeader('Content-Type', 'text/html; charset=utf-8');
                            res.end(htmlHead + '<script src="/socket.io/socket.io.js"></script>' + '<script src="/log/log.js"></script>' + html.replace(htmlHead, ''));
                        // 若返回值 data 为字符串，响应 application/javascript
                        } else if (typeof data === 'string') {
                            res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
                            res.end(data);
                        // 否则响应 application/json
                        } else {
                            res.setHeader('Content-Type', 'application/json; charset=utf-8');
                            res.end(JSON.stringify(data));
                        }
                    });
                }
            });
        });

        //注入 log.js 路由，输出 log.js 文件
        app.get('/log/log.js', function(req, res){
            res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
            fs.readFile('./lib/log.js', function (err, data) {
                if (err) throw err;
                res.end(data);
            });
        });

        console.timeEnd('Reload');
    },
    run: function (port) {
        var app = http.createServer(this.server),
            cfg = this.config,
            address,
            pidFile = cfg.pidFile;

        this.io = sio.listen(app);

        //监听来自客户端的 console 消息
        this.io.sockets.on('connection', function (socket) {
            socket.on('Log message', function (data) {
                console.log('from client page Log message: '[colorTheme[JSON.parse(data)['level']]], JSON.stringify(JSON.parse(data)['args'][0])[colorTheme[JSON.parse(data)['level']]]);
            });
        });

        port = port || cfg.port;
        address = app.listen(port).address();

        console.log(cfg.name + ' starting up...\nListening on ' +
            address.address + ':' + address.port + '\n' +
            'Hit Ctrl-C to quit.');

        // 输出 pid 文件
        if (pidFile) {
            fs.writeFileSync(pidFile, process.pid);
            process.on('SIGINT', function () {
                if (existsSync(pidFile)) {
                    fs.unlinkSync(pidFile);
                }
                process.kill(process.pid);
            });
        }

        return app;
    }
};

module.exports = server;

if (require.main === module) {
    var port, pidFile; 
    commander.option('-p, --port <number>', 'server port')
        .option('-P, --pidfile <path>', 'path of pidfile')
        .parse(process.argv);
    port = commander.port && parseFloat(commander.port);
    pidFile = commander.pidfile;

    server.init({
        port: port,
        pidFile: pidFile
    }).run();
}