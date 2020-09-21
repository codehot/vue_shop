import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import {
    Form,
    FormItem,
    Input,
    Button, 
    Message, 
    Container, 
    Header, 
    Aside, 
    Main, 
    Menu, 
    MenuItem, 
    Submenu, 
    BreadcrumbItem, 
    Breadcrumb, 
    TabPane, 
    Card, 
    Table, 
    TableColumn, 
    Switch, 
    Row, 
    Col, 
    Pagination, 
    Dialog,
    MessageBox, Tag, Tree, Select, Option
  } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import "./assets/css/global.css"
import VueRouter from 'vue-router'

Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Row)
Vue.use(Col)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm

axios.defaults.baseURL = "http://www.v2.com/index.php/api/"
axios.interceptors.request.use(config=>{
  //console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem("token")
  return config
})
Vue.prototype.$http = axios;

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
