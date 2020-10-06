// Your web app's Firebase configuration
  
$(document).ready(main);

function main(){
	//firebase.database().ref('Mosca/Y').once('value') ver valor
	//firebase.database().ref('Mosca/Y').sey(600) cambiar valor a 600
	/*firebase.database().ref('Mosca/X').once('600').then(function(snapshot) {
		MoscaX=snapshot.val()
	});*/
	

	var tiempo=60
	puntero=new Pala(0,0);
	mosca= new mosca(0,0,1,1)
	
	$("#selva").mousemove(puntero.mover);
	$("#empezar").click(function(){
		$("#selva").attr("style","background-image: url('selva.jpg'); height: 800px; background-repeat: no-repeat; background-size: 100% 100%;")
		$("#empezar").hide();
		temporizador = window.setInterval(function(){
 			tiempo=temps(tiempo, temporizador);
 		}, 1000);
		crearintervalomosca();
		
		tiempo = 60
		
		$(document).keyup(function(tecla){
			console.log(mosca.muerta);
			if(String.fromCharCode(tecla.which)==" " && puntero.estado && !mosca.muerta){
				MataMosca();
			}
		});
	})
	console.log(mosca.X + " " + mosca.Y)
}
c=0;
tiempoaleatoriocambio=100;
puntuacion=0;
function mosca(X,Y,velX,velY){
	this.X=X;
	this.Y=Y;
	this.velX=velX;
	this.velY=velY;
	this.muerta=false;
	this.mover= function(){

		if(c>tiempoaleatoriocambio){
		this.velX= Math.floor(Math.random() * 6 )-3;
		this.velY= Math.floor(Math.random() * 6 )-3;
		c=0;
		tiempoaleatoriocambio=Math.floor(Math.random()*100)
		}
		
		if($("#selva").width()-$("#mosca").width()>this.X+this.velX && this.X+this.velX >=0){
			this.X=this.X+this.velX;
		}else{
			this.velX=this.velX*-1
		}
		if($("#selva").height()-$("#mosca").height()>this.Y+this.velY && this.Y+this.velY >=0){
			this.Y=this.Y+this.velY;
		}else{
			this.velY=this.velY*-1
		}
		c++;
		$("#mosca").attr("style", "top: "+this.Y+"px; left:"+this.X+"px;");
		//console.log("pala"+puntero.x);
	}
}
function Pala(X,Y){
	this.posX=X;
	this.posY=Y;
	this.sobre=false;
	this.mover= function(){
		var y=$(this).position().top//guarda la posicion del elemento respecto a la parte superior en y
		var x=$(this).position().left;//guarda la posicion del elemento respecto a la parte izquierda en x
		var ancho= $("#puntero").width()/2;
		var alto=$("#puntero").height()/2;
		$("#puntero").attr("style","top: "+(event.clientY-y-alto)+"px;left: "+(event.clientX-x-ancho)+"px");
		cambiarx((event.clientX-x-ancho),(event.clientY-y-alto));

	}
}
function cambiarx(X,Y){
	puntero.posX=X;
	puntero.posY=Y;
}
function cambiarrojo(){
	
	$("#puntero path").attr("stroke","red");
}
function cambiarnegro(){
	//console.log("entrar  negro");
	$("#puntero path").attr("stroke","black")
}
function MataMosca(){
	mosca.muerta=true
	puntuacion=puntuacion+1;
	pararintervalomosca();
	$("#puntuacion").html(puntuacion);
	$("#mosca").attr("src","moscamuerta.png");
	setTimeout(function(){
		console.log("moscamueve") 
		$("#mosca").attr("src","mosca.svg");
		crearintervalomosca();
		mosca.muerta=false
	}, 2000);
}

function temps(tiempo, temporizador){
	
	tiempo=tiempo-1;
	console.log(tiempo)
	if (tiempo<1) {
		console.log("entra");
		clearInterval(temporizador);
		clearInterval(moscamueve);
		$("#empezar").show();
		$("#fin").show()
		$("#selva").attr("style","filter: brightness(0.5);background-image: url('selva.jpg'); height: 800px; background-repeat: no-repeat; background-size: 100% 100%;")
	}
	$("#tiempo").html(tiempo)
	return tiempo;
}

function crearintervalomosca(){

	moscamueve = window.setInterval(
		function(){

			mosca.mover();
			comprobarencima(mosca.x,puntero.x);
		}
		, 5);
}
function pararintervalomosca(){
	clearInterval(moscamueve);
}
function comprobarencima(){
	//console.log(mosca.X +"<"+ (puntero.posX+$("#puntero").width()) +"&&"+ mosca.X +">"+ (puntero.posX-$("#puntero").width()));
	if((mosca.X < (puntero.posX+$("#puntero").width()) && mosca.X > (puntero.posX-$("#puntero").width()))&&(mosca.Y < (puntero.posY+$("#puntero").height()) && mosca.Y > (puntero.posY-$("#puntero").height()))){
		cambiarrojo();
		puntero.estado=true;
	}else{
		cambiarnegro();
		puntero.estado=false;
	}
	

}