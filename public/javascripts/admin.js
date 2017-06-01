var admin = {};

function initAdmin (id,password){
  console.log(id)
  admin.id = id;
  admin.password = password;
}

$(function() {


  function innerModelHander( show_controller, traget_model, post_fn) {

            // var uesrs_glyphicon_edit = $('.admin-users-list .glyphicon-edit'); //所有修改按钮  show_controller
            // var model_user_change = $('.model-user-change'); //所有单个用户信息  traget_model

            //打开修改用户信息界面
            show_controller.click(function() {
              console.log(show_controller.index(this))

              traget_model.eq(show_controller.index(this)).animate({
                'opacity': '1'
              }).css('opacity', '0').css('display', 'block');
            })
            //关闭修改用户信息界面
            traget_model.find('.close-innermodel').click(function() {

              traget_model.fadeOut();
            })
            console.log(222)

            //提交修改用户信息
            traget_model.find('.submit-innermodel').on('click',function() {
              console.log(111)
                post_fn.call(this,traget_model);     //执行一次post并更新列表，this指向提交按钮
                
              })
          }

    //根据get请求获取的数据来渲染列表
    function joinUserString(data) {
      var result = '';
      //console.log("joinString")
      //console.log(data)

      data.forEach(function(user, index) {
        result += '<tr><th scope="row">' + (index + 1) + '</th><td>' + user.id + '</td><td>' + user.department + '</td><td>' + user.role + '</td>\
        <td> <span class="glyphicon glyphicon-edit" title="修改信息" aria-hidden="true"  data-toggle="modal"></span> \
        \
        <div class="modal fade model-user-change" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">\
        <div class="modal-dialog" role="document">\
        <div class="modal-content">\
        <div class="modal-header">\
        <button type="button" class="close close-innermodel"  aria-label="Close"><span aria-hidden="true">&times;</span></button>\
        <h4 class="modal-title" id="myModalLabel">' + user.id + '基本资料</h4>\
        </div>\
        <form>\
        <div class="modal-body">\
        <div class="input-group">\
        <span class="input-group-addon" id="basic-addon1">密码：</span>\
        <input type="text" name="user_password" class="form-control" value="' + user.password + '" aria-describedby="basic-addon1">\
        </div>\
        <div class="input-group">\
        <span class="input-group-addon" id="basic-addon2">部门：</span>\
        <input type="text" name="user_department"  class="form-control" value="' + user.department + '" aria-describedby="basic-addon2">\
        </div>\
        <div class="input-group">\
        <span class="input-group-addon" id="basic-addon3">职位：</span>\
        <input type="text" name="user_role" class="form-control" value="' + user.role + '" aria-describedby="basic-addon3">\
        </div>\
        </div>\
        <div class="modal-footer">\
        <button type="button" class="btn btn-default close-innermodel">取消</button>\
        <button type="button" class="btn btn-primary submit-innermodel">保存</button>\
        </div>\
        <input type="hidden" name="user_id" value="' + user.id + '">\
        </form>\
        </div>\
        </div>\
        \
        </div><span class="glyphicon glyphicon-remove" aria-hidden="true" title="删除用户" ></span>\
        <div class="modal fade model-user-remove" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">\
        <div class="modal-dialog" role="document">\
        <div class="modal-content">\
        <div class="modal-header">\
        <button type="button" class="close close-innermodel" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
        <h4 class="modal-title" id="myModalLabel">删除用户</h4>\
        </div>\
        <div class="modal-body">\
        确认删除' + user.id + '？\
        </div>\
        <div class="modal-footer">\
        <button type="button" class="btn btn-default close-innermodel" >取消</button>\
        <button type="button" class="btn btn-danger submit-innermodel" data-user-id="' + user.id + '">确认</button>\
        </div>\
        </div>\
        </div>\
        </div></td>'
      })
      return result;
    }

    //用来更新列表，用户，考试，课件
    //get地址， 拼接字符串操作， 列表容器（字符串）
    function updateUsersList(server_url, joinString, list_container) {
      var data = [];
        //console.log(admin.id)
        //获取所用用户数据
        $.get( server_url+'?login_id='+admin.id+'&login_password='+admin.password,
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

            // 修改用户
            innerModelHander($('.admin-users-list .glyphicon-edit'),$('.model-user-change'),function(traget_model){
             var form = $(this).parents('form')[0];

             $.post(server_url, {
              login_id: admin.id,
              login_password: admin.password,
              user_id: form.user_id.value,
              user_password: form.user_password.value,
              user_department: form.user_department.value,
              user_role: form.user_role.value
            },
            function(data, status) {
              traget_model.fadeOut();
              setTimeout(function(){

                updateUsersList(server_url,joinString, list_container);
              }, 500)
                    //updateUsersList()
                  })
           })
            
            //删除用户
            innerModelHander($('.admin-users-list .glyphicon-remove'),$('.model-user-remove'),function(traget_model){
               //this指向提交按钮，会有data-id属性
               var user_id = $(this).attr('data-user-id');

               $.post(server_url, {
                login_id: admin.id,
                login_password: admin.password,
                delete_user_id: user_id
              },
              function(data, status) {
               traget_model.fadeOut();
               setTimeout(function(){
                updateUsersList(server_url,joinString, list_container)
              }, 300)
                    //updateUsersList()
                  })
             })

            
          })

      }
    //updateUsersList  end

    //用来更新列表，用户，考试，课件
    //get地址， 拼接字符串操作， 列表容器（字符串）
    $('.admin-menu-users,.user-list-nav-tab').click(function(){
      updateUsersList('./about_users',joinUserString, '.admin-users-list');
    });

    $('[data-toggle="popover"]').popover();



    //检测用户信息是否填写完整
    // <div class="input-group">
    //   <span class="input-group-addon" id="basic-addon1" >帐 号：</span>
    //   <input type="text" name="user_id" class="form-control" aria-describedby="basic-addon1" data-validate-type="number" data-validate-name="帐号"></div>
    // <div class="input-group">
    function submitNewInfo(submit_button) {
      submit_button.click(function(e) {
        e.preventDefault();
        var form = $(this).parents('form');
        var items = form.find('input,textarea');
        var submit_result = form.find('.submit-result');
        for (var i = 0; i < items.length; i++) {
          if (items[i].value === '') {

            submit_result.html('<div class="alert alert-warning" role="alert">请填写完整信息！</div>') ;
            return;
          }


          var type = items[i].getAttribute('data-validate-type');
          console.log(type)
          if(typeof type !== 'undefied'){
            var info = '';
            switch( type ){
              case 'number': 
              if(!(/^(0|[1-9]\d*)$/).test(items[i].value)) {
                info = items[i].getAttribute('data-validate-name') + '必须为正整数！';
                break;
              }

            }
            if( info !== '') {
              submit_result.html('<div class="alert alert-warning" role="alert">'+info+'</div>') ;
              return;
            }
          }
        }
        var post_data = {};

        post_data.login_id = admin.id;
        post_data.login_password = admin.password;
        for (var i = 0; i < items.length; i++) {
          post_data[items[i].name] = items[i].value;
        }
        $.post('./about_users', post_data,
          function(data, status) {

            if (data.exists) {
              submit_result.html('<div class="alert alert-danger" role="alert">' + data.info + '</div>');
            } else {
              submit_result.html('<div class="alert alert-success" role="alert">' + data.info + '</div>');
            }

                // setTimeout(function(){
                //   submit_result.html('');
                // },3000)
              })

      })

        //点击重置按钮时删除提交信息
        $('.add-user-reset').click(function() {
          $(this).parents('form').find('.submit-result').html('')

        })

      }

      submitNewInfo($('.add-user-submit'));






    // 考试相关操作
    //根据get请求获取的数据来渲染列表
    function joinExamString(data) {
      var result = '';
      //console.log("joinString")
      //console.log(data)

      data.forEach(function(user, index) {
        if(user.is_start === 'no') {}

        var glyphicon_start = user.is_start === 'yes'? 'glyphicon-ok-sign' : 'glyphicon-ban-circle';
        var text_start = user.is_start === 'yes'? '取消' : '发布';

        result += '<tr><th scope="row">' + (index + 1) + '</th><td>' + user.id + '</td><td>' + user.name + '</td>\
        <td> \
        \
        <span class="glyphicon '+ glyphicon_start +' glyphicon-exam-start" aria-hidden="true" title="发布考试" data-is-start="' + user.is_start +'"></span>\
        <div class="modal fade model-exam-start" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">\
        <div class="modal-dialog" role="document">\
        <div class="modal-content">\
        <div class="modal-header">\
        <button type="button" class="close close-innermodel" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
        <h4 class="modal-title" id="myModalLabel">' + text_start + '考试</h4>\
        </div>\
        <div class="modal-body">\
        确定' + text_start + '考试--' + user.name + '(' + user.id + ')？\
        </div>\
        <div class="modal-footer">\
        <button type="button" class="btn btn-default close-innermodel" >取消</button>\
        <button type="button" class="btn btn-danger submit-innermodel" data-exam-id="' + user.id + '">确认</button>\
        </div>\
        </div>\
        </div>\
        </div>\
        \
        \
        <span class="glyphicon glyphicon-edit" title="修改信息" aria-hidden="true"  data-toggle="modal"></span> \
        \
        <div class="modal fade model-user-change" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">\
        <div class="modal-dialog" role="document">\
        <div class="modal-content">\
        <div class="modal-header">\
        <button type="button" class="close close-innermodel"  aria-label="Close"><span aria-hidden="true">&times;</span></button>\
        <h4 class="modal-title" id="myModalLabel">' + user.id + '基本资料</h4>\
        </div>\
        <form>\
        <div class="modal-body">\
        <div class="input-group">\
        <span class="input-group-addon" id="basic-addon1">密码：</span>\
        <input type="text" name="user_password" class="form-control" value="' + user.password + '" aria-describedby="basic-addon1">\
        </div>\
        <div class="input-group">\
        <span class="input-group-addon" id="basic-addon2">部门：</span>\
        <input type="text" name="user_department"  class="form-control" value="' + user.department + '" aria-describedby="basic-addon2">\
        </div>\
        <div class="input-group">\
        <span class="input-group-addon" id="basic-addon3">职位：</span>\
        <input type="text" name="user_role" class="form-control" value="' + user.role + '" aria-describedby="basic-addon3">\
        </div>\
        </div>\
        <div class="modal-footer">\
        <button type="button" class="btn btn-default close-innermodel">取消</button>\
        <button type="button" class="btn btn-primary submit-innermodel">保存</button>\
        </div>\
        <input type="hidden" name="user_id" value="' + user.id + '">\
        </form>\
        </div>\
        </div>\
        \
        </div>\
        \
        <span class="glyphicon glyphicon-remove" aria-hidden="true" title="删除用户" ></span>\
        <div class="modal fade model-user-remove" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">\
        <div class="modal-dialog" role="document">\
        <div class="modal-content">\
        <div class="modal-header">\
        <button type="button" class="close close-innermodel" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
        <h4 class="modal-title" id="myModalLabel">删除用户</h4>\
        </div>\
        <div class="modal-body">\
        确认删除' + user.id + '？\
        </div>\
        <div class="modal-footer">\
        <button type="button" class="btn btn-default close-innermodel" >取消</button>\
        <button type="button" class="btn btn-danger submit-innermodel" data-user-id="' + user.id + '">确认</button>\
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
        //console.log(admin.id)
        //获取所用用户数据
        $.get( server_url+'?login_id='+admin.id+'&login_password='+admin.password,
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

            //发布考试
            innerModelHander($(list_container + ' .glyphicon-exam-start'),$('.model-exam-start'),function(traget_model){
               //this指向提交按钮，会有data-id属性
               var exam_id = $(this).attr('data-exam-id');

               var post_data = {
                login_id: admin.id,
                login_password: admin.password,
              };
              var exam_start_model = $('.model-exam-start');
                //console.log($('.model-exam-start').find('.submit-innermodel').index(this))
                var index = exam_start_model.find('.submit-innermodel').index(this);
                //获取对应的glyphicon按钮
                var target_glyphicon = $(list_container + ' .glyphicon-exam-start').eq(index);
               // exam_start_model[index].innerHTML = exam_start_model[index].innerHTML.replace('发布','取消');
               // console.log(exam_start_model[index].innerHTML = )
               if(target_glyphicon.attr('data-is-start') === 'no'){
                post_data.start_exam_id = exam_id;
                setTimeout(function(){
                  target_glyphicon.removeClass('glyphicon-ban-circle').addClass('glyphicon-ok-sign').attr('title','取消考试');
                  //exam_start_model[index].innerHTML.replace('发布','取消');

                  var traget_text1 = exam_start_model.eq(index).find('h4');
                  traget_text1.html(traget_text1.html().replace('发布','取消'));

                  var traget_text2 = exam_start_model.eq(index).find('.modal-body');
                  traget_text2.html(traget_text2.html().replace('发布','取消'));
                  target_glyphicon.attr('data-is-start','yes');
                },500)

              } else {
                post_data.cancel_exam_id = exam_id;
                setTimeout(function(){
                  target_glyphicon.removeClass('glyphicon-ok-sign').addClass('glyphicon-ban-circle').attr('title','发布考试');
                  //exam_start_model[index].innerHTML.replace('取消','发布')
                  var traget_text1 = exam_start_model.eq(index).find('h4');
                  console.log(traget_text1)
                  traget_text1.html(traget_text1.html().replace('取消','发布'));

                  var traget_text2 = exam_start_model.eq(index).find('.modal-body');
                  traget_text2.html(traget_text2.html().replace('取消','发布'));
                  target_glyphicon.attr('data-is-start','no');
                },500)

              }
              $.post(server_url, post_data, function(data, status) {
               traget_model.fadeOut();
                   //  setTimeout(function(){
                   //    updateExamList(server_url,joinString, list_container)
                   //  }, 300)
                    //updateExamList()
                    console.log(data)
              })




                //$(this).removeClass('glyphicon-ok-sign').addClass('glyphicon-ban-circle');
              })

            // 修改用户
            innerModelHander($(list_container + ' .glyphicon-edit'),$('.model-user-change'),function(traget_model){
             var form = $(this).parents('form')[0];

             $.post(server_url, {
              login_id: admin.id,
              login_password: admin.password,
              user_id: form.user_id.value,
              user_password: form.user_password.value,
              user_department: form.user_department.value,
              user_role: form.user_role.value
            },
            function(data, status) {
              traget_model.fadeOut();
              setTimeout(function(){

                updateExamList(server_url,joinString, list_container);
              }, 500)
                    //updateExamList()
                  })
           })
            
            //删除用户
            innerModelHander($('.admin-users-list .glyphicon-remove'),$('.model-user-remove'),function(traget_model){
               //this指向提交按钮，会有data-id属性
               var user_id = $(this).attr('data-user-id');

               $.post(server_url, {
                login_id: admin.id,
                login_password: admin.password,
                delete_user_id: user_id
              },
              function(data, status) {
               traget_model.fadeOut();
               setTimeout(function(){
                updateExamList(server_url,joinString, list_container)
              }, 300)
                    //updateExamList()
                  })
             })

            
          })

}
    //updateExamList  end

    //用来更新列表，用户，考试，课件
    //get地址， 拼接字符串操作， 列表容器（字符串）
    $('.admin-menu-exam,.exam-list-nav-tab').click(function(){
      updateExamList('./about_exam',joinExamString, '.admin-exam-list');
    });



    var temp_exam = temp_exam = {
          id: '000',
          name: '',
          time: '',
          is_start: '',
          content: {
            'selects': [],
            'judges': [],
            'texts': []
          }
        };    

    //添加考试 
    function addASelect(){
      var a_select_str =   '<div class="panel panel-success single-select">\
                                  <div class="panel-heading form-horizontal single-select-top">\
                                    <input type="email" class="form-control" id="exampleInputEmail1" placeholder="题目">\
                                  </div>\
\
                                  <div class="panel-body ">\
                                    <div class="form-horizontal single-select-center">\
                                      <div class="input-group">\
                                        <span class="input-group-addon" id="basic-addon1">A</span>\
                                        <input type="text" class="form-control" placeholder="选型A" aria-describedby="basic-addon1">\
                                      </div>\
                                      <div class="input-group">\
                                        <span class="input-group-addon" id="basic-addon1">B</span>\
                                        <input type="text" class="form-control" placeholder="选型B" aria-describedby="basic-addon1">\
                                      </div>\
                                      <div class="input-group">\
                                        <span class="input-group-addon" id="basic-addon1">C</span>\
                                        <input type="text" class="form-control" placeholder="选型C" aria-describedby="basic-addon1">\
                                      </div>\
                                      <div class="input-group">\
                                        <span class="input-group-addon" id="basic-addon1">D</span>\
                                        <input type="text" class="form-control" placeholder="选型D" aria-describedby="basic-addon1">\
                                      </div>\
                                    </div>\
                                    <div class="form-inline single-select-bottom">\
                                      <div class="form-group">\
                                        <label for="new-exam-start" class="control-label">正确答案</label>\
                                        <input type="checkbox" id="inlineCheckbox1" value="option1"> A\
                                        \
                                        <input type="checkbox" id="inlineCheckbox2" value="option2"> B\
                                        <input type="checkbox" id="inlineCheckbox3" value="option3"> C\
                                        <input type="checkbox" id="inlineCheckbox3" value="option3"> D\
                                        \
                                      </div>\
\
                                      <div class="form-group">\
                                        <label for="exampleInputName2">分值</label>\
                                        <input type="text" class="form-control input-sm" id="exampleInputName2" value="2">\
\
                                      </div>\
\
                                      <div class="btn btn-danger pull-right delete-single-select">删除该题</div>\
\
                                    </div>\
                                  </div>\
                                </div>'

      $(this).parent().before(a_select_str);
    }

    //添加一个选择题
    $('.add-a-select').click(addASelect);

    // $('.delete-single-select').on('click',function(){
     
    // })

    $(document).on('click','.delete-single-select',function(){
       console.log(11)
      $(this).parents('.single-select').remove();
    })



})