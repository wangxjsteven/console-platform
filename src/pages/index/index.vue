<style>
.md-index {
    position: relative;
    width: 100%;
}
</style>
<template>
    <div class="md-index">
        <nav-bar :r-list="routeList" @show-side="refreshSide"></nav-bar>
        <side-bar :side-list="sideList"></side-bar>
        <keep-alive>
            <transition mode="out-in" enter-active-class="fadeIn" leave-active-class="fadeOut" appear>
                <router-view :side-list="sideList"></router-view>
            </transition>
        </keep-alive>
        <model :show="dialog.show"
            :title="dialog.title"
            :message="dialog.message"
            :html="dialog.html"
            :type="dialog.type"
            :hidetime="dialog.hidetime"
            :autohide="dialog.autohide"
            @hide='hideDialog'>
            <!-- <div class="header">{{dialog.title}}</div>
            <div class="body">{{dialog.message}}</div>
            <button class="vodal-confirm-btn" @click="dialog.ok">确定</button>
            <button class="vodal-cancel-btn" @click="dialog.cancel">取消</button> -->
        </model>
    </div>
</template>
<script>
import {
    mapState,
    mapGetters,
    mapActions
} from 'vuex';
import NavBar from './nav_bar.vue';
import SideBar from './side_bar.vue';
import model from 'components/model/model.vue';

export default {
    props: ['appList'],
    data: function() {
        var item = this.getCurMenu();
        return {
            routeList: this.appList,
            sideList: item.children
        };
    },
    components: {
        model,
        NavBar,
        SideBar
    },
    watch: {
        '$route': function(to, from) {
            var item = this.getCurMenu();
            this.sideList = item.children;
        }
    },

    // mounted: function() {
    //     console.log(this)
    //     this.showDialog({
    //         show: true,
    //         message: '12312'
    //     })
    // },

    computed: {
        // mapState({
        //     dialog: state => state.app.dialog,
        //     menu: state => state.menu.items,
        //     dialogState(state) {
        //         return state.app.dialog
        //     }
        // }),
        ...mapGetters([
            "dialog",
            "menu"
        ])
    },

    methods: {
        ...mapActions([
            "showDialog",
            "hideDialog"
        ]),
        getCurMenu: function() {
            let route = this.$route;
            let matched = route.matched
            let firstMenu = matched[1] || this.navList[0];
            const menu = this.appList

            for (let i = 0, l = menu.length; i < l; i++) {
                const item = menu[i]
                if (item.name === firstMenu.name) {
                    return item
                }
            }
        },
        refreshSide: function(list) {
            this.sideList = list;
        }
    }
}
</script>
