'use strict';

var MESSAGES = {
	vars: 'Var declaration',
	assigments: 'Assignment',
	updates: 'Update statement',
	fors: 'For statement',
	forIns: 'For-in statement',
	whiles: 'While loop',
	doWhiles: 'Do-while loop',
	arrayMethods: 'Array mutator'
};

var stringifyStats = function (files) {
	var stringedStats = files.reduce(function (prev, file) {
		return prev + Object.keys(file.stats).reduce(function (prev, key) {
			var entries = file.stats[key];
			return prev + entries.reduce(function (prev, entry) {
				return prev +
					file.path + ': ' +
					'line ' + entry.line + ', col ' + entry.column + ', ' + MESSAGES[key] + '.\n';
			}, '');
		}, '') + '\n';
	}, '');

	var count = files.reduce(function (prev, file) {
		return prev + Object.keys(file.stats).reduce(function (prev, key) {
			var entries = file.stats[key];
			return prev + entries.length;
		}, 0);
	}, 0);

	return stringedStats + count + ' errors';
};

exports.print = function (files, options) {
	console.log(stringifyStats(files, options));
};