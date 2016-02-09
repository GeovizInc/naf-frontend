'use strict';

// Declare app level module which depends on views, and components
angular.module('naf', [
    'ngRoute',
    'ngResource',
    'naf.config',
    'naf.lecture'
]).
config(['$routeProvider', function ($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/'});
}]);