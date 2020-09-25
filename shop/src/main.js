import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueQuillEditor from 'vue-quill-editor'
 
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
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
    MessageBox, 
    Tag, 
    Tree, 
    Select, 
    Option, 
    Cascader, 
    Alert, 
    Tabs, 
    Steps, 
    Step,
    CheckboxGroup, 
    Checkbox, 
    Upload
  } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import TreeTable from 'vue-table-with-tree-grid'
import "./assets/css/global.css"
// import VueRouter from 'vue-router'

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
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Upload)

Vue.use(VueQuillEditor)


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
Vue.component('tree-table',TreeTable)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
