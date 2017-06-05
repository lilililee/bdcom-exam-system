var express = require('express');
var router = express.Router();
var fs = require('fs');
var file ="../data/db.json";


/* GET admin listing. */
router.get('/', function(req, res, next) {
  //读取数据库文件
  var db =JSON.parse(fs.readFileSync(file));
  //先验证管理员身份
  if(db.admin){
    for(var i = 0; i < db.admin.length; i++) {
      
      // console.log(req.query.login_id)
      // console.log(db.admin[i].id)
      if(req.query.login_id == db.admin[i].id && req.query.login_password == db.admin[i].password){
        res.send(db.course.course_list.course_list_content);
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
  //console.log(11111111111)
  //读取数据库文件
  var db =JSON.parse(fs.readFileSync(file));
  //先验证管理员身份
  if(db.admin){
  	for(var i = 0; i < db.admin.length; i++) {
      console.log(req.body.login_id)
  		console.log(req.body.login_password)
  		if(req.body.login_id === db.admin[i].id && req.body.login_password === db.admin[i].password){
        //先从数据库获取课件列表
        var course_list = db.course.course_list.course_list_content; 

        //当为删除课件操作时
        if(typeof req.body.delete_course_id !== 'undefined'){
          console.log('正在进行删除课件操作');
          console.log(req.body.delete_course_id)
           for(var j = 0; j < course_list.length; j++){
             if(course_list[j].id === req.body.delete_course_id){
              course_list.splice(j,1);
              break;
            }
            
          }
          
          res.send(course_list);
        } 
        //当为新增课件时
        else if(typeof req.body.add_user !== 'undefined'){
          console.log('正在进行新增课件操作');
          for(var j = 0; j < course_list.length; j++){
             if(course_list[j].id === req.body.user_id){
                res.send({exists:true,info:'该帐号已存在！'});
                return;
              }
          }
          course_list.push({
            id: req.body.user_id,
            password: req.body.user_password,
            department: req.body.user_department,
            role: req.body.user_role,
          });
          res.send({exists:false,info:'成功添加新课件'+req.body.user_id+'!'});
          //return;
        }
        //当为修改课件操作时
        else if(typeof req.body.course_new_name !== 'undefined'){
          console.log('正在进行修改课件操作');
  
          for(var j = 0; j < course_list.length; j++){
            console.log(course_list[j].id)
            console.log(req.body)
             if(course_list[j].id === req.body.course_id){
              course_list[j].name = req.body.course_new_name;
              break;
            }
            
          }
          console.log(111111111111111111)
          console.log(course_list)
          res.send(course_list);
        }else {
          console.log("正在执行非法操作！");
        }
        //写入修改后的数据
        fs.writeFileSync('../data/db.json',JSON.stringify(db, null, 4));    
  			//res.send(db);
  			return;
  		}
  	}
  }else {
  	res.send('数据库出错！');
  	return;
  }

  //res.send(req.body);
  res.send('课件信息不匹配，请返回重新登录！');


  
});

module.exports = router;