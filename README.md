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

- 人脸识别API
	- 人脸检测 detectFace(image)
	- 五官定位 faceShape(image)
	- 人脸对比 faceCompare(imageA, imageB)
	- 人脸验证 faceVerify(image, person_id)
	- 人脸识别 FaceIdentify(image, group_id)
- 个体（Person）管理
	- 个体创建 newPerson(image, person_id, group_ids)
	- 删除个体 delPerson(person_id)
	- 增加人脸 addFace(images, person_id)
	- 删除人脸 delFace(person_id, face_ids)
	- 设置信息 setInfo(person_name, person_id)
	- 获取信息 getInfo(person_id)
- 信息查询
	- 获取组列表 getGroupIds()
	- 获取人列表 getPersonIds(group_id)
	- 获取人脸列表 getFaceIds(person_id)
	- 获取人脸信息 getFaceInfo(face_id)
- 图片识别
	- 模糊图片检测 fuzzyDetect(image)
	- 美食图片识别 foodDetect(image)
	- 图像标签识别 imageTag(image)
	- 色情图像检测 imagePorn(image)
- OCR识别
	- 身份证OCR识别 idCardOcr(image,card_type)
	- 名片OCR识别 nameCardOcr(image)

## 错误处理

HTTP层面错误会走到Promise错误处理流程，应用层面错误码暂未解析，需应用自行处理。

## Todo

- [ ] 完善文档
- [ ] 错误码解析
- [ ] 支持传入远程图片地址

## LICENSE

MIT
