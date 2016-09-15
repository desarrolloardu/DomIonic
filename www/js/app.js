// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js



angular.module('starter', ['ionic', 'starter.controllers','starter.directives','starter.services', 'ngMaterial', 'ngCordova' ])

.run(function($rootScope,$state,$ionicPlatform, $cordovaSQLite, $ionicHistory,FactoryDB) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    
    $ionicPlatform.registerBackButtonAction(function(e){
     // e.preventDefault();
     // e.stopPropagation();
      //alert(window.location);
      var vistaActual =$ionicHistory.currentStateName();
      if ($rootScope.backButtonPressedOnceToExit) {
      ionic.Platform.exitApp();
    }
    
    else if ($ionicHistory.backView()) {
      $ionicHistory.goBack();
    }
    else if (vistaActual=='modulos'){
      
      $state.go('app.inicio.espacios');
      
    
      
    }else {
      $rootScope.backButtonPressedOnceToExit = true;
      window.plugins.toast.showShortCenter(
        "Press back button again to exit",function(a){},function(b){}
      );
      setTimeout(function(){
        $rootScope.backButtonPressedOnceToExit = false;
      },2000);
    }
    e.preventDefault();
    return false;
    
    } ,100)
	
	FactoryDB.inicializarDB().then(function(){
	  
     

	   $state.go('app.inicio.espacios');	
	  
  });
	
	
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.acercade', {
    url: '/acercade',
	//cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/acercade.html',
		controller: 'AcercaDeCtrl',
		controllerAs: 'ad' 
      }
    }
  })
  
  .state('app.inicioDomtec', {
    url: '/inicioDomtec',
    params:{idTab:null},
	//cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/inicio-domtec.html',
		controller: 'InicioDomtecCtrl',
		controllerAs: 'id' 
      }
    }
  })
  
  
	
	.state('app.dispositivo', {
    url: '/dispositivos/:id',
    //params:{parametros:null},
    views: {
        'menuContent': {
        templateUrl: 'templates/dispositivo.html',
        controller: 'DispositivoCtrl',
		    controllerAs: 'di' 
		    }
	    }	
    })
	
	.state('dispositivoAlta', {
      url: '/dispositivoAlta/:id',
      
          
          templateUrl: 'templates/dispositivoAlta.html',
          controller: 'DispositivoAltaCtrl',
		  controllerAs: 'di',
       
       
    })

   
	
	.state('modulos', {
      url: '/modulos',
      //module:'modulos',
        
            templateUrl: 'templates/modulos.html',
            controller: 'ModulosCtrl',
            controllerAs: 'mo' 
        
    })
    
    .state('dispositivosEspacio', {
      url: '/dispositivosEspacio/:idEspacio',
      //module:'modulos',
        
            templateUrl: 'templates/dispositivosEspacio.html',
            controller: 'DispositivosEspacioCtrl',
            controllerAs: 'de' 
        
    })
    
	
	.state('app.modulo', {
      url: '/modulo/:moduloId',
      views: {
        'menuContent': {
          templateUrl: 'templates/modulo.html',
          controller: 'ModuloCtrl'
        }
      }
    })
	
	.state('moduloAlta', {
      url: '/moduloAlta/:id',
     
          templateUrl: 'templates/moduloAlta.html',
          controller: 'ModuloAltaCtrl',
		  controllerAs: 'ma' 
       
    })
	
	.state('app.imagenes', {
		
      url: '/imagenes',
	  params:{parametros:null},
	  cache: false,
      views: {
        'menuContent': {
          templateUrl: 'templates/imagenes.html',
          controller: 'ImagenesCtrl',
		  controllerAs: 'im' 
        }
      }
    })
	
  .state('app.espacio', {
    url: '/espacio/:espacioId',
    views: {
      'menuContent': {
        templateUrl: 'templates/espacio.html',
        controller: 'EspacioCtrl',
		controllerAs: 'es' 
      }
    }
  })
  
  .state('espacioAlta', {
      url: '/espacioAlta/:id',
   
          templateUrl: 'templates/espacioAlta.html',
          controller: 'EspacioAltaCtrl',
		  controllerAs: 'ea' 
       
    })
  
  
  .state('app.inicio', {
    url: '/inicio',
	abstract: true,
	views:{
	'menuContent': {
    templateUrl: 'templates/inicio.html',
	controller:'InicioCtrl'
	}
	}
  })
  
  .state('app.inicio.dispositivos', {
    url: '/dispositivos',
	module:'dispositivos',
    views: {
		'dispositivos-tab': {
        templateUrl: 'templates/dispositivos.html',
        controller: 'DispositivosCtrl',
		controllerAs: 'di'
		}
	}
  })
  
  
  .state('app.inicio.espacios', {
    url: '/espacios/',
	module:'espacios',
    views: {
		'espacios-tab': {
        templateUrl: 'templates/espacios.html',
        controller: 'EspaciosCtrl',
		controllerAs: 'es' 
		}
	}
  
  }) 
  
  
  // if none of the above states are matched, use this as the fallback
  //$urlRouterProvider.otherwise('/app/inicio/espacios');
});
