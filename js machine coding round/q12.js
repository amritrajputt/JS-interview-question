// Hard — Implement throttle(fn, limit) using closures. Explain the difference from debounce with a real-world example.

function throttle(fn, limit) {
    let waiting = false;

    return function (...args) {
        if (!waiting) {
            fn.apply(this, args);
            waiting = true;

            setTimeout(() => {
                waiting = false;
            }, limit);
        }
    };
}