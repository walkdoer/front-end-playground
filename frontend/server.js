'use strict';

var path = require('path');
var express = require('express');
var bodyParser = require('body-parser')
var app = express();

var staticDir = path.resolve(__dirname);
app.use(express.static(staticDir));
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
      extended: true
}));

var port = process.argv[2] || 5000;
port = parseInt(port, 10);

app.post('/do/:action', function (req, res) {
    var action = req.params.action;
    var data;
    if (action === 'getUserList') {
        data = [
            {name: 'Judy'},
            {name: 'Jimmy'}
        ]
    } else if (action === 'getUser') {
        let name = req.body.name;
        if (!name) {
            return res.status(200).send({
                success: false,
                code: 'arguments_miss',
                message: '缺少参数'
            })
        }
        data = {
            name: name,
            address: 'Heaven Road. 11',
            age: 11
        };
    } else {
        return res.status(404).send({
            success: false,
            code: 'action_not_exits',
            message: 'action不存在'
        });
    }
    res.status(200).send({
        success: true,
        data: data
    });
});


var server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});
