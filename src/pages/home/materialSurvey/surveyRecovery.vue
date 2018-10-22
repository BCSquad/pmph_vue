<template>
  <div class="survey_recovery">
    <p class="header_p">
       <span>调查问卷名称：</span>
       <el-input class="input" placeholder="请输入调查问卷名称" v-model="searchParams.title"></el-input>
       <span>提交人：</span>
        <el-input class="input" placeholder="提交人姓名" v-model="searchParams.userName"></el-input>
        <el-button type="primary" icon="search" @click="search">查询</el-button>
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
     </el-table-column>
     <el-table-column
     label="提交人"
     prop="realname"
     width="110"
     >
     </el-table-column>
     <el-table-column
     label="用户类别"
     prop="loginType"
     width="100"
     >
      <template scope="scope">
        <p v-if="scope.row.loginType==1">社内用户</p>
        <p v-if="scope.row.loginType==2">作家用户</p>
        <p v-if="scope.row.loginType==3">机构用户</p>
         </template>
     </el-table-column>
      <el-table-column
     label="所在机构"
     prop="orgName"
     width="150"
     >
     </el-table-column>
     <el-table-column
     label="提交时间"
     prop="gmt_create"
     width="170"
     >
     <template scope="scope">
       {{$commonFun.formatDate(scope.row.gmtCreate)}}
     </template>
     </el-table-column>
     <el-table-column
      label="操作"
      width="100"
     >
     <template scope="scope">
       <el-button type="text" @click="$router.push({name:'问卷回收结果',params:{surveyId:scope.row.surveyId,userId:scope.row.userId}})">查看</el-button>
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
                recoveryListUrl:'/pmpheep/survey/question/answer/recovery',   //回收列表url
                searchParams:{
                    userName:'',
                    title:'',
                    pageSize:10,
                    pageNumber:1
                },
                pageTotal:100,
                tableData:[
                    {
                        name:'求职调查',
                        surveyObj:'在校学生',
                        writer:'张三',
                        summary:'调查学生的职业规划',
                        createDate:'2017-10-1 12:30:20'
                    },
                    {
                        name:'创业调查',
                        surveyObj:'在校老师',
                        writer:'李四',
                        summary:'调查学生的创业能力',
                        createDate:'2017-9-1 11:15:23'
                    },
                    {
                        name:'卫生情况调查',
                        surveyObj:'卫生院系',
                        writer:'王五',
                        summary:'调查卫生学校情况',
                        createDate:'2017-8-1 15:26:30'
                    },
                    {
                        name:'课外活动项目调查',
                        surveyObj:'在校学生',
                        writer:'赵六',
                        summary:'调查学生课外活动参与情况',
                        createDate:'2017-4-1 26:52:14'
                    },
                    {
                        name:'校园兴趣调查',
                        surveyObj:'在校学生',
                        writer:'张三',
                        summary:'调查学生的校园兴趣',
                        createDate:'2017-8-5 10:21:45'
                    },
                ]
            }
        },
        created(){
          this.getRecoveryList();
        },
        methods:{
            /* 获取调查问卷列表 */
            getRecoveryList(){
             this.$axios.get(this.recoveryListUrl,{
                 params:this.searchParams
             }).then((res)=>{
                 if(res.data.code==1){
                     this.pageTotal=res.data.data.total;
                     this.tableData=res.data.data.rows;
                     console.log(res);
                 }
             })
            },
            /* 搜索 */
            search(){
             this.searchParams.pageNumber=1;
             this.getRecoveryList();
            },
            handleSizeChange(val){
             this.searchParams.pageSize=val;
             this.searchParams.pageNumber=1;
             this.getRecoveryList();
            },
            handleCurrentChange(val){
              this.searchParams.pageNumber=val;
              this.getRecoveryList();
            }
        }
    }
</script>
<style scoped>
.survey_recovery .header_p {
  overflow: hidden;
}
.survey_recovery .header_p .input {
  width: 217px;
  margin-right: 10px;
}
</style>
