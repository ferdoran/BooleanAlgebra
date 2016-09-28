/**
 * Created by Sergej on 03.09.2016.
 */
var app = angular.module('boolean-algebra');

app.controller('BACtrl', function($scope) {

    $scope.createBTable = function(){
        alert('Nicht implementiert!');
    };
}).filter('renderHTMLCorrectly', function($scope)
{
    return function(stringToParse)
    {
        return $scope.trustAsHtml(stringToParse);
    }
});