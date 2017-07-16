var env = process.env.NODE_ENV = process.argv[2];

var Webpack = require('webpack');
var config = require('../config');
var webpackConfig = require('./webpack.prod.conf');

Webpack(webpackConfig,function(err,stats){
	stats.toString({ chunks: false, color: true });
});