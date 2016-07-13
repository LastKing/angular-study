/**
 * Created by Rain on 2016/7/13.
 */
root.directive('manyFileUpload', function () {
  return {
    restrict: "E",
    replace: true,
    scope: {},
    templateUrl: 'template.html',
    link: function (scope, element, attr) {
      var $element = $(element);

      $element.find('#manyFiles').change(function () {
        var files = $(this)[0].files;

        var shareUpload = function () {
          var form = new FormData();
          form.append('file', files);

          var xhr = new XMLHttpRequest();

          xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
              if (xhr.status = 200) {
                //服务器返回了数据,将数据格式化
                var data = JSON.parse(xhr.responseText);

                if (!data.error) {
                  //如果没有发生错误
                  console.log('xxx');
                }
              }
            }
          };

          xhr.open("POST", '');

          xhr.send(form);
        };

        shareUpload();
      })
    }

  }
});