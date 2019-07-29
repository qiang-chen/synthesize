
import {createStore,applyMiddleware,combineReducers} from "redux";

import thunk from "redux-thunk";

import {createLogger} from "redux-logger";


//引入list模块的reducers

import reducerList from "./modules/reducerList";

//合并

const reducers=combineReducers({
    reducerList
})

const loggger=createLogger()

const store=createStore(reducers,applyMiddleware(thunk,loggger));

export default store;