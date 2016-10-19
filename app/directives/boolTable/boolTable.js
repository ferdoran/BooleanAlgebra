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
            var $table = $element.find('table');
            var table = $table[0];
            /* interpretierte id dem input zuweisen */
            var domain = app.domains[$attr.boolDomain];

            if (!domain) {
                alert('Es wurde keine Domain gefunden!');
            }

            $scope.expression = domain.expression;

            $scope.checkResult = function(){
                console.log("CHECK RESULT");
            };

            domain.tableRefresh = function(){
                if (!$scope.table) {
                    $scope.table = new BATable(domain.expression.rootNode);
                    domain.table = $scope.table;
                } else {
                    $scope.table.build(domain.expression.rootNode);
                }
                $scope.table.updateView();
            };
            domain.tableRefresh();
        }
    };
});