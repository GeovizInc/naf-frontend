/**
 * Created by Hu on 2016-02-06.
 */
(function() {
    'use strict';

    angular.module('naf.presenter')
        .factory('Presenter', ['$resource', 'Config', presenterFactory]);

    //Presenter service

    function presenterFactory($resource, Config) {
        return $resource(Config.api + '/presenter/:presenter_id', {}, {

            get: {
                method: 'GET',
                params: {presenter_id: '@presenter_id'}
            },
            //update presenter profile*/
            update: {
                url: Config.api + '/presenter',
                method: 'PUT'
            },
            //
            uploadImage: {
                url: Config.api +'/presenter/:presenter_id/image',
                params: {presenter_id: '@presenter_id'},
                method: 'POST',
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            },
            // get teacher list of the presenter
            getTeachers: {
                url: Config.api + '/presenter/:presenter_id/teachers',
                method: 'GET',
                params: {presenter_id: '@presenter_id'},
            },
            // get courses list of the presenter
            getCourses: {
                url: Config.api + '/presenter/:presenter_id/courses',
                method: 'GET',
                params: {presenter_id: '@presenter_id'}
            },
            //get upcoming lectures list of the presenter
            getLectures: {
                url: Config.api + '/presenter/:presenter_id/lectures',
                method: 'GET',
                params: {presenter_id: '@presenter_id'},
                isArray: true
            },
            list: {
                url: Config.api + '/presenter',
                method: 'GET',
                isArray: true
            },
            getLectureLimit: {
                url: Config.api + '/presenter/lectureslimit',
                method: 'GET'
            },
            getCredentials: {
                url: Config.api + '/presenter/credentials',
                method: 'GET'
            },
            updateZoomCred: {
                url: Config.api + '/presenter/zoom',
                method: 'PUT'
            },
            updateVimeoCred: {
                url: Config.api + '/presenter/vimeo',
                method: 'PUT'
            }
        });
    }

})();