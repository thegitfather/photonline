'use strict';

class SettingsController {
  constructor(Auth) {
    this.serverResponses = [];
    this.error = {};
    this.submitted = false;

    this.Auth = Auth;
  }

  changePassword(form) {
    this.submitted = true;
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

angular.module('photoboxApp')
  .controller('SettingsController', SettingsController);
