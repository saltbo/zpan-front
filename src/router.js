import Vue from 'vue'
import Router from 'vue-router'
import i18n from './i18n'
import store from './store'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    { path: '/', name: 'home', component: () => import('./views/home') },
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
  Vue.zpan.System.optGet("website").then(ret => {
    let sOpt = ret.data
    let fullTitle = sOpt.name
    if (title) {
      fullTitle += `- ${title}`
    }
    window.document.title = fullTitle;
  })
}

const loadStorages = (to, next) => {
  Vue.zpan.Storage.list().then((ret) => {
    let storages = ret.data.list
    // 如果没有存储空间则强制跳去添加存储空间
    if (storages.length == 0) {
      next({ name: "storages" });
      return
    }

    // 如果访问的是首页则自动跳去第一个存储空间
    if (to.fullPath == "/") {
      router.push({ path: `/${storages[0].name}` })
      return
    }

    store.commit("storages", storages);
    storages.forEach((ele) => {
      if (ele.name == to.params.sname) {
        store.commit("cs", ele);
      }
    });
    next()
  });
}

router.beforeEach((to, from, next) => {
  setTitle(i18n.t(`title.${to.name}`));

  if (!from.params.sname || (to.params.sname != from.params.sname)) {
    loadStorages(to, next)
    return
  }

  next()
});

router.afterEach(() => {
  window.scrollTo(0, 0);
});


export default router