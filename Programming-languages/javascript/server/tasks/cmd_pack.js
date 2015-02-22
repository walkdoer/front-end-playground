/**
 * Packer
 */

module.exports = function (grunt) {
    'use strict';

    var TASK_NAME = 'pack',
        DESCRIPTION = 'compress css/js files and pack together';

    var path = require('path'),
        cssmin = require('../lib/cssmin').cssmin,
        cmd = require('../lib/cmd'),
        util = require('../lib/util'),
        keys = Object.keys,
        BANNER_RE = /^\/\*/;

    var settings = {
        'default': {
            sep: '\n',
            getDepends: util.getDepends,
            compressor: function (input) {
                return input;
            }
        },
        js: {
            sep: ';\n',
            config: function (options) {
                var config = settings.js._config || {
                    base: '.'
                };
                keys(options).forEach(function (key) {
                    if (config.hasOwnProperty(key)) {
                        config[key] = options[key];
                    }
                });
                settings.js._config = config;
            },
            getDepends: function (file) {
                return cmd.getDepends(file, settings.js._config);
            },
            compressor: cmd.compress
        },
        css: {
            sep: '\n',
            getDepends: util.getDepends,
            compressor: function (input) {
                return cssmin(input);
            }
        }
    };

    function resolve(file) {
        return path.resolve(file);
    }

    // preprocess template in options
    // default template delimiters are <% %>
    function processOptions(opt) {
        keys(opt).forEach(function (key) {
            var value = opt[key];
            if (typeof value === 'string') {
                opt[key] = grunt.template.process(value);
            } else if (Array.isArray(value)) {
                opt[key] = value.slice().map(function (i) {
                    return grunt.template.process(i);
                });
            }
        });
    }

    function processFiles(files, type, ignore) {
        var setting = settings[type],
            getDepends = setting.getDepends,
            compressor = setting.compressor,
            result = [];

        util.calcDepends(files, getDepends).forEach(function (file) {
            var code = grunt.file.read(file);
            if (ignore.indexOf(path.resolve(file)) === -1) {
                code = compressor(code);
            }
            result.push(code);
        });

        return result.join(setting.sep);
    }

    function process(options, callback) {
        processOptions(options);

        var src = options.src || [],
            ignore = options.ignore || [],
            dest = options.dest,
            type = settings.hasOwnProperty(options.type) ?
                options.type : 'default',
            banner, code;

        if (type === 'js') {
            settings.js.config(options.options);
        }

        if (BANNER_RE.test(src[0])) {
            banner = src.shift();
        }

        src = grunt.file.expand(src).map(resolve);
        ignore = grunt.file.expand(ignore).map(resolve);
        dest = path.resolve(dest);

        code = processFiles(src, type, ignore);
        code = banner ? banner + '\n' + code : code;

        grunt.file.write(dest, code);

        callback && callback();
    }

    grunt.registerMultiTask(TASK_NAME, DESCRIPTION, function () {
        var done = this.async();
        process(this.data, done);
    });
};