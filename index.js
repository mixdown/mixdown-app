var async = require('async');
var _ = require('lodash');
var PubSub = require('./lib/pubsub.js');

var BasePlugin = PubSub.extend({
  _namespace_default: 'namespace-not-defined',

  init: function(options) {
    this._super();
    this._options = options || {};
  }
});

var reserved_namespaces = [
  "init",
  "use",
  "remove",
  "setup",
  "on",
  "once",
  "off",
  "emit"
];

/** Reserved words (e.g. do not attach that these namespaces) - init, use, remove, setup, on, once, removeAllListeners, removeListener **/
var App = PubSub.extend({
  init: function() {
    this._super();
  },

  use: function(plugin, namespace) {
    if (!plugin) {
      throw new Error('Plugin not defined');
    }

    var ns = namespace || plugin._namespace_default;

    //throw error if attaching at a reserved namespace.
    if (_.indexOf(reserved_namespaces, ns) >= 0) {
      throw new Error('Namespace "' + namespace + '" is reserved and cannot be attached. Reserved namespaces - ' + reserved_namespaces.join());
    }

    this[ns] = plugin;
    if (typeof(plugin._attach) === 'function') {
      plugin._attach();
    }
  },
  remove: function(namespace) {
    var plugin = this[namespace];
    delete this[namespace];

    if (plugin && typeof(plugin._detach) === 'function') {
      plugin._detach();
    }
  },
  setup: function(done) {

    var plugins = _.filter(this, function(v, k) {
      return !/^_/.test(k) && v && (typeof(v._setup) === 'function');
    });

    var setup_ops = _.map(plugins, function(p) {
      return _.bind(p._setup, p);
    });

    async.parallel(setup_ops, done);
  }
});

module.exports = {
  Plugin: BasePlugin,
  App: App
};