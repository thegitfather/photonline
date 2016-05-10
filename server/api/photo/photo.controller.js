/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/photo              ->  index
 * POST    /api/photo              ->  create
 * GET     /api/photo/:id          ->  show
 * PUT     /api/photo/:id          ->  update
 * DELETE  /api/photo/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Photo from './photo.model';
import Gallery from '../gallery/gallery.model';
import multer from 'multer';
import sharp from 'sharp';
import fileExists from 'file-exists';
import config from '../../config/environment';
import sharedConfig from '../../config/environment/shared';


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

// Gets a list of Photos
export function index(req, res) {
  return Photo.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Photo from the DB
export function show(req, res) {
  return Photo.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function check(req, res) {
  let fileDoesExist = fileExists(config.photoPoolPath + '/' + req.params.checksum + ".jpg");
  console.log(`check fileExists(${req.params.checksum}.jpg):`, fileDoesExist);
  res.send({fileAlreadyExists: fileDoesExist}).end();
}

export function create(req, res) {
  let md5 = req.params.checksum;
  let fileDoesExist = fileExists(config.photoPoolPath + '/' + req.params.checksum + ".jpg");
  let photoPromise;

  if (fileDoesExist) {
    photoPromise = skipUpload(req, md5);
  } else {
    photoPromise = upload(req, res, md5);
  }

  photoPromise.then(photoData => {
    createThumbnail(photoData).then(() => {
      // push current photo id to gallery
      Gallery.findById(photoData.gallery_id).exec().then(res => {
        res.photo_ids.push(photoData._id);
        res.save();
      });

      Photo.create(photoData)
      .then(respondWithResult(res, 201))
      .catch(handleError(res));
    });
  }).catch(err => {
    console.log("err:", err);
    return res.status(400).send({
      message: 'Error occurred while uploading photo'
    });
  });
}

function skipUpload(req, md5) {
  // create new photo object and return it as promise
  let photo = new Photo(req.body);
  photo.path = '/public/photo_pool/';
  photo.filename = req.body.md5 + ".jpg";
  return new Promise((resolve, reject) => {
    resolve(photo);
  });
}

function upload(req, res, md5) {
  let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, config.publicPath + '/photo_pool');
    },
    filename: function (req, file, cb) {
      // TODO: server side md5 generation / db update (cron job?)
      if (md5.length !== 32) {
        cb(null, getRandomHash(16) + ".jpg");
      } else {
        cb(null, md5 + ".jpg");
      }
    }
  });

  let multerUpload = multer({
    storage: storage,
    limits: {
      fileSize: sharedConfig.uploadLimits.maxFileSize
    },
    fileFilter: function (req, file, cb) {
      let isJpeg = (/image\/jpeg/i).test(file.mimetype);
      if (isJpeg) { cb(null, true); }
      else { cb(new Error("mime is not 'image/jpeg'")); }
    }
  }).single('photo');

  return new Promise((resolve, reject) => {
    multerUpload(req, res, function (uploadError) {
      if (uploadError) {
        console.log("uploadError:", uploadError);
        reject(uploadError);
      } else {
        let photo = new Photo(req.body);
        photo.path = '/public/photo_pool/';
        photo.filename = req.body.md5 + ".jpg";
        resolve(photo);
      }
    });
  });

}

function createThumbnail(photo) {
  let image = sharp(config.photoPoolPath + '/' + photo.md5 + '.jpg');

  return image
    .metadata()
    .then(metadata => {
      image.metadata = metadata;
      return image;
    })
    .then(data => {
      if (!fileExists(config.photoThumbsPath + '/thumb_' + photo.md5 + '.jpg')) {
        image
          .resize(204, 204)
          .max()
          .toFile(config.photoThumbsPath + '/thumb_' + photo.md5 + '.jpg')
      }
      return image;
    })
    .then(data => {
      // create gallery preview image for gallery list view
      if (photo.position === 0) {
        image
          .resize(204, 136)
          .crop()
          .toFile(config.galleryThumbsPath + '/thumb_' + photo.gallery_id + '.jpg');
      }
      return image;
    })
    .catch(err => {
      console.error("err:", err);
    });
}

function getRandomHash(count) {
  const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
  var result = '', i;
  for (i = 0; i < count; i++) {
    result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  return result;
}

// Updates an existing Photo in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Photo.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Photo from the DB
export function destroy(req, res) {
  return Photo.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
