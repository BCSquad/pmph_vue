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
        :className="'td-center'"
      >
        <template scope="scope">
          <a href="javascript:void(0)"   @click="openDetail(1,scope.row.bookId)">{{scope.row.courseCount}}</a>
        </template>
      </el-table-column>

      <el-table-column
        label="选用学校数"
        :className="'td-center'"
      >

        <template scope="scope">
          <a href="javascript:void(0)" @click="openDetail(2,scope.row.bookId)">{{scope.row.orgCount}}</a>
        </template>
      </el-table-column>

      <el-table-column
        label="选用教师人数"
        prop="teacherCount"

        :className="'td-center'"
      >
        <template scope="scope">
          <a href="javascript:void(0)"   @click="openDetail(3,scope.row.bookId)">{{scope.row.teacherCount}}</a>
        </template>
      </el-table-column>

      <el-table-column
        label="选用学生人次"
        prop="studentCount"
        :className="'td-center'"
      >
        <template scope="scope">
          <a href="javascript:void(0)"   @click="openDetail(4,scope.row.bookId)">{{scope.row.studentCount}}</a>
        </template>
      </el-table-column>


      <el-table-column
        label="操作"
      >
        <template scope="scope">
          <a  @click="extport(scope.row.bookId)"> 导出</a>

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

    <el-dialog
      :visible.sync="chooseDetailDiaLog"
      fullscreen = "true"
      width="100%"
      title="选用课程信息"
    >
      <p class="header_p">

        <span style="display: inline-block;">
        <span>课程名称：</span>
        <el-input class="input" v-model="detailParams.name"  placeholder="请输入课程名称" @keyup.enter.native="searchDetail()"></el-input>
      </span>
       <span>

          <el-button type="primary" icon="search" @click="searchDetail()">搜索</el-button>
      </span>

      </p>

      <el-table
        :data="detailData"
        style="width:100%"
        border
        class="table-wrapper"
      >

        <el-table-column
          type="index" label="序号" align="center"
          width="70">
          <template scope="scope">
            {{(scope.$index+1)}}
          </template>
        </el-table-column>
        <el-table-column
          label="课程名称"
          prop="name"
        >
        </el-table-column>
        <el-table-column
          label="课程说明"
          prop="note"

          :className="'td-center'"
        >
        </el-table-column>
        <el-table-column
          label="课程创建人"
          prop="userName"

          :className="'td-center'"
        >
        </el-table-column>
        <el-table-column
          label="创建时间">
          <template scope="scope">
            {{$commonFun.formatDate(scope.row.gmtCreate)}}
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrapper">
        <el-pagination
          v-if="pageTotal>detailParams.pageSize"
          @size-change="detailHandleSizeChange"
          @current-change="detailHandleCurrentChange"
          :current-page="detailParams.pageNumber"
          :page-sizes="[10,20,30,50]"
          :page-size="detailParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="detailPageTotal">
        </el-pagination>
      </div>


    </el-dialog>



    <el-dialog
      :visible.sync="schoolDetailDiaLog"
      fullscreen = "true"
      width="100%"
      title="选用学校信息"
    >
      <p class="header_p">

        <span style="display: inline-block;">
        <span>课程名称：</span>
        <el-input class="input" v-model="detailParams.orgName"  placeholder="请输入学校名称" @keyup.enter.native="searchDetail(2)"></el-input>
      </span>
        <span>

          <el-button type="primary" icon="search" @click="searchDetail(2)">搜索</el-button>
      </span>

      </p>

      <el-table
        :data="schoolData"
        style="width:100%"
        border
        class="table-wrapper"
      >

        <el-table-column
          type="index" label="序号" align="center"
          width="70">
          <template scope="scope">
            {{(scope.$index+1)}}
          </template>
        </el-table-column>
        <el-table-column
          label="学校名称"
          prop="orgName"
        >
        </el-table-column>
      </el-table>
      <div class="pagination-wrapper">
        <el-pagination
          v-if="pageTotal>detailParams.pageSize"
          @size-change="detailHandleSizeChange"
          @current-change="detailHandleCurrentChange"
          :current-page="detailParams.pageNumber"
          :page-sizes="[10,20,30,50]"
          :page-size="detailParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="detailPageTotal">
        </el-pagination>
      </div>


    </el-dialog>


    <el-dialog
      :visible.sync="teacherDetailDiaLog"
      fullscreen = "true"
      width="100%"
      title="选用教师信息"
    >
      <p class="header_p">
        <span style="display: inline-block;">
        <span>课程名称：</span>
        <el-input class="input" v-model="detailParams.username"  placeholder="请输入课程名称" @keyup.enter.native="searchDetail(3)"></el-input>
      </span>
        <span>

          <el-button type="primary" icon="search" @click="searchDetail(3)">搜索</el-button>
      </span>

      </p>

      <el-table
        :data="teacherData"
        style="width:100%"
        border
        class="table-wrapper"
      >
        <el-table-column
          type="index" label="序号" align="center"
          width="70">

        </el-table-column>
        <el-table-column
          label="教师名称"
          prop="realname"
        >
        </el-table-column>
        <el-table-column
          label="教师账号"
          prop="username"
        >
        </el-table-column>

        <el-table-column
          label="所属学校"
          prop="org_name"
        >
        </el-table-column>
      </el-table>
      <div class="pagination-wrapper">
        <el-pagination
          v-if="pageTotal>detailParams.pageSize"
          @size-change="detailHandleSizeChange"
          @current-change="detailHandleCurrentChange"
          :current-page="detailParams.pageNumber"
          :page-sizes="[10,20,30,50]"
          :page-size="detailParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="detailPageTotal">
        </el-pagination>
      </div>


    </el-dialog>


    <el-dialog
      :visible.sync="studentDetailDiaLog"
      fullscreen = "true"
      width="100%"
      title="选用学生信息"
    >
      <p class="header_p">
        <span style="display: inline-block;">
        <span>课程名称：</span>
        <el-input class="input" v-model="detailParams.name"  placeholder="请输入课程名称" @keyup.enter.native="searchDetail(4)"></el-input>
      </span>
        <span>

          <el-button type="primary" icon="search" @click="searchDetail(4)">搜索</el-button>
      </span>

      </p>

      <el-table
        :data="studentUserlData"
        style="width:100%"
        border
        class="table-wrapper"
      >
        <el-table-column
          type="index" label="序号" align="center"
          width="70">
          <template scope="scope">
            {{(scope.$index+1)}}
          </template>
        </el-table-column>
        <el-table-column
          label="学生名称"
          prop="realname"
        >
        </el-table-column>
        <el-table-column
          label="学生账号"
          prop="username"
        >
        </el-table-column>
      </el-table>
      <div class="pagination-wrapper">
        <el-pagination
          v-if="pageTotal>detailParams.pageSize"
          @size-change="detailHandleSizeChange"
          @current-change="detailHandleCurrentChange"
          :current-page="detailParams.pageNumber"
          :page-sizes="[10,20,30,50]"
          :page-size="detailParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="detailPageTotal">
        </el-pagination>
      </div>


    </el-dialog>




  </div>
