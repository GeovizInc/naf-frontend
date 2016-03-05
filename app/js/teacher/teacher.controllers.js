/**
 * Created by Hu on 2016-02-07.
 */
(function() {
    'use strict';

    angular.module('naf.teacher')
        .controller('TeacherStoreController', ['$rootScope', '$scope', '$location', 'Teacher', 'Auth', 'Flash', teacherStoreController])
        .controller('TeacherIndexController', ['$rootScope', '$scope', '$location', 'Presenter', 'Auth', 'Flash', teacherIndexController])
        .controller('TeacherShowController', ['$rootScope', '$scope', '$location', '$routeParams', 'Teacher', 'Auth',  'Flash', teacherShowController])
        .controller('TeacherUpdateController', ['$rootScope', '$scope', '$location', '$routeParams', 'Teacher', 'Auth',  'Flash', teacherUpdateController]);

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
                userType: 'teacher',
                presenter: Auth._user._id
            };
            Teacher.save(credential, function(response){
                console.log(response);
                $scope.teacher._id = response._id;
                Teacher.update($scope.teacher, function(response) {
                    //console.log(response);
                    Flash.create('success', 'Teacher has been created!');
                    $location.path('/teacher');
                }, function(error) {
                    Flash.create('danger', error.data.message);
                });
            }, function(error) {
                console.log("error: "+JSON.stringify(error));
                Flash.create('danger', error.data.message);
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


    //TeacherShowController
    function teacherShowController($rootScope, $scope, $location, $routeParams, Teacher, Auth, Flash) {
        $scope.teacher = null;
        $scope.isPresenter = null;
        Teacher.get({teacher_id: $routeParams.teacher_id}, function(response) {
            console.log(response);
            $scope.teacher = response;
            if(Auth._user && Auth._user._id == $scope.teacher.presenter._id) {
                $scope.isPresenter = true;
            }
        }, function(error) {
            Flash.create('danger', 'Can not get this teacher!');
            $location.path('/search');
        });
    }

    //TeacherUpdateController
    function teacherUpdateController($rootScope, $scope, $location, $routeParams, Teacher, Auth, Flash) {
        $scope.teacher = null;
        Teacher.get({teacher_id: $routeParams.teacher_id}, function(response) {
            console.log(response);
            $scope.teacher = response;
        }, function(error) {
            Flash.create('danger', 'Can not get this teacher!');
            $location.path('/teacher');
        });

        $scope.updateTeacher = function() {
            Teacher.update($scope.teacher, function(response) {
                console.log(response);
                Flash.create('success', 'Teacher has been updated!');
                $location.path('/teacher');
            }, function(error) {
                console.log(error);
            });
        };
    }
})();