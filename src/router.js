import Vue from 'vue'
import Router from 'vue-router'
import Cookies from 'js-cookie';
Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/home',
      name: 'home',
      component: () => import('./views/Home.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('./views/About.vue')
    },
    {
      path: '/login',
      name: 'signin',
      component: () => import('./views/users/Signin.vue')
    },
    {
      path: '/login/signup',
      name: 'signup',
      component: () => import('./views/users/Signup.vue')
    },
    {
      path: '/login/reset',
      name: 'reset',
      component: () => import('./views/users/Reset.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  let token = Cookies.get('intoken')
  if (!token && !to.path.startsWith('/login')) {  // 未登录则强制跳去登录
    window.location = '/login'
    return
  }

  next();
});


export default router