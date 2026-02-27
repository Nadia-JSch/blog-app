---
title: "JavaScript 2: Booleans, Numbers, and the Math Object"
date: "2026-02-22"
description: "Arithmetic operators, type coercion, comparison and logical operators, truthy and falsy values, the Math object, and methods for converting and formatting numbers."
tags: ["javascript"]
---

## Supported bases

JavaScript supports the standard decimal system of base 10, and also numbers with different bases, like:

- binary
- octal
- hexadecimal (base 16 using 0-9 and letters a-f seen in CSS hec colors)

## `Infinity` and `NaN` Numbers

Unlike other programming languages, JavaScript uses one `Number` type for floating point numbers and whole numbers (including negative numbers).

The `Number` data type also includes special values:

- `Infinity` to represent numbers beyond the maximum limit or when dividing by 0
- `Nan` for 'Not a Number' is the value returned if trying to perform a mathematical operation on something other than a number.

```js
const infiniteNumber = 1 / 0;
console.log(infiniteNumber); // Infinity
console.log(typeof infiniteNumber); // "number"

const notANumber = 'hello world' / 2;
console.log(notANumber); // Nan
console.log(typeof notANumber); // "number" 
```

## Arithmetic operators

JavaScript supports

- addition `+`
- subtraction `-`
- multiplication `*` (order or numbers doesn't matter, that is, you get the same result)
- division `/` 
- remainder `%` returns the remainder of a division:

```js
const num1 = 10;
const num2 = 3;

const remainder = num1 % num2; // 1 
```

- exponentiation (**) raises one number to the power of another:

```js
const num1 = 2;
const num2 = 3;

const exponent = num1 ** num2; // 8
```

### Operator precedence 

Operator precedence determines the order of operations. 

`const result = 10 + 5 * 2 - 8 / 4; // 18`

### Left-to-right and right-to-left associatives

Associativity is what tells JavaScript whether to evaluate operators from left to right or right to left. For most operators like addition and multiplication, associativity is left to right. 

```js
const result = 10 - 2 + 3; // 11
// -> ->

```

But the assignment operator `=` is left-to-right associative. JavaScript assigns `5` to `b` first, then assigns `b` to `a` (which is now `5`).

```js 
let a, b; // declaring to uninitialized variables at once
a = b = 5;
// <- <-

console.log(a); // 5 not b 
console,log(b); // 5
```

The exponent operator is also right-to-left associative.

```js
const result = 2 ** 3 ** 2; // 512
```
First, `3 **2` is evaluated which is 9, then `9 ** 2` which is 512. 

## Type coercion

Doing calculations on numbers and strings reveals some of JavaScripts quirks. 

Type coercion refers to JavaScript changing the data type of values during arithmetic operations.

### Concatenates string + number

- The `+` operator treats both the number and string as a string and concatenates them:

```js
const result = 5 + '10';

console.log(result); // "510"
console.log(typeof result); // "string"
```

### Converts 'digit' strings to numbers with `-`, `*`, and `/`

JavaScript converts the string to number before doing the math with subtraction, multiplication, and division on a string and number. 

```js
const subtractionResult = '10' - 5;
console.log(subtractionResult); // 5
console.log(typeof subtractionResult) // "number"

const multiplicationResult = '10' * 2;
console.log(multiplicationResult); // 20
console.log(typeof multiplicationResult); // "number"

const divisionResult = '20' / 2;
console.log(divisionResult); // 10
console.log(typeof divisionResult); // "number"
```

### Converts 'character' strings to a `NaN` value of `Number`

If the string doesn't look like a number, JavaScript returns `NaN` which is a type of `Number`, but no arithmetic operation is performed.

```js
const subtractionResult = 'abc' - 5; 
console.log(subtractionResult); // NaN
consol.log(subtractionResult); // "number"

const multiplicationResult = 'abc' * 2;
console.log(multiplicationResult); // NaN
console.log(typeof multiplicationResult); // "number"

// Same for division
```

### Boolean values and arithmetic

JavaScript treats `true` as `1` and `false` as `0` and performs mathematical operations on Boolean values, except for addition which is concatenation.

```js
const result1 = true + 1; 
console.log(result1); // 2
console.log(typeof result1); // "number"

const result2 = false + 1;
console.log(result2); // 1
console.log(result2): // "number"

const result3 = 'Hello' + true;
console.log(result3); // "Hellotrue"
console.log(result3); // "string"

const result4 = '1' + true;
console.log(result4); // "1true"
console.log(typeof result4); //"string"
```

### `null` and `undefined` values and arithmetic 

In mathematical operations, JavaScript treats 
- `null` as `0`
- `undefined` as `NaN`

```js
const result1 = null + 5;
console.log(result1); // 5
console.log(typeof result1); // "number"

const result2 = undefined + 5;
console.log(result2); // NaN
console.log(typeof result2); // "number"
```

It makes sense because `null` is nothing like zero and `undefined` is 'Not a number`. And JavaScript tries type coercion when you do math on different data types and `undefined` as a number is not a number. 

## Increment operator `++` and `--`

Change the value by a 1 using `x++` to add 1 and `x--` to subtract 1.

But the prefix version (++x / --x) changes by one immediately and the postfix version (x++ / x--) returns the value of the original value then changes the value by one. 

- use prefix to use the updated value right away
- use postfix if you want to use the current value first

```js
let a = 5; 
let b = ++a;
console.log(b); // 6 (b increased before assignment)

let c = 5; 
let d = c++;
console.log(c); // 5 (c increased after assignment)
```

## Compound assignment operators `num += 2`

Combine the arithmetic and assignment operators at once. Works for all operators (+, -, *, /) including the remainder `%=` and exponents `**=` operators.

Syntax: `{operator}=`

Take the current value of a variable and subtract a specified number to it and assign the result back to the variable. 

```js
let score = 20;
score -= 7;
console.log(score); // 13

// instead of 
let score = 20
score = score - 7;
```

There are also compound assignment operators for AND `&=` and OR `|=` (bitwise operators).

## Booleans, equality, and inequality

Booleans represent `true` and `false` values to make decisions based on conditions. 

The equality and inequality operators have different 

### Conditional if else

If else syntax:

```js
if (condition) {
  console.log("condition is truthy");
}
```

Use boolean values with if-else to do something based on a conditional.

```js
let isOldEnoughToDrive = true; 

if (isOldEnoughToDrive) {
    console.log("You're old enough to drive");
} else {
    console.log("Sorry, you're not old enough to drive");
}
```


### Loose equals operator `==`

The `==` equality operator isn't strict because it does type coercion on number and strings hinting at similar values. 

```js
console.log(5 == '5'); // true
```

### Strict equals operator `===`

The strict `===` equality operator factors in the data type of values when comparing them and only return `true` if the value and data types match. 

```js
console.log(5 === '5'); // false

console.log(5 === 5); // true
```

### Loose not equals operator `!=`

JavaScript converts `'5'` to `5` the number and then compares `5` and `5` which are equal, so returns `false` to the 'not equals' question.

```js
console.log(5 != '5'); // false
```

### Strict not equals operator `!==`

The strict inequality operator doesn't do any type coercion and returns `true` as the string `'5'` is not equal to the number `5`.

```js
console.log(5 !== '5'); // true
```

### Best practice

It's considered best practice to use the strict inequality and inequality operators where possible as they don't use the type coercion. 

## Comparison operator `<` and `>`

Comparison operators compare two values and returns `true` or `false` values. Then use the result in if statements and loops to make decisions on conditions. 

### The `>` and `>=` operators

The `>` operator checks if the value on the left is greater than the one on the right:

```js
let a = 6; 
let b = 9; 

console.log(a > b); // false
console.log(b > a); // true
```

The `>=` greater than or equals operator checks if the value on the left is greater than or equals to the value on the right. 

```js
let a = 6;
let b = 9;
let c = 6;

console.log(a >= b); // false 
console.log(b >= a); // true (greater than)
console.log(a >= c); // true (equals)
```

### The `<` and `<=` operators

The `<` less than operator checks if the value on the left is smaller than the one on the right. 

```js
let a = 6; 
let b = 9;

console.log(a < b); // true
console.log(b < a); // false
```

The `<=` operator checks if a value is less than or equal to the value on the right. 

```js
let a = 6; 
let b = 9; 
let c = 6; 

console.log(a <= b); // true (less than)
console.log(b <= a); // false
console.log(a <= c); // true (equals)
```

## Truthy and falsy values

A boolean context is anywhere JS asks "Is this true or false?" even in cases where something is not a boolean, JS can treat certain values as boolean-like.

### Truthy values

A truthy value evaluates to `true` in an if statement and include:


- Non-empty strings: `if ("hello")` evaluates to `true`
- Non-zero numbers: `if (-42)` evaluates to `true`

- Empty array: `if ([])` evaluates to `true`
- Empty object: `if ({})` evaluates to `true`
- Full arrays
- Full objects
- The boolean `true`

### Falsy values

There are seven falsy values in JS, everything else is truthy. 

1. Zero: `if (0)` evaluates to `false`
2. Negative zero `-0`
3. Empty string: `if ("")` evaluates to `false`
4. `null`: `if (null)` evaluates to `false`
5. `undefined`
6. `NaN`

7. The boolean `false`

That's why this evaluates to `true`, without explicit comparison:

```js
if (username) {
    ...
}
```

### The `Boolean()` function

Use the `Boolean()` function to check the truthiness of a value. 

```js
const truthyOrFalsy = 'freeCodeCamp';
console.log(Boolean(truthyOrFalsy)); // true

const truthyOrFalsy2 = "";
console.log(Boolean(truthyOrFalsy)); // false
```

## Unary operators

Unary operators act on a single value to perform operations like type conversion, value manipulation, and checking some conditions

### Unary plus `+{variable}` and minus `-{variable}`

The unary plus `+{variable}` operator coverts a value into a number and is handy to ensure a value is a number. 

```js
const str = '42';
const strToNum = +str;

console.log(strToNum); // 42
console.log(typeof str); // string
console.log(typeof strToNum); // number
```

The unary minus `-{variable}` operator changes the value to a negative number.

### The NOT operator 

The `!` is a unary operator that flips the boolean value. So `true` becomes `false`. 

```js
let isOnline = true; 

console.log(!isOffline) = false; 
```

The bitwise NOT operator `~{variable}` is less common and inverts the binary value of a number; it changes `1` to `0` and `0` to `1`. It's based on 'two's complement' of how computers represent negative numbers in binary.

```js
const num = 5; // The binary for 5 is 00000101

console.log(~num); // you get - (5 + 1) which is -6
```

### The `void` keyword

The `void` keyword is a unary operator that evaluates an expression and returns `undefined`. 

```js
const result = void (2 + 2);
console.log(result); // undefined
```

Use the `void` unary operator in `href` attributes (links) to prevent navigation. 

```html
<a href="javascript:void(0)">Click me</a>
```

### The `typeof` unary operator

The `typeof` unary operator returns the data type of a value as a string (and explains the unexpected syntax that doesn't have `()` or used with not notation on an object). 

## Bitwise operators

Bitwise operators work on binary digits constituting a bit (either 0 or 1). Bit is a portmanteau for 'binary digit'.

The binary representation of 10 is `1010` and there are some exponents that represent each number in `1010` for some unknown reason and then there's also the result of the 2^x exponent which is `8020`. 

The JavaScript bitwise operators are:
- AND `&`: only return `1` if there's a matching binary digit between two numbers
- OR `|`: return a `1` if either of two binaries has a `1`
- XOR `^`: either or 
- NOT `~`: reverse the bit of the operand
- left shift `<<`: shift the binary number to the left by a specified number
- right shift `>>`: shift the binary number to the right by a specified number

Bitwise operators are used more in low-level programming, cryptography, and specialized tasks.

## Conditional statements

Conditional statements allow your program to flow in a particular way based on conditions.

### `If` statements

An `if` statement takes a condition and runs a block of code if that condition is truthy.

```js
if (null) {
  console.log("This will not run.");
}

if ("freeCodeCamp") {
  console.log("This will run.");
}
```

### The `else` clause

When a condition is `false` you can add an `else` clause to handle falsy conditions:

```js
const age = 15;

if (age >= 18) {
    console.log("You can vote");
} else {
    console.log("You're not eligible to vote");
}
```

### `Else-if` statements

Use an `else if` block followed by a condition to check multiple conditions.

```js
const score = 87;

if (score >= 90) {
    console.log('You got an A');
} else if (score >= 80) {
    console.log('You got a B'); // the evaluates to `true`
} else if (score >= 70) {
    console.log('You got a C');
} else {
    console.log('You failed! You need to study more!');
}
```

### Ternary operator

The ternary operator is a compact way to write if-else statements with one true and one false state. It has three parts:

- a condition
- result for the true condition
- outcome for the false condition

Syntax:
`condition ? expressionIfTrue : expressionIfFalse;`

You can assign the ternary operator to a variable.

```js
const temperature = 30;
const weather = temperature > 25 ? 'sunny' : 'cool';

console.log(`It's a ${weather} day!`); // "It's a sunny day!"
```

If you're dealing with complex conditions and multiple statements, rather use if-else as nesting ternaries can become unreadable.

If within a function you can use the `return` keyword. Note how you can also
- return `undefined`
- use the logical operator `&&` in a ternary operator

```js
function getLoanMessage(annualIncome, creditScore) {
  return annualIncome >= minIncomeForDuplex &&
         creditScore >= minCreditScoreForDuplex
    ? "You qualify for a duplex, condo, and car loan."
    : undefined;
}
```

## Binary logical operators

Evaluate two expression and return a result based on their truthiness. 

There are three most common binary logical operators.

### 1. Logical AND operator `&&`

The `&&` operator checks if both operands (values being operated on) are true and returns a result. 

- If both operands are truthy, it returns the value on the right.

```js
const result = true && 'hello';
console.log(result); // "hello"
```

- If either operand is false, it returns the falsey value (`0` in the example). If both operands are falsy, the first falsy value is returned.

```js
const result = 0 && 3;
console.log(result); // 0
```

In conditional statements, the `&&` AND operator is useful for ensure multiple conditions are met before proceeding.

```js
if (2 < 3 && 3 < 4) {
    console.log('The if block runs'); // This will print
} else {
    console.log('The else block runs');
}
```

### 2. Logical OR operator

The logical `||` operator check if at least one of the operands is truthy and returns the truthy value if one is operand is truthy and the other operand is falsey. 

```js
const result = 'This is truthy' || false;
console.log(result); // This is truthy
```

Example of using the OR operator in an if-else statement. The first `console.log` statement will print because `'Guest'` is a truthy value even though `userInput` is an `undefined` falsy value.

```js
let userInput;

if (userInput || 'Guest') {
    console.log('A user is present'); 
} else {
    console.log('No user detected');
}
```

### 3. Nullish coalescing operator `??`

The `??` nullish coalescing operator It returns the second value only if the first is `null` or `undefined`.

It's useful when you want to return a non-nullish value if the first operand is `null` or `undefined`. 

```js
const result = null ?? 'default';
console.log(result); // default
```

It's useful when you want `null` or `undefined` to trigger a fallback value. 

For example, dealing with user preference settings.

```js
const userSettings = {
    theme: null, 
    volume: 0,
    notifications: false,
};

let theme = userSettings.theme ?? 'light';
console.log(theme); // light
```

>Coalescing in programming does not specifically mean "joining the values together", but more about "deciding what value is made out of the provided values".
[Source](https://www.freecodecamp.org/news/what-is-the-nullish-coalescing-operator-in-javascript-and-how-is-it-useful/)

## The `Math` object

The `Math` object has methods for manipulating numbers and doing mathematical operations beyond basic arithmetic.

### The `Math.random()` method

The `Math.random()` method returns a random float between 0 (inclusive) and 1 (exclusive). 

```js
const randomNum = Math.random();
console.log(randomNum); // 0.9764488783425562
```

### The `Math.max()` and `Math.min()` methods

The `Math.min()` and `Math.min()` methods return the minimum and maximum number given a set of numbers as an argument. 

```js
const smallest = Math.min(1, 5, 3, 9);
console.log(smallest); // 1

const largest = Math.max(1, 5, 3, 9);
console.log(largest); // 9
```

### The `Math.ceil()` and `Math.floor()` methods

- The `Math.ceil()` method rounds up to the nearest whole integer. 

```js
console.log(Math.ceil(4.3)); // 5
```

- The `Math.floor()` method rounds down to the nearest whole integer.

```js
console.log(Math.floor(4.7)); // 4
```

### Get a random whole number

Use `Math.random()` with `Math.floor()` together if you want to generate a random integer between specific values. 

General formula:
```js
Math.random() * (maximum - minimum) + minimum;
```

General formula wrapped with `Math.floor()`:
```js
Math.floor(Math.random() * (maximum - minimum) + minimum);
```

For example, Generate a number between 5 and 10. Times the random float by the 5 plus 1 (?) and add another 1.

```js
const max = 10;
const min = 5;
const randomNumber = Math.floor(Math.random() * (max - min + 1) + 5);

console.log(randomNum); // 8
```

- Generate a random number between 20 and 1. Times the random float by 20 and add 1. 

```js
const randomNumbtw1And20 = Math.floor(Math.random() * 20) + 1;
console.log(randomNumBtw1and20); 16
```

### The `Math.round()` method

The `Math.round()` method actually takes the decimal value into account and rounds up or down accordingly.

```js
console.log(Math.round(2.3)); // 2
console.log(Math.round(4.5)); // 5
console.log(Math.round(4.8)); // 5
```

### The `Math.trunc()` method

The `Math.trunc()` method returns a float without the decimal point without rounding.

```js
console.log(Math.trunc(2.9)); // 2
console.log(Math.trunc(9.1)); // 9
```

### The `Math.sqrt()` and `Math.cbrt()` methods

Get the square root of a number with `Math.sqrt()` and the cube root of a number with `Math.cbrt()`.

```js
console.log(Math.sqrt(81)); // 9
console.log(Math.cbrt(27)); // 3
```

### The `Math.abs()` method

The `Math.abs()` method removes the negative of a number to return the absolute value.

```js
console.log(Math.abs(-5)); // 5
console.log(Math.abs(5)); // 5
```

### The `Math.pow()` method

The `Math.pow()` method raises the first argument by the second argument and returns the answer.

```js
console.log(Math.pow(2, 3)); // 8
console.log(Math.pow(8, 2)); // 64
```

## NaN is weird

'Not a Number' is useful to describe calculation attempts that can't yield a number in JavaScript. 

But, NaN === NaN is `false` because weirdly NaN is not equal to anything, not even itself.

The global `isNaN()` can check if a value is `NaN` but it does type coercion first which leads to inconsistent results.

```js
console.log(isNaN("blabla")); // true: is not a number
```

To get around this, ES6+ introduced `Number.isNanN` which doesn't do type coercion and returns `true` when something isn't a number. 

```js
console.log(Number.isNaN(NaN)); // true
console.log(Number.isNaN(0 / 0)); // true
console.log(Number.isNaN(Number.NaN)); // true
console.log(Number.isNaN("blabla")); // false, is not NaN
```

### Why do we care about checking for NaN?

`Number.isNaN()` can be used to handle error cases when parsing user inputs.

```js
let a = 0;
let b = 0;
let result = a / b;

if (Number.isNaN(result)) {
    result = "Error: Division result in NaN";
}

console.log(result); // "Error: Division result in NaN"
```

## Methods to convert strings to numbers

Use `parseFloat()` and `parseInt()` to convert numbers that a user inputs that get automatically turned into strings, into numbers.

Both methods:
- ignore leading whitespace
- handle plus and minus signs at the beginning of numbers
- don't handle scientific notation
- don't cover all complex parsing needs (might need a library)

### The `parseFloat()` method

The `parseFloat()` method returns the first floating point number from the beginning of a string and continues until a non-digit character. 

```js
console.log(parseFloat("3.14.5")); // 3.14
console.log(parseFloat("3.14 abs")); // 3.14
console.log(parseFloat("abs 3.14")); // NaN
```

### The `parseInt()` method

The `parseInt()` method returns the first integer, excluding decimal points and decimal values.

```js
console.log(parseInt("3.14")); // 3
console.log(parseInt("-42")); // -42
```

## The `toFixed()` method

Use the `toFixed()` method for formatting numbers as a string to be displayed – like currency. 

```js
let price = 19.99;
let taxRate = 0.08;
let total = price + (price + taxRate);

console.log("Total: $" + total.tofixed(2)); // "Total: $21.59"
```

The `toFixed()` method defaults to `0` if no argument is given. The argument is number of decimal places to include, rounded up if the next number is greater or equal to `5`:

```js
let num = 3.14159;
console.log(num.toFixed()); // "3"

console.log((3.14550).toFixed(3)); // "3.146"
```

## Resource: Math review

- https://www.freecodecamp.org/learn/javascript-v9/review-javascript-math/review-javascript-math

