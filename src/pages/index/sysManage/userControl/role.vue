<template>
    <div class="container-section col-sm-11 col-md-12" id="containerSection">
        <page-head></page-head>
        <div class="role-left col-md-3">
            <div class="role-form">
                <input class="form-input" type="text" placeholder="请输入角色名称" v-model="searchRole" />
                <button class="btn btn-primary btn-mini role-search" @click="filterRole">查 询</button>
                <button class="btn btn-mini btn-default role-add" @click="roleAdd" v-show="$checkAuth('add')"><i class="fa fa-plus"></i></button>
            </div>
            <div class="role-userlist mt10">
                <ul>
                    <li class="userlist-li" :class="{active:item.id===activeId}" v-for="(item, index) in userlist" @click="showRole(item)">
                        <i class="user-angle fa fa-angle-right"></i>
                        <span>{{item.roleName}}</span>
                        <i class="user-del fa fa-trash-o" @click.stop="deleteUser(item.id, index)" v-show="$checkAuth('delete')"></i>
                    </li>
                </ul>
            </div>
            <pagination :cur.sync="pagecur" :all.sync="pageall" @btnClick="pageBtnClick"></pagination>
        </div>
        <div class="role-center col-md-4" v-bind:class="{'role-show':showRoleCenter}" id="roleCenter">
            <dl>
                <dt>角色名称</dt>
                <dd>
                    <input class="form-control" type="text" name="roleName" v-if="centerForm.gray" v-model="centerForm.name" :value="centerForm.name" disabled="disabled">
                    <input class="form-control" type="text" name="roleName" v-else v-model="centerForm.name" maxlength="15" placeholder="请输入角色名称">
                </dd>
            </dl>
            <dl :class="{'dl-hide':showDl}">
                <dt>角色编号</dt>
                <dd v-text="centerForm.number"></dd>
            </dl>
            <dl>
                <dt>角色状态</dt>
                <dd>
                    <input name="roleStatus" type="radio" value="KY" v-model="centerForm.stauts" />
                    <label class="label-input">正常</label>
                    <!-- <input name="roleStatus" type="radio" value="frozen" v-model="centerForm.stauts"/><label class="label-input">冻结</label> -->
                    <input name="roleStatus" type="radio" value="JY" v-model="centerForm.stauts" />
                    <label class="label-input">停用</label>
                </dd>
            </dl>
            <dl>
                <dt>备注</dt>
                <dd v-text="centerForm.tip" v-if="centerForm.gray">
                </dd>
                <dd v-else>
                    <input class="form-control" type="text" name="roleTip" v-model="centerForm.tip" maxlength="15" placeholder="请输入备注">
                </dd>
            </dl>
            <dl :class="{'dl-hide':showDl}">
                <dt>创建时间</dt>
                <dd v-text="centerForm.time"></dd>
            </dl>
            <dl>
                <dt></dt>
                <dd>
                    <button class="btn btn-primary btn-mini role-save" @click="roleSave" v-show="$checkAuth('edit')">保 存</button>
                </dd>
            </dl>
        </div>
        <div class="role-right col-md-4" v-bind:class="{'role-show':showRoleCenter}">
            <div style="width:300px; height:760px">
                <vtree ref='tree' :treeNodeId="treeId" :treedata="treedata" :options="options" @getSelectedNodeIds='handleNode' @initParentNodes="initParentNodes" /></vtree>
            </div>
        </div>
    </div>
</template>
<script>
import pageHead from '@/components/pageHead';
import Util from '@/assets/js/util';
var that = null,
    firstComponent = 0,
    mod_saveSubmit = false,
    mod_delSubmit = false;
