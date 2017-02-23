/**
 * 用来做angular  http的访问测试
 * Created by Rain on 2017/2/23.
 */
var express = require('express');
var app = express();
//设置跨域访问
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.get('/hello', function (req, res) {
  res.send({id: req.query.id, name: req.query.password});
});

app.listen(3000);