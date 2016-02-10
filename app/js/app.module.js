<<<<<<< HEAD
/**
 * Created by Leon on 2016/2/5.
 */
(function() {
    'use strict';

    angular.module('naf', [
        'ngRoute', 'naf.presenter', 'naf.teacher', 'naf.course', 'naf.lecture', 'naf.attendee',
        'naf.auth'])




})();
=======
'use strict';

// Declare app level module which depends on views, and components
angular.module('naf', [
    'ngRoute',
    'ngResource',
    'naf.config',
    'naf.lecture'
]).
config(['$routeProvider', function ($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/'});
}]);
>>>>>>> e09bd350ea5e2633a67b0ba9dee492975b3d9025
