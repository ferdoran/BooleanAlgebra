/**
 * Created by Sergej Görzen on 04.09.2016.
 */
var app = angular.module('boolean-algebra');

app.directive('boolTable', function($parse, $sce){
    return {
        restrict: 'E',
        replace:true,
        scope:true,
        templateUrl: "directives/boolTable/boolTable.html",
        link: function($scope, $element, $attr) {
            if ($attr.boolSymbol) {
                $scope.symbol = $attr.boolSymbol;
            } else {
                $scope.symbol = 'F';
            }
            var $table = $element.find('table');
            var table = $table[0];
            /* interpretierte id dem input zuweisen */
            var domain = app.domains[$attr.boolDomain];

            if (!domain) {
                alert('Es wurde keine Domain gefunden!');
            }

            $scope.expression = domain.expression;

            domain.tableRefresh = function(){
                $scope.table = new BATable(domain.expression.rootNode, domain.groups);

                $scope.table.ths = [];
                $scope.table.bits = [];

                var ths = $scope.table.getTheadData();

                var i;
                for (i = 0; i < ths.letters.length; i++) {
                    $scope.table.ths.push({name: ths.letters[i], class: 'letters'});
                }
                for (i = 0; i < ths.groups.length; i++) {
                    $scope.table.ths.push({name: ths.groups[i], class: 'groups'});
                }
                $scope.table.ths.push({name: 'F', class:'result'});
                domain.table = $scope.table;


                var lettersCount = ths.letters.length;
                var max = Math.pow(2, lettersCount);

                for (var l = 0; l < max; l++) {
                    var bitLine = { letters: [], groups: [], clips: [] };

                    var lTemp = l;
                    for (i = lettersCount - 1; i >= 0; i--) {
                        var v = 0;
                        var vTemp = Math.pow(2,i);

                        if (lTemp >= vTemp) {
                            lTemp -= vTemp;
                            v = 1;
                        }
                        bitLine.letters.push({value: v});
                    }

                    for (i = 0; i < ths.groups.length; i++) {
                        bitLine.groups.push({value: 0});
                    }

                    bitLine.result = {value: 0};
                    $scope.table.bits.push(bitLine);
                }
            };
            domain.tableRefresh();
        }
    };
});