'use strict';

// TODO: remove es5 variant

// var express = require('express');
// var controller = require('./photo.controller');
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
import * as photoCtrl from './photo.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.get('/', photoCtrl.index);
router.get('/:id', photoCtrl.show);
router.get('/check/:checksum', photoCtrl.check);
router.post('/:checksum', auth.isAuthenticated(), photoCtrl.create);
router.put('/edit/:id', auth.isAuthenticated(), photoCtrl.update);
// router.patch('/:id', auth.isAuthenticated(), galleryCtrl.update);
// router.delete('/delete/:id', auth.isAuthenticated(), galleryCtrl.destroy);


export default router;
