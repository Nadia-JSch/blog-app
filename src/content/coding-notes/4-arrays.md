---
title: "JavaScript 4: Arrays and Array Methods"
date: "2026-02-22"
description: "Creating and manipulating arrays in JavaScript"
tags: ["javascript"]
draft: true
---

Arrays are versatile and useful for data storage inside programs.

Create an array (ordered collection of values) using square brackets with values separated by commas:

```js
let fruits = ["apple", "banana", "orange"];
```

- Arrays have a `length` property that returns the number of elements in the array.

```js
console.log(fruits.length); // 3
```

- Arrays in JavaScript are dynamic; their size can change after they are created by adding and removing elements using methods like `push()`, `pop()`, `shift()`, `unshift()`, `splice()`.

## Accessing array values

- Arrays are zero-indexed. If you access an index that doesn't exist in the array, JavaScript returns `undefined`/

    ```js
    console.log(fruits[0]); // "apple"
    console.log(fruits[2]); // "orange"
    console.log(fruits[3]); // undefined
    ```

## Updating an array value

Access the value to be replaced and assign a new value using the assignment operator.

```js
let fruits = ["apple", "banana", "cherry"];
fruits[1] = "blueberry"
console.log(fruits); // ["apple", "blueberry". "cherry"]
```

- Add new elements by assigning a value to an index that doesn't exist yet. But be careful, if you don't chose the next available index but one further away, all the indices before that will be filled in with `undefined`s.

```js
let fruits = ["apple", "banana", "cherry"];
fruits[3] = "date";
console.log(fruits); // ["apple", "banana", "cherry". "date"]
```

## Adding and removing from beginning and end

There are four main methods of adding and removing elements from the beginning and end of an array.

### The `push()` method

Use the `push()` method to add an element to the end of an array. The `push()` method returns the new length of the array.

Can add multiple elements at once.

```js
const fruits = ["apple", "banana"];
const newLength = fruits.push("orange"); 
console.log(newLength); // 3
console.log(fruits); // ["apple", "banana", "orange"]
```

### `Const` and arrays

Even though arrays are changeable, you can declare arrays with the `const` keyword as the reference to the assigned value doesn't change. You can't reassign the values of the array like this:

```js
const fruits = ["apple", "banana"];
fruits = ["This", "will", "not", "work"];
console.log(fruits); // Uncaught TypeError: Assignment to constant variable
```

### The `pop()` method

Remove an element from the end of an array with the `pop()` method. The `pop()` method modifies the array and returns the removed value.

Can only remove one element at a time.

```js
let fruits = ["apple", "banana", "orange"];
let fastFruit = fruits.pop();

console.log(fruits); // ["apple", "banana"]
console.log(lastFruit); // "orange"
```

### The `unshift()` method

The `unshift()` method is like the `push()` element but adds and element to the start of the array. The `unshift()` method returns the new length of the array.

Can add multiple elements.

```js
let numbers = [2, 3];
let newLength = numbers.unshift(1);

console.log(numbers); // [1, 2, 3]
console.log(newLength); 3
```

### The `shift()` method

The `shift()` method removes the first element from an array and returns that element; similar the the `pop()` element that does this at the end of an array.

Can only remove one element at a time.

```js
let colors = ["red", "green", "blue"];
let firstColor = colors.shift();

console.log(colors); // ["green", "blue"];
console.log(firstColor); // "red"
```

## Two-dimensional arrays

While one-dimensional arrays can represent a list of items, two-dimensional arrays can represent grids.

In JavaScript, two-dimensional arrays are arrays of arrays. Two indices are used to access an individual value, like `array[0][1]`. 

- the first index is the row (which array)
- the second index is the column (which value)

```js
let chessboard = [
    ["R", "N", "B", "Q", "K", "B", "N", "R"],
    ["P", "P", "P", "P", "P", "P", "P", "P"],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    ["p", "p", "p", "p", "p", "p", "p", "p"],
    ["r", "n", "b", "q", "k", "b", "n", "r"]
];

console.log(chessboard[0][3]); // "Q"
```

## Array destructuring 

Extract values from an array using syntax that's more concise than reassigning values using indices. Name the new variables that will hold values in square brackets followed and assign that to the arrays name.

```js
let fruits = ["apple", "banana", "orange"];

let [first, second, third] = fruits;

console.log(first); "apple"
console.log(second); "banana"
console.log(first); "orange"
```

It's more concise than doing something like:

```js
const first = fruits[0];
const second = fruits[1];
const third = fruits[2];
```

### Skip elements

Array destructuring let's you skip an element using a comma.

```js
let colors = ["red", "green", "blue", "yellow"];
let [firstColor, , thirdColor] = colors;

console.log(firstColor); // "red"
console.log(thirdColor); // "green"
```

### Default values to create more 

You can assign default values for reassigning more values to variables than there are elements in the array.

```js
let numbers = [1, 2];
let [a, b, c = 3] = numbers;

console.log(a); // 1
console.log(b); // 2
console.log(c); // 3
```
We assign default value 3 to c because the numbers array doesn't have a third element.

### Rest syntax 

The three dot `...` rest syntax represent the rest of the elements at the end of an array. 

```js
let fruits = ["apple", "banana", "orange", "mango", "kiwi"];
let [first, second, ...rest] = fruits;

console.log(first); // "apple"
console.log(second); // "banana"
console.log(rest); // ["orange", "mango", "kiwi"]
```

The remaining elements are captured as a new array with the rest of the elements.

## Reverse a string with array and string methods

Strings in JavaScript are immutable, so you can't change a string but create a new one. The following technique gives us a way of reversing a string.

Reverse a string by splitting it into and array, reversing the array, and convert the array back to a string using the methods:

- `split()`
- `reverse()`
- `join()`

### Using `split()`

Create an array by splitting a string, using `split("")`. We pass in an empty string:

```js
let str = "hello"
let charArray = str.split("");

console.log(charArray); // ["h", "e", "l", "l", "o"]
```

### Using `reverse()`

Reverse the newly created array of characters. This modifies the array rather than creating a new one ('reverses an array in place').

```js
let charArray =  ["h", "e", "l", "l", "o"];
charArray.reverse();

console.log(charArray); // ["o", "l", "l", "e", "h"]
```

### Using `join()`

Convert the reversed array into a string to get the original string in reverse. The `join()` method accepts a separator as an argument (empty string means no separator) and returns a new string by concatenating the elements in the array.

```js
let reverseArray =  ["o", "l", "l", "e", "h"];
let reversedString = reversedArray.join("");

console.log(reversedString); // "elloh"
```

### In one step

Chain methods to perform the above steps in one line of code.

```js
let str = "coding";
let reversed = str.split("").reverse().join("");

console.log(reversed);
```
