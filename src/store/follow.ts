import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { getFollows } from '../api/user'
import { error } from '../utils/popup'
import store from '.'

@Module({ name: "follow", dynamic: true, namespaced: true, store })
export class FollowModule extends VuexModule {
    /* States */
    loading: boolean = false
    follows?: Array<User>
    next?: string


    /* Getters */
    get isLoading(): boolean {
        return this.loading
    }
    get getFollows(): Array<User>|undefined {
        return this.follows
    }
    get getNext(): string|undefined {
        return this.next
    }
    

    /* Actions */
    @Action
    async loadFollows(first: number) {
        if (this.getFollows || !store.getters['user/getAccessToken']) return
        this.context.commit('setLoading', true)
        return getFollows({ first }).then(follows => {
            this.context.commit('loadFollowsSuccess', follows)
        }).catch((err: Error) => {
            this.context.commit('loadFollowsFailure', err)
        }).then(() => {
            this.context.commit('setLoading', false)
        })
    }
    @Action
    async loadMoreFollows(first: number) {
        if (!this.getNext || !store.getters['user/getAccessToken']) return
        this.context.commit('setLoading', true)
        return getFollows({ next: this.getNext, first }).then(follows => {
            this.context.commit('loadMoreFollowsSuccess', follows)
        }).catch((err: Error) => {
            this.context.commit('loadMoreFollowsFailure', err)
        }).then(() => {
            this.context.commit('setLoading', false)
        })
    }


    /* Mutations */
    @Mutation
    reset() {
        this.loading = false
        this.follows = undefined
        this.next = undefined
    }
    @Mutation
    setLoading(value: boolean) {
        this.loading = value
    }
    @Mutation
    loadFollowsSuccess(response: FollowsResponse) {
        this.follows = response.follows
        this.next = response.next
    }
    @Mutation
    loadFollowsFailure(err: Error) {
        error(err)
        this.follows = undefined
        this.next = undefined
    }
    @Mutation
    loadMoreFollowsSuccess(response: FollowsResponse) {
        this.follows?.push(...response.follows)
        this.next = response.next
    }
    @Mutation
    loadMoreFollowsFailure(err: Error) {
        error(err)
    }
}


export const followModule = getModule(FollowModule, store)