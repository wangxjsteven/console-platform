<style>
.main-section {
    color: green;
}
</style>
<template>
    <div>
        <table-page
         :tableDB='tableDB'
         :refresh='refreshTableFlag'
         :itemOptions='itemOptions'
         :tableTitle='tableTitle'
         @itemEvent='itemEvent'>
        </table-page>

        <!-- 上传模板提示框 -->
        <upload :show="upload.show" :clipOptions='clipOptions' :modelUrl='modelUrl' @hide='upload.show=false' @uploadEvent='uploadEvent'>
            <div v-if='group.groupId'>
                <lebal class='col-sm-4 control-label text-justify'>渠道组名称: </lebal>
                <p>{{group.groupName}}</p>
                <lebal class='col-sm-4 control-label text-justify'>备注: </lebal>
                <p>{{group.remark}}</p>
            </div>
        </upload>
    </div>
</template>
<script>
import pageHead from 'components/pageHead';
import upload from 'components/upload/uploadSingle.vue';
import tablePage from 'components/tablePage/tablePage.vue'
module.exports = {
    components: {
        pageHead,
        upload,
        tablePage
    },
    data: function() {
        return {
            upload: {
                show: false,
                title: ''
            },
            group: {
                groupId: 0,
                groupName: '',
                remark: ''
            },
            clipOptions: {
                url: '/newconsole/consoleapi/channel/addChannelChange',
                paramName: 'file',
                params: {
                    groupId: 0
                }
            },
            modelUrl: "http://nfd-filestore-public.oss-cn-shenzhen.aliyuncs.com/excelTemplate/channelManage/addChannelChange.xls",
            exportDB: '/newconsole/consoleapi/channel/exportChannel',
            pageLebal: 'group',

            refreshTableFlag:0,
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
                    name: "平台维度",
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
        itemEvent: function(opts) {
            switch (opts.type) {
                case 'export':
                    this.setLebal('detail');
                    break;
                case 'add':
                    this.showUploadBox();
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
        showUploadBox: function(opts) {
            let self = this;
            // 显示上传excel弹框
            this.upload = {
                show: true
            };
        },
        show: function() {
            return false;
        }
    }
}
</script>
