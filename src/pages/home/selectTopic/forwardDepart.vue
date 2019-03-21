<template>
  <div class="forward_depart">
    <p class="header_p">
       <span>选题名称：</span>
       <el-input class="input" v-model="searchParams.bookname"  placeholder="请输入选题名称"></el-input>
       <span>提交日期：</span>
       <el-date-picker
            v-model="searchParams.submitTime1"
            class="input"
            type="date"
            placeholder="选择日期">
        </el-date-picker>
      <span>至：</span>
      <el-date-picker
        v-model="searchParams.submitTime2"
        class="input"
        type="date"
        placeholder="选择日期">
      </el-date-picker>
        <el-button type="primary" icon="search" @click="search">搜索</el-button>
        <excelExport
          :api_export_excel="'/pmpheep/topic/forwardDepart/exportExcel'"
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
     prop="bookname"
     >
        <template scope="scope">
         <el-button type="text" style="color:#337ab7;"  @click="$router.push({name:'选题受理',query:{id:scope.row.id,active:'first',type:'detail'}})">{{scope.row.bookname}}</el-button>
         </template>
     </el-table-column>
     <el-table-column
      label="作者"
      prop="submitName"
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
      label="预计交稿日期"
      prop="deadline"
      width="170"
     >
     <template scope="scope">
      {{$commonFun.formatDate(scope.row.deadline).substring(0,10)}}
     </template>
     </el-table-column>
     <el-table-column
      label="图书类别"
      prop="typeName"
      width="100"
     >
     </el-table-column>
     <el-table-column
      label="提交日期"
      prop="submitTime"
      width="170"
     >
     <template scope="scope">
       {{$commonFun.formatDate(scope.row.submitTime).substring(0,10)}}
     </template>
     </el-table-column>
     <el-table-column
      label="是否退回"
      prop="isRejectedByDirector"
      width="100"
     >
     <template scope="scope">
       <span>{{scope.row.isRejectedByDirector?'已退回':'未退回'}}</span>
     </template>
     </el-table-column>
      <el-table-column
        label="退回理由"
      >
        <template scope="scope">
          <span>{{scope.row.reasonDirector || ''}}</span>
        </template>
      </el-table-column>
     <el-table-column
      label="操作"
      width="150"
     >
     <template scope="scope">
       <el-button type="text" @click="distributeDepartment(scope.row.id,scope.row.bookname)">分配到部门</el-button>
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
        :current-page="searchParams.pageNumber"
        :page-sizes="[10,20,30,50]"
        :page-size="searchParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageTotal">
      </el-pagination>
    </div>

    <!-- 选择编辑部对话框 -->
    <el-dialog :visible.sync="dialogVisible" class="dialog"  size="tiny" title="选择编辑部">
      <p class="header_p">
          <span>部门名称：</span>
          <el-input class="input" v-model="dialogParams.dpName" placeholder="请输入部门名称"></el-input>
          <el-button type="primary" icon="search" @click="dialogSearch">搜索</el-button>
      </p>
      <div style="overflow:hidden">
      <el-table :data="dialogTableData" border style="width:100%" highlight-current-row class="table-wrapper">
          <el-table-column
           label="部门名称"
           prop="dpName"
          >
          </el-table-column>
          <el-table-column
           label="部门负责人"
           width="110"
           prop="realname"
          >
          </el-table-column>
          <el-table-column
           label="操作"
           width="90"
          >
          <template scope="scope">
           <el-button type="text" @click="selectDepartment(scope.row)">选择</el-button>
          </template>
          </el-table-column>
      </el-table>
          <!--分页-->
    <div class="pagination-wrapper">
      <el-pagination
        v-if="dialogPageTotal>dialogParams.pageSize"
        @size-change="dialogSizeChange"
        @current-change="dialogCurrentChange"
        :current-page="dialogParams.pageNumber"
        :page-sizes="[10,20,30,50]"
        :page-size="dialogParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="dialogPageTotal">
      </el-pagination>
    </div>
    </div>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
  import excelExport from "components/ExcelExport.vue";
  import wordExport from "components/WordExport.vue";
  export default {
    components:{
      excelExport,wordExport
    },
    data() {
      return {
        listDataUrl: "/pmpheep/topic/listOpts", //选题列表url
        dialogDataUrl: "/pmpheep/departments/listOpts", //对话框列表url
        distributeUrl:'/pmpheep/topic/put/optsHandling',      //分配部门url
        distributeId: "", //当前正在分配的题目id
        searchParams: {
          bookname: "",
          pageSize: 10,
          pageNumber: 1,
          submitTime1: "",
          submitTime2: ""
        },
        searchedParams: {
          bookname: "",
          pageSize: 10,
          pageNumber: 1,
          submitTime1: "",
          submitTime2: ""
        },
        bookname:'',
        pageTotal: 0,
        dialogVisible: false,
        dialogPageTotal: 0,
        dialogParams: {
          pageSize: 10,
          pageNumber: 1,
          dpName: ""
        },
        tableData: [],
        dialogTableData: [
          {
            name: "综合编辑部",
            chargePerson: "张三"
          },
          {
            name: "中医药中心",
            chargePerson: "李四"
          },
          {
            name: "中国医刊杂志编辑部",
            chargePerson: "王五"
          }
        ]
      };
    },
    props:['activeName','searchInput'],
    watch:{
     activeName(val){
      if(val=='first'){
        this.search();
      }
     }
    },
    methods: {
      /* 获取列表数据 */
      getListData() {

  //    console.log(this.$commonFun.formatDate(+new Date(this.searchParams.submitTime)).substring(0,10));
        this.searchParams.submitTime1 = this.$commonFun.formatDate(+new Date(this.searchParams.submitTime1)).substring(0,10);
        this.searchParams.submitTime2 = this.$commonFun.formatDate(+new Date(this.searchParams.submitTime2)).substring(0,10);
        this.searchedParams = this.$commonFun.objArrayDeepCopy(this.searchParams);
        this.$axios
        .get(this.listDataUrl, {
          params: this.searchParams
        })
        .then(res => {
  //        console.log(res);
          if (res.data.code == 1) {
            this.pageTotal = res.data.data.total;
            this.tableData = res.data.data.rows;
          }
        });
      },
      /* 获取对话框列表 */
      getDialogData() {
        this.$axios
          .get(this.dialogDataUrl, {
            params: this.dialogParams
          })
          .then(res => {
  //          console.log(res);
            if (res.data.code == 1) {
              this.dialogPageTotal = res.data.data.total;
              this.dialogTableData = res.data.data.rows;
            }
          });
      },
      /* 选择分配部门 */
      selectDepartment(obj) {
          this.$confirm('确定分配到部门：<'+obj.dpName+'>？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            this.$axios({
              method:'PUT',
              url:this.distributeUrl,
              data:this.$commonFun.initPostData({
                id:this.distributeId,
                departmentId:obj.id,
                openid:obj.openid,
                adminId:obj.adminId,
                bookname:this.bookname
              })
            }).then((res)=>{
  //           console.log(res);
             if(res.data.code==1){
               this.$message.success('分配成功');
               this.getListData();
               this.dialogVisible=false;
             }else{
               this.$confirm(res.data.msg.msgTrim(), "提示",{
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                showCancelButton: false,
                type: "error"
               });
             }
            })
          }).catch(() => {
            /*this.$message({
              type: 'warning',
              message: '已取消操作'
            });*/
          });

      },
      /* 搜索按钮 */
      search() {
        this.searchParams.pageNumber = 1;
        this.getListData();
      },
      /* 对话框搜索 */
      dialogSearch() {
        this.dialogParams.pageNumber = 1;
        this.getDialogData();
      },
      /* 列表分页 */
      handleSizeChange(val) {
        this.searchParams.pageSize = val;
        this.searchParams.pageNumber = 1;
        this.getListData();
      },
      handleCurrentChange(val) {
        this.searchParams.pageNumber = val;
        this.getListData();
      },
      /* 分配到部门 */
      distributeDepartment(id,bookname) {
        this.distributeId = id;
        this.bookname = bookname;
        this.dialogVisible = true;
        this.getDialogData();
      },
      /* 对话框列表分页 */
      dialogSizeChange(val) {
        this.dialogParams.pageSize = val;
        this.dialogParams.pageNumber = 1;
        this.getDialogData();
      },
      dialogCurrentChange(val) {
        this.dialogParams.pageNumber = val;
        this.getDialogData();
      }
    },
    created() {
      this.searchParams.bookname=this.searchInput;
      this.getListData();
      this.getDialogData();
    }
  };
</script>
<style >
.forward_depart .header_p {
  overflow: hidden;
}
.forward_depart .header_p .input {
  width: 130px;
  margin-right: 10px;
}
.forward_depart .dialog .el-dialog {
  min-width: 630px;
}
</style>
