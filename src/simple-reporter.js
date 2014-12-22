'use strict';

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

var stringifyStats = function (files, options) {
	if (!options.statsOnly) {
		var stringedStats = files.reduce(function (prev, file) {
			return prev + Object.keys(file.stats).reduce(function (prev, key) {
					var entries = file.stats[key];
					return prev + entries.reduce(function (prev, entry) {
							return prev +
								file.path + ': ' +
								'line ' + entry.loc.start.line +
								', col ' + entry.loc.start.column +
								', ' + MESSAGES[key](entry) + '.\n';
						}, '');
				}, '') + '\n';
		}, '');
	}

	var count = files.reduce(function (prev, file) {
		return prev + Object.keys(file.stats).reduce(function (prev, key) {
			var entries = file.stats[key];
			return prev + entries.length;
		}, 0);
	}, 0);

	if (options.statsOnly) {
		return count + ' errors';
	} else {
		return stringedStats + count + ' errors';
	}
};

module.exports.print = function (files, options) {
	console.log(stringifyStats(files, options));
};