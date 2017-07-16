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
                url: '/newconsole/consoleapi/channel/getChannelByCode',
                method: 'post'
            },
            itemOptions: {
                colCount: 3,
                wrap: false,
                searchItems: [{
                    name: "渠道码",
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
                    name: "新增",
                    icon: "plus",
                    type: "add",
                    btnPower: true
                }]
            },
            tableTitle: {
                colStyle: 'average',
                ordinal: true, //配置序号是否展示
                tits: [{
                    name: "渠道码",
                    id: 'channelCode',
                    type: 'default'
                }, {
                    name: "是否付费",
                    id: 'isPaid',
                    type: 'default'
                }, {
                    name: "平台纬度",
                    id: 'dimension'
                }, {
                    name: "第一级渠道",
                    id: 'channel1'
                }, {
                    name: "第二级渠道",
                    id: 'channel2'
                }, {
                    name: "第三级渠道",
                    id: 'channel3'
                }, {
                    name: "开始时间",
                    id: 'startTime',
                    type: 'date'
                }, {
                    name: "截止时间",
                    id: 'endTime',
                    type: 'date'
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
