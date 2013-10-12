/**
 * TPL to CMD Converter
 */

module.exports = function (grunt) {
    'use strict';

    var TASK_NAME = 'tpl',
        DESCRIPTION = 'convert tpl files to cmd modules';

    var path = require('path'),
        cmd = require('../lib/cmd'),
        keys = Object.keys;

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

    function process(options, callback) {
        processOptions(options);

        var config = options.config,
            base = config.base,
            src = grunt.file.expand(options.src),
            dest = options.dest;

        src.forEach(function (file) {
            var code = grunt.file.read(file),
                output;

            code = cmd.text2cmd(code);
            output = base ?
                path.resolve(dest, path.relative(base, file)) :
                path.join(dest, path.basename(file));
            output = output.replace(/\.[^.]+$/, '.js');

            grunt.file.write(output, code);
        });

        callback && callback();
    }

    grunt.registerMultiTask(TASK_NAME, DESCRIPTION, function () {
        if (this.target === 'config') {
            return;
        }

        var done = this.async(),
            config = grunt.config(TASK_NAME).options,
            options = Object.create(this.data, {
                config: {
                    value: config || {}
                }
            });
        process(options, done);
    });
};