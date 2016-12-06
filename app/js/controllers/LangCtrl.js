/**
 * Created by Sergej on 04.09.2016.
 */
app.controller("LangCtrl", function ($scope, $translate) {
    $scope.changeLang = function (key) {
        $translate.use(key).then(function (key) {
        }, function (key) {
        });

    };
});