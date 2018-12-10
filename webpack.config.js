const path = require('path');

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /(node_modules|bower_components)/
      }
    ]
  },
  resolve: {
    extensions: [ '.ts', '.js' ]
  },
  devServer: {
    contentBase: '/dist',
    port: 9001,
    compress: true,
    publicPath: '/dist'
  }
};