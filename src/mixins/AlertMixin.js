const AlertMixin = {
  methods: {
    loadAlerts(token) {
      return this.$http.get('/octo-spy/api/alerts', {
        headers: {
          Authorization: `Basic ${token}`,
        },
      })
        .then((response) => {
          this.$store.commit('setAlerts', response.data?.content || []);
          return Promise.resolve();
        });
    },
  },
};

export default AlertMixin;
