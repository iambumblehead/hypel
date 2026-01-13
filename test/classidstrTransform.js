const nsSepPlainRe = /\//g
const charCodeHyphen = 45
const charCodeColon = 58

export default (opts, classidstr, pos) => {
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
