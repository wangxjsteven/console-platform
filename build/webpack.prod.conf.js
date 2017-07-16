var path = require('path');
var utils = require('./utils')
var webpack = require('webpack');
var config = require('../config');
var merge = require('webpack-merge');
var baseWebpackConfig = require('./webpack.base.conf');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
// var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');

var env = process.env.NODE_ENV;

var webpackConfig = merge(baseWebpackConfig, {
    output: {
        filename: 'js/[name].[chunkhash].js',
        chunkFilename: 'js/[name].[chunkhash].js' // 设置require.ensure 文件名
    },
    plugins: [
        // http://vuejs.github.io/vue-loader/en/workflow/production.html
        /*new webpack.DefinePlugin({
            'process.env': env
        }),*/
        /*new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            sourceMap: true
        }),*/
        // extract css into its own file
        /*new ExtractTextPlugin({
            filename: 'css/[name].[contenthash].css'
        }),*/
        // // Compress extracted CSS. We are using this plugin so that possible
        // // duplicated CSS from different components can be deduped.
        // new OptimizeCSSPlugin({
        //     cssProcessorOptions: {
        //         safe: true
        //     }
        // }),
        
        // // copy custom static assets
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, '../src/public/'),
            to: config[env].distPublicRoot,
            ignore: ['.*']
        }])
    ]
});

//构建生成多页面的HtmlWebpackPlugin配置，主要是循环生成
var pages = utils.getMultiEntry('./src/' + config.moduleName + '/**/**/*.html');
for (var pathname in pages) {

    var conf = {
        filename: pathname.substring(6) + '.html',
        template: pages[pathname], // 模板路径
        chunks: [pathname, 'vendor', 'manifest'], // 每个html引用的js模块
        inject: true, // js插入位置
        hash: true,
        cdn: config[env].publicPath,
        minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true
                // more options:
                // https://github.com/kangax/html-minifier#options-quick-reference
        },
        chunksSortMode: 'dependency'
    };

    webpackConfig.plugins.push(new HtmlWebpackPlugin(conf));
}

module.exports = webpackConfig;