// Filename: hyperscript-helpers-opts.js  
// Timestamp: 2017.05.24-19:19:38 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>  

let hh = require('hyperscript-helpers'),
    hhsvg = require('hyperscript-helpers/dist/svg');

let hyperscripthelpersopts = module.exports = (o => {
  // var div = h('div.hello/world#hello/world');
  // div.properties.className; // hello
  // div.properties.id;        // hello
  
  const encodeid = idstr =>
          idstr.replace(/\//g, ':');
  
  const decodeid = idstr =>
          idstr.replace(/\:/g, '/');
  
  const getoptsclassidstr = (opts, classidstr) => (
    encodeid(classidstr.replace(/:[^: -.#]*/g, m => {
      m = m.slice(1);
      m = m in opts ? String(opts[m]) : m;
      return m;
    }))
  );

  const buildoptfns = (helperfns) => 
    helperfns.TAG_NAMES.reduce((hhh, cur) => {
      hhh[cur] = function () {
        let args = [].slice.call(arguments, 0),
            newargs;

        if (typeof args[1] === 'string') {
          newargs = args.slice(2);
          newargs.splice(0, 0, getoptsclassidstr(args[0], args[1]));
        } else {
          newargs = args.slice(1);
        }

        return helperfns[cur].apply(0, newargs);
      };
      
      return hhh;
    }, {});

  const buildhelper = (helpers) => ((h) => {
    let helperobj = helpers(h),
        namespace = buildoptfns(helperobj);

    let hhopts = opts => 
      helperobj.TAG_NAMES.reduce((hhopts, cur) => (
        hhopts[cur] = function () {
          return namespace[cur](opts, ...arguments);
        },
        hhopts
      ), {});

    hhopts.encodeid = encodeid;
    hhopts.decodeid = decodeid;

    return helperobj.TAG_NAMES.reduce((hhoptsfn, tagname) => (
      hhoptsfn[tagname] = namespace[tagname],
      hhoptsfn
    ), hhopts);
  });

  o = buildhelper(hh);
  o.svg = buildhelper(hhsvg);

  return o;
  
})();
