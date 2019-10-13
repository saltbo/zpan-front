import Vue from 'vue'
import Router from 'vue-router'
import Cookies from 'js-cookie';

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: () => import('./views/Layout.vue'),
      children: [
        { path: '/', redirect: '/disk' },
        { path: '/disk', name: 'disk', meta: { title: "我的文件" }, component: () => import('./views/disk') },
        { path: '/share', name: 'share', meta: { title: "我的分享" }, component: () => import('./views/share') },
        { path: '/recyclebin', name: 'recyclebin', meta: { title: "回收站" }, component: () => import('./views/recyclebin') },
      ]
    },
    { path: '/s/:alias', name: 'share-info', component: () => import('./views/share/home.vue') },
    { path: '/login', name: 'signin', meta: { title: "用户登录" }, component: () => import('./views/users/Signin.vue') },
    { path: '/login/signup', name: 'signup', meta: { title: "用户注册" }, component: () => import('./views/users/Signup.vue') },
    { path: '/login/reset', name: 'reset', meta: { title: "密码找回" }, component: () => import('./views/users/Reset.vue') }
  ]
})

const setTitle = (title) => {
  let defaultTitle = "ZPan"
  title = title ? `${defaultTitle} - ${title}` : defaultTitle;
  window.document.title = title;
}

router.beforeEach((to, from, next) => {
  setTitle(to.meta.title);
  let token = Cookies.get('intoken')
  if (!token && !to.path.startsWith('/login')) {  // 未登录则强制跳去登录
    window.location = '/login'
    return
  }

  next();
});

router.afterEach(() => {
  window.scrollTo(0, 0);
});


export default router