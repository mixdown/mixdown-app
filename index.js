var async = require('async');

var BasePlugin = function(namespace, options) {
  this.namespace = namespace || 'namespace-not-defined';
  this.instance;
  this.options = options || {};
  this.plugin; // simple pointer to the plugin
};

BasePlugin.prototype.attach = function(instance) {
  this.instance = instance; // hold the pointer to the external instance.
  this.plugin = instance[this.namespace] = {};
};

BasePlugin.prototype.detach = function() {
  if (this.instance) {
    delete this.instance[this.namespace];
  }
  this.plugin = this.instance = null;
};

BasePlugin.prototype.init = function(done) {
  // use this.instance to initialize
  done();
};

var App = function() {

  if (!(this instanceof App)) {
    return new App();
  }

  this.__inits__ = [];
  this.__plugins__ = {};
};

App.prototype.use = function(plugin) {

  this.__plugins__[plugin.namespace] = plugin;

  BasePlugin.prototype.attach.call(plugin, this);
  plugin.attach(this);

  if (typeof(plugin.init) === 'function') {
    this.__inits__.push(function(cb) {
      plugin.init(cb);
    });
  }
};

App.prototype.remove = function(arg) {
  var plugin;

  // if string, then arg is a namespace.  Otherwise, arg is the plugin.
  if (typeof(arg) === 'string') {
    plugin = this.__plugins__[arg];
  } else {
    plugin = arg;
  }
  debugger;
  if (plugin) {

    if (typeof(plugin.detach) === 'function') {
      plugin.detach();
    }
    BasePlugin.prototype.detach.call(plugin);
  }
};

App.prototype.init = function(done) {
  async.parallel(this.__inits__, done);
};

module.exports = {
  Plugin: BasePlugin,
  App: App
};