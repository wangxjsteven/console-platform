<style>
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
    width: 50px;
    height: 60px;
    margin: 0 auto;
    background: none;
    border: none;
    text-align: center;
    outline-style: none;
}
</style>
<template>
    <!-- Fixed navbar -->
    <nav class="navbar navbar-blue navbar-fixed-top" id="navBar">
        <div class="container-bar">
            <div class="navbar-header">
                <!-- <button type="button" id="sideBar" class="sidebar-toggle" @click="toggleSide" data-collapse='false'> -->
                <button type="button" class="sidebar-toggle" @click="toggleSide">
                    <i class="fa fa-align-left"></i>
                </button>
            </div>
            <div id="navbar" class="navbar-collapse collapse">
                <ul class="nav navbar-nav navbar-left">
                    <li v-for='item in navList' :class='checkActive(item.path,item)'>
                        <router-link :to="makePath(item)">{{item.label}}</router-link>
                    </li>
                </ul>
                <ul class="nav navbar-nav navbar-right">
                    <li>
                        <a href="login.html#/" @click='logout'>退出登录</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>
<script>
var Ajax = require('../../assets/js/ajax.js');
module.exports = {
    props: ['rList'],
    data: function() {
        var item = this.getCurMenu();
        return {
            path: item.path,
            navList: this.rList,
            closeCollapse: false//展开侧边栏
        };
    },
    watch: {
        '$route': function(to, from) {
            var item = this.getCurMenu();
            if (item) {
                this.path = item.path;
            }
        }
    },
    methods: {
        toggleSide: function() {
            let con = document.getElementById("containerSection"),//右边主体内容
                nav = document.getElementById("navBar"),
                side = document.getElementById("sideBar");
            if (this.closeCollapse) {
                this.closeCollapse = false;
                side.style.display = 'block';
                nav.style.marginLeft = "250px";
                if (con) {
                    con.style.marginLeft = "250px";
                }
            } else {
                this.closeCollapse = true;
                side.style.display = 'none';
                nav.style.marginLeft = "0px";
                if (con) {
                    con.style.marginLeft = "0px";
                }
            }
        },
        getCurMenu: function() {
            let route = this.$route;
            let matched = route.matched
            let firstMenu = matched[1] || this.navList[0];
            this.$emit('showSide', firstMenu ? firstMenu.children : []);
            return firstMenu;
        },

        makePath: function(item) {
            return '/' + item.path + '/';
        },

        checkActive: function(id, opt) {
            return {
                active: this.path.indexOf(id) > -1
            };
        },
        logout: function() {
            new Ajax({
                url: '/newconsole/consoleapi/logout',
                type: 'GET',
                async: false,
                success: function(res) {
                    location.href = '#/login';
                },
                dataError: function(code, error) {
                    alert(code + '/n' + error);
                },
                error: function(code, error) {
                    alert(code + '/n' + error);
                }
            });
        }
    }
}
</script>
