var user = {};

function initUser (id,password){
  console.log(id)
  user.id = id;
  user.password = password;
}

$(function () {
  $('[data-toggle="popover"]').popover()
})
