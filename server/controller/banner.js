//后台管理用户上传文件相关接口

const connection=require("../db/index.js")
module.exports.Banner=(req,res)=>{
    console.log(req.query)
    let {name,remark}=req.query;
    //将前端传来的信息存到数据库

    const $save=`insert into banner(bannerPath,remark) values("${name}","${remark}");`
    connection.query($save,(err,resaultss)=>{
        if(err){
            res.send({
                code:0,
                msg:"存入失败"
            })
        }else{
            res.send({
                code:1,
                msg:"存入成功"
            })
        }
    })
   
}

//获取banner列表的接口

module.exports.getBanner=(req,res)=>{
    const $sql=`select * from banner order by id DESC`;
    connection.query($sql,(err,resaults)=>{
        if(err){
            res.send({
                code:0,
                msg:"获取失败"
            })
        }else{
            res.send({
                code:1,
                msg:resaults
            })
        }
    })
}

//删除banner接口

module.exports.bannerRemove=(req,res)=>{
    let {bannerPath}=req.query;
    console.log(bannerPath)
    const $remove=`delete from banner where bannerPath='${bannerPath}'`;
    connection.query($remove,(err,resaults)=>{
        if(err){
            res.send({
                code:0,
                msg:"删除失败，请重试"
            })
        }else{
            res.send({
                code:1,
                msg:"删除成功"
            })
        }
    })
}