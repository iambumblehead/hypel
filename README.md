hypel
=====

`hypel` creates dom elements with vanilla javascript
``` javascript
div('#app', [
  h1('hello everybody'),
  ul('#bestest-menu', items.map(item => (
    li('#item-'+item.id, attrs(item.id), item.title))))
])
```

`hypel` is used with vdom implementations such as `react` or  `inferno`. A compact example,
``` javascript
import hypel from 'hypel'
import { h } from 'inferno-hyperscript'
import { render } from 'inferno'

const { div, span, a } = hypel(h)

render(
  div('#container.two.classes', {
    // note: syntax for classNames, attributes and other
    // details differ depending upon virtual-dom library
    on: { click: () => console.log('go') }
  }, [
    span('.bold', 'This is bold'), ' and this is just normal text ',
    a('.link', { props: { href: "/foo" } }, 'now go places!')
  ]), document.getElementById('container'))
// <div class="two classes" id="container">
//   <span class="bold">This is bold</span> and this is just
//   normal text <a class="link">now go places!</a>
// </div>
```

`hypel` includes a namespace feature that renders className and id attibutes from namespace values as below. Import `hypelns` or `hypelnssvg` to use this feature,
``` javascript
import { hypelns } from 'hypel'
import { h } from 'inferno-hyperscript'

const { div, h1, ul, li } = hypelns(h)
const ns = { uid: '123' } // use any key namea
const items = [
  { id: 'item1', title: 'item 1!'},
  { id: 'item2', title: 'item 2!'}]

div(ns, '#:uid-app', [
  h1(ns, 'hello everybody'),
    ul(ns, '#:uid-bestest-menu', items.map(item => (
      li(ns, '#:uid-item-'+item.id, item.title))))
  ])
)
// <div id="123-app">
//   <h1>hello everybody</h1>
//   <ul id="123-bestest-menu">
//     <li id="123-item-item1">item 1!</li>
//     <li id="123-item-item2">item 2!</li>
//   </ul>
// </div>
```

--------------------------------------------
### Credit

Credit to [Ossi Hanhinen](https://github.com/ohanhi) and his [hyperscript-helpers package.](https://github.com/ohanhi/hyperscript-helpers) This package was created from hyperscrpt-helpers when that package was no longer maintaind and incompatible with the esm-bundling strategy I used.

This package adds to the original hyperscript-helpers in these ways,
 * exports an esm module and declares "module" type in the package.json,
 * exports a single file,
 * uses node-native test-runner,
 * examples demonstrate more vdom packages; snabbdom, inferno and react,
 * adds a namespacing feature,
 * adds github ci for tests,
 * smaller package size


[0]: http://www.bumblehead.com                            "bumblehead"

![scrounge](https://github.com/iambumblehead/scroungejs/raw/main/img/hand.png)

(The MIT License)

Copyright (c) [Bumblehead][0] <chris@bumblehead.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
