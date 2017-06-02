var express = require('express');
var router = express.Router();
var querystring = require('querystring');
var multiparty = require('multiparty');
var fs = require('fs');
var util = require('util');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Expresssssssssssssss' });
});

/* GET users listing. */
router.post('/', function(req, res, next) {
  //console.log(res.files);
  //console.log(req.files);
 // console.log(1111);
 // var postData = querystring.parse(req.body);
  var form = new multiparty.Form();
   //设置编辑
   form.encoding = 'utf-8';
   //设置文件存储路径
    form.uploadDir = "uploads";
  //设置单文件大小限制 
  form.maxFilesSize = 2 * 1024 * 1024;
  //form.maxFields = 1000;  设置所以文件的大小总和
  form.parse(req, function(err, fields, files) {
   // console.log(files.originalFilename);
    console.log(fields);
    console.log(files);
    //同步重命名文件名
   //fs.renameSync(files.path,files.originalFilename);
    res.writeHead(200, {'content-type': 'text/plain'});
    res.write('received upload:\n\n');
    res.end(util.inspect({fields: fields, files: files}));  //将一个对象转成字符串
  });
  //res.send(req.body);

});

module.exports = router;
