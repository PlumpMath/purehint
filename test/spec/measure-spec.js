var measure = require('../../src/measure').measure;

describe('measure', function () {
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

        it('remembers assignments to prototype members', function () {
            var code = 'function A() {} A.prototype.a = function () {};';
            var counter = measure(code, { disallowPrototype: true });
            expect(counter.assignments.length).toEqual(1);
        });

        it('remembers assignments to prototype', function () {
            var code = 'function A() {} A.prototype = { a: function () {} };';
            var counter = measure(code, { disallowPrototype: true });
            expect(counter.assignments.length).toEqual(1);
        });
    });
});