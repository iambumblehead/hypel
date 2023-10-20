// Filename: hyperscript-helpers-opts.js  
// Timestamp: 2017.05.24-19:19:38 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>  

import hh from 'hyperscript-helpers'
import hhsvg from 'hyperscript-helpers/dist/svg.js'

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

export default Object.assign(buildhelper(hh), {
  svg: buildhelper(hhsvg)
})
