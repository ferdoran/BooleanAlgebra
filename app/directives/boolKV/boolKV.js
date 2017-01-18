/**
 * Created by Sergej Görzen on 04.09.2016.
 */
(function(){
    var app = angular.module('boolean-algebra');
    var _kvCounter = 0;
    app.directive('boolKv', function($parse, $timeout){
        return {
            restrict: 'E',
            replace:true,
            scope:true,
            templateUrl: "directives/boolKV/boolKV.html",
            link: function($scope, $element, $attr) {
                var cv = $element.find('#kvCanvasContainer');
                cv[0].id = 'kvCanvasContainer' + (_kvCounter++);

                var domain = app.domains[$attr.boolDomain];
                var expr = domain && !$attr.boolExpr ? domain.expression : new BAExpression($attr.boolExpr);

                var kv = new BAKV({target: cv[0].id, expr: expr});

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
                    $scope.$broadcast('checkLayerResults');


                    return;
                    kv.canvas.clearColorContainer();
                    var minimizeInfo = kv.minimize();
                    if (minimizeInfo.dnf.blocks.length <= minimizeInfo.knf.blocks.length) {
                        kv.colorMinimized('dnf');
                    } else {
                        kv.colorMinimized('knf');
                    }
                };

                if (domain) {
                    domain.refreshKV = function (_expr) {
                        if (domain.toKV) $timeout.cancel(domain.toKV);
                        domain.toKV = $timeout(function(){
                            kv.setExpr(expr = _expr);
                            kv.generateKV();
                        },50);
                    };
                }

                kv.generateKV();

                $scope.kv = kv;
            }
        };
    });
})();