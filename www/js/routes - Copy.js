angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('tabsController', {
    url: '/tabs',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('tabsController.login', {
    url: '/login',
    views: {
      'tab1': {
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      }
    }
  })

  .state('cameraFeed', {
    url: '/camera',
    templateUrl: 'templates/cameraFeed.html',
    controller: 'ImageCtrl'
  })

  .state('gPSTracker', {
    url: '/gps',
    templateUrl: 'templates/gPSTracker.html',
    controller: 'GPSCtrl'
  })

   

  .state('selectVehicle', {
    url: '/vehicle',
    templateUrl: 'templates/selectVehicle.html',
    controller: 'VehicleCtrl'
  })

  .state('logout', {
    url: '/logout',
    templateUrl: 'templates/logout.html',
    controller: 'LogoutCtrl'
  })


$urlRouterProvider.otherwise('/tabs')

  

});