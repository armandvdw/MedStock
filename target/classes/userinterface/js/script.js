/**
 * Created with IntelliJ IDEA.
 * User: TheOnlyMonkey
 * Date: 10/5/14
 * Time: 5:54 PM
 * To change this template use File | Settings | File Templates.
 */

var medStockApp = angular.module('medStockApp', ['ngRoute']);

medStockApp.config(function ($routeProvider) {
    $routeProvider
        // route for the home page
        .when('/main', {
            templateUrl: "pages/main.html",
            controller: 'mainController'
        })

        .when('/', {
            templateUrl: "pages/login.html",
            controller: 'loginController'
        });
});

medStockApp.controller('loginController', function ($scope, $location, $rootScope) {
    $scope.login = function() {
        $location.path("/main");
    };
});

medStockApp.controller('mainController', function ($scope, $location, $rootScope) {

});
