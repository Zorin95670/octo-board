import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import 'vuetify/dist/vuetify.min.css';
import vuetify from '@/plugins/vuetify';
import App from './App.vue';
import router from './router';
import store from './store';
import { version } from '../package.json';

Vue.use(VueAxios, axios);

Vue.config.productionTip = false;

new Vue({
  vuetify,
  router,
  store,
  data: { version: `v${version}` },
  render: (h) => h(App),
}).$mount('#app');
