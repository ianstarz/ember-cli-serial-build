/* jshint node: true */
'use strict';

var Queue = require('./lib/queue');

module.exports = {
  name: 'ember-cli-serial-build',

  setupPreprocessorRegistry: function(type, registry) {
    let queue = this.queue || new Queue();
    this.queue = queue;

    registry.add('css', {
      toTree: function(tree) {
        return queue.add(tree, { registryType: type, treeType: 'css' });
      }
    });

    registry.add('js', {
      toTree: function(tree) {
        return queue.add(tree, { registryType: type, treeType: 'js' });
      }
    });

    registry.add('template', {
      toTree: function(tree) {
        return queue.add(tree, { registryType: type, treeType: 'template' });
      }
    });
  }
};
