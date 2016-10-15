import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import { initializeQUnitAssertions } from 'ember-message-bus';

const { getOwner } = Ember;
const { run: { later } } = Ember;
const src = '/affinity-engine/keyframes/classroom.png';

moduleFor('service:affinity-engine/preloader-createjs', 'Unit | Service | affinity engine/preloader createjs', {
  // Specify the other units that are required for this test.
  integration: true,

  beforeEach() {
    const appInstance = getOwner(this);

    initializeQUnitAssertions(appInstance);
  }
});

test('publishes `ae:engineId:preloadProgress` as it loads', function(assert) {
  assert.expect(3);

  const done = assert.async();

  const service = this.subject({ engineId: 'bar' });

  assert.willPublish('ae:bar:preloadProgress', '`preloadProgress` was triggered');
  service.loadFile({ id: 'foo', src });

  later(() => {
    done();
  }, 10);
});

test('publishes `ae:engineId:preloadCompletion` once it is done loading', function(assert) {
  assert.expect(1);

  const done = assert.async();

  const service = this.subject({ engineId: 'bar' });

  assert.willPublish('ae:bar:preloadCompletion', '`preloadCompletion` was triggered');
  service.loadFile({ id: 'foo', src });

  later(() => {
    done();
  }, 10);
});

test('`idFor` returns a string specific to the fixture and attr', function(assert) {
  assert.expect(1);

  const service = this.subject();

  assert.equal(service.idFor({ _type: 'foo', id: 'bar' }, 'baz'), 'foo:bar:baz', 'string is correct');
});

test('`loadFile` adds a file to the queue', function(assert) {
  assert.expect(1);

  const done = assert.async();

  const service = this.subject();

  service.loadFile({ id: 'foo', src });

  later(() => {
    assert.equal(service.get('queue._loadedResults.foo.nodeName'), 'IMG', 'file is loaded');

    done();
  }, 10);
});

test('`getElement` returns the preloaded dom element', function(assert) {
  assert.expect(2);

  const done = assert.async();

  const service = this.subject();

  service.loadFile({ id: 'foo', src });

  later(() => {
    const element = service.getElement('foo');

    assert.equal(element.tagName, 'IMG', 'returns an img');
    assert.equal(element.src.substring(0, 5), 'blob:', 'src is a preloaded blob');

    done();
  }, 10);
});
