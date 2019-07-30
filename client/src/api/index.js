//获取轮播图的接口
import axios from "axios";

//引入轮播接口
import {getBanner,list} from "./port"


export function GetBanner(){
    return axios.get(getBanner)
}

export async function  getList(next){
    let data=await axios.get(list);
    next({type:"LIST",data:data.data.list})
}
