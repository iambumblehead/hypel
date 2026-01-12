const isSelector = str => (
  (str = String(str).charCodeAt(0)), (str === 46 || str === 35))

const node = h => tagName => (first, ...rest) => {
  if (isSelector(first)) {
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

const toUpperFirst = str => str.charAt(0).toUpperCase() + str.slice(1)

const hypel = (h, hook) => {
  const createTag = node(h)

  return TAG_NAMES.reduce((accum, tag) => (
    accum[tag] = accum[toUpperFirst(tag)] = typeof hook === 'function'
      ? (tag => (...args) => tag.apply(0, hook(args)))(createTag(tag))
      : createTag(tag),
    accum
  ), { isSelector, createTag, TAG_NAMES })
}

const hypelsvg = h => {
  const createTag = hypel(h).createTag

  return TAG_NAMESSVG.reduce((accum, tag) => (
    accum[tag] = createTag(tag),
    accum
  ), {})
}

export {
  hypel as default,
  hypel,
  hypelsvg
}
