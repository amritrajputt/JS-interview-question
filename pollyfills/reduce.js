Array.prototype.customReduce = function (callback, initialValue) {
    let accumulator = initialValue;
    let start = 0;

    if (accumulator === undefined) {
        accumulator = this[0];
        start = 1;
    }

    for (let i = start; i < this.length; i++) {
        accumulator = callback(accumulator, this[i], i, this);
    }

    return accumulator;
};