const user = {
  state: {
    isConnected: false,
    token: null,
    roles: [],
    firstname: null,
    lastname: null,
    login: null,
    email: null,
  },
  mutations: {
    setUser(state, value) {
      state.isConnected = true;
      state.token = value.token;
      state.roles = value.roles;
      state.firstname = value.firstname;
      state.lastname = value.lastname;
      state.login = value.login;
      state.email = value.email;
    },
    disconnect(state) {
      state.isConnected = false;
      state.token = null;
      state.roles = [];
      state.firstname = null;
      state.lastname = null;
      state.login = null;
      state.email = null;
    },
  },
};
export default user;
