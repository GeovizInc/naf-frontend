/**
 * Created by Hu on 2016-02-07.
 */
(function() {
    'use strict';

    angular.module('naf.course')
        .controller('CourseStoreController', ['$rootScope', '$scope', '$location', 'Course', 'Auth', 'Flash', courseStoreController])
        .controller('CourseListController', ['$rootScope', '$scope', '$location', 'Presenter', 'Auth', 'Flash', 'Config', courseListController])
        .controller('CourseViewController', ['$rootScope', '$scope', '$location', '$routeParams', 'Course', 'Flash', 'Auth', 'Config', courseViewController])
        .controller('CourseEditController', ['$rootScope', '$scope', '$location', '$routeParams', 'Course', 'Flash', 'ngDialog', courseEditController]);

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
                if($scope.myFile) {
                    var fd = new FormData();
                    fd.append("file", $scope.myFile);
                    Course.uploadImage({course_id: response._id},
                        fd,
                        function(ImageLink) {
                            console.log('Image upload successful');
                            $scope.course.imageLink = ImageLink;
                        },
                        function(error) {
                            console.log(error + ': Image upload failed');
                        }
                    );
                }
                Flash.create('success', 'Course has been created!');
                $location.path('/course');
            }, function(error) {
                console.log(error);
            });
        }
    }

    //courseListController
    function courseListController($rootScope, $scope, $location, Presenter, Auth, Flash, Config) {
        $scope.user = null;
        $scope.courses = null;
        $scope.prefix = Config.imagePrefix;
        if(!Auth._user) {
            Flash.create('danger','Please Login');
            $location.path('/login');
        } else if(Auth._user.userType != 'presenter') {
            Flash.create('danger','Current user is not a presenter');
            $location.path('/search');
        }
        $scope.user = Auth._user;
        getCourses();

        $scope.getCoursePage = function (page,limit) {
            getCourses({page:page, limit:limit});
        };

        $scope.getNumber = function(num) {
            return new Array(num);
        };

        function getCourses(params) {
            if(!params) params = {};
            params.presenter_id = $scope.user._id;
            Presenter.getCourses(params,
                function(result) {
                    //console.log(result);
                    $scope.courses = result.data;
                    $scope.currentPage = result.currentPage;
                    $scope.limit = result.limit;
                    $scope.pageCount = result.pageCount;
                }, function(error) {
                    Flash.create('danger', 'Unable to get courses');
                });
        }


    }

    //CourseViewController
    function courseViewController($rootScope, $scope, $location, $routeParams, Course, Flash, Auth, Config) {
        $scope.course = null;
        $scope.isPresenter = null;
        $scope.prefix = Config.imagePrefix;
        Course.get({course_id: $routeParams.course_id}, function(response) {
            $scope.course = response;
            if(Auth._user && Auth._user._id == $scope.course.presenter._id) {
                $scope.isPresenter = true;
            }

            getLectures();
        }, function(error) {
            Flash.create('danger', 'Can not get this course!');
            //$location.path('/search');
        });

        $scope.getLecturePage = function (page,limit) {
            getLectures({page:page, limit:limit});
        };

        function getLectures(params) {
            if(!params) params = {};
            params.course_id = $scope.course._id;
            Course.getLectures(params,
                function(result) {
                    $scope.lectures = result.data;
                    $scope.currentPage = result.currentPage;
                    $scope.limit = result.limit;
                    $scope.pageCount = result.pageCount;
                }, function(error) {
                    Flash.create('danger', 'Unable to get lectures');
                });
        }

        $scope.getNumber = function(num) {
            return new Array(num);
        };

    }

    //CourseEditController
    function courseEditController($rootScope, $scope, $location, $routeParams, Course, Flash, ngDialog) {
        $scope.course = null;
        Course.get({course_id: $routeParams.course_id}, function(response) {
            $scope.course = response;
        }, function(error) {
            Flash.create('danger', 'Can not get this course!');
            $location.path('/course');
        });

        $scope.updateCourse = function() {
            console.log($routeParams.course_id);
            if($scope.myFile) {
                var fd = new FormData();
                fd.append("file", $scope.myFile);
                Course.uploadImage({course_id: $routeParams.course_id},
                    fd,
                    function(ImageLink) {
                        console.log('Image upload successful');
                        $scope.course.imageLink = ImageLink;
                    },
                    function(error) {
                        console.log.error(error + ': Image upload failed');
                    }
                );
            }

          Course.update($scope.course, function(response) {
              console.log(response);
              Flash.create('success', 'Course has been updated!');
              $location.path('/course');
          }, function(error) {
              console.log(error);
          });
        };

        $scope.confirmRemove = function() {
            ngDialog.open({
                template: 'views/course/delete.html',
                className: 'ngdialog-theme-default',
                scope: $scope
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
        };

        $scope.manageLectures = function() {
            $location.path('/lecture/' + $routeParams.course_id + '/create');
        }

    }

})();