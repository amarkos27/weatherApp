const path = require('path');
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
      favicon: './src/images/weather-svgrepo-com.svg',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
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
