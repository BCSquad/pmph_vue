<template>
  <div class="user_point" style="height:100%;">
		<el-row>
            <div class="searchBox-wrapper">
                <div class="searchName">用户姓名:<span></span></div>
                <div class="searchInput">
                    <el-input v-model.trim="realname" placeholder="请输入" @keyup.enter.native="search"></el-input>
                </div>
            </div>
            <div class="searchBox-wrapper">
                <div class="searchName">用户账号:<span></span></div>
                <div class="searchInput">
                    <el-input v-model.trim="username" placeholder="请输入" @keyup.enter.native="search"></el-input>
                </div>
            </div>
            <div class="searchBox-wrapper searchBtn">
                <el-button  type="primary"  icon="search" @click="search">搜索</el-button>
            </div>

            <div class="pull-right">
              <excelExport
                :api_export_excel="'/pmpheep/userPoint/exportExcel'"
                :params="{
                  sessionId: this.$getUserData().sessionId,
                  username: this.searchedUsername,
                  realname: this.searchedRealname
               }"
                :disabled = "!tableData.length">
                导出Excel
              </excelExport>
            </div>
        </el-row>
        <el-row>
            <el-col>
                <el-table :data="tableData" stripe border style="width: 100%">
                    <el-table-column prop="realname" label="用户姓名">
                    </el-table-column>
                    <el-table-column prop="username" label="用户账号">
                    </el-table-column>
                    <el-table-column prop="loss" label="兑换总积分" >
                    </el-table-column>
                    <el-table-column prop="gain" label="获得总积分" >
                    </el-table-column>
                    <el-table-column prop="total" label="用户当前总积分">
                    </el-table-column>
                    <el-table-column label="操作" width="95" align="center">
                        <template scope="scope">
                            <p class="link" @click="pointRecord(scope.row)">积分记录</p>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <el-pagination
					v-if="usertotal>pageSize"
					class="pull-right marginT10"
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:current-page="pageNumber"
					:page-sizes="[10, 20, 30, 40]"
					:page-size="pageSize"
					layout="total, sizes, prev, pager, next, jumper"
					:total="usertotal">
        </el-pagination>

				<!-- 积分记录 -->
				<el-dialog title="积分记录" class="record_dialog"  :visible.sync="dialogFormVisible" size="small">
        <point-record :currentUser="currentUser" :dialogFormVisible="dialogFormVisible"></point-record>
				</el-dialog>
  </div>
</template>
<script>
import pointRecord from './pointRecord.vue';
import excelExport from "components/ExcelExport.vue";
export default {
  data() {
    return {
      username: "", // 用户代码
      realname: "", // 用户姓名
      searchedUsername:"",
      searchedRealname:"",
      pageSize: 20,
      pageNumber: 1, // 当前页
      usertotal: 0,
      tableData: [{name:'11',id:'11'}],
      dialogFormVisible: false,
      currentUser:{}
    };
  },
  components:{
    pointRecord,
    excelExport
  },
  created(){
    this.getUserPoint();
  },
  methods: {
    /**搜索 */
    search() {
      this.pageSize = 20;
      this.pageNumber = 1;
      this.getUserPoint();
    },
    /**获取用户积分 */
    getUserPoint(){
      this.$axios.get('/pmpheep/writerpoint/list',{
        params:{
          sessionId: this.$getUserData().sessionId,
          pageSize : this.pageSize,
          pageNumber: this.pageNumber,
          username: this.username,
          realname: this.realname
        }
      }).then(response => {
        let res = response.data;
        this.usertotal = res.data.total;
        if (res.code == '1') {
          this.searchedUsername = this.username;
          this.searchedRealname = this.realname;
          this.tableData = res.data.rows;
        }
      })
    },
    pointRecord(obj){
      this.dialogFormVisible = true;
      this.currentUser=obj;
    },
    // 分页查询
		handleSizeChange(val){
			this.pageSize = val;
      this.pageNumber=1;
			this.getUserPoint();
		},
		handleCurrentChange(val){
			this.pageNumber = val;
			this.getUserPoint();
    },
  }
};
</script>
<style>
.user_point .record_dialog .el-dialog {
  min-width: 860px;
}
</style>
