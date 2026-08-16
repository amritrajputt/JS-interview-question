// Implement a function to deeply merge two objects, handling nested objects and arrays.

function deepMerge(obj1, obj2) {
    if (obj1 === null && obj2 === null) return null;
    if (obj1 === null) return obj2;
    if (obj2 === null) return obj1;

    const newObj = {};

    const keys = new Set([
        ...Object.keys(obj1),
        ...Object.keys(obj2)
    ]); //union of keys

    for (const key of keys) {
        const val1 = obj1[key];
        const val2 = obj2[key];

        // Key only in obj1
        if (!(key in obj2)) {
            newObj[key] = val1;
        }

        // Key only in obj2
        else if (!(key in obj1)) {
            newObj[key] = val2;
        }

        // Key in both, and both values are objects
        else if (
            typeof val1 === "object" &&
            val1 !== null &&
            !Array.isArray(val1) &&
            typeof val2 === "object" &&
            val2 !== null &&
            !Array.isArray(val2)
        ) {
            newObj[key] = deepMerge(val1, val2);
        }

        // this is simplest case if both have same key but different value then keep 2nd one ex obj1.age = 21 and obj2.age =22 then keep 22
        else {
            newObj[key] = val2;
        }
    }

    return newObj;
}