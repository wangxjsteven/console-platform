var utils = require('./utils')
var webpack = require('webpack');
var config = require('../config');
var merge = require('webpack-merge');
var baseWebpackConfig = require('./webpack.base.conf');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

var plugins = [
    /*new webpack.DefinePlugin({
        'process.env': config.dev.env
    }),*/
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsPlugin()
];

var env = process.env.NODE_ENV;

var pages = utils.getMultiEntry('./src/' + config.moduleName + '/**/**/*.html');
// console.log(pages);
for (var pathname in pages) {
    // 配置生成的html文件，定义路径等
    var conf = {
        filename: pathname.substring(6) + '.html',
        template: pages[pathname], // 模板路径
        chunks: [pathname, 'vendor', 'manifest'], // 每个html引用的js模块
        cdn: config[env].publicPath,
        inject: true // js插入位置
    };
    // 需要生成几个html文件，就配置几个HtmlWebpackPlugin对象
    plugins.push(new HtmlWebpackPlugin(conf));
}

// console.log(plugins);
module.exports = merge(baseWebpackConfig, {
    plugins: plugins
});