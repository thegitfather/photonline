'use strict';

import _ from 'lodash';
import Gallery from './gallery.model';
import Photo from '../photo/photo.model'

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.save()
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Galleries
export function index(req, res) {
  return Gallery.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Gallery from the DB
export function show(req, res) {
  return Gallery.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Gallery in the DB
export function create(req, res) {
  let gallery = new Gallery(req.body);
  gallery.user_id = req.user;

  return Gallery.create(gallery)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Gallery in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Gallery.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Gallery from the DB
export function destroy(req, res) {
  Gallery.findById(req.params.id).exec().then(gallery => {
    if (gallery && gallery.photo_ids.length) {
      gallery.photo_ids.forEach(function(photoId) {
        Photo.findById(photoId).exec()
          .then(handleEntityNotFound(res))
          .then(removeEntity(res))
          .then(respondWithResult(res))
          .catch(handleError(res));
      });
    }
  });

  return Gallery.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}
