/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

import User from '../api/user/user.model';


User.find( { $where: "this.name.indexOf('_regen') > -1" } ).remove()
  .then(() => {
    User.create({
      provider: 'local',
      name: 'user_regen',
      email: 'test@example.com',
      password: '12qw34er'
    }, {
      provider: 'local',
      role: 'admin',
      name: 'admin_regen',
      email: 'admin@example.com',
      password: '12qw34er'
    })
    .then(() => {
      console.log('finished populating users');
    });
  });
