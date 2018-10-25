const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'none',
  target: 'node',
  externals: [nodeExternals()],
};
