/**
 * Created by Sergej on 03.09.2016.
 */


var app = angular.module('boolean-algebra');

app.controller('BACtrl', function($scope, $compile) {

    app.domains = {
        boolMain: new BADomain("boolMain")
    };

    $scope.createBTable = function(id){
        var $body = angular.element(id);
        var boolTableHtml = $compile('<bool-table bool-domain="boolMain"></bool-table>')($scope);
        $body.html(boolTableHtml);
    };
}).filter('renderHTMLCorrectly', function($scope)
{
    return function(stringToParse)
    {
        return $scope.trustAsHtml(stringToParse);
    }
});