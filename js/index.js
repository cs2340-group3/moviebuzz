angular
  .module('moviebuzzApp', [
    'ui.router', // for states and routing
    'mgcrea.ngStrap' // for bootstrap components
  ])
  .config(function($stateProvider) {
    $stateProvider
      .state('welcome', {
        url: '/',
        templateUrl: 'welcome.html'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'login.html',
        controller: 'LoginCtrl'
      });
  });

