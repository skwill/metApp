// weather app based on driftyco ionic-weather
// https://github.com/driftyco/ionic-weather
angular.module("ionic.metApp", ['ionic', 'ionic.service.core', 'ionic.metApp.services', 'ionic.metApp.filters', 'ionic.metApp.directives', 'ngCordova', 'ngResource'])

.constant('WUNDERGROUND_API_KEY', '1cc2d3de40fa5af0')
  .constant('FORECASTIO_KEY', '4cd3c5673825a361eb5ce108103ee84a')
  .constant('FLICKR_API_KEY', '504fd7414f6275eb5b657ddbfba80a2c')
  .filter('int', function() {
    return function(v) {
      return parseInt(v) || '';
    };
  })
  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }

      // ionicPlatform.fullscreen();
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        // StatusBar.styleDefault();
        StatusBar.hide();
        // StatusBar.styleBlackTranslucent();
      }

    });
  })

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $ionicConfigProvider.tabs.position('bottom');
  //this is the home route
  $stateProvider
    .state('app', {
      abstract: true,
      url: "/app",
      templateUrl: "app/layout/menu-layout.html"
    })

  .state('app.home', {
    url: '/home',
    views: {
      //this is a nested view. It is shown in the Ion-Nav-View in the menu-layout.html
      'mainContent': {
        templateUrl: "app/home/home.html"
      }
    }
  })

  .state('app.bullettins', {
    url: '/bullettins',
    // abstract: true,
    views: {
      //this is a nested view. It is shown in the Ion-Nav-View in the menu-layout.html
      'mainContent': {
        templateUrl: "app/bullettins/bullettins.html"
      }
    }
  })
  // .state('app.bullettin-detail', {
  //   url: '/bullettins/:bullettinId',
  //   // abstract: true,
  //   views: {
  //     //this is a nested view. It is shown in the Ion-Nav-View in the menu-layout.html
  //     'mainContent': {
  //       templateUrl: "app/bullettins/info_item.html",
  //       controller: 'BulletinsDCtrl'
  //     }
  //   }
  // })


  .state('app.bulletinsev', {
    url: '/bulletinsev',
    views: {
      //this is a nested view. It is shown in the Ion-Nav-View in the menu-layout.html
      'mainContent': {
        templateUrl: "app/bullettins/severe.html"

      }
    }
  })

  .state('app.warnings', {
    url: '/warnings',
    views: {
      //this is a nested view. It is shown in the Ion-Nav-View in the menu-layout.html
      'mainContent': {
        templateUrl: "app/warnings/warnings.html"
      }
    }
  })
    .state('app.about', {
      url: '/about',
      views: {
        'mainContent': {
          templateUrl: 'app/about/about.html'
        }
      }
    })

  .state('app.services', {
    url: '/services',
    views: {
      //this is a nested view. It is shown in the Ion-Nav-View in the menu-layout.html
      'mainContent': {
        templateUrl: "app/services/services.html"
      }
    }
  })
    .state('app.services.home', {
      //abstract: true,
      url: "/services/home",
      views: {
        //this is a nested view. It is shown in the Ion-Nav-View in the menu-layout.html
        'servicesContent': {
          templateUrl: "app/services/test.html"
        }
      }

    })


  .state('app.services.aviation', {
    //abstract: true,
    url: "/aviation",
    views: {
      'servicesContent': {
        templateUrl: "app/services/aviation.html"
      }
    }
  })

  .state('app.services.climate', {
    //abstract: true,
    url: "/services",
    views: {
      'servicesContent': {
        templateUrl: "app/services/climate.html"
      }
    }

  })

  .state('app.services.marine', {
    //abstract: true,
    url: "/services",
    views: {
      'servicesContent': {
        templateUrl: "app/services/marine.html"
      }
    }

  })

  .state('app.services.agriculture', {
    //abstract: true,
    url: "/services",
    views: {
      'servicesContent': {
        templateUrl: "app/services/agriculture.html"
      }
    }

  })

  .state('app.contact', {
    //abstract: true,
    url: "/contact",
    views: {
      'mainContent': {
        templateUrl: "app/contact.html"
      }
    }

  })
    .state('app.settings', {
      //abstract: true,
      url: "/settings",
      views: {
        'mainContent': {
          templateUrl: "app/settings.html"
        }
      }
    })


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
// .controller('appCtrl', function(metApi, $scope, $timeout, $rootScope, Weather, Geo, Flickr, $ionicModal, $ionicPlatform, $ionicPopup, $interval) {

//   $scope.msg = "";
//   var app = this;
//   $scope.test = function() {
//     // alert();
//     $scope.$broadcast("call_test");
//     console.log("test")
//     // console.log($scope)
//     return $scope.msg;
//   }

//   // $scope.test();
//   $scope.$on('pingBack', function(e, data) {
//     // alert();
//     $scope.msg = data;
//     console.log(data)
//     // console.log($scope.data);
//   })

//   // test();


// });
