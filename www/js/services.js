angular.module('starter.services', [])

.factory("Imagenes", ['$cordovaToast', '$rootScope', '$q', function($cordovaToast, $rootScope, $q){
	var dispositivos = [
	{desc:'Television',cod:'TV', urlImagen:'./img/dispositivos/television.png'},
	{desc:'Aire',cod:'Aire', urlImagen:'./img/dispositivos/aire.png'},
	{desc:"Dimmer",cod:'Dimmer', urlImagen:'./img/dispositivos/luz.png'}]; 
		
	var espacios = [
	{desc:'Bano',cod:'Bano', urlImagen:'./img/espacios/bano.png'},
	{desc:'Cocina',cod:'Cocina', urlImagen:'./img/espacios/cocina.png'},
	{desc:"Garage",cod:'Garage', urlImagen:'./img/espacios/garage.png'},
	{desc:'Habitacion',cod:'Habitacion', urlImagen:'./img/espacios/habitacion.png'},
	{desc:'Living',cod:'Living', urlImagen:'./img/espacios/living.png'},
	{desc:"Piscina",cod:'Piscina', urlImagen:'./img/espacios/piscina.png'}]; 
	
	var interfaz = {
		
		dispositivos: function(){
			return dispositivos;
		},
		
		espacios: function(){
			return espacios;
		}
	}
	return interfaz;
}])


.factory("Ambientes", ['$cordovaSQLite', '$cordovaToast', '$rootScope', '$q', function($cordovaSQLite, $cordovaToast, $rootScope, $q){
	
	var db = null;
	
	var lista = [
					{ title: 'Habitacion', id: 1, img: 'habitacion.png' },
					{ title: 'Cocina', id: 2, img: 'cocina.png' },
					{ title: 'Comedor', id: 3, img: 'living.png' },
					{ title: 'Piscina', id: 4, img: 'piscina.png' }
				];
	
	var interfaz = {
		getAmbientes: function(){
			return lista;
		},
		getAmbiente: function(id){
			return lista[id-1];
		},
		nuevoAmbiente: function(ambiente){
			lista.push(ambiente);
		}
	}
	
	return interfaz;
}])


.factory("Espacios", ['$cordovaSQLite', '$cordovaToast', '$rootScope', '$q', 'FactoryDB', function($cordovaSQLite, $cordovaToast, $rootScope, $q, FactoryDB){
	var lista;
	var db = null;
	
	
	db=FactoryDB.punteroDb();
	

function actualizarLista () {
		var q = $q.defer();
		var respuesta = [];
				var query = "SELECT * FROM espacios";
				
				$cordovaSQLite.execute(db, query)
				.then(
						function(res) {
							//alert(res);
							if(res.rows.length > 0) {
								
								for(var i=0; i<res.rows.length; i++)
								{
										respuesta[i] = res.rows.item(i);
								}
								
								//$cordovaToast.show("SELECTED -> " + res.rows.item(0).clave + " " + res.rows.item(0).descripcion, 'long', 'center');
							} else {
								$cordovaToast.show("No results found", 'long', 'center');
							}
						//	alert(respuesta[0].clave);
							lista=respuesta;
							q.resolve(respuesta);
						},
						function (err) {
						//	alert('entre a error');
							$cordovaToast.show("ERROR SELECT", 'long', 'center');
							q.reject(err);
						}
					)
					
					return q.promise;
		
		
	};

	var interfaz = {
		
		actualizarLista:actualizarLista,
		
		insertar: function(descripcion, urlImagen){
				var q = $q.defer();
				var query = "INSERT INTO espacios (descripcion, urlImagen) VALUES (?,?)";
				//alert(descripcion + " - " + urlImagen);
				$cordovaSQLite.execute(db, query, [descripcion, urlImagen])
				.then(
						function(res) {
								actualizarLista().then(function(res){
									
								var lista=res;	
								q.resolve(res);	
									
								},function(err){
									
									q.reject(err);		
								})	
							},
						function (err) {
							$cordovaToast.show("ERROR INSERT", 'long', 'center');
							q.reject(err);
							}
					)
				return q.promise;
			},

	actualizar: function(id, descripcion, urlImagen){
			//alert(id);
			var q = $q.defer();
			var query = "UPDATE espacios SET descripcion = ?, urlImagen = ? WHERE id = ?";
			$cordovaSQLite.execute(db, query, [descripcion, urlImagen, id])
			.then(
					function(res) {
							
							actualizarLista().then(function(res){
									
								var lista=res;	
								q.resolve(res);	
									
								},function(err){
									
									q.reject(err);		
								})		
							
						},
					function (err) {
						$cordovaToast.show(err, 'long', 'center');
						q.reject(err);
						}
				)
			return q.promise;
		},

	eliminar: function(id){
			var q = $q.defer();
			var query = "DELETE FROM espacios WHERE id = ?";
			$cordovaSQLite.execute(db, query, [id])
			.then(
					function(res) {
							
							actualizarLista().then(function(res){
									
								var lista=res;	
								q.resolve(res);	
									
								},function(err){
									
									q.reject(err);		
								})		
							
						},
					function (err) {
						$cordovaToast.show("ERROR DELETE", 'long', 'center');
						q.reject(err);
						}
				)
			return q.promise;
		},

			
	lista: function(){
				
			var q = $q.defer();
			if(lista) {
				q.resolve(lista)
			} else {
				
			actualizarLista().then(function(){
				
				q.resolve(lista)
				
			},function(err){
				
				q.reject(err)
				
			});	
			}
				
				
				return q.promise;
			},
			
			
	seleccionarId: function(id) {
			var listaTemp;
			var q = $q.defer();
				
			if(lista) {	
			
			listaTemp = lista.filter(function(elem){
				
				return elem.id == id
				
			})
			q.resolve(listaTemp[0])
			
			} else {
				
				actualizarLista().then(function(){
				
				listaTemp = lista.filter(function(elem){
				
				return elem.id == id
				
			})
			
			q.resolve(listaTemp[0])
			
				
			},function(err){
				
				q.reject(err)
				
			});
				
				
				
			}
			
			return q.promise;
			
		}
			
		/*	
	seleccionarId: function(id){
				var q = $q.defer();
				var respuesta = [];
				var query = "SELECT * FROM espacios WHERE id = ?";
				$cordovaSQLite.execute(db, query, [id])
				.then(
						function(res) {
							if(res.rows.length > 0) {
								
								for(var i=0; i<res.rows.length; i++)
								{
										respuesta[i] = res.rows.item(i);
								}
								
								//$cordovaToast.show("SELECTED -> " + res.rows.item(0).firstname + " " + res.rows.item(0).lastname, 'long', 'center');
							} else {
								$cordovaToast.show("No results found", 'long', 'center');
							}
							q.resolve(respuesta);
						},
						function (err) {
							$cordovaToast.show("ERROR SELECT", 'long', 'center');
							q.reject(err);
						}
					)
				return q.promise;
			} */

	}
	
	return interfaz;
}])


