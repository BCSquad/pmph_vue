<template>

  <div>
    <el-button  :type="type" :disabled="disabled" @click="exportExcel"><slot></slot></el-button>

    <el-dialog
      title="正在导出..."
      :visible.sync="exportDialog"
      size="tiny"
      :close-on-click-modal="false"
      :before-close="exportDialogClose">
      <div class="paddingT50 paddingB50">
        <el-progress :text-inside="true" :stroke-width="18" :percentage="exportLoading" status="success"></el-progress>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    export default {
      name: "excel-exprot",
      props:{
        type:{
          type:String,
          default:'primary',
        },
        disabled:{
          type:Boolean,
          default:false,
        },
        api_export_excel:{
          type:String,
          default:"",
          required:true
        },
        params:{
          type:Object,
          default:function () {
            return {};
          },
        },
      },
      data() {
        return {
          exportDialog:false,
          exportLoading:0,
          exportLoadingTimerHandle:undefined,
        }
      },
      methods:{
        /**
         * 导出excel
         */
        exportExcel(){
          if(this.exportDialog){
            this.$message.warning('已有文件正在导出，请稍后再试！');
            return;
          }
          this.exportDialog=true;
          this.exportLoadingTimerHandle&&this.exportLoadingTimerHandle.bort();
          this.exportLoadingTimerHandle = this.$commonFun.perfectAnimate(0,100,6000,(val)=>{
            this.exportLoading = val;
            if(this.exportLoading==100){
              this.exportDialog=false;
            }
          });


          let excelUrl = this.api_export_excel;
          for(let key in this.params){
            excelUrl+=((excelUrl.includes('?')?'&':'?')+key+'='+this.params[key]);
          }
          this.$commonFun.downloadFile(excelUrl);
        },
        /**
         * 导出进度条关闭前
         */
        exportDialogClose(done){

          done();
        },
      }

    }
</script>

<style scoped>

</style>
