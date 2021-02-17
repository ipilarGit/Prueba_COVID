/* Hito 1 - Requerimiento 2: Consumir la API http://localhost:3000/api/total con Javascript o Jquery */

const dataPaises = (() => {
     let datosCovid;
     let url = "http://localhost:3000/api/total";
     $("#spinner").removeClass('d-none');
     $('#thead').addClass('d-none'); //ocultar 
     async function solicitudData() {
          try {
               const respuesta = await fetch(url);
               const datos = await respuesta.json();

               datosCovid = datos.data; // arreglo total
               const chartData = getChartData(datosCovid);
               graficoCasosActivos(chartData);

               $('.spinner').hide();
               $("#spinner").addClass('d-none');

               tablaTotalCovid(datosCovid);

          } catch (error) {
               console.log(`Ocurrio un error: ${error}`);
          }
     }
     solicitudData();

     Number.prototype.format = function (n, x, s, c) {
          var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
               num = this.toFixed(Math.max(0, ~~n));
          return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
     };

     const getChartData = (data) => {
          /*  Hito 1 - Requerimiento 3: Desplegar la informacion de la API 
          en un grafico de barras que debe mostrar solo los paises con mas
          de 10000 casos activos */

          data = data.filter(dato => dato.active > 200000);

          let paises = data.map(x => x.location);
          const casosRecuperados = data.map(r => r.recovered);
          const casosActivos = data.map(a => a.active);
          const casosConfirmados = data.map(c => c.confirmed);
          const casosFallecidos = data.map(m => m.deaths);

          const chartData = {
               labels: paises,
               datasets: [{
                    type: 'line',
                    label: 'Casos Activos',
                    data: casosActivos,
                    borderColor: ['#d9534f'],
                    borderWidth: 3,
                    fill: false,
               }, {
                    type: 'bar',
                    label: 'Casos Recuperados',
                    backgroundColor: ['#5cb85c'],
                    hoverBackgroundColor: ['#5cb85c'],
                    data: casosRecuperados,
                    borderColor: 'green',
                    borderWidth: 2
               }, {
                    type: 'bar',
                    label: 'Casos Confirmados',
                    backgroundColor: ['#c8b010'],
                    hoverBackgroundColor: ['#c8b010'],
                    data: casosConfirmados,
                    borderColor: 'yellow',
                    borderWidth: 2
               }, {
                    type: 'bar',
                    label: 'Casos Fallecidos',
                    backgroundColor: ['#292b2c'],
                    hoverBackgroundColor: ['#292b2c'],
                    data: casosFallecidos,
                    borderColor: 'black',
                    borderWidth: 2
               }
               ]
          };
          return chartData;
     }

     const graficoCasosActivos = (chartData) => {

          let titulopaisesconcovid19 = document.getElementById("titulopaisesconcovid19");
          titulopaisesconcovid19.innerHTML = `<h3 class="text-center">Paises con Covid19</h3>`;
          var ctx = document.getElementById('canvas1').getContext('2d');

          window.myMixedChart = new Chart(ctx, {
               type: 'bar',
               data: chartData,
               options: {
                    responsive: true,
                    title: {
                         display: true,
                         fontSize: 20,
                         fontColor: '#000',
                         text: 'Paises con más de 200.000 Casos Activos'
                    },
                    tooltips: {
                         mode: 'index',
                         titleFontSize: 15,
                         bodyFontSize: 15,
                         intersect: true
                    },
                    legend: {
                         display: true,
                         position: 'top',
                         labels: {
                              fontSize: 20,
                              fontColor: '#000'
                         }
                    },
                    scales: {
                         yAxes: [{
                              ticks: {
                                   beginAtZero: true,
                                   fontColor: '#000',
                                   fontSize: 15
                              }
                         }],
                         xAxes: [{
                              ticks: {
                                   beginAtZero: true,
                                   fontColor: '#000',
                                   fontSize: 20
                              }
                         }],
                    },
                    pointLabels: {
                         fontSize: 15
                    },
               }
          });
     }

     const tablaTotalCovid = (datosCovid) => {

          /* Hito 1 - Requerimiento 4: Desplegar toda la información
          de la API en una tabla */

          /* Hito 1: Requerimiento 5: Cada fila de la tabla debe 
          incluir un link que diga "ver detalle ", al hacer click 
          levante un modal y muestre los casos activos, muertos, 
          recuperados y confirmados en un gráfico, para obtener
          esta información debes llamar a la API 
          http://localhost:3000/api/countries/{country} al momento de levantar el modal */

          let titulotabladecasosmundiales = document.getElementById("titulotabladecasosmundiales");
          titulotabladecasosmundiales.innerHTML = `<h3 class="text-center">Tabla de Casos Mundiales</h3>`;
          $('#thead').removeClass('d-none'); //mostrar 
          let tbody = document.getElementById("tbody");
          tbody.innerHTML = "";
          datosCovid.forEach((dato, i) => {
               let confirmados = dato.confirmed.format(0, 3, '.');
               let recuperados = dato.recovered.format(0, 3, '.');
               let fallecidos = dato.deaths.format(0, 3, '.');
               let activos = dato.active.format(0, 3, '.');
               let locacion = dato.location;

               tbody.innerHTML += `
               <tr>          
                    <td class="text-dark">${i + 1}</td>          
                    <td class="text-dark">${dato.location}</td>
                    <td class="text-warning"><img src="assets/img/peligro_biologico.svg" width="30"> ${confirmados}</td>
                    <td class="text-dark"><img src="assets/img/cruz.svg" width="30"> ${fallecidos}</td>
                    <td class="text-success"><img src="assets/img/saludable1.svg" width="30"> ${recuperados}</td>
                    <td class="text-danger"><img src="assets/img/covid19.svg" width="30"> ${activos}</td>
                    <td><button id="btn1" class="btn btn-primary"  data-toggle="modal" data-target="#modalDetallePais" onclick="verDetallePais('${locacion}')">Ver Detalle</button></td>
                    <td><button id="btn2" class="btn btn-info" data-toggle="modal" data-target="#modalGraficoPais" onclick="verGraficoModal('${locacion}')">Ver Gráfico</button></td>
               </tr>`;
          });
     };
})();


