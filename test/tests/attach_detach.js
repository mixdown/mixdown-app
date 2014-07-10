var App = require('../../index.js').App;
var TestPlugin = require('../fixture/test-plugin.js');
var assert = require('assert');

suite('Attach/Detach', function() {
  var app = new App();

  setup(function(done) {
    // create plugin
    var p = new TestPlugin('foo', {
      name: 'Bill Murray'
    });

    // attach it
    app.use(p);

    app.init(done);
  });

  test('Attach & Detach', function(done) {
    assert.equal(typeof(app.foo), 'object', 'Interfaceshould exist');
    app.remove('foo');
    assert.equal(app.foo, null, 'Interface is removed');
    done();
  });
});