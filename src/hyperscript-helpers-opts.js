// Filename: hyperscript-helpers-opts.js  
// Timestamp: 2016.02.22-11:35:35 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>  

var hh = require('hyperscript-helpers');

var hyperscripthelpersopts = module.exports = (function (o) {
  
  // 1. convenient uid for getting node reference or type for styling
  //
  //    span('#button-:uid.button.button-:type', opts)
  //
  // 2. make it easy add localname for recomposoble vdom constructions
  //
  //    div('.nav.:lname', opts)
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

  // 'opts' anticipated as first arg passed to function
  const node = h => function () {
    const args = [].slice.call(arguments, 0),
          classidopt = args[0],
          classidstr = args[1],
          newargs = args.slice(1);

    newargs[0] = classidstr.replace(/:[^: .#]*/g, m => {
      return m = m.slice(1), m in classidopt ? classidopt[m] : m;
    });
    
    return h.apply(h, newargs);
  };
  
  return h => {
    return TAG_NAMES.reduce((prev, cur) => {
      return prev[cur + 'o'] = node(prev[cur]), prev;
    }, hh(h));
  };
  
  return o;
  
}());
