const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const commonConfig = {
  devtool: 'eval-cheap-module-source-map',
  resolve: {
    extensions: ["*", ".js", ".jsx"],
    alias: {
      '@ml': path.resolve(__dirname, 'src'),
      '@public': path.resolve(__dirname, 'public'),
      'UI': path.resolve(__dirname, 'src/UI/Components'),
      '@components': path.resolve(__dirname, 'src/UI/Components')
    }
  },
  output: {
    filename: "[name].js",
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          outputPath: 'assets/images',
          publicPath: 'images',
        }
      },
    ]
  },
  performance: {
    maxAssetSize: 300000,
    maxEntrypointSize: 10500000
  }
};

const firstConfigOnly = {
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'public', 'datasets'),
          to: path.resolve(__dirname, 'dist', 'assets', 'datasets'),
        },
      ],
    }),

    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: './index.html'
    })
  ],
};

const externalConfig = {
  externals: {
    lodash: 'lodash',
    radium: 'radium',
    react: 'react',
    'react-dom': 'react-dom'
  }
};

const defaultConfig = [
  {
    entry: {
      assetPath: './src/assetPath.js'
    },
    ...commonConfig,
    ...firstConfigOnly,
    ...externalConfig
  },
  {
    entry: {
      mainDev: './src/indexProd.js'
    },
    ...commonConfig
  }
];

const productionConfig = [
  {
    entry: {
      main: './src/indexProd.js'
    },
    ...commonConfig,
    ...externalConfig
  }
];

module.exports = (env, argv) => {
  if (argv.mode === 'production') {
    return [...defaultConfig, ...productionConfig];
  }

  return defaultConfig;
};