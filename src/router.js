import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    { path: '/', name: 'home', redirect: '/disk' },
    {
      path: '/',
      component: () => import('./views/Home.vue'),
      children: [
        { path: 'disk', name: 'disk', meta: { title: "我的文件" }, component: () => import('./views/disk') },
        { path: 'share', name: 'share', meta: { title: "我的分享" }, component: () => import('./views/share') },
        { path: 'recyclebin', name: 'recyclebin', meta: { title: "回收站" }, component: () => import('./views/recyclebin') },
        { path: 'picture', name: 'picture', meta: { title: "我的图床" }, component: () => import('./views/picture') },
      ]
    },
    { path: '/s/:alias', name: 'share-info', component: () => import('./views/share/home.vue') },
    {
      path: '/admin/',
      component: () => import('./views/admin/index.vue'),
      children: [
        { path: 'users', name: 'users', meta: { title: "用户管理" }, component: () => import('./views/admin/users') },
        { path: 'storages', name: 'storages', meta: { title: "存储管理" }, component: () => import('./views/admin/storages') },
        { path: 'settings', name: 'settings', meta: { title: "系统管理" }, component: () => import('./views/admin/settings') },
      ]
    },
  ]
})

const setTitle = (title) => {
  let defaultTitle = "ZPan"
  title = title ? `${defaultTitle} - ${title}` : defaultTitle;
  window.document.title = title;
}

router.beforeEach((to, from, next) => {
  setTitle(to.meta.title);

  next();
});

router.afterEach(() => {
  window.scrollTo(0, 0);
});


export default router