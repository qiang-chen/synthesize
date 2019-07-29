import React, { Component } from 'react'


import RouteView from "@/route/RouteView"

export default class Main extends Component {
    render() {
        return (
            <div>
                <RouteView children={this.props.children}></RouteView>
                <button onClick={()=>{
                    this.props.history.push("/main/home")
                }}>跳转home</button>
                <button onClick={()=>{
                    this.props.history.push("/main/list")
                }}>跳转list</button>
            </div>
        )
    }
}
