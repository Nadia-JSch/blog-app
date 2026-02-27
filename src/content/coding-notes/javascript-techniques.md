---
title: "JavaScript techniques"
date: "2026-02-22"
description: "Usages discoverd about how JS works from examples and practice."
tags: ["javascript"]
draft: false
---

## Strings: Chaining methods

For example, you can use the repeat and trim methods on the same string, like:

```js
const repeatedLove = "love ".repeat(3).trimEnd();
console.log(repeatedLove);
```

## Numbers: arithmetic techniques

- assign a calculation to a variable: `const difference = 5 - 10;`
- assign numbers to variables and do calculation with the variable names:

```js
const num1 = 10;
const num2 = 5;
const result = num1 - num2
```

## Dot notation and parenthesis object

You can include a numerical (string literals and booleans too) value in parentheses and call a global method on it using dot notation.

```js
console.log((3.14550).toFixed(3)); // "3.146"
```

## Equality between `null` and `undefined`

Recap:
- `undefined` is the value of an uninitiated variable
- `null` is an intentionally blank assignment value

The `null` and `undefined` data types behave differently when they are compared using the loose equality operator and inequality operators. Rather use the strict equality operator.

When using `==`, null and undefined are equal because `==` performs type coercion, but not with `===` which compares values and data types without type coercion. 

```js
console.log(null == undefined); // true
console.log(null === undefined); // false
```

Also, when using `==`, null and undefined are only equal to each other so comparing to en empty string or 0 will be false

```js
console.log(null == 0); // false
console.log(undefined == 0); // false

console.log(null == ''); // false
console.log(undefined == ''); // false
```

### null and inequality

But `null` has a quirk when using the greater than comparisons. `null `converts to `0`in numeric contexts, which may result in unexpected behavior in numeric comparisons:

```js
console.log(null > 0); // false
console.log(null == 0) // false
console.log(null >= 0); // true!!! (0 >= 0 is true)
```

### undefined and inequality

`undefined` converts to `NaN` in numerical contexts so all comparisons return false

```js
console.log(undefined > 0); // false
console.log(undefined < 0); // false
console.log(undefined == 0); // false
```

## Switch statements 

Switch statements are typically used when comparing one value with multiple possible value – more readable than if-else chains in this case.

The `break` is important to stop the rest of the cases executing in 'fall-through'.

Switch statements use strict comparison to prevent type coercion bugs.

Don't forget the `default` case at the end to catch anything that doesn't match any of the cases.

```js
let dayOfWeek = 3;

switch (dayOfWeek) {
    case 1:
        console.log("It's Monday!");
        break;
    case 2:
        console.log("It's Tuesday!");
        break;
    case 3:
        console.log("It's Wednesday!");
        break;
    default:
        console.log("Invalid day! Enter a number between 1 and 3.");
}
```

### Switch compared to if-else chains

`If-else if` statements are more flexible for complex comparisons and multiple conditions.

```js
let creditScore = 720; 
let annualIncome = 60000; 
let loanAmount = 200000; 

let eligibilityStatus;

if (creditScore >= 750 && annualIncome >= 80000) {
    eligibilityStatus = "Eligible for premium loan rates.";
} else if (creditScore >= 700 && annualIncome >= 50000) {
    eligibilityStatus = "Eligible for standard loan rates.";
} else if (creditScore >= 650 && annualIncome >= 40000) {
    eligibilityStatus = "Eligible for subprime loan rates.";
} else if (creditScore < 650) {
    eligibilityStatus = "Not eligible due to low credit score.";
} else {
    eligibilityStatus = "Not eligible due to insufficient income.";
}

console.log(eligibilityStatus);
```

## Review: comparing null and undefined + switch vs. if-else if

https://www.freecodecamp.org/learn/javascript-v9/review-javascript-comparisons-and-conditionals/review-javascript-comparisons-and-conditionals

## Functions

### Returning undefined by not give an else value

If you don't provide an `else` in and if-else statement, the else condition is implicit and returns `undefined`:

```js
function getLoanMessage(annualIncome, creditScore) {
  if(creditScore >= minCreditScoreForDuplex && annualIncome >= minIncomeForDuplex) {
    return "You qualify for a duplex, condo, and car loan."
  }
  
}
```