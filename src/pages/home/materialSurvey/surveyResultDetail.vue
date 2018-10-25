<template>
  <div class="survery_result_detail">
      <div style="width:100%;float:left;">
      <p class="left_header_p">
         问卷信息
       <span></span>
       </p>
       </div>
      <el-form :model="formTop" ref="formTop" label-width="120px" style="width:80%;">
        <el-form-item label="调查问卷名称：">
         {{surveyData.surveyTitle}}
        </el-form-item>
        <el-form-item label="调查对象：">
          {{surveyData.surveyName}}
        </el-form-item>
        <el-form-item label="调查概述：">
         {{surveyData.intro}}
        </el-form-item>
        <el-form-item label="调查日期范围：">
          {{surveyData.startDate}} 到 {{surveyData.endDate}}
        </el-form-item>
        <el-form-item label="参与人数：">
          {{surveyData.surveyUsers}}
        </el-form-item>
        <el-form-item label="发起人：">
          {{surveyData.realname}}
        </el-form-item>
        <el-form-item label="问卷地址：">
         {{'http://'+currentIp+'/medu/survey/writeSurvey.action?surveyId='+searchParams.surveyId}}
        </el-form-item>
      </el-form>
      <div style="width:100%;float:left;">
      <p class="left_header_p">
         调查结果
       <span></span>
       </p>
       <p class="tips"><span>*</span> 温馨提示:为提升用户体验，填空题的结果不直接展示内容</p>
       </div>
       <div style="width:100%;overflow:hidden;padding:0 20px;box-sizing:border-box;">
         <el-tabs v-model="activeName" >
            <el-tab-pane label="数据统计" name="first" class="data_statistic">
                <ul class="option_ul">
                    <li v-for="(iterm,index) in choiceQuestionData" :key="index">
                      <div class="question_p">
                        <p><span>内容类型：</span>{{iterm.questionType===1?'单选题':'多选题'}}</p>
                        <!--<p><span>顺序号：</span>{{iterm.questionSort}}</p>-->
                        <p><span>内容标题：</span>
                          {{iterm.title}}
                          {{iterm.questionType===1?'':'(可多选)'}}
                        </p>
                      </div>
                      <el-table :data="iterm.choicesList" border class="question_table">
                        <el-table-column label="选项序号" width="100" prop="index">
                          <template scope="scope">
                              {{(parseInt(scope.$index)+1)}}
                          </template>
                        </el-table-column>
                        <el-table-column label="选项标题" prop="title">
                        </el-table-column>
                        <el-table-column label="占比" width="240">
                          <template scope="scope">
                            <div class="zb-box">
                              <p>{{scope.row.zb}}%</p>
                              <div class="zb-box-percent" :style="{width:scope.row.zb+'%'}"></div>
                            </div>
                          </template>
                        </el-table-column>
                        <el-table-column label="统计次数" prop="num" width="100">
                        </el-table-column>
                      </el-table>
                    </li>

                    <li v-for="(iterm,index) in writeQuestionData" :key="index">
                        <div class="question_p">
                          <p><span>内容类型：</span>{{iterm.questionType===4||iterm.questionType===5?'填空题':'其他'}}</p>
                          <p><span>内容标题：</span>{{iterm.questionName}}</p>
                        </div>
                        <div class="question_p">
                          <p>
                            <span>统计结果：</span>
                            {{iterm.count}}条
                            <el-button type="text" style="color:#337ab7;margin-left:20px;" @click="resultDetail(iterm.surveyId,iterm.questionId)">查看调查结果</el-button>
                            <el-button type="text" style="color:#337ab7" @click="exportResult(iterm.surveyId,iterm.questionId,iterm.questionName)">导出结果查看</el-button>
                            </p>
                        </div>
                    </li>
                </ul>
            </el-tab-pane>
<!--             <el-tab-pane label="图表统计" name="second" class="chart_statistic">
                <ul style="width:100%">
                    <li>
                        <p class="question_p">1.您是否使用过xx社交网站？</p>
                        <div class="chart_box">
                            <div id="pieChart1" style="width:50%;height:300px;float:left;"></div>
                            <div id="barChart1" style="width:50%;height:300px;float:left;"></div>
                        </div>
                    </li>
                </ul>
            </el-tab-pane> -->
        </el-tabs>
       </div>

       <!-- 切换问卷对话框 -->
       <el-dialog title="调查问卷" :visible.sync="dialogVisible"  class="select_dialog" >
         <div style="overflow:hidden;">
          <p class="header_p">
             <span>问题：</span>
             <span v-if="dialogTableData.length">{{dialogTableData[0].questionName}}</span>
          </p>
          <el-table :data="dialogTableData" border class="table-wrapper">
            <el-table-column label="序号" prop="index" width="65">
            </el-table-column>
            <el-table-column label="调查结果" prop="optionContent">
            </el-table-column>
            <el-table-column label="时间" prop="gmtCreate" width="180">
            </el-table-column>
            <el-table-column label="填写人" prop="realname" width="90">
            </el-table-column>
          </el-table>
                    <!--分页-->
          <div class="pagination-wrapper">
            <el-pagination
              v-if="pageTotal>dialogSearchParams.pageSize"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="dialogSearchParams.pageNumber"
              :page-sizes="[10,20,30,50]"
              :page-size="dialogSearchParams.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pageTotal">
            </el-pagination>
          </div>
        </div>
       </el-dialog>
  </div>
