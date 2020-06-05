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
    $scope.scrollToBottom();
  };

  $scope.scrollToBottom = function() {
    window.setTimeout(function() {
      document.body.scrollTop = 0;//document.body.scrollHeight;
    }, 0);
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

  $scope.handleTextAreaChange = function(evt) {
    evt.target.style.height = 'auto';
    // Gross conversion from px to em assuming the textarea font size.
    // This is so that we can use the print layout without having to
    // make any adjustments.
    evt.target.style.height = ((evt.target.scrollHeight)/(18.0/0.75) - 1.0) + 'em';
    return evt.target.value.trim() !== ''; // return true if not empty
  };

  function setup() {
    loadPageData().then(function() {
      console.log('Successfully loaded page data');
    }, function() {
      alert('Could not load page. Please try refreshing.');
    });
  }
  setup();

});
