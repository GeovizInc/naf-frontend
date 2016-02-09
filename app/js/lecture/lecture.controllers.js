/**
 * Created by Hu on 2016-02-07.
 */
(function() {
    'use strict';

    angular.module('naf.lecture')
        .controller('LectureController', ['$rootScope', '$scope', '$location', '$log', 'Course', 'Lecture', 'Flash', LectureController])
        .controller('UploadLectureController', ['$scope', 'Vimeo', uploadLecture]);

    //LectureController
    function LectureController($rootScope, $scope, $location, $log, Course, Lecture, Flash) {

    }

    function uploadLecture($scope, Vimeo){
        $scope.uploadVideo = function(){
            Vimeo.getUser({access_token: 'e1cddd3d70aec0bda315833b9d820215'},
                function(data){
                    $scope.vimeoUser = data;
                    console.log($scope.vimeoUser.upload_quota);
                },
                function(error){

                }
            );
        };
    }

})();