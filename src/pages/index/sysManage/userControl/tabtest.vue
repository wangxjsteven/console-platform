<template>
	<div class="container-section col-sm-11 col-md-12" id="containerSection">
    <page-head></page-head>
    <tabs :tabslist="tabListData" :defaultIndex="0" @tabClick="tabClick">
      <tab-pane label="Pictures" selected>one Tab</tab-pane>
      <tab-pane label="Music">two Tab</tab-pane>
      <tab-pane label="Videos">three Tab</tab-pane>
    </tabs>
	</div>
</template>
<script>
  import pageHead from '@/components/pageHead';
  import tabs from '@/components/tabs/tabs';
  import tabPane from '@/components/tabs/tabpane';
	export default {
    data: function(){
      return{
        tabListData:[{
          id: 0,
          tabname: "标签一",
          actived: false
        },
        {
          id: 1,
          tabname: "标签二",
          actived: true
        },
        {
          id: 2,
          tabname: "标签三",
          actived: false
        }]
      }
    },
    components: {
        pageHead, tabs, tabPane
    },
    methods: {
      tabClick: function(id){
        return id
      }
    }
  }
</script>
<style lang='sass'>

</style>