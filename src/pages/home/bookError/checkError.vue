<template>
  <div class="check_error" style="height:100%;">
		<el-row>
            <div class="searchBox-wrapper">
                <div class="searchName">书名/ISBN:<span></span></div>
                <div class="searchInput">
                    <el-input v-model.trim="title" placeholder="请输入" @keyup.enter.native="search"></el-input>
                </div>
            </div>
           <!-- <div class="searchBox-wrapper searchBox-radio">
                <div class="searchName">检查结果:<span></span></div>
                <el-radio-group v-model="result" class="radio-group" @change="change">
									<el-radio :label="null">全部</el-radio>
									<el-radio :label="true">图书勘误</el-radio>
									<el-radio :label="false">内容无误</el-radio>
								</el-radio-group>
            </div>-->
            <div class="searchBox-wrapper searchBtn" >

                <el-button  type="primary"  icon="search" @click="search">搜索</el-button>
            </div>
            <div class="searchBox-wrapper export">
              <el-button  type="primary"   @click="exportExcel">导出Excel</el-button>
              <wordExport
                :type = "'primary'"
                :api_export_word_start = "'/pmpheep/word/bookCorrection/list'"
                :api_export_word_progress = "'/pmpheep/word/progress'"
                :params = "{bookname :title,isEditorReplied:result}"
              >
                导出word
              </wordExport>
            </div>
        </el-row>
        <el-row>
            <el-col>
                <el-table :data="tableData" stripe border style="width: 100%">
                    <el-table-column prop="bookname" label="书名"  align="center">
                    </el-table-column>
                    <el-table-column prop="isbn" label="ISBN"  align="center">
                    </el-table-column>
                    <el-table-column prop="content" label="纠错信息" align="center">
											<template scope="scope">
												<p>页码：{{scope.row.page}} 行数：{{scope.row.line}}</p>
											</template>
                    </el-table-column>
                    <el-table-column prop="username" label="纠错人" align="center">
                    </el-table-column>
                    <el-table-column prop="gmtCreate" label="提交时间" align="center">
                    </el-table-column>
                    <el-table-column prop="authorReply" label="主编回复"  align="center">
                    </el-table-column>
                    <!--<el-table-column prop="result" label="核查结果" width="95" align="center">
											<template scope="scope">
												<p v-if="scope.row.isEditorReplied">{{scope.row.result == true?'图书勘误':scope.row.result == false?'内容无误':'-'}}</p>
											</template>
                    </el-table-column>-->
										<el-table-column label="操作" width="80" align="center">
											<template scope="scope">
												<!--<router-link type="text" class="link" size="small" :to="{name:'纠错审核',query:{id: scope.row.id,type:(scope.row.result&&scope.row.editorReply!='')?'detail':'check'}}">{{(scope.row.result&&scope.row.editorReply!='')?'查看':'审核'}}</router-link>
										-->
                        <router-link type="text" class="link" size="small" :to="{name:'纠错审核',query:{id: scope.row.id,type:'check'}}">审核</router-link>

                      </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <el-pagination
        v-if="total>pageSize"
        class="pull-right marginT10"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNumber"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
        </el-pagination>
  </div>
</template>
<script>
  import wordExport from "components/WordExport.vue";
export default {
  components:{
    wordExport
  },
  data() {
    return {
      title: "", // 书名
      result: null, // 检查结果
      currentPage: 1, // 当前页
      pageSize: 20,
      pageNumber: 1,
      total: 0,
      tableData: [],
      startTime: "", // 开始时间
      endTime: "" // 结束时间
    };
  },
  created() {
    /* 是否从首页跳转过来 */
    if(this.$route.params.searchInput){
      this.title=this.$route.params.searchInput;
    }
    this.getBooks();
  },
  methods: {
    getBooks() {
      this.$axios
        .get("/pmpheep/bookCorrection/list", {
          params: {
            pageSize: this.pageSize,
            pageNumber: this.pageNumber,
            bookname: this.title,
            result: this.result
          }
        })
        .then(response => {
          let res = response.data;
          if (res.code == 1) {
            this.tableData = res.data.rows;
            this.total = res.data.total;
            this.tableData.forEach(item => {
              item.gmtCreate = this.$commonFun.formatDate(item.gmtCreate);
            });
          }
        });
    },
    /**
     *
     *  导出
     *  */

    exportExcel(){
      let url = '/pmpheep/bookCorrection/exportBookCheck?bookname='+this.title;
      // console.log(url)
      this.$commonFun.downloadFile(url);
    },
    /** 搜索*/
    search() {
      this.pageSize = 20;
      this.pageNumber = 1;
      this.getBooks();
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.getBooks();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pageNumber = val;
      this.getBooks();
    },
    /** 切换检查结果 */
    change(val) {
      this.result = val;
      this.getBooks();
    }
  }
};
</script>
<style scoped>
  .searchBtn{
    width:200px;
  }
.search-title {
  margin: 10px 0 0 10px;
  font-size: 16px;
  float: left;
  height: 36px;
  line-height: 36px;
}
.searchBox-radio {
  width: 380px;
}
.radio-group {
  margin-top: 9px;
  margin-left: 5px;
}
  .export{
    width:unset;
    float: right;
  }
</style>
