// Implement Array.prototype.myMap, myFilter, and myReduce from scratch.

Array.prototype.myMap = function (callBack) {
    const res = []
    for (let i = 0; i < this.length; i++) {
        res.push(callBack(this[i], i, this))
    }
    return res
}

console.log([1, 2, 3].myMap(x => x * 2))


Array.prototype.myFilter = function (callBack) {
    const filtered = []
    for (let i = 0; i < this.length; i++) {
        if (callBack(this[i], i, this))
            filtered.push((this[i]))
    }
    return filtered
}
console.log([1, 2, 3].myFilter(x => x % 2 === 0))


Array.prototype.myReduce = function (callBack, initialValue) {
    let accumulator = initialValue;
    for (let i = 0; i < this.length; i++) {
        accumulator = callBack(accumulator, this[i], i, this)
    }
    return accumulator
}