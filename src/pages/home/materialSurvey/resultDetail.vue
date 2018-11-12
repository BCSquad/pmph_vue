<template>
  <div class="add_new_model">
    <div style="width:100%;float:left;">
      <p class="left_header_p">
        调研表信息
        <span></span>
      </p>
    </div>
    <div style="width:100%;float:left;">
      <el-form :model="surveyForm" ref="surveyForm"    label-width="120px" style="margin:30px 0;width:80%;">
        <el-form-item label="调研表名称:" prop="title" >
          {{surveyForm.title}}
          <!--<el-input placeholder="请输入调研表名称" v-model="surveyForm.title" style="width:100%"></el-input>-->
        </el-form-item>
        <!--<el-form-item label="调查对象:" prop="typeId">
          <el-select v-model="surveyForm.typeId"  placeholder="请选择调查对象" style="margin-right: 2em;">
            <el-option
              v-for="item in objTableData"
              :key="item.id"
              :label="item.surveyName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="调查概述:" prop="intro">
          {{surveyForm.intro}}
          <!--<el-input type="textarea" :rows="3" v-model="surveyForm.intro"  placeholder="调查概述"></el-input>-->
        </el-form-item>
        <el-form-item label="填表人姓名:">
          {{$route.query.realname}}
        </el-form-item>
        <!--<el-form-item label="调查教材:" prop="materialId" >
          <el-select v-model="surveyForm.materialId" clearable filterable :defaultFirstOption="false" placeholder="请选择调查教材" style="width:60%;">
            <el-option :key="''" :label="'-未选择-'" value=""></el-option>
            <el-option
              v-for="item in materialOptions"
              :key="item.id"
              :label="item.materialName"
              :value="item.id">
            </el-option>
          </el-select>
          <el-checkbox v-model="surveyForm.allTextbookUsed">应用于该教材所有书籍</el-checkbox>

        </el-form-item>-->
        <el-form-item v-show="!surveyForm.allTextbookUsed">
          <el-checkbox-group>
            <el-checkbox v-for="item in textbookList" :label="item.textbook.id" >{{item.textbook.textbookName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>



      </el-form>


      <p class="left_header_p">
        调研内容
        <span></span>
      </p>
    </div>

    <!-- 表单列表 -->
    <div class="form_list">
      <h3 v-if="surveyForm.questionAnswerJosn.length==0">正在加载题目</h3>
      <el-form  ref="form" label-width="100px" label-position="top">

        <el-form-item :label="item.sort+'.'+item.title" v-for="(item,index) in surveyForm.questionAnswerJosn" :key="index">
          <!-- 单选 -->
          <el-radio-group  v-if="item.type==1" v-model="item.checkedOptionIdS[0]" >
            <el-radio :label="it.id" v-for="(it,index) in item.surveyQuestionOptionList" :key="index">{{it.optionContent}}</el-radio>
          </el-radio-group>
          <!-- 多选 -->
          <el-checkbox-group   v-if="item.type==2" v-model="item.checkedOptionIdS" style="float:left;">
            <el-checkbox :label="it.id" v-for="(it,index) in item.surveyQuestionOptionList" :key="index">{{it.optionContent}}</el-checkbox>
          </el-checkbox-group>
          <!-- 单行文本 -->
          <el-input  class="form_input" v-if="item.type==4" :disabled="true" v-model="item.surveyQuestionOptionList[0].optionContent"></el-input>
          <!-- 多行文本 -->
          <el-input   type="textarea" :rows="3" class="form_input" v-if="item.type==5" :disabled="true" v-model="item.surveyQuestionOptionList[0].optionContent"></el-input>

        </el-form-item>
      </el-form>

      <div class="bottom_box" v-if="surveyForm.questionAnswerJosn.length!=0&&$route.params.type!='check'">
        <div class="button_box">
          <el-button @click="$router.go(-1)">返回</el-button>
        </div>
      </div>
    </div>


  </div>
</template>
<script type="text/javascript">
  export default {
    data() {
      return {
        objListUrl:'/pmpheep/materialSurvey/type/list',   //调查对象列表url

        addNewObjUrl:'/pmpheep/survey/type/create', //添加新对象url
        editObjUrl:'/pmpheep/survey/type/update',  //修改对象url
        deleteObjUrl:'/pmpheep/survey/type/',  //删除对象url
        resultUrl:'/pmpheep/materialSurvey/result', //获取修改信息url

        addTemplateUrl:'/pmpheep/materialSurvey/create', //新增模板url
        editTemplateUrl:'/pmpheep/materialSurvey/create', //修改提交urls
        surveyForm:{          //调研表信息抬头
          templateName:'',
          typeId:'',
          intro:'',
          materialId:'',
          preVersionMaterialRound:'',
          tempReCreat:false,
          allTextbookUsed:false,
          questionAnswerJosn:[
          ]
        },
        tempReCreat:false,
        textbookList:[],
        materialOptions:[],
        del_question:[],
        del_dialog_option:[],
        del_question_option:[],
        objDialogVisible:false,
        isEditObj:false,
        isAddNewObj:true,
        editObjForm:{
          surveyName:'',
          sort:''
        },
        objTableData:[],
        isEditTitle:false,
        editIndex:'',
        isEdit:false,
        dialogOptions:[
          {
            value:'1',
            label:'单选题'
          },
          {
            value:'2',
            label:'多选题'
          },
          {
            value:'4',
            label:'单行文本题'
          },
          {
            value:'5',
            label:'多行文本题'
          },
        ],
        dialogForm:{
          title:'',
          type:'',
          direction:'' ,
          sort:'',
          surveyQuestionOptionList:[
            {
              optionContent:''
            },
            {
              optionContent:''
            },
          ]
        },
        dialogVisible:false,


      }
    },
    created(){
      this.getMaterialLists();
      this.getQuestionResult();
      if(!this.surveyForm.allTextbookUsed&&this.surveyForm.materialId){
        this.getTextbookLists();
      }
      this.getObjList();
    },
    watch:{
      tempReCreat(curVal,oldVal){
        this.surveyForm.tempReCreat = curVal;
        this.surveyForm.templateName = (curVal && !this.surveyForm.templateName)?this.surveyForm.title+'_默认模板_'+this.$commonFun.getNowFormatDate():this.surveyForm.templateName;
      },
    },
    methods:{
      /* 获取对象列表 */
      getObjList(){
        this.$axios.get(this.objListUrl).then((res)=>{
          console.log(res);
          if(res.data.code==1){
            this.objTableData=res.data.data;
          }
        })
      },
      /* 获取问题和答案 */
      getQuestionResult(){
        let surveyId = this.$route.query.surveyId;
        let userId = this.$route.query.userId;
        let userType = this.$route.query.userType;
        this.$axios.get(this.resultUrl,{
          params:{
            surveyId:surveyId,
            userId:userId,
            userType:userType
          }
        }).then((res)=>{
          console.log(res);
          if(res.data.code==1){
            this.initFormData(res.data.data);
          }
        })
      },
      /* 修改初始化 */
      initFormData(surveryOrginalData){
        if(surveryOrginalData){
          var surveyData=surveryOrginalData;
          console.log(surveyData) ;
          //this.surveyForm.templateName=surveyData.survey.templateName;

          this.surveyForm.typeId=surveyData.survey.typeId;
          this.surveyForm.intro=surveyData.survey.intro;
          this.surveyForm.id=surveyData.survey.id?surveyData.survey.id:'';
          this.surveyForm.templateId=surveyData.survey.templateId;
          this.surveyForm.materialId = (surveyData.survey.materialId?surveyData.survey.materialId:"");
          this.surveyForm.preVersionMaterialRound = (surveyData.survey.preVersionMaterialRound !=null?surveyData.survey.preVersionMaterialRound:"");
          this.surveyForm.title=surveyData.survey.title;
          this.surveyForm.requiredForMaterial=surveyData.survey.requiredForMaterial;
          this.surveyForm.allTextbookUsed=surveyData.survey.allTextbookUsed;

          for(var i in surveyData.qestionAndOption){
            this.surveyForm.questionAnswerJosn[i]={};
            this.surveyForm.questionAnswerJosn[i].id=surveyData.qestionAndOption[i].id;
            this.surveyForm.questionAnswerJosn[i].title=surveyData.qestionAndOption[i].title;
            this.surveyForm.questionAnswerJosn[i].type=surveyData.qestionAndOption[i].type+'';
            this.surveyForm.questionAnswerJosn[i].direction=surveyData.qestionAndOption[i].direction;
            this.surveyForm.questionAnswerJosn[i].sort=surveyData.qestionAndOption[i].sort+'';
            this.surveyForm.questionAnswerJosn[i].surveyQuestionOptionList=[];
            this.surveyForm.questionAnswerJosn[i].checkedOptionIdS=surveyData.qestionAndOption[i].checkedOptionIdS?surveyData.qestionAndOption[i].checkedOptionIdS.split(','):[];

            var options=surveyData.qestionAndOption[i].optionContent?surveyData.qestionAndOption[i].optionContent.split('_,_'):[];
            let optionIds=surveyData.qestionAndOption[i].optionIdString?surveyData.qestionAndOption[i].optionIdString.split(','):[];
            for(var t in options){
              this.surveyForm.questionAnswerJosn[i].surveyQuestionOptionList.push(
                {optionContent:options[t],
                  id:(optionIds[t]?optionIds[t].split('-')[0]:null),
                  checked:(optionIds[t]?optionIds[t].split('-')[1]:0),
                }
              )
            }
          }
          console.log(this.surveyForm);
        }
      },

      /**获取教材列表 */
      getMaterialLists(){
        this.$axios.get('/pmpheep/material/published').then(response => {
          let res = response.data;
          if (res.code == '1') {
            this.materialOptions=res.data;
          }
        })
      },
      /**获取教材列表 */
      getTextbookLists(){
        this.$axios.get('/pmpheep/textBook/list/textbooks',{params:{materialId:this.surveyForm.materialId}}).then(response => {
          let res = response.data;
          if (res.code == '1') {
            this.textbookList=res.data;
          }
        })
      },
    }
  };
</script>
<style scoped>
  .add_new_model {
    padding-top:20px;
    overflow: hidden;
  }
  .add_new_model .question_list {
    margin:35px 0;
    padding: 0 20px;
    width: 18%;
    float: left;
    box-sizing: border-box;

  }
  .add_new_model .left_header_p{
    padding:0 30px;
    line-height: 30px;
    float: left;
    background-color: #12806b;
    color:#fff;
    position: relative;
    z-index: 1;
  }
  .add_new_model .left_header_p span{
    height:0px;
    display: block;
    width:0px;
    background-color: #fff;
    border:15px #fff solid;
    border-bottom-color:#fff;
    border-left-color:#12806b;
    border-right-color:#fff;
    position: absolute;
    z-index: 9;
    right: -25px;
    top:0;

  }
  .add_new_model .question_list h4{
    font-size: 16px;
    margin-bottom:20px;
  }
  .add_new_model .question_list ul li{
    margin-bottom:3px;
  }
  .add_new_model .question_list ul li .button{
    width:100%;
  }
  .add_new_model .form_list{
    float: left;
    width:80%;
    margin:35px 0;
    padding-left:35px;
    padding-right:12%;
    /*border-left:1px solid #dadada;*/
    min-height:765px;
    box-sizing: border-box;
  }
  .add_new_model .form_list h3{
    font-size: 18px;
    line-height:36px;
    margin-bottom:20px;
    text-align: center;
  }
  .add_new_model .form_list .form_input{
    width:calc(100% - 120px);
    margin-right:10px;
  }
  .add_new_model .form_list  .form_button{
    color:#337ab7;
  }
  .add_new_model .form_item_dialog .el-dialog{
    min-width:500px;
  }
  .add_new_model .form_item_dialog .dialog_input{
    margin-right:10px;
    width:calc(100% - 60px);
  }
  .add_new_model .form_item_dialog .el-form-item .el-form-item{
    margin-bottom:22px;
  }
  .add_new_model .form_list .bottom_box{
    width:100%;
  }
  .add_new_model .form_list .bottom_box .button_box{
    float: left;
    margin-left:50%;
    transform: translateX(-50%);
  }
</style>
