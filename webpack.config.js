const webpack = require('webpack')
const path = require('path')
const config = require('config')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const ProgressPlugin = require('progress-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

const isDev = process.env.NODE_ENV === 'development'
const sourceMap = isDev

const webpackConfig = {
  mode: isDev ? 'development' : 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].[contenthash].js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '/'
            }
          },
          {
            loader: 'css-loader',
            options: {
              url: false,
              sourceMap
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap
            }
          },
          {
            loader: 'resolve-url-loader',
            options: {
              sourceMap
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        use: 'file-loader'
      },
      {
        test: /\.(gif|png|jpe?g)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'images',
              name: '[name].[ext]',
              publicPath: '/images'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              disable: true,
              bypassOnDebug: true,
              gifsicle: {
                interlaced: false
              },
              optipng: {
                optimizationLevel: 7
              },
              pngquant: {
                speed: 4
              },
              mozjpeg: {
                progressive: true
              }
            }
          }
        ]
      },
    ]
  },
  resolve: {
    extensions: [
      '.js',
      '.jsx',
      '.png',
      '.svg'
    ],
    alias: {
      '@': path.resolve(path.resolve(__dirname, './'), 'src')
    }
  },
  devServer: {
    historyApiFallback: true,
    hot: true
  },
  plugins: [
    new NodePolyfillPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new ProgressPlugin(true),
    new webpack.DefinePlugin({ CONFIG: JSON.stringify(config) }),
    new FaviconsWebpackPlugin({
      logo: path.join(path.resolve(__dirname, './'), '/src/assets/images/favicon.png'),
      prefix: 'images/favicons/',
      favicons: {
        appName: 'Fuse Staking',
        appDescription: 'Fuse Staking DApp',
        developerName: 'Lior Agnin',
        icons: {
          android: true,
          appleIcon: true,
          appleStartup: false,
          coast: false,
          favicons: true,
          firefox: false,
          windows: false,
          yandex: false
        }
      }
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false
    }),
    new MiniCssExtractPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      appMountId: 'app',
      filename: 'index.html',
      template: path.join(__dirname, 'src', 'index.html'),
      publicPath: '/'
    })
  ],
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        },
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  }
}

module.exports = (env, argv) => {
  if (argv.hot) {
    webpackConfig.output.filename = '[name].[fullhash].js';
  }

  return webpackConfig;
};