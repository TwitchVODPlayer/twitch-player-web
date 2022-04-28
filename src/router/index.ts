import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { userModule } from '../store/user'

const routes: Array<RouteRecordRaw> = [
    {
        name: "Login",
        path: '/login',
        beforeEnter: (to, _, next) => {
            if (!to.query.code) return { name: 'Dashboard' }
            userModule.login({
                code: String(to.query.code),
                state: String(to.query.state),
                scope: String(to.query.scope)
            }).then(() => next({ name: "Dashboard" }))
        },
        component: () => import('../components/Dashboard/Dashboard.vue')
    },
    {
        name: "Dashboard",
        path: '/',
        component: () => import('../components/Dashboard/Dashboard.vue')
    },
    {
        name: "Profile",
        path: '/profile',
        component: () => import('../components/Profile/Profile.vue'),
        meta: { requiresAuth: true }
    },
    {
        name: "VOD",
        path: '/vod/:vodId',
        props: true,
        component: () => import('../components/VOD/VOD.vue')
    },
    {
        name: "NotFound",
        path: '/:pathMatch(.*)*',
        component: () => import('../components/Error/NotFound.vue')
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