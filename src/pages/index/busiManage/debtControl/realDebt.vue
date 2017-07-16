<template>
    <div class="container-section col-sm-11 col-md-12" id="containerSection">
        <page-head></page-head>
        <search-items :itemOptions="itemOptions" @eventHandle="eventHandle"></search-items>
        <table-comp :server="tableDB" :pageInfo="pageInfo" :titles="tableTitle" :filter="tableFilter" :list="tableData" @btnClick="pageBtnClick">
            <span slot="debt-info" class="debt-money">债权总金额：<i class="total-money">{{totalAmount||0}}</i>元</span>
        </table-comp>
    </div>
</template>

<script>
    import pageHead from '@/components/pageHead';
    import searchItems from '@/components/searchItems/item';
    import Util from '@/assets/js/util';
    import tableComp from '@/components/table/table';
    // import Ajax from '@/assets/js/ajax.js';
    var that = null,
        firstComponent = 0;
    export default{
        data: function(){
            that = this;
            return {
                itemOptions:{
                    colCount: 5,
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
                    },{
                        name: "债权人姓名",
                        id: 'creditorName',
                        type: 'text',
                        value: ''
                    }, {
                        name: "债权人账号",
                        id: 'creditAccount',
                        type: 'text',
                        value: ''
                    }, {
                        name: "关联理财产品",
                        id: 'relatedProducts',
                        type: 'text',
                        value: ''
                    },{
                        name: "债权标识",
                        id: 'creditSign',
                        type: 'select',
                        option:[{
                            text: '全部',
                            value: ''
                        },{
                            text: '理财计划',
                            value: 'LCJH'
                        }],
                        value: ''
                    },{
                        name: "债权状态",
                        id: 'creditStatus',
                        type: 'select',
                        option:[{
                            text: '全部',
                            value: ''
                        },{
                            text: '还款中',
                            value: 'HKZ'
                        },{
                            text: '已结清',
                            value: 'YJQ'
                        }],
                        value: ''
                    },{
                        name: "还款方式",
                        id: 'repaymentMethods',
                        type: 'select',
                        option:[{
                            text: '全部',
                            value: ''
                        },{
                            text: '每月付息，到期还本',
                            value: 'MYFX'
                        },{
                            text: '等额本息',
                            value: 'DEBX'
                        },{
                            text: '等额本金',
                            value: 'DEBJ'
                        },{
                            text: '一次性付清',
                            value: 'YCFQ'
                        }],
                        value: ''
                    }/*,  {
                        name: "生成时间",
                        id: ['beginTime','endTime'],
                        type: 'doubletime',//time标示一个时间选项，times标示有起始时间
                        value: ''
                    }*/],
                    buttons:[{
                        name: "搜 索",
                        icon: "search",
                        type: "search",
                        btnPower: 'select'
                    },{
                        name: "导 出",
                        icon: "sign-out",
                        type: "export",
                        btnPower: ''
                    }]
                },
                pageInfo:{},
                tableFilter: {},
                tableDB: {
                    url: '/newconsole/consoleapi/realCreditSearch',
                    type: 'post'
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
                        id: 'loanTitle'
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
                        name: "关联理财产品",
                        id: 'relatedProducts'
                    }, {
                        name: "生成时间",
                        id: 'generationTime',
                        type: 'date-time'
                    }]
                },
                totalAmount: 0,
                searchResult: {}
            }
        },
        beforeRouteEnter: function(to, from, next) {
            next(vm => {
            // 通过 `vm` 访问组件实例
                vm.loadTableData(1, 15, vm.searchResult);
            })
        },
        methods: {
            eventHandle: function(opts) {
                let type = opts.type;
                switch (type) {
                  case 'search':
                      this.searchBtnClick(opts.value);
                      break;
                  case 'export':
                      this.exportBtnClick(opts.value);
                      break;
                }
            },
            loadTableData: function (pageNo, pageSize,conditionData){
            this.$ajax({
                url: this.tableDB.url,
                method: this.tableDB.type,
                requestType:'json',//默认提交类型是application/x-www-form-urlencoded;charset=utf-8，需要与后台约定
                data: {
                    pageNo: pageNo,
                    pageSize: pageSize,
                    conditionData: conditionData
                }
            }).then(
                    function(res) {
                        if (res.code === 0) {
                            let data = res.data||{};
                            that.tableData = data.data;
                            that.pageInfo = {
                                "pageCurr": data.pageNum,
                                "pagesCount": data.pages
                            }
                            that.totalAmount = data.totalAmount;
                        }
                    }
                )
            },
            filterRole: function(){
                this.seachResult = [];
                this.userlist = this.backupResult;
                for(var i = 0, len = this.userlist.length; i < len; i++){
                    var item = this.userlist[i],
                        name = item.roleName;
                    if(name.indexOf(this.searchRole) > -1){
                        this.seachResult.push(item);
                    }
                }
                this.userlist = this.seachResult;
            },
            pageBtnClick: function(data){
                // 翻页请求数据
                this.loadTableData(data, 15, this.searchResult);
            },
            searchBtnClick: function(data){
                this.searchResult = data;
                this.loadTableData(1, 15, data);
            },
            exportBtnClick: function(){
            }
        },
        components: {
            pageHead,searchItems,tableComp
        }
    }
</script>

