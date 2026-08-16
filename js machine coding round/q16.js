// Group an array of objects by a given key (like _.groupBy):

function groupBy(arr, key) {
    return arr.reduce((acc, obj) => {
        const group = obj[key]
        if (!acc[group]) acc[group] = []
        acc[group].push(obj)
        return acc
    }, {})
}

function groupBy(arr, res) {
    return arr.reduce((acc, obj) => {
        const group = obj[key]

        if (!acc.has(group)) acc.set(group, []);
        acc.get(group).push(obj)
        return acc
    }, new Map())
}