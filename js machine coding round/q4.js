function foo() {
    console.log(this); // this point to global object (window in browser)
}

const obj = { foo };
const bar = obj.foo;
bar(); //  return global object
foo(); // return global object
obj.foo(); // { foo: [Function: foo] }