/**
 * Created by Hu on 2016-02-07.
 */
(function() {
    'use strict';

    angular.module('naf.lecture')
        .controller('LectureController', ['$rootScope', '$scope', '$location', '$log', 'Course', 'Lecture', 'Flash', LectureController])
        .controller('UploadLectureController', ['$scope', 'Upload', 'Vimeo', uploadLecture]);

    //LectureController
    function LectureController($rootScope, $scope, $location, $log, Course, Lecture, Flash) {

    }

    function uploadLecture($scope, Upload, Vimeo){
        var accessToken = 'e1cddd3d70aec0bda315833b9d820215';
        $scope.uploadVideo = function(videoFile){
            Vimeo.getUser(
                {access_token: accessToken},
                function(data){
                    var userId = getUserIdByUserUri(data.uri);
                    var userQuota = data.upload_quota;
                    var fileSize = videoFile.size;
                    if(!userQuota.quota.hd || !userQuota.quota.sd) return false;
                    if(userQuota.space.free < fileSize) return false;

                    Vimeo.getTicket(
                        {
                            access_token: accessToken,
                            type: 'streaming'
                        },
                        {},
                        function(data){
                            var ticketId = data.ticket_id;
                            var uploadLinkSecure = data.upload_link_secure;
                            var completeUri = data.complete_uri;

                            var fileReader = new FileReader();
                            fileReader.readAsArrayBuffer(videoFile);
                            fileReader.onload = function(e) {
                                Upload.http({
                                    url: uploadLinkSecure,
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': videoFile.type
                                    },
                                    data: e.target.result
                                }).then(function(response) {
                                    console.log(response);
                                    if(response.status == 200){
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
                                            function(data){
                                                console.log(data);
                                            },
                                            function(error){

                                            }
                                        );
                                    }
                                }, null, function(evt) {
                                    console.log(evt);
                                });
                            };

                        },
                        function(error){

                        }

                    );
                },
                function(error){

                }
            );
        };
    }

    function getCompleteUriParams(completeUri){
        var paramKeyVideoFileId = 'video_file_id=';
        var paramKeyUpgrade = 'upgrade=';
        var paramKeySignature = 'signature=';
        var videoFileId = completeUri.substring(completeUri.indexOf(paramKeyVideoFileId) + paramKeyVideoFileId.length, completeUri.indexOf(paramKeyUpgrade) -1);
        var upgrade = completeUri.substring(completeUri.indexOf(paramKeyUpgrade) + paramKeyUpgrade.length, completeUri.indexOf(paramKeySignature) -1);
        var signature = completeUri.substring(completeUri.indexOf(paramKeySignature) + paramKeySignature.length);
        return {
            videoFileId: videoFileId,
            upgrade: upgrade,
            signature: signature
        }
    }

    function getUserIdByUserUri(userUri){
        return userUri.substring('/users/'.length);
    }

})();