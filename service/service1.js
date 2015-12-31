/**
 * Created by Rain on 2015/7/20.
 */

var myModule=angular.module('myModule',[]);


myModule.controller('myController',function($scope){
    $scope.test1='text';
    console.log($scope.$location);

});










