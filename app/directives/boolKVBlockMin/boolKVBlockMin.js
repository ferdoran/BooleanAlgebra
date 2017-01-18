/**
 * Created by Sergej Görzen on 04.09.2016.
 */
var app = angular.module('boolean-algebra');

app.directive('boolKvBlockMin', function($timeout){
    return {
        restrict: 'E',
        replace:true,
        scope: {
            kv: "=bindKv"
        },
        templateUrl: "directives/boolKVBlockMin/boolKVBlockMin.html",
        link: function($scope, $element, $attr) {
            $scope.knf = new BAExpression();
            $scope.dnf = new BAExpression();

            var colorMap = $scope.kv.colorMap;
            $scope.customLayers = colorMap.layers;

            colorMap.onChangedLayer = function() {
                $timeout(function(){
                    $scope.$apply();
                });
            };

            $scope.$on('removeColorLayer', function(layer){
                colorMap.removeLayer(layer);
            });
        }
    };
});