import test from 'node:test'
import assert from 'node:assert/strict'
import { render } from 'inferno'
import { h } from 'inferno-hyperscript'
import { JSDOM } from 'jsdom'
import { hypel, hypelns } from '../hypel.js'
import htmlRegexpFormat from './htmlRegexpFormat.js'

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

test.only('should be compatible with browser dom', () => {
  const dom = new JSDOM(
    `<!DOCTYPE html><body></body>`)

  global.window = dom.window
  global.document = dom.window.document

  const hcreator = h => (nd, subj) => h({
    key: nd.key,
    ui: nd.type,
    uiroot: nd.classNameOverride || subj.classNameNode,
    uiprefix: nd.name
  })

  const tagsCreate = spec => hcreator(hypelns(h))(spec, {})
  const tags = tagsCreate({key: 'ndkey', type: 'uiblock', name: 'content'}, {})
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
  }]

  const pagetypes = {
    img: {
      getvnode: (spec, h) => {
        const {img} = h(spec)

        return (
          img(`#:key.img .${spec.type}`))
      }
    },
    nav: {
      getvnode: (spec, h) => {
        const {nav, ul, li} = h(spec)

        return (
          nav('#:key.nav', [
            ul('.nav-list', (spec.navitemarr || []).map(navitem => (
              li(`.nav-list-item .${spec.type}`, navitem))
            ))
          ])
        )
      }
    }
  }

  const vnodearr = nodespecarr.map(spec => {
    return pagetypes[spec.prefix].getvnode(spec, tagsCreate)
  })

  assert.strictEqual(
    htmlRegexpFormat(renderstr(tags.div([vnodearr]))),
    htmlRegexpFormat(stringydom))
})

test('should be do namespacing', () => {
  const dom = new JSDOM(
    `<!DOCTYPE html><body></body>`)

  global.window = dom.window
  global.document = dom.window.document

  const { div, h1, ul, li } = hypelns(h)
  const items = [
    { key: 'item1', title: 'item 1!'},
    { key: 'item2', title: 'item 2!'} ]
  const ns = { key: '123' }
  const nsApp = (
    div(ns, '#:key-app', [
      h1(ns, 'hello everybody'),
      ul(ns, '#:key-bestest-menu', items.map(item => (
        li(ns, '#:key-item-'+item.key, item.title))))
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
      + '    <li id="123-item-item1">\n'
      + '      item 1!\n'
      + '    </li>\n'
      + '    <li id="123-item-item2">\n'
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

  // uiroot should be added no-matter what
  // 'uiprefix' should become, simply, 'ui'
  // format is changed ui: ui-item:
  // if no 'ui' value is provided, remove any match
  const { div, h1, ul, li } = hypelns(h)
  const items = [
    { ui: 'item1', title: 'item 1!'},
    { ui: 'item2', title: 'item 2!'} ]
  const ns = { ui: '123', uiprefix: 'prefix', uiroot: 'root' }
  const nsApp = (
    div(ns, 'ui:', [
      h1(ns, 'hello everybody'),
      ul(ns, 'ui-bestest-menu:', items.map(item => (
        li(ns, 'ui-item-'+item.ui+':', item.title))))
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

  const hcreator = h => (nd, subj) => h({
    key: nd.key,
    ui: nd.type,
    uiroot: nd.classNameOverride || subj.classNameNode,
    uiprefix: nd.name
  })

  const span = hcreator(hypelns(h))(
    { key: 'ndkey', type: 'uiblock' }, {}).span
  const renderstr = vnode => (
    render(vnode, document.body), document.body.innerHTML)

  assert.strictEqual(
    renderstr(span('ui:', 'hello')),
    '<span>hello</span>')

  assert.strictEqual(
    renderstr(span('ui-author-label:', 'hello')),
    '<span>hello</span>')

  assert.strictEqual(
    renderstr(span('ui:#:key', 'hello')),
    '<span id="ndkey">hello</span>')

  assert.strictEqual(
    renderstr(span('ui:#:key---part', 'hello')),
    '<span id="ndkey---part">hello</span>')  

  assert.strictEqual(
    renderstr(span('ui-author-label:#:key', 'hello')),
    '<span id="ndkey">hello</span>')

  assert.strictEqual(
    renderstr(span('ui-author-label:#:key---part', 'hello')),
    '<span id="ndkey---part">hello</span>')  
})

test('should do namespacing, :ui and root, with prefix', () => {
  const dom = new JSDOM(
    `<!DOCTYPE html><body></body>`)

  global.window = dom.window
  global.document = dom.window.document

  const hcreator = h => (nd, subj) => h({
    key: nd.key,
    ui: nd.type,
    uiroot: nd.classNameOverride || subj.classNameNode,
    uiprefix: nd.name
  })

  const span = hcreator(hypelns(h))(
    { key: 'ndkey', type: 'uiblock', name: 'content' }, {}).span
  const renderstr = vnode => (
    render(vnode, document.body), document.body.innerHTML)

  assert.strictEqual(
    renderstr(span('ui:', 'hello')),
    '<span class="content uiblock">hello</span>')

  assert.strictEqual(
    renderstr(span('ui-author-label:', 'hello')),
    '<span class="content uiblock-author-label">hello</span>')

  assert.strictEqual(
    renderstr(span('ui:#:key', 'hello')),
    '<span class="content uiblock" id="ndkey">hello</span>')

  assert.strictEqual(
    renderstr(span('ui:#:key---part', 'hello')),
    '<span class="content uiblock" id="ndkey---part">hello</span>')  

  assert.strictEqual(
    renderstr(span('ui-author-label:#:key', 'hello')),
    '<span class="content uiblock-author-label" id="ndkey">hello</span>')

  assert.strictEqual(
    renderstr(span('ui-author-label:#:key---part', 'hello')),
    '<span class="content uiblock-author-label" id="ndkey---part">hello</span>')
})
