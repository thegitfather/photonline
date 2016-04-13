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
import mkdirp from 'mkdirp';
import sharp from 'sharp';
import fs from 'fs';
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
  console.log("check() - req.params.checksum:", req.params.checksum);
  Photo.findOne({ md5: req.params.checksum }).exec().then(data => {
    // console.log("data:", data);
    if (data) {
      console.log("fileAlreadyExists: true");
      res.send({fileAlreadyExists: true}).end();
    } else {
      console.log("fileAlreadyExists: false");
      res.send({fileAlreadyExists: false}).end();
    }
  }).catch(handleError(res));
}

// Creates a new Photo in the DB
// export function create(req, res) {
//   return Photo.create(req.body)
//     .then(respondWithResult(res, 201))
//     .catch(handleError(res));
// }

export function create(req, res) {
  const dest = './uploads/pool/';

  let photo;
  let md5 = req.params.checksum;
  let filename = md5 + ".jpg";

  // prevent upload if md5 already in db
  Photo.findOne({ md5: md5 }).exec().then(existingPhoto => {
    // console.log("data:", data);
    if (existingPhoto) {
      console.log("serverCheck fileAlreadyExists: true (gonna skip upload...)");
      skipUpload(existingPhoto);
    } else {
      console.log("serverCheck fileAlreadyExists: false (gonna upload...)");
      upload();
    }
  }).catch(handleError(res));

  function upload() {
    let storage = multer.diskStorage({
      // destination: './uploads/'+ req.user.name,
      destination: function (req, file, cb) {
        mkdirp.sync(dest);
        cb(null, dest);
      },
      filename: function (req, file, cb) {
        // console.log("file:", file);
        // TODO: server side md5 generation / db update (cron job?)
        if (md5.length !== 32) {
          filename = getRandomHash(16) + ".jpg";
        }
        cb(null, filename);
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

    multerUpload(req, res, function (uploadError) {
      if (uploadError) {
        console.log("uploadError:", uploadError);
        return res.status(400).send({
          message: 'Error occurred while uploading photo'
        });
      } else {
        photo = new Photo(req.body);
        photo.path = dest;
        photo.filename = filename;

        if (photo.position === 0) {
          createPreviewImage(photo.gallery_id);
        }

        // push current photo id to gallery
        Gallery.findById(photo.gallery_id).exec()
          .then(function(res) {
            res.photo_ids.push(photo._id);
            res.save();
          });

        // create new photo entry
        Photo.create(photo)
          .then(respondWithResult(res, 201))
          .catch(handleError(res));
      }
    })
  }

  function skipUpload(existingPhoto) {
    let clientPhotoData = new Photo(req.body);
    clientPhotoData.path = dest;
    clientPhotoData.filename = md5 + ".jpg";

    if (clientPhotoData.position === 0) {
      createPreviewImage(clientPhotoData.gallery_id);
    }

    // push current photo id to gallery
    Gallery.findById(clientPhotoData.gallery_id).exec()
      .then(function(res) {
        res.photo_ids.push(clientPhotoData._id);
        res.save();
      });

    // create new photo entry in DB
    Photo.create(clientPhotoData)
      .then(respondWithResult(res, 201))
      .catch(handleError(res));

  }

  function createPreviewImage(galleryId) {
    fs.stat(dest + filename, function(err, stats) {
      if (stats !== undefined) {
        mkdirp.sync("uploads/preview/");
        sharp(dest + filename)
        .resize(196, null)
        .toFile('uploads/preview/gallery_' + galleryId + '.jpg')
        .then(info => {
          // console.log("info:", info);
        })
        .catch(err => {
          console.error("err:", err);
        });
      }
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
