import { VuexModule, Module, Mutation, getModule, Action } from 'vuex-module-decorators'
import store from '.'
import { userModule } from './user'
import { followModule } from './follow'
import { videoModule } from './video'
import { vodModule } from './vod'

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
        userModule.reset()
        followModule.reset()
        videoModule.reset()
        vodModule.reset()
    }


    /* Mutations */
    @Mutation
    setLoading(value: boolean) {
        this.loading = value
    }
}

export const mainModule = getModule(MainModule, store)