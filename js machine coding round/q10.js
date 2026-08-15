// Medium — Implement a private counter module (module pattern) with increment, reset, and getCount,
//  where count is not accessible from outside.

const Counter = (function () {
    let count = 0;

    return {
        increment() {
            count++;
        },

        reset() {
            count = 0;
        },

        getCount() {
            return count;
        }
    };
})();

export { Counter };

//method 2:

function createCounter() {
    let count = 0;

    return {
        increment() {
            count++;
        },
        reset() {
            count = 0;
        },
        getCount() {
            return count;
        }
    };
}