'use strict';

// TODO: remove es5 variant

// var express = require('express');
// var controller = require('./gallery.controller');
//
// var router = express.Router();
//
// router.get('/', controller.index);
// router.get('/:id', controller.show);
// router.post('/', controller.create);
// router.put('/:id', controller.update);
// router.patch('/:id', controller.update);
// router.delete('/:id', controller.destroy);
//
// module.exports = router;


import {Router} from 'express';
import * as galleryCtrl from './gallery.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.get('/', galleryCtrl.index);
router.get('/:id', galleryCtrl.show);
router.post('/', auth.isAuthenticated(), galleryCtrl.create);
router.put('/:id', auth.isAuthenticated(), galleryCtrl.update);
// router.patch('/:id', auth.isAuthenticated(), galleryCtrl.update);
// router.delete('/delete/:id', auth.isAuthenticated(), galleryCtrl.destroy);

export default router;
