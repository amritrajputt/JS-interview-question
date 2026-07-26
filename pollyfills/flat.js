Array.prototype.customFlat = function (depth = 1) {
    let result = [];

    function flatten(arr, depth) {
        for (let item of arr) {
            if (Array.isArray(item) && depth > 0) {
                flatten(item, depth - 1);
            } else {
                result.push(item);
            }
        }
    }

    flatten(this, depth);

    return result;
};