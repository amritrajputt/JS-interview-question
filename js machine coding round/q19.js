//Implement a custom iterator for an array of strings using the Iterator protocol (next() method) — no generators.
const arr = ["amrit", "raj", "singh"]

function createIterator(arr) {
    let ind = 0
    return {
        next: function () {
            if (ind < arr.length) return { value: arr[ind++], done: false };
            return { value: undefined, done: true };
        }
    }
}

const str = createIterator(arr)
console.log('====================================');
console.log(str.next());
console.log(str.next());
console.log(str.next());
console.log(str.next());
console.log('====================================');

//Implement the same using a generator function (function* and yield).

function* generator(arr){
    let ind = 0
     while (ind < arr.length) {
        yield arr[ind++];
    }
}
const str2 = generator(arr)
console.log('====================================');
console.log(str2.next().value);
console.log(str2.next().value);
console.log(str2.next().value);
console.log('====================================');