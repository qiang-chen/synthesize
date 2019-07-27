import Vue from 'vue'
import Router from 'vue-router'

// import Main from "@/views/main/"
// import Login from "@/views/login/"

Vue.use(Router)

const router=new Router({
  routes: [
    {
      path:"*",
      component:()=>import("@/views/404/")
    },
    {
      path:'/main',
      name:"Main",
      component:()=>import("@/views/main/"),
      //component:Main
      children:[
        {
          path:"/main/uploading",
          component:()=>import("@/views/main/uploading/"),
          meta:{//用来判断哪个页面需要拦截的
            autorization: true
          },
        },{
          path:"/main/banner",
          component:()=>import("@/views/main/banner/")
        },{
          path:"/main",
          redirect:"/main/uploading"
        }
      ]
    }
    ,{
      path:"/login",
      name:"Login",
      autorization: false,
      component:()=>import("@/views/login/")
      //component:Login
    },{
         path: '/registry',  //注册路由
         name:"Registry",
        autorization: false,
        component: () => import('@/views/registry/')
    },{
      path:"/retrieve",
      name:'Retrieve',
      autorization:false,
      component:()=>import("@/views/retrieve/")
    },{
      path:"/reset/:id",
      name:"Reset",
      autorization:false,
      component:()=>import("@/views/reset/")
    },{
      path:"/",
      redirect:"/main"
    }
  ]
})

router.beforeEach((to, from, next) => {
    //console.log(to);
    const requireAuth=to.meta.autorization;
    //判断当前列表是不是需要登录态
    if(requireAuth){
      const token=$store.state.login.token;
      //如果需要登录态的在判断是不是有token
      //有的话让其登录 没有的话让其跳转到登录页重新登录
      
      if(token){
        next()
      }else{
        next("/login")
      }
      
    }else{
     next()
    }
})

export default router;
