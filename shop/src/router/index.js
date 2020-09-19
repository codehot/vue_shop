import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Welcome from '../views/Welcome'
import UserList from '../views/user/UserList'


const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter)

const routes = [

  {
    path: '/home',
    component: Home,
    redirect: "/welcome",
    children:[
      {
        path:"/welcome",
        component: Welcome
      },
      {
        path:"/userlist",
        component: UserList
      },
    ]
  },
  {
    path: '/login',
    name: 'login',
    component:Login
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to,from,next)=>{
  if(to.path==="/login"){
    next();
  }else{
    const token = window.sessionStorage.getItem("token")
    if(!token){
      next("/login")
    }else{
      next()
    }
  }
})

export default router
