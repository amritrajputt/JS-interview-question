//sum(10)(20)(20)(20)() op:-70

let sum = function (a){
    return function(b){
        if(b){
             return sum(a+b)
        }
            return a
    }
}

console.log(sum(3)(4)(4)())

// 2 arg ke baad sum hi a ho ja rha hai