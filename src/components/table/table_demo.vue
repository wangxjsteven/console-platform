<style lang="sass">
.md-table-demo{
    .column {
        display: block;
        -ms-flex-preferred-size: 0;
        flex-basis: 0;
        -ms-flex-positive: 1;
        flex-grow: 1;
        -ms-flex-negative: 1;
        flex-shrink: 1;
        padding-top: 5px;
        p {
            margin: 0;
        }
        .control {
            position: relative;
            text-align: left;
            &.has-addons {
                display: inline-block;
            }
        }
        input,
        select {
            //border-radius: 0 3px 3px 0;
            width: 150px;
            height: 24px;
        }
        label {
            width: 100px;
            margin-bottom: 0;
            line-height: 24px;
            font-size: 14px;
            font-weight: normal;
            text-align: right;
            margin-right: 10px;
        }
    }

    .buttons {
        margin: 15px 0;
        .btn-search {
            margin: 0 10px 0 44px;
        }
    }

    .total-money {
        color: #f00;
    }

    .debt-money {
        margin-right: 20px;
    }

    .page-bar {
        display: inline-block;
    }

    .fa {
        margin-right: 5px;
    }
}
</style>
<template>
    <div class="container-section col-sm-11 col-md-12 md-table-demo" id="containerSection">
        <page-head p-title="业务管理&nbsp;&nbsp;/&nbsp;&nbsp;债权管理/&nbsp;&nbsp;真实债券管理"></page-head>
        <div class="search-items">
            <div class="columns">
                <div class="column">
                    <p class="control has-addons">
                        <label class="button is-info">借款标题</label>
                        <input type="text" class="input form-input">
                    </p>
                    <p class="control has-addons">
                        <label class="button is-info">债权ID</label>
                        <input type="text" class="input form-input">
                    </p>
                    <p class="control has-addons">
                        <label class="button is-info">借款人姓名</label>
                        <input type="text" class="input form-input">
                    </p>
                </div>
                <div class="column">
                    <p class="control has-addons">
                        <label class="button is-info">借款人账号</label>
                        <input type="text" class="input form-input">
                    </p>
                    <p class="control has-addons">
                        <label class="button is-info">关联理财产品</label>
                        <input type="text" class="input form-input">
                    </p>
                    <p class="control has-addons">
                        <label class="button is-info">债权标识</label>
                        <select class="form-input">
                            <option>General enquiry</option>
                        </select>
                    </p>
                </div>
                <div class="column">
                    <p class="control has-addons">
                        <label class="button is-info">还款方式</label>
                        <select class="form-input">
                            <option>General enquiry</option>
                        </select>
                    </p>
                    <p class="control has-addons">
                        <label class="button is-info">债权状态</label>
                        <select class="form-input">
                            <option>General enquiry</option>
                        </select>
                    </p>
                    <p class="control has-addons">
                        <label class="button is-info">生成时间</label>
                        <datepicker @change="changeFrom"></datepicker>
                        <span>至</span>
                        <datepicker @change="changeTo"></datepicker>
                    </p>
                </div>
            </div>
            <div class="buttons">
                <button class="btn btn-primary btn-search"><i class="fa fa-search"></i>搜 索</button>
                <button class="btn btn-primary"><i class="fa fa-sign-out"></i>导 出</button>
            </div>
        </div>
        <table-comp :server="tableDB" :pageInfo="pageInfo" :titles="tableTitle" :filter="tableFilter" :list="tableData" @btnClick="pageBtnClick">
        </table-comp>
    </div>
</template>
<script>
import pageHead from '@/components/pageHead.vue';
import tableComp from '@/components/table/table.vue';
import datepicker from '@/components/datepicker/date.vue';
import Util from '@/assets/js/util';
var that = null,
    firstComponent = 0;
export default {
    data: function() {
        that = this;
        return {
            dateFrom: '',
            dateTo: '',
            pageInfo:{},
            tableFilter: {},
            tableDB: {
                url: '/newconsole/consoleapi/table',
                type: 'get'
            },
            tableData:[],
            tableTitle: {
                ordinal: true,//配置序号是否展示
                tits: [{
                    name: "债权标识",
                    id: 'creditSign'
                }, {
                    name: "债权状态",
                    id: 'creditStatus'
                }, {
                    name: "借款标题",
                    id: 'creditTitle'
                }, {
                    name: "债权ID",
                    id: 'creditId'
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
                    id: 'interestDate'
                }, {
                    name: "到期日期",
                    id: 'dueDate'
                }, {
                    name: "债权年利率",
                    id: 'creditRate'
                }, {
                    name: "债权本金",
                    id: 'creditPrincipal'
                }, {
                    name: "还款方式",
                    id: 'repaymentMethods'
                }, {
                    name: "关联理财产品",
                    id: 'relatedProducts'
                }, {
                    name: "生成时间",
                    id: 'generationTime'
                }]
            }
        }
    },
    beforeRouteEnter: function(to, from, next) {
        next(vm => {
            // 通过 `vm` 访问组件实例
            if(firstComponent > 1){
                vm.loadTableData(1, 10);
            }
            firstComponent++;
        })
    },
    methods: {
        changeFrom: function(date) {
            this.dateFrom = date
        },
        changeTo: function(date) {
            this.dateTo = date
        },
        loadTableData: function (pageNo, pageSize, resolve, addcomponent){
            Util.ajax(
                this.tableDB.url, {
                    pageNo: pageNo,
                    pageSize: pageSize
                },
                this.tableDB.type,
                function(res) {
                    if (res.code === 0) {
                        var data=res.data||{};
                        // if (data.pages > 1) {
                            that.tableData = data.creditData;
                            that.pageInfo = {
                                "pageCurr": data.pageCurr,
                                "pagesCount": data.pagesCount
                            }
                            addcomponent && require(['@/components/table/table.vue'], resolve);
                        // }
                    } else {
                        alert(res.message);
                    }
                }
            );
        },
        filterRole: function() {
            this.seachResult = [];
            this.userlist = this.backupResult;
            for (var i = 0, len = this.userlist.length; i < len; i++) {
                var item = this.userlist[i],
                    name = item.roleName;
                if (name.indexOf(this.searchRole) > -1) {
                    this.seachResult.push(item);
                }
            }
            this.userlist = this.seachResult;
        },
        pageBtnClick: function(data){
            // 翻页请求数据
            this.loadTableData(data, 10);
        }
    },
    components: {
        pageHead,
        datepicker,
        tableComp: function(resolve) {
            //异步组件写法
            if(firstComponent === 0){
                firstComponent ++;
                that.loadTableData(1, 10, resolve, true);
            }
        }
    },
}
</script>
