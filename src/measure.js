'use strict';

var esprima = require('esprima');
var estraverse = require('estraverse');

var measureTree = function (tree, options) {
    options = options || {};

    var ARRAY_MUTATORS = ['push', 'pop', 'shift', 'unshift', 'splice', 'reverse', 'sort'];

    var counter = {
        vars: [],
        assignments: [],
        updates: [],
        fors: [],
        forIns: [],
        whiles: [],
        doWhiles: [],
        arrayMethods: []
    };


    var isMemberAssignment = function (member) {
        return function (node) {
            if (node.operator !== '=') { return false; }
            var left = node.left;

            if (left.type !== 'MemberExpression') { return false; }
            var object = left.object, property = left.property;

            return (property.type === 'Identifier' && property.name === member) ||
                (object.type === 'MemberExpression' &&
                object.property.type === 'Identifier' &&
                object.property.name === member);
        };
    };

    var isPrototypeAssignment = isMemberAssignment('prototype');
    var isExportsAssignment = isMemberAssignment('exports');

    estraverse.traverse(tree, {
        enter: function (node, parent) {
            // mutators and loops
            if (node.type === 'AssignmentExpression') {
                var isPrototype = isPrototypeAssignment(node);
                var isExports = isExportsAssignment(node);

                if ((!isExports && !isPrototype) ||
                    (options.disallowPrototype && isPrototype) ||
                    (options.disallowExports && isExports)) {
                    counter.assignments.push(node);
                }
            } else if (node.type === 'UpdateExpression') {
                counter.updates.push(node);
            } else if (node.type === 'ForStatement') {
                counter.fors.push(node);
            } else if (node.type === 'ForInStatement') {
                counter.forIns.push(node);
            } else if (node.type === 'WhileStatement') {
                counter.whiles.push(node);
            } else if (node.type === 'DoWhileStatement') {
                counter.doWhiles.push(node);
            }

            // vars are not evil, but consts are nicer
            if (!options.allowVar &&
                node.type === 'VariableDeclaration' &&
                node.kind === 'var') {
                Array.prototype.push.apply(counter.vars, node.declarations);
            }

            // speculative, will give false positives
            if (options.disallowArray &&
                node.type === 'MemberExpression' &&
                node.property.type === 'Identifier' &&
                ARRAY_MUTATORS.indexOf(node.property.name) !== -1) {
                counter.arrayMethods.push(node.property);
            }
        }
    });

    return counter;
};

var measure = function (code, options) {
    var tree = esprima.parse(code, { loc: true });
    return measureTree(tree, options);
};

module.exports.measureTree = measureTree;
module.exports.measure = measure;