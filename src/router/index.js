import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
// import Home from '../components/Home'

Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    redirect:'/login'
  },
  {
    path:'/login',
    component:Login
  },
  {
    path:'/home',
    component:()=>import('../components/Home.vue')
  }
  
  // {
  //   path: '/about',
  //   name: 'about',
    
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]



const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

router.beforeEach((to,from,next)=>{
  if(to.path === '/login'){
    next();
  }
  const token = window.sessionStorage.getItem('token');
  if(!token) return next('/login');
  next();  
  

})
