// Deep clone an object without using JSON.parse(JSON.stringify()) or libraries. Handle nested objects/arrays.
const obj = {
    name: "amrit",
    education: {
        clg: "aimt",
        degree: {
            current: "btech final yr",
        }
    }
}

const ans = { ...obj } //shallow copy
const ans2 = structuredClone(obj) //deep copy
console.log(ans);
console.log(ans2)


// raw solution:

function deepClone(value) {
    if (value === null || typeof value !== "object") {
        return value;
    }
    if (Array.isArray(value)) {
        const array = []
        for (let item of value) {
            array.push(deepClone(item))
        }
    }
    const newObj = {}
    for (let key in value) {
        newObj[key] = deepClone(value[key])
    }
    return newObj
}
const cloneObject =deepClone(obj)

console.log(cloneObject)