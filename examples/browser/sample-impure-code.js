(function () {
    'use strict';

    function FunkyVector(length) {
        this.numbers = [];

        var i = 0;
        while (i < length) {
            this.numbers.push(i);
            i++;
        }
    }

    FunkyVector.prototype.square = function () {
        for (var i = 0; i < this.numbers.length; i++) {
            this.numbers[i] *= this.numbers[i];
        }
    };

    window.FunkyVector = FunkyVector;
})();