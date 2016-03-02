/**
 * Created by Hu on 2016-02-07.
 */
(function() {
    'use strict';

    angular.module('naf.auth')
        .controller('AuthController', ['$rootScope', '$scope', '$location', '$q', 'Auth', 'Flash',  authController]);

    //AuthController

    function authController($rootScope, $scope, $location, $q, Auth, Flash) {
        $scope.users = {};
        $scope.userTypes = ['presenter', 'attendee'];
        $scope.login = function() {
            var credential = {
                email: $scope.users.email,
                password: $scope.users.password
            };
           Auth.login(credential, function(respone){
               $rootScope.$broadcast('userLogin', respone.data);
               checkUserType(respone.data);
           }, function(err){
               Flash.create('danger', 'Please check your email or passwords');
               console.log(err);
               });
        };

        $scope.register = function() {
            var credential = {
                email: $scope.users.email,
                password: $scope.users.password,
                userType: $scope.users.type
            };
            console.log(credential);
            Auth.register(credential, function(respone){
                $rootScope.$broadcast('userRegister', respone.data);
                checkUserType(respone.data);
            }, function(error){
                console.log("error: "+JSON.stringify(error));
            });

        };

        function checkUserType(User) {
            switch (User.userType) {
                case 'presenter':
                    $location.path('/presenter/'+User._id);
                    break;
                case 'teacher':
                    $location.path('/teacher/'+User._id);
                    break;
                case 'attendee':
                    $location.path('/search');
                    break;
                default:
                    Auth.logout();
                    Flash.create('danger', 'Auth failed, please login again');
                    $location.path('/login');
            }

        }

    }
})();