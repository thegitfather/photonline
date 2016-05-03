'use strict';

import express from 'express';
import passport from 'passport';
import {setTokenCookie} from '../auth.service';

var router = express.Router();

router
  .get('/', passport.authenticate('github', {
    scope: [ 'user:email' ],
    failureRedirect: '/login',
    session: false
  }))
  .get('/callback', passport.authenticate('github', {
    failureRedirect: '/login',
    session: false
  }), setTokenCookie);

export default router;
