<template>
    <div class="card">
        <date-picker v-if="!dateMulti" :date="endtime" :option="option" :limit="limitOpt" @change="change"></date-picker>
        <date-picker v-if="dateMulti" :dateMulti="dateMulti" :date="startTime" :option="timeOption" :limit="limitOpt" @change="change"></date-picker>
        <!-- 返回日期加时间 -->
    </div>
    <!--
  <div class="card">
    <div class="row">
      <date-picker :time.sync="starttime" :option="option" :limit="limit"></date-picker>禁止选择日期
    </div>
    <div class="row">
      <date-picker :time.sync="endtime" :option="option"></date-picker>返回日期
    </div>
    <div class="row">
      <date-picker :time.sync="testTime" :option="timeOption"></date-picker>返回日期加时间
    </div>
    <div class="row">
      <date-picker :time.sync="testTime" :option="multiOption"></date-picker>返回多个日期
    </div>
  </div> -->
</template>
<script>
import myDatepicker from './vuedatepicker'

export default {
    props: {
        id: {
            type: Array,
            default: function() {
                return []
            }
        },
        from: {
            type: Number,
            default: function() {
                return null
            }
        },
        date: {
            type: String,
            default: function() {
                return ''
            }
        },
        dateMulti: {
            type: Boolean,
            default: function() {
                return false
            }
        },
        datelimit: {
            type: Array,
            default: function() {
                return [{
                    type: 'fromto',
                    from: '',
                    to: ''
                }]
            }
        }
    },
    data() {
        return {
            startTime: {
                time: this.date
            },
            endtime: {
                time: this.date
            },
            option: {
                type: 'day',
                week: ['一', '二', '三', '四', '五', '六', '日'],
                month: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                format: 'YYYY-MM-DD',
                color: {
                    checked: '#F50057',
                    header: '#6495ED',
                    headerText: '#fff'
                },
                placeholder: '',
                inputStyle: {},
                buttons: {
                    clear:'清空'
                },
                overlayOpacity: 0.2, // 0.5 as default
                dismissible: true // as true as default
            },
            timeOption: {
                type: 'second',
                week: ['一', '二', '三', '四', '五', '六', '日'],
                month: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                format: 'YYYY-MM-DD HH:mm:ss'
            },
            // multiOption: {
            //   type: 'multi-day',
            //   week: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
            //   month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            //   format:"YYYY-MM-DD HH:mm"
            // },
            // 为测试添加istest=1参数,不限制日期选择
            // limitOpt: location.hash.indexOf('istest=1') > -1 ? [] : this.datelimit
            limitOpt: this.datelimit
        }
    },
    components: {
        'date-picker': myDatepicker
    },
    methods: {
        "change": function(date) {
            this.$emit('change', date, this.id, this.from);
        }
    }
}
</script>
<style>
.card {
    position: relative;
    display: inline;
}
</style>
