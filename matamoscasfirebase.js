$(document).ready(main);
var authService = firebase.auth();
contadorsegundos=0;
contadormoscamuerta=0;
player=0;
function main(){
  
  firebase.database().ref('Jugador1').on('value',function(datosj1){
    $("#puntero").attr("style","top: "+datosj1.val().Y+"px;left: "+datosj1.val().X+"px");
    if(datosj1.val().estado==1){
      $("#puntero path").attr("stroke","red");
    }else{
      $("#puntero path").attr("stroke","black");
    }
    $("#usuario1img").attr("style","background-image: url("+datosj1.val().foto+");height: 50px; width: 50px;background-size: contain;background-repeat: no-repeat;");
      //console.log(aa.val().puntuacion);
      $("#puntuacionj1").html(datosj1.val().puntuacion);
      
    });
  firebase.database().ref('Jugador2').on('value',function(datosj2){
    $("#puntero2").attr("style","top: "+datosj2.val().Y+"px;left: "+datosj2.val().X+"px");
    if(datosj2.val().estado==1){
      $("#puntero2 path").attr("stroke","red");
    }else{
      $("#puntero2 path").attr("stroke","white");
    }
    $("#usuario2img").attr("style","background-image: url("+datosj2.val().foto+");height: 50px; width: 50px;background-size: contain;background-repeat: no-repeat;");
    $("#puntuacionj2").html(datosj2.val().puntuacion);
  });
  firebase.database().ref('Mosca').on('value',function(datosmosca){
    $("#mosca").attr("style","top: "+datosmosca.val().Y+"px;left: "+datosmosca.val().X+"px"); 
  })

  $("#selva").mousemove(function(){
    if(player==1){
      
        var y=$("#selva").position().top;//guarda la posicion del elemento respecto a la parte superior en y
        var x=$("#selva").position().left;//guarda la posicion del elemento respecto a la parte izquierda en x
        var ancho= $("#puntero").width()/2;
        var alto=$("#puntero").height()/2;
        //console.log("puntero 1");
        x=(event.clientX-x-ancho);
        aaa=(event.clientY-y-alto);
        var updates = {};
        updates['/Jugador1/X'] = x;
        updates['/Jugador1/Y'] = aaa;
        firebase.database().ref().update(updates);
      
    }else if (player==2) {
      
        var y=$("#selva").position().top;//guarda la posicion del elemento respecto a la parte superior en y
        var x=$("#selva").position().left;//guarda la posicion del elemento respecto a la parte izquierda en x
        var ancho= $("#puntero").width()/2;
        var alto=$("#puntero").height()/2;
        console.log("puntero 2");
        x=(event.clientX-x-ancho);
        aaa=(event.clientY-y-alto);
        

        // Write the new post's data simultaneously in the posts list and the user's post list.
        var updates = {};
        updates['/Jugador2/X'] = x;
        updates['/Jugador2/Y'] = aaa;
        firebase.database().ref().update(updates);
      
    }else{
      console.log("error player mousemove")
    } 
    
  })
  $(document).keyup(function(tecla){
    firebase.database().ref('partida').once("value").then(function(datospartida){
      console.log("entra2");
      if(player==1){
        firebase.database().ref('Jugador1').once("value").then(function(datosj1){
          //punteroestado=aa.val().estado;
          console.log("entra")
          if(String.fromCharCode(tecla.which)==" " && datosj1.val().estado==1 && datospartida.val().pararint==0){
            MataMosca();
            console.log("Matarmosca()")
          }
        })
      }else if(player==2) {
        firebase.database().ref('Jugador2').once("value").then(function(datosj2){
          //punteroestado=datosj2.val().estado;
          console.log("entraj2");
          if(String.fromCharCode(tecla.which)==" " && datosj2.val().estado==1 && datospartida.val().pararint==0){
            MataMosca();
            console.log("Matarmosca()")
          }
        })
      }else{
        console.log("error keyup")
      }
      //console.log("condicion: "+(String.fromCharCode(tecla.which)==" " && punteroestado==1&& moscamuerta==0));
    });
  })
  firebase.database().ref('partida').on('value',function(datospartida){
    $("#tiempo").html(datospartida.val().tiempo);
    if(datospartida.val().empezada==1){
        $("#empezar").hide();
        $("#acabar").show();
        $("#fin").hide();
        $("#fin2").hide();
        $("#selva").attr("style","filter: brightness(1);background-image: url('selva.jpg'); height: 500px; background-repeat: no-repeat; background-size: 100% 100%;");
      } else{
      
        $("#empezar").show();
        $("#acabar").hide();

        $("#selva").attr("style","filter: brightness(0.5);background-image: url('selva.jpg'); height: 500px; background-repeat: no-repeat; background-size: 100% 100%;");
        $("#fin").show();
        $("#fin2").show();
        firebase.database().ref('Jugador1').once("value").then(function(datos){
          firebase.database().ref('Jugador2').once("value").then(function(datos2){
            //console.log("<ol><li>Jugador1: "+datos.val().puntuacion+"</li><li>Jugador 2: "+datos2.val().puntuacion+"</li></ol>")
            if(datos.val().puntuacion>datos2.val().puntuacion){
              $("#fin2").html("<h1>Ganador Jugador 1</h1><ol><li>Jugador 1: "+datos.val().puntuacion+"</li><li>Jugador 2: "+datos2.val().puntuacion+"</li></ol>")
            }else{
              if(datos.val().puntuacion<datos2.val().puntuacion){
                $("#fin2").html("<h1>Ganador Jugador 2</h1><ol><li>Jugador 2: "+datos2.val().puntuacion+"</li><li>Jugador 1: "+datos.val().puntuacion+"</li></ol>")
              }else{
                $("#fin2").html("<h1>Empate</h1><ol><li>Jugador 1: "+datos.val().puntuacion+"</li><li>Jugador 2: "+datos2.val().puntuacion+"</li></ol>")
              }
            }
          })
        })
      }
      if(datospartida.val().pararint==1){
      //console.log("muere "+ moscamueve);
        $("#mosca").attr("src","moscamuerta.png");
      }else{
        $("#mosca").attr("src","mosca.svg");
      }
  })

  $("#empezar").click(function(){
    console.log("entra");
    firebase.database().ref('partida').once("value").then(function(aa){
      console.log("entra2");
      if(aa.val().empezada==0){
        console.log("Empieza la partida")
        firebase.database().ref('partida').set({
          empezada: 1,
          tiempo: 60,
          pararint: 0
        })
        crearinterval();
      }
    })
  
    if(player==1){
      firebase.database().ref('Jugador2').once("value").then(function(datos){
        firebase.database().ref('Jugador2').set({
          X:datos.val().X,
          Y:datos.val().Y,
          conectado:datos.val().conectado,
          estado: datos.val().estado,
          foto: datos.val().foto,
          puntuacion: 0,
          host:0
        });
      })
      firebase.database().ref('Jugador1').once("value").then(function(datos){
        firebase.database().ref('Jugador1').set({
          X:datos.val().X,
          Y:datos.val().Y,
          conectado:datos.val().conectado,
          estado: datos.val().estado,
          foto: datos.val().foto,
          puntuacion: 0,
          host:1
        });
      })
    }else{
      if(player==2){
        firebase.database().ref('Jugador2').once("value").then(function(datos){
          firebase.database().ref('Jugador2').set({
            X:datos.val().X,
            Y:datos.val().Y,
            conectado:datos.val().conectado,
            estado: datos.val().estado,
            foto: datos.val().foto,
            puntuacion: 0,
            host:1
          });
        })
        firebase.database().ref('Jugador1').once("value").then(function(datos){
          firebase.database().ref('Jugador1').set({
            X:datos.val().X,
            Y:datos.val().Y,
            conectado:datos.val().conectado,
            estado: datos.val().estado,
            foto: datos.val().foto,
            puntuacion: 0,
            host:0
          });
        })
      }else{
        console.log("Error no player")
      }
    }

  })
}

