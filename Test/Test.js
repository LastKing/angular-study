/**
 * Created by Rain on 2015/7/13.
 */
var module=angular.module("phoneMel",[]);

module.controller("PhoneListCtrl",function($scope,$location){
    $scope.phones = [
        {"name": "Nexus S",
            "snippet": "Fast just got faster with Nexus S."},
        {"name": "Motorola XOOM? with Wi-Fi",
            "snippet": "The Next, Next Generation tablet."},
        {"name": "MOTOROLA XOOM?",
            "snippet": "The Next, Next Generation tablet."}
    ];

});

