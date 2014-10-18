'use strict';

var fs = require('fs');
var esprima = require('esprima');
var estraverse = require('estraverse');

var simpleReporter = require('./simple-reporter');



var measure = function (tree, options) {
	options = options || {};

	var ARRAY_MUTATORS = ['push', 'pop', 'shift', 'unshift', 'splice', 'reverse', 'sort'];

	var counter = {
		vars: [],
		assigments: [],
		updates: [],
		fors: [],
		forIns: [],
		whiles: [],
		doWhiles: [],
		arrayMethods: []
	};

	estraverse.traverse(tree, {
		enter: function (node, parent) {
			// mutators and loops
			if (node.type === 'AssignmentExpression') {
				counter.assigments.push(node.loc.start);
			} else if (node.type === 'UpdateExpression') {
				counter.updates.push(node.loc.start);
			} else if (node.type === 'ForStatement') {
				counter.fors.push(node.loc.start);
			} else if (node.type === 'ForInStatement') {
				counter.forIns.push(node.loc.start);
			} else if (node.type === 'WhileStatement') {
				counter.whiles.push(node.loc.start);
			} else if (node.type === 'DoWhileStatement') {
				counter.doWhiles.push(node.loc.start);
			}

			// vars are not evil, but consts are nicer
			if (!options.allowVar &&
				node.type === 'VariableDeclaration' &&
				node.kind === 'var') {
				Array.prototype.push.apply(
					counter.vars,
					node.declarations.map(function (declaration) {
						return declaration.loc.start;
					})
				);
			}

			// speculative, will give false positives
			if (options.disallowArray &&
				node.type === 'MemberExpression' &&
				node.property.type === 'Identifier' &&
				ARRAY_MUTATORS.indexOf(node.property.name) !== -1) {
				counter.arrayMethods.push(node.property.loc.start);
			}
		}
	});

	return counter;
};


var processArguments = function (args) {
	var exit = function () {
		console.log('Usage: node purehint.js [--allowVar] [--disallowArray] <file>');
		process.exit(1);
	};

	if (args.length < 3 || args.length > 6) {
		exit();
	}

	var options = {
		allowVar: args.indexOf('--allowVar') !== -1,
		disallowArray: args.indexOf('--disallowArray') !== -1
	};

	return {
		path: args[args.length - 1],
		options: options
	};
};



var args = processArguments(process.argv);
var code = fs.readFileSync(args.path, 'utf8');
var tree = esprima.parse(code, { loc: true });
var stats = measure(tree, args.options);
simpleReporter.print([{ path: args.path, stats: stats }], args.options);