<template>
    <div class="container-section col-sm-11 col-md-12 md-list-page" id="containerSection">
        <page-head p-title="业务管理&nbsp;&nbsp;>&nbsp;&nbsp;产品管理>&nbsp;&nbsp;理财计划列表"></page-head>
        <tabs :tabslist="tabListData" :defaultIndex="Number($route.query.tab)||0" @tabClick="tabClick">
            <tab-pane label="参考数据" :selected="checkTab(0)">
                <search-items :itemOptions="dataOptions" @eventHandle="eventHandle"></search-items>
                <table-comp :pageInfo="pageInfo" :titles="tableTitle" :filter="tableFilter" :list="tableData" @btnClick="pageBtnClick">
                </table-comp>
                <table-comp :pageInfo="pageInfo_2" :titles="tableTitle_2" :filter="tableFilter" :list="tableData_2" @btnClick="pageBtnClick_2">
                </table-comp>
            </tab-pane>
            <tab-pane label="理财计划" :selected="checkTab(1)">
                <search-items :itemOptions="planOptions" @eventHandle="eventHandle"></search-items>
                <table-comp :pageInfo="planPageInfo" :titles="tablePlanTitle" :list="planData" @btnClick="pageBtnListDetail" @zszt="controlShowStatus" @multBtnAction="multBtnAction">
                </table-comp>
            </tab-pane>
            <tab-pane label="利率设置" :selected="checkTab(2)">
                <div class="settlement_method">结算方式：按月结算收益</div>
                <table-comp :titles="tableRateTitle" :list="rateData" :isRateTable="isRateTable" @updateRateInfo='updateRateInfo'>
                </table-comp>
            </tab-pane>
        </tabs>
        <model :show="dialog.show" :title="dialog.title" :message="dialog.message" :type="dialog.type" @hide='hideDialog'>
            <div class="header">提醒</div>
            <div v-if="dateMulti" class="text-muted md-dialog-box">
                <p class="dialog-title"><i style="color:#f00">*</i>请选择预发布时间</p>
                <datepicker class="dialog-radio-box" @change="changePrereleaseTime" :dateMulti="dateMulti"></datepicker>
            </div>
            <div v-if="textMulti" style="width: 70%;margin:0 auto">
                <p><i style="color:#f00">*</i>作废描述</p>
                <textarea v-model="valueTextarea" style="width: 100%;height:8em"></textarea>
            </div>
            <div class="body">{{dialog.message}}</div>
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
import datepicker from '@/components/datepicker/date';
import moment from 'moment';
let that = null,
    firstComponent = 0;
