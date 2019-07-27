//后台管理用户上传文件相关接口

const connection=require("../db/index.js")

//文件上传接口

module.exports.Upload = (req, res) => {
    //console.log('1', req.file)
    //将此图片的路径 名字 存进数据库 还有当前时间
    if (req.file) {
        let {originalname,filename} = req.file;
        let times=new Date().getTime();
        console.log(req.file,times);
        //console.log(path,"这是什么鬼")
        const $sql=`insert into resource(imgPath,imgName,createTime) values ('http://localhost:8888/images/${filename}','${originalname}','${times}');`
        connection.query($sql,(err,resaults)=>{
            //console.log(err)
            if(err){
                res.statusCode = 500;
                res.send({
                    code:0,
                    msg:"服务器错误，请重新上传"
                })
            }else{
                res.send({
                    code: 1,
                    msg:"图片上传成功"
                })
            }
        })
    }else{
        res.send({
            code:0,
            msg:"图片上传失败，请重来"
        })
    }

}

module.exports.getUpload=(req,res)=>{
    console.log(req.query)
    //获取数据库所有数据的长度
    let total=0;
    connection.query('select count(*) as total from resource', (t_error, t_result) => {
        total=t_result[0].total
    })
    let {page,limit}=req.query;
    //向数据库查询需要的数据
    const $filtrate = limit == undefined ?
    //查询并展示降序  按  createTime这个字段进行降序
    `select * from resource order by createTime DESC` :
    `select * from resource order by createTime DESC limit ${page-1},${limit}`;
    connection.query($filtrate,(err,resaults)=>{
        if(err){
            res.send({
                code:0,
                msg:"暂无数据"
            })
        }else{
            res.send({
                code:1,
                msg:resaults,
                total
            })
        }
    }) 
}

//模糊搜索功能

module.exports.uploadSearch=(req,res)=>{
    console.log(req.query);
    let {str}=req.query;
    const $search=`SELECT * FROM resource WHERE imgName like '%${str}%';`;
    connection.query($search,(err,resaults)=>{
        if(err){
            res.statusCode=500;
            res.send({
                code:0,
                msg:"服务器错误"
            })
        }else{
            res.send({
                code:1,
                msg:resaults
            })
        }
    })
}