<style lang="sass">
.product-add-credit {
    .add-credit-bottom {
        margin-top: 30px;
    }
}
</style>
<template>
    <div class="product-add-credit">
        <search-items :itemOptions="dataOptions" @eventHandle="eventHandle"></search-items>
        <table-comp :server="tableDB.data" :pageInfo="pageInfo" :titles="tableTitle" :filter="tableFilter" :list="tableData" @btnClick="pageBtnClick" @checkbox="recordCredit">
        </table-comp>
        <div class="add-credit-bottom col-sm-offset-4 col-sm-3 col-md-4">
            <button type="submit" class="btn btn-primary" @click.prevent='addCredit'>确定</button>
            <button type="submit" class="btn btn-default" @click.prevent='goback'>取消</button>
        </div>
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
            selectedList: [],
            tableDB: {
                getOrderCredit: {
                    url: '/newconsole/consoleapi/getOrderCredit',
                    method: 'post'
                },
                addCredit: {
                    url: '/newconsole/consoleapi/addCredit',
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
                    }
                    /*, {
                        name: "生成时间",
                        id: ['beginCreateTime', 'endCreateTime'],
                        type: 'doubletime',
                        value: ''
                    }, {
                        name: "预约时间",
                        id: ['beginBookTime', 'endBookTime'],
                        type: 'doubletime',
                        value: ''
                    }*/
                ],
                buttons: [{
                    name: "搜 索",
                    icon: "search",
                    type: "search",
                    btnPower: true //this.$checkAuth('search')
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
                    name: "选择",
                    id: 'showState',
                    type: '',
                    filed: '__checkbox',
                    buttons: ['']
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
                    id: 'waitZrValue'
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
        this.loadTableData({
            pageNo: 1
        });
    },
    methods: {
        eventHandle: function(opts) {
            let type = opts.type;
            switch (type) {
                case 'search':
                    this.searchBtnClick(opts.value);
                    break;
            }
        },
        goback: function() {
            this.$emit('goback');
        },
        recordCredit: function(item, type) {
            let list = this.selectedList;
            let record = false;
            if (type) {
                for (let i = list.length - 1; i >= 0; i--) {
                    let creditCopyId = list[i];
                    if (creditCopyId === item.creditCopyId) {
                        record = true;
                    }
                }
                if (!record) {
                    list.push(item.creditCopyId);
                }
            } else {
                for (let i = list.length - 1; i >= 0; i--) {
                    let creditCopyId = list[i];
                    if (creditCopyId === item.creditCopyId) {
                        list.splice(i, 1);
                    }
                }
            }
            this.selectedList = list;
        },
        addCredit: function(item) {
            let self = this;
            if (this.selectedList.length === 0) {
                self.$store.commit('TOGGLE_DIALOG', '未选择可预约债权');
                return;
            }
            self.$ajax({
                url: self.tableDB.addCredit.url,
                method: self.tableDB.addCredit.method,
                requestType: 'json',
                data: {
                    productId: +this.$route.query.id,
                    creditCopyIds: this.selectedList
                }
            }).then(
                function(res) {
                    if (res.code === 0) {
                        // 清空数据防止记录
                        self.selectedList = [];
                        self.loadTableData();
                        self.$store.commit('TOGGLE_DIALOG', {
                            message: '新增成功',
                            autohide: true
                        })
                    }
                }
            ).catch(function(error) {
                self.$store.commit('TOGGLE_DIALOG', error.message)
            })
        },
        loadTableData: function(opts) {
            let self = this,
                _opts = opts || {};
            let sendData = this.searchResult = _opts.data || this.searchResult;

            this.selectedList = [];
            this.pageInfo.pageNo = _opts.pageNo || this.pageInfo.pageNo;
            this.pageInfo.pageSize = _opts.pageSize || this.pageInfo.pageSize;
            this.$ajax({
                url: this.tableDB.getOrderCredit.url,
                method: this.tableDB.getOrderCredit.method,
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
                        let data = res.data || {};
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
