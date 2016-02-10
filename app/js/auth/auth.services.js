/**
 * Created by Hu on 2016-02-07.
 */
(function() {
    'use strict';

    angular.module('naf.auth')
        .factory('Auth', ['$resource', authFactory]);

    //Auth service

    function authFactory($resource) {
        return {

        };
    }

})();