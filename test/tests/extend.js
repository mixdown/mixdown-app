var App = require('../../index.js').App;
var TestPlugin = require('../fixture/test-plugin.js');
var assert = require('assert');

suite('Extend Base', function() {
  var app = new App();

  setup(function(done) {
    // create plugin
    var p = new TestPlugin({
      name: 'Bill Murray'
    });

    // attach it
    app.use(p, 'foo');

    app.setup(done);
  });

  test('Extend', function(done) {

    var hi = app.foo.hello();

    assert.equal(app.foo.count, 1, 'Count should be correct (1)');
    assert.equal(hi, 'Hello Bill Murray', 'Should be a number (random)');

    app.foo.hello();
    assert.equal(app.foo.count, 2, 'Count should be correct (2)');

    done();
  });

  test('Late bind scalar in _setup()', function(done) {
    assert.equal(app.foo.uninitialized_var, 'asdfghjkl', 'Value should be correct');
    done();
  });

});