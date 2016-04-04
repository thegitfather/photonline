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
  'angularFileUpload',
  'ljungmann.fileMd5'
]).config(function($urlRouterProvider, $locationProvider) {
  $urlRouterProvider.otherwise('/');
  $locationProvider.html5Mode(true);
}).constant('_', window._).run(function ($rootScope) {
  // allow global use of lodash
  $rootScope._ = window._;
});
