(function() {
'use strict';
angular.module('dirtelApp', [])
  .controller('directoryctl', directoryctl)
  .service('GetDirPerService', GetDirPerService);

// Controller directoryctl
  directoryctl.$inject = ['GetDirPerService'];
  function directoryctl(GetDirPerService){
    var dirctl = this;
    dirctl.orgs = GetDirPerService.getOrgs(); // Obtiene la tabla de DirOrg
    dirctl.pers = [];                         // Todos los contactos de una Org
    dirctl.org = {};                          // Organización seleccionada
    dirctl.per = {};                          // Contacto seleccionado
    dirctl.org2up = {};                       // Organización a actualizar
    dirctl.per2up = {};                       // Contacto a actualizar
    dirctl.perAction = '';                    // Acción a ejecutarse en actualización de contactos (A, U, D)
    dirctl.dirtab = true;
    dirctl.pertab = false;
    dirctl.orgtab = false;

    dirctl.selectListOrg = function(indexOrg) {   // Nota indexOrg = -1 significa Todas las Orgs
      if(indexOrg >= 0) {dirctl.org = dirctl.orgs[indexOrg]; }
      dirctl.per = {};                                // Inicializa per por cambio de Organización
      dirctl.pers = GetDirPerService.getPers(indexOrg);
    }
    dirctl.selectListPer = function(indexPer) {
      dirctl.per = dirctl.pers[indexPer];
    }
    dirctl.chtab = function(tab) {
      if (tab == 'dir') {dirctl.dirtab = true;  dirctl.pertab = false; dirctl.orgtab = false;}
      if (tab == 'per') {dirctl.dirtab = false; dirctl.pertab = true; dirctl.orgtab = false; dirctl.per2up = dirctl.per;}
      if (tab == 'org') {dirctl.dirtab = false; dirctl.pertab = false; dirctl.orgtab = true; dirctl.org2up = dirctl.org;}
    }
    dirctl.perUpdate = function() {
      
    }
  }
// End Controller directoryctl

// Service GetDirPerService
  function GetDirPerService() {
    var service = this;
    var orgs = [];
    var pers = [];

    service.getOrgs = function() {
      orgs = getDirOrg();
      pers = getDirPer();
      return orgs;
    }
    service.getPers = function(indexOrg) {  // Note indexOrg = -1 means all rows
      var matchPers = [];
      var selectedOrg = {};
      if (indexOrg >= 0) {selectedOrg = orgs[indexOrg]; }
      for (var i = 0; i < pers.length; i++) {
        if(indexOrg < 0 || selectedOrg.Organiza == pers[i].Organiza) {
          var per = pers[i];
            per.fullName = per.Nom1 + ' ' + per.Nom2 + ' ' + per.NomAP + ' ' + per.NomAM;
          matchPers.push(per);
        }
      }
      return matchPers;
    }
  }
// End Service GetDirPerService
})();
