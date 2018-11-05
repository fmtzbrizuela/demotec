(function (global) {

// Set up a namespace for our utility
var ajaxUtils = {};


// Returns an HTTP request object
function getRequestObject() {
  if (global.XMLHttpRequest) {
    return (new XMLHttpRequest());
  } 
  else if (global.ActiveXObject) {
    // For very old IE browsers (optional)
    return (new ActiveXObject("Microsoft.XMLHTTP"));
  } 
  else {
    global.alert("Ajax is not supported!");
    return(null); 
  }
}


// Makes an Ajax GET request to 'requestUrl'
ajaxUtils.sendGetRequest = 
  function(requestUrl, responseHandler, isJsonResponse) {
    var request = getRequestObject();
    request.onreadystatechange = 
      function() { 
        handleResponse(request, 
                       responseHandler,
                       isJsonResponse); 
      };
    request.open("GET", requestUrl, true);
    request.send(null); // for POST only
  };


// Only calls user provided 'responseHandler'
// function if response is ready
// and not an error
function handleResponse(request,
                        responseHandler,
                        isJsonResponse) {
  if ((request.readyState == 4) &&
     (request.status == 200)) {

    // Default to isJsonResponse = true
    if (isJsonResponse == undefined) {
      isJsonResponse = true;
    }

    if (isJsonResponse) {
      responseHandler(JSON.parse(request.responseText));
    }
    else {
      responseHandler(request.responseText);
    }
  }
}


// Expose utility to the global object
global.$ajaxUtils = ajaxUtils;


})(window);


// Funcion que usara ajax para ejecutar las clases que pasaran datos
// Cuando leemos, recibimos los datoss en formato JSON
// Parametros: url = dirección en el server a ejecutar
//             callback = función que se ejecutara al terminar para procesar la respuesta
//             postData = datos a enviar con un POST, en caso de no querer un post, debe omitirse
// Ejemplos: Para llamar con GET:  loadurs(url, callback);
//				Si llamamos con GET y queremos enviar parametros, estos deben ir en el url en la forma:
//				url+?par1=val1&par2=val2  Ej: "demo_get2.asp?fname=Henry&lname=Ford"
//           Para llamar con POST: loadurs(url, callback, postData); donde postData debe estar en formato JSON
//				Ej:  {"idPer":"1","Organiza":"ORACLE","NomAP":"Aguilar","NomAM":"De la rosa","Nom1":"Oscar","Nom2":""}
//				Nota: si queremos mandar texto, o XML hay que cambiar el Content-type en el setRequestHeader.
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

