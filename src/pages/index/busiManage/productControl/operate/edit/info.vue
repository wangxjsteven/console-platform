<template>
    <div class="col-sm-11 col-md-12 edit-product">
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
                    <input class="form-control" v-model.number="term" readonly='true'>
                    <!-- <option v-for='item in termRateList' :value="item.term">{{item.term}}</option> -->
                    <span class="input-label">月</span>
                </div>
            </div>
            <div class="form-group">
                <label for="inputPassword3" class="col-sm-4 control-label"><i class="red">*</i>投资年利率</label>
                <div class="col-sm-2 form-content">
                    <input type="text" class="form-control" v-model="anRate" readonly="true">
                    <span class="input-label">%</span>
                </div>
            </div>
            <div class="form-group">
                <label for="inputPassword3" class="col-sm-4 control-label">加息年利率</label>
                <div class="col-sm-2 form-content">
                    <input type="text" class="form-control" v-model="rRate" readonly='true'>
                    <span class="input-label">%</span>
                    <span class="help-block">总投资利率=投资年利率+加息年利率</span>
                </div>
            </div>
            <div class="form-group">
                <label for="inputPassword3" class="col-sm-4 control-label"><i class="red">*</i>产品起息日</label>
                <div class="col-sm-2">
                    <!-- <date-picker class="control-date-box" :date="carryInterestDate" :limit="limitOpt" @change="changeDate"></date-picker> -->
                    <input type="text" class="form-control" v-model="carryInterestDate" readonly='true'>
                    <span class="help-block">最大可设置为未来7天</span>
                </div>
            </div>
            <div class="form-group" v-if='equalDayList.length>0'>
                <label for="inputPassword3" class="col-sm-4 control-label"><i class="red">*</i>等价起息日</label>
                <div class="col-sm-2">
                    <label class="radio-inline" v-for='item in equalDayList'>
                        <input type="radio" v-model="equalWorkDay" v-bind:value="item.value" disabled="disabled"> {{item.text}}
                    </label>
                </div>
            </div>
            <div class="form-group">
                <label for="inputPassword3" class="col-sm-4 control-label"><i class="red">*</i>募集金额</label>
                <div class="col-sm-2 form-content">
                    <input type="text" class="form-control" v-model="totalAmount" readonly='true'>
                    <span class="input-label">元</span>
                    <span class="help-block">该条件下剩余最大可募集金额{{maxRaiseAmount}}元</span>
                </div>
            </div>
            <div class="form-group">
                <label for="inputPassword3" class="col-sm-4 control-label"><i class="red">*</i>单笔限额</label>
                <div class="col-sm-2 form-content">
                    <input type="text" class="form-control" v-model="quota">
                    <span class="input-label">元</span>
                    <span class="help-block">取值范围：0~{{maxRaiseAmount}}元。0值表示不限额。</span>
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
                    <button type="submit" v-show="$checkAuth('edit')" class="btn btn-primary" @click.prevent='save'>保存修改</button>
                    <button type="submit" v-show="$checkAuth('edit')" class="btn btn-primary" @click.prevent='submit'>提交审核</button>
                    <button type="submit" class="btn btn-default" @click.prevent='back'>取消</button>
                </div>
            </div>
        </form>
        <div class="product-table-box main-table col-sm-10 col-md-11" v-if='productAuditDtos.length>0'>
            <table class="tabel table-striped">
                <thead>
                    <tr>
                        <th style="width:20%">序号</th>
                        <th style="width:20%">审核人</th>
                        <th style="width:20%">审核时间</th>
                        <th style="width:20%">审核结果</th>
                        <th style="width:20%">审核意见</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for='(item,index) in productAuditDtos'>
                        <td class="uetable-checkboxes">{{index+1}}</td>
                        <td class="uetable-checkboxes">{{item.auditorName}}</td>
                        <td class="uetable-checkboxes">{{formateTime(item.auditingTime)}}</td>
                        <td class="uetable-checkboxes">{{formateResult(item.productAuditStatus)}}</td>
                        <td class="uetable-checkboxes">{{item.auditOpinion}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
import pageHead from '@/components/pageHead';
import datePicker from '@/components/datepicker/date_simple.vue';
import moment from 'moment';

var self = null,
    DB = {
        queryProductInfo: {
            url: '/newconsole/consoleapi/queryProductInfo',
            method: 'post'
        },
        submitProduct: {
            url: '/newconsole/consoleapi/submitProduct',
            method: 'post'
        },
        updateProduct: {
            url: '/newconsole/consoleapi/updateProduct',
            method: 'post'
        }
    };
export default {
    data: function() {
        self = this;
        return {
            productId: '',
            productName: '理财计划',
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
                "rate": 0.2
            }],
            annualRate: '',
            riseRate: '',
            carryInterestDate: moment().format('YYYY-MM-DD'),
            limitOpt: [{
                type: 'fromto',
                from: moment().add(-1, 'd').format('YYYY-MM-DD'),
                to: moment().add(7, 'd').format('YYYY-MM-DD')
            }],
            equalWorkDay: '',
            equalDayList: [],
            totalAmount: '',
            quota: 0,
            showState: 'SHOW',
            maxRaiseAmount: 0,
            productAuditDtos: []
        }
    },
    components: {
        pageHead,
        datePicker
    },
    beforeRouteEnter: function(to, from, next) {
        next(vm => {
            vm.queryProductInfo();
        })
    },
    mounted: function() {
        this.queryProductInfo();
        this.equalDayList = this.makeEqualDay(this.carryInterestDate);
        this.equalDayList.length > 0 && (this.equalWorkDay = this.equalDayList[0].value);
    },
    watch: {
        'carryInterestDate': function(from, to) {
            this.equalDayList = this.makeEqualDay(this.carryInterestDate);
        }
    },
    computed: {
        anRate: function() {
            return (this.annualRate * 100).toFixed(1);
        },
        rRate: function() {
            return (this.riseRate * 100).toFixed(1);
        }
    },
    methods: {
        formateTime: function(date) {
            return moment(date).format('YYYY-MM-DD hh:mm:ss');
        },
        formateResult: function(type) {
            return {
                'TG': '通过',
                'BTG': '不通过'
            }[type];
        },
        queryProductInfo: function() {
            var self = this;
            return this.$ajax({
                url: DB.queryProductInfo.url,
                method: DB.queryProductInfo.method,
                data: {
                    productId: +this.$route.query.id
                }
            }).then(function(res) {
                if (res.code === 0) {
                    var data = res.data;
                    Object.assign(self, data);
                    self.$store.commit('STORE_PRODUCT', {
                        status: data.productStatus
                    });
                    self.carryInterestDate = moment(data.carryInterestDate).format('YYYY-MM-DD');
                    // self.productName = data.productName;
                    // self.totalAmount = data.totalAmount;
                    self.maxRaiseAmount = data.surplusAmount;
                    // self.term = data.term;
                    // self.annualRate = data.annualRate;
                    // self.riseRate = data.riseRate;
                    self.quota = data.quota || 0;
                    // self.equalWorkDay = data.equalWorkDay;
                    self.productInvestType = data.investType;
                    // self.showState = data.showState;
                    self.productAuditDtos = data.productAuditDtos || [];
                }
            });
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
                msg = '募集金额不能为空';
            } else if (!this.quota && this.quota !== 0) {
                msg = '单笔限额不能为空';
                // } else if (this.equalDayList.length > 0 && !this.equalWorkDay) {
                //     msg = '未选择等价起息日';
                // } else if (this.totalAmount > this.maxRaiseAmount) {
                //     msg = '募集金额大于剩余最大可募集金额，请重新填写';
            } else if (this.quota > this.totalAmount) {
                msg = '单笔限额大于募集金额，请重新填写';
            } else if (!this.showState) {
                msg = '未选择展示方式';
            }
            return msg;
        },
        save: function() {
            this.submit('save')
        },
        submit: function(type) {
            let self = this;
            let checkResult = this.validator(),
                curDB = type === 'save' ? DB.updateProduct : DB.submitProduct;
            if (checkResult) {
                this.$store.commit('TOGGLE_DIALOG', checkResult);
                return;
            }
            this.$ajax({
                url: curDB.url,
                method: curDB.method,
                data: {
                    productId: this.productId,
                    productName: this.productName,
                    productInvestType: this.productInvestType,
                    exclusiveId: this.exclusiveId,
                    term: this.term,
                    annualRate: this.annualRate,
                    riseRate: this.riseRate,
                    carryInterestDate: this.carryInterestDate,
                    equalWorkDay: this.equalWorkDay,
                    totalAmount: this.totalAmount,
                    quota: this.quota,
                    showState: this.showState
                }
            }).then(function(res) {
                if (res.code === 0) {
                    self.$store.commit('TOGGLE_DIALOG', {
                        message: type === 'save' ? '保存修改成功' : '提交审核成功',
                        autohide: true,
                        ok: function() {
                            self.$router.push({
                                query: {
                                    tab: 1
                                },
                                path: '/busiManage/cpgl/lcjhgl'
                            })
                        },
                        cancel: function() {
                            self.$router.push({
                                query: {
                                    tab: 1
                                },
                                path: '/busiManage/cpgl/lcjhgl'
                            })
                        }
                    });
                }
            })
        },
        back: function() {
            this.$router.go(-1);
        }
    }
}
</script>
<style lang="sass">
.edit-product {
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
    .product-table-box {
        margin: 50px auto;
        border-top: 1px solid #999;
        padding-top: 10px;
        .tabel {
            width: 100%;
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
