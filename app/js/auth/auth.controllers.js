/**
 * Created by Hu on 2016-02-07.
 */
(function() {
    'use strict';

    angular.module('naf.auth')
        .controller('AuthController', ['$rootScope', '$scope', '$location', "$q", authController])

    //AuthController

    function authController($rootScope, $scope, $location, $q) {
        $scope.users = {};
        $scope.userTypes = ['Presenter', 'Attendee'];
        $scope.login = function() {
            check($scope.users.email, $scope.users.password)
                .then(function(data){
                    console.log(data);
                    $location.path('/register').replace();
                }, function(err){
                    console.log(err);
                })
        }

        function check(email, password){
            var defereed = $q.defer();
            if(email == '123@gmail.com' && password == '123456'){
                defereed.resolve('Yes');
            } else{
                defereed.reject('No');
            }
            return defereed.promise;
        }
    }
})();