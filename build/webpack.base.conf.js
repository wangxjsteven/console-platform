var path = require('path');
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var glob = require('glob');
var entries = utils.getMultiEntry('./src/' + config.moduleName + '/**/**/*.js'); // 获得入口js文件
var chunks = Object.keys(entries);

console.log(chunks)

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    entry: entries,
    output: {
        path: config.dist.distRoot,
        filename: '[name].js',
        publicPath: config[process.env.NODE_ENV].publicPath
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue': 'vue/dist/vue.js',
            '@': resolve('src'),
            'src': path.resolve(__dirname, '../src'),
            'index': path.resolve(__dirname, '../src/pages/index'),
            'assets': path.resolve(__dirname, '../src/assets'),
            'components': path.resolve(__dirname, '../src/components')
        }
    },
    module: {
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        css: ['style-loader', 'css-loader', 'sass-loader'],
                        sass: ['style-loader', 'css-loader', 'sass-loader'],
                    }
                }
            }, {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src')]
            }, {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }, {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            }
            /*{
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            }, {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            }*/
            , {
                test: /\.(gif|png|jpeg|webp|jpg)$/,
                loader: 'file-loader?name=img/[name].[hash].[ext]'
            }, {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file-loader?name=font/font.[hash].[ext]'
            }
        ]
    },
    // .vue文件的配置，以下是为了在.vue文件中把使用css或sass语法的样式提取出来，如果不需要可以忽略
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'manifest']
        })
        // new ExtractTextPlugin('css/[name].css')
        // new ExtractTextPlugin('[name].min.css')
    ]
}