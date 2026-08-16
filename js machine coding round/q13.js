// Flatten a nested array without using Array.prototype.flat()
const arr = [[1, 2, 3], 2, 3, [3, 45, 56, [12, 45, 6, 7]], 45]

function flatArray(arr) {
    const res = []
    arr.map((elem, _ ) => {
        if (Array.isArray(elem)) res.push(...flatArray(elem));
        else res.push(elem)
    })
    return res
}
console.log(flatArray(arr))
