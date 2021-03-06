/*jslint node:true */

module.exports = function(grunt) {

    var serverTest = [
        'jshint:server',
        'jasmine_nodejs:server'
    ];

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['public/js/**/*.js'],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },
        karma: {
            unit: {
                configFile: 'tests/karma_public.js',
                background: true,
                singleRun: false
            },
            single: {
                configFile: 'tests/karma_public.js',
                singleRun: true
            }
        },
        jasmine_nodejs: {
            options: {
            },
            server: {
                specs: ['tests/server/**']
            }
        },
        jshint: {
            options: {
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true
                },
                esversion: 6
            },
            public: {
                src: ['Gruntfile.js', 'public/js/**/*.js', 'tests/karma_public.js', 'tests/public/**/*.js']
            },
            server: {
                src: ['Gruntfile.js', 'server/**/*.js', 'tests/server/**/*.js']
            }
        },
        watch: {
            public: {
                files: ['<%= jshint.public.src %>'],
                tasks: ['jshint:public', 'karma:unit:run']
            },
            server: {
                files: ['<%= jshint.server.src %>'],
                tasks: serverTest
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-jasmine-nodejs');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('build', ['jshint', 'karma:single', 'concat', 'uglify']);

    grunt.registerTask('watch_public_tests', ['karma:unit:start', 'watch:public']);
    grunt.registerTask('watch_server_tests', ['watch:server']);
    grunt.registerTask('public_test', ['jshint:public', 'karma:single']);
    grunt.registerTask('server_test', serverTest);

};
