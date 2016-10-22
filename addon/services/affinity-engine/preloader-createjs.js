import Ember from 'ember';
import createjs from 'ember-createjs';
import multiton from 'ember-multiton-service';

const {
  Service,
  get,
  isPresent,
  run,
  set
} = Ember;

export default Service.extend({
  eBus: multiton('message-bus', 'engineId'),

  init(...args) {
    this._super(...args);

    const eBus = get(this, 'eBus');
    const queue = new createjs.LoadQueue(true);

    if (isPresent(createjs.Sound)) {
      queue.installPlugin(createjs.Sound);
    }

    queue.on('complete', (...args) => {
      run(() => eBus.publish('preloadCompletion', ...args));
    });

    queue.on('progress', (...args) => {
      run(() => eBus.publish('preloadProgress', ...args));
    });

    set(this, 'queue', queue);
  },

  idFor(fixture, attribute) {
    return `${fixture._type}:${fixture.id}:${attribute}`;
  },

  getElement(id, raw) {
    return get(this, 'queue').getResult(id, raw);
  },

  loadFile(file) {
    get(this, 'queue').loadFile(file);
  }
});
