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
        }
        Presenter.get({presenter_id: Auth._user._id},
            function(response) {
                console.log(response);
                $scope.user = response;
            }, function(error) {
                Flash.create('danger','There is no such Presenter !');
                $location.path('/search');
            });
        //update userinfo
        $scope.update = function() {
            var presenter = {
                _id: $scope.user._id,
                name: $scope.user.name,
                location:$scope.user.location,
                description: $scope.user.description,
                imageLink: $scope.user.imageLink
            };
            Presenter.update(presenter, function(response){
                Flash.create('success',"Update Successful");
                $location.path('/presenter/'+$scope.user._id);
            }, function(error){
                Flash.create('danger',"Can not updata your profile due to"+error.data);
                console.log(error);
            });
        };

        //change passwords
        $scope.changePassword = function() {
              if(!$scope.currentPassword){
                  Flash.create('danger', 'Please enter Current Password');
                  return;
              }else if(!$scope.password || $scope.password != $scope.confirmPassword) {
                  Flash.create('danger', 'Passwrods you entered are different');
                  return;
              }
              var passwords = {
                  id: $scope.user._id,
                  currentPassword: $scope.currentPassword,
                  password: $scope.password
              };
                Auth.changePassword(passwords, function(response) {
                    Flash.create('success', 'Passwords changed');
                    $scope.currentPassword = null;
                    $scope.password = null;
                    $scope.confirmPassword = null;
                    }, function(error) {
                    Flash.create('danger', error.data.message);
                    console.log(error);
                    });
        };


        //list course
    }
})();