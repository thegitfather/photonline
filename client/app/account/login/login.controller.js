'use strict';

class LoginController {

  /* class properties (ES7) */
  //start-non-standard
  // user = {};
  // serverResponses = [];
  // submitted = false;
  //end-non-standard

  constructor(Auth, $state) {
    this.Auth = Auth;
    this.$state = $state;
    this.serverResponses = [];
    this.user = {};
    this.submitted = false;
  }

  login(form) {
    this.submitted = true;
    this.serverResponses = []; // empty array before (re)submit

    if (form.$valid) {
      this.Auth.login({
        email: this.user.email,
        password: this.user.password
      })
      .then(() => {
        // Logged in, redirect to home
        this.$state.go('main');
      })
      .catch(err => {
        // console.log("err:", err);
        this.serverResponses.push( { classes: 'is-danger visible', message: err.message } );
      });
    }
  }

}

angular.module('photoboxApp')
  .controller('LoginController', LoginController);
