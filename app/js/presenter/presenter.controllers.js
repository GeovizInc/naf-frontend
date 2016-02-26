/**
 * Created by Hu on 2016-02-06.
 */
(function() {
    'use strict';

    angular.module('naf.presenter')
        .controller('PresenterEditController', ['$rootScope', '$scope', '$location', '$log', '$routeParams', 'Auth', 'Presenter', 'Flash', presenterEditController]);

    //PresenterEditController

    function presenterEditController($rootScope, $scope, $location, $log, $routeParams, Auth, Presenter, Flash) {
        $scope.user = null;
        //check current user
        if(!Auth._user) {
            $location.path('/login');
        } else if( Auth._user._id != $routeParams.presenter_id) {
            Flash.create('danger', 'Only presenter can edit their own profile !');
            $location.path('/presenter/'+$routeParams.presenter_id);
        }
        $scope.user = Auth._user;
        //update userinfo
        $scope.update = function() {
            var presenter = {
                _id: $scope.user._id,
                name: $scope.user.name,
                location:$scope.user.location,
                description: $scope.user.description,
                imageLink: $scope.user.imageLink
            }
            Presenter.update(presenter, function(response){
                Flash.create('success',"Update Successful");
                $location.path('/presenter/'+$routeParams.presenter_id);
            }, function(error){
                Flash.create('danger',"Can not updata your profile due to"+error.data);
                console.log(error);
            });
        };

        //change passwords


    }
})();