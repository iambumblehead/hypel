import test from 'node:test'
import assert from 'node:assert/strict'
import { render } from 'inferno'
import { h } from 'inferno-hyperscript'
import { JSDOM } from 'jsdom'
import { hypel } from '../hypel.js'
import htmlRegexpFormat from './htmlRegexpFormat.js'
import classidstrTransform from './classidstrTransform.js'

test('inferno', () => {
  const dom = new JSDOM(
    `<!DOCTYPE html><body><div id="container"></div></body>`)

  global.window = dom.window
  global.document = dom.window.document

  const { div, span, a } = hypel(h)

  render((
    div('#container.two.classes', {
      on: { click: () => console.log('go') }
    }, [
      span('.bold', 'This is bold'), ' and this is just normal text',
      a('.link', { props: { href: "/foo" } }, 'now go places!')
    ])
  ), document.getElementById('container'))
})

const stringydom = (`
  <div>
    <nav id="page-topnav" class="nav">
      <ul class="nav-list">
        <li class="nav-list-item big">main</li>
        <li class="nav-list-item big">faq</li>
      </ul>
    </nav>
    <img id="page-img1" class="img big">
    <img id="page-img2" class="img big">
    <img id="page-img3" class="img small">
    <nav id="page-bottomnav" class="nav">
      <ul class="nav-list">
        <li class="nav-list-item small">phone</li>
        <li class="nav-list-item small">contact</li>
      </ul>
    </nav>
  </div>`)

test('should be compatible with browser dom', () => {
  const dom = new JSDOM(
    `<!DOCTYPE html><body></body>`)

  global.window = dom.window
  global.document = dom.window.document

  const isxspec = xspec => xspec
    && typeof xspec === 'object'
    && 'key' in xspec && 'ui' in xspec
  const tags = hypel(h, args => isxspec(args[1])
    ? [classidstrTransform(args[1], args[0])].concat(args.slice(2)) : args)
  const div = tags.div
  const renderstr = vnode => (
    render(vnode, document.body), document.body.innerHTML)

  const nodespecarr = [{
    key: 'page-topnav',
    prefix: 'nav',
    navitemarr: [ 'main', 'faq' ],
    type: 'big',
    name: 'signin'
  }, {
    key: 'page-img1',
    prefix: 'img',
    type: 'big',
    name: 'fun image 1'
  }, {
    key: 'page-img2',
    prefix: 'img',
    type: 'big',
    name: 'fun image 2'
  }, {
    key: 'page-img3',
    prefix: 'img',
    type: 'small',
    name: 'fun image 3'
  }, {
    key: 'page-bottomnav',
    prefix: 'nav',
    type: 'small',
    name: 'general',
    navitemarr: [ 'phone', 'contact' ]
  }].map(n => Object.assign(n, {
    key: n.key,
    ui: n.type,
    uiroot: n.classNameOverride || n.classNameNode,
    uiprefix: n.name
  }))

  const pagetypes = {
    img: {
      getvnode: (spec, tags) => {
        const {img} = tags

        return (
          img(`#:key.img .${spec.type}`, spec))
      }
    },
    nav: {
      getvnode: (spec, tags) => {
        const {nav, ul, li} = tags

        return (
          nav('#:key.nav', spec, [
            ul('.nav-list', (spec.navitemarr || []).map(navitem => (
              li(`.nav-list-item .${spec.type}`, navitem))
            ))
          ])
        )
      }
    }
  }

  const vnodearr = nodespecarr.map(spec => {
    return pagetypes[spec.prefix].getvnode(spec, tags)
  })

  assert.strictEqual(
    htmlRegexpFormat(renderstr(div([vnodearr]))),
    htmlRegexpFormat(stringydom))
})

test('should be do namespacing', () => {
  const dom = new JSDOM(
    `<!DOCTYPE html><body></body>`)

  global.window = dom.window
  global.document = dom.window.document

  const isxspec = xspec => xspec
    && typeof xspec === 'object'
    && 'key' in xspec
  const tags = hypel(h, args => isxspec(args[1])
    ? [classidstrTransform(args[1], args[0])].concat(args.slice(2)) : args)

  const { div, h1, ul, li } = tags
  const items = [
    { key: 'item1', title: 'item 1!'},
    { key: 'item2', title: 'item 2!'} ]
  const ns = { key: '123' }
  const nsApp = (
    div('#:key-app', ns, [
      h1('hello everybody'),
      ul('#:key-bestest-menu', ns, items.map(item => (
        li('#:key-item-'+item.key, item, item.title))))
    ])
  )

  const renderstr = vnode => (
    render(vnode, document.body), document.body.innerHTML)

  assert.strictEqual(
    htmlRegexpFormat(renderstr(nsApp)), ''
      + '<div id="123-app">\n'
      + '  <h1>\n'
      + '    hello everybody\n'
      + '  </h1>\n'
      + '  <ul id="123-bestest-menu">\n'
      + '    <li id="item1-item-item1">\n'
      + '      item 1!\n'
      + '    </li>\n'
      + '    <li id="item2-item-item2">\n'
      + '      item 2!\n'
      + '    </li>\n'
      + '  </ul>\n'
      + '</div>')
})

const namespacingrootHTML = (`
<div class="root prefix 123">
  <h1>
    hello everybody
  </h1>
  <ul class="prefix 123-bestest-menu">
    <li class="prefix 123-item-item1">
      item 1!
    </li>
    <li class="prefix 123-item-item2">
      item 2!
    </li>
  </ul>
</div>
`).slice(1, -1)

