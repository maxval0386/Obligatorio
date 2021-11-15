let cart_info_array = [];
var cotizacion = 40;
var dolar = false;
var metodoDePagoSeleccionado = false;

// Muestra los productos agregados en el carrito
function showCartList() {
  let cart = cart_info_array;
  let listCart = document.getElementById("listCart");
  let htmlContentToAppend = "";

  if (cart.length > 0) {
    var moneda = document.getElementById("productCurrency").value;
    for (let i = 0; i < cart.length; i++) {
      let item = cart[i];
      var costo = item.unitCost;
      if (moneda != item.currency) {
        costo = cambMoneda(item.currency, costo, moneda);
      }

      htmlContentToAppend += `
            <li id="item-${i}" class="list-group-item">
              <div class="row">
      
                <div class="col-6 col-sm-4 col-md-4 col-lg-4 col-xl-4 mx-auto">
                  <img src="${
                    item.src
                  }" alt="xc" class="img-thumbnail mx-auto d-block">
                </div>
      
                <div class="col-12 col-sm align-self-stretch d-flex flex-column">
  
                  <div class="d-flex w-100 justify-content-between">
                    <h5 class="my-1">${item.name}</h5>
                    <button name="eraseBtn" type="button" onclick="descartarArt(${i})" class="btn btn-danger align-self-start rounded-circle py-2" title="Descartar artículo"><i class="fas fa-trash-alt text-dark"></i></button>
                  </div>
  
                  <div class="d-flex w-100">
                    <span id="precio-${i}" class="mb-1 mt-2 precio">${moneda} ${costo}</span>
                  </div>
  
                  <div class="mt-auto">
                    <div class="row align-items-center justify-content-between">
                      <div class="col-auto col-sm-7 col-md-7 col-lg-6 col-xl-5 pr-0">
                        <div class="row no-gutters">
                          <div class="col-auto form-inline">
                            <label for="cant${i}" class="pr-2">Cantidad</label>
                          </div>
                          <div class="col-5 col-sm-6 col-md-5 col-lg-6 col-xl-3">
                            <input type="number" class="form-control" id="cant${i}" name="cant" required size="6" value="${
        item.count
      }" min="1" max="1000" oninput="actualizaCalc(${i})">
                          </div>
                        </div>
                      </div>
                      <div class="col pl-0 text-right">
                        <span id="productCostText${i}" class="text-muted precio-subtotal">${moneda} ${
        costo * item.count
      }</span>
                      </div>
                    </div>
                  </div>
  
                </div>
      
              </div>
            </li>`;

      listCart.innerHTML = htmlContentToAppend;
    }
  }
}

// Funcion para cambiar la moneda
function cambioMoneda() {
  var moneda = document.getElementById("productCurrency").value;
  var preciosS = document.getElementsByClassName("precio-subtotal");
  var preciosU = document.getElementsByClassName("precio");
  for (var i = 0; i < preciosS.length; i++) {
    var temp = preciosS[i].innerText.split(" ");
    preciosS[i].innerText = moneda + " " + cambMoneda(temp[0], temp[1], moneda);
  }
  for (var j = 0; j < preciosU.length; j++) {
    var temp = preciosU[j].innerText.split(" ");
    preciosU[j].innerText = moneda + " " + cambMoneda(temp[0], temp[1], moneda);
  }
  calcTotal();
}

// Funcion para calcular el total
function calcTotal() {
  var moneda = document.getElementById("productCurrency").value;
  let subs = document.getElementsByClassName("precio-subtotal");
  let suma = 0;
  let envio = 0;
  for (let i = 0; i < subs.length; i++) {
    var temp = subs[i].innerText.split(" ")[1];
    suma += parseInt(temp);
  }

  var radios = document.getElementsByName("tipoEnvio");

  for (var i = 0, length = radios.length; i < length; i++) {
    if (radios[i].checked) {
      envio = suma * parseFloat(radios[i].value);
      break;
    }
  }
  var signo = "";
  if (moneda == "UYU") {
    signo = "$";
  } else {
    signo = "U$S";
  }
  document.getElementById("subtotalID").innerText =
    signo + " " + suma.toFixed(2);
  document.getElementById("envioID").innerText = signo + " " + envio.toFixed(2);
  document.getElementById("totalConEnvioID").innerText =
    signo + " " + (suma + envio).toFixed(2);
  document.getElementById("totalConEnvioTextoID").innerText =
    "Total (" + moneda + ") ";
}

// Funcion para calcular el subtotal
function calcSubtotal(unitCost, i) {
  if (document.getElementById(`count${i}`) != null) {
    let count = parseInt(document.getElementById(`count${i}`).value);
    subtotal = checkCurrency(unitCost, cart_info_array[i].currency) * count;
    document.getElementById(`productSubtotal${i}`).innerText = subtotal;
    calcTotal();
  }
}

