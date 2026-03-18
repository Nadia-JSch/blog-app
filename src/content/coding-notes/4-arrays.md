---
title: "JavaScript 4: Arrays and Array Methods"
date: "2026-02-22"
description: "Creating and manipulating arrays in JavaScript"
tags: ["javascript"]
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

Convert the reversed array into a string to get the original string in reverse. 

The `join()` method accepts a separator as an argument (empty string means no separator) and returns a new string by concatenating the elements in the array.

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

## The `indexOf()` method for arrays

With arrays, the `indexOf()` method returns the index of the first match, otherwise returns `-1` if the array does not contain the searched-for value. A second, optional, argument can be passed of which index to start searching from. 

Basic syntax:

```js
array.indexOf(element, fromIndex);
```

```js
let fruits = ["apple", "banana", "orange", "banana"];
let index = fruits.indexOf("banana"); 

console.log(index); // 1
```

## The `splice()` method for arrays

Use the versatile `splice()` method to add and remove elements from the middle of the array and more. The `splice()` method mutates the original array so create a copy of the original if needed. Features of the `splice()` method:

- Returns an array of the removed elements.
- Basic syntax with the second argument for number of items to remove being optional. If not provided, all items to the end of the array will be removed.
- You can use `splice()` to simultaneously add and remove items.
- The `splice()` method is less efficient for large arrays as items may need to be shifted. freeCodeCamp recommends using methods that add and remove elements to the beginning and end of large arrays, like push(), pop(), unshift(), and shift().

```js
array.splice(startIndex, [numItemsToRemove], [itemToAdd1], [itemToAdd2]);
```

### Use `splice()` to remove elements from the middle of an array

For example,

```js
let fruits = ["apple", "banana", "orange", "mango", "kiwi"];
let removed = fruits.splice(2, 2);

console.log(fruits); // ["apple", "banana", "kiwi"]
console.log(removed); // ["orange", "mango"]
```

### Use `splice()` to add elements to the middle of an array 

In the example, the second argument for number of elements to remove is `0` and the elements to add to the first index of the array onwards are given.

```js
let colors = ["red", "green", "blue"];
colors.splice(1, 0, "yellow", "purple");

console.log(colors); // ["red", "yellow", "purple", "green", "blue"]
```

### Use `splice()` to simultaneously add and remove items

For example, remove `2` and `3` and add `6`, `7`, and `8`:

```js
let numbers = [1, 2, 3, 4, 5];
numbers.splice(1, 2, 6, 7, 8);

console.log(numbers); // [1, 6, 7, 8, 4, 5]
```

### Use the spread operator (`...`) to copy items of an original array

The spread operator makes a 'shallow' copy of elements. 

```js
let original = [1, 2, 3, 4, 5];
let copy = [...original];

copy.splice(2, 1, 6);

console.log(original); // [1, 2, 3, 4, 5]
console.log(copy); // [1, 2, 6, 4, 5]
```

### Use `splice()` and `indexOf()` to remove a single element from and array

Removing a single element from an array when it's index is known is a common use case for `splice()`.

Use `indexOf()` to find the index of the element `orange` in the array – it returns index `1`. We added a condition to check if there is a match before removing the element `orange` using `splice()`:

```js
let fruits = ["apple", "banana", "orange", "mango"];
let indexToRemove = fruits.indexOf("orange");

if (indexToRemove !== -1) {
    fruits.splice(indexToRemove, 1);
}

console.log(fruits); // ["apple", "banana", "mango"]
```

### Use the `splice()` method to remove all elements of an array

For example:

```js
let array = [1, 2, 3, 4, 5];
array.splice(0);

console.log(array); // []
```

## Use `includes()` to check if an array contains a certain value

The method is useful if you don't need to know the index of the value and saves you from searching through an array using more complex loops and conditionals.

The `includes()` method takes a case-sensitive argument and returns a boolean value of `true` or `false`. 

```js
let fruits = ["apple", "banana", "orange", "mango"];
console.log(fruits.includes("banana")); // true
console.log(fruits.includes("grape")); // false
```

A second optional argument specifying the index to start the search from can be used. In the example, `30` appears twice so the first `console.log()` returns `true`.

```js
let numbers = [10, 20, 30, 40, 50, 30, 60];
console.log(numbers.includes(30, 3)); // true
console.log(numbers.includes(30, 4)); // true
```

The `includes()` method uses the strict equality operator to find a match and considers the string `"2"` different from the number `2`.

```js
let mixedArray = [1, "2", 3, "4", 5];
console.log(mixedArray.includes(2)); // false
console.log(mixedArray.includes("2")); // true
```

## Shallow array copies

Arrays are 'deeper' if they nest another array within them, and 'shallow' if the array consists of primitive elements. 

Making a copy of a shallow array means that the new copy is completely separate from the original array. There are three common methods for creating a shallow copy outlined below: `concat()`, `splice()`, and the spread operator `...`. The spread operator seems the most straightforward to me, followed by `splice()`.

Making a copy of a deep array means the new copy is still linked to the original array through the nested array. If you change something in the shared inner array, you'll see the change in the copy and the original. 

Shallow copies are helpful for modifying the top-level structure of an array without modifying the original or inner array. You create new arrays that can be manipulated independently of the original array.

### Use the `concat()` method to create a shallow array copy 

Merge an empty array with an original array using `concat()` to create a shallow copy of an array. The new and original arrays will have the same elements but are different array objects, which is why the strict equality operator `===` returns `false`.

```js
const originalArray = [1, 2, 3];
const copyArray = [].concat(originalArray);

console.log(copyArray); // [1, 2, 3]
console.log(copyArray === originalArray); // false, same elements but a different array
```

### Use the `slice()` methods to create a shallow array copy

The `slice()` operator returns a shallow copy of an array when called without arguments. The copy contains the same elements but is a different array object.

```js
const originalArray = [1, 2, 3];
const copyArray = originalArray.slice();

console.log(copyArray); // [1, 2, 3]
console.log(copyArray === originalArray); // false
```

### Use the spread operator `...` to create a shallow array copy

The spread operator was introduced in ES6 and is a concise way to create shallow array copies. 

```js
const originalArray = [1, 2, 3];
const copyArray = [...originalArray];

console.log(copyArray); // [1, 2, 3]
console.log(copyArray === originalArray); //false
```

## Array review 

[Review JS arrays on freeCodeCamp](https://www.freecodecamp.org/learn/javascript-v9/review-javascript-arrays/review-javascript-arrays)
