<template>
  <div class="distribute_editor">
    <p class="header_p">
       <span>选题名称：</span>
       <el-input class="input" v-model="searchParams.bookname" placeholder="请输入选题名称"  @keyup.enter.native="search"></el-input>
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
        <el-button type="primary" icon="search" @click="search()">搜索</el-button>
        <excelExport
          :api_export_excel="'/pmpheep/topic/distributeEditor/exportExcel'"
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
         <el-button type="text" style="color: #337ab7;" class="link" @click="$router.push({name:'选题受理',query:{id:scope.row.id,active:'second',type:'detail'}})">{{scope.row.bookname}}</el-button>
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
     </el-table-column>
     <el-table-column
      label="是否退回"
      width="120"
     >
     <template scope="scope">
      <span>{{scope.row.isRejectedByEditor?'已退回':'未退回'}}</span>
     </template>
     </el-table-column>
      <el-table-column
        label="退回理由"
      >
        <template scope="scope">
          <span>{{scope.row.reasonEditor || ''}}</span>
        </template>
      </el-table-column>
     <el-table-column
      label="操作"
      width="250"
     >
     <template scope="scope">
       <el-button type="text" @click="allot(scope.row)">分配部门编辑</el-button>
       <span>|</span>
       <el-button type="text" @click="openBackDialog(2,scope.row.id)">退回分配人</el-button>
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
    <!-- 选择编辑弹框 -->
    <el-dialog :visible.sync="dialogVisible" class="dialog"  size="tiny" title="选择编辑">
      <p class="header_p">
          <span>编辑姓名：</span>
          <el-input class="input" placeholder="请输入编辑姓名" v-model="dialogParams.realName"></el-input>
          <el-button type="primary" icon="search" @click="diaSearch">搜索</el-button>
      </p>
      <el-table :data="dialogTableData"  highlight-current-row border  class="table-wrapper">
          <el-table-column
          label="姓名"
          prop="realName"
          ></el-table-column>
          <el-table-column
          label="电话"
          prop="handPhone"
          ></el-table-column>
          <el-table-column
          label="操作"
          width="90"
          >
          <template scope="scope">
           <el-button type="text" @click="distributeSelect(1,scope.row)">选择</el-button>
          </template>
          </el-table-column>
      </el-table>
          <!--分页-->
    <div class="pagination-wrapper" style="overflow:hidden;">
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
    </el-dialog>

    <!-- 退回弹框 -->
    <el-dialog title="退回原因" :visible.sync="backDialogVislble" size="tiny">
			<el-input
				type="textarea"
				:rows="4"
				placeholder="请输入内容"
				v-model="distributeParams.reasonDirector">
			</el-input>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="directorHandling(2)">确 定</el-button>
          <el-button @click="backDialogVislble = false">取 消</el-button>

        </span>
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
          submitTime2:"",
          pageSize: 10,
          pageNumber: 1
        },
        searchedParams: {
          bookname: "",
          pageSize: 10,
          pageNumber: 1,
          submitTime1: "",
          submitTime2: ""
        },
        pageTotal: 0,
        tableData: [],
        dialogParams: {
          departmentId:'',
          realName: "",
          pageSize: 10,
          pageNumber: 1
        },
        dialogPageTotal: 0,
        dialogVisible: false,
        backDialogVislble:false,
        dialogTableData: [
        ],
        distributeParams:{
          id:'',
          editorId:'',
          isRejectedByDirector:'',
          reasonDirector:'',
          openid:'',
          bookname:''
        },
        id: '', // 选题申报id
        isRejectedByDirector: '', //是否被主任退回
        reasonDirector: '' // 主任退回原因
      };
    },
    props:['activeName','searchInput'],
    created(){
      this.searchParams.bookname=this.searchInput;
      this.getTableData();
    },
    watch:{
     activeName(val){
       console.log(val);
       if(val=='second'){
         this.search();
       }
     }
    },
    methods: {
       /* 搜索按钮 */
       search(){
        this.searchParams.pageNumber=1;
        this.getTableData();
       },
      /**获取表格数据 */
      getTableData(){
        this.searchParams.submitTime1 = this.$commonFun.formatDate(+new Date(this.searchParams.submitTime1)).substring(0,10);
        this.searchParams.submitTime2 = this.$commonFun.formatDate(+new Date(this.searchParams.submitTime2)).substring(0,10);
        this.searchedParams = this.$commonFun.objArrayDeepCopy(this.searchParams);
        this.$axios.get('/pmpheep/topic/listDirector',{
          params:{
            bookname: this.searchParams.bookname,
            sessionId: this.$getUserData().sessionId,
            submitTime1: this.searchParams.submitTime1,
            submitTime2: this.searchParams.submitTime2,
            pageSize: this.searchParams.pageSize,
            pageNumber: this.searchParams.pageNumber
          }
        }).then(response => {
          let res = response.data;
          if (res.code == '1'){
            this.tableData = res.data.rows;
            if(res.data.rows.length>0){
               this.dialogParams.departmentId=res.data.rows[0].departmentId;
               this.getListEditors();
            }
            this.tableData.forEach(item => {
                item.submitTime = this.$commonFun.formatDate(item.submitTime).substring(0,10);
            })
            this.pageTotal = res.data.total;
          }
        })
      },
      /**获取部门编辑列表 */
      getListEditors(bool){
        this.$axios.get('/pmpheep/topic/listEditors',{
          params:this.dialogParams
        }).then(response => {
          let res = response.data;
          if (res.code == '1') {
            this.dialogTableData = res.data.rows;
            this.dialogPageTotal = res.data.total;
            if(bool){
              this.dialogVisible = true;
            }
          }
        })
      },
      /**分配编辑 */
      allot(obj){
        this.dialogParams.departmentId=obj.departmentId;
        this.distributeParams.id=obj.id;
        this.distributeParams.bookname = obj.bookname;
        this.getListEditors(true);

      },
      openBackDialog(i,id){
          this.distributeParams.reasonDirector='';
          this.distributeParams.id=id;
          this.backDialogVislble=true;
      },
      /**分配部门编辑、退回运维人员 */
      distributeSelect(i,obj){
          this.$confirm('确定分配到编辑：<'+obj.realName+'>?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(() => {
            this.distributeParams.editorId=obj.id;
            this.distributeParams.openid = obj.openid;
            this.directorHandling(i);
          }).catch(() => {
           /* this.$message({
              type: 'warning',
              message: '已取消操作'
            });*/
          });
      },
      directorHandling(i){
        this.distributeParams.isRejectedByDirector=(i==2?true:false);
        this.distributeParams.editorId=(i==1?this.distributeParams.editorId:'');
        this.distributeParams.openid=(i==1?this.distributeParams.openid:'');
        this.distributeParams.bookname =(i==1?this.distributeParams.bookname:'');
        this.distributeParams.adminId =(i==1?this.distributeParams.editorId:'');
        this.$axios.put('/pmpheep/topic/put/directorHandling',
        this.$initPostData(
          this.distributeParams
        )).then(response => {
          let res = response.data;
          if (res.code == '1') {
            this.$message.success(i==1?'分配成功！':'退回成功');
            this.dialogVisible=false;
            this.backDialogVislble=false;
            this.$emit('change'); // 通知父组件 再次身份判断
            this.getTableData();
          } else {
            this.$confirm(res.msg.msgTrim(), "提示",{
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              showCancelButton: false,
              type: "error"
            });
          }
        }).catch(err=>{

        })
      },
      /**搜索 */
      search(){
        this.searchParams.pageSize = 10;
        this.searchParams.pageNumber = 1;
        this.getTableData();
      },
      diaSearch(){
        this.dialogParams.pageSize = 10;
        this.dialogParams.pageNumber = 1;
        this.getListEditors();
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
      /**分页查询 */
      dialogSizeChange(val) {
        this.dialogParams.pageSize = val;
        this.dialogParams.pageNumber = 1;
        this.getListEditors();
      },
      dialogCurrentChange(val) {
        this.dialogParams.pageNumber = val;
        this.getListEditors();
      }
    }
  };
</script>
<style >
.distribute_editor .header_p {
  overflow: hidden;
}
.distribute_editor .header_p .input {
  width: 130px;
  margin-right: 10px;
}
.distribute_editor .dialog .el-dialog {
  min-width: 635px;
}
</style>
