<template>
    <div class="container-section col-sm-11 col-md-12 create-product">
        <page-head pTitle='业务管理&nbsp;&nbsp;>&nbsp;&nbsp;产品管理>&nbsp;&nbsp;新建理财计划'></page-head>
        <form class="form-horizontal">
            <div class="form-group">
                <label for="inputEmail3" class="col-sm-4 control-label"><i class="red">*</i>产品标题</label>
                <div class="col-sm-2">
                    <input type="email" class="form-control" v-model="productName">
                </div>
            </div>
            <div class="form-group">
                <label for="inputPassword3" class="col-sm-4 control-label"><i class="red">*</i>展示区域</label>
                <div class="col-sm-2">
                    <select class="form-control" v-model="productInvestType">
                        <option value="PT">默认区</option>
                        <option value="ZS">个人区</option>
                        <!-- <option value="XS">新手区</option> -->
                    </select>
                </div>
            </div>
            <div class="form-group" v-if="productInvestType==='ZS'">
                <label for="inputPassword3" class="col-sm-4 control-label"><i class="red">*</i>可投用户</label>
                <div class="col-sm-2 form-content">
                    <input type="text" class="form-control" v-model="exclusiveId">
                    <span class="help-block">请填用户名或手机号,多个用户请用,(英文)分隔</span>
                </div>
            </div>
            <div class="form-group">
                <label for="inputPassword3" class="col-sm-4 control-label"><i class="red">*</i>投资期限</label>
                <div class="col-sm-2 form-content">
                    <select class="form-control" v-model.number="term" @change='setRate(term)'>
                        <option v-for='item in termRateList' :value="item.term">{{item.term}}</option>
                    </select>
                    <span class="input-label">月</span>
                </div>
            </div>
            <div class="form-group">
                <label for="inputPassword3" class="col-sm-4 control-label"><i class="red">*</i>投资年利率</label>
                <div class="col-sm-2 form-content">
                    <input type="text" class="form-control" v-model="ratepercent" readonly="true" @change='refreshAmount'>
                    <span class="input-label">%</span>
                </div>
            </div>
            <div class="form-group">
                <label for="inputPassword3" class="col-sm-4 control-label">加息年利率</label>
                <div class="col-sm-2 form-content">
                    <input type="text" class="form-control" v-model="riseRate" @input="getMaxRaise">
                    <span class="input-label">%</span>
                    <span class="help-block">总投资利率=投资年利率+加息年利率</span>
                </div>
            </div>
            <div class="form-group">
                <label for="inputPassword3" class="col-sm-4 control-label"><i class="red">*</i>产品起息日</label>
                <div class="col-sm-2">
                    <date-picker class="control-date-box" :date="carryInterestDate" :limit="limitOpt" @change="changeDate"></date-picker>
                    <span class="help-block">最大可设置为未来7天</span>
                </div>
            </div>
            <div class="form-group" v-if='equalDayList.length>0'>
                <label for="inputPassword3" class="col-sm-4 control-label"><i class="red">*</i>等价起息日</label>
                <div class="col-sm-2">
                    <label class="radio-inline" v-for='item in equalDayList'>
                        <input type="radio" v-model="equalWorkDay" v-bind:value="item.value" @change="setEqualDay"> {{item.text}}
                    </label>
                </div>
            </div>
            <div class="form-group">
                <label for="inputPassword3" class="col-sm-4 control-label"><i class="red">*</i>募集金额</label>
                <div class="col-sm-2 form-content">
                    <input type="text" class="form-control" v-model.number="totalAmount">
                    <span class="input-label">元</span>
                    <span class="help-block">该条件下剩余最大可募集金额{{maxRaiseAmount}}元</span>
                </div>
            </div>
            <div class="form-group">
                <label for="inputPassword3" class="col-sm-4 control-label"><i class="red">*</i>单笔限额</label>
                <div class="col-sm-2 form-content">
                    <input type="text" class="form-control" v-model="quota">
                    <span class="input-label">元</span>
                    <span class="help-block">取值范围：0~{{quotaLimit}}元。0值表示不限额。</span>
                </div>
            </div>
            <div class="form-group">
                <label for="inputPassword3" class="col-sm-4 control-label"><i class="red">*</i>展示</label>
                <div class="col-sm-2 create-show-state">
                    <label class="radio-inline">
                        <input type="radio" v-model="showState" value='SHOW'> 展示
                    </label>
                    <label class="radio-inline">
                        <input type="radio" v-model="showState" value='HIDE'> 隐藏
                    </label>
                </div>
            </div>
            <div class="form-group">
                <div class="col-sm-offset-4 col-sm-4">
                    <div class="checkbox">
                        <label>
                        </label>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <div class="col-sm-offset-4 col-sm-4">
                    <button type="submit" v-show="$checkAuth('add')" class="btn btn-primary" @click.prevent='submit' :disabled="disabled">预约债权</button>
                    <button type="submit" class="btn btn-default" @click.prevent='back'>取消</button>
                </div>
            </div>
        </form>
    </div>
