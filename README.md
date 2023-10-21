hypel
=====

## What is it

**hyperscript-helpers** [elm-html](https://github.com/elm-lang/html/) inspired helpers for writing
[hyperscript](https://github.com/dominictarr/hyperscript) or [virtual-hyperscript](https://github.com/Matt-Esch/virtual-dom/tree/master/virtual-hyperscript).

They work with `React.createElement`, but there is also a feature-rich hyperscript library for React:
[react-hyperscript](https://github.com/mlmorg/react-hyperscript).

```javascript
// instead of writing
h('div')

// write
div()

// instead of writing
h('section#main', mainContents)

// write
section('#main', mainContents)
```

## hyperscript-helpers vs templates (including JSX)

With **hyperscript-helpers**:

* It's nice to use functional utilities like lodash, because it's just functions
* You get errors if you misspell a tag name, because they are function names
* You have a consistent syntax at all times, because markup is just functions
* Also, it's just functions

This is super helpful, especially when using **hyperscript-helpers** with [Cycle.js](http://cycle.js.org/)!

See the supported `TAG_NAMES` here: [src/index.js](src/index.js).

#### Example

Suppose we have a list of menu items of:

`{ title: String, id: Number }`

and a function that returns attributes given an id:

```javascript
function attrs(id) {
  return { draggable: "true", "data-id": id };
}
```

How would we render these in plain hyperscript, JSX or with the helpers?

```javascript
// plain hyperscript
h('ul#bestest-menu', items.map( item =>
  h('li#item-'+item.id, attrs(item.id), item.title))
);

// JSX
<ul id="bestest-menu">
  {items.map( item =>
    <li id={"item-"+item.id} {...attrs(item.id)}>{item.title}</li>
  )}
</ul>

// hyperscript-helpers
ul('#bestest-menu', items.map( item =>
  li('#item-'+item.id, attrs(item.id), item.title))
);
```

## How to use

```
npm install hyperscript-helpers
```

The **hyperscript-helpers** are hyperscript-agnostic, which means there are no dependencies.
Instead, you need to pass the implementation when you import the helpers.

Using ES6 :sparkling_heart:

```js
const h = require('hyperscript'); // or 'virtual-hyperscript'
const { div, span, h1 } =
  require('hyperscript-helpers')(h); // ← Notice the (h)
```

With React

```js
// ✅ Preferred
const h = require('react-hyperscript');
const React = require('react');
const { div, span, h1 } =
  require('hyperscript-helpers')(h); // ← Notice the (h)


// Also works, but beware of the createElement API
const React = require('react');
const { div, span, h1 } =
  require('hyperscript-helpers')(React.createElement); // ← Notice the (React.createElement)
```

Using ES5

```js
var h = require('hyperscript'); // or 'virtual-hyperscript'
var hh = require('hyperscript-helpers')(h);  // ← Notice the (h)
// to use the short syntax, you need to introduce them to the current scope
var div  = hh.div,
    span = hh.span,
    h1   = hh.h1;
```

Once that's done, you can go and use the terse syntax:

```js
$ node
▸ const hh = require('hyperscript-helpers')(require('hyperscript'));
◂ undefined

▸ const { div, span, h1 } = hh;
◂ undefined

▸ span('😍').outerHTML
◂ '<span>😍</span>'

▸ h1({ 'data-id': 'headline-6.1.2' }, 'Structural Weaknesses').outerHTML
◂ '<h1 data-id="headline-6.1.2">Structural Weaknesses</h1>'

▸ div('#with-proper-id.wrapper', [ h1('Heading'), span('Spanner') ]).outerHTML
◂ '<div class="wrapper" id="with-proper-id"><h1>Heading</h1><span>Spanner</span></div>'
```

It's also natively supported to spell the helper function names with an uppercase first
letter, for example to avoid conflicts with existing variables or reserved
JavaScript keywords:

```js
▸ const { Span, Var } = hh;
◂ undefined

▸ Span('😍').outerHTML
◂ '<span>😍</span>'

▸ Var('x').outerHTML
◂ '<var>x</var>'
```

Creating custom HTML tag names can be done with the `createTag` function:

```js
▸ const someFn = hh.createTag('otherTag');
◂ undefined

▸ someFn('bla').outerHTML
◂ '<otherTag>bla</otherTag>'
```

## API

Because **hyperscript-helpers** are hyperscript-agnostic there is no "exact" API.
But, just to give you a direction of what should be possible:

```js
tagName(selector)
tagName(attrs)
tagName(children)
tagName(attrs, children)
tagName(selector, children)
tagName(selector, attrs, children)
```

Where
* `tagName` is a helper function named like the HTML element that it creates; **hyperscript-helpers** natively supports spelling the tag name with the first letter lowercase or uppercase.
* `selector` is string, starting with "." or "#".
* `attrs` is an object of attributes.
* `children` is a hyperscript node, an array of hyperscript nodes, a string or an array of strings.

**hyperscript-helpers** is a collection of wrapper functions, so the syntax of your exact hyperscript library
(like [virtual-hyperscript](https://github.com/Matt-Esch/virtual-dom/tree/master/virtual-hyperscript)) still applies.

For example, for multiple classes:

```js
// ... with Matt-Esch/virtual-dom/.../virtual-hyperscript
button({className: "btn btn-default"}); // ← separated by space!
button(".btn.btn-default");             // ← separated by dot!
```

Other hyperscript libraries may have other syntax conventions.





Define hyperscript className and id attributes dynamically.

```javascript
import h from 'virtual-dom/h';
import hh from 'hyperscript-helpers-opts'

const hho = hh(h)({
  uid : 'page-img',
  type : 'big'
});
  
hho.img('#:uid.img.:type');
// <img id="page-img" class="img big">
```

hyperscript-helpers functions are defined with an object that is used to populate dynamic regions of the className and id string..


[0]: http://www.bumblehead.com                            "bumblehead"

![scrounge](https://github.com/iambumblehead/scroungejs/raw/main/img/hand.png)

(The MIT License)

Copyright (c) [Bumblehead][0] <chris@bumblehead.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
