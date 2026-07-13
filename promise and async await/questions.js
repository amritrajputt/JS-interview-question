// function makeApiCall(id) {
//   return fetch(`http://example.com/${id}`)
//     .then(response => response.json());
// }

// // make this same by using setTimeout


function makeApiCallSetTimeOut(id){
    return new Promise((resolve, reject) => {
    setTimeout(() => {
      fetch(`http://example.com/${id}`)
        .then(res => res.json())
        .then(data => resolve(data))
        .catch(err => reject(err));
    }, 1000);
  });
}

// // find error
// async function getUser(id) {
//   try {
//     const res = fetch(`/api/user/${id}`);
//     const data = res.json();
//     return data;
//   } catch (err) {
//     console.log(err);
//   }
// }

// // ans:
async function getUser(id) {
  try {
    const res = await fetch(`/api/user/${id}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

// guess op

async function foo() {
  console.log(1);
  await null;
  console.log(2);
}
console.log(0);
foo();
console.log(3);
// 0 1 3 2

// 4. Write a function that runs 3 async API calls in parallel and waits for all to finish, vs one that runs them sequentially. Explain when you'd use each.


async function runParallel() {
  const [result1, result2, result3] = await Promise.all([
    fetch("/api/1").then(res => res.json()),
    fetch("/api/2").then(res => res.json()),
    fetch("/api/3").then(res => res.json())
  ]);
  return [result1, result2, result3];
}


// 5. Implement a simple retry(fn, retries) helper — it should call an async function fn, and if it throws, retry it up to retries times before finally rejecting.
async function retry(fn, retries) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();       // agar successful ho gaya, turant return kar do
    } catch (err) {
      if (attempt === retries) {
        throw err;              // last attempt bhi fail hua, ab error throw karo
      }
      console.log(`Attempt ${attempt} failed, retrying...`);
    }
  }
}