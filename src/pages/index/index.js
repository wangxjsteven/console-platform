import 'assets/fonts/css/font-awesome.min.css';
import 'assets/css/main.scss';

import Vue from 'vue';

import axios from 'axios';
import VueAxios from 'vue-axios'
import {
    sync
} from 'vuex-router-sync'
import vueClip from 'vue-clip'
import VueRouter from 'vue-router';
// import VueValidator from 'vue-validator'
Vue.use(VueRouter);
Vue.use(vueClip);
// Vue.use(VueValidator);
Vue.use(VueAxios, axios);

import store from '../../store'

// Enable devtools
Vue.config.devtools = true

import AjaxIn from 'assets/js/ajax_in.js';
import ButtonLimit from 'assets/js/button_limit.js';
import createMenu from 'assets/js/createMenu.js';

Vue.use(AjaxIn);
Vue.use(ButtonLimit);

// 模态框组件
import Vodal from 'vodal';
Vue.component(Vodal.name, Vodal);

function getMenu(callback) {
    axios({
        url: '/newconsole/consoleapi/user/menus',
        dataType: 'json',
        method: 'get'
    }).then(function(res) {
        if (res.data.code) {
            let code = res.data.code;
            switch (code) {
                case 1003:
                    location.href = 'login.html#/?_z=' + encodeURIComponent(location.hash);
                    break;
                default:
                    alert(res.data.message);
                    // callback && callback(res.data.code, res.data.message);
            }
        } else {
            callback && callback(res.data.code, res.data.data);
        }
    }).catch(function(error) {
        alert(error.message);
    });
}

getMenu(function(err, res) {
    if (err) {
        return;
    }
    // 初始化路由数据
    var list = res.resources;
    //根据菜单json生成index路由对象
    var indexMenu = createMenu(list, 'pages/index');

    var routes = [{
        "path": "/",
        "component": require("./index.vue"),
        "children": indexMenu
    }];

    // 初始化路由
    var router = new VueRouter({
        // mode: 'history',
        routes: routes
    });

    // 把全部菜单赋值给vux state
    store.state.menu.items = routes;

    // 同步router和vuex状态
    sync(store, router)

    // 初始化vue
    var app = new Vue({
        el: "#app",
        data: {
            list: list
        },
        mounted: function() {
            // console.log(this.$store.state.menu.items);
        },
        store,
        router
    });
})