// Filename: hyperscript-helpers-opts.js  
// Timestamp: 2016.03.11-00:22:33 (last modified)
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

  const getoptsclassidstr = (opts, classidstr) => (
    classidstr.replace(/:[^: -.#]*/g, m => {
      m = m.slice(1);
      m = opts[m] || m;
      return m;
    })
  );

  return (h) => (
    TAG_NAMES.reduce((hhh, cur) => {
      hhh[cur + 'o'] = function () {
        var args = [].slice.call(arguments, 0),
            newargs = args.slice(2);

        newargs.splice(0, 0, getoptsclassidstr(args[0], args[1]));
        return hhh[cur].apply(hhh, newargs);        
      };
      return hhh;
    }, hh(h))
  );
  
}());
