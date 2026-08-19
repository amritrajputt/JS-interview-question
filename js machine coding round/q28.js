//medium — Implement curring using bind
// function multiply(x,y){  console.log(x*y);
// }
// const multiplyBy2 = multiply.bind(this,2)
// multiplyBy2(3)

// curry using closure
function multiplyByClosure(b){
    // let first = a
    return function(a){
        console.log(a*b)
    }
}

const c = multiplyByClosure(2)
c(5)