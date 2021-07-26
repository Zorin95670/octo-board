import Vue from 'vue';
import Vuex from 'vuex';
import Snackbar from '@/store/Snackbar';

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
  },
});
