var App = require('../../index.js').App;
var TestPlugin = require('../fixture/test-plugin.js');
var assert = require('assert');

suite('Extend Base', function() {
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

  test('Extend', function(done) {

    var hi = app.foo.hello();

    assert.equal(typeof(app.foo), 'object', 'Interfaceshould exist');
    assert.equal(app.foo.count, 1, 'Count should be correct (1)');
    assert.equal(hi, 'Hello Bill Murray', 'Should be a number (random)');

    app.foo.hello();
    assert.equal(app.foo.count, 2, 'Count should be correct (1)');

    done();
  });

});