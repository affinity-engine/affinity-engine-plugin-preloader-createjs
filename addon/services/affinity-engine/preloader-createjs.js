import Ember from 'ember';
import createjs from 'ember-createjs';
import { BusPublisherMixin } from 'ember-message-bus';

const {
  Service,
  get,
  isPresent,
  set
} = Ember;

export default Service.extend(BusPublisherMixin, {
  init(...args) {
    this._super(...args);

    const engineId = get(this, 'engineId');
    const queue = new createjs.LoadQueue(true);

    if (isPresent(createjs.Sound)) {
      queue.installPlugin(createjs.Sound);
    }

    queue.on('complete', (...args) => {
      this.publish(`ae:${engineId}:preloadCompletion`, ...args);
    });

    queue.on('progress', (...args) => {
      this.publish(`ae:${engineId}:preloadProgress`, ...args);
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
