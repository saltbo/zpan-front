import Vue from 'vue'
import Router from 'vue-router'
import i18n from './i18n'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    { path: '/', name: 'home', redirect: '/disk' },
    {
      path: '/',
      component: () => import('./views/Home.vue'),
      children: [
        { path: 'disk', name: 'disk', component: () => import('./views/disk') },
        { path: 'share', name: 'share', component: () => import('./views/share') },
        { path: 'recyclebin', name: 'recyclebin', component: () => import('./views/recyclebin') },
        { path: 'picture', name: 'picture', component: () => import('./views/picture') },
      ]
    },
    { path: '/s/:alias', name: 'share-info', component: () => import('./views/share/home.vue') },
    { path: '/admin/', name: 'admin', redirect: '/admin/storage-quota' },
    {
      path: '/admin/',
      component: () => import('./views/admin/index.vue'),
      children: [
        { path: 'storage-quota', name: 'storage-quota', component: () => import('./views/admin/users') },
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