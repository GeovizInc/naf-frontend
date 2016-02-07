/**
 * Created by Hu on 2016-02-07.
 */
(function() {
    'use strict';

    angular.module('naf.teacher')
        .controller('TeacherViewController', ['$rootScope', '$scope', '$location', '$log', 'Teacher', 'Flash', teacherViewController])
        .controller('TeacherEditController', ['$rootScope', '$scope', '$location', '$log', 'Teacher', 'Flash', teacherEditController]);
    //TeacherViewController

    function teacherViewController($rootScope, $scope, $location, $log, Teacher, Flash) {

    }

    //TeacherEditController
    function teacherEditController($rootScope, $scope, $location, $log, Teacher, Flash) {

    }
})();