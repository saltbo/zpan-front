import Vue from 'vue'
import Router from 'vue-router'
import i18n from './i18n'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    { path: '/', name: 'home', redirect: '/disk' },
    {
      path: '/:sname',
      component: () => import('./views/home'),
      children: [
        { path: '/', name: 'disk', component: () => import('./views/home/disk') },
        { path: 'share', name: 'share', component: () => import('./views/home/share') },
        { path: 'recyclebin', name: 'recyclebin', component: () => import('./views/home/recyclebin') },
      ]
    },
    { path: '/s/:alias', name: 'share-info', component: () => import('./views/home/share/home.vue') },
    { path: '/s/:alias/draw', name: 'share-draw', component: () => import('./views/home/share/draw.vue') },
    // {
    //   path: '/',
    //   component: () => import('./views/home'),
    //   children: [
    //     { path: 'picture', name: 'picture', component: () => import('./views/home/picture') },
    //   ]
    // },
    {
      path: '/m/admin/',
      component: () => import('./views/admin/index.vue'),
      children: [
        { path: '/', name: 'admin', component: () => import('./views/admin/home') },
        { path: 'users', name: 'users', component: () => import('./views/admin/users') },
        { path: 'storages', name: 'storages', component: () => import('./views/admin/storages') },
        { path: 'settings', name: 'settings', component: () => import('./views/admin/settings') },
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
  setTitle(i18n.t(`title.${to.name}`));

  next();
});

router.afterEach(() => {
  window.scrollTo(0, 0);
});


export default router