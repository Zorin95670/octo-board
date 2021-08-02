import Vue from 'vue';
import Vuex from 'vuex';
import Snackbar from '@/store/Snackbar';
import User from '@/store/User';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    navigationPanel: false,
  },
  mutations: {
    setNavigationPanelState(state, value) {
      state.navigationPanel = value;
    },
  },
  actions: {
  },
  modules: {
    snackbar: Snackbar,
    user: User,
  },
});
