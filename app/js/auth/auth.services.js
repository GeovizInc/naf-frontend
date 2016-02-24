/**
 * Created by Hu on 2016-02-07.
 */
(function() {
    'use strict';

    angular.module('naf.auth')
        .factory('AuthInterceptor', ['$location', '$q', 'store', 'jwtHelper', 'Flash', authInterceptor])
        .factory('Auth', ['$rootScope', '$resource', 'Config', 'store', authFactory]);


    //Auth service

    function authFactory($rootScope,$resource,Config,store) {

        var authInterceptor = {
            response: function (response) {
                auth._token=response.headers('Authorization');
                auth._user = response.data;
                store.set('token', auth._token);
                store.set('user', auth._user);
                auth.loggedIn = auth._token && auth._user;
                return response;
            }
        };

        function getInfo() {
            auth._token = store.get('token');
            auth._user = store.get('user');
            auth.loggedIn = auth._token && auth._user;
        }

        var authMethod = $resource(Config.api, {}, {
            register: {
                url: Config.api + '/auth/register',
                method: 'POST',
                interceptor: authInterceptor
            },

            login: {
                url: Config.api + '/auth/login',
                method: 'POST',
                interceptor: authInterceptor
            }
        });

        function Logout(){
            store.remove('token');
            store.remove('user');
            auth._token = null;
            auth._user = null;
            auth.loggedIn = auth._token && auth._user;
            $rootScope.$broadcast('userLogout');
        }

        var auth = {
            _token: null,
            _user: null,
            loggedIn: false,
            register: authMethod.register,
            login: authMethod.login,
            logout: Logout

        };
        getInfo();
        return auth;

    }

    //AuthInterceptor
    function authInterceptor($location, $q, store, jwtHelper, Auth, Flash) {
        var interceptor = {
            request : function(request) {
                var token = Auth._token;
                if (token) {
                    request.headers.Authorization = token;
                }
                console.log('request sent');
                return request;
            },

            requestError: function(rejectReason) {
                return $q.reject(rejectReason);
            },

            response : function(response) {
                var oldToken = store.get('token'),
                    newToken = response.headers('Authorization');
                if(newToken && !jwtHelper.isTokenExpired(newToken) && (newToken !== oldToken)) {
                    store.set('token',newToken);
                    Auth._token = newToken;
                } else if(newToken && jwtHelper.isTokenExpired(newToken) && (newToken === oldToken)){
                   // Flash.create('danger', 'Error Please Login!');
                    Auth.logout();
                    $location.path('/register').replace();
                }
                console.log('response received');
                return response;
            },

            responseError : function(rejection) {
                if(rejection.status === 401){
                   // Flash.create('danger', 'Error Please Login!');
                    console.log(rejection.data.error);
                    Auth.logout();
                    $location.path('/login').replace();
                }
                return $q.reject(rejection);
            }


        };
        return interceptor;

    }

})();