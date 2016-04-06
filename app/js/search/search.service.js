(function() {
    'use strict';

    angular.module('naf.search')
        .factory('Search', ['$resource', 'Config', searchFactory]);

    function searchFactory($resource, Config){
        return $resource(Config.api + '/search', {}, {
            search: {
                url: Config.api + '/search',
                method: 'GET'
            }
        });
    }
})();