<template>
  <el-breadcrumb separator="/" class="my-breadcrumb">
    <el-breadcrumb-item v-for="(item, index) in breadData" v-if="item.meta.replaceName!=false" :to="{ name: (item.meta.replaceName?item.meta.replaceName:item.name) }" :key="index">{{breadName(item)}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
	export default {
		data() {
			return {
        breadData:[],
        queryName:this.$route.query.queryName,
        clinicalTabletype:this.$route.query.clinicalTabletype,
        clinicalTableName:['','临床助手申报表','用药助手申报表','中医助手申报表']
      }
		},
    computed:{
    },
    watch: {
      $route () {
        this.initBreadData();
      }
    },
    methods:{

      //面包屑
      initBreadData(){
        //console.log(this.$router);
       this.breadData=this.$router.currentRoute.matched;
      },
      breadName(item){
        if(item.name=='新建通知'){
           return this.$route.params.materialId=='new'?'新建通知':'修改通知';
        }/*else if(item.name=='新建通知'){
          return this.$route.query.product_id=='new'?'新建通知':'修改通知';
        }else if(item.name=='临床决策专家申报审核'||item.name=='临床决策专家申报列表'){
          //alert(this.clinicalTableName[this.clinicalTabletype])
          //console.log(this.$router.currentRoute.fullPath)
          return decodeURI((this.$router.currentRoute.fullPath.substr(this.$router.currentRoute.fullPath.lastIndexOf('=')+1))) ;

        }else{

        }*/
        // console.log("-----------------");
        // console.log(item)
        //var str2 = this.$router.currentRoute.fullPath.split('/')[2];
        if(item.name == "临床决策专家申报审核"){
          return this.$route.query.product_name;
        }
        return item.meta.replaceName?item.meta.replaceName:item.name;
      }
    },
    created(){
      this.initBreadData();
    }
	}
</script>

<style scoped>
.my-breadcrumb{
  font-size: 16px;
  line-height: 38px;
}
</style>
