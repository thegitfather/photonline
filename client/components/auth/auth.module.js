'use strict';

angular.module('photoboxApp.auth', [
  'photoboxApp.constants',
  'photoboxApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
