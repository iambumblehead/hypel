// Filename: hyperscript-helpers-opts.js  
// Timestamp: 2016.03.14-13:11:22 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>  

var hh = require('hyperscript-helpers');

var hyperscripthelpersopts = module.exports = (function (o) {
  
  const TAG_NAMES = [
    'a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base',
    'bdi', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption',
    'cite', 'code', 'col', 'colgroup', 'dd', 'del', 'dfn', 'dir', 'div', 'dl',
    'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html',
    'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend',
    'li', 'link', 'main', 'map', 'mark', 'menu', 'meta', 'nav', 'noscript',
    'object', 'ol', 'optgroup', 'option', 'p', 'param', 'pre', 'q', 'rp', 'rt',
    'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span',
    'strong', 'style', 'sub', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot',
    'th', 'thead', 'title', 'tr', 'u', 'ul', 'video', 'progress'
  ];

  // var div = h('div.hello/world#hello/world');
  // div.properties.className; // hello
  // div.properties.id;        // hello
  
  const encodeid = idstr => idstr.replace(/\//, ':');
  const decodeid = idstr => idstr.replace(/\:/, '/');
  
  const getoptsclassidstr = (opts, classidstr) => (
    encodeid(classidstr.replace(/:[^: -.#]*/g, m => {
      m = m.slice(1);
      m = opts[m] || m;
      return m;
    }))
  );

  const buildoptfns = (h) => {
    var helperfns = hh(h);
    
    return TAG_NAMES.reduce((hhh, cur) => {
      hhh[cur] = function () {
        var args = [].slice.call(arguments, 0),
            newargs = args;

        if (typeof args[1] === 'string') {
          newargs = args.slice(2);
          newargs.splice(0, 0, getoptsclassidstr(args[0], args[1]));          
        }
        
        return helperfns[cur].apply(0, newargs);
      };
      return hhh;
    }, {});
  };

  return (h) => {
    var namespace = buildoptfns(h);

    var hhopts = (opts) => {
      return TAG_NAMES.reduce((hhopts, cur) => {
        hhopts[cur] = function () {
          return namespace[cur](opts, ...arguments);
        };
        return hhopts;
      }, {});
    };

    hhopts.encodeid = encodeid;
    hhopts.decodeid = decodeid;

    return TAG_NAMES.reduce((hhoptsfn, tagname) => {
      hhoptsfn[tagname] = namespace[tagname];
      
      return hhoptsfn;
    }, hhopts);
  };
  
}());
