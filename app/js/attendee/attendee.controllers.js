/**
 * Created by Hu on 2016-02-07.
 */
(function() {
    'use strict';

    angular.module('naf.course')
        .controller('PresenterViewController', ['$rootScope', '$scope', '$location', '$log', 'Presenter', 'Flash', presenterViewController])
        .controller('SearchController', ['$rootScope', '$scope', '$location', '$log', 'Presenter', 'Flash', SearchController]);

    //presenterViewController
    function presenterViewController($rootScope, $scope, $location, $log, Presenter, Flash) {

    }

    //SearchController
    function SearchController($rootScope, $scope, $location, $log, Presenter, Flash) {
        $scope.schools = [{
            id: 1,
            name: 'Humber College'
        }, {
            id: 2,
            name: 'Seneca College'
        }, {
            id: 3,
            name: 'Centennial College'
        }, {
            id: 4,
            name: 'George Brown College'
        }];
    }
})();