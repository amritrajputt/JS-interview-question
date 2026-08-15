//Implement a rate limiter / debounce function debounce(fn, delay) using closures.

function debounce(fn, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    }
}