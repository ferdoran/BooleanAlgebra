/**
 * Created by Sergej Görzen on 04.09.2016.
 */
var app = angular.module('boolean-algebra');

app.directive('boolInput', function($parse, $sce){
    return {
        restrict: 'E',
        replace:true,
        scope:true,
        templateUrl: "directives/boolInput/boolInput.html",
        link: function($scope, $element, $attr) {
            if ($attr.boolSymbol) {
                $scope.symbol = $attr.boolSymbol;
            } else {
                $scope.symbol = 'F';
            }
            var $input = $element.find('.input');
            var input = $input[0];
            $scope.value = $attr.boolValue;

            $scope.allowGroups = $attr.boolGroups;

            $scope.expression = new BAExpression();
            $scope.groups = BAExpression.groups;

            var domain = app.domains[$attr.boolDomain];
            if (domain) {
                domain.expression = $scope.expression;
            }

            $element.find('[focusable="false"]').on('mousedown', function(e){
                e.preventDefault();
            });

            var updateExpression = function(text) {
                var expression = $scope.expression;
                if (!text) {
                    text = $input.text();
                }
                if (text.length < 1) return false;
                expression.parse(text);
                var html = expression.getHtml();
                var position = DomUtils.getCaretCharacterOffsetWithin($input.get(0));
                $input.html(html);
                DomUtils.setCaretPosition($input.get(0), position);
            };
            var updateGroupExpression = function(group, text) {
                var $group = angular.element('.group[group-key="'+ group.key+'"]');
                var $inp = $group.find('.input');
                var expression = group.expression;
                if (!text) {
                    text = $inp.text();
                }
                if (text.length < 1) return false;
                expression.parse(text);
                var html = expression.getHtml();
                //var position = DomUtils.getCaretCharacterOffsetWithin($inp.get(0));
                expression.html = $sce.trustAsHtml(html);
                //DomUtils.setCaretPosition($inp.get(0), position);
            };

            //updateExpression('¬A∧((¬B∨C)∧¬D⇒E)');

            $input.keyup(function(e){
                if (e.keyCode == KEY_CONTROL) {
                    return false;
                }

                updateExpression();
            }).keydown(function(e){
                if (!(e.keyCode == KEY_BACKSPACE || e.keyCode == KEY_LEFT
                    || e.keyCode == KEY_RIGHT || e.keyCode == KEY_UP || e.keyCode == KEY_DOWN
                    || e.keyCode >= KEY_A && e.keyCode <= KEY_Z
                    || e.key == '-' || e.key == '(' || e.key == ')'
                    || e.keyCode == KEY_COMMA || e.keyCode == KEY_DOT
                    || e.key == '1' || e.key == '0' || e.key == '2' || e.key == '3' || e.key == '4' || e.key == '5'
                    || e.key == '6' || e.key == '7' || e.key == '8' || e.key == '9')
                    || e.keyCode == KEY_K) {
                    return false;
                }
                //DomUtils.pasteHtmlAtCaret(char);
                return true;
            });

            $scope.removeGroup = function(group) {
                var index = -1;
                for (var i = 0; i < BAExpression.groups.length; i++) {
                    var g = BAExpression.groups[i];
                    if (g == group) {
                        index = i;
                    } else if (g.text.indexOf(group.key) > -1) {
                        g.text = g.text.replace(group.key, group.text);
                        g.expression.parse(g.text);
                        g.html = $sce.getTrustedHtml(g.expression.getHtml());
                    }
                }

                var text = $input.text();
                if (text.indexOf(group.key) > -1) {
                    text = text.replace(group.key, group.text);
                    updateExpression(text);
                }

                if (index > -1) {
                    BAExpression.groups.splice(index, 1);
                }
            };

            var updateGroup = function(group) {
                var $group = angular.element('.group[group-key="'+group.key+'"]');
                var $gInput = $group.find('.input');
                var text = $gInput.text();
                group.expression.parse(text);
                group.text = text;
                group.html = $sce.getTrustedHtml(group.expression.getHtml());
            };

            var createGroup = function(text){
                var group = $scope.expression.createGroup(text);
                if (group.groupKey.key == "G2") {
                    DEBUG_NODE(group.expression.rootNode);
                }
                group.html = $sce.getTrustedHtml(group.getHtml());// $sce.trustAsHtml(group.getHtml());
                if (!group.groupKey.exists) {
                    BAExpression.groups.push(group);
                }
                return group;
            };

            $scope.addChar = function(char, group){
                if (group) {
                    DomUtils.pasteHtmlAtCaret(char);
                    updateGroup(group);
                    return false;
                }
                if (document.activeElement.id != input.id || document.activeElement.className != input.className) return false;
                DomUtils.pasteHtmlAtCaret(char);
                updateExpression($input.text());
            };

            $scope.groupChange = function(group){
                updateGroup(group);
            };

            $scope.clearText = function(){
                $input.html('');
            };

            $scope.groupButton = function(group){
                var $inp = $input;
                if (group) {
                    var $group = angular.element('.group[group-key="'+ group.key+'"]');
                    $inp = $group.find('.input');
                }

                var selText = DomUtils.getSelectedText();
                if (selText.length == 0) return true;

                var newGroup = createGroup(selText);

                /** Gruppenkey überall einsetzen */
                for (var i = 0; i < BAExpression.groups.length; i++) {
                    var g = BAExpression.groups[i];
                    updateGroupExpression(g, g.expression.groupFilter(newGroup));
                }

                updateExpression($scope.expression.groupFilter(newGroup));
                
                DEBUG_NODE($scope.expression.findChild('G1'));

                $inp.focus();
            };
        }
    };
});