(function() {
    angular.module('naf.config', [])
        .constant('Config', {
            api: 'http://localhost:3000/api/v1',
            vimeoApi: 'https://api.vimeo.com',
            imagePrefix:'http://127.0.0.1:3000/static/'
        });

})();