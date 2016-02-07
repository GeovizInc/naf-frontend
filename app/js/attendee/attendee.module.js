/**
 * Created by Leon on 2016/2/5.
 */
(function() {
    'use strict';

    angular.module('naf.attendee', ['ngRoute', 'ngResource'])
        .config(['$routeProvider', config]);

    function config($routeProvider){
        $routeProvider
            .when('attendee/presenters/:presenter_id', {
                templateUrl: 'view/attendee/presenterprofile.html',
                controller: 'PresenterViewController'
            })
            .when('search', {
                templateUrl: 'view/attendee/search.html',
                controller: 'SearchController'
            })
            /*.when('attendee/:attendee_id', {

            })*/
    }
})();
