/**
 * Created by Leon on 2016/2/5.
 */
(function () {
    'use strict';

    angular.module('naf.lecture', [])
        .config(['$routeProvider', config]);

    function config($routeProvider) {
        $routeProvider
            .when('/lecture/:course_id/create', {
                templateUrl: 'views/lecture/createEdit.html',
                controller: 'LectureStoreController'
            })
            .when('/lecture/:lecture_id', {
                templateUrl: 'views/lecture/show.html',
                controller: 'LectureController'
            })
            .when('/lecture/:lecture_id/edit', {
                templateUrl: 'views/lecture/createEdit.html',
                controller: 'LectureController'
            })
            .when('/lecture/:lecture_id/upload', {
                templateUrl: 'views/lecture/upload.html',
                controller: 'UploadLectureController'
            });
    }
})();