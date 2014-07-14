var BasePlugin = require('../../index.js').Plugin;

var HelloPlugin = BasePlugin.extend({
  hello: function() {
    this.count++;
    return 'Hello ' + this._options.name;
  },
  count: -100,
  uninitialized_var: null,
  _setup: function(done) {
    this.count = 0;
    this.uninitialized_var = "asdfghjkl";
    done();
  }
});

module.exports = HelloPlugin;