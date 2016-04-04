/**
 * Gallery model events
 */

'use strict';

import {EventEmitter} from 'events';
import Gallery from './gallery.model';
var GalleryEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
GalleryEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Gallery.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    GalleryEvents.emit(event + ':' + doc._id, doc);
    GalleryEvents.emit(event, doc);
  }
}

export default GalleryEvents;
