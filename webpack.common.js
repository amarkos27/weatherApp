const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    app: './src/app.js',
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      title: 'Weather',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new webpack.ContextReplacementPlugin(
      /date-fns[/\\]locale/,
      new RegExp(`(${locales.join('|')})\.js$`)
    ),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /.(ttf|woff|woff2)$/i,
        type: 'asset/resource',
      },
      {
        test: /.(gif|jpeg|jpg|png|svg)$/i,
        type: 'asset/resource',
      },
      {
        test: /.html$/i,
        use: 'html-loader',
      },
    ],
  },
};
