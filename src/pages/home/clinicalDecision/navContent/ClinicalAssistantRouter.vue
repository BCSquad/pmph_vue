<template>
  <div class="">
      <transition name="fade" mode="out-in">
        <router-view
        :product_type="clinicaltype"
        :queryName="clinicaltype"
        ></router-view>
      </transition>
      </div>
</template>
<style>

</style>

<script type="text/javascript">
    export default{
        data(){
            return{
              clinicaltype:'1',
              queryName:'临床助手申报列表'
            }
        },
      created() {
       // this.$router.push({name:'临床决策专家申报列表',query:{clinicaltype:'1',queryName:'临床助手申报列表'}});
        //this.$router.push({name:'临床决策专家申报',query:{clinicaltype:'1'}});
      }
    }

</script>
