/**
 * Created by Leon on 2016/2/5.
 */
(function() {
    'use strict';

    angular.module('naf', ['ngRoute', 'ngResource', 'angular-storage', 'ngFileUpload', 'angular-jwt', 'flash', 'ngDialog',
        'naf.presenter', 'naf.config', 'naf.teacher', 'naf.course', 'naf.lecture', 'naf.attendee', 'naf.auth', 'naf.search'])
        .controller('MainController',['$rootScope', '$scope', '$location', '$log', 'Presenter', 'Auth', 'Flash', mainController])
        .config(['$httpProvider', configApp]);

    function configApp($httpProvider) {

        $httpProvider.interceptors.push('AuthInterceptor');
    }

    function mainController($rootScope, $scope, $location, $log, Presenter, Auth, Flash) {
        $scope.loggedIn = null;
        $scope.user = null;

        $rootScope.$on('userLogin', function(event, user) {
            $scope.loggedIn = Auth.loggedIn;
            $scope.user = Auth._user;
        });

        $rootScope.$on('userRegister', function(event, user) {
            $scope.loggedIn = Auth.loggedIn;
            $scope.user = Auth._user;
        });

        $rootScope.$on('userLogout', function(event, user) {
            $scope.loggedIn = null;
            $scope.user = null;
        });

        $scope.logout = function() {
            Auth.logout();
            $scope.loggedIn = Auth.loggedIn;
            $scope.user = Auth._user;
            $location.path('/login');
        };

        $scope.viewProfile = function() {
            if($scope.user.userType == 'presenter') {
                $location.path('/presenter/'+$scope.user._id);
            }
        };

        function getCurrentUser() {
            $scope.loggedIn = Auth.loggedIn;
            $scope.user = Auth._user;
        }

        getCurrentUser();

    }





})();
