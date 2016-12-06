/**
 * Created by Sergej on 04.09.2016.
 */
app.controller("LangCtrl", function ($scope, $translate) {
    var $m = angular.element('#languageBox');
    $scope.changeLang = function (key) {
        $translate.use(key).then(function (key) {
            /*$scope.getCurrentLanguage();*/
        }, function (key) {
        });

    };
    $scope.getCurrentLanguage = function () {
        var currentLanguage = $translate.proposedLanguage() || $translate.use();
        switch (currentLanguage) {
            case "de_DE":
                $scope.activeLanguage = '<span class="flag-icon flag-icon-de"></span> Deutsch';
                break;
            case "en_EN":
                $scope.activeLanguage = '<span class="flag-icon flag-icon-gb"></span> English';
                break;
        }
    };
    $scope.getCurrentLanguage();
});