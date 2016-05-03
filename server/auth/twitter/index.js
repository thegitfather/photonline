'use strict';

import express from 'express';
import passport from 'passport';
import {setTokenCookie} from '../auth.service';

var router = express.Router();

router
  .get('/', passport.authenticate('twitter', {
    failureRedirect: '/login',
    session: false
  }))
  .get('/callback', passport.authenticate('twitter', {
    failureRedirect: '/login',
    session: false
  }), setTokenCookie);

export default router;
