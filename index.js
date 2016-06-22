/* jshint node: true */
'use strict';

var queue = require('./lib/queue');

module.exports = {
  name: 'ember-cli-serial-build',

  setupPreprocessorRegistry: function(type, registry) {
    registry.add('css', {
      toTree: function(tree) {
        return queue(tree, { registryType: type, treeType: 'css' });
      }
    });

    registry.add('js', {
      toTree: function(tree) {
        return queue(tree, { registryType: type, treeType: 'js' });
      }
    });

    registry.add('template', {
      toTree: function(tree) {
        return queue(tree, { registryType: type, treeType: 'template' });
      }
    });
  }
};
