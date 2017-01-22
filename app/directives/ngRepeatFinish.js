/**
 * Created by Sergej on 18.11.2016.
 */
(function () {
    var app = angular.module('boolean-algebra');

    app.directive('onFinishRender', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function () {
                        scope.$emit(attr.onFinishRender);
                    });
                }
            }
        }
    });
})();