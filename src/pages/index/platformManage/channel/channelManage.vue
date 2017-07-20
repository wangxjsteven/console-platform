<template>
    <div>
        <table-page :tableDB='tableDB' :itemOptions='itemOptions' :tableTitle='tableTitle' :exportDB='exportDB' :refresh='refreshTableFlag' @itemEvent='itemEvent' @tabelEvent='tableHandle'>
        </table-page>
        <upload :show="upload.show" :clipOptions='clipOptions' :modelUrl='modelUrl' @hide='upload.show=false' @uploadEvent='uploadEvent'>
        </upload>
    </div>
</template>
<script>
import pageHead from 'components/pageHead';
import upload from 'components/upload/uploadSingle.vue';
import tablePage from 'components/tablePage/tablePage.vue'
module.exports = {
    data: function() {
        props: ['beforeroute']
        return {
            upload: {
                show: false,
                title: ''
            },
            tableDB: {
                url: '/newconsole/consoleapi/channel/channelManage',
                method: 'post'
            },
            channelDB: {
                url: '/newconsole/consoleapi/channel/getChannels',
                method: 'post'
            },
            exportDB: '/newconsole/consoleapi/channel/exportChannel',
            clipOptions: {
                url: '/newconsole/consoleapi/channel/addChannel',
                paramName: 'file',
                params: {
                    groupId: 1
                }
            },
            modelUrl: "http://nfd-filestore-public.oss-cn-shenzhen.aliyuncs.com/excelTemplate/channelManage/addChannel.xls",

            refreshTableFlag: 0,
            itemOptions: {
                colCount: 3,
                wrap: true,
                searchItems: [{
                    name: "渠道码",
                    id: 'channelCode',
                    type: 'text',
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
                    name: "一级渠道",
                    id: 'channel1',
                    type: 'select',
                    option: [],
                    value: ''
                }, {
                    name: "二级渠道",
                    id: 'channel2',
                    type: 'select',
                    option: [],
                    value: ''
                }, {
                    name: "三级渠道",
                    id: 'channel3',
                    type: 'select-multi',
                    option: [],
                    value: []
                }],
                buttons: [{
                    name: "搜 索",
                    icon: "search",
                    type: "search",
                    btnPower: true
                }, {
                    name: "导 出",
                    icon: "sign-out",
                    type: "export",
                    btnPower: true
                }, {
                    name: "新增渠道",
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
                }]
            },
            channels: [],
            channelOption: {}
        }
    },
    watch: {
        beforeroute: function() {
            this.getChannels();
        }
    },
    mounted: function() {
        this.getChannels();
    },
    methods: {
        itemEvent: function(opts) {
            switch (opts.type) {
                case 'selected':
                    if (opts.item.id === 'dimension' || opts.item.id.indexOf('channel') > -1) {
                        this.channelSelect(opts);
                    }
                    break;
                case 'multiple-selected':
                    this.channelSelect(opts);
                    break;
                case 'export':
                    // this.downloadList(opts.value);
                    break;
                case 'add':
                    this.showUploadBox(opts.value);
                    break;
            }
        },
        uploadEvent: function(opts) {
            switch (opts.type) {
                case 'success':
                    this.refreshTableFlag = +new Date();
                    break;
            }
        },
        tableHandle: function(opts) {
            switch (opts.type) {
                case 'export':
                    this.downloadList(opts.value);
                    break;
            }
        },
        showUploadBox: function(opts) {
            let self = this;
            // 显示上传excel弹框
            this.upload = {
                show: true
            };
        },
        getChannels: function(opts) {
            let self = this;
            this.$ajax({
                url: this.channelDB.url,
                method: this.channelDB.method
            }).then(function(res) {
                if (res.code !== 0) {
                    return false;
                }
                self.channels = res.data.channels
                self.setDefault(self.channels);
            })
        },
        setDefault: function(list) {
            this.channels.unshift({
                text: '全部',
                value: '',
                children: [{
                    text: '全部',
                    value: '',
                    children: [{
                        text: '全部',
                        value: '',
                        children: []
                    }]
                }]
            })
            let index = 0,
                channel = null,
                channels = this.channels,
                ids = ['dimension', 'channel1', 'channel2', 'channel3'];
            while (index < 4) {
                let name = ids[index];
                ++index;
                channel = channels[0];
                this.$set(this.getOption(name),
                    'option',
                    channels)
                // 第三级是多选框，默认value是空数组
                this.$set(this.getOption(name),
                    'value', index < 4 ? '' : [])
                channel && (channels = channel.children)
            }
        },
        setItemsValue: function(selectItems) {
            let items = this.itemOptions.searchItems,
                result = [];
            for (let name in items) {
                let item = items[name],
                    id = item.id;
                item.value = typeof selectItems[id] === 'undefined' ? item.value : selectItems[id]
                result.push(item);
            }
            return result;
        },
        getOption: function(type) {
            let items = this.itemOptions.searchItems;
            for (let i = items.length - 1; i >= 0; i--) {
                let item = items[i]
                if (type === item.id) {
                    return item;
                }
            }
        },
        setOption: function(name, opts) {
            let value = opts || [];
            if (!value[0] || value[0].value !== '') {
                value.unshift({
                    text: '全部',
                    value: ''
                })
            }
            this.$set(this.getOption(name), 'option', value);
        },
        setValue: function(name, value) {
            this.$set(this.getOption(name), 'value', value);
        },
        getChannel: function(optId, channelId) {
            let list = this.getOption(optId).option
            for (let i = list.length - 1; i >= 0; i--) {
                let channel = list[i]
                if (channelId === channel.value) {
                    return channel;
                }
            }
        },
        channelSelect: function(opts) {
            let id = opts.id;
            this.itemOptions.searchItems = this.setItemsValue(opts.value);
            switch (id) {
                case 'dimension':
                    this.setOption('channel1', this.getChannel('dimension', opts.value['dimension']).children);
                    this.setValue('channel1', '');
                    this.setOption('channel2', []);
                    this.setValue('channel2', '');
                    this.setOption('channel3', []);
                    this.setValue('channel3', []);
                    break;
                case 'channel1':
                    this.setOption('channel2', this.getChannel('channel1', opts.value['channel1']).children);
                    this.setValue('channel2', '');
                    this.setOption('channel3', []);
                    this.setValue('channel3', []);
                    break;
                case 'channel2':
                    this.setOption('channel3', this.getChannel('channel2', opts.value['channel2']) ? this.getChannel('channel2', opts.value['channel2']).children : []);
                    this.setValue('channel3', []);
                    break;
            }
        },
        downloadList: function(opts) {
            var self = this;
            let sendData = this.searchResult = opts.data || this.searchResult;
            // window.open('/public/excel/channel.xlsx', '_blank')
        }
    },
    components: {
        pageHead,
        upload,
        tablePage
    }
}
</script>