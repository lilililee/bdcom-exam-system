var admin = {};

function initAdmin (id,password){
  admin.id = id;
  admin.password = password;
}
$(function() {
   

    function updateUsersList() {
        $.get('./about_users?login_id='+admin.id+'&login_password='+admin.password,
        function(data, status) {
            var result = '';
            console.log(data);
            if (Array.isArray(data)) {
                data.forEach(function(user, index) {
                    result += '<tr><th scope="row">' + (index + 1) + '</th><td>' + user.id + '</td><td>' + user.department + '</td><td>' + user.role + '</td><td> <span class="glyphicon glyphicon-edit" title="修改信息" aria-hidden="true"  data-toggle="modal"></span> \
                        \
                        <div class="modal fade model-user-change" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">\
  <div class="modal-dialog" role="document">\
    <div class="modal-content">\
      <div class="modal-header">\
        <button type="button" class="close close-myModal-users-change"  aria-label="Close"><span aria-hidden="true">&times;</span></button>\
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
        <button type="button" class="btn btn-default close-myModal-users-change">取消</button>\
        <button type="button" class="btn btn-primary submit-myModal-users-change">保存</button>\
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
        <button type="button" class="close close-myModal-users-remove" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
        <h4 class="modal-title" id="myModalLabel">删除用户</h4>\
      </div>\
      <div class="modal-body">\
        确认删除' + user.id + '？\
      </div>\
      <div class="modal-footer">\
        <button type="button" class="btn btn-default close-myModal-users-remove" >取消</button>\
        <button type="button" class="btn btn-danger delete-myModal-users-remove" data-user-id="' + user.id + '">确认</button>\
      </div>\
    </div>\
  </div>\
</div></td>'
                })

            } else {
                console.log('返回数据错误，应为数组！')

            }

            //循环结束，开始插入html
            $('.admin-users-list tbody').html('').append(result);

            //打开修改用户信息界面
            var uesrs_glyphicon_edit = $('.admin-users-list .glyphicon-edit'); //所有修改按钮
            var model_user_change = $('.model-user-change'); //所有单个用户信息
            uesrs_glyphicon_edit.click(function() {
                console.log(uesrs_glyphicon_edit.index(this))

                model_user_change.eq(uesrs_glyphicon_edit.index(this)).animate({
                    'opacity': '1'
                }).css('opacity', '0').css('display', 'block');
            })
            //关闭修改用户信息界面
            $('.close-myModal-users-change').click(function() {

                model_user_change.fadeOut();
            })

            //提交修改用户信息
            $('.submit-myModal-users-change').click(function() {
                //获取当前按钮所在的form
                var form = $(this).parents('form')[0];

                $.post('./about_users', {
                    login_id: admin.id,
                    login_password: admin.password,
                    user_id: form.user_id.value,
                    user_password: form.user_password.value,
                    user_department: form.user_department.value,
                    user_role: form.user_role.value
                },
                function(data, status) {
                    model_user_change.fadeOut();
                    setTimeout(updateUsersList, 500)
                    //updateUsersList()
                })
            })

            //显示删除用户确认提示信息
            var uesrs_glyphicon_remove = $('.admin-users-list .glyphicon-remove'); //所有修改按钮
            var model_user_remove = $('.model-user-remove'); //所有确认删除用户信息提示框
            uesrs_glyphicon_remove.click(function() {
                console.log(uesrs_glyphicon_remove.index(this))

                model_user_remove.eq(uesrs_glyphicon_remove.index(this)).animate({
                    'opacity': '1'
                }).css('opacity', '0').css('display', 'block');
            })
            //关闭修改用户信息界面
            $('.close-myModal-users-remove').click(function() {

                model_user_remove.fadeOut();
            })
            //提交删除用户操作
            $('.delete-myModal-users-remove').click(function() {
                //获取当前按钮所在的form
                var user_id = $(this).attr('data-user-id');

                $.post('./about_users', {
                    login_id: admin.id,
                    login_password: admin.password,
                    delete_user_id: user_id
                },
                function(data, status) {
                   model_user_remove.fadeOut();
                    setTimeout(updateUsersList, 500)
                    //updateUsersList()
                })
            })

        })

    }

    $('.admin-menu-users,.user-list-nav-tab').click(updateUsersList)

    $('[data-toggle="popover"]').popover()

    //检测用户信息是否填写完整
    function checkUserInfo() {
        $('.add-user-submit').click(function(e) {
            e.preventDefault();
            var form = $(this).parents('form');
            var items = form.find('input,textarea');
            var submit_result = form.find('.submit-result');
            for (var i = 0; i < items.length; i++) {
                if (items[i].value === '') {

                    submit_result.html('<div class="alert alert-warning" role="alert">请填写完整信息！</div>') ;
                    return;
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

    checkUserInfo()

})