/**
 * Created by Sergej Görzen on 04.09.2016.
 */
var app = angular.module('boolean-algebra');

app.directive('boolKv', function($parse, $timeout, $sce){
    return {
        restrict: 'E',
        replace:true,
        scope:true,
        templateUrl: "directives/boolKV/boolKV.html",
        link: function($scope, $element, $attr) {
            var initColors = function () {
                var $colors = $element.find('.kvColor');
                $colors.each(function () {
                    var $this = angular.element(this);
                    $this.css('background-color', $this.data('color'));
                }).click(function(){
                    var $el = angular.element(this);
                    var color = $el.data('color');
                    if (color == "reset") {

                    }
                    $colors.removeClass('active');
                    $el.addClass('active');
                });
            };
            initColors();

            var kv = new BAKV({target: 'kvCanvasContainer', expr: new BAExpression("A∨B")});

            kv.generateKV(['A']);
            kv.generateKV(['A', 'B']);
            kv.generateKV(['A', 'B', 'C']);
            kv.generateKV(['A', 'B', 'C', 'D']);
            kv.generateKV(['A', 'B', 'C', 'D', 'E']);
            kv.generateKV(['A', 'B', 'C', 'D', 'E', 'F']);

            //$scope.kv = kv;
        }
    };
});