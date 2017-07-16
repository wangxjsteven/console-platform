<style>
.main-section {
    color: green;
}
</style>
<template>
    <div class="container-section col-sm-11 col-md-12" id="containerSection">
        <page-head></page-head>
        <table-page :tableDB='tableDB' :itemOptions='itemOptions' :tableTitle='tableTitle'></table-page>
    </div>
</template>
<script>
import pageHead from '@/components/pageHead';
import tablePage from '@/components/tablePage/tablePage.vue'
module.exports = {
    data: function() {
        return {
            tableDB: {
                url: '/newconsole/consoleapi/financePlanList',
                method: 'post'
            },
            itemOptions: {
                wrap: false,
                searchItems: [{
                    name: "自选时间",
                    id: 'endTime',
                    type: 'text',
                    value: '2017',
                    limit: null
                }],
                buttons: [{
                    name: "搜 索",
                    icon: "search",
                    type: "search",
                    btnPower: "search"
                }]
            },
            tableTitle: {
                ordinal: true, //配置序号是否展示
                tits: [{
                    name: "操作",
                    id: 'options',
                    type: 'multbtn',
                    filed: '__buttonsState',
                    allBtn: [{
                        name: 'view',
                        btnPower: 'select'
                    }, {
                        name: 'check',
                        btnPower: 'check'
                    }, {
                        name: 'edit',
                        btnPower: 'edit'
                    }, {
                        name: 'release',
                        btnPower: 'release'
                    }, {
                        name: 'prerelease',
                        btnPower: 'prerelease'
                    }, {
                        name: 'nouse',
                        btnPower: 'delete'
                    }],
                    buttons: {
                        'SQZ': ['view', 'edit', 'nouse'],
                        'DSH': ['view', 'check', 'nouse'],
                        'DFB': ['view', 'release', 'prerelease', 'nouse'],
                        'YFB': ['view', 'release', 'prerelease', 'nouse'],
                        'MJZ': ['view', 'nouse'],
                        'OTHER': ['view']
                    }
                }, {
                    name: "展示/隐藏",
                    id: 'showState',
                    type: 'zszt', //特殊处理，后台下发的按钮
                    filed: '__buttons',
                    buttons: ['']
                }, {
                    name: "产品状态",
                    id: 'productStatus',
                    type: 'default'
                }, {
                    name: "展示区域",
                    id: 'investType',
                    type: 'default'
                }, {
                    name: "产品标题",
                    id: 'productName'
                }, {
                    name: "募集金额",
                    id: 'totalAmount'
                }, {
                    name: "投资金额",
                    id: 'surplusAmount'
                }, {
                    name: "起息日期",
                    id: 'carryInterestDate',
                    type: 'date'
                }, {
                    name: "到期日期",
                    id: 'endDate',
                    type: 'date'
                }, {
                    name: "投资年利率",
                    id: 'annualRate',
                    type: 'rate'
                }, {
                    name: "加息利率",
                    id: 'riseRate',
                    type: 'rate'
                }, {
                    name: "单笔限额",
                    id: 'default'
                }, {
                    name: "建立时间",
                    id: 'createTime',
                    type: 'date'
                }, {
                    name: "发布时间",
                    id: 'releaseTime',
                    type: 'date'
                }, {
                    name: "站岗资金",
                    id: 'sentryAmount'
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
