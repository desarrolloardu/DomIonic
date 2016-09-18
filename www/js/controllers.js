



angular.module('starter.controllers', [])





.controller('AppCtrl', function($scope, $ionicModal,$state, $timeout,FactoryDB) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};
  
  
  $scope.goDispositivos = function() {
	  FactoryDB.inicioDomtecTab('1');
	  $state.reload();
	  
  }
  
  
  $scope.goEspacios = function() {
	  FactoryDB.inicioDomtecTab('0');
	  $state.reload();
	  
  }


  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
  
  
  
})

.controller('ModulosCtrl', function($rootScope, $scope, $state, Modulos, $cordovaToast, $ionicPopover) {

	var vm = this;
	
	
	
	vm.back= function  () {
		
		$state.go('app.inicio.espacios')
		}

	
	$ionicPopover.fromTemplateUrl('templates/popoverModulos.html', {
		scope: $scope,
	}).then(function(popover) {
		$scope.popoverModulos = popover;
	});

	vm.openPopoverModulos = function(event, moduloId){
		//alert("openPopoverModulos");
		$scope.moduloIdSeleccionado = moduloId;
		$scope.popoverModulos.show(event);
	}

	$scope.editarModulo = function(){
		$scope.popoverModulos.hide();
		
		$state.go("moduloAlta", {id:$scope.moduloIdSeleccionado});

	}

	$scope.eliminarModulo= function(){
		//alert("eliminar");
		$scope.popoverModulos.hide();
		Modulos.eliminar($scope.moduloIdSeleccionado).then( 
				function(res){
					
								vm.lista = res;
							
								
							},function(err){
								
								});
	}

 
	$scope.$on('$ionicView.enter', function(e) {
		Modulos.lista().then( 
					function(res){
									//alert("lista");
									vm.lista = res;
								});
	});
	
		
})


.controller('ModuloAltaCtrl', function($scope, $stateParams,$ionicPopup,$ionicLoading,$cordovaBluetoothSerial,$ionicModal, $state, $ionicPlatform, $ionicHistory, Modulos) {
//alert("ModuloAltaCtrl");
	var vm = this;
	
	$ionicModal.fromTemplateUrl('templates/my_modal_modelo_modulos.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modalModulos = modal;
  });
  
  
 
	
	$scope.seleccionarModulo= function (item) {
		
		$scope.modalModulos.hide();
		vm.uuid=item.address
		vm.nombre=item.name
		
	}
	
	
	vm.tipoModulos= Modulos.tipoModulos();
	
	
	vm.back = function () {
		
		
		$ionicHistory.goBack();
		};
	
	vm.abrirModalModulo = function () {
		
		$scope.modalModulos.show();
		
		 $ionicLoading.show({
      template: 'Buscando Dispositivos...'
    }).then(function(){
       
    
	$cordovaBluetoothSerial.enable().then(function(res){
			
			$cordovaBluetoothSerial.discoverUnpaired().then(function(lista){
				$ionicLoading.hide();
				
				if(lista.length){
				$scope.listaModulos=lista;
					}else{
					
					var myPopup = $ionicPopup.alert( {
  title: 'No se encontraron dispositivos', // String. The title of the popup.
 template: 'Vuelva a internar nuevamente en otro momento', // String (optional). The html template to place in the popup body.
 
}).then(function(res){
	$scope.modalModulos.hide();
});	
				
					}
				
			},function(err){})
			
			
			
		},function(err){})
		
	



});
		
		
	}
	
	 $scope.$on('modal.hidden', function() {
	 
  });

	
	vm.alta = function(){
		
		if(!$stateParams.id)
		{
			//alert("insertar");
			Modulos.insertar(vm.uuid,vm.nombre,vm.clave,vm.descripcion,vm.selectTipo).then(function(res){
		//	Espacios.insertar(vm.descripcion,vm.urlImagen).then(function(res){
		
			$ionicHistory.goBack();
			
			},function(err){});
		}
		else
		{
			//alert("actualizar");
			Modulos.actualizar(vm.id, vm.uuid,vm.nombre, vm.clave, vm.descripcion, vm.selectTipo).then(function(res){
			
			$ionicHistory.goBack();
			
			},function(err){});
		}
	};

	$scope.$on('$ionicView.enter', function(e) {
		
		if(!$stateParams.id)
		{
			//alert("ALTA");
			vm.descripcion = undefined;
			vm.uuid = undefined;
			vm.clave = undefined;
			vm.selectTipo = undefined;
			vm.nombre=undefined;
			
			
		}
		else
		{
			
			var ObjetoTemp = Modulos.seleccionarId($stateParams.id);
			
			vm.descripcion = ObjetoTemp.descripcion;
			vm.uuid = ObjetoTemp.uuid;
			vm.clave = ObjetoTemp.clave;
			vm.selectTipo = undefined;
			vm.id = ObjetoTemp.id;
			vm.nombre=ObjetoTemp.nombre;
			vm.uuid=ObjetoTemp.uuid;
			
			
			
			if(ObjetoTemp.idModuloTipo)			
			vm.selectTipo = ObjetoTemp.idModuloTipo.toString();
			
		}
	});
	
})