const recargaInicial = () => {
     $('#situacionchile').addClass('d-none'); // boton oculto
     $('#cerrarsesion').addClass('d-none');  //boton oculto
     $('#canvas2').addClass('d-none'); //grafico Chile oculto
     $('titulosituacionenchile').addClass('d-none'); // titulo oculto
}

const recargaInicialSituacionChile = () => {
     $('#iniciarsesion').addClass('d-none'); //boton oculto
     $('titulosituacionenchile').removeClass('d-none');// mostrar
     $('#situacionchile').removeClass('d-none'); //boton mostrar
     $('#cerrarsesion').removeClass('d-none'); //boton mostrar
}

const recargaSituacionChile = () => {
     $('#titulosituacionenchile').removeClass('d-none'); //mostrar
     $('#canvas1').addClass('d-none'); //ocultar
     $('#canvas2').removeClass('d-none'); //mostrar
     $('#titulopaisesconcovid19').addClass('d-none'); //ocultar
     $('#titulotabladecasosmundiales').addClass('d-none'); // ocultar
     $('#tabla').addClass('d-none'); //ocultar 
     $('#thead').addClass('d-none'); //ocultar

}

const recargaCerrarSesion = () => {
     $('#titulopaisesconcovid19').removeClass('d-none'); //muestrar
     $('#titulosituacionenchile').addClass('d-none'); // ocultar
     $('#titulotabladecasosmundiales').removeClass('d-none'); //mostrar
     $('#canvas1').removeClass('d-none'); //muestrar
     $('#canvas2').addClass('d-none'); //ocultar
     $('#thead').removeClass('d-none'); // mostrar
     $("#tabla").removeClass('d-none'); //mostrar

}

$(document).ready(async function () {
     recargaInicial();
     const token = localStorage.getItem('jwt-token');
     if (token) {
          recargaInicialSituacionChile();
          await getDataChile();
     }
})

const getDataChile = async () => {

     const token = localStorage.getItem('jwt-token');

     const dataConfirmados = await getDataChileConfirmados(token);
     const dataFallecidos = await getDataChileFallecidos(token);
     const dataRecuperados = await getDataChileRecuperados(token);

     return { dataConfirmados, dataFallecidos, dataRecuperados }
}

