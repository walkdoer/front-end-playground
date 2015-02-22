/**
 * CMD Module Compiler
 */

module.exports = function (grunt) {
    'use strict';

    var TASK_NAME = 'cmd',
        DESCRIPTION = 'compile and ugilify cmd modules';

    var path = require('path'),
        ast = require('cmd-util').ast,
        cmd = require('../lib/cmd'),
        keys = Object.keys;

    var RELATIVE_RE = /^\.{1,2}\//,
        JS_EXT_RE = /\.js$/;

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
            shim = config.shim,
            src = grunt.file.expand(options.src),
            dest = options.dest,
            CODE_BEGIN = 'define(function(require,exports,module){module.exports=',
            CODE_END = ';});';

        keys(shim).forEach(function (key) {
            if (typeof key !== 'string') {
                return;
            }

            var code = CODE_BEGIN +
                    'window[' + JSON.stringify(shim[key]) + ']' + CODE_END,
                file = JS_EXT_RE.test(key) ? key : key + '.js',
                output;

            code = ast.modify(code, {
                id: key
            }).print_to_string();

            output = path.resolve(dest, file);
            grunt.file.write(output, code);

            grunt.verbose.ok('Module ' + key + 'generated.');
            grunt.verbose.writeln(output);
        });

        src.forEach(function (file) {
            var code = grunt.file.read(file),
                // only process the first module in file
                meta = ast.parse(code)[0],
                id, deps, require = {},
                output;

            // compile cmd module
            if (meta) {
                id = meta.id || cmd.pathToId(file, base),
                deps = (meta.dependencies || []).map(function (dep) {
                    var orgiDep = dep;
                    if (RELATIVE_RE.test(dep)) {
                        dep = cmd.pathToId(dep, base, file);
                        require[orgiDep] = dep;
                    }
                    return dep;
                });

                // process source code
                code = ast.modify(code, {
                    id: id,
                    dependencies: deps,
                    require: require
                }).print_to_string();
            }

            // generate compiled file
            output = path.resolve(dest, path.relative(base, file));

            grunt.file.write(output, code);

            if (meta) {
                grunt.verbose.ok('Module ' + id + ' compiled.');
                grunt.verbose.writeln(output);
            } else {
                grunt.verbose.ok(path.resolve(file) + ' copied.');
                grunt.verbose.writeln(output);
            }
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
                    value: config
                }
            });

        process(options, done);
    });
};