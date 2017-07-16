<template>
    <div class="md-table">
        <div class="main-table">
            <table class="table table-striped" :style="{maxWidth:titles.tableMaxWidth}">
                <thead>
                    <slot name='customizeTh'></slot>
                    <tr>
                        <th v-if="titles.ordinal" :style="thWidth(titles)">序号</th>
                        <th v-for='(title, index) in titles.tits' :style="thWidth(titles)">{{title.name}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="list&&list.length !== 0" v-for='(item, index) in list'>
                        <td v-if="titles.ordinal">{{index + 1}}</td>
                        <template v-for="ti in titles.tits">
                            <td v-if="!ti.filed" v-html="dataFarmat(item, ti)">
                            </td>
                            <td v-if="ti.filed == '__checkbox'" class="vuetable-checkboxes">
                                <input type="checkbox" @change="toggleCheckbox($event.target.checked, item, ti.filed)" :checked="rowSelected(item)">
                            </td>
                            <td v-if="ti.filed == '__input'" class="uetable-checkboxes">
                                <input class="table-input" v-show="modifyValue[index]" type="text" v-model='item[ti.id]'>
                                <span v-if="ti.type === 'rate'" class="rate-area">{{formatInputValue(item[ti.id], index)}}</span>
                                <span v-if="ti.type === 'rate'">%</span>
                            </td>
                            <td v-if="ti.filed == '__buttons'">
                                <template v-for="btn in ti.buttons">
                                    <button class="btn-table btn-effect" @click="callAction(ti, item, index)">
                                        {{currBtnTxt[index] || txtTrans[btn] || dataFarmat(item, ti)}}
                                    </button>
                                </template>
                            </td>
                            <td v-if="ti.filed == '__buttonsState'">
                                <template v-for="abtn in ti.allBtn">
                                    <button v-if="power(abtn.btnPower)" class="btn-table btn-multi-table" :class="{'btn-disabled':matchStateBtn(abtn, ti.buttons, item[ti.stateName], item[ti.idName])}" @click="multBtncCallAction(abtn, ti, item)">
                                        {{txtTrans[abtn.name]||abtn.name}}
                                    </button>
                                </template>
                            </td>
                        </template>
                    </tr>
                    <tr v-if="list&&list.length === 0">
                        <td :colspan="titLen">暂无数据！</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="debt-footer">
            <slot name='debt-info'></slot>
            <pagination :cur.sync="pageInfo.pageCurr" :all.sync="pageInfo.pagesCount" @btnClick="pageBtnClick" v-if="pageshide? 0: 1"></pagination>
        </div>
    </div>
</template>
<script>
import Util from '@/assets/js/util';
import pagination from '@/components/pagination.vue';
import moment from 'moment';

var that = null,
    firstComponent = 0;

let get_tarns_text = require('assets/js/map_field.js')
let self;

export default {
    props: {
        //pagesHide表示翻页是否要隐藏，默认不隐藏，1:表示隐藏，0:表示不隐藏
        pageshide: {
            type: Number,
            default: function() {
                return 0;
            }
        },
        pageInfo: {
            type: Object,
            default: function() {
                return {
                    pageCurr: 1,
                    pagesCount: 1
                }
            }
        },
        titles: {
            type: Object,
            default: function() {
                return {
                    tableMaxWidth: "700px",
                    ordinal: false, //配置序号是否展示
                    tits: []
                }
            }
        },
        list: {
            type: Array,
            default: function() {
                return []
            }
        },
        filter: {
            type: Object,
            default: function() {
                return {}
            }
        },
        isRateTable: {
            type: Boolean,
            default: function() {
                return false
            }
        }
    },
    data() {
        self = this;
        return {
            stateStore: {},
            modifyValue: [],
            updateRate: [],
            currBtnTxt: {},
            txtTrans: get_tarns_text('mapping')
        }
    },
    computed: {
        titLen: function() {
            let len = this.titles.tits.length
            if (this.titles.ordinal) {
                len = len + 1
            }
            return len
        }
    },
    mounted: function() {
        this.list.forEach(function(item, index) {
            self.$set(self.modifyValue, index, false)
            self.$set(self.updateRate, index, 0)
            self.$set(self.currBtnTxt, index, '')
        })
    },
    methods: {
        thWidth: function(titles) {
            return titles.colStyle === 'average' ? {
                width: (100 * 1 / this.titLen).toFixed(2) + '%'
            } : {};
        },
        power: function(type) {
            // let result = {
            //     'select': this.$checkAuth("select"),
            //     'edit': this.$checkAuth("edit"),
            //     'check': this.$checkAuth("check"),
            //     'release': this.$checkAuth("release"),
            //     'prerelease': this.$checkAuth("prerelease"),
            //     'delete': this.$checkAuth("delete")
            // }
            return this.$checkAuth(type);
        },
        matchStateBtn: function(abtn, button, type, id) {
            if (!button) {
                return false;
            }
            let res = button[this.definePType(type)] || button['OTHER'];
            this.stateStore[id + '-' + abtn.name] = false
            for (let item in res) {
                if (abtn.name === res[item]) {
                    this.stateStore[id + '-' + abtn.name] = true
                    return false
                }
            }
            return true
        },
        toggleCheckbox: function(target, item, name) {
            this.$emit('checkbox', item, target)
        },
        rowSelected: function(item, name) {
            return false;
        },
        getClass: function(css) {
            return {};
        },
        definePType: function(type) {
            let result = '';
            switch (type) {
                case 'SQZ':
                    result = 'SQZ';
                    break;
                case 'DSH':
                    result = 'DSH';
                    break;
                case 'DFB':
                    result = 'DFB';
                    break;
                case 'YFB':
                    result = 'YFB';
                    break;
                case 'MJZ':
                    result = 'MJZ';
                    break;
                case 'MJW':
                    result = 'MJZ';
                    break;
                default:
                    result = type;
                    break;
            }
            return result
        },
        formatInputValue: function(value, index) {
            this.updateRate[index] = value
            return Util.accountFormat(value * 100, 2);
        },
        pageBtnClick: function(pageNo) {
            this.$emit("btnClick", pageNo);
        },
        dataFarmat: function(item, tit) {
            let result,
                data = item[tit.id]; //值
            if (!data && data !== 0) {
                return "/";
            }
            if (data) {
                switch (tit.type) {
                    case 'date':
                        if (data) {
                            result = Util.dateFormat((new Date(item[tit.id])), "yyyy-MM-dd")
                        }
                        break;
                    case 'date-time':
                        if (data) {
                            result = moment(item[tit.id]).format("YYYY-MM-DD HH:mm:ss")
                        }
                        break;
                    case 'term':
                        result = data + '个月'
                        break;
                    case 'rate':
                        result = Util.accountFormat(data * 100, 2) + '%'
                        break;
                    case 'money':
                        result = Util.accountFormat(data, 2)
                        break;
                    case 'money-simple':
                        result = Util.accountFormat(data, 0)
                        break;
                    case 'zszt':
                        result = get_tarns_text(data)
                        break;
                    default:
                        result = get_tarns_text(data)
                        break;
                }
            } else {
                result = data
            }
            return result
        },
        editInput: function(item, name) {
            console.log("input");
        },
        callAction: function(button, item, index) {
            if (button.type === 'rate') {
                this.$set(this.modifyValue, index, !this.modifyValue[index]);
                if (this.modifyValue[index]) { //为true显示input框
                    this.$set(this.currBtnTxt, index, '保存');
                } else {
                    this.$set(this.currBtnTxt, index, '修改');
                    this.$emit('updateRateInfo', item.term, this.updateRate[index]);
                }
            } else {
                this.$emit(button.type, item, this);
            }
        },
        multBtncCallAction: function(btn, button, item) {
            if (this.stateStore[item[button.idName] + '-' + btn.name]) {
                this.$emit('multBtnAction', btn.name, item);
            }
        }
    },
    components: {
        pagination
    }
}
</script>
<style lang='sass'>
@-webkit-keyframes shake {
    16.65% {
        -webkit-transform: translateX(8px);
        transform: translateX(8px);
    }
    33.3% {
        -webkit-transform: translateX(-6px);
        transform: translateX(-6px);
    }
    49.95% {
        -webkit-transform: translateX(4px);
        transform: translateX(4px);
    }
    66.6% {
        -webkit-transform: translateX(-2px);
        transform: translateX(-2px);
    }
    83.25% {
        -webkit-transform: translateX(1px);
        transform: translateX(1px);
    }
    100% {
        -webkit-transform: translateX(0);
        transform: translateX(0);
    }
}

@keyframes shake {
    16.65% {
        -webkit-transform: translateX(8px);
        transform: translateX(8px);
    }
    33.3% {
        -webkit-transform: translateX(-6px);
        transform: translateX(-6px);
    }
    49.95% {
        -webkit-transform: translateX(4px);
        transform: translateX(4px);
    }
    66.6% {
        -webkit-transform: translateX(-2px);
        transform: translateX(-2px);
    }
    83.25% {
        -webkit-transform: translateX(1px);
        transform: translateX(1px);
    }
    100% {
        -webkit-transform: translateX(0);
        transform: translateX(0);
    }
}

.md-table {
    /*border:1px solid #999;*/
    .main-table {
        width: 85%;
        margin-bottom: 10px;
        border: 1px solid #efefef;
        overflow: auto;
        text-align: center;
        .table {
            margin-bottom: 0;
        }
        thead th {
            background: #edf4ff;
            text-align: center;
        }
        td,
        th {
            border: 1px solid #e2e7ef;
            border-top: 1px solid #e2e7ef!important;
            white-space: nowrap;
            vertical-align: middle!important;
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
    .table-striped>tbody>tr:nth-of-type(odd) {
        background-color: #fff;
    }
    .table-striped>tbody>tr:nth-of-type(even) {
        background-color: #f9f9f9;
    }
    .table-input {
        /*display: none;*/
        width: 60px;
    }
    .show-rateInput {
        display: inline-block;
    }
    .rate-area {
        margin-right: 5px;
        cursor: pointer;
    }
    .btn-table {
        padding: 0;
        border: none;
        background: transparent;
        color: #5d91e5;
    }
    .btn-effect:hover {
        -webkit-animation-name: shake;
        animation-name: shake;
        -webkit-animation-duration: 1s;
        animation-duration: 1s;
        -webkit-animation-timing-function: ease-in-out;
        animation-timing-function: ease-in-out;
        -webkit-animation-iteration-count: 1;
        animation-iteration-count: 1;
    }
    .btn-table:hover {
        color: #4778c7;
    }
    .btn-table.active.focus,
    .btn-table.active:focus,
    .btn-table.focus,
    .btn-table:active.focus,
    .btn-table:active:focus,
    .btn-table:focus {
        outline: none;
        outline-offset: 0;
        -webkit-box-shadow: none;
        box-shadow: none;
        color: #5d91e5;
        border-color: transparent;
        outline: none;
        outline: 0px auto transparent;
    }
    .btn-multi-table {
        margin: 0 5px;
    }
    .btn-disabled {
        color: #bdbdbd;
        cursor: default;
    }
    .btn-disabled.active.focus,
    .btn-disabled.active:focus,
    .btn-disabled.focus,
    .btn-disabled:active.focus,
    .btn-disabled:active:focus,
    .btn-disabled:focus,
    .btn-disabled:hover {
        color: #bdbdbd;
    }
    /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
    ::-webkit-scrollbar {
        width: 12px;
        height: 12px;
        background-color: #f1f1f1;
    }
    /*定义滚动条轨道 内阴影+圆角*/
    ::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 0 rgba(0, 0, 0, 0.3);
        border-radius: 2px;
        background-color: #f1f1f1;
    }
    /*定义滑块 内阴影+圆角*/
    ::-webkit-scrollbar-thumb {
        border-radius: 2px;
        -webkit-box-shadow: inset 0 0 0 rgba(0, 0, 0, .3);
        background-color: #c1c1c1;
    }
}
</style>
