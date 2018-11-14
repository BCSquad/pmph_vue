<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view class="subpage"></router-view>
    </transition>
  </div>
</template>

<script>

  export default {
    name: 'app',
    data: function (){
      return {
        active:true
      }
    },
    created(){

    },

  }
</script>

<style>
  html,body{
    margin: 0;
    position: relative;
    height:100%;
  }
  #app {
    min-width: 1200px;
    height: 100%;
    margin: 0 auto;
    /*overflow: hidden;*/
    overflow-y: hidden;
    font-family: "Helvetica Neue","PingFang SC",Arial,sans-serif;
  }
  .fade-enter-active, .fade-leave-active {
  transition: opacity .3s ease;
}
.fade-enter, .fade-leave-active {
  opacity: 0;
}
  td.justify{
    text-align-last: justify;
  }
  td.td-center{
    text-align: center;
  }
</style>
