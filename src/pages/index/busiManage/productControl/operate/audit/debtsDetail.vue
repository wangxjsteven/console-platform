<template>
    <div>
            <search-items :itemOptions="dataOptions" @eventHandle="eventHandle"></search-items>
            <table-comp :pageInfo="pageInfo" :titles="tableTitle" :filter="tableFilter" :list="tableData" @btnClick="pageBtnClick" @unbind="unbindCredit">
            </table-comp>
    </div>
</template>
<script>
import searchItems from 'components/searchItems/item.vue';
import tableComp from 'components/table/table.vue';


export default {
    components: {
        searchItems,
        tableComp
    },
    data: function() {
        return {
            tableDB: {
                getCredit: {
                    url: '/newconsole/consoleapi/getCredit',
                    method: 'post'
                },
                unbind: {
                    url: '/newconsole/consoleapi/unbindCredit',
                    method: 'post'
                }
            },
            dataOptions: {
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
                    name: "债权人账号",
                    id: 'creditSign',
                    type: 'text',
                    value: ''
                }, {
                    name: "还款方式",
                    id: 'repaymentMethods',
                    type: 'select',
                    option: [{
                        text: '全部',
                        value: ''
                    }, {
                        text: '每月付息,到期还本',
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
                    name: "债权来源",
                    id: 'creditSource',
                    type: 'select',
                    option: [{
                        text: '全部',
                        value: ''
                    }, {
                        text: '新债权',
                        value: 'TZ'
                    }, {
                        text: '转让债权',
                        value: 'ZR'
                    }],
                    value: ''
                }/*, {
                    name: "生成时间",
                    id: ['beginCreateTime', 'endCreateTime'],
                    type: 'doubletime',
                    value: ''
                }, {
                    name: "预约时间",
                    id: ['beginBookTime', 'endBookTime'],
                    type: 'doubletime',
                    value: ''
                }*/],
                buttons: [{
                    name: "搜 索",
                    icon: "search",
                    type: "search",
                    btnPower: true //this.$checkAuth('select')
                }]
            },
            pageInfo: {
                pageNo: 1,
                pageSize: 15
            },
            tableFilter: {},
            tableData: [],
            tableTitle: {
                // ordinal: false, //配置序号是否展示
                tits: [{
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
                    type:'rate'
                }, {
                    name: "债权本金",
                    id: 'creditPrincipal',
                    type: 'money'
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
                }]
            },
            searchResult: {}
        }
    },
    beforeRouteEnter: function(to, from, next) {
        next(vm => {
            vm.loadTableData({
                pageNo: 1
            });
        })
    },
    mounted: function() {
        // this.refreshAuth();
        this.loadTableData({
            pageNo: 1
        });
    },
    methods: {
        eventHandle: function(opts) {
            let type = opts.type;
            switch (type) {
                case 'toadd':
                    this.switchNew(true);
                    break;
                case 'refresh':
                    this.refreshBtnClick(opts.value);
                    break;
                case 'search':
                    this.searchBtnClick(opts.value);
                    break;
            }
        },
        refreshAuth: function(type) {
            let list = this.dataOptions.buttons;
            for (var i = list.length - 1; i >= 0; i--) {
                list[i].btnPower = this.$checkAuth(list[i].type);
            }
        },
        unbindCredit: function(item) {
            var self = this;
            self.$store.commit('TOGGLE_DIALOG', {
                message: '您确定解绑该债权副本吗？',
                ok: function() {
                    self.$ajax({
                        url: self.tableDB.unbind.url,
                        method: self.tableDB.unbind.method,
                        data: {
                            creditCopyId: item.creditCopyId
                        }
                    }).then(
                        function(res) {
                            if (res.code === 0) {
                                self.$store.commit('TOGGLE_DIALOG', '解绑成功');
                                self.loadTableData({
                                    pageNo: 1
                                });
                            }
                        }
                    ).catch(function(error) {
                        self.$store.commit('TOGGLE_DIALOG', error.message)
                    })
                }
            })
        },
        loadTableData: function(opts) {
            var self = this;
            let sendData = this.searchResult = opts.data || this.searchResult;

            this.pageInfo.pageNo = opts.pageNo || this.pageInfo.pageNo;
            this.pageInfo.pageSize = opts.pageSize || this.pageInfo.pageSize;
            this.$ajax({
                url: this.tableDB.getCredit.url,
                method: this.tableDB.getCredit.method,
                requestType: 'json',
                data: {
                    pageNo: this.pageInfo.pageNo,
                    pageSize: this.pageInfo.pageSize,
                    productId: +this.$route.query.id,
                    conditionData: sendData
                }
            }).then(
                function(res) {
                    if (res.code === 0) {
                        var data = res.data || {};
                        self.tableData = data.data;
                        self.pageInfo.pageCurr = data.pageNum || self.pageInfo.pageCurr;
                        self.pageInfo.pagesCount = data.pageNum || self.pageInfo.pagesCount;
                    }
                }
            ).catch(function(error) {
                self.$store.commit('TOGGLE_DIALOG', error.message)
            })
        },
        searchBtnClick: function(data) {
            this.loadTableData({
                pageNo: 1,
                data: data
            });
        },
        refreshBtnClick: function(data) {
            this.loadTableData({
                pageNo: 1,
                data: data
            });
        },
        pageBtnClick: function(no) {
            // 翻页请求数据
            this.loadTableData({
                pageNo: no
            });
        },
        pageBtnListDetail: function(no) {
            // 翻页请求数据
            this.loadTableData({
                pageNo: no
            });
        }
    }
}
</script>
