/**
 * Server
 */

module.exports = function (grunt) {
    var TASK_NAME = 'server',
        DESCRIPTION = 'server for backend api and static files';

    var server = require('../server');

    grunt.registerTask(TASK_NAME, DESCRIPTION, function () {
        var config = grunt.config(TASK_NAME),
            app, address, port,
            async = true,
            arg, args = this.args.slice(),
            testPath, qunit;

        while (arg = args.pop()) {
            if (arg === 'noasync') {
                async = false;
            } else if (/^\d+$/.test(arg)) {
                port = Number(arg);
                port = port >= 0 && port < 65536 ? port : 0;
            } 
        }

        app = server.init(config).run(port),
        address = app.address();

        if (async) {
            this.async();
        }

        if (config.testPath) {
            testPath = 'http://' + address.address + ':' + address.port +
                config.testPath;
            qunit = grunt.config('qunit') || {};
            qunit.elf = qunit.elf || {};
            qunit.elf.options = qunit.elf.options || {};
            qunit.elf.options.urls = qunit.elf.options.urls || [];
            qunit.elf.options.urls.push(testPath);
            grunt.config('qunit', qunit);
        }
    });
};