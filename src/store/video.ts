import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { getVideos } from '../api/vod'
import { getUser } from '../api/user'
import { error } from '../utils/popup'
import store from '.'

@Module({ name: "video", dynamic: true, namespaced: true, store })
export class VideoModule extends VuexModule {
    /* States */
    loading: boolean = false
    videos?: Array<Video>
    next?: string
    user?: User


    /* Getters */
    get isLoading(): boolean {
        return this.loading
    }
    get getVideos(): Array<Video>|undefined {
        return this.videos
    }
    get getNext(): string|undefined {
        return this.next
    }
    get getUser(): User|undefined {
        return this.user
    }
    

    /* Actions */
    @Action
    async loadVideos({ login, first, filter }: { login: string, first?: number, filter?: string }) {
        return this.loadUser({ login, force: !!filter }).then(() => {
            if (!store.getters['user/getAccessToken']) return
            this.context.commit('setLoading', true)
            return getVideos({ login, first, filter }).then(videos => {
                this.context.commit('loadVideosSuccess', videos)
            }).catch((err: Error) => {
                this.context.commit('loadVideosFailure', err)
            }).then(() => {
                this.context.commit('setLoading', false)
            })
        })
    }
    @Action
    async loadMoreVideos({ login, first }: { login: string, first?: number }) {
        if (!this.getNext || !store.getters['user/getAccessToken']) return
        this.context.commit('setLoading', true)
        return getVideos({ login, first, next: this.getNext }).then(videos => {
            this.context.commit('loadMoreVideosSuccess', videos)
        }).catch((err: Error) => {
            this.context.commit('loadMoreVideosFailure', err)
        }).then(() => {
            this.context.commit('setLoading', false)
        })
    }
    @Action
    async loadUser({ login, force = false }: { login: string, force: boolean }) {
        if (!login || (this.getUser?.login === login && !force)) return
        store.commit('main/setLoading', true)
        return getUser(login).then(user => {
            this.context.commit('loadUserSuccess', user)
        }).catch((err: Error) => {
            this.context.commit('loadUserFailure', err)
        }).then(() => {
            store.commit('main/setLoading', false)
        })
    }


    /* Mutations */
    @Mutation
    reset() {
        this.loading = false
        this.videos = undefined
        this.next = undefined
        this.user = undefined
    }
    @Mutation
    setLoading(value: boolean) {
        this.loading = value
    }
    @Mutation
    loadVideosSuccess(response: VideosResponse) {
        this.videos = response.videos
        this.next = response.next
    }
    @Mutation
    loadVideosFailure(err: Error) {
        error(err)
        this.videos = undefined
        this.next = undefined
    }
    @Mutation
    loadMoreVideosSuccess(response: VideosResponse) {
        this.videos?.push(...response.videos)
        this.next = response.next
    }
    @Mutation
    loadMoreVideosFailure(err: Error) {
        error(err)
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
}


export const videoModule = getModule(VideoModule, store)