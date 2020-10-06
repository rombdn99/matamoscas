var authService = firebase.auth();


// manejador de eventos para loguearse
document.getElementById('botonlogin').addEventListener('click', function() {
  var provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope('email');
  authService.signInWithPopup(provider)
        .then(function(result) {
            // logueado con éxito
            console.log('Hemos autenticado al usuario ', result.user);

        })
        .catch(function(error) {
            // Fallo de login
            console.log('Se ha encontrado un error:', error);
        });
})


//manejador de eventos para cerrar sesión (logout)
document.getElementById('botonlogout').addEventListener('click', function() {
  authService.signOut()
})


// manejador de eventos para los cambios del estado de autenticación
authService.onAuthStateChanged(function(user) {
  if (user) {
    console.log('AuthStateChanged', user)
    //document.getElementById('datosuser').innerHTML = JSON.stringify(user);
    document.getElementById('botonlogin').style.display = 'none';
    document.getElementById('botonlogout').style.display = 'block';
    console.log(JSON.stringify(user));
  } else {
    //document.getElementById('datosuser').innerHTML = 'Sin usuario logueado...'
    document.getElementById('botonlogin').style.display = 'block';
    document.getElementById('botonlogout').style.display = 'none';
  }
});