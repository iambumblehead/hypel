hyperscript-helpers-opts
========================

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
