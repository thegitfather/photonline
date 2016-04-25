'use strict';

angular.module('photonlineApp.auth', [
  'photonlineApp.constants',
  'photonlineApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
