/**
 * Created by Sergej Görzen on 04.09.2016.
 */
var app = angular.module('boolean-algebra');
app.filter('rawHtml', ['$sce', function($sce){
    return function(val) {
        return $sce.trustAsHtml(val);
    };
}]);

var _boolInputCounter = 0;
app.directive('boolInput', function($parse, $sce){
    return {
        restrict: 'E',
        replace:true,
        scope:true,
        templateUrl: "directives/boolInput/boolInput.html",
        link: function($scope, $element, $attr) {
            /* Id direkt in einer Var interpretierren */
            var id;
            if ($attr.id) {
                $scope.id = $attr.id;
                id = $attr.id;
            } else {
                id = $scope.id = "boolInput" + _boolInputCounter++;
            }
            if ($attr.boolSymbol) {
                $scope.symbol = $attr.boolSymbol;
            } else {
                $scope.symbol = 'F';
            }
            var $input = $element.find('.input');
            var input = $input[0];
            /* interpretierte id dem input zuweisen */
            input.id = id;

            $scope.value = $attr.boolValue;

            var $boolTable = angular.element($attr.boolTable);
            $scope.allowGroups = $attr.boolGroups;

            /* das Ziel muss vom Typ TABLE sein */
            if ($boolTable[0].nodeName != "TABLE") {
                alert("boolInput.js: target is not <table>");
                return;
            }

            var selection = {
                start: -1,
                end: -1,
                text: ''
            };

            $scope.formula = new Formula();
            $scope.groups = [];
            var groupMax = 1;
            var formula = null;

            $element.find('[focusable="false"]').on('mousedown', function(e){
                e.preventDefault();
            });

            var groupIndex = 1;
            /* Gruppen Nummer hochzählen */
            var getGroupKey = function(text){
                for (var i = 0; i < $scope.groups.length; i++) {
                    var group = $scope.groups[i];
                    if (group.text == text) {
                        return {key: group.key, exists: true};
                    }
                }
                return {key: 'G' + groupIndex++, exists: false};
            };

            var updateFormula = function(text) {
                if (text.length < 1) return false;
                $scope.formula.parse(text);
                var position = DomUtils.getCaretCharacterOffsetWithin($input.get(0));
                $input.html($scope.formula.getHtml());
                DomUtils.setCaretPosition($input.get(0),position);
            };

            $input.keyup(function(e){
                if (e.keyCode == KEY_CONTROL) {
                    return false;
                }

                updateFormula($input.text());
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
                for (var i = 0; i < $scope.groups.length; i++) {
                    var g = $scope.groups[i];
                    if (g == group) {
                        index = i;
                    } else if (g.text.indexOf(group.key) > -1) {
                        g.text = g.text.replace(group.key, group.text);
                        g.formula.parse(g.text);
                        g.html = $sce.getTrustedHtml(g.formula.getHtml());
                    }
                }

                var text = $input.text();
                if (text.indexOf(group.key) > -1) {
                    text = text.replace(group.key, group.text);
                    updateFormula(text);
                }

                if (index > -1) {
                    $scope.groups.splice(index, 1);
                }
            };

            $scope.addChar = function(char, _$input){
                if (document.activeElement.id != input.id || document.activeElement.className != input.className) return false;
                DomUtils.pasteHtmlAtCaret(char);
                updateFormula($input.text());
            };

            $scope.groupButton = function(){
                var text = $input.text();
                var selText = DomUtils.getSelectedText();
                if (text.length == 0 || selText.length == 0) return true;
                var g = new Formula(selText);
                if (!g.isValid()) {
                    alert("'" + selection.text + "' is not a valid group.");
                    return true;
                }
                var groupKey = getGroupKey(selText);
                if (!groupKey.exists) {
                    $scope.groups.push({key: groupKey.key, formula: g, html: $sce.trustAsHtml(g.getHtml()), text: selText});
                }
                var newText = text.replace(selText, groupKey.key);
                updateFormula(newText);
                $input.focus();
            };
        }
    };
});