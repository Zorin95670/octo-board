import Vue from 'vue';
import Vuex from 'vuex';
import Dashboard from '@/store/Dashboard';
import Dialog from '@/store/Dialog';
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
    dialog: Dialog,
    snackbar: Snackbar,
    user: User,
    dashboard: Dashboard,
  },
});
