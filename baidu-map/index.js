/**
 * Created by Rain on 2016/7/8.
 */
root.directive('baiduMap', function () {
  return {
    restrict: 'E',
    replace: 'true',
    template: '<div></div>',
    scope: {
      options: "=",
      testip: '=',
      ak: '@'
    },
    link: function ($scope, element, attrs, transclude) {
      validator($scope.ak, 'ak must not be empty');
      validator($scope.testip, 'testip must not be empty');

      var defaultOpts = {
        navCtrl: true,
        scaleCtrl: true,
        overviewCtrl: true,
        enableScrollWheelZoom: true,
        zoom: 10
      };
      var opts = angular.extend({}, defaultOpts, $scope.options);
      var map = new BMap.Map(element[0]);

      map.centerAndZoom(new BMap.Point(opts.center.longitude, opts.center.latitude), opts.zoom);
      map.addControl(new BMap.NavigationControl());


      //绘图样式
      var styleOptions = {
        strokeColor: "red",    //边线颜色。
        fillColor: "red",      //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 3,       //边线的宽度，以像素为单位。
        strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
        fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid' //边线的样式，solid或dashed。
      };

      //实例化鼠标绘制工具
      var drawingManager = new BMapLib.DrawingManager(map, {
        isOpen: false, //是否开启绘制模式
        enableDrawingTool: true, //是否显示工具栏
        drawingToolOptions: {
          anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
          offset: new BMap.Size(5, 5) //偏离值
        },
        circleOptions: styleOptions, //圆的样式
        polylineOptions: styleOptions, //线的样式
        polygonOptions: styleOptions, //多边形的样式
        rectangleOptions: styleOptions //矩形的样式
      });

      //添加鼠标绘制工具监听事件，用于获取绘制结果
      var overlays = [];
      var overlaycomplete = function (e) {
        overlays.push(e.overlay.ia);
      };
      drawingManager.addEventListener('overlaycomplete', overlaycomplete);

      for (var j = 0; j < $scope.testip.length; j++) {
        var pts = [];
        for (var i = 0; i < $scope.testip[j].length; i++) {
          pts.push(new BMap.Point($scope.testip[j][i].latitude, $scope.testip[j][i].longitude));
        }
        var ply = new BMap.Polygon(pts, {strokeColor: "red", fillColor: "red"});
        //演示：将面添加到地图上
        map.addOverlay(ply);
      }

      function validator(prop, desc) {
        if (!prop) {
          throw new Error(desc);
        }
      }
    }
  }
});