const snackbar = {
  state: {
    message: '',
    color: '',
    icon: null,
    timeout: null,
  },
  mutations: {
    showMessage(state, payload) {
      state.message = payload.message;
      state.icon = payload.icon;
      state.color = payload.color;
      state.timeout = payload.timeout;
    },
  },
};
export default snackbar;
