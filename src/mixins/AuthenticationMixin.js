import AlertMixin from '@/mixins/AlertMixin';

const AuthenticationMixin = {
  mixins: [AlertMixin],
  computed: {
    isConnected() {
      return this.$store.state.user.isConnected;
    },
    roles() {
      return this.$store.state.user.roles;
    },
  },
  methods: {
    isAdministrator() {
      return this.isUserGranted(['ADMIN']);
    },
    isUserGranted(roles) {
      return roles.some((role) => this.roles.includes(role));
    },
    authenticate(storage, token, keepActive) {
      return this.$http.get('/octo-spy/api/users/me', {
        headers: {
          Authorization: `Basic ${token}`,
        },
      }).then((response) => {
        const data = {
          token,
          roles: response.data.roles,
          ...response.data.user,
        };
        this.$store.commit('setUser', data);
        if (keepActive) {
          storage.setItem('user-token', token);
          storage.setItem('user-roles', data.roles);
        } else {
          storage.removeItem('user-token');
          storage.removeItem('user-roles');
        }

        if (data.roles.includes('ADMIN')) {
          return this.loadAlerts();
        }
        return Promise.resolve();
      }).catch((response) => {
        this.$store.commit(
          'showMessage',
          { message: 'Wrong username or password.', color: 'error' },
        );
        return response;
      });
    },
    authenticateFromStorage(storage) {
      const token = storage.getItem('user-token');
      if (token != null) {
        this.authenticate(storage, token, true)
          .catch(() => {
            storage.removeItem('user-token');
            storage.removeItem('user-roles');
          });
      }
    },
    disconnect(storage) {
      this.$store.commit('disconnect');
      if (storage.getItem('user-token') != null) {
        storage.removeItem('user-token');
        storage.removeItem('user-roles');
      }
      if (this.$route.path !== '/') {
        this.$router.push('/');
      }
    },
    updateToken(storage, token) {
      this.$store.commit('updateUserToken', token);
      if (storage.getItem('user-token') != null) {
        storage.setItem('user-token', token);
      }
    },
  },
};

export default AuthenticationMixin;
