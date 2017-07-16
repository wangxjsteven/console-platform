<template>
    <div class="container-section col-sm-11 col-md-12 product-edit-section" id="containerSection">
        <page-head pTitle='业务管理&nbsp;&nbsp;>&nbsp;&nbsp;产品管理>&nbsp;&nbsp;查看理财计划'></page-head>
        <tabs :tabslist="tabListData" :defaultIndex="0" @tabClick="tabClick">
            <tab-pane label="基础信息" selected>
                <info type='check' @reStatus='setStatus'></info>
            </tab-pane>
            <tab-pane label="债权详情">
                <debts type='check'></debts>
            </tab-pane>
            <tab-pane label="投标记录" v-if='productStatus'>
                <record urltype='invest'></record>
            </tab-pane>
            <tab-pane label="还款计划" v-if='productStatus'>
                <record urltype='repay'></record>
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
import record from './check/investRecord.vue';

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
            }],
            productStatus: false
        }
    },
    components: {
        info,
        debts,
        record,
        pageHead,
        tabs,
        tabPane
    },
    methods: {
        setStatus: function(state) {
            if (state === 'YJQ' || state === 'HKZ') {
                this.productStatus = true;
                this.tabListData = this.tabListData.concat([{
                    id: 2,
                    tabname: "投标记录",
                    actived: false
                }, {
                    id: 3,
                    tabname: "还款计划",
                    actived: false
                }]);
            }
        },
        tabClick: function(id) {

        }
    }
}
</script>
<style lang="sass">
.settlementMethod {
    margin: 10px 0 20px;
}
</style>
