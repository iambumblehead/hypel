(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.hyperscripthelpersopts = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var isValidString = function isValidString(param) {
  return typeof param === 'string' && param.length > 0;
};

var startsWith = function startsWith(string, start) {
  return string[0] === start;
};

var isSelector = function isSelector(param) {
  return isValidString(param) && (startsWith(param, '.') || startsWith(param, '#'));
};

var node = function node(h) {
  return function (tagName) {
    return function (first) {
      for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        rest[_key - 1] = arguments[_key];
      }

      if (isSelector(first)) {
        return h.apply(undefined, [tagName + first].concat(rest));
      } else {
        return h.apply(undefined, [tagName, first].concat(rest));
      }
    };
  };
};

var TAG_NAMES = ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'dd', 'del', 'dfn', 'dir', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'meta', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'p', 'param', 'pre', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'title', 'tr', 'u', 'ul', 'video'];

exports['default'] = function (h) {
  var createTag = node(h);
  var exported = { TAG_NAMES: TAG_NAMES, isSelector: isSelector, createTag: createTag };
  TAG_NAMES.forEach(function (n) {
    exported[n] = createTag(n);
  });
  return exported;
};

module.exports = exports['default'];

},{}],2:[function(require,module,exports){
// Filename: hyperscript-helpers-opts.js  
// Timestamp: 2016.03.14-14:07:38 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>  

var hh = require('hyperscript-helpers');

var hyperscripthelpersopts = module.exports = (function (o) {
  
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

  // var div = h('div.hello/world#hello/world');
  // div.properties.className; // hello
  // div.properties.id;        // hello
  
  const encodeid = idstr => idstr.replace(/\//g, ':');
  const decodeid = idstr => idstr.replace(/\:/g, '/');
  
  const getoptsclassidstr = (opts, classidstr) => (
    encodeid(classidstr.replace(/:[^: -.#]*/g, m => {
      m = m.slice(1);
      m = opts[m] || m;
      return m;
    }))
  );

  const buildoptfns = (h) => {
    var helperfns = hh(h);
    
    return TAG_NAMES.reduce((hhh, cur) => {
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

  return (h) => {
    var namespace = buildoptfns(h);

    var hhopts = (opts) => {
      return TAG_NAMES.reduce((hhopts, cur) => {
        hhopts[cur] = function () {
          return namespace[cur](opts, ...arguments);
        };
        return hhopts;
      }, {});
    };

    hhopts.encodeid = encodeid;
    hhopts.decodeid = decodeid;

    return TAG_NAMES.reduce((hhoptsfn, tagname) => {
      hhoptsfn[tagname] = namespace[tagname];
      
      return hhoptsfn;
    }, hhopts);
  };
  
}());

},{"hyperscript-helpers":1}]},{},[2])(2)
});