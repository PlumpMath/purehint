'use strict';

var fs = require('fs');
var glob = require('glob');

var measure = require('./measure').measure;
var simpleReporter = require('./simple-reporter');


var processArguments = function (allArgs) {
	var exit = function () {
		console.log(
			'Usage: node purehint.js ' +
			'[--allow-var] ' +
			'[--disallow-array] ' +
			'[--disallow-prototype] ' +
			'[--stats-only] ' +
			'<file1> <file2> ...'
		);
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
		allowVar: optionArray.indexOf('--allow-var') !== -1,
		disallowArray: optionArray.indexOf('--disallow-array') !== -1,
		disallowPrototype: optionArray.indexOf('--disallow-prototype') !== -1,
		statsOnly: optionArray.indexOf('--stats-only') !== -1
	};

	return {
		paths: pathArray,
		options: options
	};
};


var args = processArguments(process.argv);

var files = [];

args.paths.forEach(function (pattern) {
	Array.prototype.push.apply(files, glob.sync(pattern));
});

var stats = files.map(function (path) {
	var code = fs.readFileSync(path, 'utf8');

	return {
		path: path,
		stats: measure(code, args.options)
	};
});

simpleReporter.print(stats, args.options);