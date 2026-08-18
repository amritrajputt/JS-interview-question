// Medium — Write a function curry(fn) that curries any given function, e.g. curry(add)(1)(2)(3) and curry(add)(1,2)(3).
function curry(fn) {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn(...args);
        }

        return function (...nextArgs) {
            const allArgs = [...args, ...nextArgs];

            if (allArgs.length >= fn.length) {
                return fn(...allArgs);
            }

            return curried(...allArgs);
        };
    };
}
funcall = curry(function (a, b, c) {
    return a + b + c;
});
console.log(funcall(1, 2, 3)); // 6