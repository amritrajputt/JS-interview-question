// Medium — Implement a memoize(fn) function that caches results of expensive function calls.


function memoize(fn) {
    const cache = new Map()
    return function(...args) {
        const key = JSON.stringify(args)
        if(cache.has(key)){
            return cache.get(key);
        }
        const result = fn(...args);
        cache.set(key, result);

        return result
    }
    
}

function slowAdd(a, b) {
    console.log("Calculating...");
    return a + b;
}

const add = memoize(slowAdd);

console.log(add(2, 3)); // Calculating... → 5
console.log(add(2, 3)); // 5
console.log(add(2, 3)); // 5

console.log(add(4, 5)); // Calculating... → 9