/**
 * Created by Hu on 2016-02-07.
 */
(function () {
    'use strict';

    angular.module('naf.lecture')
        .controller('LectureStoreController', ['$rootScope', '$scope', '$location', '$routeParams', 'Presenter', 'Lecture', 'Course', 'Auth', 'Flash', lectureStoreController])
        .controller('LectureController', ['$rootScope', '$scope', '$location', '$log', 'Course', 'Lecture', LectureController])
        .controller('UploadLectureController', ['$scope', '$timeout', 'Upload', 'Vimeo', uploadLecture]);

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
            console.log(response);
            $scope.teachers = response;
        }, function(error) {
            console.log(error);
        });
        $scope.lecture = {};
        $scope.lecture.course = $routeParams.course_id;
        $scope.createLecture = function() {
            Lecture.save($scope.lecture, function(response) {
                console.log(response);
                Flash.create('success', 'Lecture has been created!');
                $location.path('/course/'+ $scope.lecture.course_id +'/view');
            }, function(error) {
                console.log("error: "+JSON.stringify(error));
            });
        }

        $scope.lectures = Course.getLecture({course_id: $routeParams.course_id});
        console.log($scope.lectures);
    }

    //LectureController
    function LectureController($rootScope, $scope, $location, $log, Course, Lecture) {
        $scope.teachers = [{
            id: 1,
            name: 'Liang Guo'
        }, {
            id: 2,
            name: 'Jiadong Hu'
        }, {
            id: 3,
            name: 'Yucheng Wang'
        }];
        console.log('lecture show');
    }

    function uploadLecture($scope, $timeout, Upload, Vimeo) {
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