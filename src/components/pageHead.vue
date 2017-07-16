<template>
    <div class="page-head-box">
        <div class="page-head">&nbsp;</div>
        <div class="page-head page-head--fix" v-html="title"></div>
        <hr>
    </div>
</template>
<script>
import {
    mapGetters,
    mapActions
} from 'vuex';
export default {
    props: [
        'p-title'
    ],
    data: function() {
        return {
            'title': ''
        }
    },

    watch: {
        '$route': function(from, to) {
            var route = this.$route;
            this.title = this.makeTitle(route);
        }
    },

    mounted: function() {
        var route = this.$route;
        this.title = this.makeTitle(route);
    },

    computed: mapGetters({
        menu: 'menuitems'
    }),

    methods: {
        makeTitle: function(route) {
            if (this.pTitle) {
                return this.pTitle;
            }
            var matched = route.matched;
            var lastMatched = matched[matched.length - 1];
            var path = lastMatched.path || '';
            var plist = path.substring(1).split('/');
            var menu = this.menu;
            var result = [],
                count = 0;

            function check(list) {
                var target = plist[count];
                for (var i = list.length - 1; i >= 0; i--) {
                    var item = list[i];
                    if (item.path === target) {
                        result.push(item.label);
                        ++count;
                        item && item.children && item.children.length > 0 && check(item.children);
                        break;
                    }
                }
            }
            check(menu[0].children, plist);
            return result.join(' > ')
        }
    }
}
</script>
<style>
.page-head-box {
    position: relative;
    .page-head {
        position: relative;
        padding: 10px 10px 0 0;
    }
    .page-head--fix {
        position: absolute;
        top: 0;
    }
}
</style>
