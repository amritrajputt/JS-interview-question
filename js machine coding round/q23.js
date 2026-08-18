// Convert a callback-based function into a Promise-based one
const fs = require('fs')

fs.readFile("../react-node-interview-prep.md", "utf-8", (err, data1) => {
    if (err) return console.error("error reading file1:", err)
    fs.readFile("../senior-js-interview-guide.md", "utf-8", (err, data2) => {
        if (err) return console.error("error reading file2:", err)
        console.log(data1, data2);
    })
})

function readFilePromise(path) {
    if (!path) return "path to de deta😭";
    return new Promise((res, rej) => {
        fs.readFile(path, "utf-8", (err, data) => {
            if (err) rej("error occurs",err)
            else res(data)
        })
    })
}

readFilePromise("../react-node-interview-prep.md")
    .then(data1 => {
        return readFilePromise("../senior-js-interview-guide.md")
            .then(data2 => console.log(data1, data2))
    })
    .catch(err => console.error(err));


    
async function readAllFiles() {
    try {
        const [promise1, promise2] = await Promise.all([
            readFilePromise("../react-node-interview-prep.md", "utf-8"),
            readFilePromise("../senior-js-interview-guide.md", "utf-8")
        ])
        console.log(promise1, promise2);
    } catch (err) {
        console.error(err);
    }
}
readAllFiles()