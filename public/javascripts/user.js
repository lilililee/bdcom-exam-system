var user = {};

function initUser (id,password){
	console.log(id)
	user.id = id;
	user.password = password;
}

$(function () {
	$('[data-toggle="popover"]').popover();


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


})
