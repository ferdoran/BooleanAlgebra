module.exports = function(grunt) {
  var banner = '/*! <%= pkg.name %> - v<%= pkg.version %> - \n' +
    ' (c) <%= pkg.author %> - \n'+
    ' <%= pkg.repository.url %> - \n' +
    ' <%= grunt.template.today("yyyy-mm-dd") %> */\n',
    minBanner = banner.replace(/\n/g, '') + '\n';

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    minBanner: minBanner,

    recess: {
      options: {
        compile: true
      },

      slider: {
        src: ['app/rzslider.less'],
        dest: 'dist/rzslider.css'
      },

      min: {
        options: {
          compress: true,
          banner: '<%= minBanner %>'
        },
        src: ['dist/rzslider.css'],
        dest: 'dist/rzslider.min.css'
      }
    },

    uglify: {
      options: {
        report: 'min',
        banner: '<%= minBanner %>'
      },
      rzslider: {
        files: {
          'dist/rzslider.min.js': [
            'dist/rzslider.js'
          ]
        }
      }
    },

    ngtemplates: {
      app: {
        src: 'app/**.html',
        dest: 'temp/templates.js',
        options: {
          htmlmin: {
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            removeComments: true, // Only if you don't use comment directives!
            removeEmptyAttributes: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true
          },
          module: 'rzModule',
          url: function(url) {
            return url.replace('app/', '');
          },
          bootstrap: function(module, script) {
            return 'module.run(function($templateCache) {\n' + script + '\n});';
          }
        }
      }
    },

    replace: {
      dist: {
        options: {
          patterns: [{
            match: /\/\*templateReplacement\*\//,
            replacement: '<%= grunt.file.read("temp/templates.js") %>'
          }]
        },
        files: [{
          expand: true,
          flatten: true,
          src: ['app/rzslider.js'],
          dest: 'dist/'
        }]
      }
    },

    concat: {
      options: {
        stripBanners: true,
        banner: banner
      },
      js: {
        src: ['dist/rzslider.js'],
        dest: 'dist/rzslider.js'
      },
      css: {
        src: ['dist/rzslider.css'],
        dest: 'dist/rzslider.css'
      }
    },

    ngAnnotate: {
      options: {
        singleQuotes: true
      },
      rzslider: {
        files: [{
          'dist/rzslider.js': 'dist/rzslider.js'
        }, {
          expand: true,
          src: ['dist/rzslider.js']
        }]
      }
    },
    watch: {
      all: {
        files: ['dist/*', 'demo/*'],
        options: {
          livereload: true
        }
      },
      js: {
        files: ['app/*.js', 'app/*.html'],
        tasks: ['js']
      },
      less: {
        files: ['app/*.less'],
        tasks: ['css']
      },
      test: {
        files: ['app/*.js', 'tests/specs/**/*.js'],
        tasks: ['test']
      }
    },
    serve: {
      options: {
        port: 9000
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-serve');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('default', ['css', 'js']);
  grunt.registerTask('test', ['karma']);

  grunt.registerTask('css', ['recess','concat:css']);
  grunt.registerTask('js', ['ngtemplates', 'replace','concat:js', 'ngAnnotate', 'uglify']);
};