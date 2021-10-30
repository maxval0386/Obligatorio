// Guarda el usuario conectado para identificar los datos del perfil a cargar
var usuarioConectado=localStorage.getItem("user")

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.

document.addEventListener("DOMContentLoaded", function (e) {
  // Guarda los datos en el localStorage
  document
    .getElementById("profile-info")
    .addEventListener("submit", function (e) {
      // Esto se debe realizar para prevenir que el formulario se envíe (comportamiento por defecto del navegador para que no recargue la pagina al mandar el formulario)
      e.preventDefault();

    //   Concateno los datos del perfil para guardarlo acorde al usuario conectado
      localStorage.setItem(
        "perfilUsuario-" + usuarioConectado,
        // Convierto en un stringify de JSON los datos del perfil (para realizar un diccionario)
        JSON.stringify({
          img: document.getElementById("imgUsuario").src,
          nombre: document.getElementById("nombreUsuario").value,
          apellido: document.getElementById("apellidoUsuario").value,
          edad: document.getElementById("edadUsuario").value,
          e_mail: document.getElementById("e-mailUsuario").value,
          cel: document.getElementById("celUsuario").value,
        })
      );
    //   Cambio de estilo del boton guardar perfil para identificar que los cambios se realizaron
      guardarPerfil.classList.remove("btn-primary");
      guardarPerfil.classList.add("btn-success");
      guardarPerfil.value = "Perfil guardado";
        
    //   Devuelvo el valor del boton al formato original luego de 2 seg
      setTimeout(function () {
        guardarPerfil.classList.remove("btn-success");
        guardarPerfil.classList.add("btn-primary");
        guardarPerfil.value = "Guardar perfil";
      }, 2000);

      return false;
    });
// Cargo los datos guardados en el localStorage para que aparezcan en el formulario
  let perfilUsuario = localStorage.getItem("perfilUsuario-" + usuarioConectado);
  if (perfilUsuario) {
    let perfil = JSON.parse(perfilUsuario);
    if (perfil.img != "") {
      document.getElementById("imgUsuario").src = perfil.img;
    }
    document.getElementById("nombreUsuario").value = perfil.nombre;
    document.getElementById("apellidoUsuario").value = perfil.apellido;
    document.getElementById("edadUsuario").value = perfil.edad;
    document.getElementById("e-mailUsuario").value = perfil.e_mail;
    document.getElementById("celUsuario").value = perfil.cel;
  }
  
//   Despliga la nueva imagen cargada (acorde URL) luego de clickear guardar imagen
  document.getElementById("setImg").addEventListener("click", function(){
      var imagen = document.getElementById("urlImg").value;
      document.getElementById("imgUsuario").src = imagen;
      $("#imgUserModal").modal("hide");
  })
});
