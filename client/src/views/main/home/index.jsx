import React, { Component } from 'react'

import Swiper from "swiper"

import "swiper/dist/css/swiper.min.css"

//引入网络请求
import {GetBanner} from "@/api/index"

export default class Home extends Component {
    constructor(props){
        super(props);
        this.state={
            list:[]
        }
    }
    render() {
        return (
            <div className="swiper-container">
                <div className="swiper-wrapper">
                    {this.state.list.map(item=>{
                        return <div style={{width:"50%",height:"400px"}} className="swiper-slide" key={item.id}>
                            <img src={item.bannerPath} alt=""/>
                        </div>
                    })}
                    
                </div>
                home
            </div>
        )
    }
    async componentDidMount(){
        let data=await GetBanner();
        console.log(data);
        this.setState({
            list:data.data.msg
        })
    }
    componentDidUpdate(){
        new Swiper(".swiper-container",{
            autoplay:true
        })
    }
}

Object.assign(Home.prototype,{

})