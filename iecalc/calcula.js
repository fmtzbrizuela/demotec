
        "use strict";
        // Variables empleadas
        //	P Cantidad de dinero en el tiempo presente
        //	S Cantidad de dinero en el tiempo futuro
        //	R Una serie uniforme de pagos al final del periodo
        //	i Es la tasa de interes al final del periodo
        //	n Número de periodos

        var objCalcula = {};
        objCalcula.P = 0;
        objCalcula.S = 0;
        objCalcula.R = 0;
        objCalcula.i = 0;
        objCalcula.n = 0;
        objCalcula.filasdeBalance = 0;

        objCalcula.ingEco = objFunFinancieras;
        
        (function(objCalcula) {

        

        objCalcula.setInvOprestamo = function()
        {
            if (document.getElementById("rbinversion").checked == true) objCalcula.SetInversion();
            else if (document.getElementById("rbprestamo").checked == true) objCalcula.SetPrestamo();
        }

        objCalcula.btncalcular_click = function()
        {
            document.getElementById("txmensajeerror").value = "";
            if (document.getElementById("rbinversion").checked == true) objCalcula.CalculeInversion();
            else if (document.getElementById("rbprestamo").checked == true) objCalcula.CalculePrestamo();
        }

        objCalcula.SetInversion = function()
        {
            document.getElementById("lbvalinicio").innerHTML = 'Monto inicial($): ';
            document.getElementById("lbvalfinal").innerHTML = 'Monto final($): ';
            document.getElementById("btdetalle").style.visibility = "hidden";
            document.getElementById("containertable").style.display = "none";
        }

        objCalcula.SetPrestamo = function()
        {
            document.getElementById("lbvalinicio").innerHTML = 'Monto prestamo($): ';
            document.getElementById("lbvalfinal").innerHTML = 'Pago por periodo($): ';
            document.getElementById("btdetalle").style.visibility = "visible";
            document.getElementById("containertable").style.display = "inline";
        }

        objCalcula.CalculeInversion = function()
        {
            objCalcula.getValues();
            var n = objCalcula.n;
            var i = objCalcula.i;
            var P = objCalcula.P;
            if (n > 0 && i > 0 && P > 0)
            {
                
                var S = objCalcula.ingEco.ValorFinalDeUnaInversion(P, i, n);
                objCalcula.S = S;
                document.getElementById("txvalfinal").value = objCalcula.formatMoney(S, 2, ',', '.');
            }
        }

        objCalcula.CalculePrestamo = function()
        {
            objCalcula.getValues();
            var n = objCalcula.n;
            var i = objCalcula.i;
            var P = objCalcula.P;
            if (n > 0 && i > 0 && P > 0)
            {
               var R = objCalcula.ingEco.PagosUniformesDeUnPrestamo(P, i, n);
               objCalcula.R = R;
                document.getElementById("txvalfinal").value = objCalcula.formatMoney(R, 2, ',', '.');
            }
        }

        objCalcula.getValues = function() {
            objCalcula.n = objCalcula.GetPeriodos();
            objCalcula.i = objCalcula.GetInteres();
            objCalcula.P = objCalcula.GetPresente();
        }

        objCalcula.GetPeriodos = function()
        {
            try
            {
                let contenido = document.getElementById("txperiodos").value;
                if (isNaN(contenido) || contenido == "") throw "No un número";
                let n = Number(contenido);
                if (n <= 0) document.getElementById("txmensajeerror").value = "Error. Periodo debe ser mayor a cero.";
                return n;
            }
            catch (err)
            {
                document.getElementById("txmensajeerror").value = "Error. Periodo debe ser numérico.";
                let n = -1;
                return n;
            }
        }

        objCalcula.GetInteres = function()
        {
            try
            {
                let contenido = document.getElementById("txinteresanual").value;
                if (isNaN(contenido) || contenido == "") throw "No un número";
                let i = Number(contenido);
                if (i <= 0) document.getElementById("txmensajeerror").value = "Error. Interes debe ser mayor a cero.";
                return (i / 100.0) / 12.0;
            }
            catch (err)
            {
                document.getElementById("txmensajeerror").value = "Error. Interes debe ser numérico.";
                let i = -1;
                return i;
            }
        }

        objCalcula.GetPresente = function()
        {
            try
            {
                let contenido = document.getElementById("txvalinicio").value;
                if (isNaN(contenido) || contenido == "") throw "No un número";
                let P = Number(contenido);
                if (P <= 0) document.getElementById("txmensajeerror").value = "Error. Monto debe ser mayor a cero.";
                return P;
            }
            catch (err)
            {
                document.getElementById("txmensajeerror").value = "Error. Monto debe ser numérico.";
                let P = -1;
                return P;
            }
        }

        objCalcula.btndetalle_click = function()
        {
            document.getElementById("containertable").style.display = "inline";
            if (objCalcula.filasdeBalance > 0 ) objCalcula.eliminaFilasBalance(objCalcula.filasdeBalance);
            var Rows = objCalcula.CalcBalance(objCalcula.P, objCalcula.R, objCalcula.i, objCalcula.n) ;
            
            var table = document.getElementById("tabladetalle");
            for (var i = 0; i < Rows.length; i++) {
                var row = Rows[i];
                var tableRow = table.insertRow(i+1);
                for (let k = 0; k < 5; k++) {
                    tableRow.insertCell(k).innerHTML = row[k];
                }
            }
            objCalcula.filasdeBalance = i;
        }

        // Calcula el balance de los pagos

        objCalcula.CalcBalance = function(P, R, i, n)
        {
            var runBalance = P;
            var PagoXperiodo = R;
            var Interes = i;
            var Periodos = n;
            var sumaPrincipal = 0;
            var sumaPagos = 0;
            var sumaInteres = 0;
            var pagoInteres = 0;
            var pagoPrincipal = 0;
            var Rows = [];

            var rowx = [ "0", objCalcula.formatMoney(runBalance, 2, ',', '.'), "", "", "" ];
            Rows.push(rowx);
            for (var k = 1; k <= Periodos; k++) {
                pagoInteres = runBalance * Interes;
                pagoPrincipal = PagoXperiodo - pagoInteres;
                runBalance = runBalance - pagoPrincipal;
                sumaPrincipal += pagoPrincipal;
                sumaInteres += pagoInteres;
                sumaPagos += PagoXperiodo;
                var rowz = [ k.toString(), objCalcula.formatMoney(runBalance, 2, ',', '.'),
                     objCalcula.formatMoney(pagoPrincipal, 2, ',', '.'), objCalcula.formatMoney(pagoInteres, 2, ',', '.'), 
                     objCalcula.formatMoney(PagoXperiodo, 2, ',', '.') ];
                Rows.push(rowz) ;
            }
            var rowf = [ "Total", "", objCalcula.formatMoney(sumaPrincipal, 2, ',', '.'), 
                objCalcula.formatMoney(sumaInteres, 2, ',', '.'), objCalcula.formatMoney(sumaPagos, 2, ',', '.') ];
            Rows.push(rowf);
            return Rows;
        }

        objCalcula.eliminaFilasBalance = function(filas)
        {
            var table = document.getElementById("tabladetalle");
            for (let i = 0; i < filas; i++) {
                var tableRow = table.deleteRow(-1);  // Elimina la última fila con el -1
            }
        }

        // Tomada de: https://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-dollars-currency-string-in-javascript

        objCalcula.formatMoney = function(num, decPlaces, thouSeparator, decSeparator) 
        {
                var n = num;
                decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces;
                decSeparator = decSeparator == undefined ? "." : decSeparator;
                thouSeparator = thouSeparator == undefined ? "," : thouSeparator;
                var sign = n < 0 ? "-" : "";
                var i = parseInt(n = Math.abs(+n || 0).toFixed(decPlaces)) + "";
                var j = (j = i.length) > 3 ? j % 3 : 0;
            return sign + (j ? i.substr(0, j) + thouSeparator : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thouSeparator) + (decPlaces ? decSeparator + Math.abs(n - i).toFixed(decPlaces).slice(2) : "");
        };

    })(objCalcula);