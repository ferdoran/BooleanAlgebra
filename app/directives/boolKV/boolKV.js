/**
 * Created by Sergej Görzen on 04.09.2016.
 */
var app = angular.module('boolean-algebra');
var _kvCounter = 0;
app.directive('boolKv', function($parse, $timeout, $sce){
    return {
        restrict: 'E',
        replace:true,
        scope:true,
        templateUrl: "directives/boolKV/boolKV.html",
        link: function($scope, $element, $attr) {
            var cv = $element.find('#kvCanvasContainer');
            cv[0].id = 'kvCanvasContainer' + (_kvCounter++);
            var kv = new BAKV({target: cv[0].id, expr: new BAExpression($attr.boolExpr)});

            var $colors;
            var initColors = function () {
                $colors = $element.find('.kvColor');
                $colors.each(function () {
                    var $this = angular.element(this);
                    if ($this.hasClass('active')) {
                        var startColor = $this.data('color');
                        kv.setSelectColor(startColor);
                    }
                    $this.css('background-color', $this.data('color'));
                }).click(function(){
                    var $el = angular.element(this);
                    var color = $el.data('color');
                    if (color == "reset") {
                        kv.setSelectColor(null);
                    } else {
                        kv.setSelectColor(color);
                    }
                    $colors.removeClass('active');
                    $el.addClass('active');
                });
            };
            initColors();

            $scope.checkResult = function(){
            };

            kv.generateKV();

            var minimizeInfo = kv.minimize();
            console.log(minimizeInfo);

            kv.colorMinimized('dnf');
        }
    };
});