const getToken = async (email, password) => {
     try {
          const response = await fetch("http://localhost:3000/api/login", {
               method: "POST",
               body: JSON.stringify({ email: email, password: password }),
          });
          const { token } = await response.json();

          console.log(email);
          console.log(password);

          localStorage.setItem('jwt-token', token);

          console.log("getToken ", token);
          return token;
     } catch (err) {
          console.error('Error Login: ', err);
     }
};

/* Hito 2 - Requerimiento 3: Implementar la lógica para obtener
 el JWT cuando se ingrese el correo y contraseña a través del 
 formulario. */

let email = document.getElementById("email");
email.value = "";
let password = document.getElementById("password")
password.value = "";
$("span.help-block").hide();

function validacion(campo) {

     if (campo === 'email') {
          email = document.getElementById(campo).value;
          let validacionEmail = /[A-Z0-9._%+-]+@[A-Z0-9-]+.[A-Z]/gim;
          if (email == null || email.length == 0 || (validacionEmail.test(email) == false)) {

               console.log('Email nulo o Email == 0 o Email NO tiene @');
               $('#' + campo).parent().parent().attr("class", "form-group has-error has-feedback");
               $('#' + campo).parent().children('span').text("Debe ingresar un correo valido").show();
               return false;
          }
          else return true;
     }

     if (campo === 'password') {
          password = document.getElementById(campo).value;
          if (password == null || password.length == 0 || password.length < 6) {
               console.log('password es null o password == 0 o password con longitud < 6');
               $('#' + campo).parent().parent().attr("class", "form-group has-error has-feedback");
               $('#' + campo).parent().children('span').text("Debe ingresar una contraseña").show();
               return false;
          }
          else return true;
     }
}

async function validar() {

     let correo = validacion('email');
     let contrasena = validacion('password');

     email = document.getElementById("email").value;
     password = document.getElementById("password").value;

     if (correo === true) {
          $('#' + 'email').parent().parent().attr("class", "form-group has-error has-feedback");
          $('#' + 'email').parent().children('span').text("  ").show();
     }
     if (contrasena === true) {
          $('#' + 'password').parent().parent().attr("class", "form-group has-error has-feedback");
          $('#' + 'password').parent().children('span').text("  ").show();
     }
     if (correo === false || contrasena === false) {
          $("#exito").hide(); // mal ingresado
          $("#error").show(); // No autorizado
     } else {

          try {
               const jwt = await getToken(email, password);

               if (jwt) {
                    console.log('email y contraseña correctas');

                    $('#modaliniciarsesion').modal('hide'); //oculta modal

                    // ocultar botones y titulos
                    recargaInicialSituacionChile();
                    recargaSituacionChile();

                    localStorage.setItem('jwt-token', jwt); //almacenando en el localStorage

                    $("#spinner").removeClass('d-none');
                    $('.spinner').show();

                    dataChile = await getDataChile();

                    $("#error").hide();
                    $("#exito").show(); // ingreso exitoso

                    verGraficoChile(dataChile, jwt);
                    $('.spinner').hide()
                    $("#spinner").addClass('d-none');

               } else {
                    $("#exito").hide();
                    $("#error").show(); // ingreso no autorizado
               }
          } catch (error) {
               console.log('Token No esta Definido :', error);
          }
     }
}

/* Hito 2 - Requerimiento 4: Al hacer click sobre la opción 
Situación Chile, se debe mostrar una nueva página donde se 
añadirá un gráfico y se debe ocultar el gráfico de todos 
los países con la tabla. 
● Llamar a la API para obtener el JWT
● Persistir el JWT.
● Cuando exista un JWT, se debe ocultar la opción
del menú que dice Iniciar sesión, se debe agregar
una que diga Situación Chile y otra de Cerrar sesión. */

const situacionchile = document.getElementById("situacionchile");
situacionchile.addEventListener('click', async () => {

     token = localStorage.getItem('jwt-token');
     if (token) {
          // ocultar botones y titulos
          recargaInicialSituacionChile();
          recargaSituacionChile();

          dataChile = await getDataChile();
          verGraficoChile(dataChile, token);
          $('.spinner').hide()
          $("#spinner").addClass('d-none');
     } else {
          console.log('ya no tengo token');
     }
})

Number.prototype.format = function (n, x, s, c) {
     var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
          num = this.toFixed(Math.max(0, ~~n));

     return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};


