// Hard — Explain and demonstrate the difference between block scope,
//  function scope, and module scope with a code example for each.



// block scope:
{
    let a = 10;
    const b = 20;

    console.log(a); // 10
    console.log(b); // 20
}

//function scope:
function test() {
    var x = 10;

    if (true) {
        var y = 20;
    }

    console.log(x); // 10
    console.log(y); // 20
}

test();

console.log(x); // ReferenceError


// focus: x is defined with var but op is reference error but we have studeied that var return undefined then here
// why it is returning ReferenceError


// reason:

// var can return undefined because of hoisting,
//  but only if the variable exists in the scope where we are accessing it.
//  If the variable doesn't exist in that scope, JavaScript throws a ReferenceError.