/**
 * Created by Ethan on 2/15/2016.
 */

(function(){
    'use strict';

    angular.module('naf')
        .directive('dateTimePicker', ['$compile', dateTimePicker])
        .directive('select2', ['$timeout', '$parse', select2]);

    function dateTimePicker($compile) {
        return {
            restrict: 'E',
            replace: true,
            template: '<div><input type="text"/></div>',
            link: function($scope, element, attr) {
                var attributes, dateFormat, input, resetValue;
                dateFormat = '';
                attributes = element.prop('attributes');
                resetValue = false;
                input = element.find('input');
                angular.forEach(attributes, function(e) {
                    if (e.name === 'class') {
                        element.removeAttr(e.name);
                        input.attr(e.name, e.value);
                    }
                    if (e.name === 'placeholder') {
                        element.removeAttr(e.name);
                        input.attr(e.name, e.value);
                    }
                    if (e.name === 'date-format') {
                        return dateFormat = e.value;
                    }
                });

                input.datetimepicker({
                    format: dateFormat,
                    icons: {
                        time: 'fa fa-clock-o',
                        date: 'fa fa-calendar',
                        up: 'fa fa-arrow-up',
                        down: 'fa fa-arrow-down'
                    }
                });
                element.on("dp.change", function(e) {
                    return $scope.$apply(function() {
                        var i, obj, objPath, path, _i, _len, _results;
                        if (e.date) {
                            objPath = attr.ngModel.split(".");
                            obj = $scope;
                            _results = [];
                            for (i = _i = 0, _len = objPath.length; _i < _len; i = ++_i) {
                                path = objPath[i];
                                if (!obj[path]) {
                                    obj[path] = {};
                                }
                                if (i === objPath.length - 1) {
                                    if (resetValue) {
                                        resetValue = false;
                                        _results.push(obj[path] = null);
                                    } else {
                                        _results.push(obj[path] = e.date.format(dateFormat));
                                    }
                                } else {
                                    _results.push(obj = obj[path]);
                                }
                            }
                            return _results;
                        }
                    });
                });
                $scope.$watch(attr.ngModel, function(newValue, oldValue) {
                    if (oldValue && !newValue) {
                        return resetValue = true;
                    }
                });
                return $compile(input)($scope);
            }
        };
    }

    function select2($timeout) {
        return {
            restrict: 'E',
            replace: true,
            template: '<select><option value="">...</option></select>',
            link: function ($scope, element, attr) {
                var attributes, option;
                attributes = element.prop('attributes');
                option = element.find('option');
                angular.forEach(attributes, function (e) {
                    if (e.name === 'default-option') {
                        option.html(e.value);
                    }
                });

                $timeout(function () {
                    element.select2();
                    element.select2Initialized = true;
                });

                var refreshSelect = function () {
                    if (!element.select2Initialized) return;
                    $timeout(function () {
                        element.trigger('change');
                    });
                };

                var recreateSelect = function () {
                    if (!element.select2Initialized) return;
                    $timeout(function () {
                        element.select2('destroy');
                        element.select2();
                    });
                };

                $scope.$watch(attr.ngModel, refreshSelect);

                if (attr.ngOptions) {
                    var list = attr.ngOptions.match(/ in ([^ ]*)/)[1];
                    // watch for option list change
                    $scope.$watch(list, recreateSelect);
                }

                if (attr.ngDisabled) {
                    $scope.$watch(attr.ngDisabled, refreshSelect);
                }
            }
        };
    }
})();