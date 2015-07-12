/*jslint node:true */

module.exports = function(grunt) {

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
      }
    },
    jasmine_nodejs: {
        options: {
            specNameSuffix: "Spec.js",
            helperNameSuffix: "Helper.js",
            useHelpers: false,
            stopOnFailure: false,
            reporters: {
                console: {
                    colors: true,
                    cleanStack: 1,       // (0|false)|(1|true)|2|3
                    verbosity: 4,        // (0|false)|1|2|3|(4|true)
                    listStyle: "indent", // "flat"|"indent"
                    activity: false
                },
            }
        },
        specs: ['tests/server/**']
    },
    jshint: {
      options: {
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
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
          tasks: ['jshint:server', 'jasmine_nodejs']
        }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-jasmine-nodejs');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('build', ['jshint', 'karma', 'concat', 'uglify']);

  grunt.registerTask('public_tests', ['karma:unit:start', 'watch:public']);
  grunt.registerTask('server_tests', ['watch:server']);

};
