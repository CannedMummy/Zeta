var
    app = angular.module('mainApp', ['ngCookies', 'ngSanitize']);

app.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

$(document).ready(function () {

});