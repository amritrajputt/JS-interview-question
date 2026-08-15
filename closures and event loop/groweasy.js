// Given an array of strings, implement an iterator/generator such that calling next() repeatedly
// returns one string at a time from the array, in order. After all strings are exhausted,
// next() should indicate that iteration is done (e.g., return undefined or {done: true}).

function* createIterator(arr) {
    for (let item of arr) {
        yield item;
    }
}


const arr = ["Amrit", "Singh", "Rajput"]
// const iterator = createIterator(arr);

// console.log(iterator.next().value)
// console.log(iterator.next().value)
// console.log(iterator.next().value)
// console.log(iterator.next().done)


// method2:-

function createIterator2(arr) {
    let ind = 0
    return {
        next: () => {
            if (ind < arr.length) {
                return { value: arr[ind++], done: false };
            }
            return { value: undefined, done: true };
        }
    }
}
const iterator = createIterator2(["apple", "banana", "cherry"]);
console.log(iterator.next()); // { value: 'apple', done: false }
console.log(iterator.next()); // { value: 'banana', done: false }
console.log(iterator.next()); // { value: 'cherry', done: false }
console.log(iterator.next()); // { value: undefined, done: true }