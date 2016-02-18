/**
 * Created by Leon on 2016/2/5.
 */
(function() {
    'use strict';

    angular.module('naf', [
        'ngRoute', 'ngResource', 'angular-storage', 'ngFileUpload', 'angular-jwt', 'flash',  'naf.presenter', 'naf.config', 'naf.teacher', 'naf.course', 'naf.lecture', 'naf.attendee',
        'naf.auth'])

        .config(['$httpProvider', configApp]);

    function configApp($httpProvider) {

        $httpProvider.interceptors.push('AuthInterceptor');
    }







})();
