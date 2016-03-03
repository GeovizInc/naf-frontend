(function() {
    'use strict';

    angular.module('naf.search', [])
        .config(['$routeProvider', config]);

    function config($routeProvider){
        $routeProvider
            .when('/search', {
                templateUrl: 'views/attendee/search.html',
                controller: 'SearchViewController'
            });
    }
})();