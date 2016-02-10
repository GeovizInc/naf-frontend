/**
 * Created by Leon on 2016/2/5.
 */
(function() {
    'use strict';

    angular.module('naf.teacher', [])
        .config(['$routeProvider', config]);

    function config($routeProvider){
        $routeProvider
            .when('/teachers/:teacher_id/profile', {
                templateUrl: 'view/teacher/profile.html',
                controller: 'TeacherViewController'
            })
            .when('/teachers/:teacher_id/edit', {
                templateUrl: 'view/teacher/edit_teacher.html',
                controller: 'TeacherEditController'
            })
            .when('/addteacher', {
                templateUrl: 'view/teacher/edit_teacher.html',
                controller: 'TeacherEditController'
            });
    }
})();
