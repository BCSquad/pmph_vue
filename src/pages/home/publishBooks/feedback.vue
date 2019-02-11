<template>
  <div class="check_error" style="height:100%;">
    <el-row>
    <!--  <div class="searchBox-wrapper">
        <div class="searchName">书名:<span></span></div>
        <div class="searchInput">
          <el-input v-model.trim="title" placeholder="请输入" @keyup.enter.native="search"></el-input>
        </div>
      </div>-->
      <div class="searchBox-wrapper searchBox-radio">
        <div class="searchName">状态:<span></span></div>
        <el-radio-group v-model="result" class="radio-group" @change="change">
          <el-radio :label="null">全部</el-radio>
          <el-radio :label="1">审核</el-radio>
          <el-radio :label="0">未审核</el-radio>
        </el-radio-group>
      </div>
      <div class="searchBox-wrapper searchBtn" style="float:right;">
        <el-button type="primary" @click="exportExcel">导出</el-button>
       <!-- <el-button  type="primary"  icon="search" @click="search">搜索</el-button>-->
      </div>
    </el-row>
    <el-row>
      <el-col>
        <el-table :data="tableData" stripe border style="width: 100%;text-align: center">
          <el-table-column prop="bookname" label="书名"  align="left">
          </el-table-column>
          <el-table-column prop="isbn" label="ISBN" align="center">
          </el-table-column>
          <el-table-column prop="feedBackName" label="反馈人" align="center">
          </el-table-column>
          <!--<el-table-column prop="content" label="反馈内容">
          </el-table-column>-->
          <el-table-column prop="result" label="状态" align="center">
            <template scope="scope">
              <p >{{scope.row.result == true?'已审核':'未审核'}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="authorname" label="审核人" align="center">
         <!-- </el-table-column>
          <el-table-column prop="authorReply" label="回复内容">-->
          </el-table-column>
          <el-table-column prop="authDate" label="审核日期" width="180" align="center">
          </el-table-column>
          <el-table-column prop="gmtCreate" label="提交时间" width="180" align="center">
          </el-table-column>
         <!-- <el-table-column prop="result" label="核查结果" width="95" align="center">
            <template scope="scope">
              <p v-if="scope.row.isEditorReplied">{{scope.row.result == true?'图书勘误':scope.row.result == false?'内容无误':'-'}}</p>
            </template>
          </el-table-column>-->
          <el-table-column label="前台展示" width="95" align="center">
            <template scope="scope" >
              <el-tooltip :content="scope.row.content" placement="top" effect="light" :popper-class="'frontShowWrapper'">
                <el-button type="text"  class="btn-text" :class="scope.row.showFront?'deep':''"
                           @click="switchFrontShow(scope.row)"
                >
                  {{scope.row.showFrontStr}}
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80" align="center">
            <template scope="scope">
              <router-link type="text" class="link" size="small" :to="{name:'读者反馈详情',query:{id: scope.row.id,type:scope.row.result?'detail':'check'}}">{{scope.row.result!=''?'查看':'审核'}}</router-link>
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
  export default {
    data() {
      return {
      //  title: "", // 书名
        switchFrontShowApi:"/pmpheep/bookCorrection/switchFrontShowFeedBack",
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
     /* /!* 是否从首页跳转过来 *!/
      if(this.$route.params.searchInput){
        this.title=this.$route.params.searchInput;
      }*/
      this.getBooks();
    },
    methods: {
      exportExcel(){
        /** 导出Excel */

        let url = '/pmpheep/bookCorrection/exportfeedback?result='+this.result;
        if(this.$commonFun.Empty(this.result)){
          url = '/pmpheep/bookCorrection/exportfeedback?result='
        }
        // console.log(url)
        this.$commonFun.downloadFile(url);
      },
      getBooks() {
        this.$axios
          .get("/pmpheep/bookCorrection/bookList", {
            params: {
              pageSize: this.pageSize,
              pageNumber: this.pageNumber,
              //bookname: this.title,
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
                item.authDate = this.$commonFun.formatDate(item.authDate);
                item.authorReply = this.$commonFun.Empty(item.authorReply)?'':item.authorReply;
              });
            }
          });
      },
      /** 搜索*/
      // search() {
      //   this.pageSize = 20;
      //   this.pageNumber = 1;
      //   this.getBooks();
      // },
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
      },
      /**
       * 切换前台显示
       * @param id
       * @param showFront
       */
      switchFrontShow(obj){
        this.$axios.get(this.switchFrontShowApi,{params:{
            id:obj.id,showFront:obj.showFront
          }})
          .then(response => {
            obj.showFront = response.data.data.showFront;
            obj.showFrontStr = obj.showFront?"是":"否";
          })
      },
    }
  };
</script>
<style scoped>
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
  .btn-text{
    color:  rgb(18, 140, 246);
  }
  .btn-text.deep{
    color: blue;
  }

</style>
