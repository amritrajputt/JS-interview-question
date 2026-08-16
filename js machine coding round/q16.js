// Group an array of objects by a given key (like _.groupBy):

function groupBy(arr, key) {
    return arr.reduce((acc, obj) => {
        const group = obj[key]
        if (!acc[group]) acc[group] = []
        acc[group].push(obj)
        return acc
    }, {})
}