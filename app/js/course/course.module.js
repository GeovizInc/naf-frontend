/**
 * Created by Leon on 2016/2/5.
 */
(function() {
    'use strict';

    angular.module('naf.course', [])
        .config(['$routeProvider', config]);

    function config($routeProvider){
        $routeProvider
            .when('/course', {
                templateUrl: 'views/course/index.html',
                controller: 'CourseStoreController'
            })
            .when('/course/create', {
                templateUrl: 'views/course/createEdit.html',
                controller: 'CourseStoreController'
            })
            .when('/course/:course_id', {
                templateUrl: 'views/course/show.html',
                controller: 'CourseViewController'
            })
            .when('/course/:course_id/edit', {
                templateUrl: 'views/course/createEdit.html',
                controller: 'CourseEditController'
            });
    }
})();
