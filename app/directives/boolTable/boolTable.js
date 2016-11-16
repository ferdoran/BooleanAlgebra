/**
 * Created by Sergej Görzen on 04.09.2016.
 */
var app = angular.module('boolean-algebra');

app.directive('boolTable', function($parse, $sce, $timeout){
    return {
        restrict: 'E',
        replace:true,
        scope:true,
        templateUrl: "directives/boolTable/boolTable.html",
        link: function($scope, $element, $attr) {
            var $table = $element.find('table');
            var table = $table[0];
            var $fixedTables = angular.element('.fixed_headers');
            /* interpretierte id dem input zuweisen */
            var domain = app.domains[$attr.boolDomain];

            if (!domain) {
                alert('Es wurde keine Domain gefunden!');
            }

            $scope.expression = domain.expression;

            $scope.checkResult = function(){
                $scope.$broadcast('check-result');
            };

            var resizeTable = function(){

                $timeout(function(){
                    $fixedTables.each(function(){
                        var $t = angular.element(this);

                        var $tBody = $t.find('tbody');

                        var $ths = $t.find('thead th');
                        var $tds = $tBody.find('td');
                        var $trs = $tBody.find('tr');

                        var width = $ths.outerWidth();
                        $tds.each(function(){
                            var $td = angular.element(this);
                            $td[0].style.width = width + "px";
                        });

                        var maxHeight = 0;
                        $trs.each(function(){
                            var $tr = angular.element(this);
                            maxHeight += $tr.outerHeight();
                        });
                        $t.find('.slimScrollDiv').css({"max-height": maxHeight +"px"});
                    });
                },10);
            };

            $fixedTables.each(function(){
                var $fH = angular.element(this);
                $fH.find('tbody').slimScroll({
                    height:"165px",
                    alwaysVisible: false
                });
            });

            domain.tableRefresh = function(){
                if (!$scope.table) {
                    $scope.table = new BATable(domain.expression.rootNode);
                    domain.table = $scope.table;
                } else {
                    $scope.table.build(domain.expression.rootNode);
                }
                $scope.table.updateView();
                resizeTable();
            };
            domain.tableRefresh();

            angular.element(window).resize(function(){
                resizeTable();
            });
        }
    };
});