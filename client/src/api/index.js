//获取轮播图的接口
import axios from "axios";

//引入轮播接口
import {getBanner} from "./port"

export function GetBanner(){
    return axios.get(getBanner)
}