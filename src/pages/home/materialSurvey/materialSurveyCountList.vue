<template>
  <div class="survey_model_set">
    <div class="application_nav">
      <div class="tab_nav_outbox" v-if="!$router.currentRoute.meta.hideTabs">
        <el-button type="text"  class="back_button" icon="arrow-left" @click="$router.go(-1)">返回上一步</el-button>
      </div>
      <div class="header_title_tips" v-if="searchParams.materialRelative">
        <p >{{materialName}}</p>
        <div class="tips_icon"></div>
      </div>

      <div class="bottom_tab_content">
      <p class="header_p">
        <span>调研表名称：</span>
        <el-input class="input" v-model="searchParams.title"  placeholder="请输入调研表名称" @keyup.enter.native="search()"></el-input>
        <span>创建日期：</span>
        <el-date-picker
          v-model="dateTimeRange"
          type="datetimerange"
          :picker-options="pickerOptions"
          :editable="false"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="dateTimeRangeChange"
          align="right">
        </el-date-picker>
        <!--<el-date-picker
          v-model="searchParams.startTime"
          class="input data"
          type="date"
          clearable
          @change="startDateChange"
          placeholder="请选择开始日期">
        </el-date-picker>
        <span>-</span>
        <el-date-picker
          v-model="searchParams.endTime"
          class="input data"
          type="date"
          clearable
          @change="endDateChange"
          placeholder="请选择结束日期">
        </el-date-picker>-->
        <el-button type="primary" icon="search" @click="search()">搜索</el-button>
        <span class="operation-wrapper">
          <el-button type="primary" :disabled="!tableData.length" @click="exportWordStart">导出Word</el-button>
          <!--<el-button type="primary" :disabled="!tableData.length" @click="exportExcel">导出Excel</el-button>-->
        </span>
      </p>

      <el-table
        :data="tableData"
        style="width:100%"
        border
        class="table-wrapper"
      >
        <el-table-column
          label="调研表名称"
          prop="title"
        >

          <!--<template scope="scope">
            <el-button type="text" @click="updataTemplate(scope.row.templateId,scope.row.id,'check')">{{scope.row.title}}</el-button>
          </template>-->
        </el-table-column>
        <el-table-column
          label="调研对象"
          prop="surveyName"
          width="150"
          :class-name="'td-center'"
        >
        </el-table-column>
        <el-table-column
          label="发布人"
          prop="username"
          width="110"
          :class-name="'td-center'"
        >
        </el-table-column>
        <!--<el-table-column
        label="问卷概述"
        prop="intro"
        >
        </el-table-column>-->
        <el-table-column
          label="创建日期"
          prop="gmtCreat"
          width="120"
          :class-name="'td-center'"
        >
          <template scope="scope">
            {{$commonFun.formatDate(scope.row.gmtCreate,'yyyy-MM-dd')}}
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          prop="status"
          width="110"
          :class-name="'td-center'"
        >
          <template scope="scope">
            {{scope.row.status == 1?'已发布':(scope.row.status == 0?'未发布':(scope.row.status == 2?'已撤回':'未发布'))}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="120"
          :class-name="'td-center'"
        >
          <!--:width="isAdmin?350:300"
         >-->
          <template scope="scope">
            <el-button type="text"  @click="toAnswerList(scope.row.id,scope.row.title)">查看结果</el-button>
            <!--<el-button type="text" :disabled="scope.row.status==0" @click="$router.push({name:'补发消息',params:{surveyId:scope.row.id,title:scope.row.title}})" >补发消息</el-button>
            <span>|</span>-->
            <!--<el-button type="text" @click="$router.push({name:'发起调查',params:{surveyId:scope.row.id,surverData:scope.row}})">发起调查</el-button>
            <span>|</span>-->
            <!--<span v-if="isAdmin">|</span>-->
            <!--<el-button type="text" @click="$router.push({name:'问卷模板新增',params:{type:'add'}})">添加问卷</el-button>-->
            <!--<el-button type="text" @click="showSend(scope.row.id)">查看发送对象</el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <div class="pagination-wrapper">
        <el-pagination
          v-if="pageTotal>searchParams.pageSize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchParams.pageNumber"
          :page-sizes="[10,20,30,50]"
          :page-size="searchParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageTotal">
        </el-pagination>
      </div>
      </div>
    </div>

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


    <!--查看发送对象-->
    <el-dialog title="已发送对象"  :visible.sync="showSendVisible">
      <el-table :data="sendTable" border >
        <el-table-column property="orgName" label="机构名称"></el-table-column>
        <el-table-column property="username" label="管理员姓名" ></el-table-column>
        <el-table-column property="handphone" label="手机"></el-table-column>
      </el-table>
      <el-pagination
        class="pull-right marginT10 marginB10"
        v-if="sendTotal>sendPageSize"
        @size-change="sendSizeChange"
        @current-change="sendCurrentChange"
        :current-page="sendPageNumber"
        :page-sizes="[10,20,30,50]"
        :page-size="sendPageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="sendTotal">
      </el-pagination>
    </el-dialog>

  </div>
</template>
<script type="text/javascript">
    export default{
        data(){
            return{
              surveyLsitUrl:'/pmpheep/materialSurvey/list', //调查问卷列表url
              toAnswerListUrl:'/pmpheep/materialSurvey/toAnswerList', //获取修改信息url
              api_export_word_start:'/pmpheep/word/material/survey',
              api_export_word_progress:'/pmpheep/word/progress',
              api_export_word_download:'/pmpheep/zip/download',

                searchParams:{
                    title:'',
                    startTime:'',
                    endTime:'',
                    pageSize:10,
                    pageNumber:1,
                    materialRelative:false,
                    materialId:null
                },
                dateTimeRange:[],
                pickerOptions:{
                  shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                      const end = new Date();
                      const start = new Date();
                      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                      picker.$emit('pick', [start, end]);
                    }
                  }, {
                    text: '最近一个月',
                    onClick(picker) {
                      const end = new Date();
                      const start = new Date();
                      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                      picker.$emit('pick', [start, end]);
                    }
                  }, {
                    text: '最近三个月',
                    onClick(picker) {
                      const end = new Date();
                      const start = new Date();
                      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                      picker.$emit('pick', [start, end]);
                    }
                  }]
                },
              exportDialog:false,
              exportLoading:0,
              exportLoadingTimerHandle:undefined,
              handleExportWordtimer:null,
              downloadWordDialog:false,
              wordUrl:'',
                materialName:'',
                pageTotal:100,
                tableData:[],
               showSendVisible: false,
                sendTable: [],
              sendPageSize: 20,
              sendPageNumber: 1,
              sendTotal: 0,
              isAdmin:false,
            }
        },
        created(){
          this.isAdmin = this.$getUserData().userInfo.isAdmin;
          this.searchParams.materialRelative=this.$route.query.materialRelative?this.$route.query.materialRelative:false;
          this.searchParams.materialId=this.$route.query.materialId?this.$route.query.materialId:null;
          this.materialName = this.$route.query.materialName?this.$route.query.materialName:'';
         this.getSurveyList();
        },
        methods:{
            /* 获取问卷列表 */
            getSurveyList(){
              this.$axios.get(this.surveyLsitUrl,{
                  params:this.searchParams
              }).then((res)=>{
                  console.log(res);
                  if(res.data.code==1){
                      this.pageTotal=res.data.data.total;
                      this.tableData=res.data.data.rows;
                  }
              })
            },
            /* 搜索按钮 */
            search(){
              this.searchParams.pageNumber=1;
              this.getSurveyList();
            },
           /* 查看调研表填写列表 */
           toAnswerList(sid,title){
             this.$router.push({name:'调研表回答列表',query:{surveyId:sid,title:title}});
           },
          dateTimeRangeChange(val){
            if(val){
              this.searchParams.startTime=val.split("至")[0];
              this.searchParams.endTime=val.split("至")[1];
            }else{
              this.searchParams.startTime='';
              this.searchParams.endTime='';
            }
          },
            /*startDateChange(val){
             this.searchParams.startTime=val;
            },
            endDateChange(val){
              this.searchParams.endTime=val;
            },*/
            /* 分页改变 */
            handleSizeChange(val){
              this.searchParams.pageSize=val;
              this.searchParams.pageNumber=1;
              this.getSurveyList();
            },
            handleCurrentChange(val){
                  this.searchParams.pageNumber=val;
              this.getSurveyList();
            },


          exportWordStart(id){
            this.exportDialog=true;
            this.exportLoadingTimerHandle&&this.exportLoadingTimerHandle.bort();
            this.exportLoadingTimerHandle = this.$commonFun.perfectAnimate(0,100,60000,(val)=>{
              this.exportLoading = val;
              if(this.exportLoading==100){
                this.exportDialog=false;
              }
            },true);
            this.$axios.get(this.api_export_word_start,{params:this.searchParams})
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
            var timeout = 6*60*1000;//设置3分钟超时
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
                    console.log("exportWordDownload  "+res.detail);
                    this.exportWordDownload(res.detail);
                  }else if(res.state == 2){
                    throw new DOMException(res.detail,res.detail);
                  }
                })
                .catch(e=>{
                  console.log(e.message);
                  if(this.exportDialog){
                    this.$confirm(e?e.message:'导出失败，请重试！', "提示",{
                      confirmButtonText: "确定",
                      cancelButtonText: "取消",
                      showCancelButton: false,
                      type: "error"
                    }).then(() => {

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
          },
          copyDownloadUrl(){
            if(this.wordUrl){
              this.$commonFun.copy(window.location.origin+this.wordUrl);
            }
          },
          /**
           * 导出进度条关闭前
           */
          exportDialogClose(done){
            this.exportLoadingTimerHandle&&this.exportLoadingTimerHandle.bort();
            clearInterval(this.handleExportWordtimer)
            done();
          },

          /**
           * 查看发送对象
           */
          showSend(id){
            this.showSendVisible = true;
            this.$axios.get('/pmpheep/survey/send/org',{
              params:{
                surveyId: id,
                pageSize: this.sendPageSize,
                pageNumber: this.sendPageNumber
              }
            }).then(response => {
              let res = response.data;
              if (res.code == 1) {
                this.sendTotal = res.data.total;
                this.sendTable = res.data.rows;
              }
            }).catch(error => {
              this.$confirm('请求错误请稍后再试！', "提示",{
              	confirmButtonText: "确定",
              	cancelButtonText: "取消",
              	showCancelButton: false,
              	type: "error"
              });
            })
          },
          /* 分页改变 */
          sendSizeChange(val){
            this.sendPageSize=val;
            this.sendPageNumber=1;
            this.showSend();
          },
          sendCurrentChange(val){
            this.sendPageNumber=val;
            this.showSend();
          },
        }
    }
</script>
<style scoped>
.survey_model_set .header_p {
  overflow: hidden;
}
.survey_model_set .header_p .input {
  width: 217px;
  margin-right: 10px;
}
.survey_model_set .header_p .data{
    width:200px;
}

.application_nav{
  float: left;
  width:100%;
  position: relative;
}
.bottom_tab_content{
  background-color: #fff;
}
.application_nav .tab_nav_outbox{
  float: left;
  width:100%;
  background-color: rgb(238, 241, 246);
  border: 1px solid rgb(209, 217, 229);
  box-sizing: border-box;
}
.application_nav .tab_nav_outbox .back_button{
  float:right;
  margin-right:20px;
  margin-left:20px;
  line-height: 20px;
}
.application_nav .tab_nav{
  box-shadow: none;
  border-bottom:0;
  float: right;
  border:0;
  box-sizing: border-box;

}
.application_nav .tab_nav .el-tabs__nav{
  border-right:1px solid rgb(238, 241, 246);
  border-left:1px solid rgb(238, 241, 246);
}
.application_nav .tab_active_first .el-tabs__nav{
  border-left: 1px solid rgb(209, 217, 229);
}
.application_nav .tab_active_last .el-tabs__nav{
  border-right: 1px solid rgb(209, 217, 229);
}
.application_nav .tab_nav  .el-tabs__header{
  border-bottom:0 ;
}
.application_nav .tab_nav .el-tabs__nav .el-tabs__item{
  border-bottom: 1px solid rgb(209, 217, 229);
}
.application_nav .tab_nav .el-tabs__nav .is-active{
  border-bottom:0;
}
.application_nav .tab_nav .el-tabs__content{
  padding:0 ;
}
.application_nav .bottom_tab_content{
  border: 1px solid rgb(209, 217, 229);
  box-sizing: border-box;
  border-top:0;
  padding:15px 20px;
  float:left;
  width:100%;
  background-color: #fff;
}
.application_nav .header_title_tips{
  margin-bottom:15px;
  float:left;
  color:#fff;
  position: absolute;
  left:-8px;
  top:8px;
}
.application_nav .header_title_tips p{
  float:left;
  background-color: #12806b;
  font-size:16px;
  padding:2px 20px 2px 15px;
  max-width:530px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.application_nav .header_title_tips .tips_icon{
  border:4px solid #475669;
  position: absolute;
  left: 0;
  bottom:-8px;
  border-left-color:#fff;
  border-bottom-color:#fff;
}

.survey_model_set .header_p{
  overflow: hidden;
  padding: 10px;
}
  .bottom_tab_content{

  }
.header_p button {
  margin-bottom: 10px;
}
</style>
<style>
  .survey_model_set th {
    text-align: center;
  }
</style>
