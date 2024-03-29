import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { login, getUser, refreshToken } from '../api/user'
import { error } from '../utils/popup'
import store from '.'

const ACCESS_TOKEN_KEY = "access_token"

@Module({ name: "user", dynamic: true, namespaced: true, store })
export class UserModule extends VuexModule {
    /* States */
    loading: boolean = false
    refreshing_token: boolean = false
    token?: string
    user?: User


    /* Getters */
    get isLoading(): boolean {
        return this.loading
    }
    get isLogged(): boolean {
        return !!this.token
    }
    get isRefreshingToken(): boolean {
        return this.refreshing_token
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
        store.commit('main/setLoading', true)
        return login(payload.code, payload.state, payload.scope).then(data => {
            this.context.commit('loginSuccess', data.token)
            return this.loadUser()
        }).catch((err: Error) => {
            this.context.commit('loginFailure', err)
        }).then(() => {
            store.commit('main/setLoading', false)
        })
    }
    @Action
    async loadUser() {
        if (!this.isLogged) return
        store.commit('main/setLoading', true)
        return getUser().then(user => {
            this.context.commit('loadUserSuccess', user)
        }).catch((err: Error) => {
            this.context.commit('loadUserFailure', err)
        }).then(() => {
            store.commit('main/setLoading', false)
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
        if (!this.getAccessToken) return this.context.commit('loadUserFailure', new Error('Access token cannot be null'))
        store.commit('main/setLoading', true)
        this.context.commit('setRefreshingToken', true)
        return refreshToken().then(data => {
            this.context.commit('loginSuccess', data.token)
        }).catch((err: Error) => {
            this.context.commit('loginFailure', err)
        }).then(() => {
            store.commit('main/setLoading', false)
            this.context.commit('setRefreshingToken', false)
        })
    }


    /* Mutations */
    @Mutation
    reset() {
        this.loading = false
        this.user = undefined
    }
    @Mutation
    setLoading(value: boolean) {
        this.loading = value
    }
    @Mutation
    setRefreshingToken(value: boolean) {
        this.refreshing_token = value
    }
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