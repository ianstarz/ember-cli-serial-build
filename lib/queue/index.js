/* jshint node: true */
'use strict';

var Promise = require('rsvp').Promise;
var plugin = require('./plugin');

function Queue() {
  this.order = [
    'self:css',
    'parent:css',
    'self:js',
    'parent:js',
    'self:template',
    'parent:template'
  ];

  this.queue = this.order.reduce(function(hash, key) {
    hash[key] = [];
    return hash;
  }, {});
}

Queue.prototype = {
  add: function(inputNodes, _options) {
    var queue = this;

    var options = _options || {};
    var registryType = options.registryType;
    var treeType = options.treeType;
    var key = queue.key(registryType, treeType);

    var resolved = false;
    var promise = new Promise(function(resolve) {
      while (true) {
        if (resolved) {
          console.log('resolved');
          resolve();
          break;
        }
      }
    });

    queue.queue[key].push(promise);

    options.wait = function() {
      console.log(registryType, treeType, 'waiting...');
      return queue.promisesFor(key);
    };

    options.continue = function() {
      console.log(registryType, treeType, 'continue');
      resolved = true;
    };

    return plugin(inputNodes, options);
  },

  key: function(registryType, treeType) {
    return registryType + ':' + treeType;
  },

  promisesFor: function(key) {
    return new Promise(function(resolve) {
      setTimeout(function() { resolve(); }, 1000);
    });
  }
};

module.exports = Queue;
