const AlertMixin = {
  computed: {
    token() {
      return this.$store.state.user.token;
    },
  },
  methods: {
    loadAlerts() {
      return this.$http.get('/octo-spy/api/alerts', {
        headers: {
          Authorization: `Basic ${this.token}`,
        },
      })
        .then((response) => {
          this.$store.commit('setAlerts', response.data?.resources || []);
          return Promise.resolve();
        });
    },
  },
};

export default AlertMixin;