async function getData(pais) {

     const urlpais = `http://localhost:3000/api/countries/${pais}`;
     // console.log("ESTA DENTRO DE LA URL", urlpais);
     try {
          const resultados = await fetch(urlpais); // Se obtiene el dato
          let datapais = await resultados.json();
          return datapais.data   // objeto con el detalle pais.         
     } catch (error) {
          console.log(`Ocurrio un error: ${error}`);
     }
}

const verDetallePais = async (pais) => {

     const paisDetalle = await getData(pais);

     $("#btn1").click(function () {
          $("#modalDetallePais").draggable({});
     })
     $("#btn2").click(function () {
          $("#modalGraficoPais").draggable({});
     })

     let modalInfoPais = document.getElementById("modal-info-pais");
     pais = document.getElementById("pais");
     pais.innerHTML = "";
     modalInfoPais.innerHTML = "";

     if (paisDetalle.location != undefined) {

          pais.innerHTML = paisDetalle.location;
          let confirmados = paisDetalle.confirmed.format(0, 3, '.');
          let fallecidos = paisDetalle.deaths.format(0, 3, '.');
          let recuperados = paisDetalle.recovered.format(0, 3, '.');
          let activos = paisDetalle.active.format(0, 3, '.');

          modalInfoPais.innerHTML = `
          <h5 class="text-warning">Casos Confirmados: ${confirmados}</h5>
          <h5 class="text-dark">Casos Fallecidos : ${fallecidos}</h5>
          <h5 class="text-success">Casos Recuperados: ${recuperados}</h5>
          <h5 class="text-danger">Casos Activos   : ${activos}</h5>`
     } else {
          modalInfoPais.innerHTML = `
          <h5 class="text-primary">La información para este país no se encuentra Disponible</h5>`;
     }
}

const verGraficoModal = async (pais) => {

     paisDetalleGrafico = await getData(pais);

     var config = {
          type: 'doughnut',
          data: {
               datasets: [{
                    data: [
                         paisDetalleGrafico.active,
                         paisDetalleGrafico.confirmed,
                         paisDetalleGrafico.recovered,
                         paisDetalleGrafico.deaths
                    ],
                    backgroundColor: [
                         '#d9534f',
                         '#c8b010',
                         '#5cb85c',
                         '#292b2c'
                    ],
                    label: 'Casos Activos'
               }],
               labels: [
                    'Casos Activos',
                    'Casos Confirmados',
                    'Casos Recuperados',
                    'Casos Fallecidos'
               ]
          },
          options: {
               responsive: true,
               legend: {
                    position: 'top',
               },
               title: {
                    display: true,
                    fontSize: 20,
                    fontColor: '#000',
                    text: paisDetalleGrafico.location
               },
               animation: {
                    animateScale: true,
                    animateRotate: true
               }
          }
     };

     var ctx = document.getElementById('chart-area').getContext('2d');
     if (window.doughnut) {
          window.doughnut.clear();
          window.doughnut.destroy();
     }
     window.doughnut = new Chart(ctx, config);
}

/* Hito 2 - Requerimiento 6: En un sólo gráfico de línea se
debe mostrar la información obtenida de las APIs del punto 5 */

