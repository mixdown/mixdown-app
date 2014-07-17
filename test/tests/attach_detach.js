var App = require('../../index.js').App;
var TestPlugin = require('../fixture/test-plugin.js');
var assert = require('assert');
var event_emitter_interfaces = [
  "on",
  "off",
  "emit"
];

suite('Attach/Detach', function() {
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

  test('Attach & Detach', function(done) {
    assert.equal(typeof(app.foo), 'object', 'Interfaceshould exist');
    app.remove('foo');
    assert.equal(app.foo, null, 'Interface is removed');
    done();
  });

  test('Event Emitter', function(done) {

    event_emitter_interfaces.forEach(function(name) {
      assert.ok(app.foo[name], 'Interface should exist - ' + name);
    });

    app.on('test-app', function(str) {
      assert.equal(str, 'success', 'Should match emitted string');
    });

    app.foo.on('test-foo', function(str) {
      assert.equal(str, 'success', 'Should match emitted string');
    });

    var once_count = 0;
    app.foo.once('test-once', function(str) {
      once_count++;
      assert.equal(str, 'success', 'Should match emitted string');
    });

    app.emit('test-app', 'success');
    app.emit('test-foo', 'success');
    app.emit('test-once', 'success');
    app.emit('test-once', 'success');
    app.emit('test-once', 'success');
    app.emit('test-once', 'success');

    assert.equal(once_count, 1, 'Once should only have executed 1 time.');

    done();
  });

});