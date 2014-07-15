var _ = require('lodash');
var Class = require('class.extend');

module.exports = Class.extend({
  init: function() {
    this._events = {};
  },
  emit: function() {
    var name = arguments[0];
    var args = Array.prototype.slice.call(arguments, 1);
    var fns = this._events[name] || [];

    fns = fns.slice(0); // copy the array in case it changes

    if (fns.length) {
      _.each(fns, function(handler) {
        handler.apply(null, args);
      });
    }

    return this;
  },
  on: function(name, fn) {
    var ev = this._events[name];
    if (!ev) {
      this._events[name] = ev = [];
    }
    ev.push(fn);

    return this;
  },
  off: function(name, fn) {

    // no fn, then we are removing all listeners for this event.
    if (!fn) {
      this._events[name] = [];
      return this;
    }

    var old = this._events[name];
    var ev = [];

    if (old) {
      _.each(old, function(e, i) {
        if (e !== fn) {
          ev.push(e);
        }
      });
    }
    this._events[name] = ev;

    return this;
  }
});