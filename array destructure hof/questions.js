// Convert this loop into a one-liner using map/filter/reduce:
const nums = [1, 2, 3, 4, 5, 6];
let sum = 0;
for (let n of nums) {
  if (n % 2 === 0) sum += n * n;
}
console.log(sum)
arr = nums.filter((num) => num%2 == 0) 
const ans = arr.reduce((acc,curr)=>{
  return  acc+=curr*curr
},0)
console.log(ans)



const arr = [1, [2, 3], [4, [5, 6]]];
console.log(arr.flat(Infinity));
// ans [1 2 3 4 5 6]



// 3. Given an array of objects, group them by a key without using a library:
const people = [
  { name: "A", dept: "Eng" },
  { name: "B", dept: "Sales" },
  { name: "C", dept: "Eng" },
];
// expected: { Eng: [A, C objects], Sales: [B object] }
const result = {};

for (const person of people) {
  const dept = person.dept;

  if (!result[dept]) {
    result[dept] = [];
  }

  result[dept].push(person);
}

console.log(result);


// Destructure this to get city and country directly, with a default value for country if missing:


const user = { name: "Amrit", address: { city: "Lucknow" } };


const { address: { city, country = "India"}} = user;

console.log(city);     // Lucknow
console.log(country);  // India