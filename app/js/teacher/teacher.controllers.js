/**
 * Created by Hu on 2016-02-07.
 */
(function() {
    'use strict';

    angular.module('naf.teacher')
        .controller('TeacherStoreController', ['$rootScope', '$scope', '$location', 'Teacher', 'Auth', 'Flash', teacherStoreController])
        .controller('TeacherIndexController', ['$rootScope', '$scope', '$location', 'Presenter', 'Auth', 'Flash', teacherIndexController])
        .controller('TeacherShowController', ['$rootScope', '$scope', '$location', 'Teacher', 'Auth',  'Flash', teacherShowController])
        .controller('TeacherEditController', ['$rootScope', '$scope', '$location', 'Teacher', 'Auth',  'Flash', teacherEditController]);

    //TeacherStoreController
    function teacherStoreController($rootScope, $scope, $location, Teacher, Auth, Flash) {
        $scope.user = null ;
        if(Auth._user && Auth._user.userType == 'presenter') {
            $scope.user = $scope._user;
        } else {
            Auth.logout();
            $location.path('/login');
        }
        $scope.teacher = null;
        $scope.createTeacher = function() {
            var credential = {
                email: $scope.teacher.email,
                password: $scope.teacher.password,
                userType: 'teacher'
            };
            Teacher.save(credential, function(response){
                console.log(response);
                $scope.teacher._id = response._id;
                Teacher.update($scope.teacher, function(response) {
                    //console.log(response);
                    Flash.create('success', 'Teacher has been created!');
                    $location.path('/teacher');
                }, function(error) {
                    console.log(error);
                });
            }, function(error) {
                console.log("error: "+JSON.stringify(error));
            });
        };
    }

    //TeacherIndexController
    function teacherIndexController($rootScope, $scope, $location, Presenter, Auth, Flash) {
        $scope.user = null;
        $scope.teachers = null;
        if(!Auth._user) {
            Flash.create('danger','Please Login');
            $location.path('/login');
        } else if(Auth._user.userType != 'presenter') {
            Flash.create('danger','Current user is not a presenter');
            $location.path('/Search');
        }
        $scope.user = Auth._user;
        console.log($scope.user);
        Presenter.getTeachers({presenter_id: $scope.user._id}, function(response) {
            console.log(response);
            $scope.teachers = response;
        }, function(error) {
            console.log(error);
        });
    }


    //TeacherViewController
    function teacherShowController($rootScope, $scope, $location, $log, Teacher, Flash) {

    }

    //TeacherEditController
    function teacherEditController($rootScope, $scope, $location, $log, Teacher, Flash) {

    }
})();