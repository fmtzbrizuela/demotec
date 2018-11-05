"use strict"

    // Script para llevar el registro de las partidas del juego de cartas llamado Continental
    // El juego puede hacerse con apuestas, en la modalidad de pozo, donde se pone un fondo
    // y se lo lleva el que gane la partida (el que sume menos puntos de los 7 juegos de la
    // partida), ademas se puede apostar en cada juego, que lo ganara el que gane el juego.
 var programaLogJuego = null;   
 function iniciaPrograma() {
    programaLogJuego = new LogDeJuegos();
    programaLogJuego.IniciaJuego();
 }   

 class LogDeJuegos {

    constructor() {
        // Objetos que forman el entorno de variables globales de la clase
        this.objJuego = { numPlayers: 0,         // Num. de jugadores
            pozoXplayer: 0,         // $ a depositar en el pozo por jugador
            costoXjuego: 0,         // $ a apostar en cada juego
            filasDejugadores: 8,    // filas en la matrix desplegada (max. de jugadores)
            fhPartido: "",          // fecha-hora del partido
            historia: [] };         // Historial de partidas jugadas
            }
 


		// Llamada por el botón Inicia y al cargarse. Limpia celdas y toma la fecha y hora de la nueva partida.
    IniciaJuego() {
        for (let np = 1; np <= this.objJuego.filasDejugadores; np++) {
            for (let i = 1; i < 10; i++) {
                let ix = "f" + np + "c" + i;
                document.getElementById(ix).value = "";
            }
        }
        this.objJuego.fhPartido = this.GetFechaHoraPartida();
        document.getElementById("fechahora").innerHTML =  this.objJuego.fhPartido.substring(0,4) + "-" + this.objJuego.fhPartido.substring(4,6) + "-" +
                        this.objJuego.fhPartido.substring(6,8) + " " + this.objJuego.fhPartido.substring(8,10) + ":" +
                        this.objJuego.fhPartido.substring(10);
        this.LeeHistorico();		// El historico contiene los nombres de los juegos anteriores
        this.DespliegaHistorico();
        document.getElementById("btotales").disabled=false;
    }
    
    // Llamada por el botón Totales, calcula los totales en puntos y en pesos, y si es el último juego de la partida
	// checa quien gano para darle el pozo.
    CalculaTotales() {
        var numjugadores = 0;
        for (let np = 1; np <= this.objJuego.filasDejugadores; np++) {		// cuenta los campos de nombre
            if (document.getElementById("f" + np + "c0").value == "") break; 
            numjugadores++;
        }
        this.getDatosGenerales();
        this.objJuego.numPlayers = numjugadores;
        if (numjugadores == 0) return;
        
        var totalPlayerEnPuntos = 0;
        var totalPlayerEnPesos = 0;
        var elemento = 0;
        for (let np = 1; np <= this.objJuego.numPlayers; np++) {
            totalPlayerEnPuntos = 0;
            totalPlayerEnPesos = 0;
            for (let i = 1; i < 8; i++) {
                let ix = "f" + np + "c" + i;
                if (document.getElementById(ix).value == "") elemento = 0;
                else elemento = parseInt(document.getElementById(ix).value);
                    totalPlayerEnPuntos += elemento;
                if (document.getElementById(ix).value != "") {
                    if (elemento == 0) totalPlayerEnPesos += this.objJuego.numPlayers * this.objJuego.costoXjuego;
                    totalPlayerEnPesos -= this.objJuego.costoXjuego;
                }
            }
            document.getElementById("f" + np + "c8").value = totalPlayerEnPuntos.toString();
            document.getElementById("f" + np + "c9").value = totalPlayerEnPesos.toString();
        }
        this.BuscaQuienGano();
    }
	// Guarda los datos de la primera linea de inputs del usuario
    getDatosGenerales() {
        this.objJuego.pozoXplayer = (document.getElementById("ipozo").value != "") ? parseInt(document.getElementById("ipozo").value) : 0;
        this.objJuego.costoXjuego = (document.getElementById("ipartida").value != "") ? parseInt(document.getElementById("ipartida").value) : 0;

    }

	// Forma la fecha de la partida en el formato yyyymmddhhmm
    GetFechaHoraPartida() {
        var fecha = new Date();
        var dia = fecha.getDate() < 10 ? "0" + fecha.getDate().toString() : fecha.getDate().toString();
        var mm = fecha.getMonth() + 1;
        var mes = mm < 10 ? "0" + mm.toString() : mm.toString();
        var anio = fecha.getFullYear();
        var hora = fecha.getHours() < 10 ? "0" + fecha.getHours().toString() : fecha.getHours().toString();
        var minutos = fecha.getMinutes() < 10 ? "0" + fecha.getMinutes().toString() : fecha.getMinutes().toString();
        var fechaPartida = anio + mes + dia + hora + minutos;
        return fechaPartida;
    }
	// Checa si es el último juego de la partida, si es así, determina el ganador como el que tiene menos puntos,
	// distribuye el contenido del pozo graba el juego con el nombre Fyyyymmddhhmm
    BuscaQuienGano() {
        var minval = 99999;
        var minpos = 0;
        var elemento = 0;
        for (let np = 1; np <= this.objJuego.numPlayers; np++) {		// checa que último juego (con 12 cartas) se haya efectuado
            if (document.getElementById("f" + np + "c7").value == "") return; // todavia no se efectua el último juego
        }
        for (let np = 1; np <= this.objJuego.numPlayers; np++) {
            elemento = parseInt(document.getElementById("f" + np + "c8").value);
            if (elemento < minval) { minval = elemento; minpos = np; }
        }
        for (let np = 1; np <= this.objJuego.numPlayers; np++) {
            elemento = parseInt(document.getElementById("f" + np + "c9").value);
            elemento -= this.objJuego.pozoXplayer;						// a todos se les quita el costo del pozo
            if (np == minpos) elemento += this.objJuego.numPlayers * this.objJuego.pozoXplayer;		// al ganador se le da el pozo
            document.getElementById("f" + np + "c9").value = elemento.toString();
        }
        this.FormaStringParaCookie();  // forma el string y lo graba

    }

	// Forma el string y graba el resultado del juego. El string lo arma como key: valor, separados por comas.
	// Guarda el número de jugadores, el costo y el pozo, ademas del contenido de las celdas de cada jugador.
	// La partida la guarda como Fyyyymmddhhmm. También adiciona el nombre de la partida al historico y graba el historico.
    FormaStringParaCookie() {
        var Q = "\"";
        var stringForCookie = '\"np\":' + Q + this.objJuego.numPlayers.toString() + Q;
        stringForCookie += ',\"pozo\":' + Q + this.objJuego.pozoXplayer.toString() + Q;
        stringForCookie += ',\"costo\":' + Q + this.objJuego.costoXjuego.toString() + Q;
        for (let np = 1; np <= this.objJuego.numPlayers; np++) {
            for (let i = 0; i < 10; i++) {
                let ix = "f" + np + "c" + i;
                stringForCookie += ',\"' + ix + '\":' + Q + document.getElementById(ix).value + Q;
            }
        }
        var fname = "F" + this.objJuego.fhPartido;
        if (typeof (Storage) !== "undefined") {
            this.writeStorage(fname, stringForCookie);
        } else {
            alert("localStorage no soportado"); return;
        }
        if (this.objJuego.historia.length > 0) {
            for (let i = 0; i < this.objJuego.historia.length; i++) {
                if (this.objJuego.historia[i] == fname) return; // OK, ya esta dado de alta
            }
        }
        this.objJuego.historia.push(fname);
        this.GrabaHistorico();
    }

    DespliegaPartida(partida) {
        var objAlterno = {};
        var leeS = this.readStorage(this.objJuego.historia[partida]);
        objAlterno = JSON.parse("{" + leeS + "}");
        for (let np = 1; np <= objAlterno.np; np++) {
            for (let i = 0; i < 10; i++) {
                let ix = "f" + np + "c" + i;
                document.getElementById(ix).value = objAlterno[ix];
            }
        }
        document.getElementById("btotales").disabled=true;	// deshabilita el botón de totales hasta que se presione Inicio
    }

    LeeHistorico() {
        var str = this.readStorage("Historico");
        if (str != null && str.length > 0) {
            var arr = str.split(",");
            arr.sort();
            arr.reverse();
            this.objJuego.historia = arr;
        }
    }

    DespliegaHistorico() {
        var str = "";
        for (var i = 0; i < this.objJuego.historia.length; i++) {
            var strTitulo = this.objJuego.historia[i].substring(1,5) + "-" + this.objJuego.historia[i].substring(5,7) + "-" +
                            this.objJuego.historia[i].substring(7,9) + " " + this.objJuego.historia[i].substring(9,11) + ":" +
                            this.objJuego.historia[i].substring(11);
            str += '<p class="historia" onclick=\"programaLogJuego.DespliegaPartida(' + i.toString() + ')\">' + strTitulo + '</p>';
        }
        document.getElementById("listhistoria").innerHTML = str;
    }

// El registro Historico consiste de los nombres de todas las partidas
    GrabaHistorico() {
        var fname = "Historico";
        var str = this.objJuego.historia.toString();
        if (typeof (Storage) !== "undefined") {
            this.writeStorage(fname, str);	
            console.log(str);
        } else {
            alert("localStorage no soportado"); return;
        }
    }

    isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    writeStorage(name, value) {
        console.log('writeStorage: name: ' + name + ' value: ' + value);
        window.localStorage.setItem(name, value);	
    }

    readStorage(name) {
        console.log('readStorage: name: ' + name + ' value: ' + window.localStorage.getItem(name));
        return window.localStorage.getItem(name);
    }

// Funciones copiadas de: http://www.quirksmode.org/js/cookies.html
/*
function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}
*/
}
