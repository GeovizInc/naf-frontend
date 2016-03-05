/**
 * Created by Hu on 2016-02-07.
 */
(function() {
    'use strict';

    angular.module('naf.auth')
        .factory('Auth', ['$rootScope', '$resource', 'Config', 'store', authFactory])
        .factory('AuthInterceptor', ['$location', '$q', '$injector', 'store', 'jwtHelper', authInterceptor]);
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
            },

            changePassword: {
                url: Config.api + '/auth',
                method: 'PUT',
            },

            checkEmail: {
                url: Config.api + '/email/:email',
                Method: 'GET',
                params: {email: '@email'}
            }
        });

        function logout() {
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
            changePassword: authMethod.changePassword,
            checkEmail: authMethod.checkEmail,
            logout: logout
        };
        getInfo();
        return auth;

    }

    //AuthInterceptor
    function authInterceptor($location, $q, $injector, store, jwtHelper) {
        var excpetions = [
            'api.vimeo.com',
            'cloud.vimeo.com'
        ];
        function isExcepted(URLStr) {
            try {
                var url = new URL(URLStr);
                console.log(url.host);
                for(var i = 0; i < excpetions.length; i++) {
                    if(excpetions[i] === url.host) return true;
                }
            } catch(exception) {

            }
            return false;
        }
        var interceptor = {
            request : function(request) {
                if(isExcepted(request.url)) return request;
                var Auth = $injector.get('Auth');
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
                if(isExcepted(response.config.url)) return response;
                var Auth = $injector.get('Auth');
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
                var Auth = $injector.get('Auth');
                if(rejection.status === 401){
                   // Flash.create('danger', 'Error Please Login!');
                    console.log(rejection.data);
                    Auth.logout();
                    $location.path('/login').replace();
                }
                return $q.reject(rejection);
            }


        };
        return interceptor;

    }

})();