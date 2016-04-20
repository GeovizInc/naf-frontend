/**
 * Created by Hu on 2016-02-07.
 */
(function() {
    'use strict';

    angular.module('naf.teacher')
        .controller('TeacherHomeController', ['$rootScope', '$scope', '$location', '$routeParams', 'Teacher', 'Auth', 'Flash', teacherHomeController])
        .controller('TeacherStoreController', ['$rootScope', '$scope', '$location', 'Teacher', 'Auth', 'Flash', teacherStoreController])
        .controller('TeacherIndexController', ['$rootScope', '$scope', '$location', 'Presenter', 'Auth', 'Flash', teacherIndexController])
        .controller('TeacherShowController', ['$rootScope', '$scope', '$location', '$routeParams', 'Teacher', 'Auth',  'Flash', teacherShowController])
        .controller('TeacherUpdateController', ['$rootScope', '$scope', '$location', '$routeParams', 'Teacher', 'Auth',  'Flash', teacherUpdateController]);

    //TeacherHomeController
    function teacherHomeController($rootScope, $scope, $location, $routeParams, Teacher, Auth, Flash) {
        $scope.user = null;
        if(!Auth._user) {
            Flash.create('danger','Please Login');
            $location.path('/login');
        } else if(Auth._user.userType != 'teacher') {
            Flash.create('danger','Current user is not a teacher');
            $location.path('/Search');
        }
        Teacher.get({'teacher_id':$routeParams.teacher_id}, function(response) {
            $scope.teacher = response;
            getLectures();
        }, function(error) {
            console.log(error);
        });
        $scope.user = Auth._user;

        $scope.getLecturePage = function (page,limit) {
            getLectures({page:page, limit:limit});
        };

        function getLectures(params) {
            if(!params) params = {};
            params.teacher_id = $scope.teacher._id;
            Teacher.getLecture(params,
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
                $scope.teacher._id = response._id;
                Teacher.update($scope.teacher, function(response) {

                    if($scope.myFile) {
                        var fd = new FormData();
                        fd.append("file", $scope.myFile);
                        Teacher.uploadImage({teacher_id: $scope.teacher._id},
                            fd,
                            function(ImageLink) {
                                console.log('Image upload successful');
                                $scope.teacher.imageLink = ImageLink;
                            },
                            function(error) {
                                console.log(error + ': Image upload failed');
                            }
                        );
                    }

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
        //console.log($scope.user);
        getTeachers();

        $scope.getTeacherPage = function(page, limit) {
            getTeachers({page: page, limit: limit})
        };

        function getTeachers(params) {
            if(!params) params = {};
            params.presenter_id = $scope.user._id;
            Presenter.getTeachers(params,
                function(result) {
                    $scope.teachers = result.data;
                    $scope.currentPage = result.currentPage;
                    $scope.limit = result.limit;
                    $scope.pageCount = result.pageCount;
                }, function(error) {
                    Flash.create('danger', 'Unable to get teachers');
                });
        }

        $scope.getNumber = function(num) {
            return new Array(num);
        };

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
            getCourses();
        }, function(error) {
            Flash.create('danger', 'Can not get this teacher!');
            $location.path('/search');
        });

        $scope.getCoursePage = function (page,limit) {
            getCourses({page:page, limit:limit});
        };

        function getCourses(params) {
            if(!params) params = {};
            params.teacher_id = $scope.teacher._id;
            Teacher.getCourses(params,
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

        $scope.getNumber = function(num) {
            return new Array(num);
        };
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
                if($scope.myFile) {
                    var fd = new FormData();
                    fd.append("file", $scope.myFile);
                    Teacher.uploadImage({teacher_id: $scope.teacher._id},
                        fd,
                        function(ImageLink) {
                            console.log('Image upload successful');
                            $scope.teacher.imageLink = ImageLink;
                        },
                        function(error) {
                            console.log(error + ': Image upload failed');
                        }
                    );
                }
                console.log(response);
                Flash.create('success', 'Teacher has been updated!');
                $location.path('/teacher');
            }, function(error) {
                console.log(error);
            });
        };
    }
})();