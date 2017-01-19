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
            $scope.knfResultState = 0;
            $scope.dnfResultState = 0;

            $scope.knf.onTextChanged = function () {
                $scope.knfResultState = 0;
            };

            $scope.dnf.onTextChanged = function () {
                $scope.dnfResultState = 0;
            };

            var colorMap = $scope.kv.colorMap;
            $scope.customLayers = colorMap.layers;

            colorMap.onChangedLayer = function() {
                $timeout(function(){
                    $scope.$apply();
                });
            };

            var compareKnfDnf = function(info){
                var compareKnfB = new KVExprCompare(info.knf.expr.text);
                var compareDnfB = new KVExprCompare(info.dnf.expr.text);
                var compareDnfA = new KVExprCompare($scope.dnf.text);
                var compareKnfA = new KVExprCompare($scope.knf.text);

                $scope.knfResultState = compareKnfA.equals(compareKnfB) ? 1 : -1;
                $scope.dnfResultState = compareDnfA.equals(compareDnfB) ? 1 : -1;
            };

            $scope.$on('checkLayerResults', function(){
                var minimizeInfo = $scope.kv.minimize();
                compareKnfDnf(minimizeInfo);
                /*
                 $scope.kv.canvas.clearColorContainer();
                if (minimizeInfo.dnf.blocks.length <= minimizeInfo.knf.blocks.length) {
                    $scope.kv.colorMinimized('dnf');
                } else {
                    $scope.kv.colorMinimized('knf');
                }*/
            });

            $scope.$on('removeColorLayer', function(layer){
                colorMap.removeLayer(layer);
            });
        }
    };
});