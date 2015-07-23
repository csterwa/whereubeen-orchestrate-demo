angular.module('wubApp', ['ui.bootstrap', 'uiGmapgoogle-maps', 'wubServices'])
  .config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
	    //    key: 'your api key',
	    v: '3.17',
	    libraries: 'weather,geometry,visualization'
	})
  })
  .controller('LocationController', function($scope, $http, uiGmapGoogleMapApi, Location) {
  	var locationCtl = this;

  	$scope.map = { center: { latitude: 47.610377, longitude: -122.2006786 }, zoom: 6 };
  	$scope.locations = [];

	locationCtl._updateLocations = function() {
		Location.query(function(data) {
			console.log('API locations', data.body.results);
			locationCtl._setLocations(data.body.results);
		});
	};

	locationCtl._setLocations = function(data) {
		var retrievedLocations = [];
		_.forEach(data, function(locationResult) {
			retrievedLocations.push({
				id: locationResult.path.key,
				name: locationResult.value.name,
				location: locationResult.value.location
			});
		});
		console.log('locations in scope:', retrievedLocations);
		$scope.locations = retrievedLocations;
	};

	$scope.deleteLocation = function(id) {
		console.log('delete location:', id);
		Location.delete({id: id}, 
			function(result) {
				locationCtl._updateLocations();
			}, function(err) {
				console.log('error:', err);
			}
		);
	};

	$scope.findLocation = function(name) {
		$scope.locationLatitude = undefined;
		$scope.locationLongitude = undefined;

		var geocodeUrl = "http://maps.google.com/maps/api/geocode/json?address=" + encodeURIComponent(name) + "&sensor=false";
		$http.get(geocodeUrl)
		.success(function(data) {
			var locationData = data.results[0].geometry.location;
			$scope.locationLatitude = locationData.lat;
			$scope.locationLongitude = locationData.lng;
		})
		.error(function(data) {
			console.log('find location error', data);
		});
	};

	$scope.findLocationNear = function(name, radius) {
		var geocodeUrl = "http://maps.google.com/maps/api/geocode/json?address=" + encodeURIComponent(name) + "&sensor=false";
		$http.get(geocodeUrl)
		.success(function(data) {
			var locationData = data.results[0].geometry.location;
			var locationQuery = "value.location:NEAR:{lat:" + locationData.lat + " lon:" + locationData.lng + " radius:" + radius + "mi}";
			Location.get({query: locationQuery},
				function(data) {
					console.log('found near ' + name, data.body);
					locationCtl._setLocations(data.body.results);
				});
		})
		.error(function(data) {
			console.log('find location error', data);
		});
	};

	$scope.addLocation = function(locationName) {
		console.log('scope on add:', $scope);
		Location.save({
			name: locationName,
			latitude: $scope.locationLatitude,
			longitude: $scope.locationLongitude
		},
		function(result) {
			console.log('saved location:', result);
			$scope.locationNameToAdd = undefined;
			$scope.locationLatitude = undefined;
			$scope.locationLongitude = undefined;
			locationCtl._updateLocations();
		},
		function(err) {
			console.log('error:', err);
		});
	};

	uiGmapGoogleMapApi.then(function(maps) {
		console.log('map is ready:', maps);
    });

  	locationCtl._updateLocations();
  })
  .directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
  });