function checkLogin(data, id, password) {
	if (Array.isArray(data)){
		var len = data.length;
		console.log('checkLogin正在验证--' + id);
		for(var i = 0; i < len; i++) {
			if(id === data[i].id && password === data[i].password){
				console.log('checkLogin验证通过--' + id);
				return true;
			}
		}
	} else {
		console.log('checkLogin传入数据错误，应为数组! data:' + data);
	}

	return false;
}

module.exports = checkLogin;