/**
 * Created by Hu on 2016-02-07.
 */
(function() {
    'use strict';

    angular.module('naf.teacher')
        .factory('Teacher', ['$resource', 'Config', teacherFactory]);

    // Teacher service

    function teacherFactory($resource, Config){
        return $resource(Config.api + '/teacher/:teacher_id', {}, {
            //update teacher profile*/
            update: {
                url: Config.api + '/teacher',
                method: 'PUT'
            },
            // URL error? get courses list of the teacher
            getCourses: {
                url: Config.api + '/teacher/:teacher_id/courses',
                method: 'GET',
                params: {teacher_id: '@teacher_id'},
            },
            // URL error? get lecture list of the teacher
            getLecture: {
                url: Config.api + '/teacher/:teacher_id/lectures',
                method: 'GET',
                params: {teacher_id: '@teacher_id'},
            },
            getVimeoCred: {
                url: Config.api + '/teacher/getVimeoCred',
                method: 'GET'
            }
        })
    }
})();