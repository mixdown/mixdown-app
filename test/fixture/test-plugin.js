var BasePlugin = require('../../index.js').Plugin;

var HelloPlugin = BasePlugin.extend({
  hello: function() {
    this.count++;
    return 'Hello ' + this._options.name;
  },
  count: -100,
  _setup: function(done) {
    this.count = 0;
    done();
  }
});

module.exports = HelloPlugin;