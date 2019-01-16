<template>
  <div class="submit_apply">
    <p class="header_p">
          <span>选题名称：</span>
          <el-input class="input" @keyup.enter.native="search" v-model="searchParams.bookname" placeholder="请输入选题名称"></el-input>
          <span>提交日期：</span>
          <el-date-picker
            v-model="date1"
            class="input"
            type="date"
            @change="dateChange1"
            placeholder="选择日期">
        </el-date-picker>
        <span>至：</span>
        <el-date-picker
          v-model="date2"
          class="input"
          type="date"
          @change="dateChange2"
          placeholder="选择日期">
        </el-date-picker>
          <el-button type="primary" icon="search" @click="search">搜索</el-button>
          <excelExport
            :api_export_excel="'/pmpheep/topic/submitApply/exportExcel'"
            :params="searchedParams"
            :disabled = "!tableData.length">
            导出Excel
          </excelExport>
      </p>
    <el-table
    :data="tableData"
    style="width:100%"
    border
    class="table-wrapper"
    >
        <el-table-column
        label="选题名称"
        >
          <template scope="scope">

            <router-link :to="{name:'选题受理',query:{name:'选题申报查看',id:scope.row.id,type:'detail'}}">{{scope.row.bookname}}</router-link>
          </template>
     </el-table-column>
     <el-table-column
      label="作者"
      prop="realname"
      width="90"
     >
     </el-table-column>
      <el-table-column
        label="作者账号"
        prop="submitUser"
        width="100"
      >
      </el-table-column>
     <el-table-column
      label="提交日期"
      prop="submitTime"
      width="120"
     >
     </el-table-column>
     <el-table-column
      label="预计交稿日期"
      prop="deadline"
      width="170"
     >
     </el-table-column>
     <el-table-column
      label="图书类别"
      prop="type"
      width="100"
     >
     </el-table-column>
     <el-table-column
      label="选题状态"
      width="240"
     >
     <template scope="scope">
       <p>{{scope.row.state}}（<span style="color:#1ab194">{{scope.row.stateDeail}}</span>）</p>
     </template>
     </el-table-column>
     <el-table-column
      label="操作"
      width="130"
     >
     <template scope="scope">
       <router-link :to="{name:'选题受理',query:{name:'选题申报查看',id:scope.row.id,type:'detail'}}">查看</router-link>
       <span>|</span>
       <wordExport
         :type = "'text'"
         :api_export_word_start = "'/pmpheep/word/topic/declaration'"
         :api_export_word_progress = "'/pmpheep/word/progress'"
         :params = "{topicId :scope.row.id}"
       >
         导出
       </wordExport>
     </template>
     </el-table-column>
    </el-table>
          <!--分页-->
    <div class="pagination-wrapper">
      <el-pagination
        v-if="pageTotal>searchParams.pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="searchParams.pageNumber"
        :page-sizes="[10,20,30,50]"
        :page-size="searchParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageTotal">
      </el-pagination>
    </div>
  </div>
</template>
<script type="text/javascript">
  import excelExport from "components/ExcelExport.vue";
  import wordExport from "components/WordExport.vue";
  export default{
    components:{
      excelExport,wordExport
    },
    props:['searchInput'],
      data(){
          return{
            api_get_list:'pmpheep/topic/list/checkTopic',
            searchParams:{
              pageSize:10,
              pageNumber:1,
              authProgress:1,
              submitTime:'',
              bookname:''
            },
            searchedParams:{
              pageSize:10,
              pageNumber:1,
              authProgress:1,
              submitTime:'',
              bookname:''
            },
            typeList:['专著','基础理论','论文集','科普','应用技术','工具书','其他'],
            date1:'',
            date2:'',
            tableData:[],
            pageTotal:0,
          }
      },
      methods:{
          handleSizeChange(val){
             this.searchParams.pageSize=val;
             this.searchParams.pageNumber=1;
             this.getData();
          },
          handleCurrentChange(val){
             this.searchParams.pageNumber=val;
             this.getData();
          },
        /**
         * 获取数据
         */
        getData(){
          this.searchedParams = this.$commonFun.objArrayDeepCopy(this.searchParams);
          this.$axios.get(this.api_get_list,{params:this.searchParams})
            .then((response) => {
              let res = response.data;
              if (res.code == '1') {
                console.log(res.data.rows);
                res.data.rows.map(iterm=>{
                  iterm.type=this.typeList[iterm.type];
                  iterm.deadline=this.$commonFun.formatDate(iterm.deadline,'yyyy-MM-dd');
                  iterm.submitTime=this.$commonFun.formatDate(iterm.submitTime,'yyyy-MM-dd');
                });
                this.tableData = res.data.rows;
                this.pageTotal = res.data.total;
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
        search(){
          this.searchParams.pageNumber=1;
          this.getData();
        },
        /**
         * 时间变化
         * @param val
         */
        dateChange1(val){
          if(val){
            this.searchParams.submitTime1=val+' 00:00:00';
          }else{
            this.searchParams.submitTime1='';
          }
          this.search();
        },
        /**
         * 时间变化
         * @param val
         */
        dateChange2(val){
          if(val){
            this.searchParams.submitTime2=val+' 00:00:00';
          }else{
            this.searchParams.submitTime2='';
          }
          this.search();
        },

      },
    created(){
       this.searchParams.bookname=this.searchInput;
        this.getData();
    },
  }
</script>
<style scoped>
.submit_apply .header_p {
  overflow: hidden;
}
.submit_apply .header_p .input {
  width: 130px;
  margin-right: 10px;
}
</style>
