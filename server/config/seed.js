/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

import User from '../api/user/user.model';


var env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  User.find( { $where: "this.name.indexOf('_regen') > -1" } ).remove().then(() => {
    User.create({
      provider: 'local',
      role: 'user',
      name: 'user_regen',
      email: 'test@example.com',
      password: '12qw34er'
    }, {
      provider: 'local',
      role: 'user',
      name: 'admin_regen',
      email: 'admin@example.com',
      password: '12qw34er'
    })
    .then(() => {
      console.log('finished populating users');
    });
  });
}

if (env === 'demo') {
  User.find( { $where: "this.name.indexOf('demo_user') > -1" } ).then(res => {
    if (res.length === 0) {
      User.create({
        provider: 'local',
        role: 'user',
        name: 'demo_user',
        email: 'demo_user@example.com',
        password: '12qw34er'
      })
      .then(() => {
        console.log('finished populating users');
      });
    }
  });
}
