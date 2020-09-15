import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: Home
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
