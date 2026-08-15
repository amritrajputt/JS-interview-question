// Medium — What is the Temporal Dead Zone? Write code demonstrating it with let/const.

// let/const are hoisted too, but they remain uninitialized until execution reaches their declaration.
//  That uninitialized period is the Temporal Dead Zone.
console.log(a)
let a = 5