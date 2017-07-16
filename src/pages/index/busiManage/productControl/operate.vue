<template>
    <div>
        <audit v-if='checkType("audit")' :beforeroute='beforeroute'></audit>
        <edit v-if='checkType("edit")' :beforeroute='beforeroute'></edit>
        <check v-if='checkType("check")' :beforeroute='beforeroute'></check>
        <create v-if='checkType("create")' :beforeroute='beforeroute'></create>
        <list v-show='checkType("list")' :beforeroute='beforeroute'></list>
    </div>
</template>
<script>
import create from './operate/create.vue';
import edit from './operate/edit.vue';
import check from './operate/check.vue';
import audit from './operate/audit.vue';
import list from './listPage.vue';

export default {
    data: function() {
        return {
            content: this.getType(),
            beforeroute: 0
        }
    },
    components: {
        create,
        edit,
        check,
        list,
        audit
    },
    // beforeRouteEnter: function(to, from, next) {
    //     next(vm => {
    //             vm.beforeroute=Math.random();
    //     })
    // },
    // mounted: function() {
    //     // this.beforeroute = Math.random();
    // },
    watch: {
        '$route': function(from, to) {
            this.beforeroute = Math.random();
            this.content = this.getType();
        }
    },
    methods: {
        getType: function() {
            let query = this.$route.query;
            return query.type || 'list';
        },
        checkType: function(type) {
            if (type === this.content) {
                return true;
            }
            return false;
        }
    }
}
</script>
