<style>
.main-section {
    color: green;
}
</style>
<template>
    <div>
        <table-page v-show='pageLebal==="group"'
         :tableDB='tableDB'
         :refresh='refreshTableFlag'
         :itemOptions='itemOptions'
         :tableTitle='tableTitle'
         @itemEvent='itemEvent'
         @tableEvent='tableEvent'>
        </table-page>
        <!-- 查看组详情 -->
        <group-detail v-if='pageLebal==="detail"' :groupId="group.groupId" @detailEvent='detailEvent'></group-detail>
        <!-- 上传模板提示框 -->
        <upload :show="upload.show" :clipOptions='clipOptions' :modelUrl='modelUrl' @hide='upload.show=false' @uploadEvent='uploadEvent'>
            <div v-if='group.groupId'>
                <label class="col-sm-4 control-label">渠道组名称:</label>
                <div class="col-sm-8">
                    <p class="form-control-static">{{group.groupName}}</p>
                </div>
                <label class="col-sm-4 control-label">备注:</label>
                <div class="col-sm-8">
                    <p class="form-control-static">{{group.remark}}</p>
                </div>
            </div>
        </upload>
    </div>
</template>
<script>
import pageHead from 'components/pageHead';
import upload from 'components/upload/uploadSingle.vue';
import tablePage from 'components/tablePage/tablePage.vue'
import groupDetail from './group/channelInGroup.vue'
module.exports = {
    components: {
        pageHead,
        upload,
        groupDetail,
        tablePage
    },
    data() {
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
                url: '/newconsole/consoleapi/channel/addChannelGroups',
                paramName: 'file',
                params: {
                    groupId: 0
                },
                inputAdd: []
            },
            modelUrl: "http://nfd-filestore-public.oss-cn-shenzhen.aliyuncs.com/excelTemplate/channelManage/addChannelGroup.xls",
            pageLebal: 'group',

            // table配置
            refreshTableFlag:0,
            tableDB: {
                url: '/newconsole/consoleapi/channel/getChannelGroups',
                method: 'post'
            },
            optionDB: {
                url: '/newconsole/consoleapi/channel/channelGroupsList',
                method: 'post'
            },
            itemOptions: {
                colCount: 3,
                wrap: false,
                searchItems: [{
                    name: "渠道组名称",
                    id: 'groupName',
                    type: 'select-multi',
                    option: [],
                    value: ''
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
                    id: 'groupId',
                    type: 'default'
                }, {
                    name: "渠道组名称",
                    id: 'groupName',
                    type: 'default'
                }, {
                    name: "渠道个数",
                    id: 'childrenNum'
                }, {
                    name: "备注",
                    id: 'remark'
                }, {
                    name: "操作",
                    id: 'options',
                    type: 'multbtn',
                    filed: '__buttons',
                    buttons: [{
                        name: 'view',
                        type: 'view',
                        btnPower: 'select'
                    }, {
                        name: '增加渠道',
                        type: 'add',
                        btnPower: 'select'
                    }]
                }]
            },
            date: ''
        }
    },
    mounted(){
        this.getGroupData();
    },
    methods: {
        setLebal(lebal) {
            this.pageLebal = lebal || 'group';
        },
        showUploadBox(opts) {
            let self = this;
            this.group = opts || {
                groupId: 0,
                groupName: '',
                remark: ''
            };
            this.clipOptions.params = opts ? { groupId: opts.groupId } : {};
            this.clipOptions.inputAdd = opts ? [] : [{
                type: 'text',
                id: 'groupName',
                title: '渠道组名称:',
                value: ''
            }, {
                type: 'text',
                id: 'remark',
                title: '备注:',
                value: ''
            }];
            // 显示上传excel弹框
            this.upload = {
                show: true
            };
        },
        getGroupData() {
            let self=this;
            this.$ajax({
                url: this.optionDB.url,
                method: this.optionDB.method
            }).then(function(res) {
                if (res.code !== 0) {
                    return;
                }
                self.itemOptions.searchItems[0].option = self.makeOption(res.data)
            })
        },
        makeOption(list) {
            let result = [];
            for (var i = list.length - 1; i >= 0; i--) {
                let item = list[i];
                result.unshift({
                    text: item.groupName,
                    value: item.groupName
                })
            }
            return result;
        },
        itemEvent(opts) {
            switch (opts.type) {
                case 'export':
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
        tableEvent(opts) {
            switch (opts.type) {
                case 'view':
                    this.setLebal('detail');
                    break;
                case 'add':
                    this.showUploadBox(opts.target);
                    break;
            }
        },
        detailEvent(opts) {
            this.pageLebal = 'group'
        }
    }
}
</script>