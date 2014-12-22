var measure = require('../../src/measure').measure;

describe('measure', function () {
    describe('assignments', function () {
        it('collects assignments', function () {
            var code = 'a = 123;';
            var counter = measure(code);
            expect(counter.assignments.length).toEqual(1);
        });
    });

    describe('prototypes', function () {
        it('ignores assignments to prototype members', function () {
            var code = 'function A() {} A.prototype.a = function () {};';
            var counter = measure(code, { disallowPrototype: false });
            expect(counter.assignments.length).toEqual(0);
        });

        it('ignores assignments to prototype', function () {
            var code = 'function A() {} A.prototype = { a: function () {} };';
            var counter = measure(code, { disallowPrototype: false });
            expect(counter.assignments.length).toEqual(0);
        });

        it('collects assignments to prototype members', function () {
            var code = 'function A() {} A.prototype.a = function () {};';
            var counter = measure(code, { disallowPrototype: true });
            expect(counter.assignments.length).toEqual(1);
        });

        it('collects assignments to prototype', function () {
            var code = 'function A() {} A.prototype = { a: function () {} };';
            var counter = measure(code, { disallowPrototype: true });
            expect(counter.assignments.length).toEqual(1);
        });
    });

    describe('exports', function () {
        it('ignores assignments to exports members', function () {
            var code = 'module.exports.a = function () {};';
            var counter = measure(code, { disallowExports: false });
            expect(counter.assignments.length).toEqual(0);
        });

        it('ignores assignments to exports', function () {
            var code = 'module.exports = { a: function () {} };';
            var counter = measure(code, { disallowExports: false });
            expect(counter.assignments.length).toEqual(0);
        });

        it('collects assignments to exports members', function () {
            var code = 'module.exports.a = function () {};';
            var counter = measure(code, { disallowExports: true });
            expect(counter.assignments.length).toEqual(1);
        });

        it('collects assignments to exports', function () {
            var code = 'module.exports = { a: function () {} };';
            var counter = measure(code, { disallowExports: true });
            expect(counter.assignments.length).toEqual(1);
        });
    });
});