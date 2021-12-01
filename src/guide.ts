// Basic types
let id: number = 5
let company: string = "Google"
let isPublished: boolean = true
let x: any = "Hello"

let ids: number[] = [1, 2, 3, 4, 5]
let arr: any[] = [1, true, "Hello"]

// Tuple
let person: [number, string, boolean] = [1, "Oliver", true]
// Tuple Array
let employee: [number, string][]

employee = [
  [1, "Bob"],
  [2, "Alex"],
  [3, "John"],
]

// Union
let pid: string | number = 22
pid = "22"

// Enum
enum Direction1 {
  Up,   // 0
  Down, // 1
  Left, // 2
  Right // 3
}

// Objects
type User = {
  id: number
  name: string
}
const user: User = {
  id: 1,
  name: "John"
}

// Messy alternative
const user1: {
  id: number,
  name: string,
} = {
  id: 1,
  name: "John"
}

// Type Assertion
let cid: any = 1
let customerId = <number>cid
// Alternative
let customerId1 = cid as number

// Functions
function addNum(x: number, y: number): number { // last one is for return type
  return x + y
}

function log(message: string | number): void { // return nothing
  console.log(message)
}

// Interfaces
interface UserInterface {
  readonly id: number
  name: string
  age?: number
}
const user2: UserInterface = {
  id: 1,
  name: "John"
}
// user2.id = 5

interface MathFunc {
  (x: number, y: number): number
}

const add: MathFunc = (x: number, y: number): number => x + y
const sub: MathFunc = (x: number, y: number): number => x - y

interface PersonInterface {
  id: number
  name: string
  register(): string
}

// Classes
class Person implements PersonInterface {
  id: number
  name: string

  constructor(id: number, name: string) {
    this.id = id
    this.name = name
  }

  register() {
    return `${this.name} is now registered!`
  }
}

const brad = new Person(1, "Brad")
const mike = new Person(2, "Mike")

// Subclass
class Employee extends Person {
  position: string

  constructor(id: number, name: string, position: string) {
    super(id, name)
    this.position = position
  }
}

const emp = new Employee(3, "Miguel", "SWE")

// Generics
function getArray<T>(items: T[]): T[] {
  return new Array().concat(items)
}

let numArray = getArray<number>([1, 2, 3, 4])
let strArray = getArray<string>(["bob", "brad", "john", "alex"])

// numArray.push("Hello")