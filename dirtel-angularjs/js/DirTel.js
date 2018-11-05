// JavaScript source code de DirTel
var objDirFun = {};  // objeto que tendra las funciones a ejecutar
var objDirOrg = {};  // Objeto que tendra los datos de DirOrg
var objDirPer = {};  // Objeto que tendra los datos de DirPer

// Carga de la aplicación
function IniciaApp() {
    btnDirectorio();  // Despliega el Tab de Directorio
    // Ejecutara en el host un controller para traer los datos de DirOrg
    var url = "http://localhost/DirTelWebAPI/api/DirOrg";
    // Pone la función que se ejecutara al terminar de leer los datos del url
    loadurls(url, PrepareTheAnsOrg);
    // Ejecutara en el host un controller para traer los datos de DirPer
    url = "http://localhost/DirTelWebAPI/api/DirPer";
    // Pone la función que se ejecutara al terminar de leer los datos del url
    loadurls(url, PrepareTheAnsPer);
    // Inicializa campos 
    document.getElementById("idPer").value = "";
    document.getElementById("orgnombre").value = "";
    InicializaFormaNames(formPer)
    InicializaFormaNames(formOrg)

}

// Despliega el tab de Directorio
function btnDirectorio() {
    // Cambie los background de los botones para indicar que el seleccionado es Directorio
    document.getElementById("botonDir1").style.backgroundColor = "#f1f0ee";
    document.getElementById("botonContac1").style.backgroundColor = "#dddddd";
    document.getElementById("botonOrg1").style.backgroundColor = "#dddddd";
    document.getElementById("botonDir1").className = "selected";
    document.getElementById("botonContac1").className = "";
    document.getElementById("botonOrg1").className = "";
    // Oculte elementos de uso en Contactos
    // Oculte secciones de Organización y Contacto, aparece Directorio
    document.getElementById("secorg").style.display = "none";
    document.getElementById("secper").style.display = "none";
    document.getElementById("sec1").style.display = "block";
}
//  Despliega el tab de Organización
function btnOrganiza() {
    var url = "http://localhost/DirTelWebAPI/api/DirOrg";
    // Cambie los background de los botones para indicar que el seleccionado es Directorio
    document.getElementById("botonOrg1").style.backgroundColor = "#f1f0ee";
    document.getElementById("botonContac1").style.backgroundColor = "#dddddd";
    document.getElementById("botonDir1").style.backgroundColor = "#dddddd";
    document.getElementById("botonOrg1").className = "selected";
    document.getElementById("botonContac1").className = "";
    document.getElementById("botonDir1").className = "";
    // Oculte secciones de Directorio y Contacto, aparece Organización
    document.getElementById("sec1").style.display = "none";
    document.getElementById("secper").style.display = "none";
    document.getElementById("secorg").style.display = "block";

}
//  Despliega el tab de  Contactos
function btnContactos() {
    document.getElementById("botonContac1").style.backgroundColor = "#f1f0ee";
    document.getElementById("botonDir1").style.backgroundColor = "#dddddd";
    document.getElementById("botonOrg1").style.backgroundColor = "#dddddd";
    document.getElementById("botonContac1").className = "selected";
    document.getElementById("botonDir1").className = "";
    document.getElementById("botonOrg1").className = "";
    // Oculte secciones de Directorio y Otganización, aparece Contacto
    document.getElementById("sec1").style.display = "none";
    document.getElementById("secorg").style.display = "none";
    document.getElementById("secper").style.display = "block";
}

