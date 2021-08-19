//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
  var user=localStorage.getItem("user")
  
  if (user!=null){
    document.getElementById("useremail").value=user
    document.getElementById("recordar").checked=true
    document.getElementById("userpassword").value=localStorage.getItem("pass")
  }
})

  function boton(){

    if(document.getElementById("recordar").checked){
      localStorage.setItem("user", document.getElementById("useremail").value);
      localStorage.setItem("pass", document.getElementById("userpassword").value);
    }
    else {
      localStorage.clear();
    }
    localStorage.setItem("estado", "true");
  } 