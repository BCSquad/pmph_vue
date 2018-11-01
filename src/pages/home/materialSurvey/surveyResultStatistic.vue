<template>
  <div class="survey_result_statistic">
   <p class="header_p">
       <span>调查问卷名称：</span>
       <el-input class="input" placeholder="请输入调查问卷名称" v-model="searchParams.title"  @keyup.enter.native="search"></el-input>
       <el-button type="primary" icon="search" @click="search">搜索</el-button>
   </p>
   <el-table :data="tableData" border class="table-wrapper">
       <el-table-column label="调查问卷名称" prop="surveyTitle">
       </el-table-column>
       <el-table-column label="调查概述" prop="intro">
       </el-table-column>
       <el-table-column label="调查开始日期" prop="startDate" width="140">
       </el-table-column>
       <el-table-column label="调查结束日期" prop="endDate" width="140">
       </el-table-column>
       <el-table-column label="调查对象" prop="surveyName"  width="110">
       </el-table-column>
       <el-table-column label="参与人数" prop="surveyUsers" width="100">
       </el-table-column>
       <el-table-column label="发起人" prop="realname" width="110">
       </el-table-column>
       <el-table-column label="操作" width="170">
         <template scope="scope">
           <el-button type="text" @click="$router.push({name:'结果明细',params:{data:scope.row},query:{id:scope.row.surveyId}})">查看</el-button>
           <span>|</span>
           <el-button type="text" @click="copyAddress(scope.row.surveyId)">复制问卷地址</el-button>
             </template>
       </el-table-column>
   </el-table>
   <!-- 分页 -->
    <div class="pagination-wrapper">
      <el-pagination
        v-if="pageTotal>searchParams.pageSize"
        @size-change="paginationSizeChange"
        :current-page.sync="searchParams.pageNumber"
        :page-sizes="[10,20,30,50]"
        :page-size="searchParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageTotal">
      </el-pagination>
    </div>
    <div id="copyBox" ></div>
  </div>
</template>
<script type="text/javascript">
    export default{
        data(){
            return{
              api_statistic_list:'/pmpheep/survey/question/answer/result',
              pageTotal:0,
              copyContent:'',
              searchParams:{
                  pageSize:30,
                  pageNumber:1,
                  title:'',
              },
              tableData:[],
            }
        },
        methods:{
          /**
           * 获取数据
           */
          getTableData(){
            this.$axios.get(this.api_statistic_list,{params:this.searchParams})
              .then((response) => {
                let res = response.data;
                if (res.code == '1') {
                  res.data.rows.map(iterm=>{
                    iterm.startDate=this.$commonFun.formatDate(iterm.startDate,'yyyy-MM-dd');
                    iterm.endDate=this.$commonFun.formatDate(iterm.endDate,'yyyy-MM-dd');
                  });
                  this.pageTotal = res.data.total;
                  this.tableData=res.data.rows;
                  console.log(res.data);
                }else{
                  self.$confirm(res.msg.msgTrim(), "提示",{
                  	confirmButtonText: "确定",
                  	cancelButtonText: "取消",
                  	showCancelButton: false,
                  	type: "error"
                  });
                }
              })
              .catch(e=>{
                console.log(e);
              })
          },
          /**
           * 搜索
           */
          search(){
            this.searchParams.pageNumber=1;
            this.getTableData()
          },
          /**
           * 分页每页显示条数发生改变
           * @param val
           */
          paginationSizeChange(val){
            this.searchParams.pageSize=val;
            this.searchParams.pageNumber=1;
            this.getTableData();
          },
          /* 复制 */
          copyAddress(id){
            this.copyContent= window.location.host+'/medu/survey/writeSurvey.action?surveyId='+id;
            var e="<input id='copyText' value='"+this.copyContent+"' />";
             document.getElementById('copyBox').innerHTML=e;
             var text=document.getElementById('copyText').select();
                document.execCommand('copy');
                document.getElementById('copyBox').innerHTML='';
                this.$message.success('问卷地址已复制到剪贴板');
          }
        },
      created(){
          this.search();
      },
    }
</script>
<style>
.survey_result_statistic .header_p {
  overflow: hidden;
}
.survey_result_statistic .header_p .input {
  width: 217px;
  margin-right: 10px;
}
</style>
