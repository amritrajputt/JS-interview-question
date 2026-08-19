const obj = {
    fname:"amrit",
    lname:"raj",
    getName:function  () {
        console.log(`${this.fname} ${this.lname}` );
    }
}
console.log(obj.getName());

const copy = {
    __proto__:obj
}
copy.__proto__.fname = "amrit singh"
console.log(copy.getName());