export default {
    props: ['beforeroute'],
    data: function() {
        that = this;
        return {
            dialog: {
                title: '',
                message: '',
                type: '',
                ok: function() {}
            },
            isRateTable: true,
            tableDB: {
                data: {
                    url: '/newconsole/consoleapi/selectReferenceData',
                    type: 'post'
                },
                rate: {
                    url: '/newconsole/consoleapi/getRateInfo',
                    type: 'post'
                },
                plan: {
                    url: '/newconsole/consoleapi/financePlanList',
                    type: 'post'
                }
            },
            dataOptions: {
                colCount: 5,
                wrap: false,
                searchItems: [{
                    name: "自选时间",
                    id: ['startDate', 'endDate'],
                    type: 'doubletime', //time标示一个时间选项，times标示有起始时间
                    value: [
                        moment().format('YYYY-MM-DD'),
                        moment().add(7, 'd').format('YYYY-MM-DD')
                    ],
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
                    type: "d_search",
                    btnPower: true
                }, {
                    name: "刷 新",
                    icon: "repeat",
                    type: "refresh",
                    btnPower: true
                }, {
                    name: "新建理财计划",
                    icon: "copy",
                    type: "add",
                    btnPower: true
                }]
            },
            tabListData: [{
                id: 0,
                tabname: "参考数据",
                actived: true
            }, {
                id: 1,
                tabname: "理财计划",
                actived: false
            }, {
                id: 2,
                tabname: "利率设置",
                actived: false
            }],
            pageInfo: {},
            pageInfo_2: {},
            tableFilter: {},
            tableData: [],
            tableData_2: [],
            tableTitle: {
                colStyle: 'average',
                ordinal: false, //配置序号是否展示
                tits: [{
                    name: "理财计划起息日",
                    id: 'carryinterestdate',
                    type: 'date'
                }, {
                    name: "需募集总额",
                    id: 'totalamount'
                }, {
                    name: "1月期最大可募集金额",
                    id: 'onemaxamount'
                }, {
                    name: "3月期最大可募集金额",
                    id: 'threemaxamount'
                }, {
                    name: "6月期最大可募集金额",
                    id: 'sixmaxamount'
                }, {
                    name: "9月期最大可募集金额",
                    id: 'ninemaxamount'
                }, {
                    name: "12月期最大可募集金额",
                    id: 'twelvemaxamount'
                }]
            },
            tableTitle_2: {
                colStyle: 'average',
                ordinal: false, //配置序号是否展示
                tits: [{
                    name: "理财计划起息日",
                    id: 'carryinterestdate',
                    type: 'date'
                }, {
                    name: "需募集总额",
                    id: 'totalamount'
                }, {
                    name: "1月期已预约金额",
                    id: 'onereservationamount'
                }, {
                    name: "3月期已预约金额",
                    id: 'threereservationamount'
                }, {
                    name: "6月期已预约金额",
                    id: 'sixreservationamount'
                }, {
                    name: "9月期已预约金额",
                    id: 'ninereservationamount'
                }, {
                    name: "12月期已预约金额",
                    id: 'twelvereservationamount'
                }]
            },
            rateData: [],
            tableRateTitle: {
                tableMaxWidth: "400px",
                ordinal: false, //配置序号是否展示
                tits: [{
                    name: "期限",
                    id: 'term',
                    type: 'term'
                }, {
                    name: "利率",
                    id: 'rate',
                    type: 'rate',
                    filed: '__input'
                }, {
                    name: "操作",
                    id: 'options',
                    type: 'rate',
                    filed: '__buttons',
                    buttons: ['edit']
                }]
            },
            planOptions: {
                colCount: 5,
                wrap: true,
                searchItems: [{
                        name: "产品标题",
                        id: 'productName',
                        type: 'text',
                        value: ''
                    }, {
                        name: "产品状态",
                        id: 'productStatus',
                        type: 'select',
                        option: [{
                            text: '全部',
                            value: ''
                        }, {
                            text: '申请中',
                            value: 'SQZ'
                        }, {
                            text: '待审核',
                            value: 'DSH'
                        }, {
                            text: '待发布',
                            value: 'DFB'
                        }, {
                            text: '预发布',
                            value: 'YFB'
                        }, {
                            text: '募集中',
                            value: 'MJZ'
                        }, {
                            text: '待放款',
                            value: 'MJW'
                        }, {
                            text: '还款中',
                            value: 'HKZ'
                        }, {
                            text: '已结清',
                            value: 'YJQ'
                        }, {
                            text: '已作废',
                            value: 'YZF'
                        }],
                        value: ''
                    }, {
                        name: "展示区域",
                        id: 'investType',
                        type: 'select',
                        option: [{
                            text: '全部',
                            value: ''
                        }, {
                            text: '默认区',
                            value: 'PT'
                        }, {
                            text: '个人区',
                            value: 'ZS'
                        }, {
                            text: '新手区',
                            value: 'XS'
                        }],
                        value: ''
                    }, {
                        name: "展示状态",
                        id: 'showState',
                        type: 'select',
                        option: [{
                            text: '全部',
                            value: ''
                        }, {
                            text: '展示',
                            value: 'SHOW'
                        }, {
                            text: '隐藏',
                            value: 'HIDE'
                        }],
                        value: ''
                    }
                    /*, {
                        name: "建立时间",
                        id: ['startCreateTime', 'endCreateTime'],
                        type: 'doubletime', //time标示一个时间选项，times标示有起始时间
                        value: '' //[moment().format('YYYY-MM-DD'), moment().add(7,'d').format('YYYY-MM-DD')]
                    }, {
                        name: "发布时间",
                        id: ['startReleaseTime', 'endReleaseTime'],
                        type: 'doubletime', //time标示一个时间选项，times标示有起始时间
                        value: '' //[moment().format('YYYY-MM-DD'), moment().add(7,'d').format('YYYY-MM-DD')]
                    }*/
                ],
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
                    name: "新建理财计划",
                    icon: "copy",
                    type: "add",
                    btnPower: true
                }]
            },
            planData: [],
            planPageInfo: {},
            tablePlanTitle: {
                ordinal: true, //配置序号是否展示
                tits: [{
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
                    id: 'quota'
                }, {
                    name: "建立时间",
                    id: 'createTime',
                    type: 'date-time'
                }, {
                    name: "发布时间",
                    id: 'releaseTime',
                    type: 'date-time'
                }, {
                    name: "站岗资金",
                    id: 'sentryAmount'
                }]
            },
            tabId: +this.$route.query.tab || 0,
            searchResult: {},
            planSearchResult: {},
            valueTextarea: '',
            prereleaseTime: '',
            dateMulti: false,
            textMulti: false
        }
    },
    watch: {
        beforeroute: function() {
            this.searchResult = this.getDefaultData(this.dataOptions.searchItems);
            this.tabId = +this.$route.query.tab || 0;
            this.changeTab(this.tabId, 1);
        }
    },
    mounted: function() {
        this.searchResult = this.getDefaultData(this.dataOptions.searchItems);
        this.tabId = +this.$route.query.tab || 0;
        this.changeTab(this.tabId, 1);
        this.setBtnAuth();
    },
    methods: {
        eventHandle: function(opts) {
            let type = opts.type;
            switch (type) {
                case 'add':
                    this.createClick();
                    break;
                case 'refresh':
                    this.refreshBtnClick(opts.value);
                    break;
                case 'search':
                    this.searchListBtnClick(opts.value);
                    break;
                case 'd_search':
                    this.searchBtnClick(opts.value);
                    break;
                case 'export':
                    this.searchBtnClick(opts.value);
                    break;
            }
        },
        checkTab: function(id) {
            return id == this.tabId; //$route.query.tab;
        },
        changeTab: function(id, page, type) {
            let curPage = page || 1,
                _id = id || 0,
                _type = type || 0;

            switch (id) {
                case 0:
                    this.loadTableData(curPage, 15, {
                        type: _type
                    });
                    break;
                case 1:
                    this.loadPlanData(curPage, 15);
                    break;
                case 2:
                    this.loadRateData();
                    break;
            }
        },
        setBtnAuth: function() {
            let listData = this.dataOptions.buttons,
                listPlan = this.planOptions.buttons,
                list = listData.concat(listPlan);
            let power = {
                "select": true,
                "search": true,
                "d_search": true,
                "refresh": true,
                "edit": this.$checkAuth("edit"),
                "delete": this.$checkAuth("delete"),
                "check": this.$checkAuth("check"),
                "add": this.$checkAuth("add"),
                "release": this.$checkAuth("release")
            };
            for (let i = list.length - 1; i >= 0; i--) {
                list[i].btnPower = power[list[i].type] || false;
            }
        },
        getDefaultData: function(btnlist) {
            let result = {};
            for (let i = btnlist.length - 1; i >= 0; i--) {
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
        loadTableData: function(pageNo, pageSize, data) {
            let sendData = this.searchResult = data || this.searchResult,
                type = data ? data.type || 0 : 0;
            sendData['pageNo'] = pageNo;
            sendData['pageSize'] = pageSize;
            this.$ajax({
                url: this.tableDB.data.url,
                method: this.tableDB.data.type,
                data: sendData
            }).then(
                function(res) {
                    if (res.code === 0) {
                        let data = res.data || {},
                            page = {
                                "pageCurr": data.pageNum,
                                "pagesCount": data.pages
                            };
                        // 参考数据有两个table，分别独立管理
                        if (type === 2) {
                            that.tableData_2 = data.data;
                            that.pageInfo_2 = page;
                        } else if (type === 1) {
                            that.tableData = data.data;
                            that.pageInfo = page;
                        } else {
                            // type没传，默认同时更新两个table
                            that.tableData = that.tableData_2 = data.data;
                            that.pageInfo = that.pageInfo_2 = page;
                        }
                    }
                }
            )
        },
        loadRateData: function() {
            this.$ajax({
                url: this.tableDB.rate.url,
                method: this.tableDB.rate.type,
            }).then(
                function(res) {
                    if (res.code === 0) {
                        that.rateData = res.data;
                    }
                }
            );
        },
        loadPlanData: function(pageNo, pageSize, data, callback) {
            let sendData = this.planSearchResult = data || this.planSearchResult;
            sendData['pageNo'] = pageNo;
            sendData['pageSize'] = pageSize;
            this.$ajax({
                url: this.tableDB.plan.url,
                method: this.tableDB.plan.type,
                data: sendData
            }).then(
                function(res) {
                    if (res.code === 0) {
                        let data = res.data || {};
                        that.planData = data.data;
                        that.planPageInfo = {
                            "pageCurr": data.pageNum,
                            "pagesCount": data.pages
                        }
                        callback && callback();
                    }
                }
            );
        },
        searchBtnClick: function(opt) {
            this.loadTableData(1, 15, opt);
        },
        searchListBtnClick: function(opt) {
            this.loadPlanData(1, 15, opt);
        },
        refreshBtnClick: function(opt) {
            this.loadTableData(1, 15, opt);
        },
        pageBtnClick: function(data) {
            // 翻页请求数据
            this.changeTab(this.tabId, data, 1);
        },
        pageBtnClick_2: function(data) {
            // 翻页请求数据
            this.changeTab(this.tabId, data, 2);
        },
        pageBtnListDetail: function(data) {
            // 翻页请求数据
            this.changeTab(this.tabId, data);
        },
        tabClick: function(id) {
            this.tabId = id;
            this.changeTab(id, 1);
            return id
        },
        updateRateInfo: function(term, rate, callback) {
            this.$ajax({
                url: '/newconsole/consoleapi/updateRateInfo',
                method: 'post',
                data: {
                    term,
                    rate
                }
            }).then(
                function(res) {
                    if (res.code === 0) {
                        callback && callback();
                    }
                }
            );
        },
        createClick: function() {
            this.$router.push({
                path: '/busiManage/cpgl/lcjhgl',
                query: {
                    type: "create"
                }
            })
        },
        controlShowStatus: function(item, _self) {
            this.$ajax({
                url: '/newconsole/consoleapi/showHideProduct',
                method: 'post',
                data: {
                    productId: item.productId,
                    productState: item.showState === 'HIDE' ? 'SHOW' : 'HIDE'
                }
            }).then(
                function(res) {
                    if (res.code === 0) {
                        _self.$set(item, 'showState', item.showState === 'HIDE' ? 'SHOW' : 'HIDE');
                    }
                }
            );
        },
        changePrereleaseTime: function(time) {
            this.prereleaseTime = time;
            this.dialog.message = '';
        },
        multBtnAction: function(btn, item) {
            switch (btn) {
                case 'view':
                    this.$router.push({
                        path: '/busiManage/cpgl/lcjhgl',
                        query: {
                            type: "check",
                            id: item.productId
                        }
                    })
                    break;
                case 'edit':
                    this.$router.push({
                        path: '/busiManage/cpgl/lcjhgl',
                        query: {
                            type: "edit",
                            id: item.productId
                        }
                    })
                    break;
                case 'check':
                    this.$router.push({
                        path: '/busiManage/cpgl/lcjhgl',
                        query: {
                            type: "audit",
                            id: item.productId
                        }
                    })
                    break;
                case 'release':
                    this.checkRelease(item, 'release', function() {
                        that.dialog = {
                            show: true,
                            message: '你确定要发布' + item.productName + '吗？',
                            type: 'free',
                            ok: function() {
                                that.$ajax({
                                    url: '/newconsole/consoleapi/releaseProduct',
                                    method: 'post',
                                    data: {
                                        productId: item.productId
                                    }
                                }).then(
                                    function(res) {
                                        if (res.code === 0) {
                                            that.loadPlanData(1, 15, that.searchResult, function() {
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
                    });
                    break;
                case 'prerelease':
                    this.checkRelease(item, 'pre', function() {
                        that.dateMulti = true;
                        that.dialog = {
                            show: true,
                            message: '',
                            type: 'free',
                            ok: function() {
                                let reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
                                if (reg.test(that.prereleaseTime)) {
                                    that.dialog.show = false;
                                    that.dateMulti = false;
                                    that.confirmRelease(item.productName, item.productId);
                                } else {
                                    that.dialog.message = '请选择正确的预发布时间';
                                }
                            },
                            cancel: function() {
                                that.hideDialog();
                            }

                        }
                    })
                    break;
                case 'nouse':
                    this.textMulti = true;
                    this.dialog = {
                        show: true,
                        type: 'free',
                        ok: function() {
                            if (!that.valueTextarea) {
                                that.$store.commit('TOGGLE_DIALOG', '作废描述不能为空');
                                return;
                            }
                            that.$ajax({
                                url: '/newconsole/consoleapi/cancelProduct',
                                method: 'post',
                                data: {
                                    productId: item.productId,
                                    comment: that.valueTextarea
                                }
                            }).then(
                                function(res) {
                                    if (res.code === 0) {
                                        that.loadPlanData(1, 15, that.searchResult, function() {
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
                    break;
                default:
                    break;
            }
        },
        checkRelease: function(item, type, callback) {
            this.$ajax({
                url: '/newconsole/consoleapi/getRaiseDifference',
                method: 'post',
                data: {
                    productId: item.productId
                }
            }).then(
                function(res) {
                    if (res.code === 0) {
                        if (res.data > 0) {
                            that.dialog = {
                                show: true,
                                message: '产品所预约的债权副本发生作废，作废金额为' + res.data + '元，是否继续' + (type === 'pre' ? '预' : '') + '发布？',
                                type: 'free',
                                ok: function() {
                                    callback && callback();
                                },
                                cancel: function() {
                                    that.hideDialog();
                                }
                            }
                        } else {
                            callback && callback();
                        }
                    }
                }
            );
        },
        confirmRelease: function(name, id) {
            this.dialog = {
                show: true,
                message: '你确定要预发布' + name + '吗？',
                type: 'free',
                ok: function() {
                    that.$ajax({
                        url: '/newconsole/consoleapi/preReleaseProduct',
                        method: 'post',
                        data: {
                            productId: id,
                            preReleaseTime: that.prereleaseTime
                        }
                    }).then(
                        function(res) {
                            if (res.code === 0) {
                                that.loadPlanData(1, 15, that.searchResult, function() {
                                    that.hideDialog();
                                })
                            } else {
                                that.hideDialog();
                                // window.location.reload();
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
            this.dateMulti = false;
            this.textMulti = false;
            this.prereleaseTime = '';
            this.valueTextarea = '';
        }
    },
    components: {
        pageHead,
        tabs,
        tabPane,
        searchItems,
        tableComp,
        model,
        datepicker
    }
}
</script>
<style lang="sass">
.settlement_method {
    margin: 20px 0 20px;
}

.md-list-page {
    .md-dialog-box {
        text-align: left;
        margin-top: 42px;
        .dialog-title {
            font-weight: bold;
            text-indent: 86px;
        }
    }
    .dialog-radio-box {
        margin-left: 86px;
    }
}
</style>
