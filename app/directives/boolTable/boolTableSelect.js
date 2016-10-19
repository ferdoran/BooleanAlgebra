/**
 * Created by Sergej on 19.10.2016.
 */
var app = angular.module('boolean-algebra');

app.directive('boolTableSelect', function($parse, $sce) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: "directives/boolTable/boolTableSelect.html",
        scope: {
            group: '=',
            expression: '=bindExpression'
        },
        link: function ($scope, $element, $attr) {

        }
    };
});