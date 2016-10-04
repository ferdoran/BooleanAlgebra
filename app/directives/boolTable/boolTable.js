/**
 * Created by Sergej Görzen on 04.09.2016.
 */
var app = angular.module('boolean-algebra');

var _boolTableCounter = 0;
app.directive('boolTable', function($parse, $sce){
    return {
        restrict: 'E',
        replace:true,
        scope:true,
        templateUrl: "directives/boolTable/boolTable.html",
        link: function($scope, $element, $attr) {
            /* Id direkt in einer Var interpretierren */
            var id;
            if ($attr.id) {
                $scope.id = $attr.id;
                id = $attr.id;
            } else {
                id = $scope.id = "boolTable" + _boolTableCounter++;
            }
            if ($attr.boolSymbol) {
                $scope.symbol = $attr.boolSymbol;
            } else {
                $scope.symbol = 'F';
            }
            var $table = $element.find('table');
            var table = $table[0];
            /* interpretierte id dem input zuweisen */
            table.id = id;

            var domain = app.domains[$attr.boolDomain];

            if (!domain) {
                alert('Es wurde keine Domain gefunden!');
            }

            $scope.formula = domain.formula;
            $scope.table = new BATable(domain.formula.getRoot(), domain.groups);

            $scope.table.ths = [];
            $scope.table.bits = [];

            var ths = $scope.table.getTheadData();
            var i;
            for (i = ths.letters.length - 1; i >= 0; i--) {
                $scope.table.ths.push({name: ths.letters[i], class: 'letters'});
            }
            for (i = ths.specials.length - 1; i >= 0; i--) {
                $scope.table.ths.push({name: ths.specials[i], class: 'specials'});
            }
            for (i = ths.groups.length - 1; i >= 0; i--) {
                $scope.table.ths.push({name: ths.groups[i], class: 'groups'});
            }
            for (i = ths.clips.length - 1; i >= 0; i--) {
                $scope.table.ths.push({name: ths.clips[i], class: 'clips'});
            }
            $scope.table.ths.push({name: 'F', class:'result'});
            domain.table = $scope.table;


            var lettersCount = ths.letters.length;
            var max = Math.pow(2, lettersCount);

            for (var l = 0; l < max; l++) {
                var bitLine = { letters: [], specials: [], groups: [], clips: [] };

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

                for (i = 0; i < ths.specials.length; i++) {
                    bitLine.specials.push({value: 0});
                }

                for (i = 0; i < ths.groups.length; i++) {
                    bitLine.groups.push({value: 0});
                }

                for (i = 0; i < ths.clips.length; i++) {
                    bitLine.clips.push({value: 0});
                }

                bitLine.result = {value: 0};

                $scope.table.bits.push(bitLine);
            }
            console.log($scope.table.bits);

        }
    };
});