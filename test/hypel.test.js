// Filename: start.js  
// Timestamp: 2016.02.22-12:21:04 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>

import test from 'node:test'
import assert from 'node:assert/strict'
import snabbdom from 'snabbdom'
import { JSDOM } from 'jsdom'
import html from 'html'
import hypel from '../hypel.js'

test('snabbdom', () => {
  const dom = new JSDOM(`<!DOCTYPE html><body><div id="container"></div></body>`)

  global.window = dom.window;
  global.document = dom.window.document;

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

const hh = hypel(snabbdom.h)

// page data
const pagedataarr = [{
  uid: 'page-topnav',
  pagetype: 'nav',
  navitemarr: ['main', 'faq'],
  type: 'big',
  name: 'signin'
}, {
  uid: 'page-img1',
  pagetype: 'img',  
  type: 'big',
  name: 'fun image 1'
}, {
  uid: 'page-img2',
  pagetype: 'img',  
  type: 'big',
  name: 'fun image 2'
}, {
  uid: 'page-img3',
  pagetype: 'img',  
  type: 'small',
  name: 'fun image 3'  
}, {
  uid: 'page-bottomnav',
  pagetype: 'nav',
  type: 'small',
  name: 'general',
  navitemarr: ['phone', 'contact']
}];

// static page objects
const getpage = () => ({
  getcontainerelem: (opt, win) => (
    win.document.getElementById(opt.uid))
});

const getpageimg = () => {
  var p = getpage();

  p.getvnode = opt =>
    hh.img(opt, '#:uid.img .:type');

  return p;
};

const getpagenav = () => {
  var p = getpage();

  p.getvnode = opt => (
    hh.nav(opt, '#:uid.nav', [
      hh.ul(opt, '.nav-list', (
        opt.navitemarr && opt.navitemarr
          .map(navitem => hh.li(opt, '.nav-list-item .:type', navitem))
      ))
    ]));

  return p;
};

// stored reference of static page objects
const page = {
  img: getpageimg(),
  nav: getpagenav()
};

// build page objects
const div = hh.div({}, pagedataarr.map(data => {
  return page[data.pagetype].getvnode(data);
}));

const stringydom = html.prettyPrint(`
  <div>
    <nav id="page-topnav" class="nav">
      <ul class="nav-list">
        <li class="nav-list-item  big">main</li>
        <li class="nav-list-item  big">faq</li>
      </ul>
    </nav>
    <img id="page-img1" class="img  big">
    <img id="page-img2" class="img  big">
    <img id="page-img3" class="img  small">
    <nav id="page-bottomnav" class="nav">
      <ul class="nav-list">
        <li class="nav-list-item  small">phone</li>
        <li class="nav-list-item  small">contact</li>
      </ul>
    </nav>
  </div>`)

test('should be compatible with browser dom', () => {
  const dom = new JSDOM(
    `<!DOCTYPE html><body><div id="container"></div></body>`)

  global.window = dom.window;
  global.document = dom.window.document;
 
  snabbdom.init([])(document.getElementById('container'), div)

  const navdata = pagedataarr[0]
  const elem = page[navdata.pagetype].getcontainerelem(navdata, dom.window)

  assert.strictEqual(
    html.prettyPrint(dom.window.document.body.innerHTML),
    stringydom)
  assert.ok(elem instanceof dom.window.Element)
})
