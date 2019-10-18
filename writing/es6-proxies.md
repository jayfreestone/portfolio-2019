---
title: ES6 Proxies
date: 2019-01-14
excerpt: I recently discovered ES6 proxies, essentially a means to intercept properties accessors and methods and either override or extend them.
layout: layouts/post.njk
tags:
  - writing
---

I recently discovered [ES6 proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy), which are defined by MDN as:

> The Proxy object is used to define custom behaviour for fundamental operations (e.g. property lookup, assignment, enumeration, function invocation, etc).

Essentially they provide a means to intercept properties accessors and methods and either override or extend them.

Imagine you had an array that needed to notify part of your application when a new value was pushed into it:

```javascript
const fruit = ['apple', 'orange'];
fruit.push('pear'); // Need to run callback
```
    
Traditionally you would want to define an interface for modifying these values that didn't rely on the array methods directly:

```javascript
// Not exactly robust, but you get the idea
const fruitManager = {
  fruits: ['apple', 'orange'],
  add(fruit) {
    this.fruits.push(fruit);
    return fruitManager;
  },
};
```

However if you weren't in a position to define an interface, perhaps due to legacy code, or simply needed to debug/trace changes, then there isn't an obvious way of intercepting the call and extending it *without* redefining `push` on the array and re-implementing it, which is far from ideal.

The easiest solution I could think of was sub-classing `Array` and overriding the `push` method:

```javascript
function logOnPush(arr) {
  class SubArray extends Array {
    constructor(...args) { 
      super(...args); 
    }
    push(...args) {
      console.log(`We have a push: ${args.toString()}`);
      return super.push(...args);
    }
  }
  return new SubArray(...arr);
}

const fruit = logOnPush(['apple', 'orange']);
```

This way all method calls are run through `SubArray` and then passed to `Array` if they don't exist. Since we override `push`, our version is called instead, and our logging is run. Then we simply run the original `push` method on the parent `Array` class.

However ES6 Proxies actually provide a native solution that doesn't rely on overriding the method, but enables you to intercept `all` methods and accessors as you see fit. We could re-implement the above as a Proxy like so:

```javascript
function logOnPush(arr) {
  return new Proxy(arr, {
    get(target, propKey, receiver) {
      const targetValue = Reflect.get(target, propKey, receiver);

      if (typeof targetValue === 'function') {
        return function(...args) {
          if (propKey === 'push') {
            console.log(`We have a push: ${args.toString()}`);
          }
          return targetValue.apply(this, args);
        };
      }
  
      return targetValue;
      },
  });
}
```

The `get` method is run every time a method is called or a property is accessed, and is passed the target (the original array/object), the requested key (e.g. `push`) and the receiver (the object on which it was called, here the proxy instance).

We check if the requested property is a function named 'push', and if so we implement the logging. Regardless we return the results of running the original method:

```javascript
if (propKey === 'push') {
  console.log(`We have a push: ${args.toString()}`);
}
return targetValue.apply(this, args);
```

Since the proxy's getter is called *every* time a property or method is accessed on the target (even if it doesn't exist), this also provides the perfect opportunity to intercept invalid calls:

```javascript
// Invalid method
const fruit = [];
fruit.addItem('melon');

// ...

// Inside Proxy
if (propKey === 'addItem') {
  // Pass through to 'push'
  Reflect
    .get(target, 'push', receiver)
    .apply(this, args);
}
```

This is very similar to how 'magic methods' in languages like PHP work, with `__get()` intercepting every call and providing a hook for parsing and evaluating dynamic method names that don't directly map to methods or properties on the source class/object (something that Gimeno [explores in more detail](https://medium.com/dailyjs/how-to-use-javascript-proxies-for-fun-and-profit-365579d4a9f8)). However magic methods are [famously contentious](http://jamie-wong.com/2013/07/12/grep-test/), since they fail the Grep Test:

> The Grep Test: If any code declares or makes use of a function, class, module, or variable that cannot be located by grepping for its full identifying token, it fails the Grep Test.

It is nearly always better to be explicit than to try and be overly clever and dynamically 'guess' intent. For one, you lose many of the benefits of IDE completion, since methods are not statically analysable, and code can become a lot harder to parse since there is not a clear traceable execution path. 

For this reason you're probably better off implementing a static interface instead of using a Proxy, however as [Csaba](https://github.com/gergob/jsProxy/blob/master/02-private-properties.js) notes there are times when consistency of variable/property naming can make this useful:

```javascript
if (prop.indexOf('_') !== 0) {
  // Proceed
else { 
  // We have a private property
}
```

While there are a variety of [interesting workarounds](http://exploringjs.com/es6/ch_classes.html#sec_private-data-for-classes) for storing private data and methods on classes, a Proxy is a neat solution. As long as all private properties are prefixed with an underscore (or consistent delimiter), it's possible to intercept method calls and refuse access.

```javascript
class MyClass {
  constructor() {
    return new Proxy(this, this);
  }
  get(target, propKey, receiver) {
    if (propKey.indexOf('_') === 0) return;
    return Reflect.get(target, propKey, receiver);
  }
  _privateMethod() {
    return 'This is a private method';
  }
  publicMethod() {
    return 'This is a public method';
  }
}
```

While this prevents their use, it doesn't stop people inspecting the source class by logging out `MyClass` and looking at the original handler, which will contain all the prefixed methods, and so is hardly 'privacy'. Nevertheless, it does demonstrate how powerful proxies can be in intercepting calls.
