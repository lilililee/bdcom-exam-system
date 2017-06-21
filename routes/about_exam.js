var express = require('express');
var router = express.Router();
var fs = require('fs');
var file ="../data/db.json";
var multiparty = require('multiparty');
var util = require('util');
var checkLogin = require('./inc/checkLogin');
var myFunction = require('./inc/myFunction');

/* GET admin listing. */
router.get('/', function(req, res, next) {
  //用于获取考试信息
  //合法的管理员和用户均可获取
  //读取数据库文件

  var db =JSON.parse(fs.readFileSync(file));
  //console.log('checkLogin: ')
  //console.log('checkLogin: ' + checkLogin(db.admin,'111','222'))
  //先验证是否为管理员身份 
  if(checkLogin(db.admin, req.query.login_id, req.query.login_password)){
      res.send(db.exam.exam_list.exam_list_content);
      return;
  }


  //再验证是否为用户
  if(checkLogin(db.users, req.query.login_id, req.query.login_password)){
    var result = [];
    db.exam.exam_list.exam_list_content.forEach(function(item,index){
      if(item.is_start==='yes'){
        result.push(item)
      }
    })
    res.send(result);
     res.setHeader('Content-Type', 'text/plain');
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


        //当为删除考试时
        else if( typeof req.body.delete_exam_id !== 'undefined'){
          console.log('正在进行删除考试操作')
          var exam_list_content = db.exam.exam_list.exam_list_content;
          for(var j = 0; j < exam_list_content.length; j++){
              //console.log(exam_list_content[j].id)
              //console.log(req.body.delete_exam_id)
              if(exam_list_content[j].id === req.body.delete_exam_id){
              //console.log(exam_list_content)
              //console.log(j + ' ---11111111111111')
              //console.log(i)
              // 1. 删除该考试的图片
              exam_list_content[j].content.texts.forEach(function(item, index){
                if(item.pic !== 'undefined'){

                  //console.log(item.pic)
                  //console.log(item.pic.replace('.\\','..\\public\\'))
                  deleteFolderRecursive(item.pic.replace('.\\','..\\public\\'));
                }
              })

              // 2. 删除考试的所有信息
              exam_list_content.splice(j,1);
               //console.log(exam_list_content)
              //return;


              // 删除文件价
              function deleteFolderRecursive(url) {
                //判断给定的路径是否存在
                if( fs.existsSync(url) ) {

                // console.log(1111)
                   // 当为文件夹时，需要逐一删除内部文件夹和文件
                   if(fs.statSync(url).isDirectory()){
                      //返回文件和子目录的数组
                      var files = [];
                      files = fs.readdirSync(url);
                      console.log(files)
                      files.forEach(function(file,index){
                        //var files = [];
                        var curPath = url + "/" + file; 
                        //console.log(curPath)
                        //fs.statSync同步读取文件夹文件，如果是文件夹，在重复触发函数                   
                        deleteFolderRecursive(curPath);

                      });
                      //清除文件夹
                      fs.rmdirSync(url);
                    }
                   // 2. 当为文件时，直接删除 
                   else {
                    fs.unlinkSync(url);
                    }

                  }else{
                    console.log("给定的路径不存在，请给出正确的路径");
                  }
                };
              //deleteFolderRecursive("./test");

               //3. 删除改考试对应的考试记录
              var record_list_content = db.record.record_list.record_list_content;
              var temp_record = [];   
              record_list_content.forEach(function(item,index){
                if( item.exam_id !== req.body.delete_exam_id){
                     temp_record.push(item);
                }
              })
              db.record.record_list.record_list_content = temp_record;

            

              res.send({
                status: 'success',
                info: 'exam '+ req.body.delete_exam_id + ' is delete!'
              });


            }


          }

        }
        //当为所有操作都验证不通过时
        else {
          console.log('正在执行非法的操作！')
          
          res.send('正在执行非法的操作！');
        }

        //db.exam.exam_list.exam_list_content = db_exam_list;
        //console.log(db.exam.exam_list.exam_list_content)
        //写入修改后的数据
        fs.writeFileSync('../data/db.json',JSON.stringify(db, null, 4));    

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
  //读取数据库文件
  var db =JSON.parse(fs.readFileSync(file));

  var form = new multiparty.Form();
    //设置编辑
    form.encoding = 'utf-8';
  //设置文件存储路径
  form.uploadDir = "../public/uploadimages";   //！！！！！！！！！！！！！！！！！路径问题
  //设置单文件大小限制 
  form.maxFilesSize = 2 * 1024 * 1024;
  //console.log(req.body)
  //form.maxFields = 1000;  设置所以文件的大小总和
  form.parse(req, function(err, fields, files) {
  // console.log(files.originalFilename);
  if( typeof fields === 'undefined' ) return;
  //获取提交的考试信息
  var new_exam = JSON.parse(fields.new_exam[0]);  //及时只有一个数据，也是保存在一个数组中
   // console.log(typeof fields.new_exam[0]);
   // console.log(fields.new_exam);
   // console.log(typeof JSON.parse(fields.new_exam));
   // console.log(JSON.parse(fields.new_exam));


   // 1. 判断是否为新增考试
   // id为00000时表明是新加的考试
   //console.log(new_exam.id)
   if(new_exam.id === '00000'){
   // console.log(db.exam_list)
      // 1.1 为当前考试生成一个6位的id， 0开头表示为考试id
      db.exam.exam_list.exam_list_args.sum++;
      new_exam.id = '0' + fiveExamId(db.exam.exam_list.exam_list_args.sum);
      function fiveExamId(num) {
        var id = '00000' + num;
        return id.slice(id.length - 5, id.length);
      }
      

      // 1.2 为简答题图片处理文件路径
      console.log(files)

      var have_file_index = 0;  //表示
      for(var i = 0; i < new_exam.content.texts.length; i++){
          // 1.2.1 判断是否添加了文件
          if(typeof new_exam.content.texts[i].img == 'object') {  
            //console.log(new_exam.content.texts[i])
            new_exam.content.texts[i].pic = files['texts_img'+(i+1)][0].path.replace('.\\public','');
            //have_file_index++;
            //files['texts_img'+(i+1)][0].path是一个相对路径
            //..\public\uploadimages\Fp_azolWAjbBqpuCooJMn9KG.jpg
            //需替换成前台可用的路径
            console.log(new_exam.content.texts[i].pic);
          } else {
           new_exam.content.texts[i].pic = 'undefined';
         }
       } 



      // 2. 加入数据库
      db.exam.exam_list.exam_list_content.push(new_exam);
      // 3. 写入修改后的数据
      fs.writeFileSync('../data/db.json',JSON.stringify(db, null, 4));   
      res.send({
        status: 'success',
        info: '添加考试（'+ new_exam.id +'）成功！<br>题目总共为'+new_exam.count.all.sum+'个，总分为'+ new_exam.count.all.score + '分！<br>如需继续添加考试，请刷新界面！'
      });
      return;
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


//考试界面
router.post('/start', function(req, res, next) {
  console.log('请求路径信息: ./about_exam/start');
   var db =JSON.parse(fs.readFileSync(file));
  //console.log('checkLogin: ')
  //console.log('checkLogin: ' + checkLogin(db.admin,'111','222'))
  //先验证是否为管理员身份 
  var exam_list_content = db.exam.exam_list.exam_list_content;
  console.log(req.body)
  console.log(req.body.login_password)
  if(checkLogin(db.users, req.body.login_id, req.body.login_password)){
      //res.send(db.exam.exam_list.exam_list_content);
      if ( typeof req.body.exam_id != 'undefined' ){
        var is_error = true;
        exam_list_content.forEach(function( item , index){
          if ( item.id === req.body.exam_id && item.is_start === 'yes'){
            console.log(req.body.login_id + '正在进行考试（' + req.body.exam_id + '）');
            res.render('exam', { 
              data: item,
              user_id: req.body.login_id,
              user_password: req.body.login_password
            });
            is_error = false;
            return false;
          }
        })

        if(is_error){
          res.send('当前考试不存在或者已取消！')
        }
      }


      return;
  }
})

router.post('/end', function(req, res, next) {
  console.log('请求路径信息: ./about_exam/end');
   var db =JSON.parse(fs.readFileSync(file));
  //console.log('checkLogin: ')
  //console.log('checkLogin: ' + checkLogin(db.admin,'111','222'))
  
 // console.log( req.body.login_id)
 
  if(checkLogin(db.users, req.body.login_id, req.body.login_password)){
      var record_list_content = db.record.record_list.record_list_content;
      var record = JSON.parse(req.body.record);
      
      //console.log(record)
      //2表示id类别，为考试记录
      //myFunction.initId返回一个5位数的字符
      if (record.id == '200000') {

         //为记录生成id
         db.record.record_list.record_list_args.sum ++;
         record.id = '2' + myFunction.initId(db.record.record_list.record_list_args.sum);
      }

      //console.log(record.id)

      //成绩统计
      var db_exam = myFunction.getExamById(record.exam_id, db);
      //console.log(db_exam);
      
      var score = 0;


      console.log('开始统计选择题')
      record.answer.selects.forEach(function(item, index){
        var cur_select = db_exam.content.selects[index];
        // console.log(item + '**')
        // console.log(cur_select.answer)
        if(item === cur_select.answer){
          score += cur_select.value * 1;
        }
      });

      console.log('开始统计判断题')
      record.answer.judges.forEach(function(item, index){
        var cur_judge = db_exam.content.judges[index];
        // console.log(item + '**')
        // console.log(cur_judge.answer)
        if(item === cur_judge.answer){
          score += cur_judge.value * 1;
        }
      })
      //console.log(score)
      record.score = score + '';
      //console.log(record)

      db.record.record_list.record_list_content.push(record);
      fs.writeFileSync('../data/db.json',JSON.stringify(db, null, 4));   

      res.send({
        status: 'success',
        info: '提交考试成绩成功！'
      }) 
      return;
  }
})


/* GET admin listing. */
router.get('/check', function(req, res, next) {
  //用于获取考试信息
  //合法的管理员和用户均可获取
  //读取数据库文件

  var db =JSON.parse(fs.readFileSync(file));
  //console.log('checkLogin: ')
  //console.log('checkLogin: ' + checkLogin(db.admin,'111','222'))
  //先验证是否为管理员身份 
  if(checkLogin(db.admin, req.query.login_id, req.query.login_password)){
      var record_list_content = db.record.record_list.record_list_content;
      var result = {};
      var record_result = [];
      record_list_content.forEach(function(item, index){
        if(item.exam_id === req.query.check_exam_id ){
          record_result.push(item);
        }
      })

      result.record =  record_result;
      result.exam_info = myFunction.getExamById(req.query.check_exam_id, db);
      res.send(result);
      return;
  }

  //res.send(req.query);
  res.send('用户信息不匹配，请返回重新登录！');


  
});



/* POST admin listing. */
router.post('/check', function(req, res, next) {
  //读取数据库文件
  var db =JSON.parse(fs.readFileSync(file));
  //先验证管理员身份
  if(db.admin){
    for(var i = 0; i < db.admin.length; i++) {
    
      if(req.body.login_id === db.admin[i].id && req.body.login_password === db.admin[i].password){
        //先从数据库获取考试列表
        var db_record_list = db.record.record_list.record_list_content; 
        //当为阅卷操作时
        console.log(req.body)
        if(typeof req.body.texts_score !== 'undefined'){ 
          console.log('正在进行阅卷(' +  req.body.record_id + ')操作')

          for(var j = 0; j < db_record_list.length; j++){
            if(db_record_list[j].id == req.body.record_id){
              db_record_list[j].is_check = 'yes';
              db_record_list[j].final_score = (db_record_list[j].score*1 + req.body.texts_score*1) + '';
              break;
            }

          }
          res.send({
            status: 'success',
            info: '保存' + req.body.record_id + '考试成绩成功！'
          })
          //res.send('exam '+ req.body.start_exam_id + ' is start!');
          //return; //及时return，不然后续有setHeader操作会报错
        } 

       

        //当为删除考试记录时 
        else if( typeof req.body.delete_record_id !== 'undefined'){
          console.log('正在进行删除考试记录操作')
          var record_list_content = db.record.record_list.record_list_content;
          for(var j = 0; j < record_list_content.length; j++){
           
              if(record_list_content[j].id === req.body.delete_record_id){
             
              
              //  删除考试的所有信息
              record_list_content.splice(j,1);
              
              res.send({
                status: 'success',
                info: 'exam '+ req.body.delete_exam_id + ' is delete!'
              });


            }
          }

        }
        //当为所有操作都验证不通过时
        else {
          console.log('正在执行非法的操作！')
          
          res.send('正在执行非法的操作！');
        }

        //db.exam.exam_list.exam_list_content = db_exam_list;
        //console.log(db.exam.exam_list.exam_list_content)
        //写入修改后的数据
        fs.writeFileSync('../data/db.json',JSON.stringify(db, null, 4));    

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


/* GET admin listing. */
router.get('/query', function(req, res, next) {
  //用于获取考试信息
  //合法的管理员和用户均可获取
  //读取数据库文件

  var db =JSON.parse(fs.readFileSync(file));
  //console.log('checkLogin: ')
  //console.log('checkLogin: ' + checkLogin(db.admin,'111','222'))
  //先验证是否为管理员身份 
  if(checkLogin(db.admin, req.query.login_id, req.query.login_password)){
      var record_list_content = db.record.record_list.record_list_content;
      var result = {};
      var record_result = [];
      record_list_content.forEach(function(item, index){
        if(item.exam_id === req.query.query_exam_id ){
          record_result.push(item);
        }
      })

      result.record =  record_result;
      result.exam_info = myFunction.getExamById(req.query.query_exam_id, db);
      res.send(result);
      return;
  }

  if(checkLogin(db.users, req.query.login_id, req.query.login_password)){
      var record_list_content = db.record.record_list.record_list_content;
      var result = {};
      var record_result = [];
      record_list_content.forEach(function(item, index){
        if(item.exam_id === req.query.query_exam_id && item.user_id === req.query.login_id){
          record_result.push(item);
        }
      })

      result.record =  record_result;
      result.exam_info = myFunction.getExamById(req.query.query_exam_id, db);
      res.send(result);
      return;
  }


  //res.send(req.query);
  res.send('用户信息不匹配，请返回重新登录！');

  return;
  
});



/* POST admin listing. */
router.post('/query', function(req, res, next) {
  //读取数据库文件
  var db =JSON.parse(fs.readFileSync(file));
  //先验证管理员身份
  if(db.admin){
    for(var i = 0; i < db.admin.length; i++) {
    
      if(req.body.login_id === db.admin[i].id && req.body.login_password === db.admin[i].password){
        //先从数据库获取考试列表
        var db_record_list = db.record.record_list.record_list_content; 
        //当为发布考试操作时
        console.log(req.body)
        if(typeof req.body.texts_score !== 'undefined'){ 
          console.log('正在进行阅卷(' +  req.body.record_id + ')操作')

          for(var j = 0; j < db_record_list.length; j++){
            if(db_record_list[j].id == req.body.record_id){
              db_record_list[j].is_query = 'yes';
              db_record_list[j].final_score = (db_record_list[j].score*1 + req.body.texts_score*1) + '';
              break;
            }

          }
          res.send({
            status: 'success',
            info: '保存' + req.body.record_id + '考试成绩成功！'
          })
          //res.send('exam '+ req.body.start_exam_id + ' is start!');
          //return; //及时return，不然后续有setHeader操作会报错
        } 

       

        //当为删除考试记录时
        else if( typeof req.body.delete_record_id !== 'undefined'){
          console.log('正在进行删除考试记录操作')
          var record_list_content = db.record.record_list.record_list_content;
          for(var j = 0; j < record_list_content.length; j++){
              //console.log(record_list_content[j].id)
              //console.log(req.body.delete_record_id)
              if(record_list_content[j].id === req.body.delete_record_id){
             
              
              //  删除对应考试记录的所有信息
              record_list_content.splice(j,1);
              
               //console.log(record_list_content)
              //return;


              
              res.send({
                status: 'success',
                info: 'exam '+ req.body.delete_exam_id + ' is delete!'
              });


            }
          }

        }
        //当为所有操作都验证不通过时
        else {
          console.log('正在执行非法的操作！')
          
          res.send('正在执行非法的操作！');
        }

        //db.exam.exam_list.exam_list_content = db_exam_list;
        //console.log(db.exam.exam_list.exam_list_content)
        //写入修改后的数据
        fs.writeFileSync('../data/db.json',JSON.stringify(db, null, 4));    

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





//考试详情界面
router.post('/record/detail', function(req, res, next) {
  console.log('请求路径信息: ./about_exam/record/detail');
   var db =JSON.parse(fs.readFileSync(file));
  //console.log('checkLogin: ')
  //console.log('checkLogin: ' + checkLogin(db.admin,'111','222'))
 
  var exam_list_content = db.exam.exam_list.exam_list_content;
  var record_list_content = db.record.record_list.record_list_content;
 
      //res.send(db.exam.exam_list.exam_list_content);
    if ( typeof req.body.exam_id != 'undefined' && typeof req.body.record_id != 'undefined' ){
        var is_error = true;
        var page_data = {};
        exam_list_content.forEach(function( item , index){
          if ( item.id === req.body.exam_id){
            //console.log(req.body.login_id + '正在进行考试（' + req.body.exam_id + '）');
            page_data.exam = item;
            is_error = false;
            return false;
          }
        });

        if(is_error){
          res.send('当前查询考试已不存在！');
          return;
        }

        is_error = true;
        record_list_content.forEach(function( item , index){
          if ( item.id === req.body.record_id){
            //console.log(req.body.login_id + '正在进行考试（' + req.body.record_id + '）');
            page_data.record = item;        
            is_error = false;
            return false;
          }
        })

        if(is_error){
          res.send('当前查询考试记录已不存在！');
          return;
        }

        console.log(page_data);
        res.render('record', { 
          data: page_data
         
        });

    }
    return;
})




module.exports = router;