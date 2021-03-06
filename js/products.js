//Tipos de filtros
const ORDER_ASC_BY_PRICE = "ASC";
const ORDER_DESC_BY_PRICE = "DESC";
const ORDER_BY_RELEVANCE = ">";
//Guardado de lista de productos
var category_prod = [];
//Guardados de criterios de filtros
var currentSortCriteria = undefined;
var minPrice = undefined;
var maxPrice = undefined;
var buscar = undefined;

//Función para ordenar el listado de productos (comparaciones) acorde el filtro seleccionado
function sortProducts(criteria, array) {
  let result = [];
  if (criteria === ORDER_ASC_BY_PRICE) {
    result = array.sort(function (a, b) {
      if (a.cost < b.cost) {
        return -1;
      }
      if (a.cost > b.cost) {
        return 1;
      }
      return 0;
    });
  }
  if (criteria === ORDER_DESC_BY_PRICE) {
    result = array.sort(function (a, b) {
      if (a.cost > b.cost) {
        return -1;
      }
      if (a.cost < b.cost) {
        return 1;
      }
      return 0;
    });
  }
  if (criteria === ORDER_BY_RELEVANCE) {
    result = array.sort(function (a, b) {
      if (a.soldCount > b.soldCount) {
        return -1;
      }
      if (a.soldCount < b.soldCount) {
        return 1;
      }
      return 0;
    });
  }

  return result;
}

//Imprime el listado de productos en el sitio
function showProductList() {
  let htmlContentToAppend = "";
  for (let i = 0; i < category_prod.length; i++) {
    let prod = category_prod[i];
    if (
      (minPrice == undefined ||
        (minPrice != undefined && parseInt(prod.cost) >= minPrice)) &&
      (maxPrice == undefined ||
        (maxPrice != undefined && parseInt(prod.cost) <= maxPrice))
    ) {
      // Filtra los productos segun lo que se agrega en la barra de búsqueda.
      // Chequea el valor en el search_box y lo buscando en el nombre o descripción
      if (
        buscar == undefined ||
        prod.name.toLowerCase().indexOf(buscar) != -1 ||
        prod.description.toLowerCase().indexOf(buscar) != -1
      ) {
        //Usando los valores de la api cree el html para cada producto
        htmlContentToAppend +=
          `
          <div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 p-2 m-0 text-center">
          <a href="product-info.html" class="p-0 mx-auto h-100 card list-group-item-action mwp-300">
              <img src="${prod.imgSrc}" class="card-img-top" alt="Imagen">
              <div class="card-body p-3">
                  <h4 class="card-title"><strong>${prod.name}</strong></h4>
                  <p class="card-text">
                      ${prod.description}
                  </p>
              </div>
              <div class="card-footer">
                  Precio: <br> <strong>${prod.currency} ${prod.cost} </strong> <br>
                  ${prod.soldCount} vendidos
              </div>
          </a>
      </div>
      `;
      }
    }
    
    //Se agrega el código generado al html del sitio
    document.getElementById("prod-list-container").innerHTML =
      htmlContentToAppend;
  }
}
//Gestiona la muestra y filtrado de producto
function sortAndShowProducts(sortCriteria, ProductsArray) {
  currentSortCriteria = sortCriteria;

  if (ProductsArray != undefined) {
    category_prod = ProductsArray;
  }

  category_prod = sortProducts(currentSortCriteria, category_prod);

  //Muestro las categorías ordenadas
  showProductList();
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
  //Obtengo la lista de los productos
  getJSONData(PRODUCTS_URL).then(function (resultObj) {
    if (resultObj.status === "ok") {
      sortAndShowProducts(ORDER_ASC_BY_PRICE, resultObj.data);
    }
  });
  //Se agrega el evento al botón precio ascendente
  document.getElementById("sortAsc").addEventListener("click", function () {
    sortAndShowProducts(ORDER_ASC_BY_PRICE);
  });
  //Se agrega el evento al botón de relevancia
  document.getElementById("sortRel").addEventListener("click", function () {
    sortAndShowProducts(ORDER_BY_RELEVANCE);
  });
  //Se agrega el evento al botón precio ascendente
  document.getElementById("sortDesc").addEventListener("click", function () {
    sortAndShowProducts(ORDER_DESC_BY_PRICE);
  });
  //Se agrega el evento al botón de limpiar el filtro de rango de precio
  document
    .getElementById("clearRangeFilter")
    .addEventListener("click", function () {
      document.getElementById("rangeFilterPriceMin").value = "";
      document.getElementById("rangeFilterPriceMax").value = "";

      minPrice = undefined;
      maxPrice = undefined;

      showProductList();
    });
  //Se agrega el evento al botón de rango de precio
  document
    .getElementById("rangeFilterPrice")
    .addEventListener("click", function () {
      //Aplica el filtro de mínimo y máximo del precio
      minPrice = document.getElementById("rangeFilterPriceMin").value;
      maxPrice = document.getElementById("rangeFilterPriceMax").value;
      console.log(minPrice);
      if (minPrice != undefined && minPrice != "" && parseInt(minPrice) >= 0) {
        minPrice = parseInt(minPrice);
      } else {
        minPrice = undefined;
      }

      if (maxPrice != undefined && maxPrice != "" && parseInt(maxPrice) >= 0) {
        maxPrice = parseInt(maxPrice);
      } else {
        maxPrice = undefined;
      }

      showProductList();
    });
  // Asocia el evento de keyup al search_box y al disparar el evento actualiza la variable 
  // buscar con el valor que tiene el search_box y muestra los productos
  document.getElementById("search_box").addEventListener("keyup", function(){
    buscar = document.getElementById("search_box").value.toLowerCase();
    showProductList();
  });
});