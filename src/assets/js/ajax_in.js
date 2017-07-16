/**
 * @description 按钮显示隐藏
 * @author 雪进
 * @date "2017-6-8"
 *
 * @param {object} data ajax发送数据
 * @param {string} url 地址
 * @param {string} method get or post
 * @example
 *      var ajax = require('components/js/ajax.js');
 *      Vue.use(ajax);
 *      vue组件中直接使用this.$ajax
 *      this.$ajax({
                url: '/newconsole/consoleapi/user/roles',
                method: 'post',
                requestType:'json',//默认提交类型是application/x-www-form-urlencoded;charset=utf-8，需要与后台约定
                data: {
                    pageNo: pageNo,
                    pageSize: pageSize,
                    filter:{name:'a',value:'b',time:'2017-06-10'}
                }
            }).then(
                function(res) {
                    var data = res.data;
                    that.backupResult = that.userlist = data.data;
                    that.pageall = data.pages;
                    that.pagecur = data.pageNum;
                    if (data.pages > 1) {
                        addcomponent && require(['@/components/pagination.vue'], resolve);
                    }
                }
            );
 */

var ajax = {
    install: function(Vue, opts) {

        // 注入组件
        Vue.mixin({
            created: function() {
                var self = this;
                this.$ajax = function(opts) {
                    var promise = new Promise(function(resolve, reject) {
                        var config = Object.assign({}, {
                            transformRequest: [function(data) {
                                if (opts.requestType === 'form') {
                                    var d = data,
                                        result = data,
                                        params = [];
                                    for (var key in d) {
                                        if (typeof d[key] === 'object') {
                                            params.push(key + '=' + JSON.stringify(d[key]));
                                        } else {
                                            params.push(key + '=' + d[key]);
                                        }
                                    }

                                    result = params.join('&');
                                    return result;
                                }
                                return JSON.stringify(data);
                            }],
                            params: opts.method === 'get' || opts.type === 'get' ? opts.data : null,
                            method: opts.method || opts.type,
                            responseType: 'json',
                            headers: opts.requestType !== 'form' ? {
                                'x-console-json': 'true',
                                'Content-Type': 'application/json'
                            } : {
                                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                            }
                        }, opts);
                        self.axios(config).then(function(response) {
                            var data = response.data,
                                code = data.code;

                            switch (code) {
                                case 0:
                                    resolve(data)
                                    break;
                                case 1003:
                                    if (location.href.indexOf('login.html') === -1) {
                                        location.href = 'login.html#/?_z=' + encodeURIComponent(location.hash);
                                    }
                                    break;
                                default:
                                    self.$store.commit('TOGGLE_DIALOG', {
                                        message: data.message
                                    });
                                    resolve(code, data);
                            }
                        }).catch(function(error) {
                            if (error.response) {
                                var status = error.response.status;
                                switch (status) {
                                    case 403:
                                        // reject && reject(status, error.message);
                                        history.back();
                                        break;
                                    default:
                                        reject && reject(status, error.message);
                                }
                            } else {
                                reject(error);
                            }
                        });
                    })
                    return promise;
                }
            }
        });
    }
};

module.exports = ajax;