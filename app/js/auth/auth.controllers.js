/**
 * Created by Hu on 2016-02-07.
 */
(function() {
    'use strict';

    angular.module('naf.auth')
        .controller('AuthController', ['$rootScope', '$scope', '$location', "$q", "Auth",  authController])

    //AuthController

    function authController($rootScope, $scope, $location, $q, Auth) {
        $scope.users = {};
        $scope.userTypes = ['Presenter', 'Attendee'];
        $scope.login = function() {
            var credential = {
                email: $scope.users.email,
                password: $scope.users.password
            }
           Auth.login(credential, function(respone){
               $location.path('/register').replace();
           }, function(err){
               console.log(err);
               });
        };

        $scope.register = function() {
            var credential = {
                email: $scope.users.email,
                password: $scope.users.password,
                userType: $scope.users.type
            };
            Auth.register(credential, function(respone){
                console.log("success: "+JSON.stringify(respone.data));
            }, function(error){
                console.log("error: "+JSON.stringify(error));
            });

        };

    }
})();