module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        'shell': {
            'jasmine': {
                command: 'node_modules/jasmine-node/bin/jasmine-node test/spec'
            }
        }
    });

    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('test', ['shell:jasmine']);
};