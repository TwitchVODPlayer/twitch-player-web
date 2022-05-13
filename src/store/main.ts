import { VuexModule, Module, Mutation, getModule, Action } from 'vuex-module-decorators'
import store from '.'

@Module({ name: "main", dynamic: true, namespaced: true, store })
export class MainModule extends VuexModule {
    /* States */
    loading: boolean = false

    get isLoading(): boolean {
        return this.loading
    }

    /* Actions */
    @Action
    async reset() {
        this.context.commit('user/reset', null, { root: true })
        this.context.commit('follow/reset', null, { root: true })
        this.context.commit('video/reset', null, { root: true })
        this.context.commit('vod/reset', null, { root: true })
        this.context.commit('history/reset', null, { root: true })
        return this.load(true)
    }
    @Action
    async load(reload: boolean = false) {
        this.setLoading(true)
        await this.context.dispatch(`user/${reload ? 'refreshToken' : 'loadToken'}`, null, { root: true })
        await this.context.dispatch('user/loadUser', null, { root: true })
        await this.context.dispatch('history/loadHistory', null, { root: true })
        this.setLoading(false)
    }


    /* Mutations */
    @Mutation
    setLoading(value: boolean) {
        this.loading = value
    }
}

export const mainModule = getModule(MainModule, store)