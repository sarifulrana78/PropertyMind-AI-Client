// 1. Basic Types
let isDone: boolean = false;
let decimal: number = 6;
let color: string = "blue";
let list: number[] = [1, 2, 3];
let tuple: [string, number] = ["hello", 10];

// 2. Enums
enum Direction {
  Up = 1,
  Down,
  Left,
  Right,
}
let dir: Direction = Direction.Up;

// 3. Functions
function add(x: number, y: number): number {
  return x + y;
}

const multiply = (x: number, y: number): number => {
  return x * y;
};

// 4. Interfaces
interface User {
  id: number;
  name: string;
  email?: string; // Optional property
}

const user1: User = {
  id: 1,
  name: "Alice",
};

// 5. Type Aliases
type Point = {
  x: number;
  y: number;
};

function printPoint(pt: Point) {
  console.log(`The coordinate's x value is ${pt.x}`);
  console.log(`The coordinate's y value is ${pt.y}`);
}

// 6. Classes
class Animal {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  move(distanceInMeters: number = 0) {
    console.log(`${this.name} moved ${distanceInMeters}m.`);
  }
}

class Dog extends Animal {
  bark() {
    console.log("Woof! Woof!");
  }
}

const dog = new Dog("Buddy");
dog.bark();
dog.move(10);

// 7. Generics
function identity<T>(arg: T): T {
  return arg;
}

let output = identity<string>("myString");
