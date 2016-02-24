/**
 * Created by Leon on 2016/2/5.
 */
(function() {
    'use strict';

    angular.module('naf.attendee', [])
        .config(['$routeProvider', config]);

    function config($routeProvider){
        $routeProvider
            .when('/search', {
                templateUrl: 'views/attendee/search.html',
                controller: 'SearchController'
            });

            /*.when('attendee/:attendee_id', {

            })*/
    }
})();
