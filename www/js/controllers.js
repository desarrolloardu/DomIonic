



angular.module('starter.controllers', [])





	.controller('AppCtrl', function ($scope, $ionicModal, $state, $timeout, FactoryDB) {

		// With the new view caching in Ionic, Controllers are only called
		// when they are recreated or on app start, instead of every page change.
		// To listen for when this page is active (for example, to refresh data),
		// listen for the $ionicView.enter event:
		//$scope.$on('$ionicView.enter', function(e) {
		//});

		// Form data for the login modal
		$scope.loginData = {};


		$scope.goDispositivos = function () {
			FactoryDB.inicioDomtecTab('1');
			$state.reload();

		}


		$scope.goEspacios = function () {
			FactoryDB.inicioDomtecTab('0');
			$state.reload();

		}


		// Create the login modal that we will use later
		$ionicModal.fromTemplateUrl('templates/login.html', {
			scope: $scope
		}).then(function (modal) {
			$scope.modal = modal;
		});

		// Triggered in the login modal to close it
		$scope.closeLogin = function () {
			$scope.modal.hide();
		};

		// Open the login modal
		$scope.login = function () {
			$scope.modal.show();
		};

		// Perform the login action when the user submits the login form
		$scope.doLogin = function () {
			console.log('Doing login', $scope.loginData);

			// Simulate a login delay. Remove this and replace with your login
			// code if using a login system
			$timeout(function () {
				$scope.closeLogin();
			}, 1000);
		};



	})

	.controller('ModulosCtrl', function ($rootScope, $scope, $state, Modulos, $cordovaToast, $ionicPopover) {

		var vm = this;



		vm.back = function () {

			$state.go('app.inicio.espacios')
		}


		$ionicPopover.fromTemplateUrl('templates/popoverModulos.html', {
			scope: $scope,
		}).then(function (popover) {
			$scope.popoverModulos = popover;
		});

		vm.openPopoverModulos = function (event, moduloId) {
			//alert("openPopoverModulos");
			$scope.moduloIdSeleccionado = moduloId;
			$scope.popoverModulos.show(event);
		}

		$scope.editarModulo = function () {
			$scope.popoverModulos.hide();

			$state.go("moduloAlta", { id: $scope.moduloIdSeleccionado });

		}

		$scope.eliminarModulo = function () {
			//alert("eliminar");
			$scope.popoverModulos.hide();
			Modulos.eliminar($scope.moduloIdSeleccionado).then(
				function (res) {

					vm.lista = res;


				}, function (err) {

				});
		}


		$scope.$on('$ionicView.enter', function (e) {
			Modulos.lista().then(
				function (res) {
					//alert("lista");
					vm.lista = res;
				});
		});


	})


	.controller('ModuloAltaCtrl', function ($scope, $stateParams, $ionicPopup, $ionicLoading, $cordovaBluetoothSerial, $ionicModal, $state, $ionicPlatform, $ionicHistory, Modulos) {
		//alert("ModuloAltaCtrl");
		var vm = this;

		$ionicModal.fromTemplateUrl('templates/my_modal_modelo_modulos.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function (modal) {
			$scope.modalModulos = modal;
		});




		$scope.seleccionarModulo = function (item) {

			$scope.modalModulos.hide();
			vm.uuid = item.address
			vm.nombre = item.name

		}


		vm.tipoModulos = Modulos.tipoModulos();


		vm.back = function () {


			$ionicHistory.goBack();
		};

		vm.abrirModalModulo = function () {

			$scope.modalModulos.show();

			$ionicLoading.show({
				template: 'Buscando Modulos...'
			}).then(function () {


				$cordovaBluetoothSerial.enable().then(function (res) {

					$cordovaBluetoothSerial.discoverUnpaired().then(function (lista) {
						$ionicLoading.hide();

						if (lista.length) {
							$scope.listaModulos = lista;
						} else {

							var myPopup = $ionicPopup.alert({
								title: 'No se encontraron modulos', // String. The title of the popup.
								template: 'Vuelva a internar nuevamente en otro momento', // String (optional). The html template to place in the popup body.

							}).then(function (res) {
								$scope.modalModulos.hide();
							});

						}

					}, function (err) { })



				}, function (err) { })





			});


		}

		$scope.$on('modal.hidden', function () {

		});


		vm.alta = function () {

			if (!$stateParams.id) {
				//alert("insertar");
				Modulos.insertar(vm.uuid, vm.nombre, vm.clave, vm.descripcion, vm.selectTipo).then(function (res) {
					//	Espacios.insertar(vm.descripcion,vm.urlImagen).then(function(res){

					$ionicHistory.goBack();

				}, function (err) { });
			}
			else {
				//alert("actualizar");
				Modulos.actualizar(vm.id, vm.uuid, vm.nombre, vm.clave, vm.descripcion, vm.selectTipo).then(function (res) {

					$ionicHistory.goBack();

				}, function (err) { });
			}
		};

		$scope.$on('$ionicView.enter', function (e) {

			if (!$stateParams.id) {
				//alert("ALTA");
				vm.descripcion = undefined;
				vm.uuid = undefined;
				vm.clave = undefined;
				vm.selectTipo = undefined;
				vm.nombre = undefined;


			}
			else {
				var ObjetoTemp;
				Modulos.seleccionarId($stateParams.id).then(function (res) {
					ObjetoTemp = res;

					vm.descripcion = ObjetoTemp.descripcion;
					vm.uuid = ObjetoTemp.uuid;
					vm.clave = ObjetoTemp.clave;
					vm.selectTipo = undefined;
					vm.id = ObjetoTemp.id;
					vm.nombre = ObjetoTemp.nombre;
					vm.uuid = ObjetoTemp.uuid;



					if (ObjetoTemp.idModuloTipo)
						vm.selectTipo = ObjetoTemp.idModuloTipo.toString();

				})


			}
		});

	})


	.controller('EspacioCtrl', function ($scope, $stateParams, Espacios) {

		/*var vm = this;
		$ionicPlatform.ready(function() {
			Espacios.lista().then( 
					function(res){
									//alert("lista");
									vm.lista = res;
								});
		})*/
	})



	.controller('EspacioAltaCtrl', function ($scope, Espacios, Imagenes, $stateParams, $state, $ionicPlatform, $ionicHistory, $ionicModal) {

		//alert("EspacioAltaCtrl");
		var vm = this;

		vm.urlImagen = "./img/ionic.png";



		vm.back = function () {
			$ionicHistory.goBack();
		};


		$ionicModal.fromTemplateUrl('templates/my_modal_imagenes.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function (modal) {
			$scope.modalImagenes = modal;
		});



		$scope.imagenes = Imagenes.espacios();

		$scope.seleccionarImagen = function (imagen) {

			vm.urlImagen = imagen.urlImagen;
			vm.descImagen = imagen.desc;
			vm.codImagen = imagen.cod;
			$scope.modalImagenes.hide();


		}



		vm.seleccionarImagen = function () {

			$scope.modalImagenes.show();
			//alert("seleccionarImagen");
			//var parametrosActuales = {descripcion:vm.descripcion, urlImagen:vm.urlImagen, codigoGaleria:'espacios'}	
			//$state.go("app.imagenes", {parametros:parametrosActuales});
		}


		vm.alta = function () {

			if (!$stateParams.id) {
				//alert("insertar");
				Espacios.insertar(vm.descripcion, vm.urlImagen).then(function (res) {

					$ionicHistory.goBack();

				}, function (err) { });
			}
			else {
				//alert("actualizar");
				Espacios.actualizar(vm.id, vm.descripcion, vm.urlImagen).then(function (res) {

					$ionicHistory.goBack();

				}, function (err) { });
			}
		};

		$scope.$on('$ionicView.enter', function (e) {
			//alert("enter");

			if (!$stateParams.id) {
				//alert("ALTA");
				vm.descripcion = undefined;
				vm.urlImagen = './img/ionic.png';
				vm.descImagen = undefined;
				vm.codImagen = undefined;
			}
			else {

				var ObjetoTemp = Espacios.seleccionarId($stateParams.id)
				//alert("MODIF");
				vm.descripcion = ObjetoTemp.descripcion;
				vm.urlImagen = ObjetoTemp.urlImagen;
				vm.descImagen = ObjetoTemp.descImagen;
				vm.codImagen = ObjetoTemp.codImagen;
				vm.id = ObjetoTemp.id;
			}
		});



	})


	.controller('DispositivosCtrl', function ($rootScope, $state, $scope, Dispositivos, $ionicPopover) {

		var vm = this;
		//var onholdPresionado = false;



		$scope.$on('$ionicView.enter', function (e) {



			$scope.$broadcast('controlador:dispositivosDirective');



		});







	})


	.controller('DispositivoCtrl', function ($scope, $stateParams, Dispositivos, IR, $ionicPlatform, $cordovaBluetoothSerial, $cordovaToast, $cordovaNetwork, $http) {

		var vm = this;
		var contador = 0;
		var idSet;
		var idsetKeep;
		var actualizoToggle;
		vm.listar = function () {

			$cordovaBluetoothSerial.list().then(exito, error);

		}


		var conectar = function (uuid) {
			$cordovaBluetoothSerial.connect(uuid).then(conectExito, errorConexionBluetooth);
		}

		$scope.$on('$ionicView.enter', function (e) {


			//alert("ENTER: ");
			actualizoToggle = false;

			Dispositivos.seleccionarId($stateParams.id).then(function (res) {


				//alert("seleccionarId");

				vm.dispositivo = res;

				//	alert("Tipo dispositivo: " + res.idModuloTipo);

				//alert("Tipo dispositivo: " + res.idModuloTipo);


				if (res.idModuloTipo == "IR") {// si es tipo IR => cargo las funcionesIR
					//alert("idDispositivoIr: " + idDispositivoIr);

					//	alert("es IR => cargo listado de funciones");

					IR.devolverFuncionesIRPorId(res.idDispositivoIr).then(function (res) {
						vm.listaFuncionesIR = res

					}, function (err) { alert(err) })
				}

				//alert('Conectando a: ');

				$cordovaToast.show('Conectando a: ' + vm.dispositivo.uuid, 'short', 'center');


				conectar(vm.dispositivo.uuid);
				//$cordovaBluetoothSerial.connect(vm.dispositivo.uuid).then(conectExito, error);

			})

		});

		$scope.$on('$ionicView.leave', function () {

			clearInterval(idsetKeep);

			$cordovaBluetoothSerial.isConnected().then(desconectar(), failure);



		});


		vm.accion = function (funcion, dispositivoIr) {

			//alert("ENTRO dispositivoIr: " + dispositivoIr);

			var funcionIR = vm.listaFuncionesIR.filter(function (elem) {
				return ((elem.funcion == funcion) && (elem.idDispositivoIr == dispositivoIr));
			})


			alert("funcion: " + funcion + " codigo: " + funcionIR[0].codigo);

			if (funcion == "subirTemp") {
				//alert("subirTemp");
				var temperaturaDispositivo;

				//alert("$stateParams.id: " + $stateParams.id);

				Dispositivos.seleccionarParametro($stateParams.id, "temperatura").then(function (res) {
					temperaturaDispositivo = res[0];
					//alert("res: " + res[0].valor);
					//	alert("temperaturaDispositivo.valor: " + temperaturaDispositivo.valor);
					var val = parseInt(temperaturaDispositivo.valor);
					val = val + 1;
					vm.temperatura = val.toString();
					//		alert("val: " + val);
					Dispositivos.actualizarParametro($stateParams.id, "temperatura", val.toString()).then(function (res) {

						EjecutarComandoIR(funcionIR);

						//		alert("actualizo el valor, subio temp val: " + val);
					}, function (err) { alert(err) })

				}, function (err) { alert(err) })

			}

			if (funcion == "bajarTemp") {
				var temperaturaDispositivo;

				Dispositivos.seleccionarParametro($stateParams.id, "temperatura").then(function (res) {
					temperaturaDispositivo = res[0];
					//		alert("temperaturaDispositivo.valor: " + temperaturaDispositivo.valor);
					var val = parseInt(temperaturaDispositivo.valor);
					val = val - 1;
					vm.temperatura = val.toString();
					Dispositivos.actualizarParametro($stateParams.id, "temperatura", val.toString()).then(function (res) {
						//		alert("actualizo el valor, bajo temp val: " + val);
						EjecutarComandoIR(funcionIR);
					}, function (err) { alert(err) })

				}, function (err) { alert(err) })
			}

		}

		vm.actualizarValorDimmer = function () {

			//	$cordovaToast.show(vm.dimmerValor, 'short', 'center');
			if (vm.conectBluetooth) {
				$cordovaToast.show(vm.dimmerValor, 'short', 'center');
				$cordovaBluetoothSerial.write(vm.dimmerValor + ";", enviarExito, error);

			} else if (vm.conectNetwork) {

				var UrlSend = "http://domtec.hol.es/admin/modulos//accionar.php?";

				var idModulo = vm.dispositivo.idModulo;
				var entrada = vm.dispositivo.entradaModulo;
				var accion = 'intensidad';
				var valor = vm.dimmerValor;

				UrlSend = UrlSend + 'idModulo=' + (idModulo || '') + '&entrada=' + (entrada || '') + '&accion=' + (accion || '') + '&valor=' + (valor || '0');

				alert(UrlSend);

				$http.get(UrlSend)
					.then(function (response) {
						//$scope.myWelcome = response.data;
						alert(response.data);
					});

			}
		}

		vm.toggleClick = function () {

			$cordovaToast.show(vm.toggle, 'short', 'center');
			//	$cordovaBluetoothSerial.write(vm.dimmerValor+";", enviarExito, error);
			if (vm.conectBluetooth) {
				alert("Ejecutar la accion por Bluetooth");

				var accion;
				if (vm.toggle)
					accion = "ON;";
				else
					accion = "OFF;";


				alert('toggle ' + vm.toggle + ' accion ' + accion);

				$cordovaBluetoothSerial.write(accion, enviarExito, error);


			} else if (vm.conectNetwork) {

				//var UrlSend = "http://domtec.hol.es/admin/modulos/accionar.php?";
				
				var ipServer = "192.168.1.47";
				var UrlSend = "http://" + ipServer + "/admin/modulos/accionar.php?";

				var accion;
				if (vm.toggle)
					accion = "ON";
				else
					accion = "OFF";

				var idModulo = vm.dispositivo.idModulo;
				var entrada = vm.dispositivo.entradaModulo;
				//var valor = vm.toggle;

				//UrlSend = UrlSend + 'idModulo=' + (idModulo || '') + '&entrada=' + (entrada || '') + '&accion=' + (accion || '') + '&valor=' + (valor || '0');
				
				UrlSend = UrlSend + 'idModulo=' + (idModulo || '') + '&entrada=' + (entrada || '') + '&accion=' + (accion || '');

				alert(UrlSend);

				$http.get(UrlSend)
					.then(function (response) {
						//$scope.myWelcome = response.data;
						alert(response.data);
					});

			}

		}


		function EjecutarComandoIR(funcionIR) {
			alert("EjecutarComandoIR: " + funcionIR[0].codigo);
			//voy a buscar el código de la accion a ejecutar


			if (vm.conectBluetooth) {
				alert("Ejecutar la accion por Bluetooth");
				//$cordovaBluetoothSerial.write(vm.dimmerValor + ";", enviarExito, error);

			} else if (vm.conectNetwork) {

				var UrlSend = "http://domtec.hol.es/admin/modulos/accionar.php?";

				var idModulo = vm.dispositivo.idModulo;
				var entrada = vm.dispositivo.entradaModulo;
				var accion = funcionIR[0].funcion;
				var valor = funcionIR[0].codigo;

				UrlSend = UrlSend + 'idModulo=' + (idModulo || '') + '&entrada=' + (entrada || '') + '&accion=' + (accion || '') + '&valor=' + (valor || '0');

				alert(UrlSend);

				$http.get(UrlSend)
					.then(function (response) {
						//$scope.myWelcome = response.data;
						alert(response.data);
					});

			}

		}

		function desconectar() {
			$cordovaBluetoothSerial.disconnect().then(desconectarExito, error);
		}
		function exito(response) {
			vm.lista = response;

			$cordovaToast.show(vm.lista[2].name, 'short', 'center');
		};

		function conectExito(response) {
			alert("conectExito");
			$cordovaToast.show('Conecto!', 'short', 'center');
			vm.conectBluetooth = true;

			idSet = setInterval(function () {
				$cordovaBluetoothSerial.write("CN;", enviarExito, error);
				if (contador == 900) {
					contador = 0;
					clearInterval(idSet);
				}
				contador++;
			}, 7);


			///keep alive
			setTimeout(function () {
				idsetKeep = setInterval(function () {
					$cordovaBluetoothSerial.write("KA;").then(enviarExitoKeepAlive, error);

				}, 2000)
			}, 10)
			///keep alive

		};

		function desconectarExito(response) {
			//alert("Desconecto!");
			$cordovaToast.show('Desconecto!', 'short', 'center');
		}


		function enviarExitoKeepAlive(response) {

			if (!actualizoToggle) {
				setTimeout(function () {
					$cordovaBluetoothSerial.read().then(function (data) {
						if (data == "ON") {
							vm.toggle = true;
							actualizoToggle = true;
						}
						if (data == "OFF") {
							vm.toggle = false;
							actualizoToggle = true;
						}

					}, error);
				}, 500);
			}

		};


		function enviarExito(response) {


			//$cordovaToast.show('Envio!', 'short', 'center');
			//if(contador==5000){
			//	contador=0;
			//	}else {
			//	$cordovaBluetoothSerial.write("ON;", enviarExito, error);
			//	contador++
			//	}
		};

		function enableExito(response) {
			$cordovaToast.show("Bluetooth is enabled", 'short', 'center');
		};


		function error(response) {
			alert("errorrrrrr!!");
			$cordovaToast.show(response, 'short', 'center');
		};

		function errorConexionBluetooth(response) {

			alert("errorConexionBluetooth");
			vm.conectBluetooth = false;
			var isOnline = $cordovaNetwork.isOnline()

			if (isOnline) {
				vm.conectNetwork = true;

			}
			else {
				vm.conectNetwork = false;
			}
		};


	})

	.controller('DispositivoAltaCtrl', function ($scope, $ionicModal, $ionicPlatform, $ionicScrollDelegate, Dispositivos, Espacios, Modulos, Imagenes, $state, $stateParams, $ionicHistory, IR) {

		var vm = this;
		vm.dispositivoIrSelect = {};


		vm.back = function () {
			$ionicHistory.goBack();
		};

		vm.objetoModulo = function () {

			Modulos.seleccionarId(vm.idModulo).then(function (res) {

				vm.moduloSelect = res;


			}, function (err) {


			});


		}


		vm.objetoEspacio = function () {

			Espacios.seleccionarId(vm.idEspacio).then(function (res) {

				vm.espacioSelect = res;

			}, function (err) {


			});


		};

		vm.objetoDispositivoIr = function () {

			IR.seleccionarId(vm.idDispositivoIr).then(function (res) {
				vm.dispositivoIrSelect.tipo = res.tipo;
				vm.dispositivoIrSelect.marca = res.marca;
				vm.dispositivoIrSelect.modelo = res.modelo;

				IR.filtrarTablaDispositivoIr(res.tipo, res.marca, res.modelo).then(function (res) {
					$scope.listaDispositivoIr = res;


				}, function (err) { })


			}, function (err) { });


		};

		$ionicModal.fromTemplateUrl('templates/my_modal_imagenes.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function (modal) {
			$scope.modalImagenes = modal;
		});


		$ionicModal.fromTemplateUrl('dispositivoAlta/seleccionarModulo.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function (modal) {
			$scope.modalSeleccionarModulo = modal;
		});




		$ionicModal.fromTemplateUrl('dispositivoAlta/seleccionarEspacio.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function (modal) {
			$scope.modalSeleccionarEspacio = modal;
		});


		$ionicModal.fromTemplateUrl('dispositivoAlta/seleccionarTipoIr.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function (modal) {
			$scope.modalSeleccionarTipoIr = modal;
		});

		$ionicModal.fromTemplateUrl('dispositivoAlta/seleccionarMarcaIr.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function (modal) {
			$scope.modalSeleccionarMarcaIr = modal;
		});

		$ionicModal.fromTemplateUrl('dispositivoAlta/seleccionarModeloIr.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function (modal) {
			$scope.modalSeleccionarModeloIr = modal;
		});

		$scope.imagenes = Imagenes.dispositivos();

		$scope.seleccionarImagen = function (imagen) {

			vm.urlImagen = imagen.urlImagen;
			vm.descImagen = imagen.desc;
			vm.codImagen = imagen.cod;
			$scope.modalImagenes.hide();


		}


		$scope.seleccionarEspacio = function (item) {

			vm.espacioSelect = item;
			vm.idEspacio = item.id;

			$scope.modalSeleccionarEspacio.hide();
		}

		$scope.seleccionarModulo = function (item) {

			vm.moduloSelect = item;
			vm.idModulo = item.id;
			$ionicScrollDelegate.resize();
			$scope.modalSeleccionarModulo.hide();
		}

		$scope.seleccionarDispositivoIrTipo = function (item) {

			if (item != vm.dispositivoIrSelect.tipo) {
				vm.dispositivoIrSelect.tipo = item;
				vm.dispositivoIrSelect.marca = undefined;
				vm.dispositivoIrSelect.modelo = undefined;
				IR.filtrarTablaDispositivoIr(vm.dispositivoIrSelect.tipo).then(function (res) {
					$scope.listaDispositivoIr = res;
				}, function (err) { })

			}
			$scope.modalSeleccionarTipoIr.hide();

		};

		$scope.seleccionarDispositivoIrMarca = function (item) {
			if (item != vm.dispositivoIrSelect.marca) {
				vm.dispositivoIrSelect.marca = item;
				vm.dispositivoIrSelect.modelo = undefined;
				IR.filtrarTablaDispositivoIr(vm.dispositivoIrSelect.tipo, vm.dispositivoIrSelect.marca).then(function (res) {
					$scope.listaDispositivoIr = res;
				}, function (err) { })

			}
			$scope.modalSeleccionarMarcaIr.hide();
		};

		$scope.seleccionarDispositivoIrModelo = function (item) {
			if (item != vm.dispositivoIrSelect.modelo) {
				vm.dispositivoIrSelect.modelo = item;
				//	alert(vm.dispositivoIrSelect.modelo),
				IR.filtrarTablaDispositivoIr(vm.dispositivoIrSelect.tipo, vm.dispositivoIrSelect.marca, vm.dispositivoIrSelect.modelo).then(function (res) {
					$scope.listaDispositivoIr = res;
					vm.idDispositivoIr = res.idDispositivoIr;
				}, function (err) { })

			}
			$scope.modalSeleccionarModeloIr.hide();

		}


		vm.abrirModalModulo = function () {

			$scope.modalSeleccionarModulo.show();

		}

		vm.abrirModalEspacio = function () {

			$scope.modalSeleccionarEspacio.show();

		}

		vm.abrirModalTipoIr = function () {

			$scope.modalSeleccionarTipoIr.show();

		}

		vm.abrirModalMarcaIr = function () {

			$scope.modalSeleccionarMarcaIr.show();

		}

		vm.abrirModalModeloIr = function () {

			$scope.modalSeleccionarModeloIr.show();

		}

		vm.urlImagen = "./img/ionic.png";


		vm.alta = function () {

			if (!$stateParams.id) {

				Dispositivos.insertar(vm.nombre, vm.descripcion, vm.idEspacio, vm.urlImagen, vm.idModulo, vm.entradaModulo, vm.idDispositivoIr).then(function (res) {

					alert("CONTROLLER insertedId: " + res.insertId + " idmodulo: " + vm.idModulo);
					//Si se inserto un nuevo aire => guardo en la tabla de parametros la temperatura inicial

					if (vm.idModulo != null) {
						var dispositivoInsertado;
						Dispositivos.seleccionarId(res.insertId).then(function (resDis) {
							dispositivoInsertado = resDis;
							alert("DispositivoIR Tipo: " + dispositivoInsertado.tipo);
							if (dispositivoInsertado.tipo == "aire") {
								Dispositivos.agregarParametro(res.insertId, "temperatura", "24");
								alert("inserto");
							}
						}, function (err) { })
					}

					$ionicHistory.goBack();

				}, function (err) { });
			}
			else {



				Dispositivos.actualizar(vm.id, vm.nombre, vm.descripcion, vm.idEspacio, vm.urlImagen, vm.idModulo, vm.entradaModulo, vm.idDispositivoIr).then(function (res) {


					$ionicHistory.goBack();

				}, function (err) { });
			}


		};

		vm.seleccionarImagen = function () {
			$scope.modalImagenes.show();
		}


		$scope.$on('$ionicView.enter', function (e) {




			Espacios.lista().then(function (res) {
				$scope.listaEspacios = res;


			});

			Modulos.lista().then(function (res) {
				$scope.listaModulos = res;

			});



			if (!$stateParams.id) {
				vm.nombre = undefined;
				vm.descripcion = undefined;
				vm.urlImagen = './img/ionic.png';
				vm.idEspacio = undefined;
				vm.espacioSelect = undefined;
				vm.idModulo = undefined;
				vm.moduloSelect = undefined;
				vm.entradaModulo = undefined;
				vm.descImagen = undefined;
				vm.codImagen = undefined;
				vm.idDispositivoIr = undefined;

				IR.filtrarTablaDispositivoIr().then(function (res) {
					$scope.listaDispositivoIr = res;
				}, function (err) { })

			}
			else {
				var ObjetoId
				Dispositivos.seleccionarId($stateParams.id).then(function (res) {
					ObjetoId = res;
					vm.nombre = ObjetoId.nombre;
					vm.descripcion = ObjetoId.descripcion;
					vm.idEspacio = undefined;
					vm.espacioSelect = undefined;
					vm.urlImagen = ObjetoId.urlImagen;
					vm.descImagen = ObjetoId.descImagen;
					vm.codImagen = ObjetoId.codImagen;
					vm.idModulo = undefined;
					vm.moduloSelect = undefined;
					vm.entradaModulo = undefined;
					vm.idDispositivoIr = undefined;
					vm.id = ObjetoId.id;




					if (ObjetoId.idEspacio)
						vm.idEspacio = ObjetoId.idEspacio;
					vm.objetoEspacio();
					if (ObjetoId.idModulo) {
						vm.idModulo = ObjetoId.idModulo;
						vm.objetoModulo();
					}
					if (ObjetoId.idDispositivoIr) {
						vm.idDispositivoIr = ObjetoId.idDispositivoIr;
						vm.objetoDispositivoIr();
					} else {
						IR.filtrarTablaDispositivoIr().then(function (res) {
							$scope.listaDispositivoIr = res;
						}, function (err) { })

					}
					if (ObjetoId.entradaModulo)
						vm.entradaModulo = ObjetoId.entradaModulo.toString();




				}, function (err) { })





				//$stateParams.parametros = undefined;	
			}
		});


	})

	.controller('ImagenesCtrl', function (Imagenes, $state, $stateParams) {

		var vm = this;

		if ($stateParams.parametros.codigoGaleria == 'dispositivos') {
			vm.lista = Imagenes.dispositivos();
		}
		else if ($stateParams.parametros.codigoGaleria == 'espacios') {
			vm.lista = Imagenes.espacios();
		}


		var param = $stateParams.parametros;

		vm.seleccionar = function (imagen) {
			param.urlImagen = imagen.urlImagen;
			param.descImagen = imagen.desc;
			param.cod = imagen.cod;
			if (param.codigoGaleria == 'dispositivos') {
				$state.go('app.dispositivoAlta', { parametros: param });
			}
			else if (param.codigoGaleria == 'espacios') {
				$state.go('app.espacioAlta', { parametros: param });
			}
		}
	})


	.controller('AcercaDeCtrl', function ($scope, $state, $ionicPlatform, $cordovaToast, FactoryDB) {

		var vm = this;

		vm.back = back;

		function back() {
			$state.go('app.inicio.espacios')
		}
	})


	.controller('InicioDomtecCtrl', function ($scope, $rootScope, $state, $stateParams, $ionicPlatform, $cordovaToast, FactoryDB) {

		var vm = this;


		vm.select = function (tab) {

			vm.tabSelected = tab;

			if (tab == 'espacios') {
				$rootScope.$broadcast('controlador:espacios');
				FactoryDB.inicioDomtecTab('0');
			}


			if (tab == 'dispositivos') {
				$rootScope.$broadcast('controlador:dispositivos');
				FactoryDB.inicioDomtecTab('1');
			}


		}



		vm.alta = function () {
			if (vm.tabSelected == 'espacios')
				$state.go('app.espacioAlta');


			if (vm.tabSelected == 'dispositivos')
				$state.go('app.dispositivoAlta');


		}


		vm.actualizarEspacios = function () {

			$rootScope.$broadcast('controlador:espacios');

		}

		vm.actualizarDispositivos = function () {

			$rootScope.$broadcast('controlador:dispositivos');

		}




		$scope.$on('$ionicView.enter', function (e) {


			$rootScope.$broadcast('controlador:espacios');
			$rootScope.$broadcast('controlador:dispositivos');
			vm.idTabParams = FactoryDB.inicioDomtecTab()




		});






	})

	.controller('InicioCtrl', function ($scope, $ionicPlatform, $cordovaToast, FactoryDB) {

		var vm = this;




	})


	.controller('DispositivosEspacioCtrl', function ($scope, $stateParams, $ionicPlatform, $ionicHistory, $cordovaToast, FactoryDB) {

		var vm = this;

		vm.back = function () {
			$ionicHistory.goBack()

		}

		$scope.idEspacio = $stateParams.idEspacio

		$scope.$on('$ionicView.enter', function (e) {


			$scope.$broadcast('controlador:dispositivosDirective');


		})



	})


	.controller('EspaciosCtrl', function ($rootScope, $state, $scope, Espacios, $ionicPopover, $ionicLoading, IR) {

		var vm = this;
		//var onholdPresionado = false;




		$scope.$on('$ionicView.enter', function (e) {

			$ionicLoading.show({
				template: 'Actualizando...'
			}).then(function () {

				IR.insertarMasivo().then(function (res) {

					$ionicLoading.hide();
				}, function (err) {


					$ionicLoading.hide();

				})
				//alert("inserteok");

			})

			$scope.$broadcast('controlador:espaciosDirective');
		});


	});