</template>
<script type="text/javascript">
  export default{
    data(){
      return{
        listUrl:'/pmpheep/bookCourse/countList', //课程模板列表url
        courseDetailUrl:'/pmpheep/bookCourse/courseDeatil', //课程模板列表url
        orgDetailUser:'/pmpheep/bookCourse/orgDeatil',
        writerUserUrl:'/pmpheep/bookCourse/writerUserDeatil',
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
        detailParams:{
          type:'',
          bookId:'',
          name:"",
          orgName:'',
          username:'',
          pageSize:10,
          pageNumber:1
        },
        detailType:1,

        chooseDetailDiaLog:false,
        schoolDetailDiaLog:false,
        teacherDetailDiaLog:false,
        studentDetailDiaLog:false,
        uploadLoading:false,
        detailData:[],
        tableData:[],
        schoolData:[],
        teacherData:[],
        studentUserlData:[],
        pageTotal:100,
        detailPageTotal:100,
        schoolPageTotal:100,
        writerUserPageTotal:100,
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

      extport(id){
        window.location.href="/pmpheep/word/bookChoose/listTrack.action?bookId="+id
      },

      openDetail(type,id){
        this.detailType=type;
        this.detailParams.bookId=id;
        this.detailParams.pageNumber=1;
        switch (type) {
          case 1:
            this.chooseDetailDiaLog=true;

            break;
          case 2:
            this.schoolDetailDiaLog=true;

            break;
          case 3:
            this.teacherDetailDiaLog=true;

            break;
          case 4:
            this.studentDetailDiaLog=true;

            break;
        }
        this.getDetailByBook();


      },
      searchDetail(){
        this.detailParams.pageNumber = 1;
        this.getDetailByBook();
      },

      getDetailByBook(){
        let type=this.detailType;
        switch (type) {
          case 1:
            this.$axios.get(this.courseDetailUrl,{
              params:this.detailParams
            }).then((res)=>{
              console.log(res.data);
              if(res.data.code==1){
                this.detailPageTotal=res.data.data.total;
                this.detailData=res.data.data.rows;
              }
            })
            break;
          case 2:
            this.$axios.get(this.orgDetailUser,{
              params:this.detailParams
            }).then((res)=>{
              console.log(res.data);
              if(res.data.code==1){
                this.detailPageTotal=res.data.data.total;
                this.schoolData=res.data.data.rows;
              }
            })

            break;
          case 3:
            this.detailParams.type=1;
            this.$axios.get(this.writerUserUrl,{
              params:this.detailParams
            }).then((res)=>{
              console.log(res.data);
              if(res.data.code==1){
                this.detailPageTotal=res.data.data.total;
                this.teacherData=res.data.data.rows;
              }
            })

            break;
          case 4:
            this.detailParams.type=2;
            this.$axios.get(this.writerUserUrl,{
              params:this.detailParams
            }).then((res)=>{
              console.log(res.data);
              if(res.data.code==1){
                this.detailPageTotal=res.data.data.total;
                this.studentUserlData=res.data.data.rows;
              }
            })
            break;


        }


      },


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
      detailHandleSizeChange(val){
        this.detailParams.pageSize=val;
        this.detailParams.pageNumber=1;
        let type =this.detailType;
        this.getDetailByBook();
      },
      detailHandleCurrentChange(val){
        this.detailParams.pageNumber=val;
        let type =this.detailType;
        this.getDetailByBook();

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
