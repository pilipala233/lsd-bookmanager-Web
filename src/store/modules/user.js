import { login, logout, getInfo ,selectMenuByUserId} from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import Layout from '@/layout'
const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
 
    user:{},
    routes: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },

  SET_ROUTES: (state, routes) => {
    state.routes = routes
    
  },
  SET_USER: (state, user) => {
    state.user = user
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { userName, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ userName: userName.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar,id } = data
        commit('SET_USER', data)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getMenu({ commit, state }) {
    return new Promise((resolve, reject) => {
      selectMenuByUserId().then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        const routes = [];

        // 根据接口返回的数据构建路由配置
        data.forEach((menu) => {
            if (menu.menuType === 'M') {
            const route = {
                path: menu.path,
                component: () => import(`@/views/${menu.component}`),
                meta: {
                title: menu.menuName,
                icon: menu.icon
                // 可以根据接口返回的其他数据继续补充 meta 信息
                },
                children: []
            };

            // 查找当前菜单的子菜单并添加到 children 中
            const children = data.filter((childMenu) => childMenu.parentId === menu.menuId.toString());
            children.forEach((child) => {
                route.children.push({
                path: child.path,
                name: child.menuName,
                component: () => import(`@/views/${child.component}`),
                meta: {
                    title: child.menuName,
                    icon: child.icon
                    // 可以根据接口返回的其他数据继续补充 meta 信息
                }
                });
            });

            routes.push(route);
            }
        });
        
        commit('SET_ROUTES', routes);
        router.addRoutes(routes)
  
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },

  setUser({commit},user){
   
    return new Promise(resolve => {
      commit('SET_USER',user)
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

