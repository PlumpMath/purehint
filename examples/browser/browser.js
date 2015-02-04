'use strict';

var measure = require('../../src/measure').measure;

angular.module('Purehint', [])
.controller('PurehintController', ['$scope', function ($scope) {
    this.options = {
        allowVar: false,
        disallowArray: false,
        disallowPrototype: false,
        disallowExports: false,
        disallowWindow: false
    };

    this.stats = {
        vars: 0,
        assignments: 0,
        updates: 0,
        fors: 0,
        forIns: 0,
        whiles: 0,
        doWhiles: 0,
        arrayMethods: 0
    };

    this.reflow = function () {
        onChange(editor.getValue());
    };

    var instance = this;

    var editor;

    var MESSAGES = {
        vars: function (declaration) {
            return "'" + declaration.id.name + "' variable declaration";
        },
        assignments: function (node) {
            return "'" + node.operator + "' assignment";
        },
        updates: function (node) {
            return "'" + node.operator + "' update statement";
        },
        fors: function () {
            return 'For statement';
        },
        forIns: function () {
            return 'For-in statement';
        },
        whiles: function () {
            return 'While loop';
        },
        doWhiles: function () {
            return 'Do-while loop';
        },
        arrayMethods: function (property) {
            return "'" + property.name + "' possible array mutator";
        }
    };

    function onChange(source) {
        var results;

        try {
            results = measure(source, instance.options);
        } catch (ex) {
            editor.getSession().setAnnotations([{
                row: ex.lineNumber - 1,
                text: ex.message,
                type: 'error'
            }]);
            results = null;
        }

        if (results) {
            var annotations = [];
            Object.keys(results).forEach(function (type) {
                if (MESSAGES[type]) {
                    Array.prototype.push.apply(annotations, results[type].map(function (node) {
                        return {
                            row: node.loc.start.line - 1,
                            text: MESSAGES[type](node),
                            type: 'warning'
                        };
                    }));
                }

                instance.stats[type] = results[type].length;
            });
            editor.getSession().setAnnotations(annotations);

            if (!$scope.$$phase) {
                $scope.$apply();
            }
        }
    }

    function setupEditor() {
        editor = ace.edit('editor');
        editor.setFontSize(16);
        editor.getSession().setMode('ace/mode/javascript');
        editor.setTheme('ace/theme/monokai');
        editor.on('input', function () {
            onChange(editor.getValue());
        });
        editor.getSession().setUseWorker(false);
    }

    setupEditor();

}]);