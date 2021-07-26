import nunjucks from 'nunjucks';

const NunjucksMixin = {
  created() {
    nunjucks.configure({ autoescape: true });
  },
  methods: {
    renderString: nunjucks.renderString,
  },
};

export default NunjucksMixin;
