Array.prototype.customFlatMap = function (callback) {
    let result = [];

    for (let i = 0; i < this.length; i++) {
        let value = callback(this[i], i, this);

        if (Array.isArray(value)) {
            result.push(...value);
        } else {
            result.push(value);
        }
    }

    return result;
};