These examples should basically work, but some parts are copy/pasted without testing and may not be perfect. Inferno and React are listed at the top, because they are actively maintained.

_inferno_
``` javascript
import hypel from 'hypel'
import { h } from 'inferno-hyperscript'
import { render } from 'inferno'

const { div, span, a } = hypel(snabbdom.h)

render(
  div('#container.two.classes', {
    // note: syntax for classNames, attributes and other
    // details differ depending upon virtual-dom library
    on: { click: () => console.log('go') }
  }, [
    span('.bold', 'This is bold'), ' and this is just normal text',
    a('.link', { props: { href: "/foo" } }, 'now go places!')
  ]), document.getElementById('container'))
```

_react_
``` javascript
import hypel from 'hypel'
import React from 'react'

const { div, span, a } = hypel(React.createElement)

ReactDOM.createRoot(document.getElementById('container)).render(
  div('#container.two.classes', {
    // note: syntax for classNames, attributes and other
    // details differ depending upon virtual-dom library
    on: { click: () => console.log('go') }
  }, [
    span('.bold', 'This is bold'), ' and this is just normal text',
    a('.link', { props: { href: "/foo" } }, 'now go places!')
  ])
)
```

_snabbdom_
``` javascript
import hypel from 'hypel'
import snabbdom from 'snabbdom'

const { div, span, a } = hypel(snabbdom.h)

snabbdom.init([])(document.getElementById('container'), (
  div('#container.two.classes', {
    // note: syntax for classNames, attributes and other
    // details differ depending upon virtual-dom library
    on: { click: () => console.log('go') }
  }, [
    span('.bold', 'This is bold'), ' and this is just normal text',
    a('.link', { props: { href: "/foo" } }, 'now go places!')
  ])
))
```

_virtual-dom_
``` javascript
import hypel from 'hypel'
import virtualdomh from 'virtual-dom/h.js'
import createElement from 'virtual-dom/create-element'

const { div, span, a } = hypel(virtualdomh)

document.body.appendChild(createElement(
  div('#container.two.classes', {
    // note: syntax for classNames, attributes and other
    // details differ depending upon virtual-dom library
    on: { click: () => console.log('go') }
  }, [
    span('.bold', 'This is bold'), ' and this is just normal text',
    a('.link', { props: { href: "/foo" } }, 'now go places!')
  ])
))
```
