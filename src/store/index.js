import Vue from 'vue';
import Vuex from 'vuex';
import Snackbar from '@/store/Snackbar';
import User from '@/store/User';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    navigationPanel: false,
    alerts: [],
  },
  mutations: {
    setNavigationPanelState(state, value) {
      state.navigationPanel = value;
    },
    setAlerts(state, value) {
      state.alerts = value;
    },
  },
  actions: {
  },
  modules: {
    snackbar: Snackbar,
    user: User,
  },
});
