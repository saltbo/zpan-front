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
        { path: '/', name: 'home', redirect: '/disk' },
        { path: '/disk', name: 'disk', meta: { title: "我的文件" }, component: () => import('./views/disk') },
        { path: '/share', name: 'share', meta: { title: "我的分享" }, component: () => import('./views/share') },
        { path: '/recyclebin', name: 'recyclebin', meta: { title: "回收站" }, component: () => import('./views/recyclebin') },
      ]
    },
    { path: '/picture', name: 'picture', meta: { title: "我的图床" }, component: () => import('./views/picture') },
    { path: '/s/:alias', name: 'share-info', component: () => import('./views/share/home.vue') },
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