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


var processArguments = function (allArgs) {
	var exit = function () {
		console.log('Usage: node purehint.js [--allowVar] [--disallowArray] <file>');
		process.exit(1);
	};

	var args = allArgs.slice(2);

	if (args.length < 1) {
		exit();
	}

	var optionArray = args.filter(function (option) {
		return option.indexOf('--') === 0;
	});

	var pathArray = args.filter(function (option) {
		return option.indexOf('--') !== 0;
	});

	var options = {
		allowVar: optionArray.indexOf('--allowVar') !== -1,
		disallowArray: optionArray.indexOf('--disallowArray') !== -1
	};

	return {
		paths: pathArray,
		options: options
	};
};



var args = processArguments(process.argv);

var stats = args.paths.map(function (path) {
	var code = fs.readFileSync(path, 'utf8');
	var tree = esprima.parse(code, { loc: true });
	return {
		path: path,
		stats: measure(tree, args.options)
	};
});

simpleReporter.print(stats, args.options);