/**
 * Created by Hu on 2016-02-07.
 */
(function() {
    'use strict';

    angular.module('naf.auth', [])
        .config(['$routeProvider', config]);

    function config($routeProvider){
        $routeProvider
            .when('/register', {
                templateUrl: 'views/auth/register.html',
                controller: 'AuthController'
            })
            .when('/', {
                templateUrl: 'views/auth/login.html',
                controller: 'AuthController'
            })
            .when('/forget-password', {
                templateUrl: 'views/auth/forget-password.html',
                controller: 'AuthController'
            });
    }
})();
