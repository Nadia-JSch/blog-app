---
title: "JavaScript 1: Data Types and Variables"
date: "2026-02-22"
description: "An overview of JavaScript's primitive and non-primitive data types, how to declare and reassign variables with let and const, and tools like typeof and console.log for debugging."
tags: ["javascript"]
---

JavaScript enables behavior creating complete and interactive web experience.

## Data Types

Data types are the kind of value stored in a variable, like a piece of text. 

A variable is a named container that stores a value of a specific data type, allowing you to reference and manipulate it throughout your code.

### Primitive data types

The primitive JavaScript data types are:

- Sting
- Number
- Boolean
- Undefined
- null

### The `Number` data type

Represents integers and floating point numbers. 

```js
console.log(3);
console.log(0.5);
console.log(-67);
```

### The `String` data type

A string is a sequence of characters between single or double quotes. But be consistent with using either single or double quotes.

```js
console.log("I love cats");
console.log('I love to code');
```

'Strings' in JavaScript as immutable. After being created, a string's characters cannot be changed directly. If you need to make changes, create a new string by reassigning the variable (if using `let` to declare it, of course).

```js
let developer = 'Jessica';
console.log(developer); // Jessica

developer = 'Quincy';
console.log(developer); // Quincy
```

#### String concatenation 

Combine or join pieces of text together. This is known as concatenation. Check where spaces need to be added when performing string concatenation.

- The `+` operator.

```js
let firstName = 'John';
let lastName = 'Doe';

let fullName = firstName + ' ' + lastName;
console.log(fullName); // John Doe
```

- The `+=` operator is using for incrementally building strings over time. Check that the space is included in the right place. 

Characters in a string are immutable, we are just adding to the string.

```js
let greeting = `Hello`;
greeting += ', John!;

console.log(greeting); // "Hello, John!"
```

- The `concat()` method. A method is a type of function that is associated with an object so that the method operates on the data associated with that object. Useful for concatenating multiple strings.

```js
let str1 = 'Hello';
let str2 = 'World';

let result = str1.concat('', str2);
console.log(result); // Hello World
```

### The Boolean data type

Boolean values can either be `true` or `false`. A use case is checking if a user has checked in or not (true or false) and change the page based on that, like displaying a dashboard or login page.

### The `undefined` and `null` data types

- `undefined` means a variable has been declared but not given a value yet. 
- `null` means the variable has been intentionally set to nothing and doesn't hold a value. 

### The `Object` data type

The `Object` data type is a collection of key-value pairs that group related information together. 

```js
{
    name: "Alice",
    age: 30
}
```

### The Symbol data type

Symbol is a unique and cannot be changed – often used as an identifier for properties and unique labels. 

```js
Symbol('mySymbol');
```

### The `BigInt` data type

Used for numbers exceeding the limit of the `Number` type. Create a `Bigint` by adding an `n` at then end of the large number:

```js
1234567890123456789012345678901234567890n;
```

## Declaring variables

Variables are boxes that act as containers for storing data that can be accessed and modified. 

You can declare a variable without a value (it will have the `undefined` data type) using the `let` keyword:

```js
let age;
```

Use camelCase to name variables something descriptive. You can start variable names with `_` or `$` but not a number.

### Initialize a variable with `let`

Use the `=` assignment operator to assign a value to the declared variable. Assigning a value to a variable is called 'initialization'.

```js
let age = 25;
console.log(25); // 25
```

### Reassign a value 

Don't reassign a variable by redeclaring it with the keyword. 

```js
let age = 25;
console.log('age'); // 25
age = 30 
console.log('age'): // 30
```

### Declare a variable with `const`

Unlike `let`, declaring a variable using `const` means the value cannot be reassigned.

Unlike 'let', a `const` variable must be assigned a value at the time of declaration. 

```js
const maxScore = 100;
console.log(maxScore);
```

You'll get an error if you try reassign it like `maxScore = 200` will result in an error.

### The `var` keyword

Using the `var` keyword is not longer recommended. It's like `let` with a 'wider scope' which can cause problems. 

## The `console.log()` method

Use to print values to the console for debugging and development purposes to ensure things are working as expected. 

You can pass in multiple values separated by commas. (Seems like it add a space for you):

```js
let name = 'Alice';
let age = '25';
console.log('Name:', name, 'Age:', age); // Name: Alice Age: 25
```

## Code clarity

Using semicolons and comments in code aren't essential to the functionality of the code but helps with clarity and maintainability.

### Semicolons

In JavaScript, `;` is used to declare the end of a statement, allowing the JavaScript engine to distinguish the different commands when compiled.

JavaScript has Automatic Colon Insertion (ASI), but explicitly including semicolons helps prevent errors from unexpected ASI behavior.

### Compiler Note

A compiler translates the high-level code to machine-readable readable code which creates an executable file.

Though JavaScript uses just-in-time compilation where there isn't an executable file generated.

### Comments

There are snippet and multi-line comments in JavaScript:

```js
// this is a single-line comment
```

```js
/* 
I am a multiline comment.
This is helpful for longer explanations
*/
```

It's best to use comments sparingly and rather refactor code that is overly complicated than add a comment to explain it away. 

## Static vs dynamically typed

JavaScript is a dynamically typed language where the data type of the variable is not declared explicitly and you can reassign a variable to a different data type. For example:

```js
let example = "Hello";
example = 42;
```

This gives JavaScript flexibility but at the expense of introducing bugs that are harder to catch. 

In contrast, C# and Java require you to declare the data type and reassigning a value to a different type causes an error.

## The `typeof` operator

The `typeof` operator returns the data type of a variable or value as a string indicating the type. It's useful for debugging and understanding what data you''re working with. 

Interesting how as an 'operator' there are no `()` where a value is passed in – there's just a space followed by the value or variable name.

```js
let num = 42;
console.log(typeof num); // "number" 

let isUserLoggedIn = true;
console.log(typeof isUserLoggedIn); // "boolean"
```

### The `typeof` null bug

In the past, the `null` data type was a type of special object but now it's a primitive data type. 

```js
let exampleVariable = null;
console.log(typeof exampleVariable); // "object"
```

## Variables review

https://www.freecodecamp.org/learn/javascript-v9/review-javascript-variables-and-data-types/review-javascript-variables-and-data-types
