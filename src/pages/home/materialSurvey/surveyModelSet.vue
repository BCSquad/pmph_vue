<template>
  <div class="survey_model_set">
    <p class="header_p">
       <span>调研表名称：</span>
       <el-input class="input" v-model="searchParams.templateName"  placeholder="请输入调研表名称" @keyup.enter.native="search()"></el-input>
      <span>调研对象：</span>
      <el-select v-model="searchParams.typeId" @change="search()" style="width: 12em;margin-right:10px;">
        <el-option :key="''" :value="''" :label="'全部'"></el-option>
        <el-option v-for="item in typeList" :key="item.id" :value="item.id" :label="item.surveyName">{{item.surveyName}}</el-option>
      </el-select>

      <span style="display: inline-block;">
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
      </span>
        <el-button type="primary"  style="float:right;margin-top: 10px;" @click="$router.push({name:'调研表模板新增',params:{type:'add'}})">新增模板</el-button>

      <my-upload
        class="pull-right "
        ref="upload"
        :action="api_upload_survey"
        :before-upload="beforeUploadFile"
        :on-success="upLoadFileSuccess"
        :on-error="uploadError"
        :show-file-list="false">
        <el-button type="primary" :disabled="uploadLoading"  :loading="uploadLoading" >{{uploadLoading?'上传解析中...':'点击导入'}}</el-button>
        <!-- <el-button type="primary" :disabled="!productbtn"  v-else>{{'请先维护产品信息'}}</el-button>-->
      </my-upload>
      <span class="pull-right" style="padding-top: 10px;"><a style="color: #337ab7;line-height:36px;margin-right:10px;" href="/static/调研表（模板）导入模板.xlsx">模板下载.xls</a></span>

    </p>
    <el-table
    :data="tableData"
    style="width:100%"
    border
    class="table-wrapper"
    >
     <el-table-column
     label="调研表名称"
     prop="templateName"
     >
     <template scope="scope">
       <el-button :class="'templateName'" type="text" @click="updataTemplate(scope.row.id,'check')">{{scope.row.templateName}}</el-button>
     </template>
     </el-table-column>
      <el-table-column
        label="调研表概述"
        prop="intro"
      >
      </el-table-column>
      <el-table-column
     label="调研对象"
     prop="surveyName"
     width="150"
     :className="'td-center'"
     >
     </el-table-column>
     <el-table-column
     label="创建人"
     prop="username"
     width="110"
     :className="'td-center'"
     >
     </el-table-column>

     <el-table-column
     label="创建日期"
     prop="gmtCreat"
     width="120"
     :className="'td-center'"
     >
     <template scope="scope">
         {{$commonFun.formatDate(scope.row.gmtCreate,'yyyy-MM-dd')}}
         </template>
     </el-table-column>

      <el-table-column
        label="状态"
        prop="active"
        width="80"
        :className="'td-center'"
      >
        <template scope="scope">
          {{scope.row.active?'有效':'无效'}}
        </template>
      </el-table-column>

     <el-table-column
      label="操作"
      width="120"
      :className="'td-center'"
     >
     <template scope="scope">
       <el-button type="text"  @click="updataTemplate(scope.row.id)">修改</el-button>
       <span>|</span>
       <!--<el-button type="text" :disabled="scope.row.status==0" @click="$router.push({name:'补发消息',params:{surveyId:scope.row.id,title:scope.row.title}})" >补发消息</el-button>
       <span>|</span>
       <el-button type="text" @click="$router.push({name:'发起调研',params:{surveyId:scope.row.id,surverData:scope.row}})">发起调研</el-button>
       <span>|</span>-->
       <el-button v-if="isAdmin" type="text" @click="deleteSurvey(scope.row.active,scope.row.id)">{{scope.row.active?'作废':'启用'}}</el-button>
       <!--<span v-if="isAdmin">|</span>-->

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


              surveyLsitUrl:'/pmpheep/materialSurvey/template/list', //调研表模板列表url
              editTemplateUrl:'/pmpheep/materialSurvey/template/question/look', //获取修改信息url
              typeListUrl:'/pmpheep/materialSurvey/typeList',
              api_upload_survey: '/pmpheep/materialSurvey/template/importExcel',
              searchParams:{
                templateName:'',
                startTime:'',
                endTime:'',
                pageSize:10,
                pageNumber:1,
                typeId:''
              },
              uploadLoading:false,
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
              typeList:[],
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
         this.getSurveyList();
          this.getTypeList();
        },
        methods:{
            /* 获取调研表模板列表 */
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


          /**
           * 当上传按钮添加excel
           * @param file
           */
          beforeUploadFile(file){
            let flag = true;

            var filedata = file.raw;
            var ext=file.name.substring(file.name.lastIndexOf(".")+1).toLowerCase();
            // 类型判断
            if(!(ext=='xls'||ext=='xlsx')){
              this.$confirm("请按照模板格式的文档上传文件", "提示",{
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                showCancelButton: false,
                type: "error"
              });
              return;
            }
            //文件名不超过40个字符
            /* if(file.name.length>40){
             this.$confirm("文件名不能超过40个字符", "提示",{
                 confirmButtonText: "确定",
                 cancelButtonText: "取消",
                 showCancelButton: false,
                 type: "error"
             });
             return;
             } */
            // 判断文件大小是否符合 文件不为0
            if(file.size<1){
              this.$confirm("文件大小不能小于1bt", "提示",{
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                showCancelButton: false,
                type: "error"
              });
              return;
            }
            this.uploadLoading=flag;
            return flag;
            //this.loadingInstance = Loading.service({ fullscreen: true });
          },
          /**
           * 上传文件请求成功的回调
           */
          upLoadFileSuccess(res, file, fileList){
            if (res.code == '1') {
              /* this.excelVisible = true;
               this.excelTableData = res.data.list;
               this.uuid=res.data.uuid;*/
              this.getSurveyList();

              this.$message.success("导入成功");
              console.log(res);
            }else{
              this.$confirm(res.msg.msgTrim(), "提示",{
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                showCancelButton: false,
                type: "error"
              });
            }
            var _this = this;
            // this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
            //   _this.loadingInstance.close();
            // });
            this.uploadLoading = false;
          },
          /**
           * 上传文件请求失败的回调
           */
          uploadError(err, file, fileList){
            console.log(err);
            this.$confirm(err.msg.msgTrim(), "提示",{
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              showCancelButton: false,
              type: "error"
            });
            var _this = this;
            // this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
            //   _this.loadingInstance.close();
            // });
            this.uploadLoading = false;
          },







            /* 获取类型列表 */
            getTypeList(){
              this.$axios.get(this.typeListUrl,{
                params:{}
              }).then((res)=>{
                this.typeList = res.data.data;
              })
            },
            /* 搜索按钮 */
            search(){
              this.searchParams.pageNumber=1;
              this.getSurveyList();
            },
           /* 修改按钮 */
           updataTemplate(id,str){
            this.$axios.get(this.editTemplateUrl,{
                params:{
                    templateId:id

                }
            }).then((res)=>{
                console.log(res);
                if(res.data.code==1){
                   this.$router.push({name:'调研表模板新增',params:{surveryData:res.data.data,type:str?str:''}});
                }
            })
           },
          deleteSurvey(oriActive,surveyId){
            let _this = this;
            this.$confirm("确定"+(oriActive?"作废":"启用")+"选中模板吗?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                _this.$axios.get('/pmpheep/materialSurvey/template/switchActive',{
                  params:{
                    isActive:!oriActive,
                    templateId:surveyId
                  }
                }).then((res)=>{
                  console.log(res);
                  if(res.data.code==1){
                    _this.$message.success("操作成功！");
                    _this.getSurveyList();
                  }else{
                    _this.$confirm(res.data.msg.msgTrim(), "提示",{
                      confirmButtonText: "确定",
                      cancelButtonText: "取消",
                      showCancelButton: false,
                      type: "error"
                    });
                  }
                })



              })
              .catch(() => {});




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
.table-wrapper .el-button.el-button--text {
  white-space: normal;
}
.header_p div {
  margin-right: 10px;
  margin-top: 10px;
}
.templateName.el-button{
  text-align: left;
}

</style>
<style>
  .survey_model_set th {
    text-align: center;
  }
</style>
