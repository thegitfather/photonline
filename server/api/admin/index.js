'use strict';

import {Router} from 'express';
import * as controller from './admin.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.post('/cleanDB', auth.hasRole('admin'), controller.cleanDB);

export default router;
