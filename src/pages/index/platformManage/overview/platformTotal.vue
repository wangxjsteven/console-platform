<style lang="sass">
.column {
    display: block;
    -ms-flex-preferred-size: 0;
    flex-basis: 0;
    -ms-flex-positive: 1;
    flex-grow: 1;
    -ms-flex-negative: 1;
    flex-shrink: 1;
    padding-top: 5px;
    margin-bottom: 15px;
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
.bolock-diliver{
    height: 50px;
}
.main-table th:first-child{
    border:none;
}
.no-boder{
    border:none;
}
</style>
<template>
    <div class="container-section col-sm-11 col-md-12" id="containerSection">
        <page-head></page-head>

        <div class="search-items">
            <div class="column">
                <div class="control has-addons">
                    <label class="button is-info">实时数据</label>
                    <span class="button is-info">{{latestTable.realTime}}</span>
                </div>
                <div class="control has-addons">
                    <label class="button is-info">平台</label>
                    <div class="btn-group">
                        <button type="button" class="btn btn-default" v-for="item in platforms" :class="{'btn-primary': latestTable.platform === item.platform}" @click="latestTable.platform = item.platform;loadPaginationData(1)">{{item.name}}</button>
                    </div>
                </div>
            </div>
        </div>
        <table-comp :server="latestTable.tableDB" :titles="tableTitle" :filter="latestTable.tableFilter" :list="latestTable.tableData" :pageshide="latestTable.pageshide">
            <tr slot="customizeTh">
                <th class="no-boder"></th>
                <th ></th>
                <th colspan="5">总况</th>
                <th colspan="8">产品成交</th>
            </tr>
        </table-comp>
        
        <div class="bolock-diliver"></div>

        <div class="search-items">
            <div class="columns">
                <div class="column">
                    <div class="control has-addons">
                        <label class="button is-info">日期区间</label>
                        <datepicker @change="changeFrom"></datepicker>
                        <span>至</span>
                        <datepicker @change="changeTo"></datepicker>
                        <!-- <div class="btn-group">
                            <button type="button" class="btn btn-default" v-for="item in dataTypes" :class="{'btn-primary': searchTable.dateType === item.type}" @click="searchTable.dateType = item.type;">{{item.name}}</button>
                        </div> -->
                    </div>
                    <div class="control has-addons">
                        <label class="button is-info">平台</label>
                        <div class="btn-group">
                            <button type="button" class="btn btn-default" v-for="item in platforms" :class="{'btn-primary': searchTable.platform === item.platform}" @click="searchTable.platform = item.platform;">{{item.name}}</button>
                        </div>                        
                    </div>
                    <div class="buttons">                        
                        <button class="btn btn-primary btn-search" @click="loadPaginationData2(1)"><i class="fa fa-search"></i>搜 索</button>
                        <button class="btn btn-primary" @click="detailsOut"><i class="fa fa-sign-out"></i>导出CSV</button>
                    </div>
                </div>
            </div>
        </div>
        <table-comp2 :server="searchTable.tableDB" :titles="tableTitle" :filter="searchTable.tableFilter" :list="searchTable.tableData" :pageInfo="searchTable.pageInfo" @btnClick="loadPaginationData2">
            <tr slot="customizeTh">
                <th></th>
                <th colspan="5">总况</th>
                <th colspan="8">产品成交</th>
            </tr>
        </table-comp2>
    </div>
</template>
<script>

import pageHead from '@/components/pageHead.vue';
import tableComp from '@/components/table/table.vue';
import tableComp2 from '@/components/table/table.vue';
import datepicker from '@/components/datepicker/date.vue';
import Util from '@/assets/js/util';
import Ajax from 'assets/js/ajax.js';

var that = null,
    firstComponent = 0,
    PAGE_SIZE = 24;
export default {
    data: function() {
        that = this;
        return {
            platforms:[
                {
                    name: '全部',
                    platform: 'all'
                },
                {
                    name: 'APP',
                    platform: 'app'
                },
                {
                    name: 'H5',
                    platform: 'h5'
                },
                {
                    name: 'PC',
                    platform: 'pc'
                },
                {
                    name: 'XT',
                    platform: 'xt'
                }
            ],
            dataTypes:[
                {
                    name: '  天  ',
                    type: 'day'
                },
                {
                    name: '小时',
                    type: 'hour'
                }
            ],
            tableTitle: {
                ordinal: false,//配置序号是否展示
                tits: [
                {
                    name: "时点",
                    id: 'show_time'
                },{
                    name: "累计注册用户数",
                    id: 'total_registraters'
                }, {
                    name: "累计投资用户数",
                    id: 'total_investors'
                }, {
                    name: "累计成交金额",
                    id: 'total_amount'
                }, {
                    name: "当天成交用户数",
                    id: 'day_investors'
                }, {
                    name: "当天成交金额",
                    id: 'day_amount'
                }, {
                    name: "定期产品成交人数",
                    id: 'day_dq_investors'
                }, {
                    name: "定期产品成交金额",
                    id: 'day_dq_amount'
                }, {
                    name: "债权转让成交人数",
                    id: 'day_zqzr_investors'
                }, {
                    name: "债权转让成交金额",
                    id: 'day_zqzr_amount'
                }, {
                    name: "零钱包成交人数",
                    id: 'day_hqb_investors'
                }, {
                    name: "零钱包成交金额",
                    id: 'day_hqb_amount'
                }, {
                    name: "零钱包赎回人数",
                    id: 'day_hqb_ransom_investors'
                }, {
                    name: "零钱包赎回金额",
                    id: 'day_hqb_ransom_amount'
                }]
            },
            latestTable: {
                platform: 'all',
                pageshide:1,
                tableFilter: {                
                },
                tableDB: {
                    url: '/newconsole/consoleapi/dataplatform/realTime',
                    type: 'get'
                },
                allInfo: undefined,//所有的数据
                realTime: undefined,//实时时间
                tableData:[],
            },
            searchTable: {
                platform: 'all',
                pageInfo:{   
                    pageCurr: 1,
                    pagesCount: 1  
                },
                dateFrom: '',
                dateTo: '',
                tableFilter: {                
                },
                dateType: 'day',
                tableDB: {
                    url: '/newconsole/consoleapi/dataplatform/dataDetails',
                    type: 'get'
                },
                tableData:[]
            },
            outport:{
                url: '/newconsole/consoleapi/dataplatform/exportDataDetails',
                type: 'post'
            }           
        }
    },
    watch: {

    },
    beforeRouteEnter: function(to, from, next) {
        next(vm => {
            // 通过 `vm` 访问组件实例
            if (firstComponent > 1) {
                vm.loadPaginationData(1);
            }
            firstComponent++;
        })
    },
    methods: {
        changeFrom: function(date) {
            this.searchTable.dateFrom = date;
        },
        changeTo: function(date) {
            this.searchTable.dateTo = date;
        },
        loadPaginationData: function(pageNo, resolve, addcomponent) {
            if(!that.latestTable.allInfo){//第一次需要从远程拉取数据
                new Ajax({
                    url: this.latestTable.tableDB.url,
                    method: this.latestTable.tableDB.type,
                    dataType: 'json',
                    data:{
                        pageNo: pageNo,
                        pageSize: PAGE_SIZE
                    },
                    success: function(data) {
                        var tableInfo = that.latestTable;
                        tableInfo.allInfo = data.realTimesData;
                        tableInfo.realTime = Util.dateFormat((new Date(tableInfo.allInfo.realTime)),"yyyy年MM月d日 h:m:s");
                        tableInfo.tableData = tableInfo.allInfo.all;
                        tableInfo.tableData[0].show_time = '今日';
                        tableInfo.tableData[1].show_time = '昨日';
                        addcomponent && require(['@/components/table/table.vue'], resolve);
                    },
                    dataError: function(code, err) {
                        if (code === 1003) {
                            location.href = 'login.html#/login';
                        }
                        alert(err);
                    },
                    error: function(code, err, url) {
                        alert(code + "\n" +
                            url + "\n" +
                            err);
                    }
                });
            }else{
                var tableInfo = that.latestTable;
                tableInfo.tableData = tableInfo.allInfo[that.latestTable.platform];
                tableInfo.tableData[0].show_time = '今日';
                tableInfo.tableData[1].show_time = '昨日';
                addcomponent && require(['@/components/table/table.vue'], resolve);
            }
        },
        loadPaginationData2: function(pageNo, resolve, addcomponent) {
            function creatFormat(){
                return that.searchTable.dataType === 'day'?
                    function(time){
                        return Util.dateFormat((new Date(time)),"yyyy-MM-d");
                    }:
                    function(time){
                        return Util.dateFormat((new Date(time)),"hh点");
                    };
            }
            if(this.searchTable.dateFrom > this.searchTable.dateTo){
                alert("开始日期大于结束日期，请重新选择！");
                return;
            }else if(this.searchTable.dateFrom === this.searchTable.dateTo){
                that.searchTable.dataType = 'hour';
            }else{
                that.searchTable.dataType = 'day';
            }
            new Ajax({
                url: this.searchTable.tableDB.url,
                method: this.searchTable.tableDB.type,
                dataType: 'json',
                data:{
                    currentPage: pageNo,
                    pageSize: PAGE_SIZE,
                    platform: this.searchTable.platform,
                    startTime: this.searchTable.dateFrom,
                    endTime: this.searchTable.dateTo
                },
                success: function(data) {
                    var format = creatFormat(),
                        tables;
                    that.searchTable.tableData=data.dataDetails;
                    tables = that.searchTable;
                    tables.pageInfo = {   
                        pageCurr: data.pages.pageNum,
                        pagesCount: data.pages.pages  
                    };

                    for(var i = 0, items = tables.tableData, max = items.length; i < max; i++ ){
                        items[i].show_time = format(items[i].createTime);
                    }
                    addcomponent && require(['@/components/table/table.vue'], resolve);
                },
                dataError: function(code, err) {
                    if (code === 1003) {
                        location.href = 'login.html#/login';
                    }
                    alert(err);
                },
                error: function(code, err, url) {
                    alert(code + "\n" +
                        url + "\n" +
                        err);
                }
            });
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
        detailsOut: function(){
            var str = 'type=' + (this.searchTable.dateFrom === this.searchTable.dateTo? 'hour': 'day')
                + '&source=' + this.searchTable.platform
                + '&startTime=' + this.searchTable.dateFrom
                + '&endTime=' + this.searchTable.dateTo;
            window.location = this.outport.url + '?' + str;
            // new Ajax({
            //     url: this.outport.url,
            //     method: this.outport.type,
            //     data:{
            //         type: this.searchTable.dateFrom === this.searchTable.dateTo? 'hour': 'day',
            //         source: this.searchTable.platform,
            //         startTime: this.searchTable.dateFrom,
            //         endTime: this.searchTable.dateTo
            //     },
            //     success: function(data) {
                    
            //     },
            //     dataError: function(code, err) {
            //         if (code === 1003) {
            //             location.href = 'login.html#/login';
            //         }
            //         alert(err);
            //     },
            //     error: function(code, err, url) {
            //         alert(code + "\n" +
            //             url + "\n" +
            //             err);
            //     }
            // });
        }
    },
    components: {
        pageHead,
        datepicker,
        tableComp: function(resolve) {
            that.loadPaginationData(1, resolve, true);
        },
        tableComp2: function(resolve) {
            that.loadPaginationData2(1, resolve, true);
        },
        pagination: function(resolve) {
            //异步组件写法
            if (firstComponent === 0) {
                firstComponent++;
            }
        }
    },
}

</script>
