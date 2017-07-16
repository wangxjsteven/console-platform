/**
 * @description 按钮显示隐藏
 * @author 雪进
 * @date "2017-5-13"
 *
 * @param {string} url 地址
 * @param {string} dataType 返回值类型
 * @param {function} success 回调函数，传数据回去
 * @param {function} dataError 回调函数，数据错误
 * @param {function} error 回调函数，请求错误
 * @example
    new Ajax({
        url: path.resolve('/assets/json/app.htm'),
        dataType: 'json',
        success: function(res) {
            callback && callback(null, res);
        },
        dataError: function(code, err) {
            alert(code + "\n" +
                err);
        },
        error: function(code, err, url) {
            alert(code + "\n" +
                url + "\n" +
                err);
        }
    });
    @example end
 */

function Ajax(opt) {
    opt = opt || {};
    opt.method = (opt.method || 'POST').toUpperCase();
    opt.url = opt.url || '';
    opt.async = opt.async || true;
    opt.data = opt.data || null;
    opt.success = opt.success || function() {};

    var xmlHttp = null;
    if (XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest();
    } else {
        xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
    }

    var params = [];
    var postData = makePostData(opt.data);

    if (opt.method.toUpperCase() === 'POST') {
        xmlHttp.open(opt.method, opt.url, opt.async);
        xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
        xmlHttp.send(postData);
    } else if (opt.method.toUpperCase() === 'GET') {
        xmlHttp.open(opt.method, opt.url + '?' + postData, opt.async);
        xmlHttp.send(null);
    }

    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4) {
            if (xmlHttp.status == 200) {
                var res = JSON.parse(xmlHttp.response);
                if (res.code != 0) {
                    opt.dataError && opt.dataError(res.code, res.message);
                    if (res.code === 1003) {
                        if (location.href.indexOf('login.html') === -1) {
                            location.href = 'login.html#/?_z=' + encodeURIComponent(location.hash);
                        }
                    }
                } else {
                    opt.success && opt.success(res.data);
                }
            } else {
                if (xmlHttp.status > 0) {
                    opt.error && opt.error(xmlHttp.responseText);
                    if (xmlHttp.status === 403) {
                        history.back();
                    }
                } else {
                    console.warn("error xmlHttp.status:" + xmlHttp.status)
                }
            }
        }
    };
}

function makePostData(data) {
    var d = data,
        result, params = [];
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

module.exports = Ajax;