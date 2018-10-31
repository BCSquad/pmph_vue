<template>
  <div class="survey_model_set">
    <p class="header_p">
       <span>模板名称：</span>
       <el-input class="input" v-model="searchParams.templateName"  placeholder="请输入模板名称" @keyup.enter.native="search()"></el-input>
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
        <el-button type="primary"  style="float:right" @click="$router.push({name:'调研表新增',params:{type:'add'}})">直接新增</el-button>
    </p>
    <el-table
    :data="tableData"
    style="width:100%"
    border
    class="table-wrapper"
    >
     <el-table-column
     label="模板名称"
     prop="templateName"
     >
     <template scope="scope">
       <el-button type="text" @click="updataTemplate(scope.row.id,'check')">{{scope.row.templateName}}</el-button>
     </template>
     </el-table-column>
      <el-table-column
     label="调查对象"
     prop="surveyName"
     width="100"
     >
     </el-table-column>
     <el-table-column
     label="创建人"
     prop="username"
     width="110"
     >
     </el-table-column>
     <el-table-column
     label="问卷概述"
     prop="intro"
     >
     </el-table-column>
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
        label="状态"
        prop="active"
        width="120"
      >
        <template scope="scope">
          {{scope.row.active?'有效':'无效'}}
        </template>
      </el-table-column>

     <el-table-column
      label="操作"
      width="120"
     >
     <template scope="scope">
       <el-button type="text"  @click="updataTemplate(scope.row.id)">修改</el-button>
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
</template>
<script type="text/javascript">
    export default{
        data(){
            return{


              surveyLsitUrl:'/pmpheep/materialSurvey/template/list', //调查问卷列表url
              editTemplateUrl:'/pmpheep/materialSurvey/template/question/look', //获取修改信息url

                searchParams:{
                    templateName:'',
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
           updataTemplate(id,str){
            this.$axios.get(this.editTemplateUrl,{
                params:{
                    templateId:id

                }
            }).then((res)=>{
                console.log(res);
                if(res.data.code==1){
                   this.$router.push({name:'调研表新增',params:{surveryData:res.data.data,type:str?str:''}});
                }
            })
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
