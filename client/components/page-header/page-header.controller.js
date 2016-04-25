'use strict';

angular.module('photonlineApp')
  .controller('PageHeaderController', ['Auth', function (Auth) {

    this.isCollapsed = true;
    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;

  }]);
