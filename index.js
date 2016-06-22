/* jshint node: true */
'use strict';

var Queue = require('./lib/queue');

module.exports = {
  name: 'ember-cli-serial-build',

  setupPreprocessorRegistry: function(type, registry) {
    this.queue = this.queue || new Queue();
    var queue = this.queue;

    registry.add('css', {
      toTree: function(tree) {
        var workingTree = queue.add(tree, {
          registryType: type,
          treeType: 'css'
        });

        return workingTree;
      }
    });

    registry.add('js', {
      toTree: function(tree) {
        var workingTree = queue.add(tree, {
          registryType: type,
          treeType: 'js'
        });

        return workingTree;
      }
    });

    registry.add('template', {
      toTree: function(tree) {
        var workingTree = queue.add(tree, {
          registryType: type,
          treeType: 'template'
        });

        return workingTree;
      }
    });
  }
};
