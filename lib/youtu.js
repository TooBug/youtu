var Youtu = function(options){

	if(!options.appId || !options.secretId || !options.secretKey){
		throw new Error('appId,secretId,secretKey must be specified.');
	}

	this.appId = options.appId;
	this.secretId = options.secretId;
	this.secretKey = options.secretKey;
	this.userId = 0;	// 预留

};

var version = require('../package.json').version;

Youtu.prototype._server = 'http://api.youtu.qq.com/';
Youtu.prototype._ua = 'Youtu SDK/' + version + ' (npm module youtu) by TooBug';
Youtu.prototype._expire = 1800;

Youtu.prototype._getSign = function(){

	var crypto = require('crypto');
	var now = parseInt(Date.now() / 1000);
	var rdm = parseInt(Math.random() * Math.pow(2, 32));

	// the order of every key is not matter verify
	var plainText = 'a=' + this.appId +
		'&k=' + this.secretId +
		'&e=' + (now + this._expire) +
		'&t=' + now +
		'&r=' + rdm +
		'&u=' + this.userId;

	var data = new Buffer(plainText,'utf8');

	var res = crypto.createHmac('sha1',this.secretKey).update(data).digest();

	var bin = Buffer.concat([res,data]);

	var sign = bin.toString('base64');

	return sign;
};

Youtu.prototype._doRequest = function(type, apiItem, args){
	var _this = this;

	var baseUrl = _this._server;
	var urlMap = {
		faceAPI:'youtu/api/',
		imageAPI:'youtu/imageapi/',
		ocrAPI:'youtu/ocrapi/'
	};
	baseUrl += urlMap[type];

	var getImageData = function(pathOrBuffer){
		console.log(pathOrBuffer);
		var buffer = pathOrBuffer;

		if(typeof pathOrBuffer === 'string'){
			var fs = require('fs');
			buffer = fs.readFileSync(pathOrBuffer);
		}

		return buffer.toString('base64');

	};

	return new Promise(function(resolve,reject){
		var restler = require('restler');
		var url = baseUrl + apiItem.name.toLowerCase();
		var postData = {
			app_id:_this.appId
		};
		apiItem.params.forEach(function(param, index){
			if(typeof param === 'string'){
				var key = param;
				param = {
					key: key,
					type: 'default'
				};
			}
			if(param.type === 'image'){
				var imagePath = args[index];
				var imageData = getImageData(imagePath);
				postData[param.key] = imageData;
			}else if(param.type === 'imageArray'){
				var arr = args[index].map(function(imagePath){
					return getImageData(imagePath);
				});
				postData[param.key] = arr;
			}else{
				postData[param.key] = args[index];
			}
		});
		restler.post(url,{
			headers:{
				Authorization:_this._getSign(),
				'User-Agent':_this._ua,
				'Content-Type':'text/json'
			},
			data:JSON.stringify(postData)
		}).on('complete', function(data, response){
			if(data instanceof Error){
				reject(data);
			}else{
				resolve(data);
			}
		});
	});
};

var apiList = [{
	name:'detectFace',
	params:[{
		key:'image',
		type:'image'
	}]
},{
	name:'faceShape',
	params:[{
		key:'image',
		type:'image'
	}]
},{
	name:'faceCompare',
	params:[{
		key:'imageA',
		type:'image'
	},{
		key:'imageB',
		type:'image'
	}]
},{
	name:'faceVerify',
	params:[{
		key:'image',
		type:'image'
	},'person_id']
},{
	name:'FaceIdentify',
	params:[{
		key:'image',
		type:'image'
	},'group_id']
},{
	name:'newPerson',
	params:[{
		key:'image',
		type:'image'
	},'person_id','group_ids']
},{
	name:'delPerson',
	params:['person_id']
},{
	name:'addFace',
	params:[{
		key:'images',
		type:'imageArray'
	},'person_id']
},{
	name:'delFace',
	params:['person_id','face_ids']
},{
	name:'setInfo',
	params:['person_name','person_id']
},{
	name:'getInfo',
	params:['person_id']
},{
	name:'getGroupIds',
	params:[]
},{
	name:'getPersonIds',
	params:['group_id']
},{
	name:'getFaceIds',
	params:['person_id']
},{
	name:'getFaceInfo',
	params:['face_id']
},{
	name:'fuzzyDetect',
	type:'imageAPI',
	params:[{
		key:'image',
		type:'image'
	}]
},{
	name:'foodDetect',
	type:'imageAPI',
	params:[{
		key:'image',
		type:'image'
	}]
},{
	name:'imageTag',
	type:'imageAPI',
	params:[{
		key:'image',
		type:'image'
	}]
},{
	name:'imagePorn',
	type:'imageAPI',
	params:[{
		key:'image',
		type:'image'
	}]
},{
	name:'idCardOcr',
	type:'ocrAPI',
	params:[{
		key:'image',
		type:'image'
	},'card_type']
},{
	name:'nameCardOcr',
	type:'ocrAPI',
	params:[{
		key:'image',
		type:'image'
	}]
}];

apiList.forEach(function(apiItem){

	Youtu.prototype[apiItem.name] = function(apiItem){
		var type = apiItem.type || 'faceAPI';
		return function(){
			return this._doRequest(type,apiItem,arguments);
		};
	}(apiItem);

});

module.exports = Youtu;
