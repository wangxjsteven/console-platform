<template>
    <div class="side-bar-cont">
        <div class="sidebar" id="sideBar">
            <ul class="nav nav-sidebar">
                <li class="side-index">
                    <a class=" navbar-blue navbar-brand" href="#"><img class="navbar-logo" src="../../assets/img/logo.png"></a>
                </li>
                <li v-for="(item,index) in list" :class="checkActive(item)">
                    <router-link :to="makePath(item)" v-if="!item.children || !item.children.length" @click="toggle(index, item)">
                        <i class="fa fa-th-list"></i> {{item.label}}
                        <span v-if="item.children && item.children.length">
                <i class="fa fa-angle-down flt-right"></i>
              </span>
                    </router-link>
                    <a class="link-pointer" v-else @click="toggle(index, item)">
                        <i class="fa fa-th-list"></i> {{item.label}}
                        <span v-if="item.children && item.children.length">
                  <i class="fa fa-angle-down flt-right"></i>
              </span>
                    </a>
                    <transition name="slide-fade">
                        <ul class="dashboard-menu nav nav-list" v-if="item.children && item.children.length&&item.expanded">
                            <li class="nav-subitem" v-for="subItem in item.children" v-if="subItem.path">
                                <router-link :to="generatePath(item, subItem)">
                                    {{ subItem.label }}
                                </router-link>
                            </li>
                        </ul>
                    </transition>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import {
    mapGetters,
    mapActions
} from 'vuex';

export default {
    props: ['sideList'],
    data: function() {
        var route = this.$route,
            matched = route.matched;
        var lastMatched = matched[matched.length - 1];
        return {
            list: this.sideList ? this.sideList : [],
            path: this.getNowPath()
        };
    },
    watch: {
        '$route': function(to, from) {
            this.list = this.sideList;
            this.path = this.getNowPath();
        }
    },

    mounted: function() {
        var route = this.$route;
        this.shouldExpandMatchItem(route);
    },

    computed: mapGetters({
        menu: 'menuitems'
    }),

    methods: {
        getNowPath: function() {
            var allPath = this.$route.path.match(/^\/([\w]*)\/([\w]*)(\/|$)/),
                result = '';
            if (allPath && allPath.length > 0) {
                if (allPath.length > 1) {
                    return allPath[2];
                }
            }
            return result;
        },

        makePath: function(item) {
            var route = this.$route;
            let matched = route.matched
            let firstMatched = matched[1]
            return firstMatched.path + '/' + item.path;
        },

        generatePath: function(item, subItem) {
            var route = this.$route;
            let matched = route.matched
            let firstMatched = matched[1]
            return `${firstMatched.path+'/'}${item.component ? item.path + '/' : ''}${subItem.path}`
        },

        checkActive: function(item) {
            return {
                active: this.$route.matched[this.$route.matched.length - 1].path === item.path
            };
        },

        checkExpand: function(item, index) {
            return {
                "in": item.expanded
            };
        },

        toggle: function(index, item) {
            // 必须使用this.$set方法或Vue.set方法，否则无法监控item的变化
            this.$set(item, 'expanded', item.expanded ? false : true)
        },

        shouldExpandMatchItem: function(route) {
            let matched = route.matched
            let lastMatched = matched[matched.length - 1]
            let parent = lastMatched.parent || lastMatched
            const isParent = !!(parent === lastMatched)

            if (!isParent) {
                const p = this.findParentFromMenu(route)
                if (p) {
                    // 必须使用this.$set方法或Vue.set方法，否则无法监控item的变化
                    this.$set(p, 'expanded', true)
                }
            }
        },

        findParentFromMenu(route) {
            const menu = this.list

            for (let i = 0, l = menu.length; i < l; i++) {
                const item = menu[i]
                const k = item.children && item.children.length
                if (k) {
                    for (let j = 0; j < k; j++) {
                        if (item.children[j].name === route.name) {
                            return item
                        }
                    }
                }
            }
        }
    }
}
</script>
<style>
.side-index {
    height: 60px;
    background-color: #4778c7;
}

.navbar-brand {
    width: 250px;
    color: #fff;
    text-align: center;
    line-height: 40px;
}

.nav>.side-index>a:focus,
.nav>.side-index>a:hover {
    color: #fff;
    background-color: #4778c7;
}

.navbar-logo {
    position: absolute;
    left: 0;
    top: 0;
}

.dashboard-menu {
    .nav-subitem a {
        width: 100%;
        height: 100%;
        font-size: 14px;
        text-indent: 40px;
    }
}

.flt-right {
    position: absolute;
    right: 20px;
    line-height: 30px;
}

.link-pointer {
    cursor: pointer;
}

.nav>.nav-subitem>a.router-link-active,
.nav-sidebar>li>a.router-link-active {
    background-color: #e0e1e2;
    color: #5e6069;
}

.nav>.nav-subitem>:ahover,
.nav-sidebar>li>a:hover {
    /*background-color: #efefef;*/
    color: #4778c7;
}


/* 可以设置不同的进入和离开动画 */


/* 设置持续时间和动画函数 */

.slide-fade-enter {
    transition: all .3s ease;
    transform: translateX(10px);
    opacity: 0;
}

.slide-fade-enter-active {
    transition: all .3s ease;
}

.slide-fade-leave {
    opacity: 0;
}

.slide-fade-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    transform: translateX(10px);
    opacity: 0;
}
</style>
