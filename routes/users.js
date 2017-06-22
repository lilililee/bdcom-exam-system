var express = require('express');
var router = express.Router();
var fs = require('fs');
var file ="../data/db.json";
// var db =JSON.parse(fs.readFileSync(file));   //在此读取文件不实时

/* GET users listing. */
router.post('/', function(req, res, next) {
  console.log('./users')
  //读取数据库文件
  var db =JSON.parse(fs.readFileSync(file));
  
  //验证用户信息，并渲染用户界面
  if(db.users){
    for(var i = 0; i < db.users.length; i++) {
      
      if(req.body.login_id == db.users[i].id && req.body.login_password == db.users[i].password){
        res.render('users', { data: db.users[i],note:db.public_note[0].content,time:db.public_note[0].time});
        return;
      }
    }
  }else {
    res.send('数据库出错！');
    return;
  }

  //用户不存在或者密码错误时执行
  res.send({
    status:"false",
    info: "帐号不存在或密码错误!"
  });  
});

router.post('/password', function(req, res, next) {
  //读取数据库文件
  var db =JSON.parse(fs.readFileSync(file));
  
  //验证用户信息，并渲染用户界面
  if(db.users){
    for(var i = 0; i < db.users.length; i++) {
      
      if(req.body.login_id == db.users[i].id && req.body.login_password == db.users[i].password){
    
        db.users[i].password = req.body.user_newpassword;
        fs.writeFileSync('../data/db.json',JSON.stringify(db));
        res.send({
              status:"success",
              info: "密码修改成功,请记住你的密码。下次请使用新密码登录。"
            });
      }
    }
  }
  
});

router.post('/message', function(req, res, next) {
  //读取数据库文件
  var db =JSON.parse(fs.readFileSync(file));
  //验证用户信息，并渲染用户界面
  if(db.users){
    for(var i = 0; i < db.users.length; i++) {
      if(req.body.login_id == db.users[i].id && req.body.login_password == db.users[i].password){
       console.log(req.body);
        db.message.message_list.message_list_args.sum++;
        var new_message ={
          id: '',    
          title: '',
          content: '',
          time: '',
          name:''
        }
    new_message.id = fiveCourseId(db.message.message_list.message_list_args.sum);
      function fiveCourseId(num) {
        var id = '00000' + num;
        return '5' + id.slice(id.length - 4, id.length);
      }
    new_message.title = req.body.messageTitle;
    
    new_message.content = req.body.messageContents;
    
    new_message.time =  req.body.postTime;  
    
    new_message.name = req.body.login_id;
    
    db.message.message_list.message_list_content.push(new_message);   
        
    fs.writeFileSync('../data/db.json',JSON.stringify(db));  
        res.send({
              status:"success",
              info: "留言提交成功"
            });
        return;  
      }
    }
  }
  
});

module.exports = router;