async function verGraficoChile(dataChile, token) {

     console.log('dataChile: ', dataChile);

     if (token) {

          let titulosituacionenchile = document.getElementById("titulosituacionenchile");
          titulosituacionenchile.innerHTML = `<h3 class="text-center">Situación Covid19 en Chile</h3>`;

          casosRecuperadosFechas = dataChile.dataRecuperados.map(r => r.date);
          casosConfirmadosFechas = dataChile.dataConfirmados.map(c => c.date);
          casosFallecidosFechas = dataChile.dataFallecidos.map(m => m.date);

          let fechasTotal = casosRecuperadosFechas.concat(casosConfirmadosFechas.concat(casosFallecidosFechas));
          const pasoFechas = Array.from(new Set(fechasTotal));
          const fechasUnicas = [...new Set(pasoFechas)];

          casosRecuperados = dataChile.dataRecuperados.map(r => r.total);
          casosConfirmados = dataChile.dataConfirmados.map(c => c.total);
          casosFallecidos = dataChile.dataFallecidos.map(m => m.total);

          var config = {
               type: 'line',
               data: {
                    labels: fechasUnicas,
                    datasets: [{
                         label: 'Casos Fallecidos',
                         borderColor: window.chartColors.red,
                         backgroundColor: ['#d9534f'],
                         borderWidth: 2,
                         fill: false,
                         data: casosFallecidos
                    }, {
                         label: 'Casos Recuperados',
                         borderColor: window.chartColors.green,
                         backgroundColor: ['#5cb85c'],
                         borderWidth: 2,
                         fill: false,
                         data: casosRecuperados
                    }, {
                         label: 'Casos Confirmados',
                         borderColor: window.chartColors.yellow,
                         backgroundColor: ['#c8b010'],
                         borderWidth: 2,
                         fill: false,
                         data: casosConfirmados
                    }]
               },
               options: {
                    responsive: true,
                    title: {
                         display: true,
                         fontSize: 20,
                         fontColor: '#000',
                         text: 'Situación de Casos en Chile'
                    },
                    tooltips: {
                         mode: 'index',
                         titleFontSize: 15,
                         bodyFontSize: 15,
                    },
                    hover: {
                         mode: 'index'
                    },
                    legend: {
                         display: true,
                         position: 'top',
                         labels: {
                              fontSize: 20,
                         }
                    },
                    scales: {
                         xAxes: [{
                              scaleLabel: {
                                   fontColor: '#000',
                                   fontSize: 20,
                                   display: true,
                                   labelString: 'Fecha'
                              },
                              ticks: {
                                   beginAtZero: true,
                                   fontColor: '#000',
                                   fontSize: 15
                              }
                         }],
                         yAxes: [{
                              stacked: true,
                              scaleLabel: {
                                   fontColor: '#000',
                                   fontSize: 20,
                                   display: true,
                                   labelString: 'Cantidad'
                              },
                              ticks: {
                                   beginAtZero: true,
                                   fontColor: '#000',
                                   fontSize: 20
                              }
                         }]
                    }
               }
          };
          var ctx = document.getElementById('canvas2').getContext('2d');
          window.myLine = new Chart(ctx, config);
          window.myLine.update();

          tablita = true;
     } else {
          tablita = false;
          console.log('Sin token');
     }

}

/* Hito 2 - Requerimiento 5: Al hacer click en la opción Situación
 Chile, se debe llamar a las siguientes APIs:
 http://localhost:3000/api/confirmed
 http://localhost:3000/api/deaths
http://localhost:3000/api/recovered
 */

const getDataChileRecuperados = async (jwt) => {
     try {
          const response = await fetch("http://localhost:3000/api/recovered", {
               method: "GET",
               headers: {
                    Authorization: `Bearer ${jwt}`,
               },
          });
          const dataRecuperados = await response.json();
          return dataRecuperados.data;
     } catch (err) {
          console.error(`Error: ${err}`);
     }
};

const getDataChileConfirmados = async (jwt) => {
     try {
          const response = await fetch("http://localhost:3000/api/confirmed", {
               method: "GET",
               headers: {
                    Authorization: `Bearer ${jwt}`,
               },
          });
          const dataConfirmados = await response.json();
          return dataConfirmados.data;
     } catch (err) {
          console.error(`Error: ${err}`);
     }
};

const getDataChileFallecidos = async (jwt) => {
     try {
          const response = await fetch("http://localhost:3000/api/deaths", {
               method: "GET",
               headers: {
                    Authorization: `Bearer ${jwt}`,
               },
          });
          const dataFallecidos = await response.json();
          return dataFallecidos.data;
     } catch (err) {
          console.error(`Error: ${err}`);
     }
};

/* Hito 2 - Requerimiento 7: Al hacer click sobre el link Cerrar 
sesión del menú se debe volver al estado inicial de la aplicación, 
eliminar el token y ocultar los link de Situación Chile y Cerrar 
sesión, además de volver a mostrar Iniciar sesión */

const cerrarSesion = () => {
     token = localStorage.removeItem('jwt-token');
     if (token) {
          recargaInicial();
          $('#iniciarsesion').removeClass('d-none');
          recargaCerrarSesion();
     } else {
          location.reload();
     }
}

const home = () => {
     token = localStorage.getItem('jwt-token');
     if (token) recargaCerrarSesion();
}









