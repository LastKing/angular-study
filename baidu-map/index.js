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

      map.addEventListener("dblclick", getCoordinate);
      function getCoordinate(e) {
        map.clearOverlays();
        refreshMarkArray();
        refreshAreaArray();
        refreshArea();
        $scope.$apply(function () {
          var marker = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat));
          map.addOverlay(marker);            //增加点
          $scope.coordinate = {lng: e.point.lng, lat: e.point.lat};
        })
      }

      // $scope.addAreaInput = function () {
      //   if (!$scope.area || $scope.area.length == 1) {
      //     $scope.area = [];
      //     $scope.area[0] = {lng: "", lat: ""};
      //   }
      //   $scope.area.splice($scope.area.length - 1, 0, {lng: "", lat: ""});
      // };

      $scope.$watch('markArray', function () {
        init();
      });

      $scope.$watch('area', function () {
        init();
      }, true);

      //3.根据景点和 服务设施 判断是否显示绘画组建创建绘图实例
      if ($scope.type == 'scenic') {
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

        //4.添加鼠标绘制工具监听事件，用于获取绘制结果
        var overlaycomplete = function (e) {
          $scope.$apply(function () {
            // $scope.area = [];
            // 5. 传出 值
            // $scope.area.push(e.overlay.ia)
            $scope.area = e.overlay.ia;
          });
        };
        drawingManager.addEventListener('overlaycomplete', overlaycomplete);
      }

      function init() {
        map.clearOverlays();
        refreshMarkArray();
        refreshAreaArray();
        refreshArea();
        refreshMark();
      }

      function refreshArea() {
        if ($scope.area instanceof Array) {
          var pts = [];
          for (var j = 0; j < $scope.area.length; j++) {
            pts.push(new BMap.Point($scope.area[j].lng, $scope.area[j].lat));
          }
          var ply = new BMap.Polygon(pts, {strokeColor: "red", fillColor: "red"});
          //演示：将面添加到地图上
          map.addOverlay(ply);
        }
      }

      function refreshMark() {
        if (typeof $scope.coordinate != 'undefined') {
          var marker = new BMap.Marker(new BMap.Point($scope.coordinate.lng, $scope.coordinate.lat));
          map.addOverlay(marker);            //增加点
        }
      }

      //重新绘制Area 区域
      function refreshAreaArray() {
        if ($scope.areaArray instanceof Array)
          for (var j = 0; j < $scope.areaArray.length; j++) {
            var pts = [];
            for (var i = 0; i < $scope.areaArray[j].length; i++) {
              if (!!$scope.areaArray[j][i].lng)
                pts.push(new BMap.Point($scope.areaArray[j][i].lng, $scope.areaArray[j][i].lat));
            }
            var ply = new BMap.Polygon(pts, {strokeColor: "red", fillColor: "red"});
            //演示：将面添加到地图上
            map.addOverlay(ply);
          }
      }

      //重新绘制mark 区域
      function refreshMarkArray() {
        if ($scope.markArray instanceof Array)
          for (var i = 0; i < $scope.markArray.length; i++) {
            // if (!!$scope.markArray[i].coordinate) {
            var coordinate = $scope.markArray[i].coordinate;
            if (coordinate && coordinate.lng && coordinate.lat) {
              var pt = new BMap.Point(coordinate.lng, coordinate.lat);
              var myIcon = new BMap.Icon("/admin/assets/img/baidu/scenic.png", new BMap.Size(20, 20));
              var marker = new BMap.Marker(pt, {icon: myIcon}); // 创建标注
              map.addOverlay(marker);              // 将标注添加到地图中

              var label = new BMap.Label($scope.markArray[i].name, {offset: new BMap.Size(0, -20)});
              // label.setStyle({
              //   color : "red",
              //   fontSize : "12px",
              //   height : "20px",
              //   lineHeight : "20px",
              //   fontFamily:"微软雅黑"
              // });
              marker.setLabel(label);      // 将标注添加到地图中
            }
          }
      }

      //初始化一个map
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
          map.addControl(new BMap.NavigationControl({
            // 启用显示定位
            // LARGE类型
            type: BMAP_NAVIGATION_CONTROL_LARGE,
          }));
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