/**
 * Created by Hu on 2016-03-03.
 */
(function(){
        'use strict';
    angular.module('naf')
        .directive('confirmDelete', [confirmDelete]);

    function confirmDelete() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.bind('click', function() {
                    var message = attrs.confirmDelete;
                    if (message && confirm(message)) {
                       scope.$apply(attrs.confirmDelete);
                    }
                });
            }
        }
    };
})();