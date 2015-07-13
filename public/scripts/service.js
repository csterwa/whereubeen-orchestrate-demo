angular.module('wubServices', ['ngResource'])
.factory('Location', ['$resource', function($resource) {
    return $resource('/location/:id', {}, {
      query: {method: 'GET', isArray: false},
  	  save:   {method:'POST'},
      remove: {method: 'DELETE', params: {id:"@id"}}
    });
  }])
.factory('People', ['$resource', function($resource) {
    return $resource('/person/:id', {}, {
      get: {method:'GET'},
  	  query: {method: 'GET', isArray: false},
  	  save: {method:'POST'},
      remove: {method: 'DELETE', params: {id:"@id"}}
    });
  }]);