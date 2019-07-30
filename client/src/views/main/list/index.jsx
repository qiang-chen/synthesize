import React, { Component } from 'react'

import {connect} from "react-redux"

import {getList} from "@/api/index"

export default class List extends Component {
    render() {
        console.log(this.props.list);
        return (
            <div>
                {this.props.list.slice(1).map(item=>{
                    return <li key={item.id}>{item.name}</li>
                })}
                <button onClick={()=>{
                    this.props.getList(getList)
                }}>
                    异步存值
                </button>
            </div>
        )
    }
}

const mapStateToProps=(state)=>{
    return {
        list:state.reducerList
    }
}

const mapDispatchToProps=(dispatch)=>{
    return {
        getList:(fn)=>{
            dispatch(fn)
        }
    }
}

List=connect(mapStateToProps,mapDispatchToProps)(List)