//列表相关的reducers

const initState={
    list:[]
}

const reducerList=(state=initState.list,action)=>{
    let newState=JSON.parse(JSON.stringify(state))
    switch (action.type) {
        case "LIST":{
            newState=action.data;
            return [...newState];
        }
    
        default:
            return [...newState];
    }
}

export default reducerList;