.factory("Modulos", ['$cordovaSQLite', '$cordovaToast', '$rootScope', '$q','FactoryDB', function($cordovaSQLite, $cordovaToast, $rootScope, $q, FactoryDB){
	var lista;
	var db = null;
		
	db=FactoryDB.punteroDb();
	
	var listaTipoModulos = [
	{desc:'Dimmer',cod:'DIMM', urlImagen:'img/ionic.png'},
	{desc:"Zapatilla",cod:'ZAP', urlImagen:'img/ionic.png'},
	{desc:"IR",cod:'IR', urlImagen:'img/ionic.png'},
	{desc:"Rele",cod:'REL', urlImagen:'img/ionic.png'}];
	
	
	function dameTipoModulo (cod) {
			
	var arrayFind = listaTipoModulos.filter(function(elem){
		
		return (elem.cod == cod)
		
	})	
		
	return arrayFind[0];
		
	};
		
		function actualizarLista () {
	//alert("LISTA");
				var q = $q.defer();
				var respuesta = [];
				var query = "SELECT * FROM modulos";
				
				$cordovaSQLite.execute(db, query)
					.then(
						function(res) {
							//alert(res);
							if(res.rows.length > 0) {
								
								for(var i=0; i<res.rows.length; i++)
								{
										respuesta[i] = res.rows.item(i);
										respuesta[i].join=dameTipoModulo(respuesta[i].idModuloTipo);
								
										
								}
								
								//$cordovaToast.show("SELECTED -> " + res.rows.item(0).clave + " " + res.rows.item(0).descripcion, 'long', 'center');
							} else {
								$cordovaToast.show("No results found", 'long', 'center');
							}
						//	alert(respuesta[0].clave);
						lista=respuesta;
							q.resolve(respuesta);
						},
						function (err) {
						//	alert('entre a error');
							$cordovaToast.show("ERROR SELECT", 'long', 'center');
							q.reject(err);
						}
					);
					
					
				return q.promise;	
		};
	
	var interfaz = {
			actualizarLista:actualizarLista,
		
			insertar: function(uuid,nombre, clave, descripcion, idModuloTipo){
				var q = $q.defer();
				var query = "INSERT INTO modulos (uuid,nombre, clave, descripcion, idModuloTipo) VALUES (?,?,?,?,?)";
				$cordovaSQLite.execute(db, query, [uuid,nombre, clave, descripcion, idModuloTipo])
				.then(
						function(res) {
								actualizarLista().then(function(res){
									
								var lista=res;	
								q.resolve(res);	
									
								},function(err){
									
									q.reject(err);		
								})	
								
							},
						function (err) {
							$cordovaToast.show("ERROR INSERT", 'long', 'center');
							q.reject(err);
							}
					)
				return q.promise;
			},
			
			actualizar: function(id, uuid,nombre, clave, descripcion, idModuloTipo){
				//alert(id);
				var q = $q.defer();
				var query = "UPDATE modulos SET uuid = ?,nombre= ?, clave = ?, descripcion = ?, idModuloTipo = ? WHERE id = ?";
				$cordovaSQLite.execute(db, query, [uuid,nombre, clave, descripcion, idModuloTipo, id])
				.then(
						function(res) {
								
								actualizarLista().then(function(res){
									$rootScope.$broadcast('actualizarLista:Dispositivos');	
									var lista=res;	
									q.resolve(res);	
										
									},function(err){
										
										q.reject(err);		
									})		
								
							},
						function (err) {
							$cordovaToast.show(err, 'long', 'center');
							q.reject(err);
							}
					)
				return q.promise;
			},

			eliminar: function(id){
			
				var q = $q.defer();
				var query = "DELETE FROM modulos WHERE id = ?";
				//var query2 = "DELETE FROM dispositivos WHERE idModulo = ?";
				var query2 = "UPDATE dispositivos SET idModulo = NULL WHERE idModulo = ?";
				
				
				
				$cordovaSQLite.nestedExecute(db,query,query2,[id],[id]).then(function(res){
					actualizarLista().then(function(res){
					$rootScope.$broadcast('actualizarLista:Dispositivos');
										
									var lista=res;	
									q.resolve(res);	
										
									},function(err){
										
										q.reject(err);		
									})		
					
					
					
				},function(err){
					
					$cordovaToast.show("ERROR DELETE", 'long', 'center');
							q.reject(err);	
				})
					
					
					
					
					
				
				/*
				$cordovaSQLite.execute(db, query, [id])
				.then(
						function(res) {
								
								actualizarLista().then(function(res){
										
									var lista=res;	
									q.resolve(res);	
										
									},function(err){
										
										q.reject(err);		
									})		
								
							},
						function (err) {
							
							$cordovaToast.show("ERROR DELETE", 'long', 'center');
							q.reject(err);
							}
					)*/
				return q.promise;
			},

			lista: function(){
				
				var q = $q.defer();
			if(lista) {
				q.resolve(lista)
			} else {
				
			actualizarLista().then(function(){
				
				q.resolve(lista)
				
			},function(err){
				
				q.reject(err)
				
			});
			}	
				
				
				return q.promise;
				
			},
			
			
			seleccionarId: function(id) {
			var listaTemp;
			var q = $q.defer();
				
			if(lista) {	
			
			listaTemp = lista.filter(function(elem){
				
				return elem.id == id
				
			})
			q.resolve(listaTemp[0])
			
			} else {
				
				actualizarLista().then(function(){
				
				listaTemp = lista.filter(function(elem){
				
				return elem.id == id
				
			})
			
			q.resolve(listaTemp[0])
			
				
			},function(err){
				
				q.reject(err)
				
			});
				
				
				
			}
			
			return q.promise;
			
		},
			
			/*
			seleccionarId: function(id){
				var q = $q.defer();
				var respuesta = [];
				var query = "SELECT * FROM modulos WHERE id = ?";
				$cordovaSQLite.execute(db, query, [id])
				.then(
						function(res) {
							if(res.rows.length > 0) {
								
								for(var i=0; i<res.rows.length; i++)
								{
										respuesta[i] = res.rows.item(i);
								}
								
								//$cordovaToast.show("SELECTED -> " + res.rows.item(0).firstname + " " + res.rows.item(0).lastname, 'long', 'center');
							} else {
								$cordovaToast.show("No results found", 'long', 'center');
							}
							q.resolve(respuesta);
						},
						function (err) {
							$cordovaToast.show("ERROR SELECT", 'long', 'center');
							q.reject(err);
						}
					)
				return q.promise;
			},
			
			*/
			tipoModulos: function () {
				
				return listaTipoModulos;
				
			}
			
			
			
			
	}
	
	return interfaz;
}])



