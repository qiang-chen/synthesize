import React ,{Suspense} from 'react';
import './App.css';

import {BrowserRouter} from "react-router-dom"

import RouteView from "@/route/RouteView"
import RouteConfig from "@/route/RouteConfig"

import {Provider} from "react-redux"

import store from "@/store/index"

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>loading....</div>}>
          <Provider store={store}>
                 <RouteView children={RouteConfig}></RouteView>
          </Provider>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
