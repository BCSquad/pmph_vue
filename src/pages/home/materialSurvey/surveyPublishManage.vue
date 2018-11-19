<template>
  <div class="survey_model_set">
    <p class="header_p">
       <span>调研表名称：</span>
       <el-input class="input" v-model="searchParams.title"  placeholder="请输入调研表名称" @keyup.enter.native="search()"></el-input>
      <span>调研对象：</span>
      <el-select v-model="searchParams.typeId" @change="search()" style="width: 12em;margin-right:10px;">
        <el-option :key="''" :value="''" :label="'全部'"></el-option>
        <el-option v-for="item in typeList" :key="item.id" :value="item.id" :label="item.surveyName">{{item.surveyName}}</el-option>
      </el-select>

      <span style="display: inline-block;">
      <span>发布时间：</span>
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
            :editable="false"
            @change="startDateChange"
            placeholder="请选择开始日期">
        </el-date-picker>
        <span>-</span>
        <el-date-picker
            v-model="searchParams.endTime"
            class="input data"
            type="date"
            clearable
            :editable="false"
            @change="endDateChange"
            placeholder="请选择结束日期">
        </el-date-picker>-->
        <el-button type="primary" icon="search" @click="search()">搜索</el-button>
      </span>


      <el-button type="primary"  style="float:right;margin-top: 10px;" @click="$router.push({name:'选择调研表模板',params:{type:'add'}})">新增</el-button>

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
     <template scope="scope">
       <el-button type="text" @click="updataTemplate(scope.row.templateId,scope.row.id,'check')">{{scope.row.title}}</el-button>
     </template>
     </el-table-column>
      <el-table-column
     label="调研对象"
     prop="surveyName"
     width="150"
     :className="'td-center'"
     >
     </el-table-column>
     <el-table-column
     label="发布人"
     prop="username"
     width="110"
     :className="'td-center'"
     >
     </el-table-column>
     <!--<el-table-column
     label="调研表概述"
     prop="intro"
     >
     </el-table-column>-->
     <el-table-column
     label="发布日期"
     prop="gmtPublish"
     width="120"
     :className="'td-center'"
     >
     <template scope="scope">
         {{$commonFun.formatDate(scope.row.gmtPublish,'yyyy-MM-dd')}}
         </template>
     </el-table-column>
      <el-table-column
        label="状态"
        prop="status"
        width="110"
        :className="'td-center'"
      >
        <template scope="scope">
          {{scope.row.status == 1?'已发布':(scope.row.status == 0?'未发布':(scope.row.status == 2?'已撤回':'未发布'))}}
        </template>
      </el-table-column>
     <el-table-column
      label="操作"
      width="120"
      :className="'td-center'"
     >
      <!--:width="isAdmin?350:300"
     >-->
     <template scope="scope">
       <el-button type="text"  @click="updataTemplate(scope.row.templateId,scope.row.id)">修改</el-button>
       <span>|</span>
       <!--<el-button type="text" :disabled="scope.row.status==0" @click="$router.push({name:'补发消息',params:{surveyId:scope.row.id,title:scope.row.title}})" >补发消息</el-button>
       <span>|</span>-->
       <!--<el-button type="text" @click="$router.push({name:'发起调查',params:{surveyId:scope.row.id,surverData:scope.row}})">发起调查</el-button>
       <span>|</span>-->
       <el-button v-if="isAdmin" type="text" @click="deleteSurvey(scope.row.status,scope.row.id)">{{scope.row.status!=1?'发布':'撤回'}}</el-button>
       <!--<span v-if="isAdmin">|</span>-->
       <!--<el-button type="text" @click="$router.push({name:'调研表模板新增',params:{type:'add'}})">新增</el-button>-->
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
              surveyLsitUrl:'/pmpheep/materialSurvey/list', //调查调研表列表url
              editTemplateUrl:'/pmpheep/materialSurvey/question/look', //获取修改信息url
              typeListUrl:'/pmpheep/materialSurvey/typeList',
                searchParams:{
                    title:'',
                    startTime:'',
                    endTime:'',
                    pageSize:10,
                    pageNumber:1,
                    typeId:''
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
          /* 获取调研表列表 */
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
           updataTemplate(tid,sid,str){
            this.$axios.get(this.editTemplateUrl,{
                params:{
                    id:sid
                }
            }).then((res)=>{
                console.log(res);
                if(res.data.code==1){
                   this.$router.push({name:str!='check'?'调研表新增':'调研表详情',params:{surveryData:res.data.data,type:str?str:''}});
                }
            })
           },
          deleteSurvey(oldStatus,surveyId){
            let _this = this;
            let status = oldStatus!=1?1:2;
            this.$confirm("确定"+(oldStatus!=1?'发布':'撤回')+"选中调研表吗?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                _this.$axios.get('/pmpheep/materialSurvey/switchActive',{
                  params:{
                    id:surveyId,
                    status:status
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

</style>
<style>
  .survey_model_set th {
    text-align: center;
  }
</style>
