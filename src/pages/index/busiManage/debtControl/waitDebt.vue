<style lang="sass">
.md-wait-debt {
    .debt-tip {
        margin: 10px 0 0;
    }
    .label-input {
        margin-right: 20px;
        margin-bottom: 0;
        font-weight: normal;
    }
    .md-dialog-box {
        text-align: left;
        margin-top: 42px;
        .dialog-title {
            font-weight: bold;
            text-indent: 86px;
        }
    }
    .dialog-radio-box {
        text-align: center;
    }
}
</style>
<template>
    <div class="container-section col-sm-11 col-md-12 md-wait-debt">
        <page-head></page-head>
        <tabs :tabslist="tabListData" :defaultIndex="0" @tabClick="tabClick">
            <tab-pane label="参考数据" selected>
                <search-items :itemOptions="dataOptions" @eventHandle="eventHandle"></search-items>
                <table-comp :pageInfo="pageInfo" :titles="tableTitle" :filter="tableFilter" :list="tableData" @btnClick="pageBtnClick">
                    <p slot="debt-info" class="debt-tip">注：运营同事需注意观察当天的参考数据【待发金额】，必须处理成为“0“。</p>
                </table-comp>
            </tab-pane>
            <tab-pane label="债权详情">
                <search-items :itemOptions="detailOptions" @eventHandle="eventHandle"></search-items>
                <table-comp :pageInfo="pageInfoDetail" :titles="tableTitleDetail" :filter="tableFilterDetail" :list="tableDataDetail" @btnClick="pageBtnClick" @multBtnAction="multBtnAction">
                </table-comp>
            </tab-pane>
        </tabs>
        <model :show="dialog.show" :title="dialog.title" :message="dialog.message" :type="dialog.type" @hide='hideDialog'>
            <div class="header">提醒</div>
            <div v-if="modifyBs.state" class="text-muted md-dialog-box">
                <p class="dialog-title"><i style="color:#f00">*</i>请重新选择债权标示</p>
                <div class="dialog-radio-box">
                    <input name="signOption" type="radio" value="LCJH" v-model="modifyBs.value" />
                    <label class="label-input">理财计划</label>
                    <input name="signOption" type="radio" value="YLJK" v-model="modifyBs.value" disabled="disabled" />
                    <label class="label-input">预留接口</label>
                </div>
            </div>
            <button class="vodal-confirm-btn" @click="dialog.ok">确定</button>
            <button class="vodal-cancel-btn" @click="dialog.cancel">取消</button>
        </model>
    </div>
</template>
<script>
import pageHead from '@/components/pageHead';
import tabs from '@/components/tabs/tabs';
import tabPane from '@/components/tabs/tabpane';
import Util from '@/assets/js/util';
import searchItems from '@/components/searchItems/item';
import tableComp from '@/components/table/table.vue';
import model from 'components/model/model.vue';
import moment from 'moment';
var that = null,
    firstComponent = 0;