.controller('EspacioCtrl', function($scope, $stateParams, Espacios) {
	
	/*var vm = this;
	$ionicPlatform.ready(function() {
		Espacios.lista().then( 
				function(res){
								//alert("lista");
								vm.lista = res;
							});
	})*/
})



.controller('EspacioAltaCtrl', function($scope, Espacios,Imagenes, $stateParams, $state, $ionicPlatform, $ionicHistory,$ionicModal) {

//alert("EspacioAltaCtrl");
	var vm = this;
	
	vm.urlImagen = "./img/ionic.png";
	
	
	
	vm.back = function  () {
		$ionicHistory.goBack();
		};
		
		
	$ionicModal.fromTemplateUrl('templates/my_modal_imagenes.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modalImagenes = modal;
  });
  
  
	
	$scope.imagenes=Imagenes.espacios();
	
	$scope.seleccionarImagen = function(imagen){
		
		vm.urlImagen=imagen.urlImagen;
		vm.descImagen=imagen.desc;
		vm.codImagen=imagen.cod;
	$scope.modalImagenes.hide();	
		
		
	}
	
	
	
	vm.seleccionarImagen = function(){
		
		$scope.modalImagenes.show();
		//alert("seleccionarImagen");
		//var parametrosActuales = {descripcion:vm.descripcion, urlImagen:vm.urlImagen, codigoGaleria:'espacios'}	
		//$state.go("app.imagenes", {parametros:parametrosActuales});
	}


	vm.alta = function(){
		
		if(!$stateParams.id)
		{
			//alert("insertar");
			Espacios.insertar(vm.descripcion,vm.urlImagen).then(function(res){
		
			$ionicHistory.goBack();
			
			},function(err){});
		}
		else
		{
			//alert("actualizar");
			Espacios.actualizar(vm.id, vm.descripcion, vm.urlImagen).then(function(res){
			
			$ionicHistory.goBack();
			
			},function(err){});
		}
	};

	$scope.$on('$ionicView.enter', function(e) {
		//alert("enter");
		
		if(!$stateParams.id)
		{
			//alert("ALTA");
			vm.descripcion = undefined;
			vm.urlImagen = './img/ionic.png';
			vm.descImagen= undefined;
			vm.codImagen= undefined;
		}
		else
		{
			
			var ObjetoTemp = Espacios.seleccionarId($stateParams.id)
			//alert("MODIF");
			vm.descripcion = ObjetoTemp.descripcion;
			vm.urlImagen = ObjetoTemp.urlImagen;
			vm.descImagen= ObjetoTemp.descImagen;
			vm.codImagen= ObjetoTemp.codImagen;
			vm.id = ObjetoTemp.id;
		}
	});
	
	
	
})


.controller('DispositivosCtrl', function($rootScope,$state, $scope, Dispositivos, $ionicPopover) {
	
var vm = this;
//var onholdPresionado = false;


 
 $scope.$on('$ionicView.enter', function(e) {
	 
	
	 
  $scope.$broadcast('controlador:dispositivosDirective');



});


	
	
		

	
})

