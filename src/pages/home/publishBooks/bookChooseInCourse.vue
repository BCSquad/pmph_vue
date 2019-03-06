<template>
  <div class="survey_model_set">
    <p class="header_p">
      <span style="display: inline-block;">
        <span>图书名称：</span>
        <el-input class="input" v-model="searchParams.bookname"  placeholder="请输入图书名称" @keyup.enter.native="search()"></el-input>
      </span>
      <span style="display: inline-block;">
        <span>课程名称：</span>
        <el-input class="input" v-model="searchParams.courseName"  placeholder="请输入课程名称" @keyup.enter.native="search()"></el-input>
      </span>
      <span style="display: inline-block;">
        <span>学校名称：</span>
        <el-input class="input" v-model="searchParams.orgName"  placeholder="请输入学校名称" @keyup.enter.native="search()"></el-input>
      </span>
      <span style="display: inline-block;">
        <span>教师姓名：</span>
        <el-input class="input" v-model="searchParams.teacherName"  placeholder="请输入教师姓名" @keyup.enter.native="search()"></el-input>
      </span>
    <!--</p>
    <p class="header_p">-->
      <span style="display: inline-block;">
        <span>图书编号：</span>
        <el-input class="input" v-model="searchParams.isbn"  placeholder="请输入图书ISBN" @keyup.enter.native="search()"></el-input>
      </span>
      <span style="display: inline-block;">
        <span>选用状态：</span>
        <el-select class="input" v-model="searchParams.statusId"  :defaultFirstOption="true" @change="search()">
          <el-option :key="0" :value="0" :label="'全部'"></el-option>
          <el-option v-for="item in statusList" :key="item.id" :value="item.id" :label="item.statusName">{{item.statusName}}</el-option>
        </el-select>
      </span>
      <span style="display: inline-block;">
        <span>创建日期：</span>
        <el-date-picker
          v-model="dateTimeRange"
          type="datetimerange"
          :picker-options="pickerOptions"
          :editable="false"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="dateTimeRangeChange"
          align="right">
        </el-date-picker>

          <el-button type="primary" icon="search" @click="search()">搜索</el-button>
      </span>

      <span class="pull-right" style="padding-top: 10px;">
           <el-button type="primary" :disabled="uploadLoading"  :loading="uploadLoading" >导出excel</el-button>
      </span>

    </p>
    <el-table
      :data="tableData"
      style="width:100%"
      border
      class="table-wrapper"
    >

      <el-table-column
        label="图书名称"
        prop="bookname"
      >
      </el-table-column>
      <el-table-column
        label="ISBN"
        prop="isbn"

        :className="'td-center'"
      >
      </el-table-column>
      <el-table-column
        label="入选课程数"
        prop="courseCount"

        :className="'td-center'"
      >
      </el-table-column>

      <el-table-column
        label="选用学校数"
        prop="orgCount"

        :className="'td-center'"
      >
      </el-table-column>

      <el-table-column
        label="选用教师人数"
        prop="teacherCount"

        :className="'td-center'"
      >
      </el-table-column>

      <el-table-column
        label="选用学生人次"
        prop="studentCount"
        :className="'td-center'"
      >
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
        listUrl:'/pmpheep/bookCourse/countList', //课程模板列表url

        searchParams:{
          courseName:'',
          orgName:'',
          teacherName:'',
          bookname:'',
          isbn:'',
          statusId:0,
          startTime:'',
          endTime:'',
          pageSize:10,
          pageNumber:1
        },
        uploadLoading:false,
        dateTimeRange:[],
        pickerOptions:{
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        statusList:[{id:1,statusName:"已创建"},
          {id:2,statusName:"已下单"},
          {id:3,statusName:"已支付"}],
        pageTotal:100,
        tableData:[],
        showSendVisible: false,
        sendTable: [],
        sendPageSize: 20,
        sendPageNumber: 1,
        sendTotal: 0,
        isAdmin:false,
      }
    },
    created(){
      this.isAdmin = this.$getUserData().userInfo.isAdmin;
      this.getSurveyList();

    },
    methods:{
      /* 获取课程模板列表 */
      getSurveyList(){
        this.$axios.get(this.listUrl,{
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

      dateTimeRangeChange(val){
        if(val){
          this.searchParams.startTime=val.split("至")[0];
          this.searchParams.endTime=val.split("至")[1];
        }else{
          this.searchParams.startTime='';
          this.searchParams.endTime='';
        }
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
    width: 15em;
    margin-right: 10px;
  }
  .survey_model_set .header_p .input {
    width: 15em;
    margin-right: 10px;
  }
  .survey_model_set .header_p .data{
    width:200px;
  }
  .table-wrapper .el-button.el-button--text {
    white-space: normal;
  }
  .header_p div {
    margin-right: 10px;
    margin-top: 10px;
  }
  .templateName.el-button{
    text-align: left;
  }

</style>
<style>
  .survey_model_set th {
    text-align: center;
  }
</style>
