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

        search();

        function search(params) {
            if (!params) params = {};
            if($scope.school) {
                params.presenterId = $scope.school
            }
            if($scope.courseName) {
                params.courseName = $scope.courseName;
            }
            Search.search(params, function(result) {
                $scope.courses = result.data;
                $scope.currentPage = result.currentPage;
                $scope.limit = result.limit;
                $scope.pageCount = result.pageCount;
            });
        }

        $scope.getSearchPage = function(page, limit) {
            search({page:page, limit:limit});
        };

        $scope.getNumber = function(num) {
            return new Array(num);
        };
    }

})();