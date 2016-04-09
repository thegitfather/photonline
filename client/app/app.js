'use strict';

angular.module('photoboxApp', [
  'photoboxApp.auth',
  'photoboxApp.admin',
  'photoboxApp.constants',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngAnimate',
  'ui.router',
  'validation.match',
  'ngFileUpload',
  'ljungmann.fileMd5',
  'thegitfather.flabel'
]).config(function($urlRouterProvider, $locationProvider) {
  $urlRouterProvider.otherwise('/');
  $locationProvider.html5Mode(true);
}).constant('_', window._).run(function ($rootScope) {
  // allow global use of lodash
  $rootScope._ = window._;
});
