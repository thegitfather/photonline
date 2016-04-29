'use strict';

class LoginController {

  constructor(Auth, $state, ServerConfig) {
    this.Auth = Auth;
    this.$state = $state;
    this.serverResponses = [];
    this.user = {};
    this.demoMode = false;

    ServerConfig.then(res => {
      if (res.data.env === 'demo') {
        this.demoMode = true;
      }
    });
  }

  login(form) {
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

angular.module('photonlineApp')
  .controller('LoginController', LoginController);
