angular.module('wubApp', ['ui.bootstrap', 'wubServices'])
  .controller('LocationController', function($scope, $http, Location) {
  	var locationCtl = this;
  	$scope.locations = [];

	locationCtl._updateLocations = function() {
		Location.query(function(data) {
			console.log('locations', data.body.results);
			$scope.locations = data.body.results;
		});
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

	$scope.findLocationNear = function(name) {
		var geocodeUrl = "http://maps.google.com/maps/api/geocode/json?address=" + encodeURIComponent(name) + "&sensor=false";
		$http.get(geocodeUrl)
		.success(function(data) {
			var locationData = data.results[0].geometry.location;
			var locationQuery = "value.location:NEAR:{lat:" + locationData.lat + " lon:" + locationData.lng + " radius:100mi}";
			Location.get({query: locationQuery},
				function(data) {
					console.log('found near ' + name, data.body);
					$scope.foundLocations = data.body.results;
				});
		})
		.error(function(data) {
			console.log('find location error', data);
		});
	};

	$scope.addLocation = function() {
		Location.save({
			name: $scope.locationName,
			latitude: $scope.locationLatitude,
			longitude: $scope.locationLongitude
		},
		function(result) {
			$scope.locationName = undefined;
			$scope.locationLatitude = undefined;
			$scope.locationLongitude = undefined;
			locationCtl._updateLocations();
		},
		function(err) {
			console.log('error:', err);
		});
	};

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