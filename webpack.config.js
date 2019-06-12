const path = require('path');

module.exports = {
  target: 'web',
  entry: './public/js/test-io.js',
  output: {
    path: path.resolve(__dirname, 'public/js'),
    filename: 'bundle.js'
  },
  node: {
    'fs': 'empty',
    'net': 'empty',
    'tls': 'empty'
  },
  // devtool: 'inline-source-map'
  devServer: {
    contentBase: './public/js',
    hot: true
  },
  // plugins: [
  //   new webpack.HotModuleReplacementPlugin()
  // ]
};
