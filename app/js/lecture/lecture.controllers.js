/**
 * Created by Hu on 2016-02-07.
 */
(function () {
    'use strict';

    angular.module('naf.lecture')
        .controller('LectureStoreController', ['$rootScope', '$scope', '$location', '$routeParams', 'Presenter', 'Lecture', 'Course', 'Auth', 'Flash', lectureStoreController])
        .controller('LectureController', ['$rootScope', '$scope', '$location', '$sce', '$routeParams', 'Course', 'Lecture', LectureController])
        .controller('UploadLectureController', ['$rootScope', '$scope', '$location', '$timeout', '$routeParams', 'Upload', 'Auth', 'Vimeo', uploadLecture]);

    //LectureController
    function lectureStoreController($rootScope, $scope, $location, $routeParams, Presenter, Lecture, Course, Auth, Flash) {
        $scope.user = null ;
        if(Auth._user) {
            $scope.user = Auth._user;
        } else {
            Auth.logout();
            $location.path('/login');
        }
        Presenter.getTeachers({presenter_id: $scope.user._id}, function(response) {
            $scope.teachers = response;
        }, function(error) {
            console.log(error);
        });

        function reset() {
            $scope.lecture = {};
            $scope.lecture = {
                course: $routeParams.course_id
            };
            $scope.lectures = Course.getLectures({course_id: $routeParams.course_id});
        }

        $scope.createLecture = function() {
            Lecture.save($scope.lecture, function(response) {
                Flash.create('success', 'Lecture has been created!');
                reset();
            }, function(error) {
                console.log("error: "+JSON.stringify(error));
            });
        };

        reset();
    }

    //LectureController
    function LectureController($rootScope, $scope, $location, $sce, $routeParams, Course, Lecture) {
        var lectureId = $routeParams.lecture_id;
        var relatedLecturesSize = 2;
        loadLecture();

        function loadLecture() {
            Lecture.get({lecture_id: lectureId}, function(response) {
                var lecture = response;
                lecture.hasVideo = angular.isDefined(lecture.vimeoLink);
                lecture.hasZoom = angular.isDefined(lecture.zoomLink);
                lecture.vimeoLink = $sce.trustAsResourceUrl(lecture.vimeoLink);
                $scope.lecture = lecture;
                loadLectureList(lecture.course._id);
            });
        }

        function loadLectureList(courseId) {
             Course.getLectures({course_id: courseId}, function(response) {
                 var lectures = response;
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

    function uploadLecture($rootScope, $scope, $location, $timeout, $routeParams, Upload, Auth, Vimeo) {
        $scope.user = null ;
        if(Auth._user) {
            $scope.user = Auth._user;
        } else {
            Auth.logout();
            $location.path('/login');
        }

        var accessToken = 'e1cddd3d70aec0bda315833b9d820215';
        $scope.uploadVideo = function (videoFile) {
            Vimeo.getUser(
                {access_token: accessToken},
                function (data) {
                    var userId = getVimeoUserIdByUserUri(data.uri);
                    var userQuota = data.upload_quota;
                    var fileSize = videoFile.size;
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
                                                console.log(response.headers.location);
                                            },
                                            function (error) {

                                            }
                                        );
                                    });
                                }, function (response) {
                                    if (response.status > 0)
                                        console.log(response);
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

})();