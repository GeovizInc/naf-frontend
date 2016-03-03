/**
 * Created by Hu on 2016-02-07.
 */
(function() {
    'use strict';

    angular.module('naf.search')
        .controller('SearchViewController', ['$routeParams', '$scope', '$location', '$log', 'Search', 'Presenter', 'Flash', searchViewController]);

    function searchViewController($routeParams, $scope, $location, $log, Search, Presenter, Flash) {
        $scope.courseName = $routeParams.courseName || '';
        $scope.school = false;
        $scope.schools = Presenter.list({});
        $scope.search = search;
        function search() {
            var params = {};
            if($scope.school) {
                params.presenterId = $scope.school._id
            }
            if($scope.courseName) {
                params.courseName = $scope.courseName;
            }
            $scope.courses = Search.search(params);
        }
        search();
    }

})();