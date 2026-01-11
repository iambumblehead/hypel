const isTagRe = /(<([^>]+)>)/i
const tagRe = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g
const closeRe = /\//
const selfClosingTags = [
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr' ]
const selfClosingRe = new RegExp(`${selfClosingTags.join('|')} `, 'gi')

// little regexp html parser because most formatters parsers
// not recently maintained and/or very big
export default htmlstr => {
  if (/\n/gi.test(htmlstr))
    htmlstr = (
      htmlstr
        .slice(1)
        .split(/\n/g)
        .map(n => n.replace(/^[ ]*/, ''))
        .join(''))
  
  let indent = -1,
      opentags = [],
      previousIsClosing = false,
      previousIsSelfClosing = false

  const final = htmlstr.replace(tagRe, match => {
    const isSelfClosing = selfClosingRe.test(match)
    const isClosing = !isSelfClosing && closeRe.test(match)
    const newlineStart = (isClosing && !previousIsClosing) ? '\n' : ''
    const newlineEnd = '\n'

    if (!isSelfClosing && !isClosing)
      opentags.push(match)

    indent += (
      isSelfClosing
        || (isClosing && !previousIsClosing)
        || (!isClosing && (previousIsClosing || previousIsSelfClosing)))
      ? 0
      : closeRe.test(match) ? -1 : 1

    previousIsClosing = isClosing
    previousIsSelfClosing = isSelfClosing

    return [
      newlineStart,
      '  '.repeat(indent) + match,
      newlineEnd
    ].join('')
  })

  return final.split(/\n/g).map((line, i, arr) => (
    isTagRe.test(line)
      ? line.replace(isTagRe, (match, g1, g2) => {
        const idAttrRe = (/ id=["'][^"']*["']/)
        if (idAttrRe.test(g2)) {
          // move id attribute to end of tag
          const idAttr = g2.match(idAttrRe)[0]

          return `<${g2.replace(idAttr, '') + idAttr}>`
        } else {
          return match
        }
      })
      : (((arr[Math.max(i - 1, 0)].match(/[ ]*/)) || [])[0] || '')
        + '  ' + line.replace(/^[ ]*/, '')
  )).join('\n').trim()
}
