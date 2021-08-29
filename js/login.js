//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.

//Gestiona las credenciaes guardadas anteriormente (en otro logueo) en caso de haberlas 
document.addEventListener("DOMContentLoaded", function(e){
  var user=localStorage.getItem("user")
  
  //SI existe el usuario se les asigna el valor a los campos correspondientes
  if (user!=null){
    document.getElementById("useremail").value=user
    document.getElementById("recordar").checked=true
    document.getElementById("userpassword").value=localStorage.getItem("pass")
  }
})

  //Es la funcion para guardar el estado del usuario y, en caso de especificarlo(tildar el checkbox), las credenciales de acceso 
  function boton(){

    if(document.getElementById("recordar").checked){
      localStorage.setItem("pass", document.getElementById("userpassword").value);
    }
    else {
      localStorage.clear();
    }
    // Crea la "variable" para indicar que hay un usuario guardado
    localStorage.setItem("estado", "true");
    localStorage.setItem("user", document.getElementById("useremail").value); 
  }