<template>
  <div class="survey_model_set">
    <div class="application_nav">
      <div class="tab_nav_outbox" v-if="!$router.currentRoute.meta.hideTabs">
        <el-button type="text"  class="back_button" icon="arrow-left" @click="$router.go(-1)">返回上一步</el-button>
      </div>
      <div class="header_title_tips">
        <p >{{title}}</p>
        <div class="tips_icon"></div>
      </div>

      <div class="bottom_tab_content">
      <p class="header_p">
        <span>提交人姓名：</span>
        <el-input class="input" v-model="searchParams.realname"  placeholder="请输入提交人姓名" @keyup.enter.native="search()"></el-input>

        <el-button type="primary" icon="search" @click="search()">搜索</el-button>

      </p>
      <el-table
        :data="tableData"
        style="width:100%"
        border
        class="table-wrapper"
      >
        <el-table-column
          label="提交人姓名"
          prop="realname"
          width="110"
        >
          <template scope="scope">
            <el-button type="text" @click="updataTemplate(scope.row.templateId,scope.row.id,'check')">{{scope.row.realname}}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="用户类别"
          prop="userTypeName"
          width="150"
        >
        </el-table-column>

        <!--<el-table-column
        label="问卷概述"
        prop="intro"
        >
        </el-table-column>-->
        <el-table-column
          label="填写时间"
          prop="submitTime"
          width="120"
        >
          <template scope="scope">
            {{$commonFun.formatDate(scope.row.submitTime,'yyyy-MM-dd')}}
          </template>
        </el-table-column>
        <el-table-column
          label="工作单位"
          prop="orgName"

        >
        </el-table-column>

        <el-table-column
          label="操作"
          width="120"
        >
          <!--:width="isAdmin?350:300"
         >-->
          <template scope="scope">
            <el-button type="text"  @click="toAnswerDetail(scope.row.surveyId,scope.row.userId,scope.row.userType,title)">查看结果</el-button>

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


  </div>
</template>
<script type="text/javascript">
    export default{
        data(){
            return{

              toAnswerListUrl:'/pmpheep/materialSurvey/toAnswerList', //获取修改信息url

                searchParams:{
                    realname:'',
                    orgId:'',
                    pageSize:10,
                    pageNumber:1,
                    surveyId:null
                },
                title:'',
                pageTotal:100,
                tableData:[],
              sendPageSize: 20,
              sendPageNumber: 1,
              isAdmin:false,
            }
        },
        created(){
          this.isAdmin = this.$getUserData().userInfo.isAdmin;
          this.searchParams.surveyId=this.$route.query.surveyId?this.$route.query.surveyId:null;
          this.title = this.$route.query.title?this.$route.query.title:'';
         this.getSurveyList();
        },
        methods:{
            /* 获取问卷回答列表 */
            getSurveyList(){
              this.$axios.get(this.toAnswerListUrl,{
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
           /* 查看调研表填写详情 */
           toAnswerDetail(sid,userId,userType,title){
             alert("todo:跳转到查看详情界面"+" sid: "+sid+" userId: "+userId+" userType: "+userType+" title: "+title);
            /*this.$axios.get(this.toAnswerListUrl,{
                params:{
                  surveyId:sid
                }
            }).then((res)=>{
                console.log(res);

                if(res.data.code==1){
                   this.$router.push({name:'调研表新增',params:{surveryData:res.data.data,type:str?str:''}});
                }
            })*/
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
</style>
