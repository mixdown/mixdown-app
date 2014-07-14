var async = require('async');
var Class = require('class.extend');
var _ = require('lodash');

var BasePlugin = Class.extend({
  _namespace_default: 'namespace-not-defined',

  init: function(options) {
    this._options = options || {};
  }
});


var App = function() {
  if (!(this instanceof App)) {
    return new App();
  }
};

App.prototype.use = function(plugin, namespace) {
  if (!plugin) {
    throw new Error('Plugin not defined');
  }

  this[namespace || plugin._namespace_default] = plugin;
  if (plugin._attach) {
    plugin._detach();
  }
};

App.prototype.remove = function(namespace) {
  var plugin = this[namespace];
  delete this[namespace];

  if (plugin && plugin._detach) {
    plugin._detach();
  }
};

App.prototype.init = function(done) {

  var plugins = _.filter(this, function(v, k) {
    return !/^_/.test(k) && v._setup != null;
  });

  var setup_ops = _.map(plugins, function(p) {
    return _.bind(p._setup, p);
  });

  async.parallel(setup_ops, done);
};

module.exports = {
  Plugin: BasePlugin,
  App: App
};