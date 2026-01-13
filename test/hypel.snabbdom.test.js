import test from 'node:test'
import assert from 'node:assert/strict'

import { JSDOM } from 'jsdom'
import { hypel } from '../hypel.js'
import htmlRegexpFormat from './htmlRegexpFormat.js'
import classidstrTransform from './classidstrTransform.js'

test('snabbdom', async () => {
  const dom = new JSDOM(
    `<!DOCTYPE html><body><div id="container"></div></body>`)

  global.window = dom.window
  global.document = dom.window.document

  const snabbdom = await import('snabbdom')
  const { div, span, a } = hypel(snabbdom.h)

  snabbdom.init([])(document.getElementById('container'), (
    div('#container.two.classes', {
      on: { click: () => console.log('go') }
    }, [
      span('.bold', 'This is bold'), ' and this is just normal text',
      a('.link', { props: { href: "/foo" } }, 'now go places!')
    ])
  ))
})

test('should be compatible with browser dom', async () => {
  const dom = new JSDOM(
    `<!DOCTYPE html><body><div id="container"></div></body>`)

  global.window = dom.window
  global.document = dom.window.document

  const snabbdom = await import('snabbdom')
  const isxspec = xspec => xspec
    && typeof xspec === 'object'
    && 'key' in xspec && 'ui' in xspec
  const tags = hypel(snabbdom.h, args => isxspec(args[1])
    ? [classidstrTransform(args[1], args[0])].concat(args.slice(2)) : args)
  const div = tags.div
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
          img(`#:key.img.${spec.type}`, spec))
      }
    },
    nav: {
      getvnode: (spec, tags) => {
        const {nav, ul, li} = tags

        return (
          nav('#:key.nav', spec, [
            ul('.nav-list', (spec.navitemarr || []).map(navitem => (
              li(`.nav-list-item.${spec.type}`, navitem))
            ))
          ])
        )
      }
    }
  }

  const vnodearr = nodespecarr.map(spec => {
    return pagetypes[spec.prefix].getvnode(spec, tags)
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

  snabbdom.init([])(document.body.firstElementChild, div({}, vnodearr))

  assert.strictEqual(
    htmlRegexpFormat(dom.window.document.body.innerHTML),
    htmlRegexpFormat(stringydom))
})
