// Filename: hyperscript-helpers-opts.js  
// Timestamp: 2017.05.24-19:19:38 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>  

const isValidString = param => typeof param === 'string' && param.length > 0;

const startsWith = (string, start) => string[0] === start;

const isSelector = param =>
  isValidString(param) && (startsWith(param, '.') || startsWith(param, '#'));

const node = h => tagName => (first, ...rest) => {
  if (isSelector(first)) {
    return h(tagName + first, ...rest);
  } else if (typeof first === 'undefined') {
    return h(tagName);
  } else {
    return h(tagName, first, ...rest);
  }
};

// The tag names are verified against html-tag-names in the tests
// See https://github.com/ohanhi/hyperscript-helpers/issues/34 for the reason
// why the tags aren't simply required from html-tag-names
const TAG_NAMES = [
  'a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside',
  'audio', 'b', 'base', 'basefont', 'bdi', 'bdo', 'bgsound', 'big', 'blink',
  'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite',
  'code', 'col', 'colgroup', 'command', 'content', 'data', 'datalist', 'dd',
  'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'element', 'em',
  'embed', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form',
  'frame', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header',
  'hgroup', 'hr', 'html', 'i', 'iframe', 'image', 'img', 'input', 'ins',
  'isindex', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'listing',
  'main', 'map', 'mark', 'marquee', 'math', 'menu', 'menuitem', 'meta',
  'meter', 'multicol', 'nav', 'nextid', 'nobr', 'noembed', 'noframes',
  'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param',
  'picture', 'plaintext', 'pre', 'progress', 'q', 'rb', 'rbc', 'rp', 'rt',
  'rtc', 'ruby', 's', 'samp', 'script', 'search', 'section', 'select', 'shadow', 'slot',
  'small', 'source', 'spacer', 'span', 'strike', 'strong', 'style', 'sub',
  'summary', 'sup', 'svg', 'table', 'tbody', 'td', 'template', 'textarea',
  'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'tt', 'u', 'ul',
  'var', 'video', 'wbr', 'xmp'
];

const hh = h => {
  const createTag = node(h);
  const exported = { TAG_NAMES, isSelector, createTag };
  TAG_NAMES.forEach(n => {
    // Also support a first-letter-uppercase spelling to help avoid conflicts
    // with other variables or Javascript reserved keywords such as 'var'
    exported[n] = exported[n.charAt(0).toUpperCase() + n.slice(1)] =
      createTag(n);
  });
  return exported;
};

// https://www.w3.org/TR/SVG/eltindex.html
// The tag names are verified against svg-tag-names in the tests
// See https://github.com/ohanhi/hyperscript-helpers/issues/34 for the reason
// why the tags aren't simply required from svg-tag-names
const TAG_NAMESSVG = [
  'a', 'altGlyph', 'altGlyphDef', 'altGlyphItem', 'animate', 'animateColor',
  'animateMotion', 'animateTransform', 'animation', 'audio', 'canvas',
  'circle', 'clipPath', 'color-profile', 'cursor', 'defs', 'desc', 'discard',
  'ellipse', 'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite',
  'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap',
  'feDistantLight', 'feDropShadow', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG',
  'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode',
  'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting',
  'feSpotLight', 'feTile', 'feTurbulence', 'filter', 'font', 'font-face',
  'font-face-format', 'font-face-name', 'font-face-src', 'font-face-uri',
  'foreignObject', 'g', 'glyph', 'glyphRef', 'handler', 'hatch', 'hatchpath',
  'hkern', 'iframe', 'image', 'line', 'linearGradient', 'listener', 'marker',
  'mask', 'mesh', 'meshgradient', 'meshpatch', 'meshrow', 'metadata',
  'missing-glyph', 'mpath', 'path', 'pattern', 'polygon', 'polyline',
  'prefetch', 'radialGradient', 'rect', 'script', 'set', 'solidColor',
  'solidcolor', 'stop', 'style', 'svg', 'switch', 'symbol', 'tbreak', 'text',
  'textArea', 'textPath', 'title', 'tref', 'tspan', 'unknown', 'use', 'video',
  'view', 'vkern'
];

const hhsvg = h => {
  const createTag = hh(h).createTag;
  const exported = { TAG_NAMESSVG, createTag };
  TAG_NAMESSVG.forEach(n => {
    exported[n] = createTag(n);
  });
  return exported;
};

// var div = h('div.hello/world#hello/world');
// div.properties.className; // hello
// div.properties.id;        // hello

const encodeid = idstr => idstr.replace(/\//g, ':');

const decodeid = idstr => idstr.replace(/\:/g, '/');

const getoptsclassidstr = (opts, classidstr) => (
  encodeid(classidstr.replace(/:[^: -.#]*/g, m => (
    m = m.slice(1),
    m = m in opts ? String(opts[m]) : m,
    m
  )))
);

const buildoptfns = helperfns => helperfns.TAG_NAMES.reduce((hhh, cur) => {
  hhh[cur] = (...args) => {
    let newargs;

    if (typeof args[1] === 'string') {
      newargs = args.slice(2);
      // try getting this to single line
      newargs.splice(0, 0, getoptsclassidstr(args[0], args[1]));
    } else {
      newargs = args.slice(1);
    }

    return helperfns[cur](...newargs)
  };
  
  return hhh
}, {});

const buildhelper = helpers => h => {
  const helperobj = helpers(h)
  const namespace = buildoptfns(helperobj);
  const hhopts = opts => helperobj.TAG_NAMES.reduce((hhopts, cur) => (
    hhopts[cur] = (...args) => namespace[cur](opts, ...args),
    hhopts
  ), {});

  hhopts.encodeid = encodeid
  hhopts.decodeid = decodeid

  return helperobj.TAG_NAMES.reduce((hhoptsfn, tagname) => (
    hhoptsfn[tagname] = namespace[tagname],
    hhoptsfn
  ), hhopts)
};


const hypel = Object.assign(buildhelper(hh), {
  svg: buildhelper(hhsvg)
})

export {
  hypel as default,
  hh as hypelem,
  hhsvg as hypelsvg
}
