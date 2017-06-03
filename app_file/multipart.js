var multiparty = require('multiparty');
var http = require('http');
var util = require('util');
var fs = require("fs");

http.createServer(function(req, res) {
  if (req.url === '/upload' && req.method === 'POST') {
    // parse a file upload

     console.log(req.files);
    var form = new multiparty.Form();
  //console.log(form)
     form.encoding = 'utf-8';
  //  //设置文件存储路径
  form.uploadDir = "uploads";     //此路径必须已存在
  // //设置单文件大小限制 
    form.maxFilesSize = 2 * 1024 * 1024;
    form.parse(req, function(err, fields, files) {
      console.log(Array.isArray(files))

      // console.log(files[0].originalFilename);
      console.log(files.upload[0].originalFilename);   //源文件名
      console.log(files.upload[0].path);               //该文件当前保存路径
      //fs.renameSync(files.path,files.originalFilename);  //重命名   原路径   新路径
      fs.renameSync(files.upload[0].path,'uploads/'+files.upload[0].originalFilename);
      res.writeHead(200, {'content-type': 'text/plain'});
      res.write('received upload:\n\n');
      res.end(util.inspect({fields: fields, files: files}));
    });

    return;
  }

  // show a file upload form
  res.writeHead(200, {'content-type': 'text/html'});
  res.end(
    '<form action="/upload" enctype="multipart/form-data" method="post">'+
    '<input type="text" name="title"><br>'+
    '<input type="file" name="upload" multiple="multiple"><br>'+
    '<input type="submit" value="Upload">'+
    '</form>'
  );
}).listen(8080);