/**
 * Created by Hu on 2016-02-07.
 */
(function() {
    'use strict';

    angular.module('naf.lecture')
        .factory('Lecture', ['$resource', 'Config', lectureFactory]);

    //Lecture service

    function lectureFactory($resource, Config) {
        return $resource(Config.api + '/lecture/:lecture_id', {}, {
            //update lecture info*/
            update: {
                url: Config.api + '/lecture',
                method: 'PUT'
            }
        });
    }
})();