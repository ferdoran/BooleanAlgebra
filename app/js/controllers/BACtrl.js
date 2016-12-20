/**
 * Created by Sergej on 03.09.2016.
 */


var app = angular.module('boolean-algebra');

app.controller('BACtrl', function($scope, $compile) {

    if (!app.domains) {
        app.domains = {
            boolMain: new BADomain("boolMain"),
            boolMin: new BADomain("boolMin")
        };
    }
    $scope.minExpression = new BAExpression();

    $scope.createBTable = function(id){
        var $body = angular.element(id);
        var boolTableHtml = $compile('<bool-table bool-domain="boolMain"></bool-table>')($scope);
        $body.html(boolTableHtml);
    };

    $scope.createKV = function(id){
        var $body = angular.element(id);
        console.log($body);
        var kvHtml = $compile('<bool-kv></bool-kv>')($scope);
        $body.html(kvHtml);
    };

    $scope.closeFooter = function(){
        angular.element('footer').hide();
    };
}).filter('renderHTMLCorrectly', function($scope)
{
    return function(stringToParse)
    {
        return $scope.trustAsHtml(stringToParse);
    }
});