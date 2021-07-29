const UrlMixin = {
  methods: {
    setUrlQueryParameters(parameters, ignoreKeys = []) {
      const query = {};
      Object.keys(parameters)
        .filter((key) => !ignoreKeys || !ignoreKeys.includes(key))
        .forEach((key) => {
          query[key] = parameters[key];
        });

      if (Object.entries(this.$route.query).toString() === Object.entries(query).toString()) {
        return Promise.resolve();
      }
      return this.$router.replace({ query });
    },
    initDataFromQuery(validKeys = [], mappers = {}) {
      Object.keys(this.$route.query)
        .filter((key) => validKeys && validKeys.includes(key))
        .forEach((key) => {
          const keyValue = this.$route.query[key];
          this[key] = (mappers[key]) ? mappers[key](keyValue) : keyValue;
        });
    },
  },
};

export default UrlMixin;