export default {
    data: function() {
        that = this;
        return {
            name: 'tree',
            options: {
                showCheckbox: true,
                search: {
                    useInitial: true,
                    useEnglish: false,
                    customFilter: null
                }
            },
            searchRole: '',
            showRoleCenter: false,
            showDl: true,
            activeId: null,
            treeId: [],
            centerForm: {
                id: '',
                name: '',
                gray: false,
                number: '',
                stauts: '',
                tip: '',
                time: ''
            },
            treedata: [],
            seachResult: [],
            backupResult: [],
            userlist: [],
            pagecur: 1,
            pageall: 1,
            selectedNodes: []
        };
    },
    beforeRouteEnter: function(to, from, next) {
        next(vm => {
            // 通过 `vm` 访问组件实例
            if (firstComponent > 2) {
                vm.loadPaginationData(1, 10);
                vm.loadTreeData();
            }
            firstComponent++;
        })
    },
    // computed: {
    //     selectedNodes: function(){
    //         return this.selectedNodes
    //     }
    // },
    watch: {
        searchRole: function(value, oldvalue) {
            if (value === '') {
                this.filterRole();
            }
        },
        treedata: function(data) {
            return data
        },
        treeId: function(data) {
            return data
        }
    },
    components: {
        pageHead,
        pagination: function(resolve) {
            //异步组件写法
            if (firstComponent === 0) {
                firstComponent++;
                that.loadPaginationData(1, 10, resolve, true);
            }
        },
        vtree: function(resolve) {
            if (firstComponent === 1) {
                firstComponent++;
                that.loadTreeData(resolve, true);
            }
        }
    },
    methods: {
        loadPaginationData: function(pageNo, pageSize, resolve, addcomponent) {
            this.$ajax({
                url: '/newconsole/consoleapi/user/roles',
                data: {
                    pageNo: pageNo,
                    pageSize: pageSize
                },
                method: 'get'
            }).then(
                function(res) {
                    var data = res.data;
                    that.backupResult = that.userlist = data.data;
                    that.pageall = data.pages;
                    that.pagecur = data.pageNum;
                    if (data.pages > 1) {
                        addcomponent && require(['@/components/pagination.vue'], resolve);
                    }
                }
            );
        },
        loadTreeData: function(resolve, addcomponent) {
            this.$ajax({
                url: '/newconsole/consoleapi/user/res',
                method: 'get'
            }).then(
                function(res) {
                    that.treedata = res.data.resources;
                    addcomponent && require(['@/components/tree/tree.vue'], resolve);
                }
            );
        },
        roleAdd: function() {
            this.showRoleCenter = true;
            this.showDl = true;
            this.treeId = [];
            this.userlist = this.backupResult;
            this.centerForm = {
                id: '',
                name: '',
                gray: false,
                number: '',
                stauts: 'KY',
                tip: '',
                time: ''
            };
        },
        showRole: function(item) {
            this.showDl = false;
            this.activeId = item.id;
            this.centerForm = {
                id: item.id,
                name: item.roleName,
                gray: true,
                number: item.roleIden,
                stauts: item.status,
                tip: item.remark || item.roleName,
                time: Util.dateFormat((new Date(item.createDate)), "yyyy-MM-dd hh:mm:ss")
            };
            this.selectedNodes = [];
            this.$ajax({
                url: '/newconsole/consoleapi/user/res/roleId',
                method: 'get',
                data: {
                    id: item.id
                }
            }).then(
                function(res) {
                    that.treeId = res.data.resources;
                    that.selectedNodes = that.treeId.join(",");
                    that.showRoleCenter = true;
                    // that.watchNodesChange++;
                }
            );
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
        deleteUser: function(id, index) {
            if (mod_delSubmit) {
                return;
            }
            mod_delSubmit = true;
            this.$ajax({
                url: '/newconsole/consoleapi/user/role/delete',
                data: {
                    "id": id
                },
                method: 'post'
            }).then(
                function(res) {
                    mod_delSubmit = false;
                    that.loadPaginationData(1, 10);
                    that.$store.commit('TOGGLE_DIALOG', "您删除成功！");
                    that.showRoleCenter = false;
                }
            ).catch(function() {
                mod_delSubmit = false;
            });
        },
        roleSave: function() {
            if (mod_saveSubmit) {
                return;
            }
            mod_saveSubmit = true;
            var param_data = {
                "id": this.centerForm.id,
                "roleName": this.centerForm.name,
                "status": this.centerForm.stauts,
                "remark": this.centerForm.tip,
                "resIds": this.selectedNodes
            };
            if (param_data.roleName === '') {
                that.$store.commit('TOGGLE_DIALOG',"请输入角色名称！");
                return;
            }
            this.$ajax({
                url: '/newconsole/consoleapi/user/role/saveOrUpdate',
                data: param_data,
                method: 'post',
                requestType:'form'
            }).then(
                function(res) {
                    mod_saveSubmit = false;
                    if (res.code === 0) {
                        that.loadPaginationData(1, 10);
                        that.$store.commit('TOGGLE_DIALOG',"保存成功！");
                        location.reload();
                    } else {
                        that.$store.commit('TOGGLE_DIALOG',"保存失败！" + res.message);
                    }
                }
            );
        },
        pageBtnClick: function(data) {
            // 翻页请求数据
            this.loadPaginationData(data, 10);
        },
        handleNode: function(nodes) {
            nodes = nodes.join(",");
            this.selectedNodes = nodes;
            return nodes;
        },
        initParentNodes: function(data) {
            data = data.join(",");
            this.selectedNodes = data
            return data;
        }
    }
}
</script>
<style>
.role-left {
    min-height: 500px;
    position: relative;
    padding: 10px 15px;
    border-right: 1px solid #eee;
}

.role-center {
    display: none;
    position: relative;
    min-height: 500px;
    padding: 10px 15px;
    border-right: 1px solid #eee;
}

.role-right {
    display: none;
    position: relative;
    min-height: 500px;
    padding: 10px 15px 10px 50px;
    overflow: scroll;
}

.user-del {
    display: none;
    height: 36px;
    line-height: 36px;
    float: right;
}

.userlist-li {
    border-bottom: 1px solid #fff;
    line-height: 35px;
    cursor: pointer;
}

.userlist-li:hover {
    border-color: #eff0f4;
}

.userlist-li.active {
    background: #eff0f4;
}

.userlist-li:hover .user-del,
.userlist-li.active .user-del,
.role-show {
    display: block;
}

.list-hide {
    display: none
}

dt {
    width: 23%;
    display: inline-block;
    margin-right: 15px;
    text-align: right;
}

dd {
    width: 60%;
    display: inline-block;
    text-align: left;
}

.label-input {
    margin-right: 20px;
    margin-bottom: 0;
    font-weight: normal;
}

.role-save {
    padding: 5px 10px;
}

.dl-hide {
    display: none
}

input[type=radio] {
    vertical-align: text-top;
    margin-right: 6px;
}
</style>
