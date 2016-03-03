/**
 * Created by Hu on 2016-02-07.
 */
(function() {
    'use strict';

    angular.module('naf.course')
        .controller('CourseStoreController', ['$rootScope', '$scope', '$location', 'Course', 'Auth', 'Flash', courseStoreController])
        .controller('CourseListController', ['$rootScope', '$scope', '$location', 'Presenter', 'Auth', 'Flash', courseListController])
        .controller('CourseViewController', ['$rootScope', '$scope', '$location', '$routeParams', 'Course', 'Flash', 'Auth', courseViewController])
        .controller('CourseEditController', ['$rootScope', '$scope', '$location', '$routeParams', 'Course', 'Flash', courseEditController]);

    //CourseStoreController
    function courseStoreController($rootScope, $scope, $location, Course, Auth, Flash) {
        $scope.user = null ;
        if(Auth._user) {
            $scope.user = Auth._user;
        } else {
            Auth.logout();
            $location.path('/login');
        }
        $scope.course = null;
        $scope.createCourse = function() {
            var course = {
                "name": $scope.course.name,
                "description": $scope.course.description
                //"imageLink": "http://flickr.com/123"
            };
            Course.save(course, function(response) {
                console.log(response);
                Flash.create('success', 'Course has been created!');
                $location.path('/course');
            }, function(error) {
                console.log(error);
            });
        }
    }

    //courseListController
    function courseListController($rootScope, $scope, $location, Presenter, Auth, Flash) {
        $scope.user = null;
        $scope.courses = null;
        if(!Auth._user) {
            Flash.create('danger','Please Login');
            $location.path('/login');
        } else if(Auth._user.userType != 'presenter') {
            Flash.create('danger','Current user is not a presenter');
            $location.path('/search');
        }
        $scope.user = Auth._user;
        Presenter.getCourses({presenter_id: $scope.user._id}, function(response) {
            console.log(response);
            $scope.courses = response;
        }, function(error) {
            console.log(error);
        });


    }

    //CourseViewController
    function courseViewController($rootScope, $scope, $location, $routeParams, Course, Flash, Auth) {
        $scope.course = null;
        $scope.isPresenter = null;
        Course.get({course_id: $routeParams.course_id}, function(response) {
            $scope.course = response;
            if(Auth._user && Auth._user._id == $scope.course.presenter._id) {
                $scope.isPresenter = true;
            }
        }, function(error) {
            Flash.create('danger', 'Can not get this course!');
            $location.path('/search');
        });


    }

    //CourseEditController
    function courseEditController($rootScope, $scope, $location, $routeParams, Course,Flash) {
        $scope.course = null;
        Course.get({course_id: $routeParams.course_id}, function(response) {
            $scope.course = response;
        }, function(error) {
            Flash.create('danger', 'Can not get this course!');
            $location.path('/course');
        });

        $scope.updateCourse = function() {
          Course.update($scope.course, function(response) {
              console.log(response);
              Flash.create('success', 'Course has been updated!');
              $location.path('/course');
          }, function(error) {
              console.log(error);
          });
        };

        $scope.removeCourse = function() {
            Course.remove($scope.course, function(response) {
                Flash.create('success', 'Course has been removed!');
                $location.path('/course');
            }, function(error) {
                console.log(error);
                Flash.create('danger', 'Course can not been removed, please try again');
            });
        }

    }
})();