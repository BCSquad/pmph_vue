<template>
  <div class="acceptance">
    <p class="header_p">
       <span>选题名称：</span>
       <el-input class="input" v-model="searchParams.bookname" placeholder="请输入选题名称" @keyup.enter.native='search'></el-input>
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
          :api_export_excel="'/pmpheep/topic/acceptance/exportExcel'"
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
         <p class="link" @click="$router.push({name:'选题受理',query:{id:scope.row.id,active:'third',type:'detail'}})">{{scope.row.bookname}}</p>
         </template>
     </el-table-column>
     <el-table-column
      label="作者"
      prop="submitName"
      width="100"
     >
     </el-table-column>
      <el-table-column
        label="作者账号"
        prop="submitUser"
        width="120"
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
      label="操作"
      width="240"
     >
     <template scope="scope">
       <el-button type="text" :disabled="scope.row.isAccepted" @click="acceptance(scope.row.id,true)">受理</el-button>
       <span>|</span>
       <el-button type="text" :disabled="!scope.row.isAccepted" @click="$router.push({name:'选题受理',query:{id:scope.row.id,active:'third',type:'check'}})">审核</el-button>
       <span>|</span>
       <el-button type="text" :disabled="scope.row.isAccepted" @click="retire(scope.row.id)">退回分配人</el-button>
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
		<el-dialog title="退回原因" :visible.sync="dialogTableVisible" size="tiny">
			<el-input
				type="textarea"
				:rows="4"
				placeholder="请输入内容"
				v-model="reasonEditor">
			</el-input>
      <el-button class="pull-right marginB10 marginT10 marginL10" type="primary" @click="makeSure">确定</el-button>
      <el-button class="pull-right marginB10 marginT10">取消</el-button>


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
        searchParams: {
          bookname:'',
          submitTime1: "",
          submitTime2: "",
          pageSize: 10,
          pageNumber: 1
        },
        searchedParams: {
          bookname:'',
          submitTime1: "",
          submitTime2: "",
          pageSize: 10,
          pageNumber: 1
        },
        pageTotal: 0,
        tableData: [],
        id: '', // 选题id
        dialogTableVisible: false,
        reasonEditor: '' // 部门编辑退回原因
      };
    },
    props:['activeName','searchInput'],
    watch:{
     activeName(val){
     if(val=='third'){
       this.search();
     }
     }
    },
    created(){
      this.searchParams.bookname=this.searchInput;
      this.getTableData();
    },
    methods: {
      /**获取表格数据 */
      getTableData(){
        this.searchParams.submitTime1 = this.$commonFun.formatDate(+new Date(this.searchParams.submitTime1)).substring(0,10);
        this.searchParams.submitTime2 = this.$commonFun.formatDate(+new Date(this.searchParams.submitTime2)).substring(0,10);
        this.searchedParams = this.$commonFun.objArrayDeepCopy(this.searchParams);
        this.$axios.get('/pmpheep/topic/listEditor',{
          params:{
            pageSize: this.searchParams.pageSize,
            pageNumber: this.searchParams.pageNumber,
            sessionId: this.$getUserData().sessionId,
            bookname: this.searchParams.bookname,
            submitTime1: this.searchParams.submitTime1,
            submitTime2: this.searchParams.submitTime2
          }
        }).then(response => {
          let res = response.data;
          if (res.code == '1') {
            this.tableData = res.data.rows;
            this.pageTotal = res.data.total;
          }
        })
      },
      makeSure(){
        console.log(this.id);
        this.acceptanceApi(this.id,'',true,this.reasonEditor);
      },
      // 点击退回
      retire(id){
        this.reasonEditor='';
        this.dialogTableVisible = true;
        this.id = id;
        console.log(this.id);
      },
      acceptance(id,isEditorHandling){
        this.acceptanceApi(id,isEditorHandling,'','');
      },
      /**受理、退回分配人 */
      acceptanceApi(id,isEditorHandling,isRejectedByEditor,reasonEditor){
        this.$axios.put('/pmpheep/topic/put/editorHandling',this.$initPostData({
          id: id,
          isAccepted: isEditorHandling, // 受理
          isRejectedByEditor: isRejectedByEditor, // 退回
          reasonEditor: reasonEditor // 退回
        })).then((res) => {
          if (res.data.code == '1') {
            this.$message.success('操作成功！');
            this.getTableData();
            this.dialogTableVisible=false;
            if(isEditorHandling){

            }else{
              this.$emit('changeActive','second');
            }
          } else {
            this.$confirm(res.msg.msgTrim(), "提示",{
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              showCancelButton: false,
              type: "error"
            });
          }
        }).catch(err => {
        })
      },
      /**搜索 */
      search(){
        this.searchParams.pageNumber = 1;
        this.getTableData();
      },
      /**分页查询 */
      handleSizeChange(val) {
        this.searchParams.pageSize=val;
        this.searchParams.pageNumber=1;
        this.getTableData();
      },
      handleCurrentChange(val) {
        this.searchParams.pageNumber = val;
        this.getTableData();
      },
    }
  };
</script>
<style scoped>
.acceptance .header_p {
  overflow: hidden;
}
.acceptance .header_p .input {
  width: 130px;
  margin-right: 10px;
}
</style>
