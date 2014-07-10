mixdown-app
===================

Mixdown app and base plugin implementation.

# Create a Plugin

Plugins use the Resig Class extend pattern for injecting plugin interfaces.  

```javascript
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
```
* **_setup**: run plugin initialization

**IMPORTANT**: All values are converted to getter/setter functions.  The extend pattern provides a much smaller and simpler interface for creating plugins, but the internals of BasePlugin and Class.extend() require that they are wrapped in order to persist the correct values.

The wrapped getter/setter looks like this for the above example.  If val is passed, then the value is set.  If not passed, then the value is simply returned.

```javascript
count: function(val);
```

# Create an App

```javascript
var App = require('mixdown-app').App;
var HelloPlugin = require('path-to-above-plugin');

var app = new App();
app.use(new HelloPlugin('foo', { name: 'Bill Murray' }));

console.log(app.foo.count());
//==> 0

console.log(app.foo.hello());
//==> 'Hello Bill Murray'

console.log(app.foo.count());
//==> 1

console.log(app.foo.hello());
//==> 'Hello Bill Murray'

console.log(app.foo.count());
//==> 2

```