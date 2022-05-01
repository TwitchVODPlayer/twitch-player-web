import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { userModule } from '../store/user'

const routes: Array<RouteRecordRaw> = [
    {
        name: "Login",
        path: '/login',
        beforeEnter: (to) => {
            if (!to.query.code) return { name: 'Dashboard' }
            return userModule.login({
                code: String(to.query.code),
                state: String(to.query.state),
                scope: String(to.query.scope)
            }).then(() => ({ name: "Dashboard" }))
        },
        component: () => import('../views/Dashboard.vue')
    },
    {
        name: "Dashboard",
        path: '/',
        component: () => import('../views/Dashboard.vue')
    },
    {
        name: "VOD",
        path: '/vod/:vodId',
        props: true,
        component: () => import('../views/VOD.vue')
    },
    {
        name: "Profile",
        path: '/profile',
        component: () => import('../views/Profile.vue'),
        meta: { requiresAuth: true }
    },
    {
        name: "Videos",
        path: '/videos/:login',
        props: true,
        component: () => import('../views/Videos.vue'),
        meta: { requiresAuth: true }
    },
    {
        name: "NotFound",
        path: '/:pathMatch(.*)*',
        component: () => import('../views/NotFound.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

router.beforeEach((to, _, next) => {
    if (to.meta.requiresAuth && !userModule.isLogged) return next({ name: "Dashboard" })

    return next()
})

export default router