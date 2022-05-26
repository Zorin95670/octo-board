const dashboard = {
  state: {
    items: [],
  },
  mutations: {
    setDashboards(state, payload) {
      const array = [...payload.dashboards];
      state.items.filter((d) => d.visible !== payload.visible)
        .forEach((d) => {
          array.push(d);
        });
      state.items = array;
    },
  },
  actions: {
    loadDashboards({ commit }, payload) {
      const { visible, token } = payload;
      let headers;
      if (!visible) {
        headers = {
          Authorization: `Basic ${token}`,
        };
      }
      // eslint-disable-next-line no-underscore-dangle
      return this._vm.$http.get('/octo-spy/api/dashboards', { params: { visible }, headers })
        .then((response) => {
          commit('setDashboards', {
            dashboards: response.data.content,
            visible,
          });
        });
    },
  },
};
export default dashboard;
