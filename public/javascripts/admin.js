var admin = {};

function initAdmin (id,password){
  //console.log(id)
  admin.id = id;
  admin.password = password;
}

$(function() {


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
        确认删除用户（' + user.id + '）？\
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
          console.log(user.id)
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
        <span class="glyphicon glyphicon-remove" aria-hidden="true" title="删除考试" ></span>\
        <div class="modal fade model-exam-remove" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">\
        <div class="modal-dialog" role="document">\
        <div class="modal-content">\
        <div class="modal-header">\
        <button type="button" class="close close-innermodel" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
        <h4 class="modal-title" id="myModalLabel">删除用户</h4>\
        </div>\
        <div class="modal-body">\
        确认删除考试（' + user.id + '）？\
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
        //console.log(admin.id)
        //获取所用用户数据
        $.get( server_url+'?login_id='+admin.id+'&login_password='+admin.password,
          function(data, status) {
            var result = '';
            //console.log(data);
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
              //console.log(exam_id)
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

            // 修改考试    //未实现。。。。
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
            
            //删除考试
            innerModelHander($('.admin-exam-list .glyphicon-remove'),$('.model-exam-remove'),function(traget_model){
               //this指向提交按钮，会有data-id属性
               var exam_id = $(this).attr('data-exam-id');
               console.log(typeof exam_id)
               $.post(server_url, {
                login_id: admin.id,
                login_password: admin.password,
                delete_exam_id: exam_id
              },
              function(data, status) {
                console.log('success')
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



    var temp_exam = {
      id: '00000',
      name: '',
      time: '',
      is_start: '',

      count: {
        selects: {
          sum: 0,
          score: 0
        },
        judges: {
          sum: 0,
          score: 0
        },
        texts: {
          sum: 0,
          score: 0
        },
        all: {
          sum: 0,
          score: 0
        }
      },
      content: {
        'selects': [],
        'judges': [],
        'texts': []
      }
    }; 


    //添加考试 
    //1. 添加选择题
    function addASelect(){
      temp_exam.count.selects.sum ++;
      $('.selects-count-sum').html(temp_exam.count.selects.sum);
      temp_exam.count.selects.score = parseFloat((temp_exam.count.selects.score + 2).toFixed(1));
      $('.selects-count-score').html(temp_exam.count.selects.score);
      var a_select_str =   '<div class="panel panel-success single-select">\
      <div class="panel-heading form-horizontal single-select-top">\
      <div class="input-group">\
      <span class="input-group-addon" id="basic-addon1"><strong class="selects-order">'+temp_exam.count.selects.sum+'.</strong></span>\
      <input type="text" class="form-control single-select-title" placeholder="题目" aria-describedby="basic-addon1">\
      </div>\
      </div>\
      \
      <div class="panel-body ">\
      <div class="form-horizontal single-select-center">\
      <div class="input-group">\
      <span class="input-group-addon" id="basic-addon1">A</span>\
      <input type="text" class="form-control single-select-option" data-value="a" placeholder="选项A" aria-describedby="basic-addon1">\
      </div>\
      <div class="input-group">\
      <span class="input-group-addon" id="basic-addon1">B</span>\
      <input type="text" class="form-control single-select-option" data-value="b" placeholder="选项B" aria-describedby="basic-addon1">\
      </div>\
      <div class="input-group">\
      <span class="input-group-addon" id="basic-addon1">C</span>\
      <input type="text" class="form-control single-select-option" data-value="c" placeholder="选项C" aria-describedby="basic-addon1">\
      </div>\
      <div class="input-group">\
      <span class="input-group-addon" id="basic-addon1">D</span>\
      <input type="text" class="form-control single-select-option" data-value="d" placeholder="选项D" aria-describedby="basic-addon1">\
      </div>\
      </div>\
      <div class="form-inline single-select-bottom">\
      <div class="form-group">\
      <label class="control-label">正确答案</label>\
      <input type="checkbox" class="single-select-answer" value="a"> A\
      \
      <input type="checkbox" class="single-select-answer" value="b"> B\
      <input type="checkbox" class="single-select-answer" value="c"> C\
      <input type="checkbox" class="single-select-answer" value="d"> D\
      \
      </div>\
      \
      <div class="form-group">\
      <label for="exampleInputName2">分值</label>\
      <input type="number" class="form-control input-sm single-select-value" id="exampleInputName2" value="2">\
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

    //删除一个选择题
    $(document).on('click','.delete-single-select',function(){

      $(this).parents('.single-select').remove();
      //更新选择题个数统计
      temp_exam.count.selects.sum--;
      $('.selects-count-sum').html(temp_exam.count.selects.sum);
      //更新题号
      $('.selects-order').each(function(index){
        this.innerHTML = index + 1 + '.';
      })

      //更新选择题总分统计
      var score = 0;
      $('.single-select-value').each(function(){
        console.log(this.value)
        score += parseFloat(this.value);
      })
      temp_exam.count.selects.score = parseFloat(score.toFixed(1));   //toFixed返回一个字符
      $('.selects-count-score').html(temp_exam.count.selects.score);
    })

    //改变单个题目分数时触发总分计算
    $(document).on('change','.single-select-value',function(){
      var score = 0;

      if(!/^[1-9]\d*(\.\d+)?$/.test(this.value)){


        alert('请输入一个正确的分值！');
        this.focus();
        this.value = '2';
      }

      // console.log(this.value)
      // if(this.value == ''){
      //   this.value == '2';
      // }
      $('.single-select-value').each(function(){

        score += parseFloat(this.value);
      })
     // console.log(parseFloat(score.toFixed(1)))
      temp_exam.count.selects.score = parseFloat(score.toFixed(1));   //toFixed返回一个字符

      $('.selects-count-score').html(temp_exam.count.selects.score);
    })


    //2. 添加判断题
    function addAJudge(){
      temp_exam.count.judges.sum ++;
      $('.judges-count-sum').html(temp_exam.count.judges.sum);
      temp_exam.count.judges.score = parseFloat((temp_exam.count.judges.score + 2).toFixed(1));
      $('.judges-count-score').html(temp_exam.count.judges.score);
      var single_judge_answer_name = new Date().getTime();    //使用毫秒数保证多个单选组之间的name互不干扰
      var a_judge_str =   '<div class="panel panel-success single-judge">\
      <div class="panel-heading form-horizontal single-judge-top">\
      <div class="input-group">\
      <span class="input-group-addon" id="basic-addon1"><strong class="judges-order">'+temp_exam.count.judges.sum+'.</strong></span>\
      <input type="text" class="form-control single-judge-title" placeholder="题目" aria-describedby="basic-addon1">\
      </div>\
      </div>\
      \
      <div class="panel-body ">\
      \
      <div class="form-inline single-judge-bottom">\
      <div class="form-group">\
      <label class="control-label">正确答案</label>\
      <input type="radio" class="single-judge-answer" name="'+single_judge_answer_name +'" value="true" checked="checked"> 对\
      \
      <input type="radio" class="single-judge-answer" name="'+single_judge_answer_name +'" value="false"> 错\
      \
      \
      </div>\
      \
      <div class="form-group">\
      <label for="exampleInputName2">分值</label>\
      <input type="number" class="form-control input-sm single-judge-value" id="exampleInputName2" value="2">\
      \
      </div>\
      \
      <div class="btn btn-danger pull-right delete-single-judge">删除该题</div>\
      \
      </div>\
      </div>\
      </div>'

      $(this).parent().before(a_judge_str);
    }

    //添加一个判断题
    $('.add-a-judge').click(addAJudge);

    //删除一个判断题
    $(document).on('click','.delete-single-judge',function(){

      $(this).parents('.single-judge').remove();
      //更新判断题个数统计
      temp_exam.count.judges.sum--;
      $('.judges-count-sum').html(temp_exam.count.judges.sum);
      //更新题号
      $('.judges-order').each(function(index){
        this.innerHTML = index + 1 + '.';
      })

      //更新判断题总分统计
      var score = 0;
      $('.single-judge-value').each(function(){
        console.log(this.value)
        score += parseFloat(this.value);
      })
      temp_exam.count.judges.score = parseFloat(score.toFixed(1));   //toFixed返回一个字符
      $('.judges-count-score').html(temp_exam.count.judges.score);
    })

    //改变单个题目分数时触发总分计算
    $(document).on('change','.single-judge-value',function(){
      var score = 0;

      if(!/^[1-9]\d*(\.\d+)?$/.test(this.value)){


        alert('请输入一个正确的分值！');
        this.focus();
        this.value = '2';
      }

      // console.log(this.value)
      // if(this.value == ''){
      //   this.value == '2';
      // }
      $('.single-judge-value').each(function(){

        score += parseFloat(this.value);
      })
     // console.log(parseFloat(score.toFixed(1)))
      temp_exam.count.judges.score = parseFloat(score.toFixed(1));   //toFixed返回一个字符

      $('.judges-count-score').html(temp_exam.count.judges.score);
    })


    //2. 添加简答题
    function addAtext(){
      temp_exam.count.texts.sum ++;
      $('.texts-count-sum').html(temp_exam.count.texts.sum);
      temp_exam.count.texts.score = parseFloat((temp_exam.count.texts.score + 10).toFixed(1));
      $('.texts-count-score').html(temp_exam.count.texts.score);
      var a_text_str =   '<div class="panel panel-success single-text">\
      <div class="panel-heading form-horizontal single-text-top">\
      <div class="input-group">\
      <span class="input-group-addon" id="basic-addon1"><strong class="texts-order">'+temp_exam.count.texts.sum+'.</strong></span>\
      \
      <textarea class="form-control single-text-title" placeholder="题目" aria-describedby="basic-addon1" rows="4" style="resize:none;"></textarea>\
      \
      </div>\
      </div>\
      \
      <div class="panel-body ">\
      \
      <div class="form-inline single-text-bottom">\
      <div class="form-group">\
      <label class="control-label">上传图片</label>\
      <input type="file" class="single-text-img">\
      \
      \
      </div>\
      \
      <div class="form-group">\
      <label for="exampleInputName2">分值</label>\
      <input type="number" class="form-control input-sm single-text-value" id="exampleInputName2" value="10">\
      \
      </div>\
      \
      <div class="btn btn-danger pull-right delete-single-text">删除该题</div>\
      \
      </div>\
      </div>\
      </div>'

      $(this).parent().before(a_text_str);
    }

    //添加一个简答题
    $('.add-a-text').click(addAtext);

    //删除一个简答题
    $(document).on('click','.delete-single-text',function(){

      $(this).parents('.single-text').remove();
      //更新简答题个数统计
      temp_exam.count.texts.sum--;
      $('.texts-count-sum').html(temp_exam.count.texts.sum);
      //更新题号
      $('.texts-order').each(function(index){
        this.innerHTML = index + 1 + '.';
      })

      //更新简答题总分统计
      var score = 0;
      $('.single-text-value').each(function(){
        console.log(this.value)
        score += parseFloat(this.value);
      })
      temp_exam.count.texts.score = parseFloat(score.toFixed(1));   //toFixed返回一个字符
      $('.texts-count-score').html(temp_exam.count.texts.score);
    })

    //改变单个题目分数时触发总分计算
    $(document).on('change','.single-text-value',function(){
      var score = 0;

      if(!/^[1-9]\d*(\.\d+)?$/.test(this.value)){


        alert('请输入一个正确的分值！');
        this.focus();
        this.value = '10';
      }

      // console.log(this.value)
      // if(this.value == ''){
      //   this.value == '2';
      // }
      $('.single-text-value').each(function(){

        score += parseFloat(this.value);
      })
     // console.log(parseFloat(score.toFixed(1)))
      temp_exam.count.texts.score = parseFloat(score.toFixed(1));   //toFixed返回一个字符

      $('.texts-count-score').html(temp_exam.count.texts.score);
    })



    //开始提交一场考试
    function submitAExam(){
      var info = $('.add-exam-submit-info');
        $('.add-exam-submit-info').html('');   //初始化提示信息
        // 1. 获取考试基本信息
        var name = $('#new-exam-name').val();   //考试名称
        if ( /^\s*$/.test(name) ) {
          errorInfo(info, '请填写考试名称！'); return;
        } else {
          temp_exam.name = name; 
        };

        var time = $('#new-exam-time').val();   //考试时长
        if ( /^\s*$/.test(time) ) {
          errorInfo(info, '请填写考试时长！'); return;
        } else {
          temp_exam.time = time; 
        }

        var start = $('input[name="new-exam-start"]').filter(function(){return this.checked===true}).val(); //考试发布 
        temp_exam.is_start = start;

        // 2. 获取选择题
        var all_selects = $('.admin_exam_add').find('.single-select');
        var selects = [];
        var selects_is_error = false;
        all_selects.each(function(index){
          if(selects_is_error) return false;   //如果产生错误，不继续遍历选择题
          var single_select = {};
          single_select.sid = index + 1 + '';
          // 2.1 获取问题
          var question = $(this).find('.single-select-title').val();
          if ( /^\s*$/.test(question) ) {
            errorInfo(info, '请填写选择题<strong>'+ (index+1) + '</strong>的题目！'); selects_is_error = true; return false;   //可跳出each循环，如果不加false则不行
          } else {
            single_select.question = question; 
          }
          if(selects_is_error) return false;   //如果产生错误，不继续遍历选择题

          //2.2 获取选项
          var all_options = $(this).find('.single-select-option');  //获取当前选择题的所有选项
          var options = [];
          all_options.each(function (){
            var text = this.value;
            if ( /^\s*$/.test(text) ) {
              errorInfo(info, '请完善选择题<strong>'+ (index+1) + '</strong>的选项内容！'); selects_is_error = true; return false;
            } else {
              options.push(text);
            }
          })
          if(selects_is_error) return false;   //如果产生错误，不继续遍历选择题

          single_select.options = options;

          // 2.3 获取答案
          var all_answer = $(this).find('.single-select-answer');  //获取当前选择题的答案
          var answer = '';
          all_answer.each(function (){
           //if(this.checked === true)  answer.push(this.value);
           if(this.checked === true)  answer += this.value;
         })
          if(answer === '') {
            errorInfo(info, '请为选择题<strong>'+ (index+1) + '</strong>选择至少一个正确答案！'); selects_is_error = true; return false;
          } else {
            single_select.answer = answer;
          }
          // 2.4 获取分值
          var value = $(this).find('.single-select-value').val();  //对于该字段的判断前面已经处理     
          single_select.value = value; 

          //console.log(single_select)
          selects.push(single_select);      //将当前选择题保存到选择数组中

        })
        if(selects_is_error) return false;   //如果产生错误，不继续后续操作
        temp_exam.content.selects = selects;   //保存到考试对象中

        // 3. 获取判断题
        var all_judges = $('.admin_exam_add').find('.single-judge');
        var judges = [];
        var judges_is_error = false;
        all_judges.each(function(index){
          if(judges_is_error) return false;   //如果产生错误，不继续遍历选择题
          var single_judge = {};
          single_judge.sid = index + 1 + '';
          // 3.1 获取问题
          var question = $(this).find('.single-judge-title').val();
          if ( /^\s*$/.test(question) ) {
            errorInfo(info, '请填写判断题<strong>'+ (index+1) + '</strong>的题目！'); judges_is_error = true; return false;   //可跳出each循环，如果不加false则不行
          } else {
            single_judge.question = question; 
          }
          if(judges_is_error) return false;   //如果产生错误，不继续遍历选择题

          // 3.2 获取答案
          var all_answer = $(this).find('.single-judge-answer');  //获取当前选择题的答案
          //var answer = '';
          all_answer.each(function (){
           if(this.checked === true) {
            single_judge.answer = this.value;
            return false;
           }  
         })
          
          // 3.3 获取分值
          var value = $(this).find('.single-judge-value').val();  //对于该字段的判断前面已经处理     
          single_judge.value = value; 

          //console.log(single_judge)
          judges.push(single_judge);

        })
        if(judges_is_error) return false;   //如果产生错误，不继续后续操作
        temp_exam.content.judges = judges;   //保存到考试对象中

        //console.log(temp_exam);

        // 3. 获取简答题
        var all_texts = $('.admin_exam_add').find('.single-text');
        var texts = [];
        var texts_is_error = false;
        all_texts.each(function(index){
          if(texts_is_error) return false;   //如果产生错误，不继续遍历选择题
          var single_text = {};
          single_text.sid = index + 1 + '';
          // 3.1 获取问题
          var question = $(this).find('.single-text-title').val();
          if ( /^\s*$/.test(question) ) {
            errorInfo(info, '请填写简答题<strong>'+ (index+1) + '</strong>的题目！'); texts_is_error = true; return false;   //可跳出each循环，如果不加false则不行
          } else {
            single_text.question = question; 
          }
          if(texts_is_error) return false;   //如果产生错误，不继续遍历选择题

          // 3.2 获取图片
          var img = $(this).find('.single-text-img')[0].files[0];  //获取当前选择题的图片文件
          if(typeof img == 'undefined') img = 'undefined';   //当未选择图片时，img保存为字符串的undefined
          single_text.img = img;

          
          // 3.3 获取分值
          var value = $(this).find('.single-text-value').val();  //对于该字段的判断前面已经处理     
          single_text.value = value; 

          //console.log(single_text)
          texts.push(single_text);

        })
        if(texts_is_error) return false;   //如果产生错误，不继续后续操作
        temp_exam.content.texts = texts;   //保存到考试对象中
        console.log(temp_exam);
        console.log(typeof JSON.stringify(temp_exam,null,4));

        //计算总共题目个数和分数
        temp_exam.count.all.sum = temp_exam.count.selects.sum + temp_exam.count.judges.sum +temp_exam.count.texts.sum;
        temp_exam.count.all.score = temp_exam.count.selects.score + temp_exam.count.judges.score +temp_exam.count.texts.score;

        //开始转换为formdata数据发送给后端
        var formdata = new FormData();
        formdata.append('new_exam', JSON.stringify(temp_exam))
        for (var i = 0; i < temp_exam.content.texts.length; i++ ){
          console.log(temp_exam.content.texts.img)
          formdata.append('texts_img'+ (i+1), temp_exam.content.texts[i].img);
        }
        //console.log(formdata)
        $.ajax({
          url: './about_exam/upload',
          type: 'POST',
          data: formdata,
          processData: false,    //必须
          contentType: false,         //https://segmentfault.com/a/1190000007207128!!!!!!!
          success: function(data){
            console.log(data)
            if(data.status == 'success'){
              errorInfo(info, data.info); return;
            }
          }
        })
      }




      function errorInfo(traget, info){
        traget.html('<div class="alert alert-warning" role="alert">'+ info +'</div>');
      }

      $('.add-exam-reset').click(function(){
        $('.single-select').remove();
        $('.single-judge').remove();
        $('.single-text').remove();
      })

      $('.add-exam-submit').click(function(){
        submitAExam();
        return false;
      })




    // 课件相关操作
    //根据get请求获取的数据来渲染列表
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
          <span class="glyphicon glyphicon-edit glyphicon-course-rename" title="修改信息" aria-hidden="true"  data-toggle="modal"></span> \
          \
          <div class="modal fade model-user-change" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">\
          <div class="modal-dialog" role="document">\
          <div class="modal-content">\
          <div class="modal-header">\
          <button type="button" class="close close-innermodel"  aria-label="Close"><span aria-hidden="true">&times;</span></button>\
          <h4 class="modal-title" id="myModalLabel">正在修改课件--' + user.name + '</h4>\
          </div>\
          <form>\
          <div class="modal-body">\
          <div class="input-group">\
          <span class="input-group-addon" id="basic-addon1">新课件名：</span>\
          <input type="text" name="course_new_name" class="form-control" value="' + user.name + '" aria-describedby="basic-addon1">\
          </div>\
          \
          </div>\
          <div class="modal-footer">\
          <button type="button" class="btn btn-default close-innermodel">取消</button>\
          <button type="button" class="btn btn-primary submit-innermodel">保存</button>\
          </div>\
          <input type="hidden" name="course_id" value="' + user.id + '">\
          </form>\
          </div>\
          </div>\
          \
          </div>\
          \
          <span class="glyphicon glyphicon-remove" aria-hidden="true" title="删除课件" ></span>\
          <div class="modal fade model-course-remove" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">\
          <div class="modal-dialog" role="document">\
          <div class="modal-content">\
          <div class="modal-header">\
          <button type="button" class="close close-innermodel" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
          <h4 class="modal-title" id="myModalLabel">删除课件</h4>\
          </div>\
          <div class="modal-body">\
          确认删除课件（' + user.name + '）？\
          </div>\
          <div class="modal-footer">\
          <button type="button" class="btn btn-default close-innermodel" >取消</button>\
          <button type="button" class="btn btn-danger submit-innermodel" data-course-id="' + user.id + '">确认</button>\
          </div>\
          </div>\
          </div>\
          </div></td>'
        })
      return result;
    }

    //用来更新列表，用户，课件，课件
    //get地址， 拼接字符串操作， 列表容器（字符串）
    function updateCourseList(server_url, joinString, list_container, type) {
      var data = [];
        //console.log(admin.id)
        //获取所用用户数据
        console.log(server_url)
        $.get( server_url+'?login_id='+admin.id+'&login_password='+admin.password,
          function(data, status) {
            var result = '';
            //console.log(data);
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
    //updateCourseList  end

    //用来更新列表，用户，课件，课件
    //get地址， 拼接字符串操作， 列表容器（字符串）
    $('.admin-menu-course,.course-list-nav-tab').click(function(){
      console.log(22)
      updateCourseList('./about_course',joinCourseString, '.admin-course-list');
    });


    $('.add-course-submit').click(function(){
      var info = $('.add-course-submit-info');
      var form = $('.add_course_form')[0];
      console.log(form['new-course-file'])
      console.log(typeof form['new-course-file'].value)
      if( form['new-course-file'].files.length === 0 ) {
        errorInfo(info,'请选择一个文件！');
      }else {
        //开始转换为formdata数据发送给后端
        var formdata = new FormData();
        formdata.append('course_id', '10000')
        // formdata.append('course_name', form['new-course-name'].value)
        formdata.append('course_type', form['new-course-type'].value)
        formdata.append('course_file', form['new-course-file'].files[0])

        $.ajax({
          url: './about_course/upload',
          type: 'POST',
          data: formdata,
          processData: false,    //必须
          contentType: false,         //https://segmentfault.com/a/1190000007207128!!!!!!!
          success: function(data){


            errorInfo(info, data.info); return;
            
          }
        })
      }
      return false;
    })


    


    


  })