var express = require('express');
var router = express.Router();
var fs = require('fs');
var file ="../data/db.json";
var multiparty = require('multiparty');
var util = require('util');

/* GET admin listing. */
router.get('/', function(req, res, next) {
  //读取数据库文件
  var db =JSON.parse(fs.readFileSync(file));
  //先验证管理员身份

  if(db.admin){
    for(var i = 0; i < db.admin.length; i++) {
      
      // 
      // console.log(db.admin[i].id)
      if(req.query.login_id == db.admin[i].id && req.query.login_password == db.admin[i].password){
        console.log(req.query.login_id)
        res.send(db.exam.exam_list.exam_list_content);
        return;
      }
    }
  }else {
    res.send('数据库出错！');
    return;
  }

  //res.send(req.query);
  res.send('用户信息不匹配，请返回重新登录！');


  
});


/* POST admin listing. */
router.post('/', function(req, res, next) {
  //读取数据库文件
  var db =JSON.parse(fs.readFileSync(file));
  //先验证管理员身份
  if(db.admin){
  	for(var i = 0; i < db.admin.length; i++) {
      console.log(req.body)
  		console.log(req.body.login_password)
  		if(req.body.login_id === db.admin[i].id && req.body.login_password === db.admin[i].password){
        //先从数据库获取考试列表
        var db_exam_list = db.exam.exam_list.exam_list_content; 
        //当为发布考试操作时
       
        if(typeof req.body.start_exam_id !== 'undefined'){ 
          console.log('正在进行发布考试(' + req.body.start_exam_id + ')操作')

          for(var j = 0; j < db_exam_list.length; j++){
            if(db_exam_list[j].id == req.body.start_exam_id){
                db_exam_list[j].is_start = 'yes';
                break;
            }
              
          }
          res.send([db_exam_list,db.exam.exam_list.exam_list_content])
          //res.send('exam '+ req.body.start_exam_id + ' is start!');
          //return; //及时return，不然后续有setHeader操作会报错
        } 

        //当为取消考试操作时
       
        else if( typeof req.body.cancel_exam_id !== 'undefined'){
          console.log('正在进行取消考试(' + req.body.cancel_exam_id + ')操作');
         
          for(var j = 0; j < db_exam_list.length; j++){
            if(db_exam_list[j].id == req.body.cancel_exam_id){
                db_exam_list[j].is_start = 'no';

                break;
            }
              
          }
          
          res.send('exam '+ req.body.cancel_exam_id + ' is cancel!');
          //return; //及时return，不然后续有setHeader操作会报错
        } 


        //当为新增用户时
        else if( typeof req.body.add_exam_id !== 'undefined'){
          console.log('正在进行取消考试操作')
          for(var j = 0; j < db.users.length; j++){
             if(db.users[j].id === req.body.user_id){
                res.send({exists:true,info:'该帐号已存在！'});
                return;
              }
          }
          db.users.push({
            id: req.body.user_id,
            password: req.body.user_password,
            department: req.body.user_department,
            role: req.body.user_role,
          });
          res.send({exists:false,info:'成功添加新用户'+req.body.user_id+'!'});
          //return;
        }
        //当为修改用户操作时
        else {
          console.log('正在进行修改用户操作')
          for(var j = 0; j < db.users.length; j++){
             if(db.users[j].id === req.body.user_id){
              db.users[j].password = req.body.user_password;
              db.users[j].department = req.body.user_department;
              db.users[j].role = req.body.user_role;
              //console.log(typeof req.body.user_password)
              break;
            }
            
          }
          res.send(db);
        }

        //db.exam.exam_list.exam_list_content = db_exam_list;
        console.log(db.exam.exam_list.exam_list_content)
        //写入修改后的数据
        fs.writeFileSync('../data/db.json',JSON.stringify(db, null, 4));    
  			//res.send(db);
  			return;
  		}

      // var form = new multiparty.Form();
      // //设置编辑
      // form.encoding = 'utf-8';
      // //设置文件存储路径
      // form.uploadDir = "uploads";
      // //设置单文件大小限制 
      // form.maxFilesSize = 2 * 1024 * 1024;
      // //console.log(req.body)
      // //form.maxFields = 1000;  设置所以文件的大小总和
      // form.parse(req, function(err, fields, files) {
      // // console.log(files.originalFilename);
      // // console.log(fields);
      // // console.log(fields.ss);
      // // console.log(typeof fields.ss[0]);
      // // console.log(fields.ss[0].id);
      // // console.log(files);
      // //同步重命名文件名
      // //fs.renameSync(files.path,files.originalFilename);
      // res.writeHead(200, {'content-type': 'text/plain'});
      // res.write('received upload:\n\n');
      // res.end(util.inspect({fields: fields, files: files}));  //将一个对象转成字符串
      // });
  	}
  }else {
  	res.send('数据库出错！');
  	return;
  }

  //res.send(req.body);
  res.send('用户信息不匹配，请返回重新登录！');


  
});


router.post('/upload',function(req, res, next) {
  var form = new multiparty.Form();
    //设置编辑
  form.encoding = 'utf-8';
  //设置文件存储路径
  form.uploadDir = "../uploads";   //！！！！！！！！！！！！！！！！！路径问题
  //设置单文件大小限制 
  form.maxFilesSize = 2 * 1024 * 1024;
  //console.log(req.body)
  //form.maxFields = 1000;  设置所以文件的大小总和
  form.parse(req, function(err, fields, files) {
  // console.log(files.originalFilename);
  // console.log(fields);
  // console.log(fields.ss);
  // console.log(typeof fields.ss[0]);
  // console.log(fields.ss[0].id);
  // console.log(files);
  //同步重命名文件名
  //fs.renameSync(files.path,files.originalFilename);
  res.writeHead(200, {'content-type': 'text/plain'});
  res.write('received upload:\n\n');
  res.end(util.inspect({fields: fields, files: files}));  //将一个对象转成字符串
  });
})

module.exports = router;