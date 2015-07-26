# 腾讯优图开放平台第三方SDK

## 特性

- 包含所有官方API接口
- Promise接口
- 支持使用相对路径或buffer指定图片

## 安装

```sh
npm install youtu
```

## Demo

```
var Youtu = require('youtu');
var youtu = new Youtu({
	appId:'1000xxxx',
	secretId:'xxxx',
	secretKey:'xxxx'
});

youtu.detectFace('./demo.jpg').then(function(data){
	// detectFace result
});
```

## API及参数

- detectFace
	- image
- faceCompare
	- imageA
	- imageB
- faceVerify
	- image
	- person_id
- FaceIdentify
	- image
	- group_id
- newPerson
	- image
	- person_id
	- group_ids
- delPerson
	- person_id
- addFace
	- images
	- person_id
- delFace
	- person_id
	- face_ids
- setInfo
	- person_name
	- person_id
- getInfo
	- person_id
- getGroupIds
- getPersonIds
	- group_id
- getFaceIds
	- person_id
- getFaceInfo
	- face_id

## 错误处理

HTTP层面错误会走到Promise错误处理流程，应用层面错误码暂未解析，需应用自行处理。

## Todo

- [ ] 完善文档
- [ ] 错误码解析
- [ ] 支持传入远程图片地址

## LICENSE

MIT
