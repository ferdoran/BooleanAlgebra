/**
 * Created by Sergej Görzen on 04.09.2016.
 */
var app = angular.module('boolean-algebra');

app.directive('boolKvBlockInput', function($parse, $sce){
    return {
        restrict: 'E',
        replace:true,
        scope:{
            layer: "=bindLayer"
        },
        templateUrl: "directives/boolKVBlockInput/boolKVBlockInput.html",
        link: function($scope, $element, $attr) {
            var expression = $scope.layer.expression;
        }
    };
});