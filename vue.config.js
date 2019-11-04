const path = require('path');

module.exports = {
  outputDir: path.resolve(__dirname, './build'),
  devServer: {
    proxy: {
      '/octo-spy': {
        target: 'http://localhost:8080',
        ws: true,
        changeOrigin: true,
      },
    },
  },
};