</template>
<script>
import pageHead from '@/components/pageHead';
import datePicker from '@/components/datepicker/date_simple.vue';
import moment from 'moment';

var self = null,
    DB = {
        getRateInfo: {
            url: '/newconsole/consoleapi/getRateInfo',
            method: 'post'
        },
        maxRaiseAmount: {
            url: '/newconsole/consoleapi/maxRaiseAmount',
            method: 'post'
        },
        createProduct: {
            url: '/newconsole/consoleapi/createProduct',
            method: 'post'
        }
    };
export default {
    data: function() {
        self = this;
        return {
            productName: '农优宝',
            productInvestType: 'PT',
            exclusiveId: '',
            term: 1,
            termRateList: [{
                "term": 1,
                "rate": 0.065
            }, {
                "term": 3,
                "rate": 0.072
            }, {
                "term": 6,
                "rate": 0.08
            }, {
                "term": 9,
                "rate": 0.09
            }, {
                "term": 12,
                "rate": 0.112
            }],
            annualRate: '',
            riseRate: 0,
            carryInterestDate: moment().format('YYYY-MM-DD'),
            limitOpt: [{
                type: 'fromto',
                from: moment().add(-1, 'd').format('YYYY-MM-DD'),
                to: moment().add(8, 'd').format('YYYY-MM-DD')
            }],
            equalWorkDay: '',
            equalDayList: [],
            totalAmount: '',
            quota: 0,
            showState: 'SHOW',
            maxRaiseAmount: 0,
            disabled:false
        }
    },
    components: {
        pageHead,
        datePicker
    },
    mounted: function() {
        this.getRateInfo();
        let curRateObj = this.termRateList[0];
        this.term = curRateObj.term;
        this.setRate(this.term);
        this.annualRate = curRateObj.rate;
        this.equalDayList = this.makeEqualDay(this.carryInterestDate);
        this.equalDayList.length > 0 && (this.equalWorkDay = this.equalDayList[0].value);
    },
    // watch: {
    //     'carryInterestDate': function(from, to) {
    //         this.equalDayList = this.makeEqualDay(this.carryInterestDate);
    //     }
    // },
    computed: {
        ratepercent: function() {
            return (this.annualRate * 100).toFixed(1);
        },
        quotaLimit: function() {
            return Math.min(this.maxRaiseAmount, this.totalAmount);
        }
    },
    methods: {
        setRate: function(term) {
            var self = this;
            this.getTermRate(term);
            this.getMaxRaise();
        },
        setTitle: function(no) {
            var self = this;
            this.productName = '农优宝' + ['A', 'B', 'C', 'D', 'E', 'F', 'G'][no] + 'N';
        },
        getMaxRaise: function() {
            if (this.equalDayList.length === 0 || this.equalWorkDay) {
                // 不需要等价起息日或需要且已设置等价起息日才可确定最大可募集金额
                this.$ajax({
                    url: DB.maxRaiseAmount.url,
                    method: DB.maxRaiseAmount.method,
                    data: {
                        annualRate: +this.annualRate + (this.riseRate / 100),
                        startDate: this.carryInterestDate,
                        equalWorkDay: this.equalWorkDay
                    }
                }).then(function(res) {
                    self.maxRaiseAmount = res.data;
                });
            }
        },
        refreshAmount: function(term) {
            this.annualRate = this.getTermRate(term);
        },
        getTermRate: function(term) {
            let list = this.termRateList;
            for (var i = list.length - 1; i >= 0; i--) {
                let item = list[i];
                if (item.term === Number(term)) {
                    this.annualRate = item.rate;
                    this.setTitle(i);
                    return item.rate;
                }
            }

        },
        getRateInfo: function() {
            var self = this;
            return this.$ajax({
                url: DB.getRateInfo.url,
                method: DB.getRateInfo.method
            }).then(function(res) {
                var data = res.data;
                self.termRateList = data || self.termRateList;
                self.annualRate = self.termRateList[0].rate;
                // self.setRate(self.termRateList[0].term);
            });
        },
        changeDate: function(date) {
            this.carryInterestDate = date;
            this.equalDayList = this.makeEqualDay(this.carryInterestDate);
            this.getMaxRaise();
        },
        setEqualDay: function(equalDay) {
            this.getMaxRaise();
        },
        makeEqualDay: function(date) {
            // 根据日期生成等价起息日列表
            var mDate = moment(date),
                result = [],
                count = 0;
            if (mDate.month() === 1) {
                // 2月份28、29都生成
                if (mDate.dates() === 28) {
                    count = 4;
                } else if (mDate.dates() === 29) {
                    count = 3;
                }
            } else if (mDate.month() === 3 ||
                mDate.month() === 5 ||
                mDate.month() === 8 ||
                mDate.month() === 10) {
                // 普通月份只有30号才需要生成
                if (mDate.dates() === 30) {
                    count = 2;
                }
            }
            if (count <= 1) {
                return result;
            }
            for (var i = count; i > 0; i--) {
                var cd = 31 - count + i;
                result.unshift({
                    "value": cd,
                    "text": i === 1 ? '1日-' + cd + '日' : cd + '日'
                })
            }
            return result;
        },
        validator: function() {
            var msg = '';
            if (!this.productName) {
                msg = '产品标题不能为空';
            } else if (this.productInvestType === 'ZS' && !this.exclusiveId) {
                msg = '可投用户不能为空';
            } else if (!this.totalAmount) {
                if (this.totalAmount === 0) {
                    msg = '募集金额不能为零';
                } else {
                    msg = '募集金额不能为空';
                }
            } else if (!this.quota && this.quota !== 0) {
                msg = '单笔限额不能为空';
            } else if (this.equalDayList.length > 0 && !this.equalWorkDay) {
                msg = '未选择等价起息日';
            } else if (this.totalAmount > this.maxRaiseAmount) {
                msg = '募集金额大于剩余最大可募集金额，请重新填写';
            } else if (this.quota > this.totalAmount) {
                msg = '单笔限额大于募集金额，请重新填写';
            } else if (!this.showState) {
                msg = '未选择展示方式';
            }
            return msg;
        },
        submit: function() {
            var checkResult = this.validator();
            if (checkResult) {
                this.$store.commit('TOGGLE_DIALOG', checkResult);
                return;
            }
            this.disabled=true;
            this.$ajax({
                url: DB.createProduct.url,
                method: DB.createProduct.method,
                data: {
                    productName: this.productName,
                    productInvestType: this.productInvestType,
                    exclusiveId: this.exclusiveId,
                    term: this.term,
                    annualRate: this.annualRate,
                    riseRate: this.riseRate / 100,
                    carryInterestDate: this.carryInterestDate,
                    equalWorkDay: this.equalWorkDay,
                    totalAmount: this.totalAmount,
                    quota: this.quota,
                    showState: this.showState
                }
            }).then(function(res) {
                self.disabled=false;
                self.$store.commit('TOGGLE_DIALOG', {
                    message: '提交成功',
                    ok: function() {
                        self.$router.push({
                            query: {
                                tab: 1
                            },
                            path: '/busiManage/cpgl/lcjhgl'
                        });
                    }
                });
            }).catch(function(){
                self.disabled=false;
            })
        },
        back: function() {
            this.$router.go(-1);
        }
    }
}
</script>
<style lang="sass">
.create-product {
    .form-horizontal {
        padding-top: 20px;
    }
    .settlementMethod {
        margin: 10px 0 20px;
    }
    .form-content {
        .input-label {
            position: absolute;
            top: 0;
            right: -20px;
            line-height: 34px;
        }
    }
    .control-date-box {
        .cov-datepicker {
            height: 34px;
        }
        .fa.fa-calendar {
            top: 9px;
            left: 20px;
        }
    }
    .red {
        color: red;
    }
    .create-show-state {
        .radio-inline:last-child {
            margin-left: 40px;
        }
    }
}
</style>
