mixdown-app
===================

Mixdown app and base plugin implementation.

# Create a Plugin

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
# Create an App

```javascript
var App = require('mixdown-app').App;
var HelloPlugin = require('path-to-above-plugin');

var app = new App();
app.use(new HelloPlugin('foo', { name: 'Bill Murray' }));

console.log(app.foo.hello());
//==> 'Hello Bill Murray'

```