var user = {};

function initUser (id,password){
	console.log(id)
	user.id = id;
	user.password = password;
}

$(function () {
	$('[data-toggle="popover"]').popover();

  function errorInfo(traget, info){
    traget.html('<div class="alert alert-warning" role="alert">'+ info +'</div>');
  }

	function innerModelHander( show_controller, traget_model, post_fn) {

      // var uesrs_glyphicon_edit = $('.admin-users-list .glyphicon-edit'); //所有修改按钮  show_controller
      // var model_user_change = $('.model-user-change'); //所有单个用户信息  traget_model
      //console.log('正在执行innerModelHander...')
      //打开提示界面
      show_controller.click(function() {
        //console.log(show_controller.index(this))

        traget_model.eq(show_controller.index(this)).animate({
        	'opacity': '1'
        }).css('opacity', '0').css('display', 'block');
    })
      //关闭提示界面
      traget_model.find('.close-innermodel').click(function() {

      	traget_model.fadeOut();
      })
      //console.log(222)

      //提交提示
      traget_model.find('.submit-innermodel').on('click',function() {
        //console.log(111)
          post_fn.call(this,traget_model);     //执行一次post并更新列表，this指向提交按钮
          
      })
  }



    //用户相关操作
      //密码修改函数：
     function submitPassInfo(submit_button) {
      submit_button.click(function(e) {
        e.preventDefault();
        var form = $(this).parents('form');
        var items = form.find('input,textarea');
        var submit_result = form.find('.submit-result');
           console.log(items);
        for (var i = 0; i < items.length; i++) {
          if (items[i].value === '') {
            console.log(items[i]);
            submit_result.html('<div class="alert alert-warning" role="alert">请正确填写密码信息！</div>') ;
            return;
          }
        }
        for (var k=1;k<4;k++) {
          if(/^\w{3,16}$/.test(items[k].value)){
            console.log('密码校验成功');
          }else{
            submit_result.html('<div class="alert alert-warning" role="alert">密码长度必须在3到16位，且为数字或者字母！</div>') ;
            return;
          }
        }
        if(items[1].value != user.password)
        {
          console.log(items[1].value);
          console.log(user.password);
           submit_result.html('<div class="alert alert-warning" role="alert">原密码输入错误，请重新输入</div>') ;  
           return;
        }
         if(items[2].value != items[3].value){
          console.log(items[2].value);
          console.log(items[3].value);
          submit_result.html('<div class="alert alert-warning" role="alert">两次输入的新密码不一致，请重新输入</div>') ;
          return;
        }else{
          console.log('两次输入的一致');
        }
        var pass_data = {};
        pass_data.login_id = user.id;
        pass_data.login_password = user.password;
        for (var i = 0; i < items.length; i++) {
          pass_data[items[i].name] = items[i].value;
        }
        console.log(pass_data);
        $.post('./users/password', pass_data,
          function(data, status) {

            if (typeof data.status != 'undefined' && data.status == 'success') {
              submit_result.html('<div class="alert alert-success" role="alert">' + data.info + '</div>');
            } else {
              submit_result.html('<div class="alert alert-danger" role="alert">' + data.info + '</div>');
            }

              })

      })

        //点击取消按钮时 删除提交信息
        $('.add-password-reset').click(function() {
          $(this).parents('form').find('.submit-result').html('')

        })

      }
      submitPassInfo($('.add-password-submit'));
      
      
      
      
      
    //留言提交函数：
    function submitMessageInfo(submit_button) {
      submit_button.click(function(e) {
        e.preventDefault();
        var form = $(this).parents('form');
        var items = form.find('input,textarea');
        var submit_result = form.find('.submit-result');
        var data =getNowFormatDate();
        for (var i = 0; i < items.length; i++) {
          if (items[i].value === '') {
            submit_result.html('<div class="alert alert-warning" role="alert">请完善留言信息！</div>') ;
            return;
          }
        }
        var message_data = {};
        message_data.login_id = user.id;
        message_data.login_password = user.password;
        message_data.postTime = data;
        for (var i = 0; i < items.length; i++) {
          message_data[items[i].name] = items[i].value;
        }
        $.post('./users/message', message_data,
          function(data, status) {
           if (typeof data.status != 'undefined' && data.status == 'success') {
              submit_result.html('<div class="alert alert-success" role="alert">' + data.info + '</div>');
            } else {
              submit_result.html('<div class="alert alert-danger" role="alert">' + data.info + '</div>');
            }

        });

      })
        $('.add-message-reset').click(function() {
           $(this).parents('form').find('.submit-result').html('')
  
         })
      };
      
     submitMessageInfo($('.add-message-submit'));
     
     //获取当前时间
     function getNowFormatDate() {
      var date = new Date();
      var seperator1 = "-";
      var seperator2 = ":";
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      var strHour = date.getHours();
      var strMinutes = date.getMinutes();
      var strSeconds = date.getSeconds();
      if(month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if(strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
        if(strHour >= 0 && strHour <= 9) {
        strHour = "0" + strHour;
      } 
      if(strMinutes >= 0 && strMinutes <= 9) {
        strMinutes = "0" + strMinutes;
      }
      if(strSeconds >= 0 && strSeconds <= 9) {
        strSeconds = "0" + strSeconds;
      }   
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
        " " + strHour + seperator2 + strMinutes +
        seperator2 + strSeconds;
      return currentdate;
    }
      
       
 //用户相关的操作结束


   // 考试相关操作
    //根据get请求获取的数据来渲染列表
    function joinExamString(data) {
    	var result = '';
      //console.log("joinString")
      //console.log(data)

      data.forEach(function(user, index) {
      	if(user.is_start === 'no') return;
      		console.log(user.id)
      	

      	result += '<tr><th scope="row">' + (index + 1) + '</th><td>' + user.id + '</td><td>' + user.name + '</td>\
      	<td> \
      	\
      	<span class="glyphicon  glyphicon-pencil" aria-hidden="true" title="开始考试" data-exam-id="' + user.id +'"></span>\
      	<div class="modal fade model-exam-start" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">\
        <div class="modal-dialog" role="document">\
        <div class="modal-content">\
        <div class="modal-header">\
        <button type="button" class="close close-innermodel" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
        <h4 class="modal-title" id="myModalLabel">开始考试</h4>\
        </div>\
        <div class="modal-body">\
        确认开始考试（' + user.name + '）？\
        </div>\
        <div class="modal-footer">\
        <button type="button" class="btn btn-default close-innermodel" >取消</button>\
        <button type="button" class="btn btn-danger submit-innermodel" data-exam-id="' + user.id + '">确认</button>\
        </div>\
        </div>\
        </div>\
        </div></td>'
      })
return result;
}

    //用来更新列表，用户，考试，课件
    //get地址， 拼接字符串操作， 列表容器（字符串）
    function updateExamList(server_url, joinString, list_container) {
    	var data = [];
        console.log(user.id)
        //获取所用用户数据
        $.get( server_url+'?login_id='+user.id+'&login_password='+user.password,
        	function(data, status) {
        		var result = '';
            //console.log(data);
            if (Array.isArray(data)) {
            	result = joinString(data);

            } else {
            	console.log(data)

            }
            
            //循环结束，开始插入html，更新表格
            $( list_container + ' tbody').html('').append(result);

            // //发布考试
            // innerModelHander($(list_container + ' .glyphicon-exam-start'),$('.model-exam-start'),function(traget_model){
            //    //this指向提交按钮，会有data-id属性
            //    var exam_id = $(this).attr('data-exam-id');
            //   //console.log(exam_id)
            //   var post_data = {
            //   	login_id: user.id,
            //   	login_password: user.password,
            //   };
            //   var exam_start_model = $('.model-exam-start');
            //     //console.log($('.model-exam-start').find('.submit-innermodel').index(this))
            //     var index = exam_start_model.find('.submit-innermodel').index(this);
            //     //获取对应的glyphicon按钮
            //     var target_glyphicon = $(list_container + ' .glyphicon-exam-start').eq(index);
            //    // exam_start_model[index].innerHTML = exam_start_model[index].innerHTML.replace('发布','取消');
            //    // console.log(exam_start_model[index].innerHTML = )
            //    if(target_glyphicon.attr('data-is-start') === 'no'){
            //    	post_data.start_exam_id = exam_id;
            //    	setTimeout(function(){
            //    		target_glyphicon.removeClass('glyphicon-ban-circle').addClass('glyphicon-ok-sign').attr('title','取消考试');
            //       //exam_start_model[index].innerHTML.replace('发布','取消');

            //       var traget_text1 = exam_start_model.eq(index).find('h4');
            //       traget_text1.html(traget_text1.html().replace('发布','取消'));

            //       var traget_text2 = exam_start_model.eq(index).find('.modal-body');
            //       traget_text2.html(traget_text2.html().replace('发布','取消'));
            //       target_glyphicon.attr('data-is-start','yes');
            //   },500)

            //    } else {
            //    	post_data.cancel_exam_id = exam_id;
            //    	setTimeout(function(){
            //    		target_glyphicon.removeClass('glyphicon-ok-sign').addClass('glyphicon-ban-circle').attr('title','发布考试');
            //       //exam_start_model[index].innerHTML.replace('取消','发布')
            //       var traget_text1 = exam_start_model.eq(index).find('h4');
            //       console.log(traget_text1)
            //       traget_text1.html(traget_text1.html().replace('取消','发布'));

            //       var traget_text2 = exam_start_model.eq(index).find('.modal-body');
            //       traget_text2.html(traget_text2.html().replace('取消','发布'));
            //       target_glyphicon.attr('data-is-start','no');
            //   },500)

            //    }
            //    $.post(server_url, post_data, function(data, status) {
            //    	traget_model.fadeOut();
            //        //  setTimeout(function(){
            //        //    updateExamList(server_url,joinString, list_container)
            //        //  }, 300)
            //         //updateExamList()
            //         console.log(data)
            //     })




            //     //$(this).removeClass('glyphicon-ok-sign').addClass('glyphicon-ban-circle');
            // })

            // 修改考试    //未实现。。。。
            // innerModelHander($(list_container + ' .glyphicon-edit'),$('.model-user-change'),function(traget_model){
            // 	var form = $(this).parents('form')[0];

            // 	$.post(server_url, {
            // 		login_id: user.id,
            // 		login_password: user.password,
            // 		user_id: form.user_id.value,
            // 		user_password: form.user_password.value,
            // 		user_department: form.user_department.value,
            // 		user_role: form.user_role.value
            // 	},
            // 	function(data, status) {
            // 		traget_model.fadeOut();
            // 		setTimeout(function(){

            // 			updateExamList(server_url,joinString, list_container);
            // 		}, 500)
            //         //updateExamList()
            //     })
            // })
            
            //开始考试
            innerModelHander($('.admin-exam-list .glyphicon-pencil'),$('.model-exam-start'),function(traget_model){
               //this指向提交按钮，会有data-id属性
               traget_model.fadeOut();
               var exam_id = $(this).attr('data-exam-id');
               // console.log(typeof exam_id)
               //此处post使用表单来实现页面跳转
               var start_exam_form = document.getElementsByClassName('start_exam_form')[0];
               start_exam_form.exam_id.value = exam_id;         
               start_exam_form.submit();

               
              
           })

            
        })

}
    //updateExamList  end

    //用来更新列表，用户，考试，课件
    //get地址， 拼接字符串操作， 列表容器（字符串）
    $('.admin-menu-exam,.exam-list-nav-tab').click(function(){
    	updateExamList('./about_exam',joinExamString, '.admin-exam-list');
    });




     //成绩查询记录查询按钮

     // 成绩查询记录相关操作
    //根据get请求获取的数据来渲染列表
    function joinQueryString(data, info) {
      var result = '';
      //console.log("joinString")
      //console.log(data)
      var checked_data = [];

      //筛选出已阅卷的成绩
      data.record.forEach(function(item, index){
          if(item.is_check == 'yes'){
            checked_data.push(item);
          }
      })
      if (typeof data.exam_info == 'undefined') {
        errorInfo(info, '未获取到相关考试信息！'); return;
      } else if (checked_data.length == 0) {
        errorInfo(info, data.exam_info.name+'暂无考试记录！');  return;
      } else {
        var all_score = data.exam_info.count.all.score;
        errorInfo(info, '成功获取-'+data.exam_info.name+'-考试记录，该考试总分为'+ all_score +'分，考试时间为'+data.exam_info.time+'分钟。'); 
      }

     

     

      //对由多个对象构成的数组排序
      //根据对象数组的某个字段排序,升序
      function sortObjectArray (arr, pro_name){   //对象数组，  属性名 (数字为内容的字符)
          var len = arr.length;       
          for( var i = 0; i < len-1; i ++ ){
              for ( var j = 0; j < len - i -1; j++ ){              
                if( parseFloat(arr[j][pro_name]) > parseFloat(arr[j+1][pro_name]) ){
                    var temp = arr[j];
                    arr[j] = arr[j+1];
                    arr[j+1] = temp;                     
                }
              }
          }
      }

      sortObjectArray(checked_data, 'final_score');
      
      checked_data.reverse();

      
      checked_data.forEach(function(user, index) {   //此处user表示一个考试记录
        //if(user.is_start === 'no') {}
          //console.log(user.id)


          var exam_time = Math.ceil((user.end_time * 1 - user.start_time * 1) /  60000);

          var score_class = '';
        
          if ( parseFloat(user.final_score) >= parseFloat(all_score) * 0.8 ) {
            score_class = 'score-excellent';
          } else if ( parseFloat(user.final_score) >= parseFloat(all_score) * 0.6 ){
            score_class = 'score-good';
          } else if ( parseFloat(user.final_score) >= parseFloat(all_score) * 0.4 ){
            score_class = 'score-bad';
          } else {
            score_class = 'score-verybad';
          }

          var score_tag = '<span class="' + score_class + '">'+ user.final_score +'分</span>';

          

          result += '<tr><th scope="row">' + (index + 1) + '</th><td>' + user.user_id + '</td><td>' + exam_time + '分钟</td><td>' + score_tag + '</td>\
          <td> \
          \
         <span class="glyphicon glyphicon-eye-open" data-record-id="'+user.id+'" title="考试记录详情" aria-hidden="true"  data-toggle="modal"></span>\
          \
          \
          \
          </td>'
        })
      return result;
    }

    //用来更新列表，用户，成绩查询记录，成绩查询记录
    //get地址， 拼接字符串操作， 列表容器（字符串）
    function updateQueryList(server_url, joinString, list_container, type) {
      var data = [];
        //console.log(admin.id)
        //获取所用用户数据
        console.log(server_url)

        
        
        var info = $('.exam-query-query-info');
        var query_exam_id = document.getElementById('query-exam-id').value;
        //console.log(query_exam_id);
        
        if(! /^\d{6}$/.test(query_exam_id)){
          errorInfo(info,'请输入合法的考试编号（6位数字）！');
          return;
        } 
          
       
        $.get( server_url+'?login_id='+user.id+'&login_password='+user.password+'&query_exam_id='+query_exam_id,
          function(data, status) {
            var result = '';         
            result = joinString(data, info);

           //console.log(result)
            
            //循环结束，开始插入html，更新表格
            $( list_container + ' tbody').html('').append(result);


          //跳转到考试记录详情界面   

          $(list_container + ' .glyphicon-eye-open').click(function(){
              console.log(data)
            //this指向提交按钮，会有data-id属性
               var exam_id = data.exam_info.id; 

               var record_id = $(this).attr('data-record-id');
               // console.log(typeof exam_id)
               //此处post使用表单来实现页面跳转
               var start_exam_form = document.getElementsByClassName('record_detail_form')[0];
               start_exam_form.exam_id.value = exam_id;         
               start_exam_form.record_id.value = record_id;         
               start_exam_form.submit();
          })

          })


         
      }
    //updateQueryList  end

    //用来更新列表，用户，课件，课件
    //get地址， 拼接字符串操作， 列表容器（字符串）
    $('.user-exam-query-query').click(function(){
      //console.log(22)
      updateQueryList('./about_exam/query',joinQueryString, '.user-exam-record');
    });



    //课程列表部分
    function joinCourseString(data) {
      var result = '';
      //console.log("joinString")
      console.log(data)

      data.forEach(function(user, index) {
        //if(user.is_start === 'no') {}
          //console.log(user.id)


          result += '<tr><th scope="row">' + (index + 1) + '</th><td>' + user.name + '</td>\
          <td> \
          \
          <a href="'+user.src+'" target="_blank"><span class="glyphicon glyphicon-download-alt glyphicon-course-download" title="下载课件" aria-hidden="true"  data-toggle="modal"></span></a> \
          \
   </td>'
        })
      return result;
    }
      function updateCourseList(server_url, joinString, list_container, type) {
      var data = [];
        console.log(user.id)
        //获取所用用户数据
        console.log(server_url)
        $.get( server_url+'?login_id='+user.id+'&login_password='+user.password,
          function(data, status) {
            var result = '';
            console.log(data);
            if (Array.isArray(data)) {
              result = joinString(data);

            } else {
              console.log('返回数据错误，应为数组！')
            }
            
            //循环结束，开始插入html，更新表格
            $( list_container + ' tbody').html('').append(result);

            

            // 修改课件    
            innerModelHander($(list_container + ' .glyphicon-edit'),$('.model-user-change'),function(traget_model){
             var form = $(this).parents('form')[0];
             console.log(server_url)
             $.post(server_url, {
              login_id: admin.id,
              login_password: admin.password,
              course_id: form.course_id.value,
              course_new_name: form.course_new_name.value,
            },
            function(data, status) {
              traget_model.fadeOut();
              setTimeout(function(){

                updateCourseList(server_url,joinString, list_container);
              }, 500)
                    //updateCourseList()
                  })
           })
            
            //删除课件
            innerModelHander($('.admin-course-list .glyphicon-remove'),$('.model-course-remove'),function(traget_model){
               //this指向提交按钮，会有data-id属性
               var course_id = $(this).attr('data-course-id');
               console.log(typeof course_id)
               $.post(server_url, {
                login_id: admin.id,
                login_password: admin.password,
                delete_course_id: course_id
              },
              function(data, status) {
                console.log('success')
                traget_model.fadeOut();
                setTimeout(function(){
                  updateCourseList(server_url,joinString, list_container)
                }, 300)
                    //updateCourseList()
                  })
             })

            
          })

      }

     //用来更新列表，用户，课件，课件 
    //get地址， 拼接字符串操作， 列表容器（字符串）
    $('.admin-menu-course,.course-list-nav-tab').click(function(){
      console.log(22);
      updateCourseList('./about_course',joinCourseString, '.admin-course-list');
    });
   

 

})
