import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { verifyVodId } from '../api/vod'
import { error } from '../utils/popup'
import { mainModule } from './main'
import store from '.'
import { ResponseError } from '../utils/error'

@Module({ name: "vod", dynamic: true, namespaced: true, store })
export class VODModule extends VuexModule {
    /* States */
    vod_id?: number
    valid: boolean = false


    /* Getters */
    get vod(): number|undefined {
        return this.vod_id
    }
    get isValid(): boolean {
        return this.valid
    }


    /* Actions */
    @Action
    setVod(vod_id?: number|string) {
        if (!vod_id || isNaN(Number(vod_id))) return this.context.commit('setVodFailure', new ResponseError({ error: "Not Found", message: "Invalid VOD id", status: 404 }))
        mainModule.setLoading(true)
        verifyVodId(vod_id).then(() => {
            this.context.commit('setVodSuccess', Number(vod_id))
            this.context.commit('setValid', true)
        }).catch((err: Error) => {
            this.context.commit('setVodFailure', err)
            this.context.commit('setValid', false)
        }).then(() => {
            mainModule.setLoading(false)
        })
    }


    /* Mutations */
    @Mutation
    setVodSuccess(vod_id: number|undefined) {
        this.vod_id = vod_id
    }
    @Mutation
    setVodFailure(err: Error) {
        error(err)
        this.vod_id = undefined
    }
    @Mutation
    setValid(value: boolean) {
        this.valid = value
    }
}

export const vodModule = getModule(VODModule, store)