// Se ejecuta al seleccionar un contacto de la lista
// Obtiene el idPer guardado en el value de la option y despliega su detalle
function OnChangeListPer() {
    var ixPer = document.getElementById("listper").options.selectedIndex;
    var idPer = document.getElementById("listper").options[ixPer].value;
    for (i = 0; i < objDirPer.Pers.length; i++) {  // busca el idPer que empate
        if (objDirPer.Pers[i].idPer == idPer) {
            ShowDetallePer(i);  // despliega el idPer que empato
            break;
        }
    }

}
// Se ejecuta al seleccionar una organización de la lista
// Obtiene Organiza y despliega todas las personas que pertenecen a esa org.
function onchangeListOrg() {
    var ixOrg = document.getElementById("listorg").options.selectedIndex;
    if (ixOrg > 0) ShowDetalleOrg(ixOrg - 1); // omite detalle en la 1a opción de seleccionar todos
    var Organiza = document.getElementById("listorg").options[ixOrg].value;
    document.getElementById("listper").options.length = 0;  // Limpia lista de per

    /* var x = document.getElementById("listper");
     for (i = x.length - 1; i >= 0; i--) {  // Limpia lista de per
         x.remove(i);
     }  */
    for (i = 0; i < objDirPer.Pers.length; i++) { // Muestra todos los que pertenecen a Organiza
        if (Organiza == objDirPer.Pers[i].Organiza || Organiza == "Todas") {
            var opt = document.createElement('option');
            opt.value = objDirPer.Pers[i].idPer;
            opt.innerHTML = FormaNombre(i);
            var select = document.getElementById("listper");
            select.appendChild(opt);
        }
    }

}

// Botón en el tab de Organizaciones, actualizara información de DirOrg en el host
function btnSendOrg() {
    var x = document.getElementsByName("oporg1"); // Checa opcion seleccionada
    var op = 'E';  // opción inicial es error
    if (x[0].checked) op = x[0].value;
    else if (x[1].checked) op = x[1].value;
    else if (x[2].checked) op = x[2].value;
    if (op == "E") {
        alert("Error, debe seleccionar una Opción");
        return;
    }
    // Checa si todos los elementos de la forma son blancos
    if ((op == "A" || op == "U") && CheckIfAllBlanks("formOrg")) {
        alert("Error, todos los campos están vacios");
        return;
    }

    // Actualiza accion, la cual le indica al programa del host que hacer
    document.getElementById("orgaccion").value = op;
    // Actualizara el host
    url = "http://localhost/DirTelWebAPI/api/DirOrg";
    var postdata = FormapostDataOrg();
    loadurls(url, ProcesaAnsPostOrg, postdata);

}
// Botón en el tab de Contactos, actualizara información de DirPer en el host
function btnSendContactos() {
    var x = document.getElementsByName("opcont");
    var op = 'E';  // opción inicial es error
    if (x[0].checked) op = x[0].value;
    else if (x[1].checked) op = x[1].value;
    else if (x[2].checked) op = x[2].value;
    if (op == "E") {
        alert("Error, debe seleccionar una Opción");
        return;
    }
    // checa que si no hay idPer, solo una alta es valida
    if (document.getElementById("idPer").value == "" && (op != "A")) {
        alert("Error, debe seleccionar un Contacto para eliminarlo o modificarlo");
        return;
    }
    // Checa si todos los elementos de la forma son blancos
    if ((op == "A" || op == "U") && CheckIfAllBlanks("formPer")) {
        alert("Error, todos los campos están vacios");
        return;
    }

    // Actualiza accion, la cual le indica al programa del host que hacer
    document.getElementById("accion").value = op;
    // Actualizara el host
    url = "http://localhost/DirTelWebAPI/api/DirPer";
    var postdata = FormapostDataPer();
    loadurls(url, ProcesaAnsPostPer, postdata);
}

// Funcion que usara ajax para ejecutar las clases que pasaran datos
// Cuando leemos, recibimos los datoss en formato JSON
// Parametros: url = dirección en el server a ejecutar
//             callback = función que se ejecutara al terminar para procesar la respuesta
//             postData = datos a enviar con un POST, en caso de no querer un post, debe omitirse
// Ejemplos: Para llamar con GET:  loadurs(url, callback);
//           Para llamar con POST: loadurs(url, callback, postData); donde postData debe
//             Preparar la info en forma JSON: {"idPer":"1","Organiza":"ORACLE","NomAP":"Aguilar","NomAM":"De la rosa","Nom1":"Oscar","Nom2":""}
function loadurls(url, callback, postData) {
    var xmlhttp = new XMLHttpRequest();
    var metodo = (postData) ? "POST" : "GET";
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            callback(xmlhttp.responseText);
        }
    }
    xmlhttp.open(metodo, url, true);
    if (metodo == "POST") {
        xmlhttp.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        xmlhttp.setRequestHeader("Content-length", postData.length);
        xmlhttp.setRequestHeader("Connection", "close");
    }
    xmlhttp.send(postData);
}

