angular.module('wubServices', ['ngResource'])
.factory('Location', ['$resource', function($resource) {
    return $resource('/location/:id', {}, {
      query: {method: 'GET', isArray: false},
  	  save:   {method:'POST'},
      remove: {method: 'DELETE', params: {id:"@id"}}
    });
  }]);