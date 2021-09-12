var relatedProduct;
var productInfo;
var productComment;

// Muestro la información de los productos obtenidas por el json
function showProductInfo() {
  document.getElementById("nombre_producto").innerText = productInfo.name;
  var temp = document.getElementById("carousel-imgs");
  for(var i = (productInfo.images.length - 1); i >= 0; i--){
    node = document.createElement("div");
    if (i == 0) {
      node.classList = "carousel-item active";
    } else {
      node.classList = "carousel-item";
    }
    node.innerHTML = '<img class="d-block w-100" src="'+ productInfo.images[i] +'">'
    temp.insertBefore(node, temp.childNodes[0]);
  };
  document.getElementById("precio_producto").innerHTML = "<strong>"+ productInfo.currency + " " + productInfo.cost +"</strong>";
  document.getElementById("vendidos_productos").innerHTML = "<strong>Vendidos: "+ productInfo.soldCount +"</strong>";
  document.getElementById("collapseOne").innerHTML = "<div>"+ productInfo.description +"</div>"
}

  function showProductComment() {
    let comments = "";
    //Recorre por cada elemento en el arreglo
    productComment.forEach(function (ob) {
      //Cada comentario es añadido a el codigo
      comments +=
        `
        <li class="list-group-item ">
      <div class="row col-12">
      <div class="col-12">`;
      for (var i = 0; i < 5; i++) {
        //Se repite 5 veces porque son 5 estrellas
        var icoClass = "";
        //Si score es menor a i se muestra estrella vacia sino lo contrario
        if (i <ob.score) {
          icoClass = "fa fa-star checked icon-a";
        }
        else {
          icoClass = "far fa-star icon-b";
        }
        comments += "<i class='" + icoClass + "'></i>"; // Concatenacion de estrellas
      }
      comments += `</div>
        <div class="col-xs-10 col-md-11">
          <div>
            <div class="mic-info">
              By:
              <a href="#">` +
        ob.user +
        `</a>
             ` +
        ob.dateTime +
        `
            </div>
          </div>
          <div class="comment-text">` +
        ob.description +
        `</div>
          <div class="action">
          </div>
        </div>
      </div>
    </li><br>`;
    });
    //Asignando luego del for agrega a el tag prodComment el codigo html
    document.getElementById("comentarios_productos").innerHTML = comments;
  }

  function starmark(item) {
    //Funcion que trabaja con el codigo html mientras se mueve el mouse en las estrellas
    count = item.id[0];
    //Se guardan las estrellas en la session storage
    sessionStorage.starRating = count;
    var subid = item.id.substring(1);
    for (var i = 0; i < 5; i++) {
      if (i < count) {
        document.getElementById(i + 1 + subid).style.color = "orange";
        document.getElementById(i + 1 + subid).classList = "fa fa-star checked";
      } else {
        document.getElementById(i + 1 + subid).style.color = "black";
        document.getElementById(i + 1 + subid).classList = "far fa-star";
      }
    }
  }

  function publicar_comentario() {
    let comentario = {
      score: sessionStorage.starRating,
      description: document.getElementById("comentario_nuevo").value,
      user: localStorage.getItem("user"),
      dateTime: fecha_actual(),
    };
    productComment.push(JSON.parse(JSON.stringify(comentario)));
    showProductComment();
    document.getElementById("comentario_nuevo").value="";
  }

  function fecha_actual() {
    var date=new Date()
    var temp={
      y:date.getFullYear(),
      m:("0"+(date.getMonth()+1)).slice(-2),
      d:("0"+date.getDate()).slice(-2),
      h:date.getHours(),
      min:date.getMinutes(),
      s:date.getSeconds(),
    }
    return temp["y"]+"-"+temp["m"]+"-"+temp["d"]+" "+temp["h"]+":"+temp["min"]+":"+temp["s"]
  }
 
//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
  getJSONData(PRODUCT_INFO_URL).then(function (resultObj) {
    if (resultObj.status === "ok") {
      productInfo = resultObj.data;
      showProductInfo();
    }
  });
   getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function (resultObj) {
      if (resultObj.status === "ok") {
        productComment = resultObj.data;
              //Si es diferente a undefined entra al if y muestra el comentario guardado en el seassion storage
      if (sessionStorage.getItem("comentario")) {
        //Agrega a la varuable productComment el objeto guardado en seasion storage (lo transforma a un objeto desde string)
        productComment.push(JSON.parse(sessionStorage.getItem("comentario")));
      }
        showProductComment();
      }
    });
  });