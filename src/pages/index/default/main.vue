<style>
.main-section {
    color: green;
}
</style>
<template>
    <div class="container-section col-sm-11 col-md-12" id="containerSection">
        <page-head></page-head>
    </div>
</template>
<script>
import pageHead from '@/components/pageHead';
import datepicker from '@/components/datepicker/date.vue'
module.exports = {
    data: function() {
        return {
            msg: '',
            date: ''
        }
    },
    methods: {
        show: function() {
            return false;
        },
        change: function(date) {
            this.date = date
        }
    },
    components: {
        pageHead,
        datepicker
    }
}
</script>
