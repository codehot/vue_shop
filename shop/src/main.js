import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import {Form,FormItem,Input,Button, Message} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import "./assets/css/global.css"

Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)

Vue.prototype.$message = Message;
axios.defaults.baseURL = "http://localhost"
Vue.prototype.$http = axios;

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
