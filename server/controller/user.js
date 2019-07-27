const connection = require("../db/index.js")

//引入Redis数据库  用来做过期处理

const client = require("../db/redis.js");

//解密用的插件包
const JSEncrypt = require('node-jsencrypt');

//生成随机验证码图片使用的插件包
const svgCaptcha = require('svg-captcha')

//引入token生成器

const {
    createToken
} = require("../util/createToken.js")

//加密解密需要的插件包
const jwt = require('jwt-simple')



//引入邮件处理发送函数
const {
    sendEmail
} = require("../util/resetPassword.js")
console.log(sendEmail);
//用户注册接口
module.exports.Registry = (req, res) => {
    //console.log(req.body)
    let {
        password,
        username,
        email
    } = req.body;

    //此时密码是加密后的密码 我们需要先根据这个用户名去数据库查询该用户
    //如果存在该用户 提示已经注册过了  不存在改用户 则让其注册

    const $sql = `select * from user where user="${username}"`
    connection.query($sql, (err, results) => {
        if (err) {
            //这样代表后台服务器错误 返回一个500的状态码吧
            res.statusCode = 500;
            res.send({
                code: 0,
                msg: "注册失败,请稍后重试"
            })
        } else {
            console.log(results);
            if (results.length) {
                //证明该用户已经被注册过了 提示注册失败
                res.send({
                    code: 0,
                    msg: "注册失败，该用户已被注册"
                })
            } else {
                //存入数据库
                //在存入数据库的同时为该用户注册一个token 用来做身份认证
                let token = createToken(username);
                const $save = `insert into user(user,password,token,email) values("${username}","${password}","${token}","${email}")`;
                connection.query($save, (err, result) => {
                    if (err) {
                        //这样代表后台服务器错误 返回一个500的状态码吧
                        res.statusCode = 500;
                        res.send({
                            code: 0,
                            msg: "注册失败,请稍后重试"
                        })
                    } else {
                        //注册成功，向用户返回token以及注册成功的信息
                        res.send({
                            code: 1,
                            msg: "注册成功",
                            token
                        })
                    }
                })
            }
        }
    })
}

//用户登录接口

