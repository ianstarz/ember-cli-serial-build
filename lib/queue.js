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

function Queue() {
  // TODO @ianstarz make build order configurable
  this.order = BUILD_ORDER;

  this.promises = this.order.reduce(function(hash, key) {
    hash[key] = {};
    return hash;
  }, {});
}

Queue.prototype = {
  add: function(tree, _options) {
    var options = _options || {};

    var key = this.buildKey(options.registryType, options.treeType);
    var id = this.generateId();
    this.promises[key][id] = new RSVP.Promise(function(resolve) {
      setTimeout(function() {
        resolve();
      }, 1000);
    });

    var queue = this;
    var _build = tree.build;
    tree.build = function() {
      return RSVP.all(queue.dependentPromisesFor(key)).then(function() {
        console.log('build', options.registryType, options.treeType);
        return _build.apply(tree, arguments);
      });
    };

    return tree;
  },

  buildKey: function(registryType, treeType) {
    return registryType + ':' + treeType;
  },

  generateId: function() {
    // TODO @ianstarz ensure unique ids
    return guid();
  },

  dependentPromisesFor: function(buildKey) {
    var keyIndex = this.order.indexOf(buildKey);

    // THIS IS WHERE I LEFT OFF

    console.log('dep promises for', buildKey, keyIndex);
    return [ RSVP.resolve() ];
  }
};

function guid(n) {
  return n ?
           (n ^ Math.random() * 16 >> n/4).toString(16) :
           ('10000000-1000-4000-8000-100000000000'.replace(/[018]/g, guid));
}

module.exports = Queue;
