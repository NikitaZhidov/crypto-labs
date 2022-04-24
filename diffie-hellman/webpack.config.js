const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'client-src', 'script.js'),
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Output Management',
      template: path.resolve(__dirname, 'client-src', 'index.html'),
    }),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'client'),
    clean: true,
  },
  resolve: {
    fallback: {
      crypto: false
    }
  }
};
