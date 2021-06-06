const { resolve } = require('path');
module.exports = {
  markdown: resolve(__dirname, './src/content'),
  alias: {},
  moduleFederationPlugin: {
    name: 'micro-container',
    shared: {
      'axios': { requiredVersion: '^0.21.1' },
      'react': { requiredVersion: '^17.0.2' },
      'react-dom': { requiredVersion: '^17.0.2' },
      'react-router-dom': { requiredVersion: '^5.2.0' },
    },
  },
  environments: {
    PUBLIC_URL: '/app/',
  },
};
