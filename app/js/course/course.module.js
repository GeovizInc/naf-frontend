/**
 * Created by Leon on 2016/2/5.
 */
(function() {
    'use strict';

    angular.module('naf.course', ['ngRoute', 'ngResource'])
        .config(['$routeProvider', config]);

    function config($routeProvider){
        $routeProvider
            .when('/courses/:course_id/detail', {
                templateUrl: 'view/course/detail.html',
                controller: 'CourseViewController'
            })
            .when('/course/:course_id/edit', {
                templateUrl: 'view/course/edit_course.html',
                controller: 'CourseEditController'
            })
            .when('/addcourse', {
                templateUrl: 'view/course/edit_course.html',
                controller: 'CourseEditController'
            });
    }
})();
