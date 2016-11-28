// Filename: hyperscript-helpers-opts.js  
// Timestamp: 2016.11.27-20:54:16 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>  

let hh = require('hyperscript-helpers'),
    hhsvg = require('hyperscript-helpers/dist/svg');

let hyperscripthelpersopts = module.exports = (o => {
  
  //const TAG_NAMES = htmltagnames.tagNames;
  const TAG_NAMES = [
    'a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'audio', 'b',
    'base', 'basefont', 'bdi', 'bdo', 'bgsound', 'big', 'blink', 'blockquote', 'body',
    'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup',
    'command', 'content', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog',
    'dir', 'div', 'dl', 'dt', 'element', 'em', 'embed', 'fieldset', 'figcaption', 'figure',
    'font', 'footer', 'form', 'frame', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'image', 'img', 'input',
    'ins', 'isindex', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'listing', 'main',
    'map', 'mark', 'marquee', 'math', 'menu', 'menuitem', 'meta', 'meter', 'multicol',
    'nav', 'nextid', 'nobr', 'noembed', 'noframes', 'noscript', 'object', 'ol', 'optgroup',
    'option', 'output', 'p', 'param', 'picture', 'plaintext', 'pre', 'progress', 'q', 'rb',
    'rbc', 'rp', 'rt', 'rtc', 'ruby', 's', 'samp', 'script', 'section', 'select', 'shadow',
    'small', 'source', 'spacer', 'span', 'strike', 'strong', 'style', 'sub', 'summary',
    'sup', 'svg', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead',
    'time', 'title', 'tr', 'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr', 'xmp'
  ];

  const TAG_NAMES_SVG = [
    'a', 'altGlyph', 'altGlyphDef', 'altGlyphItem', 'animate', 'animateColor',
    'animateMotion', 'animateTransform', 'circle', 'clipPath', 'colorProfile',
    'cursor', 'defs', 'desc', 'ellipse', 'feBlend', 'feColorMatrix',
    'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting',
    'feDisplacementMap', 'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB',
    'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode',
    'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting',
    'feSpotlight', 'feTile', 'feTurbulence', 'filter', 'font', 'fontFace',
    'fontFaceFormat', 'fontFaceName', 'fontFaceSrc', 'fontFaceUri',
    'foreignObject', 'g', 'glyph', 'glyphRef', 'hkern', 'image', 'line',
    'linearGradient', 'marker', 'mask', 'metadata', 'missingGlyph', 'mpath',
    'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'script',
    'set', 'stop', 'style', 'switch', 'symbol', 'text', 'textPath', 'title',
    'tref', 'tspan', 'use', 'view', 'vkern'
  ];

    
  // var div = h('div.hello/world#hello/world');
  // div.properties.className; // hello
  // div.properties.id;        // hello
  
  const encodeid = idstr => idstr.replace(/\//g, ':');
  const decodeid = idstr => idstr.replace(/\:/g, '/');
  
  const getoptsclassidstr = (opts, classidstr) => (
    encodeid(classidstr.replace(/:[^: -.#]*/g, m => {
      m = m.slice(1);
      m = m in opts ? String(opts[m]) : m;
      return m;
    }))
  );

  const buildoptfns = (h, helpers, tagnamearr) => {
    let helperfns = helpers(h);

    return tagnamearr.reduce((hhh, cur) => {
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


  const buildhelper = (helpers, tagnamearr) => ((h) => {
    let namespace = buildoptfns(h, helpers, tagnamearr);

    let hhopts = (opts) => 
      tagnamearr.reduce((hhopts, cur) => (
        hhopts[cur] = function () {
          return namespace[cur](opts, ...arguments);
        },
        hhopts
      ), {});

    hhopts.encodeid = encodeid;
    hhopts.decodeid = decodeid;

    return tagnamearr.reduce((hhoptsfn, tagname) => (
      hhoptsfn[tagname] = namespace[tagname],
      hhoptsfn
    ), hhopts);
  });

  o = buildhelper(hh, TAG_NAMES);
  o.svg = buildhelper(hhsvg, TAG_NAMES_SVG);

  return o;
  
})();