module.exports.Login = (req, res) => {
    //console.log(req.body)
    //console.log(req.body.keyId)
    let {
        user,
        pwd,
        keyId,
        img
    } = req.body;
    //console.log(img,"什么")

    //接到登录请求后先检验这个图片验证码是不是存在或者不正确 
    client.get(keyId, (err, succ) => {
        if (err) {
            res.send({
                code: 0,
                msg: "验证码已过期"
            })
            return false;
        } else {
            //console.log(img.toUpperCase() === succ.toUpperCase())
            console.log(succ)
            if (succ) {
                if (img.toUpperCase() === succ.toUpperCase()) {
                    //根据用户名去数据库查询这个人是不是存在数据库
                    //如果存在的话 在对密码进行解密处理
                    const $sql = `select * from user where user="${user}"`;
                    connection.query($sql, (err, resaults) => {
                        if (err) {
                            res.statusCode = 500;
                            res.send({
                                code: 0,
                                msg: "登录失败，请稍后再试"
                            })
                        } else {
                            if (resaults.length) {
                                //console.log(resaults[0])
                                //取出这个密码来进行解密 然后与传过来的密码进行比较 看是否密码一样
                                var decrypt = new JSEncrypt();
                                //存放key
                                decrypt.setPrivateKey('MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCV5ztx/nuinMLNPGuxJaafJzPRBWD2MD2zIgNfJqa3RwDKlOGsunMWAIDptMahFOnl+NTN1DVn8/I3ovsEnTURhAF2nosRGSoI1PJI/V+6ugHW2WzGaLqW9gAV8leAAEmIC/v7mlkaKUO0e8kMB24BkPZIqODh61CibtuQCNXQYLAmdbpWQBSKWBX7HBeEwOmOTOA0DqB0pUmO4XifT1/BE7hjdufKls5gtvSSzTdAfViSEmCUS/o2sWmdTLWoUiTMrCCzSJ5nepdbnJiZL8jdktyaxDtG60KYmirBOB9eh1QZPEoKMiZ75N6pwmZ0dzzgSWEi6TfScIWphyV6Fp7zAgMBAAECggEAGk+WyIBhVP5s1rcnM9Wm9EJePu7RwQRgoAN1Ugsnsf2dbvFI1xd2wcLe3aZkQru3/ix5tZLsuM1Bk3Bg3MN3IBbqZtaXFC41iY1O5W7Lkau6TOqmxAB3161gAHojz4y9W0q3NMc3onbhslkTxa+8KDw4bjJuHlk+MvSARzy1wrghDB6QbdJIPzV19dGggez/ICf6UrCgdmQuJAbFdHnoEK83qFSbBz5aljwWnMWTWvMJ0vN4SJXjiLwNMrOyKPkaeMulYFL2avFNeHhj/vzJL5R1bYWyFJ3mFQpSBVGUDfZoeCp5hDbwU6ERe2pjagPgsD2S72IhAEwKrlXUlemDQQKBgQDHA3gKdE47IlNrsqEmPiJHHoXY3Ix+4GPWT513DqwAAgxc0Sd/iFqHrxwAP7ZgohU4Eln/fCd9CsrOLqT9e3EETOjfSxFQjxC/RmcKkg4fXZZCXryx81OpjdTRT4v2mbpA0Hm/Kb4s0tT03vHrPeMOffiKefK0NQnbZfFvpQzk0wKBgQDA08WGesbUJKidTV0AjYNZQjJgXpYoRwneERxQiu7Ofxsc0oKbsYv5rZtKp7LjVkTyXUj8yhzJObVKm3qtoj8qvRhVMUhyPAiJJjFh+gcybV39jyvuq0zCv9n0ytuCfTfvPZEe/bsGCzhv71wuHNhxrkQ3St37APgf6wrzo+WJYQKBgEFoF3TAItH2hxo3PBVYiGV9V5odaiNs1gMiaWsurELYaX2709JrWu2LFJXUWrlJq9Wg2mlIQaYr/NlkpR8WCd/S8xooDsm+K0/h8I2d0PxoArFPd464nP91uMMN9L8YaQlSOyEjs/gBVrIf77xTu6MQrbW9PJITeGjeCUqbITC3AoGAXPX7dTC9qEqgC23fl0Oh/iceuD0BcRuGU0u2ddH0/RJkFMob80luLQmYIy6j3Fub06hLZqtdo1kx4G0CgLEGeOk+0Nt4jLIKf2wtRInQbGwzculSCbcFw6HQRuaBWvBZRfpNez5hqrFAHR6tNwHrCyszceCjEb5O4LxkxD7QiyECgYEAhujdPXQQcn7CqpY61ivxy03LCz4lW3R8xSJMtm1BY+iBp6P2GbgdKpbSXiTSr/Y3//8DwccLf47xc7Otcw6Yz+tcen88UxqHrI1myHltFNYkrbQ692PtszO8n3fta5bCPr8RY2ON3+uGYSHIDGyixAdxRQxkQPwMD0CFntHA2EA=');
                                pwd = pwd.replace(/%2B/g, "+")
                                //此时就能把传过来的密码解密了
                                pwd = decrypt.decrypt(pwd);
                                //在把数据库的数据解密出来进行比对
                                resaults[0].password = resaults[0].password.replace(/%2B/g, "+")
                                let mysqlPwd = decrypt.decrypt(resaults[0].password)
                                //console.log(mysqlPwd,"密码是什么")
                                //比较下两个密码 看是否一样
                                if (pwd === mysqlPwd) {
                                    res.send({
                                        code: 1,
                                        token: resaults[0].token,
                                        msg: "登陆成功"
                                    })
                                } else {
                                    res.send({
                                        code: 0,
                                        msg: "密码输入错误"
                                    })
                                }
                            } else {
                                //该用户没有在数据库中
                                res.send({
                                    code: 0,
                                    msg: "该用户还会注册，请去注册页面进行注册"
                                })
                            }
                        }
                    })
                } else {
                    res.send({
                        code: 0,
                        msg: "验证码输入错误"
                    })
                }
            } else {
                res.send({
                    code: 0,
                    msg: "验证码已过期"
                })
            }

            console.log(succ, "===");
        }
    })
}

