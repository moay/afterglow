const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    standalone: './src/js/init.js',
  },
  plugins: [
		  new CleanWebpackPlugin(['dist']),
  ],
  output: {
    filename: 'afterglow.min.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
