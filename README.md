hyperscript-helpers-opts
========================
**(c)[Bumblehead][0] 2016**

Define hyperscript className and id attributes dynamically.

```javascript
h = require('virtual-dom/h');
hho = require('hyperscript-helpers-opts')(h);
  
opt = { uid : 'page-img', type : 'big' };
hho.imgo(pageopt, '#:uid.img.:type');
// <img id="page-img" class="img big">
```

Original hyperscript-helpers functions are defined along with new functions
affixed with 'o' that use object and string as first and second parameters.

This is helpful for reusing and recomposing page object functions, for which
each object requires unique id and className attributes only.


[0]: http://www.bumblehead.com                            "bumblehead"

![scrounge](https://github.com/iambumblehead/scroungejs/raw/master/img/hand.png)

(The MIT License)

Copyright (c) 2012-2016 [Bumblehead][0] <chris@bumblehead.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
