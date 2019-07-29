import React ,{Suspense} from 'react';
import './App.css';

import {BrowserRouter} from "react-router-dom"

import RouteView from "@/route/RouteView"
import RouteConfig from "@/route/RouteConfig"

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>loading....</div>}>
          <RouteView children={RouteConfig}></RouteView>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
