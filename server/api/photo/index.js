'use strict';

import {Router} from 'express';
import * as photoCtrl from './photo.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.get('/', photoCtrl.index);
router.get('/:id', photoCtrl.show);
router.get('/check/:checksum', photoCtrl.check);
router.post('/:checksum', auth.isAuthenticated(), photoCtrl.create);
router.put('/edit/:id', auth.isAuthenticated(), photoCtrl.update);
// router.patch('/:id', auth.isAuthenticated(), photoCtrl.update);
router.delete('/:id', auth.isAuthenticated(), photoCtrl.destroy);

export default router;
