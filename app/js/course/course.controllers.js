/**
 * Created by Hu on 2016-02-07.
 */
(function() {
    'use strict';

    angular.module('naf.course')
        .controller('CourseStoreController', ['$rootScope', '$scope', '$location', '$log', 'Course', courseStoreController])
        .controller('CourseViewController', ['$rootScope', '$scope', '$location', '$log', 'Course', 'Flash', courseViewController])
        .controller('CourseEditController', ['$rootScope', '$scope', '$location', '$log', 'Course', courseEditController]);

    //CourseViewController
    function courseStoreController($rootScope, $scope, $location, $log, Course) {
    }

    //CourseViewController
    function courseViewController($rootScope, $scope, $location, $log, Course, Flash) {

    }

    //CourseEditController
    function courseEditController($rootScope, $scope, $location, $log, Course) {

    }
})();