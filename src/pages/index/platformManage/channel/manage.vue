<template>
    <div class="container-section col-sm-11 col-md-12 md-list-page" id="containerSection">
        <page-head></page-head>
        <tabs :tabslist="tabListData" :defaultIndex="Number($route.query.tab)||0" @tabClick="tabClick">
            <tab-pane label="渠道管理" :selected="checkTab(0)">
                <channel-manage :beforeroute='beforeroute'></channel-manage>
            </tab-pane>
            <tab-pane label="付费/免费渠道" :selected="checkTab(1)">
                <pay-channel :beforeroute='beforeroute'></pay-channel>
            </tab-pane>
            <tab-pane label="渠道组管理" :selected="checkTab(2)">
                <channel-group :beforeroute='beforeroute'></channel-group>
            </tab-pane>
        </tabs>
    </div>
</template>
<script>
import pageHead from 'components/pageHead';
import tabs from 'components/tabs/tabs';
import tabPane from 'components/tabs/tabpane';
import channelManage from './channelManage.vue';
import payChannel from './payChannel.vue';
import channelGroup from './channelGroup.vue';

export default {
    data: function() {
        return {
            tabListData:[{
                id: 0,
                tabname: "渠道管理",
                actived: true
            }, {
                id: 1,
                tabname: "付费/免费渠道",
                actived: false
            }, {
                id: 2,
                tabname: "渠道组管理",
                actived: false
            }],
            tabId: +this.$route.query.tab || 0,
            beforeroute: 0
        }
    },
    components: {
        pageHead,
        tabs,
        tabPane,
        channelManage,
        payChannel,
        channelGroup
    },
    // beforeRouteEnter: function(to, from, next) {
    //     next(vm => {
    //             vm.beforeroute=Math.random();
    //     })
    // },
    // mounted: function() {
    //     // this.beforeroute = Math.random();
    // },
    watch: {
        '$route': function(from, to) {
            this.beforeroute = Math.random();
        }
    },
    methods: {
        getType: function() {
            let query = this.$route.query;
            return query.type || 'list';
        },
        checkTab: function(id) {
            return id == this.tabId;
        },
        checkType: function(type) {
            if (type === this.content) {
                return true;
            }
            return false;
        },
        tabClick: function(type) {
            if (type === this.content) {
                return true;
            }
            return false;
        }
    }
}
</script>
