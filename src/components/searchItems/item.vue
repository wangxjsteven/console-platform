<template>
    <div class="search-items">
        <div class="columns" :style="buttonStyle">
            <div v-for="row in rowsCount" class="column">
                <div v-for="(item, index) in computSearch[row]" class="control has-addons" :data-for="itemsModel(item)">
                    <label class="is-info">{{item.name}}</label>
                    <input v-if="item.type==='number'" type="number" class="input form-input" :value="item.value" v-model.number="modelValue[item.id]">
                    <input v-if="item.type==='text'" type="text" class="input form-input" :value="item.value" v-model="modelValue[item.id]">
                    <select v-if="item.type==='select'" class="form-input" :value="item.value" v-model="modelValue[item.id]">
                        <option v-for="op in item.option" :value="op.value">{{op.text||op.name}}</option>
                    </select>
                    <select-single v-if="item.type==='select-single'" class="form-input" :optionsdata="item.option" :selecteddata="item.value" :selectid="item.id" @selected="multipleCallback">
                    </select-single>
                    <select-multi v-if="item.type==='select-multi'" class="form-input" :optionsdata="item.option" :selecteddata="transMultiValue(item.value)" :selectid="item.id" @selected="multipleCallback">
                    </select-multi>
                    <select-multi-simple v-if="item.type==='select-multi-simple'" class="form-input" :optionsdata="item.option" :selecteddata="item.value" :selectid="item.id" @selected="multipleCallback">
                    </select-multi-simple>
                    <div v-if="item.type==='doubletime'" style="display: inline-block">
                        <datepicker @change="changeTime" :date="item.value[0]" :datelimit='item.limit&&item.limit[0]' :id="item.id" :from='0'></datepicker>
                        <span>至</span>
                        <datepicker @change="changeTime" :date="item.value[1]" :datelimit='item.limit&&item.limit[1]' :id="item.id" :from='1'></datepicker>
                    </div>
                    <datepicker v-if="item.type==='singletime'" :date="item.value" @change="changeTime" :datelimit='item.limit' :id="item.id" :from='0'></datepicker>
                </div>
            </div>
        </div>
        <div class="buttons" :style="buttonStyle">
            <!-- btnEvent都传eventHandle回去 -->
            <!-- item.btnPower直接传true或false -->
            <button v-for="item in buttonItem" class="btn btn-primary" :class="[item.icon!==''?'btn-'+item.icon: '']" @click="btnEvent(item.type)" v-show="item.btnPower">
                <i v-if="item.icon !== ''" class="fa" :class="showIcon?'fa-'+item.icon:''"></i> {{item.name}}
            </button>
        </div>
    </div>
</template>
<script>
import datepicker from '@/components/datepicker/date';
import selectSingle from 'components/select/single-select.vue';
import selectMulti from 'components/select/multiple-select.vue';
import selectMultiSimple from 'components/select/multiple-select-simplify.vue';

export default {
    props: {
        itemOptions: {
            type: Object,
            default: function() {
                return {
                    colCount: 5,
                    searchItems: [],
                    buttons: []
                }
            }
        }
    },
    data: function() {
        let buttonStyle;
        if (this.itemOptions.wrap) {
            buttonStyle = {
                display: 'block',
                marginTop: '20px'
            }
        } else {
            buttonStyle = {
                display: 'inline-block'
            }
        }
        return {
            showIcon: true,
            dateFrom: '',
            dateTo: '',
            colCount: this.itemOptions.colCount || 5,
            searchItems: this.itemOptions.searchItems,
            buttonItem: this.itemOptions.buttons,
            buttonStyle: buttonStyle,
            modelValue: {}
        }
    },
    components: {
        datepicker,
        selectSingle,
        selectMulti,
        selectMultiSimple
    },
    computed: {
        rowsCount: function() {
            let rest = this.searchItems.length % 3,
                count = parseInt(this.searchItems.length / 3);

            if (rest > 0) {
                count = count + 1
            }
            return count
        },
        computSearch: function() {
            let search = {},
                num = 1
            search[num] = []
            for (let i = 0, len = this.searchItems.length; i < len; i++) {
                if (i > 0 && i % this.colCount === 0) {
                    num++
                    search[num] = []
                }
                search[num].push(this.searchItems[i]);
            }
            return search
        }
    },
    methods: {
        power: function(item) {
            let result = {
                'search': true,
                'select': true, //this.$checkAuth("select"),
                'edit': this.$checkAuth("edit"),
                'check': this.$checkAuth("check"),
                'release': this.$checkAuth("release"),
                'prerelease': this.$checkAuth("prerelease"),
                'delete': this.$checkAuth("delete")
            }
            return result(item);
        },
        itemsModel: function(item) {
            let id = item.id,
                value = item.value;
            if (id instanceof Array) {
                for (let i in id) {
                    this.modelValue[id[i]] = value instanceof Array ? value[i] : value
                }
            } else {
                this.modelValue[id] = value
            }
        },
        transMultiValue: function(list) {
            let result = [];
            for (var i = list.length - 1; i >= 0; i--) {
                let item = list[i];
                result.push(typeof item === 'string'  ? {
                        text: item,
                        value: item
                    } :
                    item);
            }
            return result;
        },
        getMultiValue: function(list) {
            let result = [];
            for (var i = list.length - 1; i >= 0; i--) {
                result.push(list[i].value);
            }
            return result;
        },
        multipleCallback: function(item) {
            var self = this;
            self.modelValue[item.id] = this.getMultiValue(item.value);
            self.$emit("eventHandle", {
                type: 'multiple-selected',
                value: this.modelValue
            })
        },
        btnEvent: function(type) {
            // 每次回调都有type和value，统一在父组件中处理
            this.$emit("eventHandle", {
                type: type,
                value: this.modelValue
            })
        },
        changeTime: function(date, id, from) {
            if (id instanceof Array) {
                this.modelValue[id[from]] = date
            }
        }
    }
}
</script>
<style lang="sass">
.search-items {
    margin: 20px 0;
    .column {
        display: block;
        -ms-flex-preferred-size: 0;
        flex-basis: 0;
        -ms-flex-positive: 1;
        flex-grow: 1;
        -ms-flex-negative: 1;
        flex-shrink: 1;
        p {
            margin: 0;
        }
        .control {
            position: relative;
            text-align: left;
            margin-right: 15px;
            padding: 2px 0;
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
        label.is-info {
            width: 100px;
            margin-bottom: 0;
            line-height: 24px;
            font-size: 14px;
            font-weight: normal;
            text-align-last: justify;
            margin-right: 10px;
        }
    }
    .buttons {
        .btn-primary {
            margin: 0 10px 0 0;
        }
        .btn-search {
            margin: 0 20px 0 0;
        }
    }
    .functional-select-wrapper {
        display: inline-block;
        position: relative;
        width: 150px;
        height: 24px;
        border: none;
        padding: 0;
        vertical-align: bottom;
        .multiple-select-container {
            border: 1px solid #dbdbdb;
            box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
            border-radius: 3px;
            padding: 0 0 0 9px;
            min-height: 24px;
            line-height: 24px;
            .drop {
                top: 0;
                right: 3px;
                font-size: 12px;
                transform: scale(0.75, 0.75);
            }
        }
        .options-container {
            border-radius: 0;
            border-color: #7a9cd3;
        }
    }
}

.fa {
    margin-right: 5px;
}
</style>