//图片验证码接口

module.exports.Verify = (req, res) => {
    var captcha = svgCaptcha.create({});
    //此时text生成的就是随机的四位数验证码 真正的验证码
    let text = captcha.text;
    //console.log(captcha);
    //在生成一个随机的key用来做这个验证码的标识
    let keyId = createToken();
    //console.log(keyId);
    //把这个生成的key和captcha.data这个生成的图片返回给前端
    let temp = {
        keyId: keyId,
        captcha: captcha.data,
    }
    //将其存到Redis这个数据库中 并且设置60s后从这个数据库删除

    client.set(keyId, text, 'EX', 60) //60秒后验证码过期知道

    //检查一下如果是不是存进去了
    client.get(keyId, function (err, v) {
        //console.log("图形验证码的值存入redis，值为：", v);
        if (err) {
            res.statusCode = 500;
            res.send({
                code: 0,
                msg: "请稍后重试"
            })
        } else {
            res.send({
                code: 1,
                data: temp,
                message: '验证码'
            });
        }
    })
}


//用户记住密码功能

module.exports.Remember = (req, res) => {
    let {
        token
    } = req.query;
    //根据这个token去数据库找到改用户的密码然后返回给前端让其默认加载页面上
    const $sql = `select * from user where token="${token}"`;
    connection.query($sql, (err, resaults) => {
        if (err) {
            return false;
        }
        let {
            user,
            password
        } = resaults[0];
        res.send({
            code: 1,
            info: {
                user,
                password
            }
        })
    })
}



//用户找回密码接口

module.exports.Retrieve = (req, res) => {
    //console.log(req.body);
    let {
        email
    } = req.body;
    console.log(email)
    //根据这个email去数据库里查到对应的用户去
    const $sql = `select * from user where email="${email}"`;
    console.log($sql);
    connection.query($sql, async (err, results) => {
        if (err) {
            res.statusCode = 500;
            res.send({
                code: 0,
                msg: "服务器繁忙，请稍后重试"
            })
            return
        }
        if (results.length) {
            //console.log(results[0])
            let {
                user
            } = results[0];
            let token=createToken(user);
            //console.log(token,"====")
            try {
                await sendEmail(user, email, `http://localhost:8080/#/reset/${token}`)
                //成功以后就告诉前端
                res.send({
                    msg: "请注意查收邮件",
                    code: 1
                })
            } catch (error) {
                
                res.send({
                    msg: "邮件发送失败，请重新提交",
                    code: 0
                })
            }
        } else {
            
            res.send({
                code: 0,
                msg: "该邮箱未被注册"
            })
        }
    })
}

//用户修改密码接口

module.exports.Modification=(req,res)=>{
    //console.log(req.body);
    let {token,pass}=req.body;
    //将token解密然后看看用户是谁 不解密也行
    let secret="xxx";//解密加密所对应的key
    let decode=jwt.decode(token, secret);
    //console.log(decode,"是什么");
    let {user}=decode
    //console.log(jwt.decode(token, secret),user)
    //根据用户名去数据库修改密码
    //注意 这个密码要加密再放入数据库
    //因先前用的设置key的方式存入的所以这里加密还要用设置key的方式加密
    const $updata=`UPDATE user SET password = '${pass}' WHERE user = '${user}'`
    connection.query($updata,(err,resault)=>{
        if(err){
            res.statusCode=500;
            res.send({
                code:0,
                msg:"服务器错误，请重试"
            })
            return;
        }
       // console.log(resault);
        if(resault.affectedRows){
            res.send({
                code:1,
                msg:`恭喜你${user}修改密码成功`
            })
        }else{
            res.send({
                code:0,
                msg:`网络跑路了，请重试`
            })
        }
       
    })
}