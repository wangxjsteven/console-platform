var map = {
    // 存放类似的模块引用,
    // default:function(){require('./default/main.vue')},
    // user_1:function(){require('./user/1.vue')},
    // user_2:function(){require('./user/2.vue')},
};

// 注册每一个import函数，需要的时候再执行
map['_homePage'] = function() {
    // return import ('@/components/table/table_demo.vue');
    return import ('index/default/main.vue');
};

// 系统管理
map['_sysManage_jsgl_glygl'] = function() {
    return import ('index/sysManage/userControl/role.vue');
};
map['_sysManage_jsgl_yhzgl'] = function() {
    return import ('index/sysManage/userControl/tabtest.vue');
};

// 业务管理
map['_busiManage_zqmk_zqfb'] = function() {
    return import ('index/busiManage/debtControl/waitDebt.vue');
};
map['_busiManage_zqmk_zqgl'] = function() {
    return import ('index/busiManage/debtControl/realDebt.vue');
};
map['_busiManage_cpgl_lcjhgl'] = function() {
    return import ('index/busiManage/productControl/operate.vue');
};

// 平台及用户分析
map['_platformManage_overview_platformTotal'] = function() {
    return import ('index/platformManage/overview/platformTotal.vue');
};
map['_platformManage_channel_channelManage'] = function() {
    return import ('index/platformManage/channel/manage.vue');
};
module.exports = function(name) {
    var result = map[name] || null;
    return result;
};