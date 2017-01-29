/**
 * Created by Sergej Görzen on 04.09.2016.
 */
(function () {
    var app = angular.module('boolean-algebra');

    app.directive('boolKvBlockInput', function($timeout){
        return {
            restrict: 'E',
            replace:true,
            scope:{
                layer: "=bindLayer"
            },
            templateUrl: "directives/boolKVBlockInput/boolKVBlockInput.html",
            link: function($scope, $element, $attr) {
                var expression = $scope.layer.expression;

                $scope.showResolution = false;

                expression.onTextChanged = function () {
                  $scope.showResolution = false;
                };

                $scope.$on("showResult", function () {
                    var $resInput = $element.find('.result-input .input');
                    var resExpr = $scope.layer.getBlocksExpr();
                    $resInput.html(resExpr.getHtml());
                    $scope.showResolution = true;
                });

                $scope.$on('checkLayerResults', function () {
                    $scope.layer.checkExpression();
                });
            }
        };
    });
})();