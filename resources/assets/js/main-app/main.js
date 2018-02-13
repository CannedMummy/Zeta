var
    app = angular.module('MainApp',
        ['ngAnimate', 'ngCookies', 'ngSanitize', 'ngMessages', 'ngMaterial']);

app.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

$(document).ready(function () {
});