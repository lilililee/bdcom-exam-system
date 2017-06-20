var express = require('express');
var router = express.Router();
var fs = require('fs');
var file ="../data/db.json";
var checkLogin = require('./inc/checkLogin');


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
        res.send(db.users);
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
      console.log(req.body.login_id)
  		console.log(req.body.login_password)
  		if(req.body.login_id === db.admin[i].id && req.body.login_password === db.admin[i].password){
        //当为删除用户操作时
        console.log('正在进行删除用户操作')
        if(typeof req.body.delete_user_id !== 'undefined'){
          console.log(req.body.delete_user_id)
           for(var j = 0; j < db.users.length; j++){
             if(db.users[j].id === req.body.delete_user_id){
              db.users.splice(j,1);

               //删除该用户对应的考试记录
              var record_list_content = db.record.record_list.record_list_content;
              var temp_record = [];   
              record_list_content.forEach(function(item,index){
                if( item.user_id !== req.body.delete_user_id){
                     temp_record.push(item);
                     //console.log(item)
                } else {
                  console.log(4444444444)
                  console.log(item)
                }
              })
             
              db.record.record_list.record_list_content = temp_record;
              

              break;
            }
            
          }
          
          res.send(db);
        } 
        //当为新增用户时
        else if(typeof req.body.add_user !== 'undefined'){
          console.log('正在进行新增用户操作')
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
        else{
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
  res.send('用户信息不匹配，请返回重新登录！');


  
});




router.get('/message', function(req, res, next) {
  //读取数据库文件
  console.log('2222222211111111111111111111');
  var db =JSON.parse(fs.readFileSync(file));
  //先验证管理员身份
    if(checkLogin(db.admin, req.query.login_id, req.query.login_password)){
      console.log('11111111111111111111');
      res.send(db.message.message_list.message_list_content);
      return;
  }
  //res.send(req.query);
  res.send('用户信息不匹配，请返回重新登录！');
});

router.post('/message',function(req, res,next){
    var db =JSON.parse(fs.readFileSync(file));
    
    if(db.admin){
    for(var i = 0; i < db.admin.length; i++) {
      if(req.body.login_id == db.admin[i].id && req.body.login_password == db.admin[i].password){
          console.log('2222222222222222222');
           for(var j = 0; j < db.message.message_list.message_list_content.length; j++){
             if(db.message.message_list.message_list_content[j].id === req.body.delete_message_id){
              db.message.message_list.message_list_content.splice(j,1);
              break;
            } 
          }
         fs.writeFileSync('../data/db.json',JSON.stringify(db, null, 4));
          res.send({
            status:"success",
            info:"成功"
          });
          
      }
    }
  }
      
})



module.exports = router;