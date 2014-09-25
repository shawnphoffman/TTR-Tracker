module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    cssmin: {
      minify: {
        expand: true,
        cwd: 'css/',
        src: ['*.css', '!*.min.css', 'fonts/fonts.css'],
        dest: 'css/min/',
        ext: '.min.css',
        flatten: true
      },
      combine: {
        files: {
          'css/ttr-final.min.css': ['css/dist/framework7.min.css', 'css/min/ttr.min.css','css/min/fonts.min.css']
        }
      }
    },
    jshint:{
      all: ['js/models/**/*.js','js/static/**/*.js','js/views/**/*.js','js/req.js']
    },
    shell: {
      buildRequire: {
        options: {
          stderr: false
        },
        command: 'node ../r.js -o ../r-build.js'
      }
    },
    complexity: {
        all: {
            src: ['Gruntfile.js', 'js/models/*.js', 'js/views/*.js', 'req.js'],
            options: {
                breakOnErrors: false,
                errorsOnly: false,
                cyclomatic: [3, 7, 12],
                maintainability: 80,
                hideComplexFunctions: false
            }
        }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-remove-logging');
  grunt.loadNpmTasks('grunt-complexity');

  grunt.registerTask('default', ['cssmin', 'jshint', 'complexity']);
  grunt.registerTask('release', ['cssmin', 'jshint', 'complexity', 'shell']);

}
