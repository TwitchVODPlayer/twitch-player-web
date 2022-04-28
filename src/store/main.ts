import { VuexModule, Module, Mutation, getModule } from 'vuex-module-decorators'
import store from '.'

@Module({ name: "main", dynamic: true, namespaced: true, store })
export class MainModule extends VuexModule {
    /* States */
    loading: boolean = false

    get isLoading(): boolean {
        return this.loading
    }

    /* Mutations */
    @Mutation
    setLoading(value: boolean) {
        this.loading = value
    }
}

export const mainModule = getModule(MainModule, store)