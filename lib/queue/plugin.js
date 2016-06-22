/* jshint node: true */
'use strict';

var path = require('path');

var BroccoliPlugin = require('broccoli-plugin');
var walkSync = require('walk-sync');
var mkdirp = require('mkdirp');
var symlinkOrCopySync = require('symlink-or-copy').sync;

Plugin.prototype = Object.create(BroccoliPlugin.prototype);
Plugin.prototype.constructor = Plugin;
function Plugin(_inputNodes, _options) {
  var inputNodes = _inputNodes;
  var options = _options || {};

  if (!(this instanceof Plugin)) {
    return new Plugin(inputNodes, options);
  }

  if (!Array.isArray(inputNodes)) {
    inputNodes = [ inputNodes ];
  }

  BroccoliPlugin.call(this, inputNodes, options);

  this.wait = options.wait;
  this.continue = options.continue;
}

Plugin.prototype.build = function() {
  var plugin = this;

  return plugin.wait().then(function() {
    plugin.copyToOut();
    plugin.continue();
  });
};

Plugin.prototype.copyToOut = function() {
  var outputPath = this.outputPath;

  this.inputPaths.forEach(function(inputPath) {
    walkSync.entries(inputPath).forEach(function(entry) {
      if (!entry.isDirectory()) {
        var src = path.join(inputPath, entry.relativePath);
        var dest = path.join(outputPath, entry.relativePath);
        var destDir = path.dirname(dest);

        mkdirp.sync(destDir);
        symlinkOrCopySync(src, dest);
      }
    });
  });
};

module.exports = Plugin;
