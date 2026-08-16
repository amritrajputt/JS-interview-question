// Implement an infinite generator for the Fibonacci sequence, and write a helper take(generator, n) to get the first n values.
function* generator(n) {
    let a = 0
    let b = 1
    while (true) {
        yield a;

        let next = a + b;
        a = b;
        b = next
    }
}

function take(gen, n) {
    const result = [];

    for (let i = 0; i < n; i++) {
        result.push(gen.next().value);
    }

    return result;
}
console.log(take(generator(), 10))