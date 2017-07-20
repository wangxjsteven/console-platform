<style>
.main-section {
    color: green;
}
</style>
<template>
    <div>
        <table-page :tableDB='tableDB' :itemOptions='itemOptions' :tableTitle='tableTitle' @itemEvent='itemEvent' @tabelEvent='tableHandle'></table-page>
    </div>
</template>
<script>
import pageHead from 'components/pageHead';
import tablePage from 'components/tablePage/tablePage.vue'
module.exports = {
    data: function() {
        props: ['groupId']
        return {
            tableDB: {
                url: '/newconsole/consoleapi/channel/getChannelGroupsInfo',
                method: 'post'
            },
            itemOptions: {
                colCount: 3,
                wrap: true,
                searchItems: [{
                    name: "渠道码",
                    id: 'channelCode',
                    type: 'text',
                    value: ''
                }, {
                    name: "平台纬度",
                    id: 'dimension',
                    type: 'select',
                    option: [{
                        text: '全部',
                        value: ''
                    }, {
                        text: 'APP',
                        value: 'APP'
                    }, {
                        text: 'H5',
                        value: 'H5'
                    }, {
                        text: 'PC',
                        value: 'PC'
                    }, {
                        text: 'OTHER',
                        value: 'OTHER'
                    }],
                    value: ''
                }, {
                    name: "是否付费",
                    id: 'isPaid',
                    type: 'select',
                    option: [{
                        text: '全部',
                        value: ''
                    }, {
                        text: '是',
                        value: 'S'
                    }, {
                        text: '否',
                        value: 'F'
                    }],
                    value: ''
                }],
                buttons: [{
                    name: "搜 索",
                    icon: "search",
                    type: "search",
                    btnPower: true
                },{
                    name: "返 回",
                    icon: "rotate-left",
                    type: "view",
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
                }]
            },
            channels: [],
            channelOption: {}
        }
    },
    watch: {
        groupId: function() {
            // this.getChannels();
        }
    },
    mounted: function() {
        // this.getChannels();
    },
    methods: {
        itemEvent: function(opts) {
            switch (opts.type) {
                case 'view':
                    this.back();
                    break;
            }
        },
        uploadEvent: function(opts) {
        },
        tableHandle: function(opts) {
            switch (opts.type) {
                case 'multiple-selected':
                    this.channelSelect(opts.value);
                    break;
                case 'export':
                    this.downloadList(opts.value);
                    break;
            }
        },
        back: function(opts) {
            this.$emit('detailEvent')
        }
    },
    components: {
        pageHead,
        tablePage
    }
}
</script>