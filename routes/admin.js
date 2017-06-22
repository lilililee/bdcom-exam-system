var express = require('express');
var router = express.Router();
var fs = require('fs');
var file ="../data/db.json";
var checkLogin = require('./inc/checkLogin');

/* GET admin listing. */
router.post('/', function(req, res, next) {
  //读取数据库文件
  var db =JSON.parse(fs.readFileSync(file));
  
  //验证管理员信息，并渲染界面
  if(db.admin){
    for(var i = 0; i < db.admin.length; i++) {
      if(req.body.login_id == db.admin[i].id && req.body.login_password == db.admin[i].password){
          res.render('admin', { data: db.admin[i],note:db.public_note[0].content,time:db.public_note[0].time});
          return;
      }

    }
  }
  
  //当管理员或者密码不正确时执行
 res.send({
    status:"false",
    info: "用户不存在或者密码错误"
  });


  
});


router.post('/publicNote',function(req, res, next){
   var db =JSON.parse(fs.readFileSync(file));
  
  //验证管理员信息
  if(db.admin){
    for(var i = 0; i < db.admin.length; i++) {
      if(req.body.login_id == db.admin[i].id && req.body.login_password == db.admin[i].password){
           db.public_note[0].content = req.body.admin_note;
           db.public_note[0].time =req.body.postTime;
           fs.writeFileSync('../data/db.json',JSON.stringify(db));
           res.send({
              status:"success",
              info: "发布成功"
            });
      }

    }
  }
   
})



module.exports = router;