.controller('DispositivoCtrl', function($scope, $stateParams, Dispositivos, IR, $ionicPlatform, $cordovaBluetoothSerial, $cordovaToast) {
	var vm =this;

	vm.listar = function(){
		
		$cordovaBluetoothSerial.list().then(exito, error);
		
	}


	$scope.$on('$ionicView.enter', function(e) {
		vm.dispositivo = Dispositivos.seleccionarId($stateParams.id);
		$cordovaToast.show('Conectando a: ' + vm.dispositivo.uuid, 'short', 'center');

		//TEST

		//	IR.insertar("tipo", "marca", "modelo", "funcion", "codigo").then(function(res){

		//	IR.lista().then(function(res){
			//	vm.listaIR = res;	
		//	})
		//},function(err){alert("error");});

		IR.filtrarTablaCodigosIr('aire ').then(function(res){
			$scope.listaPrueba=res
			
		},function(err){ alert(err)})
		
			
			/*IR.lista().then(function(res){
				
				$scope.listaPrueba=res
				
			})*/
			
		
			
		
		// FIN TEST


		$cordovaBluetoothSerial.connect(vm.dispositivo.uuid).then(conectExito, error);

	});

	$scope.$on('$ionicView.leave', function(){

		$cordovaBluetoothSerial.isConnected().then(desconectar(), failure);
	//alert("rajando!");
  // do all kind of stuff
});

	vm.actualizarValorDimmer = function(){

	//	$cordovaToast.show(vm.dimmerValor, 'short', 'center');
		$cordovaBluetoothSerial.write(vm.dimmerValor+";", enviarExito, error);
		
	}

	vm.toggleClick = function(){

		$cordovaToast.show(vm.toggle, 'short', 'center');
	//	$cordovaBluetoothSerial.write(vm.dimmerValor+";", enviarExito, error);
		
	}

	vm.enviar = function(){
		
		$cordovaToast.show(vm.intensidad, 'short', 'center');
		$cordovaBluetoothSerial.write(vm.intensidad+";", enviarExito, error);
		
	}

	vm.conectar = function(){
		
		$cordovaBluetoothSerial.connect("98:D3:31:90:33:18").then(conectExito, error);
		
	}

	vm.conectar2 = function(){
		
		$cordovaBluetoothSerial.connect("98:D3:31:90:2C:00").then(conectExito, error);
		
	}
	
	vm.conectar3 = function(){
		$cordovaBluetoothSerial.disconnect().then(desconectarExito, error);
		//$cordovaBluetoothSerial.connect("98:D3:31:60:0E:AA").then(conectExito, error);
		
	}
	
	vm.conectar4 = function(){
		
		$cordovaBluetoothSerial.connect("98:D3:31:80:3B:1A").then(conectExito, error);
		
	}
	
	function desconectar()
	{
		$cordovaBluetoothSerial.disconnect().then(desconectarExito, error);
	}
	function exito (response)
	{
		vm.lista=response;
		
		$cordovaToast.show(vm.lista[2].name, 'short', 'center');
	};
	
	function conectExito (response)
	{
		$cordovaToast.show('Conecto!', 'short', 'center');
	};

	function desconectarExito (response)
	{
		//alert("Desconecto!");
		$cordovaToast.show('Desconecto!', 'short', 'center');
	}
	
	function enviarExito (response)
	{
		$cordovaToast.show('Envio!', 'short', 'center');
	};
	
	function enableExito (response)
	{
		$cordovaToast.show("Bluetooth is enabled", 'short', 'center');
	};
	
	
	function error (response)
	{
		$cordovaToast.show(response, 'short', 'center');
	};

})

