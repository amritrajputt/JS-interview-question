//Write a delay(ms) function that returns a Promise resolving after ms milliseconds.
function delay(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}