var estado=localStorage.getItem("estado");
if (!location.href.includes("login.html") && (estado==null || estado=="false")){
    location.href="login.html";
};

function onSignIn(googleUser) {
      var profile = googleUser.getBasicProfile();
    localStorage.setItem("user", JSON.stringify(profile.getName()));
    localStorage.setItem("estado", "true");
      location.href = "index.html";
    }

    function signOut() {
      var auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut().then(function(){
        console.log("User signed out.");
      });
    }

    function onLoad() {
      gapi.load('auth2', function() {
        gapi.auth2.init();
      });
    }
    
    function desconectar() {
      var estado=localStorage.getItem("pass");
      if (estado==null) {
        localStorage.clear();
        sessionStorage.clear();
        signOut();
      }
      else{
        localStorage.setItem("estado", "false");
      }
      location.href="login.html";
    }