.controller('DispositivoAltaCtrl', function($scope,$ionicModal,$ionicPlatform,Dispositivos, Espacios, Modulos,Imagenes, $state, $stateParams,$ionicHistory) {

	var vm = this;
	
	
	vm.back= function () {
		$ionicHistory.goBack();
		};
	
	vm.objetoModulo = function(){
		
		Modulos.seleccionarId(vm.idModulo).then(function(res){
			
			vm.moduloSelect=res;
			alert(res.idModuloTipo);
			
		},function(err){
			
			
		});
		
		
	}
	
	
	vm.objetoEspacio = function(){
		
		Espacios.seleccionarId(vm.idEspacio).then(function(res){
			
			vm.espacioSelect=res;
			
		},function(err){
			
			
		});
		
		
	};
	
	vm.objetoCodigoIr = function(){
	
	
	
		
	};
	
	
	$ionicModal.fromTemplateUrl('dispositivoAlta/seleccionarModulo.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modalSeleccionarModulo = modal;
  });
  
  $scope.seleccionarModulo = function (item) {
	  
	  vm.moduloSelect = item;
	  vm.idModulo=item.id;
	  
	  
  }
  
  
  $ionicModal.fromTemplateUrl('dispositivoAlta/seleccionarEspacio.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modalSeleccionarEspacio = modal;
  });
  
  
  $ionicModal.fromTemplateUrl('dispositivoAlta/seleccionarTipoIr.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modalSeleccionarTipoIr = modal;
  });
  
   $ionicModal.fromTemplateUrl('dispositivoAlta/seleccionarMarcaIr.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modalSeleccionarMarcaIr = modal;
  });
  
  $ionicModal.fromTemplateUrl('dispositivoAlta/seleccionarModeloIr.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modalSeleccionarModeloIr = modal;
  });
  
  
  
  
  $scope.seleccionarEspacio = function (item) {
	  
	  vm.espacioSelect = item;
	  vm.idEspacio=item.id;
	  
	  
  }
  
  vm.abrirModalModulo = function () {
	  
	  $scope.modalSeleccionarModulo.show();
	  
  }
  
  vm.abrirModalEspacio = function () {
	  
	  $scope.modalSeleccionarEspacio.show();
	  
  }
  
  vm.abrirModalTipoIr = function (){
	  
	  $scope.modalSeleccionarTipoIr.show();
	  
  }
  
  vm.abrirModalMarcaIr = function (){
	  
	  $scope.modalSeleccionarMarcaIr.show();
	  
  }
  
   vm.abrirModalModeloIr = function (){
	  
	  $scope.modalSeleccionarModeloIr.show();
	  
  }
  
	  
  
	
	
	$ionicModal.fromTemplateUrl('templates/my_modal_imagenes.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modalImagenes = modal;
  });
  
  
	
	$scope.imagenes=Imagenes.dispositivos();
	
	$scope.seleccionarImagen = function(imagen){
		
		vm.urlImagen=imagen.urlImagen;
		vm.descImagen=imagen.desc;
		vm.codImagen=imagen.cod;
	$scope.modalImagenes.hide();	
		
		
	}
	
	
	vm.urlImagen = "./img/ionic.png";
	
	
	vm.alta = function(){
		
			if(!$stateParams.id)
			{
				Dispositivos.insertar(vm.nombre, vm.descripcion, vm.idEspacio, vm.urlImagen, vm.idModulo,vm.entradaModulo).then(function(res){
				
				$ionicHistory.goBack();
				
				},function(err){});
			}
			else
			{
				
				
				Dispositivos.actualizar(vm.id, vm.nombre, vm.descripcion, vm.idEspacio, vm.urlImagen, vm.idModulo,vm.entradaModulo).then(function(res){
				
				$ionicHistory.goBack();
				
				},function(err){});
			}
	};

	vm.seleccionarImagen = function(){
		$scope.modalImagenes.show();
	}


	$scope.$on('$ionicView.enter', function(e) {
		
		
		
		
		Espacios.lista().then(function(res){
			$scope.listaEspacios = res;
		
		
	});

	Modulos.lista().then(function(res){
		$scope.listaModulos = res;
		
	});

		
		
		if(!$stateParams.id)
		{
			vm.nombre = undefined;
			vm.descripcion = undefined;
			vm.urlImagen = './img/ionic.png';
			vm.idEspacio = undefined;
			vm.espacioSelect = undefined;
			vm.idModulo = undefined;
			vm.moduloSelect = undefined;
			vm.entradaModulo = undefined;
			vm.descImagen= undefined;
			vm.codImagen= undefined;
			vm.idCodigoIr= undefined;
		}
		else
		{
			var ObjetoId
			 Dispositivos.seleccionarId($stateParams.id).then(function(res){
			ObjetoId=res;
			vm.nombre = ObjetoId.nombre;
			vm.descripcion = ObjetoId.descripcion;
			vm.idEspacio = undefined;
			vm.espacioSelect = undefined;
			vm.urlImagen = ObjetoId.urlImagen;
			vm.descImagen= ObjetoId.descImagen;
			vm.codImagen= ObjetoId.codImagen;
			vm.idModulo= undefined;
			vm.moduloSelect = undefined;
			vm.entradaModulo= undefined;
			vm.idCodigoIr= undefined;
			vm.id = ObjetoId.id;
			
			
			
			if(ObjetoId.idEspacio)
			vm.idEspacio= ObjetoId.idEspacio;
			vm.objetoEspacio();
			if(ObjetoId.idModulo){
			vm.idModulo= ObjetoId.idModulo;
			vm.objetoModulo();
			}
			if(ObjetoId.idCodigoIr){
			vm.idCodigoIr= ObjetoId.idCodigoIr;
			vm.objetoCodigoIr();
			}
			if(ObjetoId.entradaModulo)	
			vm.entradaModulo= ObjetoId.entradaModulo.toString();
			
			
				 
				 
			 },function(err){})
			
			
					
			
			
			//$stateParams.parametros = undefined;	
		}
	});
	
	
})

