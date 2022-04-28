import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { login, getUser, refreshToken } from '../api/user'
import { error } from '../utils/popup'
import { mainModule } from './main'
import store from '.'

const ACCESS_TOKEN_KEY = "access_token"

interface LoginPayload {
    code: string
    state: string
    scope: string
}

interface User {
    id: string
    login: string
    display_name: string
    description: string
    offline_image_url: string
    profile_image_url: string
    broadcaster_type: string
    type: string
    view_count: number
    created_at: string
}

@Module({ name: "user", dynamic: true, namespaced: true, store })
export class UserModule extends VuexModule {
    /* States */
    token?: string
    user?: User


    /* Getters */
    get isLogged(): boolean {
        return !!this.user
    }
    get getAccessToken(): string|undefined {
        return this.token
    }
    get getUser(): User|undefined {
        return this.user
    }
    

    /* Actions */
    @Action
    async login(payload: LoginPayload) {
        mainModule.setLoading(true)
        return login(payload.code, payload.state, payload.scope).then(data => {
            this.context.commit('loginSuccess', data.token)
            return this.loadUser()
        }).catch((err: Error) => {
            this.context.commit('loginFailure', err)
        }).then(() => {
            mainModule.setLoading(false)
        })
    }
    @Action
    async loadUser() {
        mainModule.setLoading(true)
        if (!this.getAccessToken) return this.context.commit('loadUserFailure', new Error('Access token cannot be null'))
        return getUser().then(user => {
            this.context.commit('loadUserSuccess', user)
        }).catch((err: Error) => {
            this.context.commit('loadUserFailure', err)
        }).then(() => {
            mainModule.setLoading(false)
        })
    }
    @Action
    async logout() {
        this.context.commit('logoutSuccess')
    }
    @Action
    async loadToken() {
        const token = localStorage.getItem(ACCESS_TOKEN_KEY)
        if (!token) this.context.commit('loadTokenFailure')
        else this.context.commit('loadTokenSuccess', token)
        return !!token
    }
    @Action
    async refreshToken() {
        mainModule.setLoading(true)
        if (!this.getAccessToken) return this.context.commit('loadUserFailure', new Error('Access token cannot be null'))
        return refreshToken().then(data => {
            this.context.commit('loginSuccess', data.token)
        }).catch((err: Error) => {
            this.context.commit('loginFailure', err)
        }).then(() => {
            mainModule.setLoading(false)
        })
    }


    /* Mutations */
    @Mutation
    loginSuccess(token: string) {
        this.token = token
        localStorage.setItem(ACCESS_TOKEN_KEY, token)
    }
    @Mutation
    loginFailure(err: Error) {
        error(err)
        this.token = undefined
        localStorage.removeItem(ACCESS_TOKEN_KEY)
    }
    @Mutation
    loadUserSuccess(user: User) {
        this.user = user
    }
    @Mutation
    loadUserFailure(err: Error) {
        error(err)
        this.user = undefined
    }
    @Mutation
    logoutSuccess() {
        this.token = undefined
        localStorage.removeItem(ACCESS_TOKEN_KEY)
    }
    @Mutation
    loadTokenSuccess(token: string) {
        this.token = token
    }
    @Mutation
    loadTokenFailure() {
        this.token = undefined
    }
}

export const userModule = getModule(UserModule, store)