function crearinterval(){
  intervalmosca = setInterval(function(){
        comprobarencima()

    //tiempo
    contadorsegundos++;
    //console.log(contadorsegundos);
    if(contadorsegundos>201){
      firebase.database().ref('partida').once("value").then(function(datos){
        firebase.database().ref('partida').set({
          pararint:datos.val().pararint,
          tiempo: (datos.val().tiempo-1),
          empezada: datos.val().empezada
        })
      })
      contadorsegundos=0;
    }
    firebase.database().ref('partida').once("value").then(function(datos){
      if(datos.val().tiempo<0){
        clearInterval(intervalmosca);
        firebase.database().ref('partida').set({
          pararint:0,
          tiempo: 0,
          empezada: 0
        })
      } 
    })
    //mosca
    firebase.database().ref('partida').once("value").then(function(datospartida){
      if(datospartida.val().pararint==0){
        firebase.database().ref('Mosca').once("value").then(function(datos){
          tiempoaleatoriocambio=datos.val().tiempocambio;
          c=datos.val().contadorcambio;
          if(c>tiempoaleatoriocambio){
            randomx=(Math.floor(Math.random() * 7 )-3);
            randomy=(Math.floor(Math.random() * 7 )-3);
            XMasvel=datos.val().X+datos.val().velX;
            YMasvel=datos.val().Y+datos.val().velY;
            tiempoaleatoriocambio=Math.floor(Math.random()*100);
            //console.log(XMasvel)
            if($("#selva").width()-$("#mosca").width()>datos.val().X+datos.val().velX && datos.val().X+datos.val().velX >=0){
              XMasvel=datos.val().X+datos.val().velX;
                //console.log(datos.val().X+"+"+datos.val().velX);
              }else{
                XMasvel= datos.val().X+(datos.val().velX*(-1))
                //console.log(XMasvel + "="+datos.val().velX+"*"+"-1")
              }
              if($("#selva").height()-$("#mosca").height()>datos.val().Y+datos.val().velY && datos.val().Y+datos.val().velY >=0){
                YMasvel=datos.val().Y+datos.val().velY;
              }else{
                YMasvel=datos.val().Y+datos.val().velY*-1
              }


              firebase.database().ref('Mosca').set({
                //console.log("pala"+puntero.x);
                muerta: datos.val().muerta,
                X:XMasvel,
                Y:YMasvel,
                velX:randomx,
                velY:randomy,
                tiempocambio:tiempoaleatoriocambio,
                contadorcambio:0
              });
            }else{
            //console.log(datos.val().velX)
            if($("#selva").width()-$("#mosca").width()>datos.val().X+datos.val().velX && datos.val().X+datos.val().velX >=0){
              XMasvel=datos.val().X+datos.val().velX;
                //console.log(datos.val().X+"+"+datos.val().velX);
              }else{
                XMasvel= datos.val().X+(datos.val().velX*(-1))
                //console.log(XMasvel + "="+datos.val().velX+"*"+"-1")
              }
              if($("#selva").height()-$("#mosca").height()>datos.val().Y+datos.val().velY && datos.val().Y+datos.val().velY >=0){
                YMasvel=datos.val().Y+datos.val().velY;
              }else{
                YMasvel=datos.val().Y+datos.val().velY*-1
              }
              velx=datos.val().velX;
              vely=datos.val().velY;
              c++;
              firebase.database().ref('Mosca').set({
                muerta: datos.val().muerta,
                X:XMasvel,
                Y:YMasvel,
                velX:velx,
                velY:vely,
                tiempocambio: tiempoaleatoriocambio,
                contadorcambio:c
              });
            }
          });
      }else{
        contadormoscamuerta++;
        console.log(contadormoscamuerta)
        if(contadormoscamuerta>400){
          firebase.database().ref('partida').set({
            empezada: datospartida.val().empezada,
            tiempo: datospartida.val().tiempo,
            pararint: 0
          })
          contadormoscamuerta=0;
        }
      }
    })
  },5)
}

