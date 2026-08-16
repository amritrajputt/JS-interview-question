// Write a generator function range(start, end, step) that lazily yields numbers in a range.

function* range(start, end, step) {
    while (start <= end) {
        yield start;
        start += step;
    }
}
const gen = range(1, 5, 1);

console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: 4, done: false }
console.log(gen.next()); // { value: 5, done: false }
console.log(gen.next()); // { value: undefined, done: true }