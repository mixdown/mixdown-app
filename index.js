var async = require('async');
var Class = require('class.extend');

var BasePlugin = Class.extend({
  init: function(namespace, options) {

    this._namespace = namespace || 'namespace-not-defined';
    this._instance;
    this._options = options || {};
    this._plugin = {
      _options: this._options
    }; // simple pointer to the plugin  

    for (var name in this) {
      if (!/^(init|constructor)$/.test(name) && !/^_/.test(name)) {
        if (typeof(this[name]) === 'function') {
          this._plugin[name] = this[name].bind(this._plugin);
        } else {
          this._plugin[name] = (function(name, val) {
            if (typeof(val) !== 'undefined') {
              this[name] = val;
            }
            return this[name];
          }).bind(this, name);
        }
      }
    }
  },
  _attach: function(instance) {
    this._instance = instance; // hold the pointer to the external instance.
    instance[this._namespace] = this._plugin;
  },
  _detach: function(instance, options) {
    if (this._instance) {
      delete this._instance[this._namespace];
    }
    this._plugin = this._instance = null;
  }
});

// var BasePlugin = function(namespace, options) {
//   this.namespace = namespace || 'namespace-not-defined';
//   this.instance;
//   this.options = options || {};
//   this.plugin; // simple pointer to the plugin
// };

// BasePlugin.prototype.attach = function(instance) {
//   this.instance = instance; // hold the pointer to the external instance.
//   this.plugin = instance[this.namespace] = {};
// };

// BasePlugin.prototype.detach = function() {
//   if (this.instance) {
//     delete this.instance[this.namespace];
//   }
//   this.plugin = this.instance = null;
// };

// BasePlugin.prototype.init = function(done) {
//   // use this.instance to initialize
//   done();
// };

var App = function() {

  if (!(this instanceof App)) {
    return new App();
  }

  this.__setups__ = [];
  this.__plugins__ = {};
};

App.prototype.use = function(plugin) {

  this.__plugins__[plugin._namespace] = plugin;
  plugin._attach(this);

  if (typeof(plugin._setup) === 'function') {
    this.__setups__.push(function(cb) {
      plugin._setup.call(plugin, cb);
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

  if (plugin) {
    plugin._detach();
  }
};

App.prototype.init = function(done) {
  async.parallel(this.__setups__, done);
};

module.exports = {
  Plugin: BasePlugin,
  App: App
};