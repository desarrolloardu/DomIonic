angular.module('starter.directives', [])

.directive('range', function () {
    return {
        restrict: 'C',
       
        link: function (scope, element, attr) {
            element.bind('touchstart mousedown', function(event) {
                event.stopPropagation();
                event.stopImmediatePropagation();
            });
        }
    };
 })
 
 .directive('dispositivosDirective',[ function () {
    return {
        restrict: 'E',
         
        templateUrl:'./templates/dispositivos-directive.html',
        link: function (scope, element, attr) {
            
        },
        controllerAs:'di',
        controller: 'DispositivosDirectiveCtrl'



    };
 }])
 
 
  .directive('espaciosDirective',[ function () {
    return {
        restrict: 'E',
        templateUrl:'./templates/espacios-directive.html',
        link: function (scope, element, attr) {
            
        },
        controllerAs:'es',
        controller: 'EspaciosDirectiveCtrl'



    };
 }])



.controller('DispositivosDirectiveCtrl', function($rootScope,$state,$stateParams, $scope, Dispositivos, $ionicPopover) {
	
var vm = this;
//var onholdPresionado = false;



vm.openPopover = function(event, dispositivoId){
	$scope.dispositivoIdSeleccionado = dispositivoId;
	$scope.popover.show(event);
}

$scope.editarDispositivo = function(){
	$scope.popover.hide();
	
	$state.go("dispositivoAlta", {id:$scope.dispositivoIdSeleccionado});
	
	
}

$scope.eliminarDispositivo= function(){
	
	$scope.popover.hide();
	Dispositivos.eliminar($scope.dispositivoIdSeleccionado).then( 
			function(res){
							
							vm.lista = res;
						});
}

vm.mostrarDispositivo = function(idDispositivo){
		//var parametrosActuales = {id:idDispositivo}	
		$state.go("app.dispositivo", {id:idDispositivo});
}

$ionicPopover.fromTemplateUrl('templates/popover.html', {
    scope: $scope,
  }).then(function(popover) {
    $scope.popover = popover;
  });
  
  
  vm.initialize = function() {
  
  if($stateParams.idEspacio){
      
      Dispositivos.filtrarPorEspacio($stateParams.idEspacio).then(function(res){
          
          vm.lista=res;
          
      })
      
  } else {
      
      Dispositivos.lista().then( 
				function(res){
					
								
								vm.lista = res;
							});

      }
  }
  
  
  vm.initialize();
                      

  
  $scope.$on('controlador:dispositivosDirective', function(e) {
  
        vm.initialize();

});
  

 
 
 


	
	
		

	
})

.controller('EspaciosDirectiveCtrl', function($rootScope, $state, $scope, Espacios, $ionicPopover) {

var vm = this;
//var onholdPresionado = false;

vm.openPopoverEspacios = function(event, espacioId){
	$scope.espacioIdSeleccionado = espacioId;
	$scope.popoverEspacios.show(event);
}

vm.seleccionarEspacio = function (idEsp) {
    
    $state.go('dispositivosEspacio',{idEspacio:idEsp})
    
}

$scope.editarEspacio = function(){
	$scope.popoverEspacios.hide();

//	var listaFiltrada = vm.lista.filter(function(elem){
//		return (elem.id == $scope.espacioIdSeleccionado);
	//}) 

//	alert('listaFiltrada id: ' + listaFiltrada[0].id);
	//var parametrosActuales = {id:listaFiltrada[0].id, descripcion:listaFiltrada[0].descripcion, urlImagen:listaFiltrada[0].urlImagen};	
	
	//alert('parametrosActuales id: ' + parametrosActuales.id);
	
	$state.go("espacioAlta", {id:$scope.espacioIdSeleccionado});

}

$scope.eliminarEspacio= function(){
	//alert("eliminar");
	$scope.popoverEspacios.hide();
	Espacios.eliminar($scope.espacioIdSeleccionado).then( 
			function(res){
							//alert("lista");
							vm.lista = res;
						});
}

$ionicPopover.fromTemplateUrl('templates/popoverEspacios.html', {
    scope: $scope,
  }).then(function(popover) {
    $scope.popoverEspacios = popover;
  });
  
  
  $scope.$on('controlador:espaciosDirective', function(e) {
  
Espacios.lista().then( 
				function(res){
								//alert("lista");
								vm.lista = res;
							});


});
  
  
 


})