/**
 * Created by Sergej on 18.10.2016.
 */
(function(){
    var app = angular.module('boolean-algebra');

    app.directive('contenteditable', function($timeout) {
        return {
            restrict: 'A',
            scope: {
                expression: '=bindExpression',
                layer: '='
            },
            link: function($scope, $element, $attr) {
                var expression = $scope.expression || $scope.layer.expression;

                var isForbiddenKey = function(e) {
                    return e.keyCode == KEY_SPACE || e.keyCode == KEY_COMMA || e.keyCode == KEY_DOT || e.keyCode == KEY_LINE || e.keyCode == KEY_SHARP
                        || e.keyCode == KEY_PLUS || e.key == '-' || e.key == '*' || e.key == '+' || e.key == '/';
                };
                var refreshTable = function(){
                    if (!expression.domain || !expression.domain.tableRefresh) return false;
                    var domain = expression.domain;
                    domain.tableRefresh();
                };

                var to;
                $element.on('keydown', function(e){
                    if (isForbiddenKey(e)) {
                        e.preventDefault();
                        return false;
                    }
                }).on('keyup change', function(e){
                    if (e.type == "keyup") {
                        if (e.keyCode == KEY_CONTROL || e.keyCode == KEY_SPACE) {
                            e.preventDefault();
                            return false;
                        }
                        if (e.keyCode == KEY_LEFT || e.keyCode == KEY_RIGHT || e.keyCode == KEY_DOWN || e.keyCode == KEY_UP) {
                            return true;
                        }
                    }

                    $timeout.cancel(to);

                    to = $timeout(function(){
                        var text = $element.text();
                        expression.parse(text);

                        var position = DomUtils.getCaretCharacterOffsetWithin($element.get(0));
                        $element.html(expression.getHtml());
                        DomUtils.setCaretPosition($element.get(0), position);

                        if (text.length == 0) return;
                        refreshTable();
                    },50);
                });
            }
        }
    });
    app.directive('boolExpr', function($parse, $sce, $timeout) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: "directives/boolExpr/boolExpr.html",
            scope: {
                group: '=',
                layer: '=',
                expression: '=bindExpression'
            },
            link: function ($scope, $element, $attr) {
                var $input = $element.find('.input');

                var updateExpressions = function(newGroup){
                    if (!domain) return;
                    BAGroup.useGroup(domain.expression, newGroup);
                    if (domain.resizeTable) {
                        domain.resizeTable();
                    }
                };

                if ($scope.layer) {
                    $scope.expression = $scope.layer.expression;
                }
                else if ($scope.group) {
                    $scope.expression = $scope.group.expression;
                } else if (!$scope.expression) {
                    $scope.expression = new BAExpression($attr.boolValue || '');
                }
                $input.html($scope.expression.getHtml());

                $scope.isColorBox = $attr.boolSymbol.charAt(0) == '#';

                $scope.symbol = $attr.boolSymbol;
                $scope.symbolSmall = $attr.boolSymbolSmall;

                if ($scope.isColorBox) {
                    $timeout(function(){
                        var color = $attr.boolSymbol;
                        var $colorBox = $element.find('.colorBox');//
                        $colorBox.css("background-color", color);
                    });
                }

                $scope.expression.$input = $input;

                var domain = app.domains[$attr.boolDomain];
                if (domain && !$scope.group) {
                    domain.expression = $scope.expression;
                }

                $scope.expression.domain = domain;

                if ($scope.group) {
                    updateExpressions($scope.group);
                }

                $scope.addChar = function(char){
                    $input.focus();
                    DomUtils.pasteHtmlAtCaret(char);
                    $input.change();
                };

                $scope.clearText = function(){
                    $scope.expression.parse("");
                    $scope.expression.updateInput();
                };

                $scope.groupButton = function(){
                    if (!domain) return;
                    var selText = DomUtils.getSelectedText();
                    if (selText.length == 0) return;
                    if (!BAExpression.validSyntax(selText)) {
                        alert('Wrong Syntax ' + selText);
                        return;
                    }
                    var newGroup = new BAGroup(selText);
                    BAGroup.add(newGroup);
                    updateExpressions(newGroup);
                    if (domain.resizeTable) {
                        domain.resizeTable();
                    }
                };

                $scope.removeGroup = function() {
                    if (!domain) return;
                    var group = $scope.group;
                    var index = -1;

                    for (var i = 0; i < BAGroup.groups.length; i++) {
                        var g = BAGroup.groups[i];
                        if (g.key == group.key) {
                            index = i;
                            continue;
                        }
                        g.expression.unuseGroup(group);
                    }
                    domain.expression.unuseGroup(group);

                    if (index > -1) {
                        BAGroup.groups.splice(index, 1);
                    }
                    if (domain.resizeTable) {
                        domain.resizeTable();
                    }
                };
            }
        };
    });
})();