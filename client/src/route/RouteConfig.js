//路由表配置文件
import React,{Suspense} from "react"
const Main=React.lazy(()=>import("@/views/main/"));

const Home=React.lazy(()=>import("@/views/main/home/"))

const List=React.lazy(()=>import("@/views/main/list/"))

const RouteConfig=[
    {
        path:"/main",
        component:Main,
        children:[
            {
                path:"/main/home",
                component:Home,
            },{
                path:"/main/list",
                component:()=>{
                    //这样设置是给每一个组件分别设置懒加载  不过就不要给全局设置了 否则会出现两个懒加载内容的
                    return <Suspense fallback={<h1>load</h1>}>
                        <List></List>
                    </Suspense>
                }
            },{
                path:"/main",
                redirect:"/main/home"
            }
        ]
    },{
        path:"/",
        redirect:"/main"
    }
]

export default RouteConfig;
