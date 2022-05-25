import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { getHistory, setWatchLater, setWatchtime, toggleHistory } from '../api/vod'
import { error } from '../utils/popup'
import store from '.'

@Module({ name: "history", dynamic: true, namespaced: true, store })
export class HistoryModule extends VuexModule {
    /* States */
    loading: boolean = false
    history?: Array<VODHistory>
    watchLater?: Array<number>


    /* Getters */
    get isLoading(): boolean {
        return this.loading
    }
    get getHistory(): Array<VODHistory>|undefined {
        return this.history
    }
    get getWatchLater(): Array<number>|undefined {
        return this.watchLater
    }
    get isEnabled(): boolean {
        return this.history != null
    }
    get getVodStart() {
        return (vod_id: number = this.context.rootGetters['vod/getVod']) => this.getHistory?.find(h => h.vod_id == vod_id)?.start || 0
    }
    get isInHistory() {
        return (vod_id: number) => this.isEnabled && (this.getHistory?.findIndex(vod => vod.vod_id === vod_id) ?? -1) > -1
    }
    get isInWatchLater() {
        return (vod_id: number) => this.isEnabled && (this.getWatchLater?.indexOf(vod_id) ?? -1) > -1
    }
    

    /* Actions */
    @Action
    async loadUserVideos() {
        if (!this.context.rootGetters['user/isLogged']) return
        return getHistory().then(data => {
            this.context.commit('loadUserVideosSuccess', data)
        }).catch((err: Error) => {
            this.context.commit('loadUserVideosFailure', err)
        })
    }
    @Action
    async toggleHistory() {
        this.context.commit('setLoading', true)
        return toggleHistory(!this.isEnabled).then(data => {
            this.context.commit('loadUserVideosSuccess', data)
        }).catch((err: Error) => {
            this.context.commit('loadUserVideosFailure', err)
        }).then(() => {
            this.context.commit('setLoading', false)
        })
    }
    @Action
    async setWatchtime({ vod_id = this.context.rootGetters['vod/getVod'], start }: { vod_id?: number, start: number }) {
        if (!this.isEnabled) return
        return setWatchtime({ vod: vod_id, start }).then(() => {
            this.loadUserVideos()
        }).catch(() => {})
    }
    @Action
    async addWatchLater(vod_id: number) {
        if (!this.isEnabled) return
        return setWatchLater({ vod: vod_id, add: !this.isInWatchLater(vod_id) }).then(() => {
            this.loadUserVideos()
        }).catch(() => {})
    }


    /* Mutations */
    @Mutation
    reset() {
        this.loading = false
        this.history = undefined
    }
    @Mutation
    setLoading(value: boolean) {
        this.loading = value
    }
    @Mutation
    loadUserVideosSuccess(response: UserVideosResponse) {
        this.history = response.history || undefined
        this.watchLater = response.watch_later || undefined
    }
    @Mutation
    loadUserVideosFailure(err: Error) {
        error(err)
        this.history = undefined
        this.watchLater = undefined
    }
}


export const historyModule = getModule(HistoryModule, store)