'use strict';

class SettingsController {
  constructor(Auth) {
    this.Auth = Auth;

    this.serverResponses = [];
    this.error = {};
  }

  changePassword(form) {
    this.serverResponses = []; // empty array for re-submit

    if (form.$valid) {
      this.Auth.changePassword(this.user.oldPassword, this.user.newPassword)
        .then(() => {
          this.serverResponses.push( { classes: 'is-success visible', message: 'Password successfully changed.' } );
        })
        .catch(err => {
          // console.log("err:", err);
          this.serverResponses.push( { classes: 'is-danger visible', message: 'Incorrect password!' } );
        });
    }
  }
}

angular.module('photonlineApp')
  .controller('SettingsController', SettingsController);
