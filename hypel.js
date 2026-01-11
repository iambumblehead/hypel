const isSelectorRe = /^[.#]/
const nsSepPlainRe = /\//g
const nsSepEncodeRe = /:/g
const nsKeyRe = /:[^: -.#]*/g
const node = h => tagName => (first, ...rest) => {
  if (isSelectorRe.test(first)) {
    return h(tagName + first, ...rest)
  } else if (typeof first === 'undefined') {
    return h(tagName)
  } else {
    return h(tagName, first, ...rest)
  }
}

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
  'rtc', 'ruby', 's', 'samp', 'script', 'search', 'section', 'select', 'shadow',
  'slot', 'small', 'source', 'spacer', 'span', 'strike', 'strong', 'style',
  'sub', 'summary', 'sup', 'svg', 'table', 'tbody', 'td', 'template',
  'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'tt', 'u',
  'ul', 'var', 'video', 'wbr', 'xmp'
]

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
]

const hypel = h => {
  const createTag = node(h)

  return TAG_NAMES.reduce((accum, tag) => (
    accum[tag] = accum[
      tag.charAt(0).toUpperCase() + tag.slice(1)] = createTag(tag),
    accum
  ), { isSelector: n => isSelectorRe.test(n), createTag, TAG_NAMES })
}

const hypelsvg = h => {
  const createTag = hypel(h).createTag

  return TAG_NAMESSVG.reduce((accum, tag) => (
    accum[tag] = createTag(tag),
    accum
  ), {})
}

// var div = h('div.hello/world#hello/world');
// div.properties.className; // helloa
// div.properties.id;        // hello
const encodeid = idstr => idstr.replace(nsSepPlainRe, ':')
const decodeid = idstr => idstr.replace(nsSepEncodeRe, '/')
const charCodeHyphen = 45 // the char "-"
// const tryprefix = (opts, classstr, prop, prefixname) => (
//   prop = opts[prop + prefixname],
//   prop && prop !== classstr ? prop + '.' + classstr : classstr)
const charCodeColon = 58
const getoptsclassidstr = (opts, classidstr, pos) => {
  if (!classidstr)
    return ''

  if (classidstr.startsWith('ui')) {
    const thirdchar = classidstr.charCodeAt(2)
    if (thirdchar === charCodeHyphen || thirdchar === charCodeColon) {
      if (opts.uiprefix) {
        const full = '.' + opts.uiprefix + '.' + opts.ui
        if (thirdchar === charCodeColon) {
          classidstr = (
            opts.uiroot ? '.' + opts.uiroot + full : full
          ) + classidstr.slice(3)
        } else {
          pos = classidstr.indexOf(':', 3)
          classidstr = full
            + classidstr.slice(2, pos) + classidstr.slice(pos + 1)
        }
      } else {
        classidstr = classidstr.slice(thirdchar === charCodeColon
          ? 3
          : classidstr.indexOf(':', 3) + 1)
      }
    }
  }

  pos = classidstr.indexOf('#:key')
  if (pos > -1)
    classidstr = classidstr.slice(0, pos + 1)
      + opts.key.replace(nsSepPlainRe, ':')
      + classidstr.slice(pos + 5)

  return classidstr
}

const buildoptfns = helperfns => helperfns.TAG_NAMES.reduce((hhh, cur) => (
  hhh[cur] = (...args) => {
    const newargs = typeof args[1] === 'string'
      ? [ getoptsclassidstr(args[0], args[1]), ...args.slice(2) ]
      : args.slice(1)

    return helperfns[cur](...newargs)
  },
  hhh
), {})

const buildhelper = h => spec => {
  const helperobj = h(spec)
  const namespace = buildoptfns(helperobj)
  const hhopts = opts => helperobj.TAG_NAMES.reduce((hhopts, cur) => (
    hhopts[cur] = (...args) => namespace[cur](opts, ...args),
    hhopts
  ), { encodeid, decodeid })

  return helperobj.TAG_NAMES.reduce((hhoptsfn, tagname) => (
    hhoptsfn[tagname] = namespace[tagname],
    hhoptsfn
  ), hhopts)
}

const hypelns = buildhelper(hypel)

export {
  hypel as default,
  hypel,
  hypelsvg,
  hypelns
}