.factory("Dispositivos", ['$cordovaSQLite', '$cordovaToast', '$rootScope', '$q','FactoryDB', 'Espacios','Modulos', 'IR', '$cordovaFile', '$http', function($cordovaSQLite, $cordovaToast, $rootScope, $q, FactoryDB, Espacios, Modulos, IR, $cordovaFile, $http){
	var lista;
	var db = null;
	db=FactoryDB.punteroDb();

	
	
	function actualizarLista () {
	

			var q = $q.defer();
			var respuesta = [];
		//	var query = "SELECT d.id, d.nombre, d.descripcion, d.idEspacio, d.urlImagen, d.idModulo, d.entradaModulo, m.descripcion as moduloDescripcion FROM dispositivos d INNER JOIN modulos m ON d.idModulo = m.id";
		//	var query = "SELECT d.id, d.nombre, d.descripcion, d.idEspacio, d.urlImagen, d.idModulo, d.entradaModulo FROM dispositivos d";
			var query = "SELECT d.id, d.nombre, d.descripcion, d.idEspacio, d.urlImagen, d.entradaModulo,d.idModulo,d.idDispositivoIr, m.uuid, m.clave, m.descripcion AS moduloDescripccion, m.idModuloTipo FROM dispositivos d LEFT OUTER JOIN modulos m ON d.idModulo = m.id  ";
		
			$cordovaSQLite.execute(db, query)
			.then(
					function(res) {
						//alert(res);
						if(res.rows.length > 0) {
							
							for(var i=0; i<res.rows.length; i++)
							{
									respuesta[i] = res.rows.item(i);
							}
							
							//$cordovaToast.show("SELECTED -> " + res.rows.item(0).clave + " " + res.rows.item(0).descripcion, 'long', 'center');
						} else {
							$cordovaToast.show("No results found", 'long', 'center');
						}
					//	alert(respuesta[0].clave);
						lista=respuesta;
						q.resolve(respuesta);
					},
					function (err) {
					//	alert('entre a error');
						$cordovaToast.show("ERROR SELECT", 'long', 'center');
						q.reject(err);
					}
				)
			return q.promise;
			
			}

	function insertFuncionIr  (arrayCod,indexActual,callback,calbackErr) {

	//	alert("insertFuncionIr, arrayCod.length: " + arrayCod.length);
		alert("id: " + arrayCod[indexActual][0] + "fun: " + arrayCod[indexActual][1] + "cod: " + arrayCod[indexActual][2]);
		var indexTotal = arrayCod.length - 1;



		var query = "INSERT INTO funcionesIr (idDispositivoIr, funcion, codigo) VALUES (?,?,?)";
						
		$cordovaSQLite.execute(db, query, [arrayCod[indexActual][0], arrayCod[indexActual][1], arrayCod[indexActual][2]])
		.then(
				function(res) {
					
						if(indexActual < indexTotal){
							
							insertFuncionIr(arrayCod,indexActual+1,callback)
							
						} else {
							
							callback();
							
						}
						
					},
				function (err) {
					$cordovaToast.show("ERROR insertFuncionIr", 'long', 'center');
					callbackErr()
					}
					
					)

	} 

	function CSVToArray( strData, strDelimiter ){

		//alert("CSVToArray");
         // Check to see if the delimiter is defined. If not,
         // then default to comma.
         strDelimiter = (strDelimiter || ",");
 
         // Create a regular expression to parse the CSV values.
         var objPattern = new RegExp(
             (
                 // Delimiters.
                 "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
 
                 // Quoted fields.
                 "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
 
                 // Standard fields.
                 "([^\"\\" + strDelimiter + "\\r\\n]*))"
             ),
             "gi"
             );
 
 
         // Create an array to hold our data. Give the array
         // a default empty first row.
         var arrData = [[]];
 
         // Create an array to hold our individual pattern
         // matching groups.
         var arrMatches = null;
 
 
         // Keep looping over the regular expression matches
         // until we can no longer find a match.
         while (arrMatches = objPattern.exec( strData )){
 
             // Get the delimiter that was found.
             var strMatchedDelimiter = arrMatches[ 1 ];
 
             // Check to see if the given delimiter has a length
             // (is not the start of string) and if it matches
             // field delimiter. If id does not, then we know
             // that this delimiter is a row delimiter.
             if (
                 strMatchedDelimiter.length &&
                 strMatchedDelimiter !== strDelimiter
                 ){
 
                 // Since we have reached a new row of data,
                 // add an empty row to our data array.
                 arrData.push( [] );
 
             }
 
             var strMatchedValue;
 
             // Now that we have our delimiter out of the way,
             // let's check to see which kind of value we
             // captured (quoted or unquoted).
             if (arrMatches[ 2 ]){
 
                 // We found a quoted value. When we capture
                 // this value, unescape any double quotes.
                 strMatchedValue = arrMatches[ 2 ].replace(
                     new RegExp( "\"\"", "g" ),
                     "\""
                     );
 
             } else {
 
                 // We found a non-quoted value.
                 strMatchedValue = arrMatches[ 3 ];
 
             }
 
 
             // Now that we have our value string, let's add
             // it to the data array.
             arrData[ arrData.length - 1 ].push( strMatchedValue );
         }
 
         // Return the parsed data.
         return( arrData );
     };	
			
			
	$rootScope.$on('actualizarLista:Dispositivos',function(){
		
		actualizarLista();
		
		
	})		

	var interfaz = {
		
		actualizarLista:actualizarLista,
		
		insertar: function(nombre, descripcion, idEspacio, urlImagen,idModulo, entradaModulo,idDispositivoIr){
		
			var q = $q.defer();
			var query = "INSERT INTO dispositivos (nombre, descripcion, idEspacio, urlImagen,idModulo, entradaModulo,idDispositivoIr) VALUES (?,?,?,?,?,?,?)";
			$cordovaSQLite.execute(db, query, [nombre, descripcion, idEspacio, urlImagen, idModulo, entradaModulo,idDispositivoIr])
			.then(
					function(res) {
						    alert("idDispositivoIr: " + idDispositivoIr);
							if(idDispositivoIr)
							{ //alert("ENTRO!!");
							//	alert("llama a existenFuncionesIR con idDispositivoIr: " + idDispositivoIr);
								//verificar si los codigos existen en la tabla, sino crearlos desde el .csv
								IR.existenFuncionesIR(idDispositivoIr).then(function(res){

								alert("existenFuncionesIr: " + res);

								if(res == 0)
								{
									//cargo los datos desde el .csv

									//$cordovaFile.checkFile(cordova.file.applicationStorageDirectory, 'modelosIr.csv').then(function(res){
									$http.get('funcionesIr.csv').success(function(res2) {

									//	alert("va a leer el archivo");
										var arrayfuncionesIr = CSVToArray(res2,";");
										
										//selecciono solo las funciones del idDispositivoIr
										var i = 0;
										
										for(i=0; i<=arrayfuncionesIr.length; i++)
										{
										//	alert("i: " + i + " arrayfuncionesIr[i][0]: " + arrayfuncionesIr[i][0] + " - idDispositivoIr:" + idDispositivoIr);
											if(arrayfuncionesIr[i][0] == idDispositivoIr.toString())
												break;
										}

									//	alert("i: " + i);
										if(i<arrayfuncionesIr.length)
										{
											var a = 0;	
											var arrayFuncionesIrSelecto = [];
											while(arrayfuncionesIr[i][0] == idDispositivoIr.toString())
											{
												arrayFuncionesIrSelecto[a] = arrayfuncionesIr[i];
												a++;
												i++;
											}
										
											//alert("arrayfuncionesIr: " + arrayfuncionesIr.length + " arrayFuncionesIrSelecto: " + arrayFuncionesIrSelecto.length);									
											// fin selecciono solo las funciones del idDispositivoIr
											//alert("id: " + arrayFuncionesIrSelecto[0][0] + "fun: " + arrayFuncionesIrSelecto[0][1] + "cod: " + arrayFuncionesIrSelecto[0][2]);
											//alert("id: " + arrayFuncionesIrSelecto[1][0] + "fun: " + arrayFuncionesIrSelecto[1][1] + "cod: " + arrayFuncionesIrSelecto[1][2]);

											//	alert("leyo OK el archivo, ahora insertara");
											insertFuncionIr(arrayFuncionesIrSelecto,0,function(res3){
											//insertDispositivoIr(arrayIr,0,function(res){
											//	alert("insertarmasivo alert5");
											//actualizarLista().then(function(res){
											//	alert("insertarmasivo alert6");
												//$cordovaFile.createFile(cordova.file.applicationStorageDirectory, 'modelosIr.csv', true)
											q.resolve();
												
											/*	
											},function(err){
												$cordovaToast.show("ERROR actualizar lista", 'long', 'center');
											q.reject(err);	
												
											})	*/
											},function(err){
												
												$cordovaToast.show("ERROR insertar funciones ", 'long', 'center');
												q.reject(err);
											})
										}
									})
									.error(function(err){
										$cordovaToast.show("ERROR al leer archivo funcionesIr", 'long', 'center');
										q.reject(err);
										
									})

								}
								})
							}
							actualizarLista().then(function(res){
									
								var lista=res;	
								q.resolve(res);	
									
								},function(err){
									
									q.reject(err);		
								})		
							
						
						},
					function (err) {
						$cordovaToast.show("ERROR INSERT Dispositivos", 'long', 'center');
						q.reject(err);
						}
				)
			return q.promise;
		},

		actualizar: function(id, nombre, descripcion, idEspacio, urlImagen,idModulo, entradaModulo,idDispositivoIr){
			
			var q = $q.defer();
			var query = "UPDATE dispositivos SET nombre = ?, descripcion = ?, idEspacio = ?, urlImagen = ?,idModulo = ?, entradaModulo = ?,idDispositivoIr = ? WHERE id = ?";
			$cordovaSQLite.execute(db, query, [nombre, descripcion, idEspacio, urlImagen, idModulo, entradaModulo,idDispositivoIr, id])
			.then(
					function(res) {

							if(idDispositivoIr)
							{
									IR.existenFuncionesIR(idDispositivoIr).then(function(res){

									//alert("existenFuncionesIr: " + res);

									if(res == 0)
									{
										//cargo los datos desde el .csv
										$http.get('funcionesIr.csv').success(function(res2) {

											var arrayfuncionesIr = CSVToArray(res2,";");
											
											//selecciono solo las funciones del idDispositivoIr
											var i = 0;
											
											for(i=0; i<=arrayfuncionesIr.length; i++)
											{
													if(arrayfuncionesIr[i][0] == idDispositivoIr.toString())
													break;
											}

											if(i<arrayfuncionesIr.length)
											{
												var a = 0;	
												var arrayFuncionesIrSelecto = [];
												while(arrayfuncionesIr[i][0] == idDispositivoIr.toString())
												{
													arrayFuncionesIrSelecto[a] = arrayfuncionesIr[i];
													a++;
													i++;
												}
												// fin selecciono solo las funciones del idDispositivoIr

												insertFuncionIr(arrayFuncionesIrSelecto,0,function(res3){
																		q.resolve();

												},function(err){
													
													$cordovaToast.show("ERROR insertar funciones ", 'long', 'center');
													q.reject(err);
												})
											}
										})
										.error(function(err){
											$cordovaToast.show("ERROR al leer archivo funcionesIr", 'long', 'center');
											q.reject(err);
											
										})

									}
									})
							}
							actualizarLista().then(function(res){
									
								var lista=res;	
								q.resolve(res);	
									
								},function(err){
									
									q.reject(err);		
								})		
							
						},
					function (err) {
						$cordovaToast.show(err, 'long', 'center');
						q.reject(err);
						}
				)
			return q.promise;
		},
		
		eliminar: function(id){
			var q = $q.defer();
			var query = "DELETE FROM dispositivos WHERE id = ?";
			$cordovaSQLite.execute(db, query, [id])
			.then(
					function(res) {
							
							actualizarLista().then(function(res){
									
								var lista=res;	
								q.resolve(res);	
									
								},function(err){
									
									q.reject(err);		
								})		
							
						},
					function (err) {
						$cordovaToast.show("ERROR DELETE", 'long', 'center');
						q.reject(err);
						}
				)
			return q.promise;
		},

		lista: function(){
			
			var q = $q.defer();
			if(lista) {
				q.resolve(lista)
			} else {
				
			actualizarLista().then(function(){
				
				q.resolve(lista)
				
			},function(err){
				
				q.reject(err)
				
			});	
			}
				
				
				return q.promise;
				
			
			
		},
		
		
		seleccionarId: function(id) {
			var listaTemp;
			var q = $q.defer();
				
			if(lista) {	
			
			listaTemp = lista.filter(function(elem){
				
				return elem.id == id
				
			})
			q.resolve(listaTemp[0])
			
			} else {
				
				actualizarLista().then(function(){
				
				listaTemp = lista.filter(function(elem){
				
				return elem.id == id
				
			})
			
			q.resolve(listaTemp[0])
			
				
			},function(err){
				
				q.reject(err)
				
			});
				
				
				
			}
			
			return q.promise;
			
		},
		
		filtrarPorEspacio: function(idEspacio) {
			
			var listaTemp;
			var q = $q.defer();
			if(lista) {
			
			 listaTemp = lista.filter(function(elem){
				
				return elem.idEspacio == idEspacio
				
			})
			
			q.resolve(listaTemp);
			
			} else {
				
				actualizarLista().then(function(){
				
				 listaTemp = lista.filter(function(elem){
				
				return elem.idEspacio == idEspacio
				
			})
			
			q.resolve(listaTemp);
				
			},function(err){
				
				q.reject(err)
				
			});	
				
			}
			
			return q.promise;
			
		}
		
		
		/*
		seleccionarId: function(id){
			var q = $q.defer();
			var respuesta = [];
			var query = "SELECT * FROM dispositivos WHERE id = ?";
			$cordovaSQLite.execute(db, query, [id])
			.then(
					function(res) {
						if(res.rows.length > 0) {
							
							for(var i=0; i<res.rows.length; i++)
							{
									respuesta[i] = res.rows.item(i);
							}
							
							//$cordovaToast.show("SELECTED -> " + res.rows.item(0).firstname + " " + res.rows.item(0).lastname, 'long', 'center');
						} else {
							$cordovaToast.show("No results found", 'long', 'center');
						}
						q.resolve(respuesta);
					},
					function (err) {
						$cordovaToast.show("ERROR SELECT", 'long', 'center');
						q.reject(err);
					}
				)
			return q.promise;
		}	*/	
	}
		
	return interfaz;
		
}])



