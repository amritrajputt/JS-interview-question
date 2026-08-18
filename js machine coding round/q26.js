// Implement Promise.all from scratch (myPromiseAll).


//if first one is not resolved yet and four others are resolved, then the completed will be the four itself.
//  But the result array is five. That's why we are taking completed, not rely on the result.length.

function myPromiseAll(promises) {
    return new Promise((res, rej) => {
        let completed = 0
        const result = []
        if (promises.length === 0) {
            res(result)
            return
        }
        for (let i = 0; i < promises.length; i++) {
            promises[i]
                .then(val => {
                    result[i] = val
                    completed++
                    if (completed == promises.length) {
                        res(result)
                    }
                }).catch(error => {
                    rej(error)
                })
        }
    })
}