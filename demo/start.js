// Filename: start.js  
// Timestamp: 2016.02.22-12:21:04 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>

import vdomtohtml from 'vdom-to-html'
import html from 'html'
import h from 'virtual-dom/h.js'
import hho from '../hyperscript-helpers-opts.js'

const hh = hho(h);

console.log('\n');

// page data
const pagedataarr = [{
  uid : 'page-topnav',
  pagetype : 'nav',
  navitemarr : [
    'main', 'faq'
  ],
  type : 'big',
  name : 'signin'
}, {
  uid : 'page-img1',
  pagetype : 'img',  
  type : 'big',
  name : 'fun image 1'
}, {
  uid : 'page-img2',
  pagetype : 'img',  
  type : 'big',
  name : 'fun image 2'
}, {
  uid : 'page-img3',
  pagetype : 'img',  
  type : 'small',
  name : 'fun image 3'  
}, {
  uid : 'page-bottomnav',
  pagetype : 'nav',
  type : 'small',
  name : 'general',
  navitemarr : [
    'phone', 'contact'
  ]
}];

// static page objects
const getpage = () => ({
  getcontainerelem : opt => document.getElementById(opt.uid)
});

const getpageimg = () => {
  var p = getpage();

  p.getvnode = opt =>
    hh.img(opt, '#:uid.img .:type');

  return p;
};

const getpagenav = () => {
  var p = getpage();

  p.getvnode = opt =>
    hh.nav(opt, '#:uid.nav', [
      hh.ul(opt, '.nav-list', [
        opt.navitemarr && opt.navitemarr
          .map(navitem => hh.li(opt, '.nav-list-item .:type', navitem))
      ])
    ]);

  return p;
};

// stored reference of static page objects
const page = {
  img : getpageimg(),
  nav : getpagenav()
};



// build page objects
console.log('blick', hh.div.toString())
const div = hh.div({}, pagedataarr.map(data => {
  console.log('called', page[data.pagetype].getvnode(data))
  return page[data.pagetype].getvnode(data);
}));

console.log({ div })

console.log(
  'result', html.prettyPrint(vdomtohtml(div))
);

//<div>
//    <nav id="page-topnav" class="nav">
//        <ul class="nav-list">
//            <li class="nav-list-item big">main</li>
//            <li class="nav-list-item big">faq</li>
//        </ul>
//    </nav>
//    <img id="page-img1" class="img big">
//    <img id="page-img2" class="img big">
//    <img id="page-img3" class="img small">
//    <nav id="page-bottomnav" class="nav">
//        <ul class="nav-list">
//            <li class="nav-list-item small">phone</li>
//            <li class="nav-list-item small">contact</li>
//        </ul>
//    </nav>
//</div>

if (typeof document === 'object') {
  document.body.appendChild(vdomtohtml(div));
  var navdata = pagedataarr[0];
  page[navdata.type].getcontainerelem();
  // <nav id="page" class="nav"> ... </nav>
}
  
console.log('\n');
