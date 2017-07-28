var path = require('path');

module.exports = {

    //设为1时：自动拷贝cgi数据到本地。必要条件： localCgi = 0
    //设为0时：不拷贝cgi数据
    copyDataToLocal: 0,

    //localdata 本地数据
    //serverdata 服务器数据
    //mockjs 本地 mockjs
    mode: 'localdata',
    env: 'dev',


    //指定测试环境数据
    //必要条件：localCgi = 0 && localVmData = 0
    hosts: [{
        ip: '10.1.10.57',
        selected: 0,
        desc: '测试环境57',
        label: '.57',
        proxyPort: {
            pc: 8080,
            h5: 8081,
            console: 8080
        }
    }, {
        ip: '192.168.1.5',
        selected: 1,
        desc: '测试环境5',
        label: '.5',
        proxyPort: {
            pc: 8080,
            h5: 8081,
            console: 8002
        }
    }, {
        ip: '10.1.60.20',
        selected: 0,
        desc: '测试环境20',
        label: '.20',
        proxyPort: {
            pc: 8080,
            h5: 8081,
            console: 8002
        }
    }, {
        ip: '',
        selected: 0,
        desc: '现网',
        label: '现网',
        proxyPort: {
            pc: 80,
            h5: 80
        }
    }],

    ignoreList: [],

    port: 80
};