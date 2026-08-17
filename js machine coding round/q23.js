// Convert a callback-based function into a Promise-based one

function getUserId(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (id === 1) {
                resolve(1);
                return;
            }
        });
    })
}