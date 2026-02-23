---
title: "JavaScript 3: Functions and Scope"
date: "2026-02-22"
description: "Declaring and calling functions, parameters and return values, arrow functions, anonymous functions, and how programming scope works in JavaScript."
tags: ["javascript"]
draft: true
---

Functions can take in input, do operations on input, and return a result.

A function needs to be declared using the `function` keyword and called or invocated using the function name:

```js
function greet() {
    console.log("Hello!");
}

greet();
```

## Parameters 

Parameters are placeholders for values that will get passed into the function when called. 

```js
function greet(name) {
    console.log(`Hello, ${name}!`);
}

greet("Alice"); // "Hello, Alice!"
greet("Nick"); // "Hello, Nick!"
```

### Default values for parameters

You can set default values for parameters to use if no arguments are provided.

Use the assignment operator to assign the parameter a default value.

```js
function greetings(name = "Guest") {
    console.log("Hello, " + name + "1");
}

greetings(); // "Hello, Guest!"
greetings("Anna"); // "Hello, Anna!"
```

## Default return value

By default, `undefined` is returned if you don't explicitly use the 'return' keyword followed by value (to make a return statement).

```js
function doSomething() {
    console.log("Doing something...");
}

let result = doSomething();
console.log(result); // undefined
```

## Return value

Include a return statement:

```js
function calculateSum(num1, num2) {
    return num1 + num2;
}

console.log(calculateSum(3, 4)); // 7
```

## Anonymous function

An anonymous function doesn't have a name declared like `function calculateSum()` but is saved to a variable where it can be referenced or called. It ends with a ; unlike named functions.

```js
const sum = function (num1, num2) {
    return num1 + num2;
};

console.log(sum(3, 4)); //7
```

## Arrow functions

An arrow function is like an anonymous function without the `function` keyword and with the arrow (=>) between the parameter and function body

```js
const greetings = (name) => {
    console.log("Hello, " + name + "!");
};
```

### Parameter parentheses syntax

- You can omit the parentheses if there's only on parameter

    ```js
    const greetings = name => {
        console.log("Hello " + name);
    };
    ```

- Use empty parentheses if there are no parameters

    ```js
    const greetings = () => {
        console.log("Hello");
    };

## One-line arrow functions

If the function body is only a single line of code, you can 

- write arrow functions in one line
- leave out the curly braces { }
- leave out the `return` keyword (throws a syntax error `Uncaught SyntaxError: Unexpected token 'return'`)

```js
const greetings = name => console.log("Hello" + name);

const calculateArea = (width, height) => width * height;
```

## When to use arrow functions

Depends on the style of the existing code base when working on a team.

## Programming scope 

Scope in programming is the visibility and accessibility of variables in different parts of your code. It determines where variables can be accessed or modified. 

There are three types of scope, from outermost to innermost scope

### Global scope

Variables declared in the global scope are accessible from anywhere in your code but should be used sparingly to avoid variable naming conflicts and make the code harder to maintain.

It's convenient to access global variables from inside the function body.

```js
let globalVar = "I'm a global variable!";

function printGlobalVar() {
    console.log(globalVar)
}

printGlobalVar(); // "I'm a global variable!"
```

### Local scope

Local scope refers to variables only accessible within a function.

```js
function greet() {
    let message = "Hello, local scope!";
    console.log(message);
}

console.log(message); // throws an error
```

### Block scope

Block scope was introduced in ES6 with the `let` and `const` keywords.

`let` and `const` variables declared within curly braces (if statements, loops) are only accessible in that code block. 

(sounds like local scope, I guess the difference is local scope is variables within functions and block scope refers to variables declared within curly braces?)

```js
if (true) {
    let blockVar = "I'm in a block";
    console.log(blockVar); // "I'm in a block"
}
console.log(blockVar); // ReferenceError
```

Historically, `var` ignored block scope boundaries

```js
function demo() {
  if (true) {
    var a = 1;
    let b = 2;
  }

  console.log(a); // 1
  console.log(b); // ReferenceError
}
```