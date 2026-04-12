---
title: "JavaScript 4: Arrays and Array Methods"
date: "2026-03-23"
description: "Working with objects in JavaScript"
tags: ["javascript"]
draft: true
---

Almost everything in JavaScript is an object or can be treated as one. Functions, arrays, and even primitive data types like strings and numbers when used in certain ways can behave like an object.

Think of an object as a filing cabinet that holds information. 

The information consists of properties made up of a name (or key) and a value

```js
const exampleObject = {
    propertyName: value,
};
```

Unlike JSON, the name/key isn't within quotation marks.

## Access properties with dot notation

Dot notation is a common and straightforward way to access properties in objects. 

Basic syntax: `objectName.propertyName`

For example,

```js
const person = {
    name: "Alice",
    age: 30,
    city: "New York"
};

console.log(person.name); // Alice
console.log(person.age); // 30
```

## Access properties with bracket notation

Bracket notation lets you use variables, strings with spaces, and names starting with numbers (or special characters) to access object properties. 

You can:
- use the property name as a string, like `object["name"]`
- use a property name containing spaces
- dynamically update the name using a variable

For example:

```js
const person = {
    name: "Alice",
    age: 30,
    city: "New York",
    "property with spaces": "hi"
};

console.log(person["name"]); // Alice
console.log(person["property with spaces"]); // hi

let propertyName = "city";
console.log(person[propertyName]); // New York
```

## Remove array properties: the `delete` operator

Using the `delete` operator to remove a property is a straightforward and common approach.

The operator is followed by a space and the property accessed via dot notation, like `delete object.property`. For example:

```js
const person = {
    name: "Alice",
    age: 30,
    job: "Engineer"
};

delete person.job;

console.log(person.job); // undefined

```

## Remove array properties: destructing assignment with rest parameters

This approach creates a new object without the property rather than removing the property from the original object. 

For example, you can delete the `job` and `city` property as follows:

```js
const person = {
    name: "Bob",
    age: 25,
    job: "Designer",
    city: "New York"
};

const { job, city, ...remainingProperties } = person;

console.log(remainingProperties); // // { name: "Bob", age: 25 }
```

We use destructuring to extract `job` and `city` from the person object, and collect the remaining properties into a new object called `remainingProperties`.

## Check if an object has a property


