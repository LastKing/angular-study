/**
 * Created by Rain on 2015/8/8.
 */
var userInfoModule=angular.module('UserInfoModule',[]);

userInfoModule.controller('UserInfoCtrl',['$scope',

  function($scope){
    $scope.userInfo={
      email:'qwer@qq.com',
      password:"fsdfsadf ",
      autoLog:true
    };

    $scope.getFormData=function(){
      console.log($scope.userInfo);
    };

    $scope.setFormData=function(){
      $scope.userInfo={
        email:'fsdfsd@125.com',
        password:"1234 ",
        autoLog:true
      };
    };

    $scope.resetForm=function(){
      $scope.userInfo={
        email:'qwer@qq.com',
        password:" fsdfsadf ",
        autoLog:true
      };
    };

  }

]);









