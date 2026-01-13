hypel
=====

[![npm][1]][2] [![install size][3]][4]

[1]: https://img.shields.io/npm/v/hypel "hypel npm, badge"
[2]: https://www.npmjs.com/package/hypel "hypel npm, link"
[3]: https://packagephobia.now.sh/badge?p=hypel "hypel size, badge"
[4]: https://packagephobia.now.sh/result?p=hypel "hypel size, link"

`hypel` creates dom elements with vanilla javascript
```javascript
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

### hook

`hypel` includes a hook feature, so that tag function arguments can be transformed through a hook. (try it out to see how it works)
```javascript
const tags = hypel(h, args => transformArgs(args))
```

--------------------------------------------
### Credit

Credit to [Ossi Hanhinen](https://github.com/ohanhi) and his [hyperscript-helpers package.](https://github.com/ohanhi/hyperscript-helpers) This package was created from hyperscrpt-helpers when that package was no longer maintaind and incompatible with the esm-bundling strategy I used.

This package adds to the original hyperscript-helpers in these ways,
 * exports an esm module and declares "module" type in the package.json,
 * exports a single file,
 * uses node-native test-runner,
 * examples demonstrate more vdom packages; snabbdom, inferno and react,
 * adds a hook feature,
 * adds github ci for tests,
 * smaller package size


[0]: https://bumblehead.com                            "bumblehead"

![scrounge](https://github.com/iambumblehead/scroungejs/raw/main/img/hand.png)
