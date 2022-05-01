import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
/* @ts-ignore */
import vClickOutside from 'click-outside-vue3'
import VueToast from 'vue-toast-notification'

const app = createApp(App)
app.use(store)
app.use(router)
app.use(vClickOutside)
app.use(VueToast, {
    position: 'top'
})
app.mount('#root')

export default app