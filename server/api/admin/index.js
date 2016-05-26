'use strict';

import express from 'express';
import * as controller from './admin.controller';
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.post('/cleanDB', auth.hasRole('admin'), controller.cleanDB);

module.exports = router;
