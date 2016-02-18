/**
 * Created by Leon on 2016/2/5.
 */
(function() {
    'use strict';

    angular.module('naf.attendee', [])
        .config(['$routeProvider', config]);

    function config($routeProvider){
        $routeProvider
            .when('attendee/presenter/:presenter_id', {
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
