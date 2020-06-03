var app = angular.module('myApp', ['ngSanitize']);

// Change Underscore templating from ERB to Mustache style
_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g
};

// Change Angular templating from {{var}} to {[var]} to avoid conflict
app.config(['$interpolateProvider', '$httpProvider',
            function($interpolateProvider, $httpProvider) {
  $interpolateProvider.startSymbol('{[');
  $interpolateProvider.endSymbol(']}');
}]);

app.controller('myCtrl', function($scope, $http, $sce, $q) {

	$scope.isDisplayMinimal = false;

	$scope.toggleDisplay = function() {
		$scope.isDisplayMinimal = !$scope.isDisplayMinimal;
	};

  /* Load JSON */
  $scope.loadJsonInScope = function(jsonUrl, scopeVar, callback) {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: jsonUrl,
      }).then(function successCallback(response) {
        $scope[scopeVar] = response.data;
        if (callback && _.isFunction(callback)) { callback(); }
        deferred.resolve();
      }, function errorCallback(response) {
        deferred.reject('Unable to fetch ' + jsonUrl);
      });
      return deferred.promise;
  };

  /* Load page data */
  function loadPageData() {
    return $scope.loadJsonInScope('assets/prompts.json', 'prompts');
  }

  function setup() {
    loadPageData().then(function() {
      console.log('Successfully loaded page data');
    }, function() {
      alert('Could not load page. Please try refreshing.');
    });
  }
  setup();

});
