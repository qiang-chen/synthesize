//网络请求文件

//引入登录请求接口
import {
  login,
  registry,
  retrieve,
  verify,
  remember,
  modification,
  upload,
  getUpload,
  searchload,
  banner,
  getBanner,
  bannerRemove
} from "./port/port"



//引入获取token的函数封装

import {
  getCookeies
} from "@/utils/cookie"

//引入我们封装好的axios拦截 然后让其统一管理每个接口的状态
//第一 判断是不是开发环境 然后决定要不要加api前缀
//第二 判断哪些接口需要加token令牌 然后统一在请求前的header字段加上token字段

import request from "@/utils/request"


//封装一个登录请求
export function Login(content) {
  console.log(content)
  return request.post(login, content)
}


//封装一个注册请求的函数

export function Registry(data) {
  return request.post(registry, data)
}

//封装一个找回密码的函数
export function Retrieve(data) {
  return request.post(retrieve, data)
}

//封装一个获取验证码的函数

export function Verify() {
  return request.get(verify)
}

//封装一个记住密码功能

export function Remember(token) {
  return request.get(remember, {
    params: {
      token
    }
  })
}

//封装一个修改密码的功能

export function Modification(data) {
  return request.post(modification, data)
}

//封装一个上传图片的功能

export function Upload(data) {
  return request({
    method: 'post',
    data: data,
    url: upload,
    timeout: 1000 * 60 * 60 * 8
  })
}


//封装一个获取上传图片的列表

export function getUploadList(page,limit){
  return request.get(getUpload,{
    params:{
      page,
      limit
    }
  })
}

//封装一个上传banner图的列表

export function Banner(name,remark){
  return request.get(banner,{
    params:{
      name,
      remark
    }
  })
}

//封装一个获取banner的列表的函数

export function getBannerList(){
  return request.get(getBanner)
}

//封装一个删除banner的函数

export function removeBanner(bannerPath){
  return request.get(bannerRemove,{
    params:{
      bannerPath
    }
  })
}

//模糊搜索功能

export function searchLoad(str){
  return request.get(searchload,{
    params:{
      str
    }
  })
}