<style lang='sass'>
.login {
    .login-section {
        width: 320px;
        margin: 240px auto;
    }
    .form-horizontal{
        .control-label{
            text-align-last: justify;
        }
    }
    .navbar-blue {
        background-color: #4778c7;
    }
    .navbar-blue li a:hover,
    .navbar-blue li a:hover {
        background-color: #5285d7;
    }
    .navbar-blue .navbar-nav {
        color: #fff;
    }
    .navbar-blue .navbar-nav>li>a {
        color: #fff;
        min-width: 94px;
        text-align: center;
    }
    .navbar-blue .navbar-nav>li>a:focus,
    .navbar-nav>li>a:hover {
        background: #5285d7
    }
    .navbar-blue .navbar-nav>li.active>a {
        background: #5d91e5
    }
    .navbar-blue .navbar-brand {
        color: #fff;
    }
    .container-bar {
        padding-left: 0;
    }
    .fa-align-left {
        position: relative;
        top: 1px;
        color: #fff;
        font-size: 22px;
    }
    .sidebar-toggle {
        height: 60px;
        margin: 0 auto;
        background: none;
        border: none;
        text-align: center;
        outline-style: none;
    }
    .navbar-fixed-top {
        margin: 0;
    }
    .verify-code{
        margin-top: -5px;
        img{
            margin-left: -10px;
        }
    }
}
</style>
<template>
    <div class="login">
        <nav class="navbar navbar-blue navbar-fixed-top" id="navBar">
            <div class="container-bar">
                <div class="navbar-header">
                    <button type="button" class="sidebar-toggle" data-collapse='false'>
                        <a class="navbar-brand" href="#">理财农场后台管理系统</a>
                    </button>
                </div>
                <div id="navbar" class="navbar-collapse collapse">
                </div>
            </div>
        </nav>
        <form class="form-horizontal login-section">
            <div class="form-group">
                <label class="col-sm-3 control-label">用户名</label>
                <div class="col-sm-9">
                    <input v-model="username" type="text" name="user" class="form-control" placeholder="请输入用户名">
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-3 control-label">密码</label>
                <div class="col-sm-9">
                    <input v-model="password" type="password" name="password" class="form-control" placeholder="请输入密码">
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-3 control-label">验证码</label>
                <div class="col-sm-5">
                    <input v-model="validateCode" @keyup.enter='submit' type="text" name="validateCode" class="form-control" placeholder="请输入验证码">
                </div>
                <div class="verify-code">
                    <img :src="vali" @click="refreshVali">
                </div>
            </div>
            <div class="form-group">
                <div class="col-sm-offset-3 col-sm-9">
                    <button v-on:click="submit" type="button" class="col-sm-12 btn btn-primary js-btn-login">登陆</button>
                </div>
            </div>
        </form>
        <model :show="dialog.show" :message="dialog.message" @hide='hideModel'>
        </model>
    </div>
</template>
<script>
import axios from 'axios';
import model from 'components/model/model.vue';

import Md5 from '../../assets/js/md5.js';

module.exports = {
    data: function() {
        return {
            dialog: {
                show: false,
                message: ''
            },
            username: '',
            password: '',
            validateCode: '',
            vali: '/newconsole/consoleapi/validateCode/code'
        }
    },
    watch: {
        "$route": function() {
            window.location.reload();
        }
    },
    components: {
        model
    },
    methods: {
        hideModel: function() {
            this.dialog.show = false;
            this.dialog.message = '';
        },
        showModel: function(msg) {
            this.dialog.show = true;
            this.dialog.message = msg;
        },
        refreshVali: function() {
            this.vali = '/newconsole/consoleapi/validateCode/code?' + (new Date()).getTime();
        },
        submit: function() {
            var self = this,
                route = this.$route;
            if (!(this.username && this.password && this.validateCode)) {
                alert('请输入完整登录信息');
                return;
            }
            axios({
                url: '/newconsole/consoleapi/login',
                method: 'post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                },
                requestType:'form',
                transformRequest: [function(data) {
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
                }],
                data: {
                    userName: this.username,
                    password: Md5.hex_md5(this.password),
                    validateCode: this.validateCode
                }
            }).then(function(response) {
                var data = response.data;
                if (data.code === 0) {
                    var target = '';
                    if (route.query._z) {
                        target = route.query._z;
                    } else {
                        target = '#/';
                    }
                    location.href = "index.html"+target;
                } else {
                    self.showModel(data.message);
                }
            }).catch(function(error) {
                self.showModel(error.message);
            });
        }
    }
}
</script>
