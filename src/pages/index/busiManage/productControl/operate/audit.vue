<template>
    <div class="container-section col-sm-11 col-md-12 product-edit-section" id="containerSection">
        <page-head pTitle='业务管理&nbsp;&nbsp;>&nbsp;&nbsp;产品管理>&nbsp;&nbsp;审核理财计划'></page-head>
        <tabs :tabslist="tabListData" :defaultIndex="0" @tabClick="tabClick">
            <tab-pane label="基础信息" selected>
                <info></info>
            </tab-pane>
            <tab-pane label="债权详情">
                <debts></debts>
            </tab-pane>
        </tabs>
    </div>
</template>
<script>
import pageHead from '@/components/pageHead';
import tabs from '@/components/tabs/tabs';
import tabPane from '@/components/tabs/tabpane';
import info from './audit/info.vue';
import debts from './audit/debtsDetail.vue';

var that = null,
    firstComponent = 0;
export default {
    data: function() {
        that = this;
        return {
            tabListData: [{
                id: 0,
                tabname: "基础信息",
                actived: true
            }, {
                id: 1,
                tabname: "债权详情",
                actived: false
            }]
        }
    },
    components: {
        info,
        debts,
        pageHead,
        tabs,
        tabPane
    },
    methods: {
        changeTab: function(id, page) {
            let curPage = page || 1
            switch (id) {
                case 0:
                    break;
                case 1:
                    break;
                case 2:
                    break;
                default:
                    break;
            }
        },
        tabClick: function(id) {
            this.changeTab(id, 1);
            return id
        }
    }
}
</script>
<style lang="sass">
.settlementMethod {
    margin: 10px 0 20px;
}
</style>
