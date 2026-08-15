// Medium — Implement a function once(fn) that ensures fn can only be called once; subsequent calls return the first result.
function once(fn) {
    let called = false;
    let result;

    return function () {
        if (!called) {
            result = fn();
            called = true;
        }

        return result;
    };
}