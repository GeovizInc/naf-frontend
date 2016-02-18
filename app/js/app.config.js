(function() {
    angular.module('naf.config', [])
        .constant('Config', {
            api: 'http://localhost:3000/api/v1',
            vimeoApi: 'https://api.vimeo.com'
        });

})();