var express = require('express');
var router = express.Router();
var fs = require('fs');
var file ="../data/db.json";


/* GET admin listing. */
router.post('/', function(req, res, next) {
  //读取数据库文件
  var db =JSON.parse(fs.readFileSync(file));
  if(db.admin){
  	for(var i = 0; i < db.admin.length; i++) {
  		
  		console.log(req.body.login_id)
  		console.log(db.admin[i].id)
  		if(req.body.login_id == db.admin[i].id && req.body.login_password == db.admin[i].password){
  			res.render('admin', { data: db.admin[i]});
  			return;
  		}
  	}
  }else {
  	res.send('数据库出错！');
  	return;
  }

  res.send('用户信息不匹配，请返回重新登录！');


  
});

module.exports = router;
