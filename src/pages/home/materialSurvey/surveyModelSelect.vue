<template>
  <div>
    <div style="font-size: 18px;font-weight: bold;color: rgb(91, 104, 119);margin-bottom: 15px;">选择调研表模板：</div>
    <div class="survey_model_set">
      <p class="header_p">
         <span>模板名称：</span>
         <el-input class="input" v-model="searchParams.templateName"  placeholder="请输入模板名称" @keyup.enter.native="search()"></el-input>
        <span>调研对象：</span>
        <el-select v-model="searchParams.typeId" @change="search()" style="width: 12em;margin-right:10px;">
          <el-option :key="''" :value="''" :label="'全部'"></el-option>
          <el-option v-for="item in typeList" :key="item.id" :value="item.id" :label="item.surveyName">{{item.surveyName}}</el-option>
        </el-select>

        <span style="display: inline-block;">
          <span>创建日期：</span>
           <el-date-picker
                v-model="searchParams.startTime"
                class="input data"
                type="date"
                clearable
                @change="startDateChange"
                placeholder="请选择开始日期">
            </el-date-picker>
            <span>-</span>
            <el-date-picker
                v-model="searchParams.endTime"
                class="input data"
                type="date"
                clearable
                @change="endDateChange"
                placeholder="请选择结束日期">
            </el-date-picker>
        </span>
          <el-button type="primary" icon="search" @click="search()">搜索</el-button>
          <el-button type="primary"  style="float:right;" @click="$router.push({name:'调研表新增',params:{type:'add'}})">直接新增</el-button>
      </p>
      <el-table
      :data="tableData"
      style="width:100%"
      border
      class="table-wrapper"
      >
       <el-table-column
       label="模板名称"
       prop="templateName"
       >
       <template scope="scope">
         <el-button type="text" @click="updataTemplate(scope.row.id,'check')">{{scope.row.templateName}}</el-button>
       </template>
       </el-table-column>
        <el-table-column
          label="问卷概述"
          prop="intro"
        >
        </el-table-column>
        <el-table-column
       label="调研对象"
       prop="surveyName"
       width="100"
       :className="'justify td-center'"
       >
       </el-table-column>


        <el-table-column
          label="创建人"
          prop="username"
          width="110"
          :className="'justify'"
        >
        </el-table-column>
       <el-table-column
       label="创建日期"
       prop="gmtCreat"
       width="120"
       >
       <template scope="scope">
           {{$commonFun.formatDate(scope.row.gmtCreate,'yyyy-MM-dd')}}
           </template>
       </el-table-column>

       <el-table-column
        label="操作"
        width="120"
       >
       <template scope="scope">
         <el-button type="text"  @click="updataTemplate(scope.row.id)">选择模板</el-button>
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


    </div>
  </div>
</template>
<script type="text/javascript">
    export default{
        data(){
            return{


              surveyLsitUrl:'/pmpheep/materialSurvey/template/list', //调研问卷列表url
              editTemplateUrl:'/pmpheep/materialSurvey/template/question/look', //获取修改信息url
              typeListUrl:'/pmpheep/materialSurvey/typeList',
              searchParams:{
                  templateName:'',
                  startTime:'',
                  endTime:'',
                  pageSize:10,
                  pageNumber:1,
                  active:1,
                  isActive:1,
                  typeId:''
              },
              typeList:[],
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
          this.getTypeList();
        },
        methods:{
            /* 获取问卷列表 */
            getSurveyList(){
              this.$axios.get(this.surveyLsitUrl,{
                  params:this.searchParams
              }).then((res)=>{
                  console.log(res);
                  if(res.data.code==1){
                      this.pageTotal=res.data.data.total;
                      this.tableData=res.data.data.rows;
                  }
              })
            },
            /* 获取问卷列表 */
            getTypeList(){
              this.$axios.get(this.typeListUrl,{
                params:{}
              }).then((res)=>{
                this.typeList = res.data.data;
              })
            },
            /* 搜索按钮 */
            search(){
              this.searchParams.pageNumber=1;
              this.getSurveyList();
            },
           /* 修改按钮 */
           updataTemplate(id,str){
            this.$axios.get(this.editTemplateUrl,{
                params:{
                    templateId:id

                }
            }).then((res)=>{

                let strData = JSON.stringify(res.data.data);
                let jsonData = {};
              /**
               * 此处的替换为：
               * 0.将模板主键id的key，替换为“templateId”
               * 1.将模板名称的key替换为调研表名称
               * 2.将问题id全部换为空字符串，数据库层面将生成新数据
               * 3.将选项id换为空字符串，但此处id非json格式，而是字符串拼接，此写法只能应付以下逗号数量+1长度的选项列表（许是够了）
               */
                let strDataWithoutId=strData.replace(/"survey"\s*?:\s*?{\s*?"id":/ig,"\"survey\":{\"templateId\":")
                  .replace(/"templateName":/ig,'"title":')
                  .replace(/,?(?=\s*?"id"\s*?:).*?(?=[,\]\}])\s*?/ig,'"id":""')
                  .replace(/(\s*?"optionIdString"\s*?:\s*?").*?"(?=[,\]\}])\s*?/ig,'"optionIdString":",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,"');

                jsonData = JSON.parse(strDataWithoutId);
                jsonData.survey.requiredForMaterial = false;
                jsonData.survey.allTextbookUsed = false;

                if(res.data.code==1){
                   this.$router.push({name:'调研表新增',params:{surveryData:jsonData,type:str?str:''}});
                }
            })
           },

            startDateChange(val){
             this.searchParams.startTime=val;
            },
            endDateChange(val){
              this.searchParams.endTime=val;
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
.survey_model_set{
    border: 1px solid #d4d9dd;
    padding: 20px 20px 40px 20px;
  }
.survey_model_set .header_p {
  overflow: hidden;
}
.survey_model_set .header_p .input {
  width: 217px;
  margin-right: 10px;
}
.survey_model_set .header_p .data{
    width:200px;
}
</style>
