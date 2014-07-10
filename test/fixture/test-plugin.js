var BasePlugin = require('../../index.js').Plugin;
var inherits = require('inherits');

var TestPlugin = function(namespace, options) {
  BasePlugin.call(this, namespace, options);
};

inherits(TestPlugin, BasePlugin);

TestPlugin.prototype.attach = function(instance) {

  var self = this;

  this.plugin.hello = function() {
    self.plugin.count++;
    return 'Hello ' + self.options.name;
  };

  this.plugin.count = null;

};

TestPlugin.prototype.init = function(done) {
  this.plugin.count = 0;
  done();
};


module.exports = TestPlugin;