/**
 * Created by Hu on 2016-02-07.
 */
(function() {
    'use strict';

    angular.module('naf.course')
        .controller('PresenterViewController', ['$rootScope', '$scope', '$location', '$log', '$routeParams', 'Presenter', 'Auth', 'Flash', presenterViewController])
        .controller('SearchController', ['$rootScope', '$scope', '$location', '$log', 'Presenter', 'Flash', SearchController]);

    //presenterViewController
    function presenterViewController($rootScope, $scope, $location, $log, $routeParams, Presenter, Auth, Flash) {
        $scope.user = null;
        $scope.presenter = null;
        if(Auth._user) {
            $scope.user = Auth._user;
        }
        console.log($routeParams.presenter_id);
        getPresenterInfo();
        function getPresenterInfo() {
            Presenter.get({presenter_id: $routeParams.presenter_id},
                function(response) {
                    console.log(response);
                    $scope.presenter = response;
                }, function(error) {
                    Flash.create('danger','There is no such Presenter !');
                    $location.path('/search');
                });
        }

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