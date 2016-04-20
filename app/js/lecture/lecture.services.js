/**
 * Created by Hu on 2016-02-07.
 */
(function() {
    'use strict';

    angular.module('naf.lecture')
        .factory('Lecture', ['$resource', 'Config', lectureFactory])
        .factory('Vimeo', ['$resource', 'Config', vimeoFactory]);

    //Lecture service

    function lectureFactory($resource, Config) {
        return $resource(Config.api + '/lecture/:lecture_id', {}, {
            //update lecture info*/
            update: {
                url: Config.api + '/lecture',
                method: 'PUT'
            },
            //delete Lecture
            remove: {
                url: Config.api + '/lecture/delete',
                method: 'POST'
            },

            uploadImage: {
                url: Config.api +'/lecture/:lecture_id/image',
                params: {lecture_id: '@lecture_id'},
                method: 'POST',
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }
        });
    }

    function vimeoFactory($resource, Config){
        return $resource(Config.vimeoApi + '/', {}, {
            getUser: {
                url: Config.vimeoApi + '/me',
                method: 'GET'
            },
            getTicket: {
                url: Config.vimeoApi + '/me/videos',
                method: 'POST'
            },
            deleteTicket: {
                url: Config.vimeoApi + '/users/:userId/tickets/:ticketId',
                method: 'DELETE',
                params: {
                    userId: '@userId',
                    ticketId: '@ticketId'
                },
                transformResponse: function(data, headers){
                    var response = {};
                    response.data = data;
                    response.headers = headers();
                    return response;
                }
            }
        });
    }
})();