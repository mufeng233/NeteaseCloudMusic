import Vue from 'vue'
import App from './App'
import router from './router'
import store from './state'
import vuetify from './plugins/vuetify'
import functions from './plugins/functions'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueCookies from 'vue-cookies'
import VuetifyDialog from 'vuetify-dialog'
import 'vuetify-dialog/dist/vuetify-dialog.min.css'
import './static/litechat.css'


Vue.use(VuetifyDialog, {
  context: {
    vuetify
  }
});
Vue.use(VueCookies);
Vue.use(VueAxios, axios);
Vue.use(functions);

axios.defaults.baseURL = 'http://ncmapi.li1.fun:3000'; // 腾讯服务器
// axios.defaults.baseURL = 'https://netease-cloud-music-api-tau-ruby.vercel.app'; // 部署在vercel的项目
axios.defaults.timeout = 10000;
axios.defaults.withCredentials = true;

Vue.config.productionTip = false

// eslint-disable-next-line no-unused-vars
let app = new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
