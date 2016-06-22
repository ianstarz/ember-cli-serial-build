/* jshint node: true */
'use strict';

var RSVP = require('rsvp');

var BUILD_ORDER = [
  'self:css',
  'parent:css',
  'self:js',
  'parent:js',
  'self:template',
  'parent:template'
];

var buildKey = function(registryType, treeType) {
  return registryType + ':' + treeType;
};

var promises = BUILD_ORDER.reduce(function(hash, key) {
  hash[key] = {};
  return hash;
}, {});

var ids = [];

module.exports = function(tree, _options) {
  var options = _options || {};

  var key = buildKey(options.registryType, options.treeType);
  var id = guid();
  while (ids.indexOf(id) > -1) {
    id = guid();
  }

  promises[key][id] = new RSVP.Promise(function(resolve) {
    setTimeout(function() {
      resolve();
    }, 1000);
  });

  var _build = tree.build;
  tree.build = function() {
    return RSVP.all(dependentPromises(promises, key)).then(function() {
      console.log('build', options.registryType, options.treeType);
      return _build.apply(tree, arguments);
    });
  };

  return tree;
};

var dependentPromises = function(promises, buildKey) {
  return [ RSVP.resolve() ];
};

var guid = function fn (n) {
  return n ?
           (n ^ Math.random() * 16 >> n/4).toString(16) :
           ('10000000-1000-4000-8000-100000000000'.replace(/[018]/g, fn));
};
