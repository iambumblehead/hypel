// Filename: start.js  
// Timestamp: 2016.02.19-17:56:10 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>

var h = require('virtual-dom/h'),
    hh = require('../')(h);


console.log('\n');

const pagedataarr = [{
  uid : 'page/topnav',
  pagetype : 'nav',
  navitemarr : [
    'main', 'faq'
  ],
  type : 'big',
  name : 'signin'
}, {
  uid : 'page/img1',
  pagetype : 'img',  
  type : 'big',
  name : 'fun image'
}, {
  uid : 'page/img2',
  pagetype : 'img',  
  type : 'big',
  name : 'fun image'
}, {
  uid : 'page/img3',
  pagetype : 'img',  
  type : 'big',
  name : 'fun image'  
}, {
  uid : 'page/bottomnav',
  pagetype : 'nav',
  type : 'small',
  name : 'general',
  navitemarr : [
    'phone', 'contact'
  ]
}];

const getpage = () => ({
  getcontentelem$ : function () {
    
  },
  getcontentelem : function () {
    
  },  
  getvnode : function () {

  }
});

const getpageimg = () => {
  var p = getpage();

  p.getvnode = function () {

  };

  return p;
};

const getpagenav = () => {
  var p = getpage();

  p.getvnode = function (opt) {
    return hh.navo(opt, '#nav-:uid.nav', [
      hh.ulo(opt, '.nav-list', [
        hh.lio(opt, '.nav-list-item', [
          
        ])
      ])
    ]);
  };

  return p;
};

const page = {
  img : getpageimg(),
  nav : getpagenav()
};

// render nodes...

const getrenderedvnode = function (pagedataarr) {
  return hh.div(pagedataarr.map(function (data) {
    return pagenodes[data.pagetype].getvnode(data);
  }));
};




hh.div(pagedataarr.map(function (data) {
  return pagenodes[data.pagetyp].getvnode(data);
}));



// get nodes...



/*
  hh.divo({
    uid : 'foouid',
    type : 'big',
    name : 'bluestyle'
  }, '#button-:uid.button button-:type.:name');
*/





console.log('\n');