// Procesa los datos de DirOrg que envia el host
// los datos vienen formateados como JSON y aqui se convierten en un objeto JSON
function PrepareTheAnsOrg(responseText) {
    var text = '{"Orgs":' + responseText + '}';
    objDirOrg = JSON.parse(text);
    var select = document.getElementById("listorg");
    select.options.length = 1;  // Limpia lista de org y deja solo Todos
    for (i = 0; i < objDirOrg.Orgs.length; i++) {
        var opt = document.createElement('option');
        opt.value = objDirOrg.Orgs[i].Organiza;
        opt.innerHTML = objDirOrg.Orgs[i].Organiza;
        select.appendChild(opt);
    }
}
// Forma el nombre a partir de los apellidos y nombres individuales
function FormaNombre(i) {
    return objDirPer.Pers[i].NomAP + " " + objDirPer.Pers[i].NomAM + " " + objDirPer.Pers[i].Nom1 + " " + objDirPer.Pers[i].Nom2;
}

// Procesa los datos de DirPer que envia el host
// los datos vienen formateados como JSON y aqui se convierten en un objeto JSON

function PrepareTheAnsPer(responseText) {
    var text = '{"Pers":' + responseText + '}';
    objDirPer = JSON.parse(text);
    var select = document.getElementById("listper");
    select.options.length = 0;  // Limpia lista de per

    for (i = 0; i < objDirPer.Pers.length; i++) {
        var opt = document.createElement('option');
        opt.value = objDirPer.Pers[i].idPer;
        opt.innerHTML = FormaNombre(i);
        select.appendChild(opt);
    }
}

// Despliega el detalle de DirPer, tanto en el Tab de Directorio como en el de Contactos
function ShowDetallePer(ixPer) {
    // Actualiza datos de la seccion de Directorio 
    document.getElementById("nombre").value = FormaNombre(ixPer);
    document.getElementById("org").value = objDirPer.Pers[ixPer].Organiza.trim();
    document.getElementById("tel1").value = objDirPer.Pers[ixPer].TelDirecto.trim();
    document.getElementById("tel2").value = objDirPer.Pers[ixPer].Extension.trim();
    document.getElementById("tel3").value = objDirPer.Pers[ixPer].TelCasa.trim();
    document.getElementById("tel4").value = objDirPer.Pers[ixPer].TelCel.trim();
    document.getElementById("mail").value = objDirPer.Pers[ixPer].eMail.trim();
    document.getElementById("fax").value = objDirPer.Pers[ixPer].FaxDirecto.trim();
    document.getElementById("puesto").value = objDirPer.Pers[ixPer].Puesto.trim();
    document.getElementById("coment").value = objDirPer.Pers[ixPer].Comentarios.trim();
    // Actualiza datos de la seccion de Contactos
    document.getElementById("perorg").value = objDirPer.Pers[ixPer].Organiza.trim();
    document.getElementById("pertel1").value = objDirPer.Pers[ixPer].TelDirecto.trim();
    document.getElementById("pertel2").value = objDirPer.Pers[ixPer].Extension.trim();
    document.getElementById("pertel3").value = objDirPer.Pers[ixPer].TelCasa.trim();
    document.getElementById("pertel4").value = objDirPer.Pers[ixPer].TelCel.trim();
    document.getElementById("permail").value = objDirPer.Pers[ixPer].eMail.trim();
    document.getElementById("perfax").value = objDirPer.Pers[ixPer].FaxDirecto.trim();
    document.getElementById("perpuesto").value = objDirPer.Pers[ixPer].Puesto.trim();
    document.getElementById("percoment").value = objDirPer.Pers[ixPer].Comentarios.trim();

    document.getElementById("perNomAP").value = objDirPer.Pers[ixPer].NomAP.trim();
    document.getElementById("perNomAM").value = objDirPer.Pers[ixPer].NomAM.trim();
    document.getElementById("perNom1").value = objDirPer.Pers[ixPer].Nom1.trim();
    document.getElementById("perNom2").value = objDirPer.Pers[ixPer].Nom2.trim();
    document.getElementById("idPer").value = objDirPer.Pers[ixPer].idPer.trim();
    document.getElementById("accion").value = "C";
}

