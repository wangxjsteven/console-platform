<template>
    <div>
        <search-items :itemOptions="itemOptions" @eventHandle="searchEvent"></search-items>
        <table-comp :pageInfo="pageInfo" :titles="tableTitle" :list="tableData" @btnClick="pageBtnClick" @eventHandle="tableEvent">
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
    props: {
        tableDB: {
            type: Object,
            default: function() {
                return {};
            }
        },
        itemOptions: {
            type: Object,
            default: function() {
                return {
                    wrap: false,
                    searchItems: [],
                    buttons: [{
                        name: "搜 索",
                        icon: "search",
                        type: "search",
                        btnPower: true
                    }]
                };
            }
        },
        page: {
            type: Object,
            default: function() {
                return {
                    pageNo: 1,
                    pageSize: 15
                };
            }
        },
        tableTitle: {
            type: Object,
            default: function() {
                return {};
            }
        }
    },
    data: function() {
        return {
            pageInfo: {
                pageNo: this.page.pageNo,
                pageSize: this.page.pageSize
            },
            tableData: [],
            searchResult: {}
        }
    },
    mounted: function() {
        // 按权限检测item列表中的button是否显示
        // this.checkBtnAuth();

        this.loadTableData({
            pageNo: 1
        });
    },
    methods: {
        checkBtnAuth: function() {
            let list = this.itemOptions.buttons;
            for (var i = list.length - 1; i >= 0; i--) {
                list[i].btnPower = this.$checkAuth(list[i].type);
            }
        },
        searchEvent: function(opts) {
            switch (opts.type) {
                case 'search':
                    this.searchBtnClick(opts.value);
                    break;
                case 'refresh':
                    this.refreshBtnClick(opts.value);
                    break;
            }
            this.$emit('itemEvent', opts);
        },
        tableEvent: function(opts) {
            switch (opts.type) {
                case 'page':
                    pageBtnClick(opts);
                    break;
                case 'checkbox':
                    break;
            }
            this.$emit('tableEvent', opts);
        },
        loadTableData: function(opts) {
            var self = this;
            let sendData = this.searchResult = opts.data || this.searchResult;

            this.$ajax({
                url: this.tableDB.url,
                method: this.tableDB.method,
                requestType: 'json',
                data: {
                    pageNo: this.pageInfo.pageNo,
                    pageSize: this.pageInfo.pageSize,
                    conditionData: sendData
                }
            }).then(
                function(res) {
                    if (res.code === 0) {
                        var data = res.data || {};
                        self.tableData = data.data;
                        self.pageInfo.pageCurr = data.pageNum || self.pageInfo.pageCurr;
                        self.pageInfo.pagesCount = data.pages || self.pageInfo.pagesCount;
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
        }
    }
}
</script>
