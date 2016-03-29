const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');

const NpmInstallPlugin = require('npm-install-webpack-plugin');

const TARGET = process.env.npm_lifecycle_event;
const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
};

const common = {
  // Entry accepts a path or an object of entries. We'll be using the
  //latter form given its convienent with more complex configs.
  entry: {
    app: PATHS.app
  },
  output: {
    path: PATHS.build,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        //Test expects a RegEx!
        test: /\.css$/,
        loaders: ['style', 'css'],
        //include accepts either a path or array of paths
        include: PATHS.app
      }
    ]
  }
};

//Default configs
if (TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    devtool: 'eval-source-map',
    devServer: {
      contentBase: PATHS.build,

      //Enable history API fallback so HTML5 History API based
      //routing works. This is a good default that will come in
      //handy in more complicated setups.
      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true,

      //display only errors to reduce amount of output
      stats: 'errors-only',

      //parse host and port from env so this is easy to customeize
      host: process.env.HOST,
      port: process.env.PORT
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new NpmInstallPlugin({
        save: true //--save
      })
    ]
  });
}

if (TARGET === 'build') {
  module.exports = merge(common, {});
}
