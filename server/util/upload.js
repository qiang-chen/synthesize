//将通过input框上传的文件存到本地文件夹

const multer=require("multer");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // 接收到文件后输出的保存路径（若不存在则需要创建）
      //注意这里不要加/或者../
      cb(null, 'public/images/');
    },
    filename: function (req, file, cb) {
        
      // 将保存文件名设置为 时间戳 + 文件原始名，比如 151342376785-123.jpg
      cb(null, Date.now() + "-" + file.originalname);
    }
  });

  var upload = multer({storage:storage});

//抛出这个东西 挂在到接口的第二个参数

module.exports=upload;