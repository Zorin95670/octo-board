import Vue from 'vue';
import axios from 'axios';
import Toaster from 'v-toaster';
import VueAxios from 'vue-axios';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCircleNotch, faInfoCircle, faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import 'v-toaster/dist/v-toaster.css';
import App from './App.vue';
import router from './router';

Vue.use(VueAxios, axios);
Vue.use(Toaster, { timeout: 5000 });

Vue.component('font-awesome-icon', FontAwesomeIcon);

library.add(
  fasStar,
  farStar,
  faInfoCircle,
  faCircleNotch,
);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
