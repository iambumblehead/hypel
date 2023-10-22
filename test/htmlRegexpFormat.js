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
  
  let indent = -1
  let opentags = []
  let previousIsClosing = false
  let previousIsSelfClosing = false
  const final = htmlstr.replace(tagRe, (match, offset, string) => {
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
      ? line
      : (((arr[i - 1].match(/[ ]*/)) || [])[0] || '') + '  ' + line.replace(/^[ ]*/, '')
  )).join('\n')
}
