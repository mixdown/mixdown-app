var _ = require('lodash');
var Class = require('class.extend');

var Event = Class.extend({
  init: function(fn, max_count) {
    this._fn = fn;
    this._max_count = max_count;
  },
  _count: 0,
  _fn: null,
  _max_count: null,
  equals: function(fn) {
    return e === fn;
  },
  valid: function() {
    if (this._max_count) {
      return this._count < this._max_count;
    } else {
      return true;
    }
  },
  execute: function() {
    this._count++;
    this._fn.apply(null, arguments);
  }
});

module.exports = Class.extend({
  init: function() {},
  _events: {},
  emit: function() {
    var name = arguments[0];
    var args = Array.prototype.slice.call(arguments, 1);
    var evs = this._events[name] || [];

    var evCopy = evs.slice(0); // copy the array in case it changes

    if (evCopy.length) {
      _.each(evCopy, function(e, i) {
        // if event expired, then remove it and do not execute.
        if (!e.valid()) {
          evs.splice(i, 1);
        } else {
          e.execute.apply(e, args);
        }
      });
    }

    return this;
  },
  once: function(name, fn) {
    this.on(name, fn, 1);
  },
  on: function(name, fn, count) {
    var ev = this._events[name];
    if (!ev) {
      this._events[name] = ev = [];
    }
    ev.push(new Event(fn, count));

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
        if (!e.equals(fn)) {
          ev.push(e);
        }
      });
    }
    this._events[name] = ev;

    return this;
  }
});