/**
 * @description 按钮显示隐藏
 * @author 雪进
 * @date "2017-5-13"
 *
 * @param {string} url 地址
 * @param {string} dataType 返回值类型
 * @param {function} success 回调函数，传数据回去
 * @param {function} dataError 回调函数，数据错误
 * @param {function} error 回调函数，请求错误
 * @example
 *  let getText = require('assets/js/map_field.js')
    getText('LCJH');
    @example end
 */
let states = {
    'LCJH': '理财计划',
    'HKZ': '还款中',
    'YJQ': '已结清',
    'YZF': '已作废',
    'YYY': '已预约',
    'LOCK': '已锁定',
    'DYY': '待预约',
    'SQZ': '申请中',
    'DSH': '待审核',
    'DFB': '待发布',
    'YFB': '预发布',
    'MJZ': '募集中',
    'MJW': '待放款',
    'MYFX': '每月付息，到期还本',
    'DEBX': '等额本息',
    'DEBJ': '等额本金',
    'YCFQ': '一次性付清',
    'ZR': '债权转让',
    'TZ': '新债权',
    'XNUB': '新农优宝',
    'LCJH': '理财计划',
    'XS': '新手',
    'PT': '默认',
    'ZS': '个人',
    'YH': '已还',
    'TQH': '提前还',
    'WH': '未还',
    'S': '是',
    'F': '否',

    // 自定义字段对应名称
    'SHOW': '展示',
    'HIDE': '隐藏',
    'edit': '修改',
    'editbs': '修改标识',
    'save': '保存',
    'del': '删除',
    'view': '查看',
    'check': '审核',
    'release': '发布',
    'prerelease': '预发布',
    'nouse': '作废',
    'unbind': '解绑关系',
    'unbindDone': '解绑成功'
}

module.exports = function(id) {
    if (id === 'mapping') {
        return states;
    }
    return states[id] || id;
};