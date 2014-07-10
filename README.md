mixdown-app
===================

Mixdown app and base plugin implementation.

# Create a Plugin

```javascript
var BasePlugin = require('mixdown-app').Plugin;
var inherits = require('inherits');

// we need to call base constructor.
var HelloPlugin = function(namespace, options) {
  BasePlugin.call(this, namespace, options);
};

// extend to attach parent prototype
inherits(TestPlugin, BasePlugin);

// attach methods here
HelloPlugin.prototype.attach = function(instance) {

  var self = this;

  this.plugin.hello = function() {
    self.plugin.count++;
    return 'Hello ' + self.options.name;
  };

  this.plugin.count = null;

};

// perform initialization
HelloPlugin.prototype.init = function(done) {
  this.plugin.count = 0;
  done();
};


module.exports = HelloPlugin;
```
# Create an App

```javascript
var App = require('mixdown-app').App;
var HelloPlugin = require('path-to-above-plugin');

var app = new App();
app.use(new HelloPlugin('foo', { name: 'Bill Murray' }));

console.log(app.foo.hello());
//==> 'Hello Bill Murray'

```