function comprobarencima(){
  //console.log(mosca.X +"<"+ (puntero.posX+$("#puntero").width()) +"&&"+ mosca.X +">"+ (puntero.posX-$("#puntero").width()));
  firebase.database().ref('Mosca').once("value").then(function(datosmosca){
    firebase.database().ref('Jugador1').once("value").then(function(datosj1){

      if((datosmosca.val().X < (datosj1.val().X+$("#puntero").width()) && datosmosca.val().X > (datosj1.val().X-$("#puntero").width()))&&(datosmosca.val().Y < (datosj1.val().Y+$("#puntero").height()) && datosmosca.val().Y > (datosj1.val().Y-$("#puntero").height()))){

        var updates = {};
        updates['/Jugador1/estado'] = 1;
        
        firebase.database().ref().update(updates);       
      }else{

        var updates = {};
        updates['/Jugador1/estado'] = 0;
        
        firebase.database().ref().update(updates);
      }
    })
    firebase.database().ref('Jugador2').once("value").then(function(datosj3){
      if((datosmosca.val().X < (datosj3.val().X+$("#puntero2").width()) && datosmosca.val().X > (datosj3.val().X-$("#puntero2").width()))&&(datosmosca.val().Y < (datosj3.val().Y+$("#puntero2").height()) && datosmosca.val().Y > (datosj3.val().Y-$("#puntero2").height()))){
        //console.log("entra j2")
        var updates = {};
        updates['/Jugador2/estado'] = 1;
        
        firebase.database().ref().update(updates);      
      }else{

        var updates = {};
        updates['/Jugador2/estado'] = 0;
        
        firebase.database().ref().update(updates);
      }
    })
  })
}