// Actualiza el subTotal en base a la cantidad de cada articulo
function actualizaCalc(i) {
  var precio = document.getElementById("productCostText" + i);
  var temp = document.getElementById("precio-" + i).innerText.split(" ");
  var cant = document.getElementById("cant" + i).value;
  precio.innerText = temp[0] + " " + temp[1] * cant;
  calcTotal();
}

// Cambio de moneda
function cambMoneda(moneda, cantidad, monedaOut) {
  if (moneda == monedaOut) {
    return cantidad;
  }
  switch (moneda) {
    case "UYU":
      if (monedaOut == "USD") {
        return cantidad / cotizacion;
      }
    case "USD":
      if (monedaOut == "UYU") {
        return cantidad * cotizacion;
      }
    default:
      return undefined;
  }
}

// Elimina un artículo del carrito
function descartarArt(num) {
  var li = document.getElementById("item-" + num);
  var ul = document.getElementById("listCart").removeChild(li);
  calcTotal();
}

// Selecciono el método de pago
function metodoPago() {
  let pagos = document.getElementsByName("tipoDePago");
  for (let i = 0; i < pagos.length; i++) {
    if (pagos[i].checked && pagos[i].value == "1") {
      document.getElementById("modalDefinirTarjeta").classList.remove("d-none");
      document.getElementById("modalDefinirBanco").classList.add("d-none");
    } else if (pagos[i].checked && pagos[i].value == "2") {
      document.getElementById("modalDefinirTarjeta").classList.add("d-none");
      document.getElementById("modalDefinirBanco").classList.remove("d-none");
    }
  }
}

// Validación para el método de pago
function agregarMetodoDePago() {
  metodoDePagoSeleccionado = true;
  document.getElementById(
    "selecFormaDePago"
  ).innerHTML = ` <div class="alert-success mt-3">
  <strong>Forma de pago ingresada.</strong>
  </div>
  `;
  $("#modalFormaDePago").modal("hide");
}

// Para volver al index luego de cerrar la ventana correspondiente a la compra finalizada.
function goHome() {
  location.href="index.html";
}

$(document).ready(function(){
  //Para dar formato al número de la tarjeta.
  var cardNum = document.getElementById('cr_no');
  cardNum.onkeyup = function (e) {
  if (this.value == this.lastValue) return;
  var caretPosition = this.selectionStart;
  var sanitizedValue = this.value.replace(/[^0-9]/gi, '');
  var parts = [];
  
  for (var i = 0, len = sanitizedValue.length; i < len; i +=4) { parts.push(sanitizedValue.substring(i, i + 4)); } for (var i=caretPosition - 1; i>= 0; i--) {
      var c = this.value[i];
      if (c < '0' || c> '9') {
          caretPosition--;
          }
          }
          caretPosition += Math.floor(caretPosition / 4);
  
          this.value = this.lastValue = parts.join('-');
          this.selectionStart = this.selectionEnd = caretPosition;
          }
  
          //Para dar formato a la fecha de expiración
          var expDate = document.getElementById('exp');
          expDate.onkeyup = function (e) {
          if (this.value == this.lastValue) return;
          var caretPosition = this.selectionStart;
          var sanitizedValue = this.value.replace(/[^0-9]/gi, '');
          var parts = [];
  
          for (var i = 0, len = sanitizedValue.length; i < len; i +=2) { parts.push(sanitizedValue.substring(i, i + 2)); } for (var i=caretPosition - 1; i>= 0; i--) {
              var c = this.value[i];
              if (c < '0' || c> '9') {
                  caretPosition--;
                  }
                  }
                  caretPosition += Math.floor(caretPosition / 2);
  
                  this.value = this.lastValue = parts.join('/');
                  this.selectionStart = this.selectionEnd = caretPosition;
                  }
                  })


//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
  getJSONData(CART_INFO2_URL).then(function (resultObj) {
    if (resultObj.status === "ok") {
      cart_info_array = resultObj.data.articles;
      // Muestra los productos agregados al carrito
      showCartList();
      calcTotal();
    }
  });
  // Evento para que no me recargue la página al aceptar un modo de pago.
  document.getElementById("pagoBanco").addEventListener("submit", function (e) {
    e.preventDefault();
    agregarMetodoDePago();
    return false;
  });

  document
    .getElementById("pagoTarjeta")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      agregarMetodoDePago();
      return false;
    });

  document
    .getElementById("needs-validation")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      if (metodoDePagoSeleccionado == false) {
        document.getElementById(
          "selecFormaDePago"
        ).innerHTML = ` <div class="alert-danger mt-3">
    <strong>Se debe de seleccionar una forma de pago.</strong>
    </div>
    `;
      } else {
        document.getElementById("carrito").innerHTML = `
<div class="alert alert-success alert-dismissible show mt-3" role="alert">
    <strong>Felicidades!</strong>
    <p>
        Su compra ha sido realizada con éxitos.
    </p>
    <button type="button" class="close" onclick="goHome()" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
    </button>
</div>
`;
      }
    });
});
