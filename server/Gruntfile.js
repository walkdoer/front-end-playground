/**
 * Gruntfile for Elf Project
 */

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %> */'
        },
        jshint: {
            all: [
                '../src/**/*.js',
                '!../src/lib'
            ],
            options: {
                bitwise: true,
                camelcase: true,
                curly: true,
                eqeqeq: true,
                forin: true,
                immed: true,
                indent: 4,
                latedef: true,
                newcap: true,
                noarg: true,
                noempty: true,
                nonew: true,
                quotmark: 'single',
                undef: true,
                unused: true,
                strict: true,
                trailing: true,
                eqnull: true,
                es5: true,
                browser: true,
                devel: true,
                jquery: true,
                node: true,
                predef: ['seajs', 'define'],
                white: false
            }
        },
        watch: {
            tpl: {
                files: ['../src/tpl/*.tpl'],
                tasks: ['tpl']
            }
        },
        tpl: {
            options: {
                base: '../src/tpl'
            },
            tpl: {
                src: ['../src/tpl/*.tpl'],
                dest: '../src/js/tpl'
            }
        },
        cmd: {
            options: {
                base: '../src/',
                shim: {}
            },
            all: {
                src: [
                    '../src/js/**/*.js'
                ],
                dest: '../src/compiled'
            }
        },
        pack: {
            css: {
                type: 'css',
                src: [
                    '<%= meta.banner %>',
                    '../src/css/reset.css',
                    '../src/css/main.css',
                    '../src/css/style.css'
                ],
                dest: '<%= cmd.all.dest %>/../dist/style.min.css'
            },
            app: {
                type: 'js',
                options: {
                    base: '<%= cmd.all.dest %>'
                },
                src: [
                    '<%= meta.banner %>',
                    '<%= cmd.all.dest %>/base/*.js',
                    '<%= cmd.all.dest %>/component/*.js',
                    '<%= cmd.all.dest %>/lib/*.js',
                    '<%= cmd.all.dest %>/seajs/sea.js',
                    '<%= cmd.all.dest %>/*.js'
                ],
                ignore: [
                    '<%= cmd.all.dest %>/seajs/*.js'
                ],
                dest: '<%= cmd.all.dest %>/../dist/component.min.js'
            }
        },
        server: {
            publicDir: '../',
            staticMapping: {
                '/': '../'
            },
            // testPath: '/test',
            port: 5002,
            debug: true
        }
    });

    grunt.loadTasks('tasks');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // public tasks
    grunt.registerTask('test', ['jshint', 'server:noasync', 'qunit']);
    grunt.registerTask('build', ['cmd', 'pack']);
    grunt.registerTask('default', ['server']);
};
