import Vue from 'vue'
import Router from 'vue-router'
import i18n from './i18n'
import store from './store'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    { path: '/', name: 'home', component: () => import('./views/home') },
    { path: '/install', name: 'installer', component: () => import('./views/installer') },
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
    {
      path: '/settings',
      component: () => import('./views/settings'),
      children: [
        { path: 'profile', name: 'profile', component: () => import('./views/settings/profile') },
        { path: 'security', name: 'security', component: () => import('./views/settings/security') },
      ]
    },
    {
      path: '/admin',
      component: () => import('./views/admin/index.vue'),
      children: [
        { path: 'dashboard', name: 'admin', component: () => import('./views/admin/home') },
        { path: 'users', name: 'users', component: () => import('./views/admin/users') },
        { path: 'storages', name: 'storages', component: () => import('./views/admin/storages') },
        { path: 'settings', name: 'settings', component: () => import('./views/admin/settings') },
        { path: 'settings/email', name: 'settings-email', component: () => import('./views/admin/settings/email.vue') },
      ]
    },
    {
      path: "/u",
      component: () => import('./views/login'),
      children: [
        { path: 'signin', name: 'signin', meta: { title: "用户登录" }, component: () => import('./views/login/Signin.vue') },
        { path: 'signout', name: 'signout', meta: { title: "用户登出" }, component: () => import('./views/login/Signout.vue') },
        { path: 'signin/:token64', name: 'activate', meta: { title: "账户激活" }, component: () => import('./views/login/Activate.vue') },
        { path: 'signup', name: 'signup', meta: { title: "用户注册" }, component: () => import('./views/login/Signup.vue') },
        { path: 'password-reset', name: 'reset_apply', meta: { title: "密码找回" }, component: () => import('./views/login/ResetApply.vue') },
        { path: 'password-reset/:token64', name: 'reset_confirm', meta: { title: "密码找回" }, component: () => import('./views/login/ResetConfirm.vue') },
      ]
    },
  ]
})

const setTitle = (title, next) => {
  Vue.zpan.System.optGet("website").then(ret => {
    let sOpt = ret.data
    let fullTitle = sOpt.name
    if (title) {
      fullTitle += `- ${title}`
    }
    window.document.title = fullTitle;
  }).catch(error => {
    if (error.response && error.response.status == 520) {
      next({ name: "installer" })
      return
    }
  });
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
  }).catch(error => {
    if (error.response && error.response.status == 401) {
      next({ name: "signin" })
      return
    }
  });
}

const shouldLoadStorages = (to, from) => {
  if (to.path == "/") return true
  if (to.params.sname && to.params.sname != from.params.sname) return true
  return false
}

router.beforeEach((to, from, next) => {
  setTitle(i18n.t(`title.${to.name}`), next);

  if (shouldLoadStorages(to, from)) {
    loadStorages(to, next)
    return
  }

  next()
});

router.afterEach(() => {
  window.scrollTo(0, 0);
});


export default router