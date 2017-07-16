process.env.NODE_ENV = 'dev';

var webpack = require("webpack"),
    express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    webpackMiddleware = require('webpack-dev-middleware-nfd'),
    WebpackHotMiddleware = require('webpack-hot-middleware'),

    webpackConfig = require("./webpack.dev.conf.js"),
    config = require("../config/index"),
    nodeConfig = require('./node-dev/config');

global.rootPath = path.resolve(__dirname, '..');
nodeConfig.port = config.dev.port;

var handler = require("./node-dev/router/handler");
var app = express();
var compiler = webpack(webpackConfig);


app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: false
}));


// app.all('/assets/json/$1', function(req, res) {
//     var data = {
//         "data": "false",
//         "evencheck": "phone"
//     };
//     res.send(data);
// });

app.use('/public', express.static(config.dev.publicDirectory));

app.use(webpackMiddleware(compiler, {
    // publicPath is required, whereas all other options are optional

    noInfo: false,
    // display no info to console (only warnings and errors)

    quiet: false,
    // display nothing to the console

    lazy: false,
    // switch into lazy mode
    // that means no watching, but recompilation on every request

    watchOptions: {
        aggregateTimeout: 300,
        poll: true
    },
    // watch options (only lazy: false)

    publicPath: config.dev.assetsPublicPath,
    // public path to bind the middleware to
    // use the same as in webpack

    index: "index.html",
    // the index path for web server

    headers: {
        "X-Custom-Header": "yes"
    },
    // custom headers

    stats: {
        colors: true
    },
    // options for formating the statistics

    reporter: null,
    // Provide a custom reporter to change the way how logs are shown.

    serverSideRender: true,
    // Turn off the server-side rendering mode. See Server-Side Rendering part for more info.
}));

handler(app);

app.use(WebpackHotMiddleware(compiler, {
    log: console.log
}));





app.listen(config.dev.port, function() {
    console.log("Starting server on http://localhost:" + config.dev.port);
});