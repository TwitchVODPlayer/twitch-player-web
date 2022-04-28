import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import VueToast from 'vue-toast-notification'

const app = createApp(App)
app.use(store)
app.use(router)
app.use(VueToast, {
    position: 'top'
})
app.mount('#root')

export default app