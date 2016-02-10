/**
 * Created by Leon on 2016/2/5.
 */
(function () {
    'use strict';

    angular.module('naf.lecture', [])
        .config(['$routeProvider', config]);

    function config($routeProvider) {
        $routeProvider
            .when('/courses/:course_id/lectures', {
                templateUrl: 'view/lecture/lectures.html',
                controller: 'LectureController'
            })
            .when('/lecture/upload', {
                templateUrl: 'views/lecture/upload.html',
                controller: 'UploadLectureController'
            });
    }
})();