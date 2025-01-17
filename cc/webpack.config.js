const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = [
  {
    name: 'main',
    entry: './src/index.js',
    mode: 'production',
    devServer: {
      host: '0.0.0.0',
      hot: true,
      static: ['assets'],
      allowedHosts: 'all',
      compress: true,
      port: 4200,
    },
    output: {
        path: path.resolve(__dirname, 'dist/cc'),
        filename: 'main.js'
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: "./src/contribution.json" },
          { from: "./src/assets", to: path.resolve(__dirname, 'dist/cc/assets') }
        ],
      }),
    ], 
  },
  {
    name: 'appe',
    entry: './src/application/appe.behavior.worker.js',
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'dist/cc'),
        filename: 'appe.worker.js'
    },
    optimization: {
      minimize: true,
        minimizer: [new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      })]
    }
  },
  {
    name: 'progge',
    entry: './src/program/progge.behavior.worker.js',
      mode: 'production',
      output: {
      path: path.resolve(__dirname, 'dist/cc'),
        filename: 'progge.worker.js'
    },
    optimization: {
      minimize: true,
        minimizer: [new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      })]
    }
  }
];