export default {
    data: function() {
        that = this;
        return {
            dialog: {
                show: false,
                message: '',
                type: 'free',
                ok: function() {},
                cancel: function() {}
            },
            modifyBs: {
                value: 'LCJH',
                state: false
            },
            dataOptions: {
                wrap: false,
                searchItems: [{
                    name: "自选时间",
                    id: ['beginTime', 'endTime'],
                    type: 'doubletime', //time标示一个时间选项，times标示有起始时间
                    value: [moment().format('YYYY-MM-DD'), moment().add(7, 'd').format('YYYY-MM-DD')],
                    limit: [
                        [{
                            type: 'fromto',
                            to: moment().add(8, 'd').format('YYYY-MM-DD')
                        }],
                        [{
                            type: 'fromto',
                            to: moment().add(8, 'd').format('YYYY-MM-DD')
                        }]
                    ]
                }],
                buttons: [{
                    name: "搜 索",
                    icon: "search",
                    type: "search",
                    btnPower: 'select'
                }, {
                    name: "刷 新",
                    icon: "repeat",
                    type: "refresh",
                    btnPower: true
                }]
            },
            detailOptions: {
                wrap: true,
                searchItems: [{
                        name: "借款标题",
                        id: 'loanTitle',
                        type: 'text',
                        value: ''
                    }, {
                        name: "借款人姓名",
                        id: 'borrowerName',
                        type: 'text',
                        value: ''
                    }, {
                        name: "债权人姓名",
                        id: 'creditorName',
                        type: 'text',
                        value: ''
                    }, {
                        name: "关联理财产品",
                        id: 'relatedProducts',
                        type: 'text',
                        value: ''
                    }, {
                        name: "债权标识",
                        id: 'creditSign',
                        type: 'select',
                        option: [{
                            text: '全部',
                            value: ''
                        }, {
                            text: '理财计划',
                            value: 'LCJH'
                        }],
                        value: ''
                    }, {
                        name: "还款方式",
                        id: 'repaymentMethods',
                        type: 'select',
                        option: [{
                            text: '全部',
                            value: ''
                        }, {
                            text: '每月付息，到期还本',
                            value: 'MYFX'
                        }, {
                            text: '等额本息',
                            value: 'DEBX'
                        }, {
                            text: '等额本金',
                            value: 'DEBJ'
                        }, {
                            text: '一次性结清',
                            value: 'YCFQ'
                        }],
                        value: ''
                    }, {
                        name: "债权状态",
                        id: 'creditStatus',
                        type: 'select',
                        option: [{
                            text: '全部',
                            value: ''
                        }, {
                            text: '已作废',
                            value: 'YZF'
                        }, {
                            text: '待预约',
                            value: 'DYY'
                        }, {
                            text: '已预约',
                            value: 'YYY'
                        }, {
                            text: '已锁定',
                            value: 'LOCK'
                        }],
                        value: ''
                    }, {
                        name: "债权来源",
                        id: 'creditSource',
                        type: 'select',
                        option: [{
                            text: '全部',
                            value: ''
                        }, {
                            text: '债权转让',
                            value: 'ZR'
                        }, {
                            text: '新债权',
                            value: 'TZ'
                        }],
                        value: ''
                    }
                    /*, {
                        name: "生成时间",
                        id: ['beginCreateTime', 'endCreateTime'],
                        type: 'doubletime', //singletime标示一个时间选项，doubletime标示有起始时间
                        value: ''
                    }, {
                        name: "预约时间", //时间选项的id规定都传数组对象
                        id: ['beginBookTime', 'endBookTime'],
                        type: 'doubletime', //singletime标示一个时间选项，doubletime标示有起始时间
                        value: ''
                    }*/
                ],
                buttons: [{
                    name: "搜 索",
                    icon: "search",
                    type: "d_search",
                    btnPower: 'select'
                }, {
                    name: "导 出",
                    icon: "sign-out",
                    type: "export",
                    btnPower: ''
                }]
            },
            tabListData: [{
                id: 0,
                tabname: "参考数据",
                actived: true
            }, {
                id: 1,
                tabname: "债权详情",
                actived: false
            }],
            pageInfo: {},
            tableFilter: {},
            tableDB: {
                data: {
                    url: '/newconsole/consoleapi/waitDebtData',
                    type: 'post'
                },
                detail: {
                    url: '/newconsole/consoleapi/waitDebtDetailSearch',
                    type: 'post'
                }
            },
            tableData: [],
            tableTitle: {
                colStyle:'average',
                tableMinWidth: '850px',
                ordinal: false, //配置序号是否展示
                tits: [{
                    name: "新债权起息日 | 转让债权待转让日",
                    id: 'transfertime',
                    type: 'date'
                }, {
                    name: "债权价值总金额",
                    id: 'creditvalueamount'
                }, {
                    name: "待发金额",
                    id: 'dueamount'
                }, {
                    name: "已发金额",
                    id: 'issuedamount'
                }, {
                    name: "复投保留金额",
                    id: 'redeliveryamount'
                }]
            },
            pageInfoDetail: {},
            tableFilterDetail: {},
            tableDataDetail: [],
            tableTitleDetail: {
                ordinal: false, //配置序号是否展示
                tits: [{
                    name: "操作",
                    id: 'options',
                    type: 'multbtn',
                    filed: '__buttonsState',
                    stateName: 'creditStatus',
                    idName: 'copyId',
                    allBtn: [{
                        name: 'editbs',
                        btnPower: 'search'
                    }],
                    buttons: {
                        'DYY': ['editbs']
                    }
                }, {
                    name: "债权标识",
                    id: 'creditSign'
                }, {
                    name: "债权状态",
                    id: 'creditStatus'
                }, {
                    name: "借款标题",
                    id: 'loanTitle'
                }, {
                    name: "债权来源",
                    id: 'creditSource'
                }, {
                    name: "借款人姓名",
                    id: 'borrowerName'
                }, {
                    name: "债权人姓名",
                    id: 'creditorName'
                }, {
                    name: "债权人账号",
                    id: 'creditAccount'
                }, {
                    name: "起息日期",
                    id: 'interestDate',
                    type: 'date'
                }, {
                    name: "到期日期",
                    id: 'dueDate',
                    type: 'date'
                }, {
                    name: "结清日期",
                    id: 'finishTime',
                    type: 'date'
                }, {
                    name: "债权年利率",
                    id: 'creditRate',
                    type: 'rate'
                }, {
                    name: "债权本金",
                    id: 'creditPrincipal'
                }, {
                    name: "还款方式",
                    id: 'repaymentMethods'
                }, {
                    name: "待转让日期",
                    id: 'waitZrTime',
                    type: 'date'
                }, {
                    name: "待转让日期的债权价值",
                    id: 'waitZrValue',
                    type: 'money'
                }, {
                    name: "生成时间",
                    id: 'generationTime',
                    type: 'date-time'
                }, {
                    name: "预约时间",
                    id: 'bookTime',
                    type: 'date-time'
                }, {
                    name: "关联理财产品",
                    id: 'relatedProducts'
                }]
            },
            tabFlag: 0,
            searchResult: {},
            requestPages: 7
        }
    },
    beforeRouteEnter: function(to, from, next) {
        next(vm => {
            if (vm.tabFlag === 0) { //参考数据
                vm.requestPages = 7
            } else {
                vm.requestPages = 15
            }
            vm.searchResult = vm.getDefaultData(vm.dataOptions.searchItems);
            vm.loadTableData(1, vm.searchResult);
        })
    },
    methods: {
        getDefaultData: function(btnlist) {
            let result = {};
            for (var i = btnlist.length - 1; i >= 0; i--) {
                let item = btnlist[i];
                if (item.id instanceof Array) {
                    let id = item.id;
                    for (let i in id) {
                        result[id[i]] = item.value instanceof Array ? item.value[i] : item.value;
                    }
                } else {
                    result[item.id] = item.value;
                }
            }
            return result;
        },
        loadTableData: function(pageNo, conditionData, callback) {
            if (this.tabFlag === 0) { //参考数据
                this.requestPages = 7
                this.$ajax({
                    url: this.tableDB.data.url,
                    method: this.tableDB.data.type,
                    requestType: 'json', //默认提交类型是application/x-www-form-urlencoded;charset=utf-8，需要与后台约定
                    data: {
                        pageNo: pageNo,
                        pageSize: this.requestPages,
                        conditionData: conditionData
                    }
                }).then(
                    function(res) {
                        if (res.code === 0) {
                            let data = res.data || {};
                            that.tableData = data.data;
                            that.pageInfo = {
                                "pageCurr": data.pageNum,
                                "pagesCount": data.pages
                            }
                            callback && callback();
                        }
                    }
                )
            } else {
                this.requestPages = 15
                this.$ajax({
                    url: this.tableDB.detail.url,
                    method: this.tableDB.detail.type,
                    requestType: 'json', //默认提交类型是application/x-www-form-urlencoded;charset=utf-8，需要与后台约定
                    data: {
                        pageNo: pageNo,
                        pageSize: this.requestPages,
                        conditionData: conditionData
                    }
                }).then(
                    function(res) {
                        if (res.code === 0) {
                            let data = res.data || {};
                            that.tableDataDetail = data.data;
                            that.pageInfoDetail = {
                                "pageCurr": data.pageNum,
                                "pagesCount": data.pages
                            }
                            callback && callback();
                        }
                    }
                )
            }
        },
        eventHandle: function(opts) {
            let type = opts.type;
            switch (type) {
                case 'refresh':
                    this.refreshBtnClick(opts.value);
                    break;
                case 'search':
                    this.searchBtnClick(opts.value);
                    break;
                case 'd_search':
                    this.searchDetailBtnClick(opts.value);
                    break;
                case 'export':
                    this.exportBtnClick(opts.value);
                    break;
            }
        },
        pageBtnClick: function(data) {
            // 翻页请求数据
            this.loadTableData(data, this.searchResult);
        },
        tabClick: function(id) {
            this.tabFlag = id;
            this.searchResult = this.getDefaultData([this.dataOptions.searchItems,this.detailOptions.searchItems][id]);
            this.loadTableData(1, this.searchResult);
            return id
        },
        searchBtnClick: function(data) {
            this.searchResult = data;
            this.loadTableData(1, data);
        },
        searchDetailBtnClick: function(data) {
            this.searchResult = data;
            this.loadTableData(1, data);
        },
        refreshBtnClick: function(data) {
            this.searchResult = data;
            this.loadTableData(1, data);
        },
        exportBtnClick: function() {},
        multBtnAction: function(btn, item) {
            switch (btn) {
                case 'edit':
                    updateCreditBs
                    break;
            }
        },
        multBtnAction: function(item) {
            this.modifyBs.state = true
            this.dialog = {
                show: true,
                type: 'free',
                ok: function() {
                    that.$ajax({
                        url: '/newconsole/consoleapi/updateMark',
                        method: 'post',
                        data: {
                            copyId: item.copyId || 0,
                            mark: that.modifyBs.value
                        }
                    }).then(
                        function(res) {
                            if (res.code === 0) {
                                that.loadTableData(1, that.searchResult, function() {
                                    that.hideDialog();
                                })
                            } else {
                                that.hideDialog();
                            }
                        }
                    );
                },
                cancel: function() {
                    that.hideDialog();
                }

            }
        },
        hideDialog: function() {
            this.dialog.show = false;
            this.modifyBs.state = false;
        }
    },
    components: {
        pageHead,
        tabs,
        tabPane,
        searchItems,
        tableComp,
        model
    }
}
</script>
