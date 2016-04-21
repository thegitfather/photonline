'use strict';

import {Router} from 'express';
import * as galleryCtrl from './gallery.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.get('/', galleryCtrl.index);
router.get('/:id', galleryCtrl.show);
router.post('/', auth.isAuthenticated(), galleryCtrl.create);
router.put('/:id', auth.isAuthenticated(), galleryCtrl.update);
// router.patch('/:id', auth.isAuthenticated(), galleryCtrl.update);
router.delete('/:id', auth.isAuthenticated(), galleryCtrl.destroy);

export default router;
