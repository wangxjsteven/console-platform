<style>
.main-section {
    color: green;
}
</style>
<template>
    <div>
        <table-page :tableDB='tableDB' :itemOptions='itemOptions' :tableTitle='tableTitle'></table-page>
    </div>
</template>
<script>
import pageHead from 'components/pageHead';
import tablePage from 'components/tablePage/tablePage.vue'
module.exports = {
    data: function() {
        return {
            tableDB: {
                url: '/newconsole/consoleapi/channel/getChannelGroups',
                method: 'post'
            },
            itemOptions: {
                colCount: 3,
                wrap: false,
                searchItems: [{
                    name: "渠道组名称",
                    id: 'channelCode',
                    type: 'text',
                    value: ''
                }],
                buttons: [{
                    name: "搜 索",
                    icon: "search",
                    type: "search",
                    btnPower: true
                },{
                    name: "导 出",
                    icon: "sign-out",
                    type: "export",
                    btnPower: true
                },{
                    name: "新 增",
                    icon: "plus",
                    type: "add",
                    btnPower: true
                }]
            },
            tableTitle: {
                colStyle: 'average',
                ordinal: true, //配置序号是否展示
                tits: [{
                    name: "渠道组号",
                    id: 'channelCode',
                    type: 'default'
                }, {
                    name: "渠道组名称",
                    id: 'isPaid',
                    type: 'default'
                }, {
                    name: "渠道个数",
                    id: 'dimension'
                }, {
                    name: "备注",
                    id: 'channel1'
                }, {
                    name: "第二级渠道",
                    id: 'channel2'
                },{
                    name: "操作",
                    id: 'options',
                    type: 'multbtn',
                    filed: '__buttonsState',
                    stateName: 'productStatus',
                    idName: 'productId',
                    allBtn: [{
                        name: 'view',
                        btnPower: 'select'
                    }, {
                        name: '增加渠道',
                        btnPower: 'select'
                    }]
                }]
            },
            date: ''
        }
    },
    methods: {
        show: function() {
            return false;
        }
    },
    components: {
        pageHead,
        tablePage
    }
}
</script>
