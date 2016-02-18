/**
 * Created by Leon on 2016/2/5.
 */
(function() {
    'use strict';

    angular.module('naf.teacher', [])
        .config(['$routeProvider', config]);

    function config($routeProvider){
        $routeProvider
            .when('/teacher', {
                templateUrl: 'views/teacher/index.html',
                controller: 'TeacherIndexController'
            })
            .when('/teacher/create', {
                templateUrl: 'views/teacher/createEdit.html',
                controller: 'TeacherStoreController'
            })
            .when('/teacher/:teacher_id', {
                templateUrl: 'views/teacher/show.html',
                controller: 'TeacherShowController'
            })
            .when('/teacher/:teacher_id/edit', {
                templateUrl: 'views/teacher/createEdit.html',
                controller: 'TeacherUpdateController'
            })
            .when('/teacher/:teacher_id/home', {
                templateUrl: 'views/teacher/home.html',
                controller: 'TeacherHomeController'
            });
    }
})();
