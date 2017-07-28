<style>
</style>
<template>
    <date-picker :date="startTime" :dateMulti="dateMulti" :option="option" :limit="limitOpt" @change="change"></date-picker>
</template>
<script>
import myDatepicker from './vuedatepicker'

export default {
    props: {
        date: {
            type: String,
            default: ''
        },
        dateMulti: {
            type: Boolean,
            default: function() {
                return false
            }
        },
        limit: {
            type: Array,
            default: function() {
                return [{
                    type: 'weekday',
                    available: [1, 2, 3, 4, 5, 6, 7]
                }, {
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
                time: ''
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
                // buttons: {
                //     clear: '清空'
                // },
                overlayOpacity: 0.2, // 0.5 as default
                dismissible: true // as true as default
            },
            // 为测试添加istest=1参数
            // limitOpt: location.hash.indexOf('istest=1') > -1 ? [] : this.limit
            limitOpt: this.limit
        }
    },
    components: {
        'date-picker': myDatepicker
    },
    methods: {
        "change": function(date) {
            this.$emit('change', date);
        }
    }
}
</script>
