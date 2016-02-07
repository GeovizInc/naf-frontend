/**
 * Created by Hu on 2016-02-07.
 */
(function() {
    'use strict';

    angular.module('naf.course')
        .controller('CourseViewController', ['$rootScope', '$scope', '$location', '$log', 'Course', 'Flash', courseViewController])
        .controller('CourseEditController', ['$rootScope', '$scope', '$location', '$log', 'Course', 'Flash', courseEditController]);

    //CourseViewController
    function courseViewController($rootScope, $scope, $location, $log, Course, Flash) {

    }

    //CourseEditController
    function courseEditController($rootScope, $scope, $location, $log, Course, Flash) {

    }
})();