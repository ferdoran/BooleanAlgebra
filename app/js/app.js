/**
 * Created by Sergej on 03.09.2016.
 */
var boolAlg = angular.module('boolean-algebra', [
    'ngRoute',
    'pascalprecht.translate',
    'ngSanitize'
]).config(function ($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: '/view/boolalg.html',
        controller: 'BACtrl'
    });
    $routeProvider.otherwise({
        redirectTo: '/'
    });
    $locationProvider.html5Mode(true);
}).config(['$translateProvider', function ($translateProvider) {
    //translation
    $translateProvider.useStaticFilesLoader({
        prefix: 'translations/lang-',
        suffix: '.json'
    });
    // Enable escaping of HTML
    $translateProvider.useSanitizeValueStrategy('escape');

    $translateProvider.preferredLanguage('de_DE');
}]);