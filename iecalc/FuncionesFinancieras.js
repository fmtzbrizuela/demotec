"use strict";
//  Funciones para el calculo de Inversiones y Prestamos
        // Emplearemos la siguiente notación:
        //	P Cantidad de dinero en el tiempo presente
        //	S Cantidad de dinero en el tiempo futuro
        //	R Una serie uniforme de pagos al final del periodo
        //	i Es la tasa de interes al final del periodo
        //	n Número de periodos

        var objFunFinancieras = {};    // objeto que contendra todas las funciones
        (function(obj) {

	    obj.ValorFinalDeUnaInversion = function( P,  i,  n)
        {
             var S = 0;   // cantidad de dinero futuro a calcular
            S = P * Math.pow((i + 1), n);
            return S;
        }

        obj.ValorActualDeUnValorFuturo = function( S,  i,  n)
        {
             var P = 0;   // cantidad de dinero presente a calcular
            P = S / Math.pow((i + 1), n);
            return P;
        }

        obj.PagosUniformesDeUnPrestamo = function( P,  i,  n)
        {
             var R = 0;   // pago uniforme por periodo a calcular
            R = P * (i * Math.pow((i + 1), n)) / ((Math.pow((i + 1), n)) - 1);
            return R;
        }

        obj.ValorActualDePagosUniformes = function( R,  i,  n)
        {
             var P = 0;   // cantidad de dinero presente a calcular
            P = R * ((Math.pow((i + 1), n)) - 1) / (i * Math.pow((i + 1), n));
            return P;
        }

    })(objFunFinancieras);

