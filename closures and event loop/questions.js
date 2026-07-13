
function outer(){
    let count = 0;
    return function inner(){
        count++;
        return count;
    }
    
}




const counter1 = outer();
const counter2 = outer();
console.log(counter1(), counter1(), counter2());

for (var i = 0; i < 5; i++) {
  setTimeout(function() {
    console.log(i);
  }, 0);
}





for (var i = 0; i < 5; i++) {
  (function(j) {
    setTimeout(function() {
      console.log(j);
    }, 0);
  })(i);
}





console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");




console.log("1");

setTimeout(() => console.log("2"), 0);

Promise.resolve().then(() => console.log("3"));

Promise.resolve().then(() => console.log("4"));

console.log("5");





console.log("A");

setTimeout(() => console.log("B"), 0);

Promise.resolve().then(() => {
  console.log("C");
  return Promise.resolve();
}).then(() => {
  console.log("D");
});

console.log("E");




async function test() {
  console.log("1");
  await new Promise((resolve) => setTimeout(resolve, 0));
  console.log("2");
}

console.log("3");
test();
console.log("4");



console.log("X");

setTimeout(() => console.log("Y - 10ms"), 10);
setTimeout(() => console.log("Z - 0ms"), 0);

Promise.resolve().then(() => console.log("W - microtask"));

console.log("V");




console.log("start");

setTimeout(() => {
  console.log("timeout 1");
  Promise.resolve().then(() => console.log("microtask inside timeout"));
}, 0);

Promise.resolve().then(() => {
  console.log("microtask 1");
  setTimeout(() => console.log("timeout inside microtask"), 0);
});

console.log("end");





console.log("1");

setTimeout(() => console.log("2"), 0);

Promise.resolve()
  .then(() => console.log("3"))
  .then(() => console.log("4"))
  .then(() => console.log("5"));

console.log("6");



async function process() {
  for (let i = 0; i < 3; i++) {
    await new Promise((resolve) => setTimeout(resolve, 0));
    console.log(i);
  }
}
console.log("start");
process();
console.log("end");



async function a() {
  console.log("a1");
  await null;
  console.log("a2");
}
async function b() {
  console.log("b1");
  await null;
  console.log("b2");
}
console.log("start");
a();
b();
console.log("end");




console.log("1");

Promise.resolve()
  .then(() => {
    console.log("2");
    return 42;               // not a promise
  })
  .then((val) => {
    console.log("3", val);
    return new Promise((resolve) => {
      setTimeout(() => resolve("resolved value"), 0);   // returns a promise wrapping a setTimeout
    });
  })
  .then((val) => console.log("4", val));

setTimeout(() => console.log("5"), 0);

console.log("6");






const funcs = [];
for (let i = 0; i < 3; i++) {
  funcs.push(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
    return i;
  });
}

Promise.all(funcs.map((fn) => fn())).then((results) => console.log(results));
console.log("sync line");





console.log("A");

setTimeout(() => {
  console.log("B");
  Promise.resolve().then(() => console.log("C"));
}, 0);

new Promise((resolve) => {
  console.log("D");
  resolve();
}).then(() => {
  console.log("E");
  setTimeout(() => console.log("F"), 0);
});

console.log("G");