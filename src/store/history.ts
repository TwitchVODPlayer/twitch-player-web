import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { getHistory, setWatchtime, toggleHistory } from '../api/vod'
import { error } from '../utils/popup'
import store from '.'

@Module({ name: "history", dynamic: true, namespaced: true, store })
export class HistoryModule extends VuexModule {
    /* States */
    loading: boolean = false
    history?: Array<VODHistory>


    /* Getters */
    get isLoading(): boolean {
        return this.loading
    }
    get getHistory(): Array<VODHistory>|undefined {
        return this.history
    }
    get isEnabled(): boolean {
        return this.history != null
    }
    get getVodStart() {
        return (vod_id: number = this.context.rootGetters['vod/getVod']) => this.getHistory?.find(h => h.vod_id == vod_id)?.start || 0
    }
    

    /* Actions */
    @Action
    async loadHistory() {
        return getHistory().then(data => {
            this.context.commit('loadHistorySuccess', data)
        }).catch((err: Error) => {
            this.context.commit('loadHistoryFailure', err)
        })
    }
    @Action
    async toggleHistory() {
        return toggleHistory(!this.isEnabled).then(data => {
            this.context.commit('loadHistorySuccess', data)
        }).catch((err: Error) => {
            this.context.commit('loadHistoryFailure', err)
        }).then(() => {
            this.context.commit('setLoading', false)
        })
    }
    @Action
    async setWatchtime(start: number) {
        if (!this.isEnabled) return
        return setWatchtime({ vod: this.context.rootGetters['vod/getVod'], start }).then(() => {
            this.loadHistory()
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
    loadHistorySuccess(response: HistoryResponse) {
        this.history = response.history || undefined
    }
    @Mutation
    loadHistoryFailure(err: Error) {
        error(err)
        this.history = undefined
    }
}


export const historyModule = getModule(HistoryModule, store)