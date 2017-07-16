<style>
.main-section {
    color: green;
}
</style>
<template>
    <div>
        <table-page :tableDB='tableDB' :itemOptions='itemOptions' :tableTitle='tableTitle' @itemEvent='itemEvent' @tabelEvent='tableHandle'></table-page>
        <upload :show="upload.show" type="free" @hide='upload.cancel'>
            <!-- <div class="dd-content">
                <label for="exampleInputFile">{{upload.title}}</label>
                <input type="file" id="exampleInputFile">
                <p class="help-block">{{upload.desc}}</p>
            </div> -->
            <!-- <vue-clip :options='clipOptions'></vue-clip>
            <div class="dd-buttons">
                <button class="btn btn-primary" @click="upload.ok">导入</button>
                <button class="btn btn-default" @click="upload.cancel">取消</button>
            </div> -->
        </upload>
    </div>
</template>
<script>
import pageHead from 'components/pageHead';
import upload from 'components/upload/uploadBox.vue';
import tablePage from 'components/tablePage/tablePage.vue'
module.exports = {
    data: function() {
        props: ['beforeroute']
        return {
            upload: {
                show: false,
                title: '',
                message: '',
                html: '',
                type: '',
                ok: function() {},
                cancel: function() {},
                hidetime: 0,
                autohide: false,
            },
            tableDB: {
                url: '/newconsole/consoleapi/channel/channelManage',
                method: 'post'
            },
            channelDB: {
                url: '/newconsole/consoleapi/channel/getChannels',
                method: 'post'
            },
            exportDB: {
                url: '/newconsole/consoleapi/channel/exportChannel',
                method: 'post'
            },
            clipOptions: { url: '/newconsole/consoleapi/channel/uploadExcel', paramName: 'file' },
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
                }, {
                    name: "一级渠道",
                    id: 'channel1',
                    type: 'select',
                    option: [],
                    value: ''
                }, {
                    name: "二级渠道",
                    id: 'channel2',
                    type: 'select-multi',
                    option: [],
                    value: []
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
                case 'multiple-selected':
                    this.channelSelect(opts.value);
                    break;
                case 'export':
                    this.downloadList(opts.value);
                    break;
                case 'add':
                    this.showUploadBox(opts.value);
                    break;
            }
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
        showUploadBox: function(opts) {
            let self=this;
            // 显示上传excel弹框
            this.upload = {
                show: true,
                ok: function() {
                    self.upload.show = false;
                },
                cancel: function() {
                    self.upload.show = false;
                }
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
                let channelMap = {
                    channel1: 'first',
                    channel2: 'second',
                    channel3: 'third'
                };
                self.channels = res.data.channels
                for (let i in channelMap) {
                    self.$set(self.getChannel(i),
                        'option',
                        self.transChannelData(self.channels[channelMap[i]]))
                    self.$set(self.getChannel(i),
                        'value', [])
                }
            })
        },
        transChannelData: function(channels) {
            let result = [];
            for (let i = 0, len = channels.length; i < len; i++) {
                let chl = channels[i];
                result.push({
                    'value': chl,
                    'text': chl
                })
            }
            return result;
        },
        getChannel: function(type) {
            let items = this.itemOptions.searchItems;
            for (let i = items.length - 1; i >= 0; i--) {
                let item = items[i]
                if (type === item.id) {
                    return item;
                }
            }
        },
        setChannelOption: function(name, value) {
            this.$set(this.getChannel(name), 'option', value);
        },
        setChannelValue: function(name, value) {
            this.$set(this.getChannel(name), 'value', value);
        },
        setItemsValue: function(selectItems) {
            let items = this.itemOptions.searchItems,
                result = [];
            for (let name in items) {
                let item = items[name];
                for (let id in selectItems) {
                    if (item.id === id) {
                        item.value = (selectItems[id] || item.value)
                        result.push(item);
                    }
                }
            }
            return result;
        },
        channelSelect: function(opts) {
            let self = this;
            let id = opts.id;
            this.itemOptions.searchItems = this.setItemsValue(opts);
            // switch (id) {
            //     case 'channel1':
            //         if (self.getChannel(id).option !== opts.data) {
            //             self.getChannel(id).option = opts.data;
            //             self.setChannelOption('channel2', []);
            //             self.setChannelValue('channel2', []);
            //             self.setChannelOption('channel3', []);
            //             self.setChannelValue('channel3', []);
            //         }
            //         break;
            //     case 'channel2':
            //         if (self.getChannel(id).option !== opts.data) {
            //             self.getChannel(id).option = opts.data;
            //             self.setChannelOption('channel3', []);
            //             self.setChannelValue('channel3', []);
            //         }
            //         break;
            //     case 'channel3':
            //         if (self.getChannel(id).option !== opts.data) {
            //             self.getChannel(id).option = opts.data;
            //         }
            //         break;
            // }
        },
        downloadList: function(opts) {
            var self = this;
            let sendData = this.searchResult = opts.data || this.searchResult;
            window.open('/public/excel/channel.xlsx', '_blank')
            // this.$ajax({
            //     url: this.exportDB.url,
            //     method: this.exportDB.method,
            //     requestType: 'json',
            //     data: {
            //         pageNo: this.pageInfo.pageNo,
            //         pageSize: this.pageInfo.pageSize,
            //         conditionData: sendData
            //     }
            // }).then(
            //     function(res) {
            //         if (res.code === 0) {
            //             var data = res.data || {};
            //             self.tableData = data.data;
            //             self.pageInfo.pageCurr = data.pageNum || self.pageInfo.pageCurr;
            //             self.pageInfo.pagesCount = data.pages || self.pageInfo.pagesCount;
            //         }
            //     }
            // ).catch(function(error) {
            //     self.$store.commit('TOGGLE_DIALOG', error.message)
            // })
        }
    },
    components: {
        pageHead,
        upload,
        tablePage
    }
}
</script>