var path = require('path')

module.exports = {
    moduleName: 'pages',

    dev: {
        env: 'dev',
        port: 5000,
        publicPath: '/',
        publicDirectory: './src/public'

    /*    assetsSubDirectory: './src/public',
        assetsPublicPath: '/',
        proxyTable: {},*/

        // cssSourceMap: false
    },
    test: {
        env: 'test',
        port: 5000,
        publicPath: '//test.static.lcfarm.com/console-dist/',
        // publicPath: '/console-dist/',

        distRoot: path.resolve(__dirname, '../../console-dist'),
        distPublicRoot: path.resolve(__dirname, '../../console-dist/public'),

    },
    dist: {
        env: 'dist',
        publicPath: '//static.lcfarm.com/console-dist/',
        // publicPath: '/console-dist/',

        distRoot: path.resolve(__dirname, '../../console-dist'),
        distPublicRoot: path.resolve(__dirname, '../../console-dist/public'),

        productionSourceMap: true,

        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
    }
}