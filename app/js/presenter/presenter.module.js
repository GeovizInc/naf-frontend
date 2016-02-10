/**
 * Created by Leon on 2016/2/5.
 */
(function() {
    'use strict';

    angular.module('naf.presenter', [])
        .config(['$routeProvider', config]);

    function config($routeProvider){
        $routeProvider
            .when('/presenters/:presenter_id/profile', {
                templateUrl: 'view/presenter/profile.html',
                controller: 'PresenterEditController'
            })
            .when('/presenters/:presenter_id/courses', {
                templateUrl: 'view/presenter/courses.html',
                controller: 'PresenterEditController'
            })
            .when('/presenters/:presenter_id/teachers', {
                templateUrl: 'view/presenter/teachers.html',
                controller: 'PresenterEditController'
            });
    }
})();
