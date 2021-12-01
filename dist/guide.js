"use strict";
// Basic types
let id = 5;
let company = "Google";
let isPublished = true;
let x = "Hello";
let ids = [1, 2, 3, 4, 5];
let arr = [1, true, "Hello"];
// Tuple
let person = [1, "Oliver", true];
// Tuple Array
let employee;
employee = [
    [1, "Bob"],
    [2, "Alex"],
    [3, "John"],
];
// Union
let pid = 22;
pid = "22";
// Enum
var Direction1;
(function (Direction1) {
    Direction1[Direction1["Up"] = 0] = "Up";
    Direction1[Direction1["Down"] = 1] = "Down";
    Direction1[Direction1["Left"] = 2] = "Left";
    Direction1[Direction1["Right"] = 3] = "Right"; // 3
})(Direction1 || (Direction1 = {}));
const user = {
    id: 1,
    name: "John"
};
// Messy alternative
const user1 = {
    id: 1,
    name: "John"
};
// Type Assertion
let cid = 1;
let customerId = cid;
// Alternative
let customerId1 = cid;
// Functions
function addNum(x, y) {
    return x + y;
}
function log(message) {
    console.log(message);
}
const user2 = {
    id: 1,
    name: "John"
};
const add = (x, y) => x + y;
const sub = (x, y) => x - y;
// Classes
class Person {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
    register() {
        return `${this.name} is now registered!`;
    }
}
const brad = new Person(1, "Brad");
const mike = new Person(2, "Mike");
// Subclass
class Employee extends Person {
    constructor(id, name, position) {
        super(id, name);
        this.position = position;
    }
}
const emp = new Employee(3, "Miguel", "SWE");
// Generics
function getArray(items) {
    return new Array().concat(items);
}
let numArray = getArray([1, 2, 3, 4]);
let strArray = getArray(["bob", "brad", "john", "alex"]);
// numArray.push("Hello")
