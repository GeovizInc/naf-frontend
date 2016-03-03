/**
 * Created by Hu on 2016-02-07.
 */
(function() {
    'use strict';

    angular.module('naf.course')
        .factory('Course', ['$resource', 'Config', courseFactory]);

    //Course service

    function courseFactory($resource, Config) {
        return $resource(Config.api + '/course/:course_id', {}, {
            //update course info*/
            update: {
                url: Config.api + '/course',
                method: 'PUT'
            },
            //delete course
            remove: {
                url: Config.api + '/course/delete',
                method: 'POST'
            },
            // get lecture list of the course
            getLecture: {
                url: Config.api + '/course/:course_id/lectures',
                method: 'GET',
                params: {course_id: '@course_id'},
                isArray: true
            }

        });
    }
})();