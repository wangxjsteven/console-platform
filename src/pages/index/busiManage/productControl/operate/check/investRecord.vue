<template>
    <div>
        <table-comp :pageInfo="pageInfo" :titles="tableTitle[urltype]" :filter="tableFilter" :list="tableData" @btnClick="pageBtnClick">
        </table-comp>
    </div>
</template>
<script>
import searchItems from 'components/searchItems/item.vue';
import tableComp from 'components/table/table.vue';


export default {
    props: ['urltype'],
    components: {
        searchItems,
        tableComp
    },
    data: function() {
        return {
            tableDB: {
                invest: {
                    url: '/newconsole/consoleapi/getInvestRecord',
                    method: 'post'
                },
                repay: {
                    url: '/newconsole/consoleapi/getRepaymentList',
                    method: 'post'
                }
            },
            pageInfo: {
                pageNo: 1,
                pageSize: 15
            },
            tableFilter: {},
            tableData: [],
            tableTitle: {
                'invest': {
                    ordinal: true, //配置序号是否展示
                    tits: [{
                        name: "用户账号",
                        id: 'userName'
                    }, {
                        name: "身份证号码",
                        id: 'idCard'
                    }, {
                        name: "投资年利率",
                        id: 'annualRate',
                        type: 'rate'
                    }, {
                        name: "认购金额(万)",
                        id: 'investAmount',
                        type: 'money-simple'
                    }, {
                        name: "认购时间",
                        id: 'createTime',
                        type: 'date-time'
                    }, {
                        name: "注册时间",
                        id: 'registrationTime',
                        type: 'date-time'
                    }]
                },
                'repay': {
                    ordinal: true, //配置序号是否展示
                    tits: [{
                        name: "合约还款日期",
                        id: 'shouldRepayDate',
                        type: 'date'
                    }, {
                        name: "状态",
                        id: 'repayStatus'
                    }, {
                        name: "科目",
                        id: 'tradeType'
                    }, {
                        name: "金额(元)",
                        id: 'repayAmount',
                        type: 'money'
                    }, {
                        name: "实际还款日期",
                        id: 'realRepayTime',
                        type: 'date-time'
                    }]
                }
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
                case 'refresh':
                    this.refreshBtnClick(opts.value);
                    break;
                case 'search':
                    this.searchBtnClick(opts.value);
                    break;
            }
        },
        loadTableData: function(opts) {
            var self = this;
            let sendData = {}; //this.searchResult = opts.data || this.searchResult;

            this.pageInfo.pageNo = opts.pageNo || this.pageInfo.pageNo;
            this.pageInfo.pageSize = opts.pageSize || this.pageInfo.pageSize;
            this.$ajax({
                url: this.tableDB[this.urltype].url,
                method: this.tableDB[this.urltype].method,
                requestType:'json',
                data: {
                    'pageNo': this.pageInfo.pageNo,
                    'pageSize': this.pageInfo.pageSize,
                    'productId': +this.$route.query.id
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
<style lang="sass">
.settlementMethod {
    margin: 10px 0 20px;
}


/* .product-edit-section{
  .edit-product{
    margin-left: 0;
  }
} */
</style>
