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
  'thegitfather.flabel',
  'pickadate'
]).config(function($urlRouterProvider, $locationProvider, pickadateI18nProvider) {
  $urlRouterProvider.otherwise('/');
  $locationProvider.html5Mode(true);
  pickadateI18nProvider.translations = {
    prev: '<i class="fa fa-arrow-left fa-lg" aria-hidden="true"></i>',
    next: '<i class="fa fa-arrow-right fa-lg" aria-hidden="true"></i>'
  };
}).constant('_', window._).run(function ($rootScope) {
  // allow global use of lodash
  $rootScope._ = window._;
});
