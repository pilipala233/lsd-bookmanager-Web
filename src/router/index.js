import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/register/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },


  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: '书库',
      component: () => import('@/views/book/index'),
      meta: { title: '书库', icon: 'dashboard' }
    }]
  },
  {
    path: '/bookBorrowing',
    component: Layout,
   
    children: [{
      path: 'dashboard1',
      name: '借阅记录',
      component: () => import('@/views/bookBorrowing/index'),
      meta: { title: '借阅记录', icon: 'dashboard' }
    }]
  },
  {
    path: '/personnelManagement',
    component: Layout,
   
    children: [{
      path: 'dashboard2',
      name: '人员管理',
      component: () => import('@/views/personnelManagement/index'),
      meta: { title: '人员管理', icon: 'dashboard' }
    }]
  },
  {
    path: '/todo',
    component: Layout,
   
    children: [{
      path: 'dashboard3',
      name: '代办',
      component: () => import('@/views/todo/index'),
      meta: { title: '代办', icon: 'dashboard' }
    }]
  },
  {
    path: '/info',
    component: Layout,
    hideShow:true,
    children: [{
      path: 'dashboard4',
      name: '个人信息',
      component: () => import('@/views/info/index'),
      meta: { title: '个人信息', icon: 'dashboard' }
    }]
      
     
    
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
