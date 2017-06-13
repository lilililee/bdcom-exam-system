var fs = require('fs');
var file ="../data/db.json";


var myFunction = {};

myFunction.initId = function(num){
	if ( typeof num == 'number') {
		var str = '00000' + num;
		return str.slice(str.length - 5, str.length)
	} else {
		console.log('initId:num应为数字');
	}
	
}

myFunction.getExamById = function(id, db){
	var exam_list_content = db.exam.exam_list.exam_list_content;
	var len = exam_list_content.length;
	for (var i = 0; i < len; i++){
		if(exam_list_content[i].id == id) {
			return exam_list_content[i];
		}
	}

	console.log('getExamById:未匹配到考试id--' + id)
	
}



module.exports = myFunction;