.factory("IR", ['$cordovaSQLite', '$cordovaToast', '$rootScope', '$q','FactoryDB', '$http','$cordovaFile', function($cordovaSQLite, $cordovaToast, $rootScope, $q, FactoryDB, $http, $cordovaFile){
	var lista;
	var db = null;
	
		
	db=FactoryDB.punteroDb();
	
	function actualizarLista () {
	

			var q = $q.defer();
			var respuesta = [];
				var query = "SELECT id, tipo, marca, modelo FROM dispositivoIr";
		
			$cordovaSQLite.execute(db, query)
			.then(
					function(res) {
						//alert(res);
						if(res.rows.length > 0) {
							
							for(var i=0; i<res.rows.length; i++)
							{
									respuesta[i] = res.rows.item(i);
							}
							
							//$cordovaToast.show("SELECTED -> " + res.rows.item(0).clave + " " + res.rows.item(0).descripcion, 'long', 'center');
						} else {
							$cordovaToast.show("No results found", 'long', 'center');
						}
					//	alert(respuesta[0].clave);
						lista=respuesta;
						q.resolve(respuesta);
					},
					function (err) {
					//	alert('entre a error');
						$cordovaToast.show("ERROR SELECT", 'long', 'center');
						q.reject(err);
					}
				)
			return q.promise;
			
			};
			
			
	$rootScope.$on('actualizarLista:IR',function(){
		
		actualizarLista();
		
		
	})
	
	
	function truncateDispositivoIr () {
		var q = $q.defer();
		var queryTruncate = "DELETE FROM 'dispositivoIr'";
		$cordovaSQLite.execute(db, queryTruncate).then(function(res){
			q.resolve(res);
			
		},function(err){
			
			q.reject(err)
		})
				
		
		return q.promise;
	}
	
	
	function insertDispositivoIr  (arrayCod,indexActual,callback,calbackErr) {
					
					var indexTotal = arrayCod.length - 1;
					var query = "INSERT INTO dispositivoIr (id,tipo, marca, modelo) VALUES (?,?,?,?)";
					
					
				$cordovaSQLite.execute(db, query, [arrayCod[indexActual][0], arrayCod[indexActual][1], arrayCod[indexActual][2], arrayCod[indexActual][3]])
				.then(
						function(res) {
							
								if(indexActual < indexTotal){
									
									insertDispositivoIr(arrayCod,indexActual+1,callback)
									
								} else {
									
									callback();
									
								}
								
							},
						function (err) {
							$cordovaToast.show("ERROR INSERT", 'long', 'center');
							callbackErr()
							}
							
							)
					
					
					} 


	function CSVToArray( strData, strDelimiter ){
         // Check to see if the delimiter is defined. If not,
         // then default to comma.
         strDelimiter = (strDelimiter || ",");
 
         // Create a regular expression to parse the CSV values.
         var objPattern = new RegExp(
             (
                 // Delimiters.
                 "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
 
                 // Quoted fields.
                 "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
 
                 // Standard fields.
                 "([^\"\\" + strDelimiter + "\\r\\n]*))"
             ),
             "gi"
             );
 
 
         // Create an array to hold our data. Give the array
         // a default empty first row.
         var arrData = [[]];
 
         // Create an array to hold our individual pattern
         // matching groups.
         var arrMatches = null;
 
 
         // Keep looping over the regular expression matches
         // until we can no longer find a match.
         while (arrMatches = objPattern.exec( strData )){
 
             // Get the delimiter that was found.
             var strMatchedDelimiter = arrMatches[ 1 ];
 
             // Check to see if the given delimiter has a length
             // (is not the start of string) and if it matches
             // field delimiter. If id does not, then we know
             // that this delimiter is a row delimiter.
             if (
                 strMatchedDelimiter.length &&
                 strMatchedDelimiter !== strDelimiter
                 ){
 
                 // Since we have reached a new row of data,
                 // add an empty row to our data array.
                 arrData.push( [] );
 
             }
 
             var strMatchedValue;
 
             // Now that we have our delimiter out of the way,
             // let's check to see which kind of value we
             // captured (quoted or unquoted).
             if (arrMatches[ 2 ]){
 
                 // We found a quoted value. When we capture
                 // this value, unescape any double quotes.
                 strMatchedValue = arrMatches[ 2 ].replace(
                     new RegExp( "\"\"", "g" ),
                     "\""
                     );
 
             } else {
 
                 // We found a non-quoted value.
                 strMatchedValue = arrMatches[ 3 ];
 
             }
 
 
             // Now that we have our value string, let's add
             // it to the data array.
             arrData[ arrData.length - 1 ].push( strMatchedValue );
         }
 
         // Return the parsed data.
         return( arrData );
     }	

	
	var interfaz = {

			actualizarLista:actualizarLista,

			insertar: function(id,tipo, marca, modelo){
				var q = $q.defer();
				var query = "INSERT INTO dispositivoIr (id,tipo, marca, modelo) VALUES (?,?,?,?)";
				$cordovaSQLite.execute(db, query, [id,tipo, marca, modelo])
				.then(
						function(res) {
								actualizarLista().then(function(res){
									
								var lista=res;	
								q.resolve(res);	
									
								},function(err){
									
									q.reject(err);		
								})	
								
							},
						function (err) {
							$cordovaToast.show("ERROR INSERT", 'long', 'center');
							q.reject(err);
							}
					)
				return q.promise;
			},
			
			seleccionarId: function(id) {
			var listaTemp;
			var q = $q.defer();
				
			if(lista) {	
			
			listaTemp = lista.filter(function(elem){
				
				return elem.id == id
				
			})
			q.resolve(listaTemp[0])
			
			} else {
				
				actualizarLista().then(function(){
				
				listaTemp = lista.filter(function(elem){
				
				return elem.id == id
				
			})
			
			q.resolve(listaTemp[0])
			
				
			},function(err){
				
				q.reject(err)
				
			});
				
				
				
			}
			
			return q.promise;
			
		},

			insertarMasivo: function(){
				
				
				var q = $q.defer();

				$cordovaFile.checkFile(cordova.file.applicationStorageDirectory, 'modelosIr.csv').then(function(res){
					
					q.resolve();
					
				},function(err){
					
					 
							$http.get('modelosIr.csv').success(function(res) {
							var arrayIr = CSVToArray(res,";");
							//alert("insertarmasivo length: " + arrayIr.length);
							truncateDispositivoIr().then(function(res){
								
								insertDispositivoIr(arrayIr,0,function(res){
								//	alert("insertarmasivo alert5");
								actualizarLista().then(function(res){
								//	alert("insertarmasivo alert6");
									$cordovaFile.createFile(cordova.file.applicationStorageDirectory, 'modelosIr.csv', true)
								q.resolve();
									
									
								},function(err){
									$cordovaToast.show("ERROR actualizar lista", 'long', 'center');
								q.reject(err);	
									
								})	
									},function(err){
										
										$cordovaToast.show("ERROR insertar codigos ", 'long', 'center');
										q.reject(err);
									})
								
								
								
								
								
							},function(err){
								
								q.reject(err);
							})
								
								
							})
						.error(function(err){
							$cordovaToast.show("ERROR al leer archivo ", 'long', 'center');
							q.reject(err);
							
						})
					
					
					
					
					
					
				})  
				
				
				
				
				

					//alert(arrayIr.length);
					/*
					var i = 0;
					var insertSQL = "INSERT INTO 'dispositivoIr' SELECT";

					insertSQL += " '" + arrayIr[i][0] + "' AS  'tipo' , '" + arrayIr[i][1] + "' AS  'marca', '" +  
								arrayIr[i][2] + "' AS  'modelo', '" + arrayIr[i][3] + "' AS  'funcion', '" + 
								arrayIr[i][4] + "' AS  'codigo'";

					i++;

					insertSQL += " UNION ALL SELECT ";
					
					while (i < arrayIr.length) {
						
						insertSQL += " '" + arrayIr[i][0] + "', '" + arrayIr[i][1] + "', '" +  arrayIr[i][2] + "', '" + arrayIr[i][3] + "', '" + arrayIr[i][4] + "'";

						i++;

						if (i < arrayIr.length)
						{
							 insertSQL += " UNION ALL SELECT ";
						}
					}

					alert(insertSQL);

					$cordovaSQLite.execute(db, insertSQL)
					.then(
							function(res) {
									alert("INSERTO OK", 'long', 'center');
									q.resolve(arrayIr);									
								},
							function (err) {
								alert("ERROR INSERT", 'long', 'center');
								q.reject(err);
								}
						)

						//q.resolve(arrayIr);	
					});
								*/
								
								
								
				return q.promise;
			},


			devolverFuncionesIRPorId: function(idDispositivoIr){
				
				var q = $q.defer();

			//	var query = "SELECT id, idDispositivoIr, funcion, codigo  FROM funcionesIr";
				var query = "SELECT id, idDispositivoIr, funcion, codigo  FROM funcionesIr WHERE idDispositivoIr = ?";

				alert("devolverFuncionesIRPorId");

			//	$cordovaSQLite.execute(db, query)
				$cordovaSQLite.execute(db, query, [idDispositivoIr])
				.then(
						function(res) {				
							/*
								if(res.rows.length >= 1)
									q.resolve(1);	
								else
									q.resolve(0);
									*/ 
									q.resolve(res);									
							},
						function (err) {
							$cordovaToast.show("ERROR INSERT", 'long', 'center');
						//	alert("entro a err");
							q.reject(err);
							}
					)
				return q.promise;
			},


			existenFuncionesIR: function(idDispositivoIr){
				
				var q = $q.defer();


				var query = "SELECT * FROM funcionesIr WHERE idDispositivoIr = ?";
				//alert("db: " + db);
				$cordovaSQLite.execute(db, query, [idDispositivoIr])
				.then(
						function(res) {				
							//	var lista=res;
							//	alert("res.rows.length: " + res.rows.length);
								if(res.rows.length >= 1)
									q.resolve(1);	
								else
									q.resolve(0);									
							},
						function (err) {
							$cordovaToast.show("ERROR INSERT", 'long', 'center');
						//	alert("entro a err");
							q.resolve(0);
							}
					)
				return q.promise;
			},
			
			filtrarTablaDispositivoIr: function(tipo,marca,modelo){
				var q = $q.defer();
				var respuesta = {};
				respuesta.listaTipo= [];
				respuesta.listaMarca= [];
				respuesta.listaModelo=[];
				
				
				var tipoIr = function() {
					var q = $q.defer();
					var query = "SELECT DISTINCT tipo FROM dispositivoIr"
					$cordovaSQLite.execute(db, query)
				.then(function(res){
					if(res.rows.length > 0) {
							
							for(var i=0; i<res.rows.length; i++)
							{
									respuesta.listaTipo[i] = res.rows.item(i).tipo;
							}
							
					}
					q.resolve()
					
					},function(err){
						q.reject(err);
					})
					
					
					return q.promise;
				};
				
				
				
				var marcaIr = function(tipo) {
					var q = $q.defer();
					
					var query = "SELECT DISTINCT marca FROM dispositivoIr WHERE tipo = ? "
					
					$cordovaSQLite.execute(db, query,[tipo])
				.then(function(res){
					if(res.rows.length > 0) {
							
							for(var i=0; i<res.rows.length; i++)
							{
									respuesta.listaMarca[i] = res.rows.item(i).marca;
							}
							
					}
					q.resolve();
					
					},function(err){
						q.reject(err);
					})
					
					return q.promise;
					
				};
				
					
					
					var modeloIr = function(tipo,marca) {
					var q = $q.defer();
					
					var query = "SELECT DISTINCT modelo FROM dispositivoIr WHERE tipo = ? AND marca = ? "
					
					$cordovaSQLite.execute(db, query,[tipo,marca])
				.then(function(res){
					if(res.rows.length > 0) {
							
							for(var i=0; i<res.rows.length; i++)
							{
									respuesta.listaModelo[i] = res.rows.item(i).modelo;
							}
							
					}
					q.resolve();
					
					},function(err){
						q.reject(err);
					})
					
					return q.promise;
					};
					
					
					
					var getIdDispositivoIr = function(tipo,marca,modelo) {
					var q = $q.defer();
					
					var query = "SELECT id FROM dispositivoIr WHERE tipo = ? AND marca = ? AND modelo = ? "
					
					$cordovaSQLite.execute(db, query,[tipo,marca,modelo])
				.then(function(res){
					if(res.rows.length > 0) {
							
							
									respuesta.idDispositivoIr = res.rows.item(0).id;
							
							
					}
					q.resolve();
					
					},function(err){
						q.reject(err);
					})
					
					return q.promise;
					};
				
				
				
				
				if(!tipo ){
					
					tipoIr().then(function(res){
						respuesta.idDispositivoIr = undefined;	
						q.resolve(respuesta);
						
						},function(err){
						
						q.reject(err)
						
					})			
					
				} else if (!marca ){
					
					tipoIr().then(function(res){
						
						marcaIr(tipo).then(function(res){
						respuesta.idDispositivoIr = undefined;	
						q.resolve(respuesta);	
							
						},function(err){
							q.reject(err)
							
						})
						
						
						
						},function(err){
						
						q.reject(err)
						
					})			
					
					
				} else if(!modelo) {
					
					tipoIr().then(function(res){
						
						marcaIr(tipo).then(function(res){
							
							modeloIr(tipo,marca).then(function(res){
							respuesta.idDispositivoIr = undefined;	
							q.resolve(respuesta);		
								
							},function(err){
								
								q.reject(err)
							})
							
							
							
							
						},function(err){
							q.reject(err)
							
						})
						
						
						
						},function(err){
						
						q.reject(err)
						
					})			
					
					
					
					
				} else {
					
					tipoIr().then(function(res){
						
						marcaIr(tipo).then(function(res){
							
							modeloIr(tipo,marca).then(function(res){
								
								
									getIdDispositivoIr(tipo,marca,modelo).then(function(res){
						
						q.resolve(respuesta);
					},function(err){
						
						q.reject(err)
					});
					
						
								
							},function(err){
								
								q.reject(err)
							})
							
							
							
							
						},function(err){
							q.reject(err)
							
						})
						
						
						
						},function(err){
						
						q.reject(err)
						
					})			
					
				
					
				}
				
				
				
				
				return q.promise;
			},
			
			
			


			lista: function(){
			
			var q = $q.defer();
			if(lista) {
				q.resolve(lista)
			} else {
				
			actualizarLista().then(function(){
				
				q.resolve(lista)
				
			},function(err){
				
				q.reject(err)
				
			});	
			}
				
				
				return q.promise;
				
			
			
		}
				
	}
	
	return interfaz;
}])




