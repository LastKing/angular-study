/**
 * Created by Rain on 2016/7/8.
 */
root.directive('baiduMap', function () {
  return {
    restrict: 'E',
    replace: 'true',
    templateUrl: './temp.html',
    scope: {
      options: "=",
      testip: '=',
      ak: '@'
    },
    link: function ($scope, element, attrs, transclude) {
      //1.给div  挂钩map
      var $element = $(element);
      var map = createInstance($scope.options, $element.find('#map')[0]);

      var navigationControl = new BMap.NavigationControl({
        // 靠左上角位置
        anchor: BMAP_ANCHOR_TOP_LEFT,
        // LARGE类型
        type: BMAP_NAVIGATION_CONTROL_LARGE,
        // 启用显示定位
        enableGeolocation: true
      });
      map.addControl(navigationControl);

      // 初始化一个map
      function createInstance(opts, element) {
        //default options
        var defaultOpts = {
          center: {
            longitude: 116.404,
            latitude: 39.925
          },
          navCtrl: true,
          scaleCtrl: true,
          overviewCtrl: true,
          enableScrollWheelZoom: true,
          city: '北京',
          zoom: 12
        };

        var opts = angular.extend({}, defaultOpts, $scope.options);

        // create map instance
        var map = new BMap.Map(element, {enableMapClick: false});
        map.centerAndZoom(new BMap.Point(opts.center.longitude, opts.center.latitude), opts.zoom);

        // 自定义地图样式，关闭百度自带图标
        var styleJson = [{
          "featureType": "poi",
          "elementType": "all",
          "stylers": {"visibility": "off"}
        }];
        map.setMapStyle({styleJson: styleJson});
        map.disableDoubleClickZoom();
        if (opts.navCtrl) {
          // add navigation control
          // map.addControl(new BMap.NavigationControl({
          //   启用显示定位
          //   LARGE类型
            // type: BMAP_NAVIGATION_CONTROL_LARGE,
          // }));
        }
        if (opts.scaleCtrl) {
          // add scale control
          map.addControl(new BMap.ScaleControl());
        }
        if (opts.overviewCtrl) {
          //add overview map control
          map.addControl(new BMap.OverviewMapControl());
        }
        if (opts.enableScrollWheelZoom) {
          //enable scroll wheel zoom
          map.enableScrollWheelZoom();
        }

        // set the city name
        map.setCurrentCity(opts.city);
        return map;
      }
    }
  }
});