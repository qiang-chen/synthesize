var express = require('express');
var router = express.Router();

const {Registry,Login,Retrieve,Verify,Remember,Modification}=require("../controller/user.js")


//后端管理上传文件页面相关接口

const {Upload,getUpload,uploadSearch}=require("../controller/upload.js")

//后端管理banner图相关页面

const {Banner,getBanner,bannerRemove}=require("../controller/banner.js")


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//引入注册接口

router.post("/user/registry",Registry)

//登录接口处理

router.post("/user/login",Login)

//图片验证码接口处理

router.get("/user/verify",Verify)

//记住密码功能

router.get("/user/remember",Remember)

//找回密码接口

router.post("/user/retrieve",Retrieve)

//修改密码接口

router.post("/user/modification",Modification)


const upload=require("../util/upload.js")
//上传文件接口

router.post("/upload",upload.single('file'),Upload)


//获取上传文件列表

router.get("/getUpload",getUpload)

//上传列表模糊搜索功能

router.get("/upload/search",uploadSearch)


//上传banner图接口

router.get("/banner",Banner)


//获取banner列表的接口

router.get("/getBanner",getBanner)


router.get("/bannerRemove",bannerRemove)

module.exports = router;
