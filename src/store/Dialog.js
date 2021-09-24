const dialog = {
  state: {
    type: null,
    data: null,
  },
  mutations: {
    openDialog(state, payload) {
      state.data = payload.data;
      state.type = payload.type;
    },
    closeDialog(state) {
      state.data = null;
      state.type = null;
    },
  },
};
export default dialog;
