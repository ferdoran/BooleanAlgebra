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

            var tableInst = null;
            var updateTable = function(){
                return;
                if (!domain.tableRefresh) return;
                clearTimeout(tableInst);
                tableInst = setTimeout(function(){
                    domain.tableRefresh();
                },500);
            };

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
                var position = DomUtils.getCaretCharacterOffsetWithin($inp.get(0));

                group.expression.parse(text);
                group.expression.html = $sce.trustAsHtml(expression.getHtml());

                DomUtils.setCaretPosition($inp.get(0), position);
            };


            $scope.keyUp = function() {
                var e = event;
                var $input = angular.element(e.target);

                //var position = DomUtils.getCaretCharacterOffsetWithin($input.get(0));

                if (e.keyCode == KEY_CONTROL || e.keyCode == KEY_SPACE) {
                    e.preventDefault();
                    return false;
                }

                updateExpression();
                updateTable();

                //DomUtils.setCaretPosition($input.get(0), position);
            };

            $scope.keyDown = function() {
                var e = event;
                if (!(e.keyCode == KEY_BACKSPACE || e.keyCode == KEY_LEFT
                    || e.keyCode == KEY_RIGHT || e.keyCode == KEY_UP || e.keyCode == KEY_DOWN
                    || e.keyCode >= KEY_A && e.keyCode <= KEY_Z
                    || e.key == '-' || e.key == '(' || e.key == ')'
                    || e.keyCode == KEY_COMMA || e.keyCode == KEY_DOT
                    || e.key == '1' || e.key == '0' || e.key == '2' || e.key == '3' || e.key == '4' || e.key == '5'
                    || e.key == '6' || e.key == '7' || e.key == '8' || e.key == '9')
                    || e.keyCode == KEY_K || e.keyCode == KEY_SPACE) {
                    e.preventDefault();
                    return false;
                }
                //DomUtils.pasteHtmlAtCaret(char);
                return true;
            };

            $scope.removeGroup = function(group) {
                var newText = '';
                var index = -1;
                for (var i = 0; i < BAExpression.groups.length; i++) {
                    var g = BAExpression.groups[i];
                    if (g.key == group.key) {
                        index = i;
                        continue;
                    }
                    newText = g.expression.text.replace(group.key, group.getText());
                    updateGroupExpression(g, newText);
                }
                //newText = $scope.expression.text.replace(new RegExp(group.key, "g"), group.getText());
                newText = $scope.expression.text.replaceAll(group.key, group.getText());
                updateExpression(newText);

                if (index > -1) {
                    BAExpression.groups.splice(index, 1);
                }
                updateTable();
            };

            var updateGroup = function(group, text) {
                if (!text) {
                    var $group = angular.element('.group[group-key="'+group.key+'"]');
                    var $gInput = $group.find('.input');
                    text = $gInput.text();
                }

                updateGroupExpression(group, text);

                //group.expression.parse(text);
                //group.expression.html = $sce.getTrustedHtml(group.expression.getHtml());
            };

            var createGroup = function(text){
                var group = $scope.expression.createGroup(text);

                group.expression.html = $sce.getTrustedHtml(group.getHtml());

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
                var e = event;
                if (e.keyCode == KEY_CONTROL || e.keyCode == KEY_SPACE) {
                    e.preventDefault();
                    return false;
                }
                updateGroup(group);
            };

            $scope.clearText = function(){
                $input.html('');
            };

            var addGroup = function(text) {
                var newGroup = createGroup(text);

                updateExpression($scope.expression.groupFilter(newGroup));

                /** Gruppenkey überall einsetzen */
                for (var i = 0; i < BAExpression.groups.length; i++) {
                    var g = BAExpression.groups[i];
                    if (g.key == newGroup.key) continue;
                    updateGroupExpression(g, g.expression.groupFilter(newGroup));
                }
            };

            $scope.groupButton = function(group){
                var $inp = $input;
                if (group) {
                    var $group = angular.element('.group[group-key="'+ group.key+'"]');
                    $inp = $group.find('.input');
                }

                var selText = DomUtils.getSelectedText();
                if (selText.length == 0) return true;

                addGroup(selText);

                $inp.focus();
            };

            updateExpression('¬A∧((¬B∨C)∧¬D⇒E)');
            addGroup("((¬B∨C)∧¬D⇒E)");
            addGroup("(¬B∨C)");
            addGroup("G2∧¬D");
            addGroup("(G3⇒E)");
        }
    };
});