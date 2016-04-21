/**
 * Created by Hu on 2016-02-07.
 */
(function () {
    'use strict';

    angular.module('naf.lecture')
        .controller('LectureStoreController', ['$rootScope', '$scope', '$location', '$routeParams', 'Presenter', 'Lecture', 'Course', 'Auth', 'Flash', 'ngDialog', 'Config', lectureStoreController])
        .controller('LectureController', ['$rootScope', '$scope', '$location', '$sce', '$routeParams', 'Course', 'Lecture', 'Config', LectureController])
        .controller('UploadLectureController', ['$rootScope', '$scope', '$location', '$timeout', '$routeParams', 'Upload', 'Auth', 'Vimeo', 'Lecture', 'Flash', 'Teacher', uploadLecture]);

    //LectureController
    function lectureStoreController($rootScope, $scope, $location, $routeParams, Presenter, Lecture, Course, Auth, Flash, ngDialog, Config) {
        $scope.user = null ;
        $scope.availableLecture = 0;
        $scope.prefix = Config.imagePrefix;
        if(Auth._user) {
            $scope.user = Auth._user;
        } else {
            Auth.logout();
            $location.path('/login');
        }

        function updateLectureLimit() {
            Presenter.getLectureLimit(function(response) {
                $scope.availableLecture = response.totalLectureLimit - response.currentLecture;
            }, function(error) {
                console.log(error);
            });
        }

        updateLectureLimit();

        $scope.courseId = $routeParams.course_id;
        Presenter.getTeachers({presenter_id: $scope.user._id, getAll: true}, function(response) {
            $scope.teachers = response.data;

        }, function(error) {
            console.log(error);
        });

        function reset() {
            $scope.lecture = {};
            $scope.lecture = {
                course: $routeParams.course_id
            };
            getLecturePage();
            updateLectureLimit();
        }

        function getLecturePage(params) {
            if(!params) params = {}
            params.course_id = $routeParams.course_id;
            Course.getLectures(params, function(result) {
                $scope.lectures = result.data;
                $scope.currentPage = result.currentPage;
                $scope.limit = result.limit;
                $scope.pageCount = result.pageCount;
            });
        }

        $scope.getLecturePage = function (page,limit) {
            getLecturePage({page:page, limit:limit});
        };

        $scope.getNumber = function(num) {
            return new Array(num);
        };

        $scope.reset = function(){
            reset();
        };

        $scope.createLecture = function() {
            $scope.lecture.time = new Date($scope.lecture.time);
            Lecture.save($scope.lecture, function(response) {
                console.log(response._id);
                if($scope.myFile) {
                    var fd = new FormData();
                    fd.append("file", $scope.myFile);
                    Lecture.uploadImage({lecture_id: response._id},
                        fd,
                        function(ImageLink) {
                            console.log('Image upload successful');
                            $scope.lecture.imageLink = ImageLink;
                        },
                        function(error) {
                            console.log(error + ': Image upload failed');
                        }
                    );
                }
                Flash.create('success', 'Lecture has been created!');
                reset();
            }, function(error) {
                console.log("error: "+JSON.stringify(error));
            });
        };

        $scope.updateLecture = function() {
            $scope.lecture.time = new Date($scope.lecture.time);
            Lecture.update($scope.lecture, function(response) {
                console.log(response);
                if($scope.myFile) {
                    var fd = new FormData();
                    fd.append("file", $scope.myFile);
                    Lecture.uploadImage({lecture_id: response._id},
                        fd,
                        function(ImageLink) {
                            console.log('Image upload successful');
                            $scope.lecture.imageLink = ImageLink;
                        },
                        function(error) {
                            console.log(error + ': Image upload failed');
                        }
                    );
                }
                Flash.create('success', 'Lecture updated');
                reset();
            }, function(error) {
                console.log(error);
                Flash.create('danger', 'Unable to save lecture');
                console.error(error);
            });
        };

        $scope.loadLectureInfo = function(lectureItem) {
            //TODO figure out why teacher and time are not binding to directives
            $scope.lecture = {
                _id: lectureItem._id,
                name: lectureItem.name,
                teacher: lectureItem.teacher._id,
                time: moment(new Date(lectureItem.time)).format('MM/DD/YYYY h:mm A'),
                description: lectureItem.description,
                imageLink:lectureItem.imageLink
            };

        };

        $scope.confirmRemove = function(lectureItem) {
            $scope.lectureToBeRemove = lectureItem;
            ngDialog.open({
                template: 'views/lecture/delete.html',
                className: 'ngdialog-theme-default',
                scope: $scope
            });
        };

        $scope.removeLecture = function() {
          Lecture.remove($scope.lectureToBeRemove, function(resopnse) {
              Flash.create('success', 'Lecture has been Removed!');
              reset();
          }, function(error) {
              Flash.create('danger', error.data);
          })
        };

        reset();
    }

    //LectureController
    function LectureController($rootScope, $scope, $location, $sce, $routeParams, Course, Lecture, Config) {
        $scope.prefix = Config.imagePrefix;
        var lectureId = $routeParams.lecture_id;
        var relatedLecturesSize = 2;
        loadLecture();

        function loadLecture() {
            Lecture.get({lecture_id: lectureId}, function(response) {
                var lecture = response;
                lecture.hasVideo = (angular.isDefined(lecture.vimeoLink) && lecture.vimeoLink !== null && lecture.vimeoLink !== '');
                if(lecture.hasVideo) lecture.vimeoLink = 'https://player.vimeo.com/video/' + lecture.vimeoLink + '?badge=0&autopause=0&player_id=0';
                lecture.hasZoom = angular.isDefined(lecture.zoomLink);
                lecture.vimeoLink = $sce.trustAsResourceUrl(lecture.vimeoLink);
                $scope.lecture = lecture;
                loadLectureList(lecture.course._id);
            });
        }

        function loadLectureList(courseId) {
             Course.getLectures({course_id: courseId}, function(response) {
                 var lectures = response.data;
                 var lecturesCount = 0;
                 $scope.relatedLectures = [];
                 if(lectures.length < relatedLecturesSize) {
                     $scope.relatedLectures = lectures;
                     return;
                 }

                 var index = getIndex(lectureId);
                 for(; lecturesCount < relatedLecturesSize; lecturesCount++) {
                     if(++index >= lectures.length) index = 0;
                     $scope.relatedLectures.push(lectures[index]);
                 }

                 function getIndex(lectureId) {
                     var i = 0;
                     for(; i < lectures.length; i++) {
                         if(lectures[i]._id === lectureId) {
                             break;
                         }
                     }
                     return i;
                 }

             });
        }



    }

    function uploadLecture($rootScope, $scope, $location, $timeout, $routeParams, Upload, Auth, Vimeo, Lecture, Flash, Teacher) {
        $scope.user = null;
        if(Auth._user) {
            $scope.user = Auth._user;
        } else {
            Auth.logout();
            $location.path('/login');
        }

        $scope.isNoQuota = false;
        var accessToken = ''; //''e1cddd3d70aec0bda315833b9d820215';

        Teacher.getVimeoCred(function(response) {
            accessToken = response.accessToken;
            console.log(accessToken);
            Vimeo.getUser(
                {access_token: accessToken},
                function (data) {
                    var userQuota = data.upload_quota;
                    console.log(userQuota.quota.hd);
                    console.log(userQuota.quota.sd);
                    if (!userQuota.quota.hd && !userQuota.quota.sd){
                        $scope.isNoQuota = true;
                        $scope.noQuotaMessage = 'Out of daily Quota, please try tomorrow.';
                    }
                    if (userQuota.space.free == 0){
                        $scope.isNoQuota = true;
                        $scope.noQuotaMessage = 'Out of Weekly Quota, please try next week.';
                    }
                },
                function (error) {

                }
            );
        });

        $scope.uploadVideo = function (videoFile) {
            Vimeo.getUser(
                {access_token: accessToken},
                function (data) {
                    var userId = getVimeoUserIdByUserUri(data.uri);
                    var userQuota = data.upload_quota;
                    console.log(userId);
                    console.log(userQuota);
                    console.log(videoFile);
                    var fileSize = videoFile.size;
                    console.log(userQuota.quota.hd);
                    console.log(userQuota.quota.sd);
                    if (!userQuota.quota.hd && !userQuota.quota.sd) return false;
                    if (userQuota.space.free < fileSize) return false;

                    Vimeo.getTicket(
                        {
                            access_token: accessToken,
                            type: 'streaming'
                        },
                        {},
                        function (data) {
                            var ticketId = data.ticket_id;
                            var uploadLinkSecure = data.upload_link_secure;
                            var completeUri = data.complete_uri;

                            var fileReader = new FileReader();
                            fileReader.readAsArrayBuffer(videoFile);
                            fileReader.onload = function (e) {
                                Upload.http({
                                    url: uploadLinkSecure,
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': videoFile.type
                                    },
                                    data: e.target.result
                                }).then(function (response) {
                                    $timeout(function () {
                                        var completeUriParams = getCompleteUriParams(completeUri);
                                        Vimeo.deleteTicket(
                                            {
                                                userId: userId,
                                                ticketId: ticketId,
                                                video_file_id: completeUriParams.videoFileId,
                                                upgrade: completeUriParams.upgrade,
                                                signature: completeUriParams.signature,
                                                access_token: accessToken
                                            },
                                            function (response) {
                                                var vimeoVideoId = getVimeoVideoIdByVideoUri(response.headers.location);
                                                var lecture = {
                                                    _id: $routeParams.lecture_id,
                                                    vimeoLink: vimeoVideoId
                                                };
                                                console.log(lecture);
                                                Lecture.update(lecture, function(response){
                                                    console.log(response);
                                                    Flash.create('success', 'Lecture has been Uploaded!');
                                                    $location.path('/teacher/' + $scope.user._id + '/home');
                                                }, function(error){
                                                    console.log(error);
                                                })
                                            },
                                            function (error) {

                                            }
                                        );
                                    });
                                }, function (response) {
                                    if (response.status > 0)
                                        $scope.errorMsg = response.status + ': ' + response.data;
                                }, function (evt) {
                                    videoFile.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                                });
                            };

                        },
                        function (error) {

                        }
                    );
                },
                function (error) {

                }
            );
        };
    }

    function getCompleteUriParams(completeUri) {
        var paramKeyVideoFileId = 'video_file_id=';
        var paramKeyUpgrade = 'upgrade=';
        var paramKeySignature = 'signature=';
        var videoFileId = completeUri.substring(completeUri.indexOf(paramKeyVideoFileId) + paramKeyVideoFileId.length, completeUri.indexOf(paramKeyUpgrade) - 1);
        var upgrade = completeUri.substring(completeUri.indexOf(paramKeyUpgrade) + paramKeyUpgrade.length, completeUri.indexOf(paramKeySignature) - 1);
        var signature = completeUri.substring(completeUri.indexOf(paramKeySignature) + paramKeySignature.length);
        return {
            videoFileId: videoFileId,
            upgrade: upgrade,
            signature: signature
        }
    }

    function getVimeoUserIdByUserUri(userUri) {
        return userUri.substring('/users/'.length);
    }

    function getVimeoVideoIdByVideoUri(videoUri) {
        return videoUri.substring('/videos/'.length);
    }

})();