test('should be do namespacing, ui and root', () => {
  const dom = new JSDOM(
    `<!DOCTYPE html><body></body>`)

  global.window = dom.window
  global.document = dom.window.document

  const isxspec = xspec => xspec
    && typeof xspec === 'object'
    && 'ui' in xspec
  const tags = hypel(h, args => isxspec(args[1])
    ? [classidstrTransform(args[1], args[0])].concat(args.slice(2)) : args)
  const { div, h1, ul, li } = tags
  const items = [
    { ui: 'item1', title: 'item 1!'},
    { ui: 'item2', title: 'item 2!'} ]
  const ns = { ui: '123', uiprefix: 'prefix', uiroot: 'root' }
  const nsApp = (
    div('ui:', ns, [
      h1('hello everybody'),
      ul('ui-bestest-menu:', ns, items.map(item => (
        li('ui-item-'+item.ui+':', ns, item.title))))
    ])
  )

  const renderstr = vnode => (
    render(vnode, document.body), document.body.innerHTML)

  assert.deepStrictEqual(
    htmlRegexpFormat(renderstr(nsApp)),
    namespacingrootHTML)
})

test('should do namespacing, :ui and root, sans prefix', () => {
  const dom = new JSDOM(
    `<!DOCTYPE html><body></body>`)

  global.window = dom.window
  global.document = dom.window.document

  const isxspec = xspec => xspec
    && typeof xspec === 'object'
    && 'key' in xspec && 'ui' in xspec
  const tags = hypel(h, args => isxspec(args[1])
    ? [classidstrTransform(args[1], args[0])].concat(args.slice(2)) : args)
  const span = tags.span
  const renderstr = vnode => (
    render(vnode, document.body), document.body.innerHTML)
  const x = {key: 'xkey', ui: 'uiblock'}

  assert.strictEqual(
    renderstr(span('ui:', x, 'hello')),
    '<span>hello</span>')

  assert.strictEqual(
    renderstr(span('ui-author-label:', x, 'hello')),
    '<span>hello</span>')

  assert.strictEqual(
    renderstr(span('ui:#:key', x, 'hello')),
    '<span id="xkey">hello</span>')

  assert.strictEqual(
    renderstr(span('ui:#:key---part', x, 'hello')),
    '<span id="xkey---part">hello</span>')

  assert.strictEqual(
    renderstr(span('ui-author-label:#:key', x, 'hello')),
    '<span id="xkey">hello</span>')

  assert.strictEqual(
    renderstr(span('ui-author-label:#:key---part', x, 'hello')),
    '<span id="xkey---part">hello</span>')
})

test('should do namespacing, :ui and root, with prefix', () => {
  const dom = new JSDOM(
    `<!DOCTYPE html><body></body>`)

  global.window = dom.window
  global.document = dom.window.document

  const isxspec = xspec => xspec
    && typeof xspec === 'object'
    && 'key' in xspec && 'ui' in xspec
  const tags = hypel(h, args => isxspec(args[1])
    ? [classidstrTransform(args[1], args[0])].concat(args.slice(2)) : args)
  const span = tags.span
  const renderstr = vnode => (
    render(vnode, document.body), document.body.innerHTML)
  const x = {key: 'xkey', ui: 'uiblock', uiprefix: 'content'}

  assert.strictEqual(
    renderstr(span('ui:', x, 'hello')),
    '<span class="content uiblock">hello</span>')

  assert.strictEqual(
    renderstr(span('ui-author-label:', x, 'hello')),
    '<span class="content uiblock-author-label">hello</span>')

  assert.strictEqual(
    renderstr(span('ui:#:key', x, 'hello')),
    '<span class="content uiblock" id="xkey">hello</span>')

  assert.strictEqual(
    renderstr(span('ui:#:key---part', x, 'hello')),
    '<span class="content uiblock" id="xkey---part">hello</span>')

  assert.strictEqual(
    renderstr(span('ui-author-label:#:key', x, 'hello')),
    '<span class="content uiblock-author-label" id="xkey">hello</span>')

  assert.strictEqual(
    renderstr(span('ui-author-label:#:key---part', x, 'hello')),
    '<span class="content uiblock-author-label" id="xkey---part">hello</span>')
})

test('should do lazy namespacing', () => {
  const dom = new JSDOM(
    `<!DOCTYPE html><body></body>`)

  global.window = dom.window
  global.document = dom.window.document

  const isxspec = xspec => xspec
    && typeof xspec === 'object'
    && 'key' in xspec && 'ui' in xspec
  const tags = hypel(h, args => isxspec(args[1])
    ? [classidstrTransform(args[1], args[0])].concat(args.slice(2))
    : isxspec(args[0])
      ? args2 => [classidstrTransform(args[0], args2[0])].concat(args2.slice(1))
      : args)
  const renderstr = vnode => (
    render(vnode, document.body), document.body.innerHTML)
  const x = {key: 'xkey', ui: 'uiblock', uiprefix: 'content'}
  const span = tags.span(x)

  assert.strictEqual(
    renderstr(span('ui:', 'hello')),
    '<span class="content uiblock">hello</span>')

  assert.strictEqual(
    renderstr(span('ui-author-label:', 'hello')),
    '<span class="content uiblock-author-label">hello</span>')

  assert.strictEqual(
    renderstr(span('ui:#:key', 'hello')),
    '<span class="content uiblock" id="xkey">hello</span>')

  assert.strictEqual(
    renderstr(span('ui:#:key---part', 'hello')),
    '<span class="content uiblock" id="xkey---part">hello</span>')

  assert.strictEqual(
    renderstr(span('ui-author-label:#:key', 'hello')),
    '<span class="content uiblock-author-label" id="xkey">hello</span>')

  assert.strictEqual(
    renderstr(span('ui-author-label:#:key---part', 'hello')),
    '<span class="content uiblock-author-label" id="xkey---part">hello</span>')
})
