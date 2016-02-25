/**
 * Created by Hu on 2016-02-07.
 */
(function() {
    'use strict';

    angular.module('naf.course')
        .controller('CourseStoreController', ['$rootScope', '$scope', '$location', 'Course', courseStoreController])
        .controller('CourseViewController', ['$rootScope', '$scope', '$location', 'Course', 'Flash', courseViewController])
        .controller('CourseEditController', ['$rootScope', '$scope', '$location', 'Course', courseEditController]);

    //CourseViewController
    function courseStoreController($rootScope, $scope, $location, Course) {
    }

    //CourseViewController
    function courseViewController($rootScope, $scope, $location, Course, Flash) {

    }

    //CourseEditController
    function courseEditController($rootScope, $scope, $location, Course) {

    }
})();