.factory("FactoryDB", ['$cordovaSQLite', '$cordovaToast', '$rootScope', '$q','$state', function($cordovaSQLite, $cordovaToast, $rootScope, $q,$state){
	
		var db = null;
		var estadoInicioDomtec=0;
			
			
					
		var interfaz = {
			
			inicioDomtecTab: function(param) {
				
			if (param)
			estadoInicioDomtec=param;
			
			
			return estadoInicioDomtec;
				
				
			},
			
			
			punteroDb: function() {
				return db;
				
			},
			
			
			inicializarDB: function(){
				
				var q = $q.defer();
				try{
					db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
					
					
					
					} 
					catch (e) {
					  alert(e);
					  q.reject(e);
					  //throw e; // rethrow to not marked as handled
					}
				
				




				$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS modulos (id integer primary key AUTOINCREMENT, uuid text, nombre text, clave text, descripcion text, idModuloTipo text, urlImagen text)").then(
			
		function(res) {
			
			$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS espacios (id integer primary key AUTOINCREMENT, descripcion text, urlImagen text)").then(
		
	function(res) {
		
		
		$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS dispositivos (id integer primary key AUTOINCREMENT, nombre text, descripcion text, idEspacio int, urlImagen text, idModulo  int, entradaModulo int, idDispositivoIr int)").then(
	
	function(res) {

					$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS dispositivoIr (id integer primary key , tipo text, marca text, modelo text)").then(

	function(res) {	
		
					$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS funcionesIr (id integer primary key AUTOINCREMENT, idDispositivoIr int, funcion text, codigo text)").then(
	
	function(res) {	

		q.resolve();

		}, function (err) {alert("ERROR TABLA funcionesIr");q.reject(err)});

		}, function (err) {alert("ERROR TABLA dispositivoIr");q.reject(err)});
		
	}, function (err) {alert("ERROR TABLA dispositivos");q.reject(err)});
		
		
	}, function (err) {alert("ERROR TABLA espacios");q.reject(err)});
			
			
		}, function (err) {alert("ERROR TABLA modulos");q.reject(err)});

		
				
				return q.promise;
					
				
					
						
				

			}
		
		}
		
		return interfaz;
	}])
;