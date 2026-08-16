//Implement a deep equality checker isDeepEqual(obj1, obj2).
function isDeepEqual(obj1, obj2) {
    if (obj1 === obj2) return true;
    if (obj1 === null || obj2 === null || typeof obj1 !== "object" || typeof obj2 !== "object") {
        return false;
    }
    const keys1 = Object.keys(obj1); // this will return array of keys
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (const key of keys1) {
        if (!Object.hasOwn(obj2, key)) return false;
        if (!isDeepEqual(obj1[key], obj2[key])) return false
    }
    return true
}
const a = {
    name: "Amrit",
    education: {
        degree: "BTech"
    }
};

const b = {
    name: "Amrit",
    education: {
        degree: "BTech"
    }
};
isDeepEqual(a, b)