function MataMosca(){
  firebase.database().ref('partida').once("value").then(function(datos){

    var updates = {};
    updates['/partida/pararint'] = 1;
    firebase.database().ref().update(updates);
  })
  if(player==1){
      console.log("entra")
      firebase.database().ref('Jugador1').once("value").then(function(datos2){
        var updates = {};
        updates['/Jugador1/puntuacion'] = datos2.val().puntuacion+1;
        
        firebase.database().ref().update(updates);
        
      })
    }else if(player==2){
        console.log("entra")
        firebase.database().ref('Jugador2').once("value").then(function(datos3){
          var updates = {};
        updates['/Jugador2/puntuacion'] = datos3.val().puntuacion+1;
        
        firebase.database().ref().update(updates);
        })
    }else{
      console.log("error")
    }
    
}
//login google
document.getElementById('botonlogin').addEventListener('click', function() {
  var provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope('email');
  authService.signInWithPopup(provider)
  .then(function(result) {
            // logueado con éxito
            console.log('Hemos autenticado al usuario ',result); 
          })
  .catch(function(error) {
            // Fallo de login
            console.log('Se ha encontrado un error:', error);
          });
})
authService.onAuthStateChanged(function(user) {
  if (user) {
    firebase.database().ref('Jugador1').once("value").then(function(datos){
      if(datos.val().conectado==0){
        firebase.database().ref('Jugador1').set({
          X: 500,
          Y: 500,
          conectado:1,
          estado:0,
          foto: user.photoURL,
          puntuacion: datos.val().puntuacion,
          host: datos.val().host
        })
        //console.log("entra player 1")
        player=1;
        $("#usuario1img ").attr("style","background-image: url("+user.photoURL+");height: 50px; width: 50px ;background-size: contain;background-repeat: no-repeat;");
    }else{
      firebase.database().ref('Jugador2').once("value").then(function(datos){
        if(datos.val().conectado==0){
          firebase.database().ref('Jugador2').set({
            X: 500,
            Y: 500,
            conectado:1,
            estado:0,
            foto:user.photoURL,
            puntuacion: datos.val().puntuacion,
            host: datos.val().host
          });
            //console.log("entra player 2")
            player=2;
            
        }else{
          alert("No hay jugadores libres");
          authService.signOut();
        }
    })
    }

})

    console.log('AuthStateChanged', user)
    //document.getElementById('datosuser').innerHTML = user.photoURL;
    document.getElementById('botonlogin').style.display = 'none';
    document.getElementById('botonlogout').style.display = 'block';
    //console.log(JSON.stringify(user));
} else {
    //document.getElementById('datosuser').innerHTML = 'Sin usuario logueado...'
    document.getElementById('botonlogin').style.display = 'block';
    document.getElementById('botonlogout').style.display = 'none';
}
});

//logout
document.getElementById('botonlogout').addEventListener('click', function() {
  if(player==1){

    player=0          
    firebase.database().ref('Jugador1').set({
      X: 500,
      Y: 500,
      conectado:0,
      estado:0,
      foto: 'usuario.png',
      puntuacion:0,
      host: 0
    })

  }else{

    player=0;          
    firebase.database().ref('Jugador2').set({
      X: 500,
      Y: 500,
      conectado:0,
      estado:0,
      foto: 'usuario.png',
      puntuacion:0,
      host:0
    })

  }
  player=0;
  authService.signOut()
});
document.getElementById('logoutmasivo').addEventListener('click', function() {
  
    firebase.database().ref('Jugador1').set({
      X: 500,
      Y: 500,
      conectado:0,
      estado:0,
      foto: 'usuario.png',
      puntuacion:0,
      host: 0
    })

    firebase.database().ref('Jugador2').set({
      X: 500,
      Y: 500,
      conectado:0,
      estado:0,
      foto: 'usuario.png',
      puntuacion:0,
      host:0
    })

  player=0;
  authService.signOut();
});

document.getElementById('acabar').addEventListener('click', function() {
  console.log("enttra")
  firebase.database().ref('partida').set({
    empezada:0,
    pararint:0,
    tiempo:0
  })
})