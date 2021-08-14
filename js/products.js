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

//Función para ordenar el listado de productos acorde el filtro seleccionado
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
      //Usando los valores de la api cree el html para cada producto
      htmlContentToAppend +=
        `
              <a href="product-info.html" class="list-group-item list-group-item-action col-md-12">
                  <div class="row">
                      <div class="col-3">
                          <img src="` +
        prod.imgSrc +
        `" alt="` +
        prod.description +
        `" class="img-thumbnail">
                      </div>
                      <div class="col">
                          <div class="d-flex w-100 justify-content-between">
                              <h4 class="mb-1">` +
        prod.name +
        ` - U$S ` +
        prod.cost +
        ` </h4>
                              <small class="text-muted"> ` +
        prod.soldCount +
        ` vendidos</small>
                          </div>
                          <p class="mb-1">` +
        prod.description +
        `</p>
                      </div>
                  </div>
              </a>
              `;
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
});
