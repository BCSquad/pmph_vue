<template>

  <span>
    <el-button :type="type" :disabled="disabled" @click="exportWordStart"><slot></slot></el-button>
    <!--<slot :type="type" :disabled="disabled" @click="exportWordStart"></slot>-->

    <el-dialog
      title="正在导出..."
      :visible.sync="exportDialog"
      size="tiny"
      :close-on-click-modal="false"
      :before-close="handleExportDialogClose">
      <div class="paddingT50 paddingB50">
        <el-progress :text-inside="true" :stroke-width="18" :percentage="exportLoading" status="success"></el-progress>
      </div>
    </el-dialog>

    <el-dialog
      title="下载word"
      :visible.sync="downloadWordDialog"
      size="tiny"
    >
        <div class="paddingT20 paddingB50 text-center">
          <div class="width100 inline-block">
            <el-progress type="circle" :percentage="100" status="success"></el-progress>
          </div>
          <div class="paddingT10">
            <el-button type="text" class="link" @click="downloadWord">点击此链接下载word</el-button>
            <el-button type="text" @click="copyDownloadUrl">
              <i class="fa fa-copy"></i>
            </el-button>
          </div>
        </div>
    </el-dialog>
  </span>
</template>

<script>
  export default {
    name: "word-exprot",
    props:{
      type:{
        type:String,
        default:'primary',
      },
      disabled:{
        type:Boolean,
        default:false,
      },
      api_export_word_start:{
        type:String,
        default:"",
        required:true
      },
      api_export_word_progress:{
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
        handleExportWordtimer:null,
        downloadWordDialog:false,
        wordUrl:'',
      }
    },
    methods:{
      exportWordStart(id){
        this.exportDialog=true;
        this.exportLoadingTimerHandle&&this.exportLoadingTimerHandle.bort();
        this.exportLoadingTimerHandle = this.$commonFun.perfectAnimate(0,100,60000,(val)=>{
          this.exportLoading = val;
          if(this.exportLoading==100){
            this.exportDialog=false;
          }
        },true);
        this.$axios.get(this.api_export_word_start,{params:this.params})
          .then(response=>{
            this.exportWordProgress(response.data);
          })
          .catch(e=>{
            console.log(e);
            this.exportDialog=false;
            clearInterval(this.handleExportWordtimer);
            this.$confirm('导出失败，请重试！', "提示",{
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              showCancelButton: false,
              type: "error"
            })
          })
      },
      exportWordProgress(id){
        var timeout = 3*60*1000;//设置3分钟超时
        var useTime = 0;
        this.handleExportWordtimer = setInterval(()=>{
          useTime+=1500;
          this.$axios.get(this.api_export_word_progress,{params:{
              id:id
            }})
            .then(response=>{
              let res = response.data;
              if(res.state==1){
                clearInterval(this.handleExportWordtimer);
                //console.log("exportWordDownload  "+res.detail);
                this.exportWordDownload(res.detail);
              }
            })
            .catch(e=>{
              console.log(e);
              if(this.exportDialog){
                this.$confirm('导出失败，请重试！', "提示",{
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  showCancelButton: false,
                  type: "error"
                });
                this.exportDialog=false;
                clearInterval(this.handleExportWordtimer);
                this.exportLoadingTimerHandle&&this.exportLoadingTimerHandle.end();
              }
            })
          //超时提醒
          if(useTime>timeout){
            this.$confirm('导出请求超时，请重试！', "提示",{
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              showCancelButton: false,
              type: "error"
            });
            clearInterval(this.handleExportWordtimer);
            this.exportLoadingTimerHandle&&this.exportLoadingTimerHandle.end();
          }
        },1500)

      },
      exportWordDownload(url){
        console.log("url   "+url);
        //this.$commonFun.downloadFile('/pmpheep'+url);
        this.exportDialog=false;
        this.exportLoadingTimerHandle&&this.exportLoadingTimerHandle.end();
        this.downloadWordDialog=true;
        console.log("url   /pmpheep"+url);
        this.wordUrl='/pmpheep'+url;

      },
      downloadWord(){
        if(this.wordUrl){
          this.$commonFun.downloadFile(this.wordUrl);
        }
        this.downloadWordDialog = false;
      },
      copyDownloadUrl(){
        if(this.wordUrl){
          this.$commonFun.copy(window.location.origin+this.wordUrl);
        }
      },
      /**
       * 导出进度条关闭前
       */
      handleExportDialogClose(done){
        this.exportLoadingTimerHandle&&this.exportLoadingTimerHandle.bort();
        clearInterval(this.handleExportWordtimer)
        done();
      },
    }
  }
</script>

<style scoped>

</style>