</template>
<script type="text/javascript">
import echarts from "../../../../static/echarts/echarts.common.min";
export default {
  data() {
    return {
      api_detail:'/pmpheep/survey/question/answer/count',
      api__question_result:'/pmpheep/survey/question/answer/fill',
      exportUrl:'/pmpheep/excel/surveyQuestionExcel',
      surveyData:{
        surveyId: '',
        surveyTitle: '',
        surveyName: "",
        intro: null,
        realname: "",
        surveyUsers: '',
        questionId: null,
        title: null,
        optionId: null,
        optionContent: null,
        optionCount: null,
        questionSum: null,
        startDate: null,
        endDate: null,
        questionSort: null,
        questionType: null,
        count: 0
      },
      searchParams:{
        surveyId:'',
      },
      activeName: "first",
      formTop:{

      },
      dialogSearchParams:{
        pageSize:30,
        pageNumber:1,
        surveyId:"",
        questionId:''
      },
      currentIp:'',
      dialogVisible:false,
      dialogTableData:[],
      pageTotal:0,
      choiceQuestionData: [],
      writeQuestionData:[],
    };
  },
  methods: {
    handleSizeChange(val){
      this.dialogSearchParams.pageSize=val;
      this.dialogSearchParams.pageNumber=1;
      this.resultDetail('','',true);
    },
    closeDialog(done){
      done();
    },
    /**
     * 获取当前问卷数据
     */
    getSurveyData(){
      this.$axios.get(this.api_detail,{params:this.searchParams})
        .then((response) => {
          let res = response.data;
          if (res.code == '1') {
            res.data.questionOne.map((iterm,index)=>{
              iterm.choicesList=[];
              iterm.optionContent=iterm.optionContent.split(',');
              iterm.optionCount=iterm.optionCount.split(',');
              iterm.optionContent.forEach((t,i)=>{
                iterm.choicesList.push({
                  index:index+1,
                  title:t,
                  num:iterm.optionCount[i],
                  zb:iterm.questionSum ? Math.round((iterm.optionCount[i]/iterm.questionSum)*10000)/100 : 0,
                })
              })
            });
            this.choiceQuestionData=res.data.questionOne;
            this.writeQuestionData = res.data.questionMore;
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
    /**
     * 输入题型查看结果
     */
    resultDetail(surveyId,questionId,openDialog){
      if(!openDialog){
        this.dialogVisible=true;
        this.dialogSearchParams.surveyId=surveyId?surveyId:'';
        this.dialogSearchParams.questionId=questionId?questionId:'';
      }
      console.log(this.dialogSearchParams)
      this.$axios.get(this.api__question_result,{params:this.dialogSearchParams})
        .then((response) => {
          let res = response.data;
          if (res.code == '1') {
            console.log(res.data);
            res.data.rows.forEach((iterm,index)=>{
              iterm.index = index+1;
              /* iterm.gmtCreate = this.$commonFun.formatDate(iterm.gmtCreate); */
            })
            this.dialogTableData = res.data.rows;
            this.pageTotal=res.data.total;
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
    /**
     * 导出结果查看
     */
    exportResult(surveyId,questionId,title){
      let url = this.exportUrl+"?surveyId=" + surveyId +'&questionId='+questionId+'&title'+title;
			this.$commonFun.downloadFile(url);
    },
  },
  mounted() {
  },
  created(){
    this.currentIp=window.location.host;
    this.searchParams.surveyId = this.$route.query.id;
    this.surveyData = this.$route.params.data||{};
    if(!this.searchParams.surveyId||!this.surveyData.surveyTitle){
      this.$router.go(-1);
      return;
    }
    this.getSurveyData();
  },
};
</script>
<style>
.survery_result_detail {
  overflow: hidden;
  padding: 20px 0;
}
.survery_result_detail .left_header_p {
  padding: 0 30px;
  line-height: 30px;
  margin-bottom: 20px;
  float: left;
  background-color: #12806b;
  color: #fff;
  position: relative;
  z-index: 1;
}
.survery_result_detail .left_header_p span {
  height: 0px;
  display: block;
  width: 0px;
  background-color: #fff;
  border: 15px #fff solid;
  border-bottom-color: #fff;
  border-left-color: #12806b;
  border-right-color: #fff;
  position: absolute;
  z-index: 9;
  right: -25px;
  top: 0;
}
.survery_result_detail  .tips{
  margin-left:40px;
  color:#999;
  float:left;
  line-height: 30px;
}
.survery_result_detail  .tips span{
  color:#ff4949;
}
.survery_result_detail .header_p {
  overflow: hidden;
  margin-bottom: 20px;
}
.survery_result_detail .header_p .input {
  width: 217px;
  margin-right: 10px;
}
.survery_result_detail .data_statistic .question_p {
  line-height: 30px;
  overflow: hidden;
}
.survery_result_detail .data_statistic .question_p p{
  /*float: left;*/
  /*width:50%;*/

}

.survery_result_detail .data_statistic .option_ul li{
  box-sizing: border-box;
  padding-top:5px;
  padding-bottom:15px;
  border-bottom:1px dotted #ccc;
}
.survery_result_detail .data_statistic .question_table {
  margin: 10px 0 20px 0;
}
.survery_result_detail .chart_statistic .question_p {
  line-height: 30px;
}
.survery_result_detail .chart_statistic .chart_box {
  margin: 10px 0 20px 0;
}
.survery_result_detail .select_dialog .el-dialog{
  width:650px;
}
.survery_result_detail .select_dialog .header_p{
  overflow: hidden;
  margin-bottom:20px;
}
.survery_result_detail .select_dialog  .header_p .input {
  width: 217px;
  margin-right: 10px;
}
  .zb-box{
    position: relative;
  }
.zb-box>p{
  position: relative;
  z-index: 2;
}
  .zb-box-percent{
    position: absolute;
    top:0;
    left:0;
    width: 0;
    height: 100%;
    background-color: #dcebfe;
    transition: all .28s;
    z-index: 1;
  }
</style>
