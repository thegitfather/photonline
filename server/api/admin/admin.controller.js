'use strict';

import _ from 'lodash';
import fs from 'fs';
import Photo from '../photo/photo.model';
import Gallery from '../gallery/gallery.model';
import config from '../../config/environment';


function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
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

export function cleanDB(req, res) {
  console.log("cleanDB()");

  let dbPoolEntries = [];
  let dbPhotoThumbEntries = [];
  let dbGalleryThumbEntries = [];


  var findPhoto = function(id) {
    return Photo.find({ md5: id[0] }).exec();
  }

  var findGallery = function(id) {
    return Gallery.find({ _id: id }).exec();
  }

  dbPoolEntries = cleanFolder(config.photoPoolPath, findPhoto);
  dbPhotoThumbEntries = cleanFolder(config.photoThumbsPath, findPhoto);
  dbGalleryThumbEntries = cleanFolder(config.galleryThumbsPath, findGallery);

  return Promise.all(dbPoolEntries.concat( dbPhotoThumbEntries, dbGalleryThumbEntries) ).then(values => {
    console.log("values:", values);
    res.status(200).json(_.compact(values));
  });

  function cleanFolder(path, dbQueryFunc) {
    let dirContent, dbEntryPromises = [];

    // first get a list of all files in path
    try {
      dirContent = fs.readdirSync(path);
    } catch(err) {
      if (err.code === 'ENOENT') {
        console.error('Directory not found!');
        return;
      } else { throw err; }
    }

    if (dirContent !== undefined && dirContent.length) {
      dirContent.forEach( (curVal, index, arr) => {
        let id = /[^\W_]{16,32}/i.exec(curVal),
            dbEntryPromise;
        if (id) {
          dbEntryPromise = dbQueryFunc(id).then(res => {
            if (!res.length) {
              deleteFile(path + "/" + curVal);
              return path + "/" + curVal;
            }
          });
          dbEntryPromises.push( dbEntryPromise );
        }
      });
    }

    return dbEntryPromises;
  }

  // TODO: refactor to util functions?
  function deleteFile(path) {
    try {
      // TODO: return promisify or callback?
      fs.unlink(path);
    } catch(err) {
      if (err.code === 'ENOENT') {
        console.error('File not found!');
      } else { throw err; }
    }
  }

}
