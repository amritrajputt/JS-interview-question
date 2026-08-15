//Easy — Write a function makeCounter() 
// that returns an object with increment(), decrement(), and getValue() methods, 
// using closures.

function makeCounter() {
    let count = 0;
    return {
        increment: function () {
            return ++count
        },
        decrement: function () {
            if(count == 0) return 0
            return --count
        },
        getValue: function () {
            return count
        }
    }
}

const counter = makeCounter();

console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.increment()); // 3
console.log(counter.decrement()); // 2
console.log(counter.getValue());  // 2