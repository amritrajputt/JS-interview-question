// Medium — Implement Promise.race from scratch.


function myPromiseRace(promises) {
    return new Promise((res, rej) => {
        let completed = false;

        for (let i = 0; i < promises.length; i++) {
            promises[i]
                .then(value => {
                    if (!completed) {
                        completed = true;
                        res(value);
                    }
                })
                .catch(error => {
                    if (!completed) {
                        completed = true;
                        rej(error);
                    }
                });
        }
    });
}


// Medium — Implement Promise.any from scratch.

function myPromiseAny(promises) {
    return new Promise((res, rej) => {
        let completed = false
        let rejected = 0
        const rejectedArray = []
        for (let i = 0; i < promises.length; i++) {
            promises[i]
                .then(val => {
                    if (!completed) {
                        completed = true;
                        res(val);
                    }
                })
                .catch(error => {
                    rejectedArray[i] = error;
                    rejected++;

                    if (rejected === promises.length) {
                        rej(new AggregateError(rejectedArray));
                    }
                });
        }
    });
}