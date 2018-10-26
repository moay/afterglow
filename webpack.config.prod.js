const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const DefinePlugin = require('webpack/lib/DefinePlugin');
const BabiliPlugin = require('babili-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');


module.exports = {
  mode: 'production',
  entry: {
    standalone: './src/js/init.js',
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new DefinePlugin({
      'process.env': {
        NODE_ENV: 'production',
      },
    }),
    new BabiliPlugin({}, { comments: false }),
    // new BundleAnalyzerPlugin(),
  ],
  output: {
    filename: 'afterglow.min.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [{
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
        },
      },
    }, {
      test: /\.scss$/,
      use: [
        'style-loader',
        'css-loader',
        'sass-loader',
      ],
    }, {
      test: /\.less$/,
      use: [
        'style-loader',
        'css-loader',
        'less-loader',
      ],
    }, {
      test: /\.css$/,
      use: [{
        loader: 'style-loader',
      }, {
        loader: 'css-loader',
      }],
    }, {
      test: /\.(jpe?g|png|ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
      use: 'base64-inline-loader?limit=1000&name=[name].[ext]',
    }],
  },
  optimization: {
    minimize: true,
    minimizer: [new UglifyJsPlugin()],
  },
};
