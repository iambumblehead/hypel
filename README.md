hyperscript-helpers-opts
========================

Easily define className and id attributes dynamically.

```javascript
var pageopt = {
  uid : 'page-img',
  type : 'big'
};
h = require('virtual-dom/h');
hho = require('hyperscript-helpers-opts')(h);
hho.imgo(pageopt, '#:uid.img.:type');
// <img id="page-img" class="img big">
```

Original hyperscript-helpers functions are defined along with new functions
affixed with 'o' which use object and string as first and second parameters.

This is helpful for reusing and recomposing page object functions, for which
each object requires unique id and className attributes only.