// Despliega el detalle de DirOrg, en el Tab de Organizaciones
function ShowDetalleOrg(ixOrg) {
    // Actualiza datos de la seccion de Directorio 
    document.getElementById("orgnombre").value = objDirOrg.Orgs[ixOrg].Organiza.trim();
    document.getElementById("orgnombrecompleto").value = objDirOrg.Orgs[ixOrg].Nombre.trim();
    document.getElementById("orgtel1").value = objDirOrg.Orgs[ixOrg].Tel1.trim();
    document.getElementById("orgtel2").value = objDirOrg.Orgs[ixOrg].Tel2.trim();
    document.getElementById("orgfax1").value = objDirOrg.Orgs[ixOrg].Fax1.trim();
    document.getElementById("orgfax2").value = objDirOrg.Orgs[ixOrg].Fax2.trim();
    document.getElementById("orgweb").value = objDirOrg.Orgs[ixOrg].website.trim();
    document.getElementById("orgcalle").value = objDirOrg.Orgs[ixOrg].Calle.trim();
    document.getElementById("orgcolonia").value = objDirOrg.Orgs[ixOrg].Colonia.trim();
    document.getElementById("orgloc").value = objDirOrg.Orgs[ixOrg].Localidad.trim();
    document.getElementById("orgestado").value = objDirOrg.Orgs[ixOrg].Estado.trim();
    document.getElementById("orgcp").value = objDirOrg.Orgs[ixOrg].CP.trim();
    document.getElementById("orgpais").value = objDirOrg.Orgs[ixOrg].Pais.trim();
    document.getElementById("orggiro").value = objDirOrg.Orgs[ixOrg].Giro.trim();
    document.getElementById("orgaccion").value = "C";

}
// Procesa respuesta de actualizar(post) DirPer cargando la info de DirPer para 
// reflejar la actualización
//  var postdata = '{"idPer":"1","Organiza":"ORACLE         ","NomAP":"Aguilar             ","NomAM":"De la rosa          ","Nom1":"Oscar               ","Nom2":"","TelDirecto":"368-0080       ","FaxDirecto":"368-0081       ","Ext":"","TelCasa":"","Celular":"","eMail":"","Puesto":"","Comentarios":""}';
function ProcesaAnsPostPer(responseText) {
    url = "http://localhost/DirTelWebAPI/api/DirPer";
    // ejecuta url y pone la función que se ejecutara al terminar de leer los datos del url
    loadurls(url, PrepareTheAnsPer);

}
// Procesa respuesta de actualizar(post) DirOrg cargando la info de DirOrg para 
// reflejar la actualización
function ProcesaAnsPostOrg(responseText) {
    url = "http://localhost/DirTelWebAPI/api/DirOrg";
    // ejecuta url y pone la función que se ejecutara al terminar de leer los datos del url
    loadurls(url, PrepareTheAnsOrg);

}


// Toma los elementos de una forma que tienen name y los integra a un objeto 
// que luego lo convierte a formato JSON
function FormapostDataPer() {
    var data = {};
    var form = document.getElementById("formPer");
    for (var i = 0, ii = form.length; i < ii; ++i) {
        var input = form[i];
        if (input.name) {
            data[input.name] = input.value;
        }
    }
    return JSON.stringify(data);
}

// Toma los elementos de una forma que tienen name y los integra a un objeto 
// que luego lo convierte a formato JSON
function FormapostDataOrg() {
    var data = {};
    var form = document.getElementById("formOrg");
    for (var i = 0, ii = form.length; i < ii; ++i) {
        var input = form[i];
        if (input.name) {
            data[input.name] = input.value;
        }
    }
    return JSON.stringify(data);
}
// Si todos los elementos con name de una forma son blancos, retorna true.
function CheckIfAllBlanks(formname) {
    var data = {};
    var allblanks = true;
    var form = document.getElementById(formname);
    for (var i = 0, ii = form.length; i < ii; ++i) {
        var input = form[i];
        if (input.name) {
            if (input.value != "" && !(input.name == "idPer" || input.name == "accion"
                 || input.name == "orgaccion"))
            { allblanks = false; return; }
        }
    }
    return allblanks;
}

// Inicializa todos los campos que tengan name en la forma, pues son los que
// se enviaran al host
function InicializaFormaNames(formname) {
    var form = document.getElementById(formname);
    for (var i = 0, ii = form.length; i < ii; ++i) {
        var input = form[i];
        if (input.name) {
            form[i].value = "";
        }
    }
}
