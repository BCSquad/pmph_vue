<template>
  <div class="survey_model_set">
    <p class="header_p">
       <span>调查问卷名称：</span>
       <el-input class="input" v-model="searchParams.title"  placeholder="请输入调查问卷名称" @keyup.enter.native="search()"></el-input>
       <span>创建日期：</span>
       <el-date-picker
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
        </el-date-picker>
        <el-button type="primary" icon="search" @click="search()">搜索</el-button>
        <el-button type="primary"  style="float:right" @click="$router.push({name:'问卷模板新增',params:{type:'add'}})">添加问卷</el-button>
    </p>
    <el-table
    :data="tableData"
    style="width:100%"
    border
    class="table-wrapper"
    >
     <el-table-column
     label="调查问卷名称"
     prop="title"
     >
     <template scope="scope">
       <el-button type="text" @click="updataTemplate(scope.row.templateId,scope.row.id,'check')">{{scope.row.title}}</el-button>
     </template>
     </el-table-column>
      <el-table-column
     label="调查对象"
     prop="surveyName"
     width="100"
     >
     </el-table-column>
     <el-table-column
     label="问卷制作人"
     prop="username"
     width="110"
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
     >
     <template scope="scope">
         {{$commonFun.formatDate(scope.row.gmtCreate,'yyyy-MM-dd')}}
         </template>
     </el-table-column>
     <el-table-column
      label="操作"
      :width="isAdmin?350:300"
     >
     <template scope="scope">
       <el-button type="text" :disabled="scope.row.status!=0"  @click="updataTemplate(scope.row.templateId,scope.row.id)">修改</el-button>
       <span>|</span>
       <!--<el-button type="text" :disabled="scope.row.status==0" @click="$router.push({name:'补发消息',params:{surveyId:scope.row.id,title:scope.row.title}})" >补发消息</el-button>
       <span>|</span>-->
       <el-button type="text" @click="$router.push({name:'发起调查',params:{surveyId:scope.row.id,surverData:scope.row}})">发起调查</el-button>
       <span>|</span>
       <el-button v-if="isAdmin" type="text" @click="deleteSurvey(scope.row.templateId,scope.row.id)">删除</el-button>
       <span v-if="isAdmin">|</span>
       <!--<el-button type="text" @click="$router.push({name:'问卷模板新增',params:{type:'add'}})">添加问卷</el-button>-->
       <el-button type="text" @click="showSend(scope.row.id)">查看发送对象</el-button>
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
              surveyLsitUrl:'/pmpheep/materialSurvey/list', //调查问卷列表url
              editTemplateUrl:'/pmpheep/materialSurvey/question/look', //获取修改信息url

                searchParams:{
                    title:'',
                    startTime:'',
                    endTime:'',
                    pageSize:10,
                    pageNumber:1
                },
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
           /* 修改按钮 */
           updataTemplate(tid,sid,str){
            this.$axios.get(this.editTemplateUrl,{
                params:{
                    id:sid
                }
            }).then((res)=>{
                console.log(res);
                if(res.data.code==1){
                   this.$router.push({name:'调研表新增',params:{surveryData:res.data.data,type:str?str:''}});
                }
            })
           },
          deleteSurvey(templateId,surveyId){
            let _this = this;
            this.$confirm("确定删除选中问卷吗?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                _this.$axios.delete('/pmpheep/survey/'+surveyId+'/remove',{
                  params:{
                    templateId:templateId,
                    surveyId:surveyId
                  }
                }).then((res)=>{
                  console.log(res);
                  if(res.data.code==1){
                    _this.$message.success("删除成功！");
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
            startDateChange(val){
             this.searchParams.startTime=val;
            },
            endDateChange(val){
              this.searchParams.endTime=val;
            },
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
</style>
