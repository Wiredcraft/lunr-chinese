const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: {
    "lunr-chinese": "./build.js",
    "lunr-chinese.min": "./build.js",
  },
  output: {
    filename: '[name].js',
    library: 'lunr',
    libraryTarget: 'umd'
  },
  plugins: [
    new UglifyJSPlugin({
      test: /\.min\.js$/,
      compress: true
    })
  ]
}