.controller('ImagenesCtrl', function(Imagenes, $state, $stateParams) {

	var vm = this;
	
	if($stateParams.parametros.codigoGaleria == 'dispositivos')
	{
		vm.lista = Imagenes.dispositivos();
	}
	else if ($stateParams.parametros.codigoGaleria == 'espacios')
	{
		vm.lista = Imagenes.espacios();
	}
		

	var param = $stateParams.parametros;
	
	vm.seleccionar = function(imagen)
	{
		param.urlImagen = imagen.urlImagen;
		param.descImagen = imagen.desc;
		param.cod = imagen.cod;
		if(param.codigoGaleria == 'dispositivos')
		{
			$state.go('app.dispositivoAlta', {parametros:param});
		}
		else if (param.codigoGaleria == 'espacios')
		{
			$state.go('app.espacioAlta', {parametros:param});
		}
	}
})


.controller('AcercaDeCtrl', function($scope,$state, $ionicPlatform, $cordovaToast, FactoryDB) {
	
	var vm = this;
	
	vm.back=back;
	
	function back () {
		$state.go('app.inicio.espacios')
		}
})


.controller('InicioDomtecCtrl', function($scope,$rootScope,$state,$stateParams, $ionicPlatform, $cordovaToast, FactoryDB) {
	
	var vm = this;
	
	
	vm.select = function(tab) {
		
		vm.tabSelected = tab;
		
		if(tab=='espacios'){
		$rootScope.$broadcast('controlador:espacios');
		FactoryDB.inicioDomtecTab('0');
		}
		
			
		if(tab=='dispositivos'){
		$rootScope.$broadcast('controlador:dispositivos');	
		FactoryDB.inicioDomtecTab('1');
		}
		
		
	}
	

	
	vm.alta = function () {
		if(vm.tabSelected=='espacios')
		$state.go('app.espacioAlta');
			
			
		if(vm.tabSelected=='dispositivos')
			$state.go('app.dispositivoAlta');	
		
		
	}
	
	
	vm.actualizarEspacios = function() {
		
		$rootScope.$broadcast('controlador:espacios');
		
	}
	
	vm.actualizarDispositivos = function() {
		
		$rootScope.$broadcast('controlador:dispositivos');
		
	}
	
	
	
	
	 $scope.$on('$ionicView.enter', function(e) {
	
	
	$rootScope.$broadcast('controlador:espacios');
	$rootScope.$broadcast('controlador:dispositivos');
	vm.idTabParams=FactoryDB.inicioDomtecTab()
	
	
	
	
});
	
	
	
	
	
	
})

.controller('InicioCtrl', function($scope, $ionicPlatform, $cordovaToast, FactoryDB) {
	
	var vm = this;
	
	
	
	
})


.controller('DispositivosEspacioCtrl', function($scope,$stateParams, $ionicPlatform,$ionicHistory, $cordovaToast, FactoryDB) {
	
	var vm = this;
	
vm.back = function() {
	$ionicHistory.goBack()
	
}
	
	$scope.idEspacio=$stateParams.idEspacio
	
 $scope.$on('$ionicView.enter', function(e) {
	
	 
	$scope.$broadcast('controlador:dispositivosDirective');
	
	
})
	
	
	
})


.controller('EspaciosCtrl', function($rootScope, $state, $scope, Espacios, $ionicPopover,$ionicLoading, IR) {

var vm = this;
//var onholdPresionado = false;

  
  
 
 $scope.$on('$ionicView.enter', function(e) {

	 $ionicLoading.show({
      template: 'Actualizando...'
    	}).then(function(){

	 	IR.insertarMasivo().then(function(res){
			 
			 $ionicLoading.hide();
		 },function(err){
			 
			
			 $ionicLoading.hide();
			 
		 })
		 //alert("inserteok");
	 
	 })
	 
	$scope.$broadcast('controlador:espaciosDirective');
});
	

});