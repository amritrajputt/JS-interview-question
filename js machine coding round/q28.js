//Hard — Implement a simplified version of the Promise class yourself, supporting .then(), .catch(), and chaining. hint or starter code
class MyPromise {
    constructor(executor) {
        // Your state can be:
        // "pending", "fulfilled", "rejected"

        // Store:
        // - current state
        // - resolved value
        // - rejected error
        // - callbacks waiting for resolution/rejection

        executor(
            // resolve function
            // reject function
        );
    }

    then(onFulfilled, onRejected) {
        // Return a NEW MyPromise
        // This is what allows chaining:
        //
        // new MyPromise(...)
        //     .then(...)
        //     .then(...)
    }

    catch(onRejected) {
        // Hint:
        // catch() can be implemented using then()
    }
}