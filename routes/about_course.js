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




router.post('/upload',function(req, res, next) {
  //读取数据库文件
  var db =JSON.parse(fs.readFileSync(file));

  var form = new multiparty.Form();
    //设置编辑
    form.encoding = 'utf-8';
  //设置文件存储路径
  form.uploadDir = "../public/uploadcourses";   //！！！！！！！！！！！！！！！！！路径问题
  //设置单文件大小限制 
  form.maxFilesSize =  20 * 1024 * 1024;
  //console.log(req.body)
  //form.maxFields = 1000;  设置所以文件的大小总和
  form.parse(req, function(err, fields, files) {
  // console.log(files.originalFilename);
  //获取提交的考试信息
  //var new_exam = JSON.parse(fields.new_exam[0]);  //及时只有一个数据，也是保存在一个数组中
   // console.log(typeof fields.new_exam[0]);
    console.log(fields);
    console.log(files);
   // console.log(typeof JSON.parse(fields.new_exam));
   // console.log(JSON.parse(fields.new_exam));


   // 1. 判断是否为新增考试
   // id为00000时表明是新加的考试
   //console.log(new_exam.id)
   if( typeof fields !== 'undefined' && fields.course_id[0] === '10000'){
   // console.log(db.exam_list)
      // 1.1 为当前考试生成一个5位的id
      db.course.course_list.course_list_args.sum++;
      var new_course = {
        id: '',
        name: '',
        type: '',
        src: ''
      }
      new_course.id = fiveCourseId(db.course.course_list.course_list_args.sum);
      function fiveCourseId(num) {
        var id = '00000' + num;
        return '1' + id.slice(id.length - 4, id.length);
      }

      // 1.2 课件名称
     
      new_course.name = files.course_file[0].originalFilename;
      

      // 1.3 课件类别
      new_course.type = fields.course_type[0];
      
      // 1.2 为课件处理文件路径
      fs.renameSync(files.course_file[0].path,'../public/uploadcourses/'+files.course_file[0].originalFilename);
      new_course.src = './uploadcourses/'+files.course_file[0].originalFilename;
      
      // 2. 加入数据库
      db.course.course_list.course_list_content.push(new_course);
      // 3. 写入修改后的数据
      fs.writeFileSync('../data/db.json',JSON.stringify(db, null, 4));   
      res.send({
        status: 'success',
        info: '添加课件（'+ new_course.name +'）成功！'
      });
      return;
    } else {
       res.send({
        status: 'false',
        info: '添加课件失败！课件不得大于20M！'
      });
    }
  // console.log(fields.ss);
  // console.log(typeof fields.ss[0]);
  // console.log(fields.ss[0].id);
  // console.log(files);
  //同步重命名文件名
  //fs.renameSync(files.path,files.originalFilename);
  // res.writeHead(200, {'content-type': 'text/plain'});
  // res.write('received upload:\n\n');
  // res.end(util.inspect({fields: fields, files: files}));  //将一个对象转成字符串
});
})


module.exports = router;