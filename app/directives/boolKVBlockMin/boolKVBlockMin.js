/**
 * Created by Sergej Görzen on 04.09.2016.
 */
(function () {
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

                $scope.dnfResolution = "";
                $scope.knfResolution = "";
                $scope.showResolution = false;

                $scope.$on("showResult", function () {
                   $scope.dnfResolution = "test";
                   $scope.knfResolution = "test2";
                });

                $scope.knf.onTextChanged = function () {
                    $scope.knfResultState = 0;
                    $scope.knfResolution = "";
                };

                $scope.dnf.onTextChanged = function () {
                    $scope.dnfResultState = 0;
                    $scope.dnfResolution = "";
                };

                var colorMap = $scope.kv.colorMap;
                $scope.customLayers = colorMap.layers;

                colorMap.onChangedLayer = function() {
                    $timeout(function(){
                        $scope.$apply();
                    });
                };

                var compareKnfDnf = function(info){
                    var compareKnfB = new KVExprCompare(info.knf.expr);
                    var compareDnfB = new KVExprCompare(info.dnf.expr);
                    var compareDnfA = new KVExprCompare($scope.dnf);
                    var compareKnfA = new KVExprCompare($scope.knf);

                    $scope.knfResultState = compareKnfA.equals(compareKnfB) ? 1 : -1;
                    $scope.dnfResultState = compareDnfA.equals(compareDnfB) ? 1 : -1;
                };

                $scope.$on('checkLayerResults', function(){
                    var minimizeInfo = $scope.kv.minimize();
                    compareKnfDnf(minimizeInfo);

                     $scope.kv.canvas.clearColorContainer();

                     console.log($scope.kv);

                     //$scope.kv.colorMinimized('dnf');
                     //$scope.kv.colorMinimized('knf');
                });

                $scope.$on('removeColorLayer', function(layer){
                    colorMap.removeLayer(layer);
                });
            }
        };
    });
})();