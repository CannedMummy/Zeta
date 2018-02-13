module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        autoprefixer: grunt.file.readJSON('./grunt_config/autoprefixer.json'),
        coffee: grunt.file.readJSON('./grunt_config/coffee.json'),
        concat: grunt.file.readJSON('./grunt_config/concat.json'),
        csscomb: grunt.file.readJSON('./grunt_config/csscomb.json'),
        cssmin: grunt.file.readJSON('./grunt_config/cssmin.json'),
        less: grunt.file.readJSON('./grunt_config/less.json'),
        ngAnnotate: grunt.file.readJSON('./grunt_config/ngAnnotate.json'),
        uglify: grunt.file.readJSON('./grunt_config/uglify.json'),
        watch: grunt.file.readJSON('./grunt_config/watch.json')
    });

    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-csscomb');
    grunt.loadNpmTasks('grunt-ng-annotate');

    grunt.registerTask('default', ['autoprefixer', 'csscomb:less', 'less', 'cssmin', 'coffee', 'ngAnnotate', 'concat', 'uglify']);

    grunt.registerTask('compile-less', ['autoprefixer', 'csscomb', 'less', 'cssmin']);
    grunt.registerTask('compile-css', ['autoprefixer', 'cssmin']);
}