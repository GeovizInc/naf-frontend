/**
 * Created by Hu on 2016-02-06.
 */
(function() {
    'use strict';

    angular.module('naf.presenter')
        .controller('PresenterEditController', ['$rootScope', '$scope', '$location', '$log', 'Auth', 'Presenter', 'Flash', presenterEditController]);

    //PresenterEditController

    function presenterEditController($rootScope, $scope, $location, $log, Auth, Presenter, Flash) {
        $scope.user = Auth._user;
        $scope.update = function() {
            var presenter = {
                _id: $scope.user._id,
                name: $scope.user.name,
                description: $scope.user.description,
                imageLink: $scope.user.imageLink
            }
            Presenter.update(presenter, function(response){
                console.log('update successful');
            }, function(error){
                console.log(error);
            });
        };


    }
})();