import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import { initializeQUnitAssertions } from 'ember-message-bus';
import multiton from 'ember-multiton-service';

const { getOwner } = Ember;
const { run: { later } } = Ember;
const src = '/affinity-engine/keyframes/classroom.png';

moduleFor('service:affinity-engine/preloader-createjs', 'Unit | Service | affinity engine/preloader createjs', {
  // Specify the other units that are required for this test.
  integration: true,

  beforeEach() {
    const appInstance = getOwner(this);

    initializeQUnitAssertions(appInstance, 'eBus', Ember.Object.extend({ eBus: multiton('message-bus', 'engineId'), engineId: 'bar' }));
  }
});

test('publishes `preloadProgress` as it loads', function(assert) {
  assert.expect(3);

  const done = assert.async();

  const service = this.subject({ engineId: 'bar' });

  assert.willPublish('preloadProgress', '`preloadProgress` was triggered');
  service.loadFile({ id: 'foo', src });

  later(() => {
    done();
  }, 100);
});

test('publishes `preloadCompletion` once it is done loading', function(assert) {
  assert.expect(1);

  const done = assert.async();

  const service = this.subject({ engineId: 'bar' });

  assert.willPublish('preloadCompletion', '`preloadCompletion` was triggered');
  service.loadFile({ id: 'foo', src });

  later(() => {
    done();
  }, 100);
});

test('`idFor` returns a string specific to the fixture and attr', function(assert) {
  assert.expect(1);

  const service = this.subject({ engineId: 'bar' });

  assert.equal(service.idFor({ _type: 'foo', id: 'bar' }, 'baz'), 'foo:bar:baz', 'string is correct');
});

test('`loadFile` adds a file to the queue', function(assert) {
  assert.expect(1);

  const done = assert.async();

  const service = this.subject({ engineId: 'bar' });

  service.loadFile({ id: 'foo', src });

  later(() => {
    assert.equal(service.get('queue._loadedResults.foo.nodeName'), 'IMG', 'file is loaded');

    done();
  }, 100);
});

test('`getElement` returns the preloaded dom element', function(assert) {
  assert.expect(2);

  const done = assert.async();

  const service = this.subject({ engineId: 'bar' });

  service.loadFile({ id: 'foo', src });

  later(() => {
    const element = service.getElement('foo');

    assert.equal(element.tagName, 'IMG', 'returns an img');
    assert.equal(element.src.substring(0, 5), 'blob:', 'src is a preloaded blob');

    done();
  }, 100);
});
