<template>
  <div class="recovery_result">
      <div style="width:100%;float:left;">
            <p class="left_header_p">
                问卷信息
            <span></span>
            </p>
       </div>
      <el-form :model="formTop" ref="formTop" label-width="120px" style="width:80%;">
        <el-form-item label="调查问卷名称：">
         {{formTop.title}}
        </el-form-item>
        <el-form-item label="调查对象：">
         {{formTop.surveyName }}
        </el-form-item>
        <el-form-item label="调查概述：">
         <el-input type="textarea" :rows="3" v-model="formTop.intro"></el-input>
        </el-form-item>
        <el-form-item label="调查日期范围：">
         {{$commonFun.formatDate(formTop.beginDate,'yyyy-MM-dd')}}到{{$commonFun.formatDate(formTop.endDate,'yyyy-MM-dd')}}
        </el-form-item>
        <!-- <el-form-item label="参与人数：">
          {{formTop.count }}
        </el-form-item> -->
        <el-form-item label="发起人：">
         {{formTop.realname }}
        </el-form-item>
        <el-form-item label="问卷地址：">
         {{'http://'+currentIp+'/medu/survey/writeSurvey.action?surveyId='+$route.params.surveyId}}
        </el-form-item>
      </el-form>
      <div style="width:100%;float:left;">
      <p class="left_header_p">
         调查结果
       <span></span>
       </p>
       </div>
       <ul class="result_list">
           <li v-for="(item,index) in questionList" :key="index">
             <p class="header_p">
                 <label>标题：</label>
                 <span>{{item.title}}</span>
             </p>
             <p class="header_p">
                 <label>回答：</label>
                 <span v-if="item.noteOptionContent">{{item.noteOptionContent}}</span>
                 <span v-else>{{item.oneOrManyOptionContent}}</span>
             </p>
           </li>
           <!-- <li>
             <p class="header_p">
                 <label>标题：</label>
                 <span>填表人姓名</span>
             </p>
             <p class="header_p">
                 <label>回答：</label>
                 <span></span>
             </p>
           </li>
           <li>
             <p class="header_p">
                 <label>标题：</label>
                 <span>职务</span>
             </p>
             <p class="header_p">
                 <label>回答：</label>
                 <span></span>
             </p>
           </li>
           <li>
             <p class="header_p">
                 <label>标题：</label>
                 <span>整体质量评价</span>
             </p>
             <p class="header_p">
                 <label>回答：</label>
                 <span></span>
             </p>
           </li>
           <li>
             <p class="header_p">
                 <label>标题：</label>
                 <span>复杂难懂的内容是否表达清晰？如有问题请您举例说明，并提出建议</span>
             </p>
             <p class="header_p">
                 <label>回答：</label>
                 <span></span>
             </p>
           </li> -->
       </ul>
  </div>
</template>
<script type="text/javascript">
    export default{
        data(){
            return{
             surveryDetailUrl:'/pmpheep/survey/question/answer/recovery/detail',   //详情url
             formTop:{
             },
             currentIp:'',
             questionList:[]
            }
        },
        created(){
            this.currentIp=window.location.host;
          console.log(this.$route);
          this.getDetailData();
        },
        methods:{
            getDetailData(){
                this.$axios.get(this.surveryDetailUrl,{
                    params:{
                        surveyId:this.$route.params.surveyId,
                        userId:this.$route.params.userId
                    }
                }).then((res)=>{
                    console.log(res);
                    if(res.data.code==1){
                        this.formTop=res.data.data.Survey;
                        this.questionList=res.data.data.SurveyQuestionAnswer;
                    }else{
                        this.$confirm(res.data.msg.msgTrim(), "提示",{
                        	confirmButtonText: "确定",
                        	cancelButtonText: "取消",
                        	showCancelButton: false,
                        	type: "error"
                        });
                    }
                })
            }
        }
    }
</script>
<style>
.recovery_result {
  overflow: hidden;
  padding: 20px 0;
}
.recovery_result .left_header_p {
  padding: 0 30px;
  line-height: 30px;
  margin-bottom: 20px;
  float: left;
  background-color: #12806b;
  color: #fff;
  position: relative;
  z-index: 1;
}
.recovery_result .left_header_p span {
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
.recovery_result .result_list{
    padding:20px;
    box-sizing: border-box;
}
.recovery_result .result_list li{
  box-sizing: border-box;
  width:100%;
  padding-top:5px;
  padding-bottom:15px;
  border-bottom:1px dotted #ccc;
  overflow: hidden;
}
.recovery_result .result_list li .header_p{
    overflow: hidden;
    line-height: 28px;
    width:90%;
}
.recovery_result .result_list li .header_p label{
    width:45px;
    display: inline-block;
    float:left;
}
.recovery_result .result_list li .header_p span{
    width:calc(100% - 45px);
    display: inline-block;
    float:left;
}
</style>
