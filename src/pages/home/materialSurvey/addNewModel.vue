<template>
  <div class="add_new_model">
      <div style="width:100%;float:left;">
        <el-button v-if="$route.params.type=='check'" lass="back_button" style="float: right;margin-right: 1em;" type="primary" icon="arrow-left" @click="$router.go(-1)">返回上一步</el-button>
        <p class="left_header_p">
         调研表信息
       <span></span>
       </p>
       </div>
      <div style="width:100%;float:left;">
      <el-form :model="surveyForm" ref="surveyForm" :rules="$route.params.type!='check'?rules:{}"   label-width="120px" style="margin:30px 0;width:80%;">
          <el-form-item label="调研表名称:" prop="templateName" >
             <el-input placeholder="请输入调研表名称" :disabled="$route.params.type=='check'" v-model="surveyForm.templateName" style="width:100%"></el-input>
          </el-form-item>
          <el-form-item label="调研对象:" prop="typeId">
             <el-select v-model="surveyForm.typeId" :disabled="$route.params.type=='check'"  placeholder="请选择调研对象">
                    <el-option
                    v-for="item in objTableData"
                    :key="item.id"
                    :label="item.surveyName"
                    :value="item.id">
                    </el-option>
                </el-select>
                <!--<el-button type="text" style="margin-left:10px;color:#337ab7" v-if="$route.params.type!='check'"  @click="objDialogVisible=true">编辑调研对象</el-button>-->
          </el-form-item>
          <el-form-item label="调研概述:" prop="intro">
             <el-input type="textarea" :rows="3" v-model="surveyForm.intro" :disabled="$route.params.type=='check'" placeholder="调研概述"></el-input>
          </el-form-item>
          <!--<el-form-item label="调研教材:" prop="preVersionMaterialId" >
            <el-select v-model="surveyForm.preVersionMaterialId" clearable filterable :defaultFirstOption="false" placeholder="请选择调研教材" style="width:60%;">
              <el-option
                v-for="item in materialOptions"
                :key="item.id"
                :label="item.materialName"
                :value="item.id">
              </el-option>
            </el-select>
            <el-form-item label="调研教材版次:" prop="preVersionMaterialRound" style="width:39%;display: inline-block;float: right;">
              <el-input type="text"  v-model="surveyForm.preVersionMaterialRound"  placeholder="版次"></el-input>
            </el-form-item>
          </el-form-item>-->

      </el-form>
      <!-- 调研对象弹框 -->
     <el-dialog :visible.sync="objDialogVisible" title="调研类型（对象）列表" size="tiny" class="obj_dialog table-wrapper">
        <p style="overflow:hidden;">
            <el-button type="primary" style="float:right" @click="addObjInfo">增加对象</el-button>
        </p>
            <el-table class="table-wrapper" :data="objTableData" border>
                <el-table-column  label="对象名称" prop="surveyName">
                </el-table-column>
                <el-table-column  label="显示顺序" prop="sort" width="100">
                </el-table-column>
                <el-table-column  label="操作" width="110">
                    <template scope="scope">
                        <el-button type="text" @click="editObjInfo(scope.row)">修改</el-button>
                        <el-button type="text" @click="deleteObjInfo(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
     </el-dialog>

  <!-- 增加/修改 对象弹框 -->
        <el-dialog title="新增对象" :visible.sync="isEditObj"   class="obj_dialog" size="tiny">
            <div style="padding-right:30px;" >
                <el-form ref="editObjForm" :model="editObjForm" :rules="rules"  label-width="100px">
                    <el-form-item label="对象名称：" prop="surveyName">
                        <el-input  placeholder="请输入对象名称" v-model="editObjForm.surveyName"></el-input>
                    </el-form-item>
                    <el-form-item label="显示顺序：" prop="sort" >
                        <el-input  placeholder="请输入数字" v-model="editObjForm.sort"> </el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="submitObjEdit()">确 定</el-button>
              <el-button @click="isEditObj=false">取 消</el-button>
            </span>
        </el-dialog>


      <p class="left_header_p">
         调研内容
       <span></span>
       </p>
       </div>
    <div class="question_list" v-if="$route.params.type!='check'">
       <h4>题目控件</h4>
      <ul >
        <li>
            <el-button type="primary" class="button" @click="addNewFormItem('1')">单选题</el-button>
        </li>
        <li>
            <el-button type="primary" class="button" @click="addNewFormItem('2')">多选题</el-button>
        </li>
        <!-- <li>
            <el-button type="primary" class="button" @click="addNewFormItem(3)">下拉题</el-button>
        </li> -->
        <li>
            <el-button type="primary" class="button" @click="addNewFormItem('4')">单行文本题</el-button>
        </li>
         <li>
            <el-button type="primary" class="button" @click="addNewFormItem('5')">多行文本题</el-button>
        </li>
         <!-- <li>
            <el-button type="primary" class="button" @click="addNewFormItem(6)">附件内容题</el-button>
        </li> -->
        </ul>
      </div>
      <!-- 表单列表 -->
      <div class="form_list">
         <h3 v-if="surveyForm.questionAnswerJosn.length==0">题目为空，请在左侧选择题目添加</h3>
         <el-form  ref="form" label-width="100px" label-position="top">

           <el-form-item :label="item.sort+'.'+item.title" v-for="(item,index) in surveyForm.questionAnswerJosn" :key="index">
               <!-- 单选 -->
                <el-radio-group  v-if="item.type==1">
                    <el-radio :label="it.optionContent" v-for="(it,index) in item.surveyQuestionOptionList" :key="index">{{it.optionContent}}</el-radio>
                </el-radio-group>
                <!-- 多选 -->
                <el-checkbox-group   v-if="item.type==2" style="float:left;">
                    <el-checkbox :label="it.optionContent" v-for="(it,index) in item.surveyQuestionOptionList" :key="index">{{it.optionContent}}</el-checkbox>
                </el-checkbox-group>
                <!-- 单行文本 -->
                <el-input  class="form_input" v-if="item.type==4"></el-input>
                <!-- 多行文本 -->
                <el-input   type="textarea" :rows="3" class="form_input" v-if="item.type==5"></el-input>
                <!-- 操作按钮 -->
                <el-button type="text" class="form_button" style="margin-left:15px;" v-if="$route.params.type!='check'"  @click="editFormItem(item,index)">修改</el-button>
                <el-button type="text" class="form_button"  v-if="$route.params.type!='check'" @click="deleteFormItem(index)">删除</el-button>
            </el-form-item>
         </el-form>

         <div class="bottom_box" v-if="surveyForm.questionAnswerJosn.length!=0&&$route.params.type!='check'">
             <div class="button_box">
                 <el-button @click="$router.go(-1)">返回</el-button>
                 <el-button type="primary" @click="submitTemplate">确定</el-button>
             </div>
         </div>
      </div>

      <!-- 添加 修改弹窗 -->
      <el-dialog  :title="isEdit?'修改问题':'新增问题'" :visible.sync="dialogVisible" size="tiny" class="form_item_dialog" :beforeClose="reloadDialog">
           <el-form :model="dialogForm" ref="dialogForm"  :rules="dialogRules" label-width="70px">
               <el-form-item label="题目：" prop="title">
                   <el-input placeholder="请输入题目" v-model="dialogForm.title"></el-input>
               </el-form-item>
               <el-form-item label="序号：" prop="sort">
                   <el-input placeholder="请输入序号" v-model="dialogForm.sort"></el-input>
               </el-form-item>
               <el-form-item label="备注：" v-if="dialogForm.type!=1&&dialogForm.type!=2" prop="direction">
                   <el-input placeholder="请输入备注" v-model="dialogForm.direction"></el-input>
               </el-form-item>
               <el-form-item label="类型：" prop="type">
                   <el-select v-model="dialogForm.type" placeholder="请选择题目类型" >
                    <el-option
                        v-for="item in dialogOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                   </el-select>
               </el-form-item>
               <!-- <el-form-item label="必填：">
                   <el-radio-group >
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>
                    </el-radio-group>
               </el-form-item> -->
               <el-form-item label="选项：" v-if="dialogForm.type!=4&&dialogForm.type!=5" required>
                   <el-form :model="item" v-for="(item,index) in dialogForm.surveyQuestionOptionList" :rules="dialogRules" :ref="'dialog'+index" :key="index">
                     <el-form-item label-width="0"  prop="optionContent" >
                        <el-input placeholder="请输入选项" class="dialog_input" v-model="item.optionContent"></el-input>
                        <el-button type="text"  style="color:#ff4949" @click="deleteDlalogOption(index)">删除</el-button>
                     </el-form-item>
                    </el-form>
                 <!-- <el-form-item label-width="0">
                    <el-input placeholder="请输入选项" class="dialog_input"></el-input>
                    <el-button type="text"  style="color:#ff4949">删除</el-button>
                 </el-form-item>
                 <el-form-item label-width="0">
                    <el-input placeholder="请输入选项" class="dialog_input"></el-input>
                    <el-button type="text"  style="color:#ff4949">删除</el-button>
                 </el-form-item> -->

                   <el-button type="primary" size="small" @click="addDialogOption">添加选项</el-button>

               </el-form-item>
           </el-form>
         <span slot="footer" class="dialog-footer">

           <el-button type="primary" @click="upLoadFormItem">确 定</el-button>
           <el-button @click="dialogVisible = false;reloadDialog(function(){});">取 消</el-button>
         </span>
      </el-dialog>
  </div>
</template>
<script type="text/javascript">
export default {
  data() {
    return {
        objListUrl:'/pmpheep/materialSurvey/type/list',   //调研对象列表url
        addNewObjUrl:'/pmpheep/survey/type/create', //添加新对象url
        editObjUrl:'/pmpheep/survey/type/update',  //修改对象url
        deleteObjUrl:'/pmpheep/survey/type/',  //删除对象url
        addTemplateUrl:'/pmpheep/materialSurvey/template/create', //新增模板url
        editTemplateUrl:'/pmpheep/materialSurvey/template/create', //修改提交urls
        surveyForm:{          //调研表信息抬头
          templateName:'',
          typeId:'',
          intro:'',
          preVersionMaterialId:'',
          preVersionMaterialRound:'',
          questionAnswerJosn:[
          ]
        },
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
        rules:{
            templateName:[
               { required: true, message: '请输入调研表名称', trigger: 'blur' },
               {min:1,max:50,message:'调研表名称不能超过50个字符',trigger:'change,blur'}
            ],
            typeId:[
                {type:'number', required: true, message: '请选择调研对象', trigger: 'blur' },
            ],
            intro:[
                { required: true, message: '请输入调研概述', trigger: 'blur' },
                {min:1,max:200,message:'概述不能超过200个字符',trigger:'change,blur'}
            ],
            surveyName:[
                { required: true, message: '请输入对象名称', trigger: 'blur' },
                {min:1,max:20,message:'对象名称不能超过20个字符',trigger:'change,blur'}
            ],
            sort:[
                { min:1,max:10, message: "显示顺序不能超过10个字符", trigger: "change,blur" },
                {validator:this.$formCheckedRules.numberChecked,trigger: "blur"}
            ],

        },
        dialogRules:{
             title:[
                 { required: true, message: '请输入题目', trigger: 'blur' },
                 {min:1,max:200,message:'题目不能超过200个字符',trigger:'change,blur'}
             ],
             sort:[
                 { min:1,max:10, message: "序号不能超过10个字符", trigger: "change,blur" },
                 {validator:this.$formCheckedRules.numberChecked,trigger: "blur"}
             ],
             type:[
                 { required: true, message: '请选择题目类型', trigger: 'blur' },
             ],
             optionContent:[
                 { required: true, message: '请输入选项', trigger: 'blur' },
                 {min:1,max:200,message:'选项不能超过200个字符',trigger:'change,blur'}
             ],
             direction:[
                  {min:0,max:100,message:'备注不能超过100个字符',trigger:'change,blur'}
             ]

        }

    }
  },
  created(){
      this.getMaterialLists();
      this.initFormData();
      this.getObjList();
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
      /* 修改初始化 */
      initFormData(){
       if(this.$route.params.type!='add'&&this.$route.params.surveryData){
           var surveyData=this.$route.params.surveryData;
          console.log(surveyData) ;
          this.surveyForm.templateName=surveyData.survey.templateName;
          this.surveyForm.typeId=surveyData.survey.typeId;
          this.surveyForm.intro=surveyData.survey.intro;
          this.surveyForm.id=surveyData.survey.id;
          this.surveyForm.templateId=surveyData.survey.id;
          this.surveyForm.preVersionMaterialId = (surveyData.survey.preVersionMaterialId?surveyData.survey.preVersionMaterialId:"");
          this.surveyForm.preVersionMaterialRound = (surveyData.survey.preVersionMaterialRound !=null?surveyData.survey.preVersionMaterialRound:"");

          for(var i in surveyData.qestionAndOption){
              this.surveyForm.questionAnswerJosn[i]={};
              this.surveyForm.questionAnswerJosn[i].id=surveyData.qestionAndOption[i].id;
              this.surveyForm.questionAnswerJosn[i].title=surveyData.qestionAndOption[i].title;
              this.surveyForm.questionAnswerJosn[i].type=surveyData.qestionAndOption[i].type+'';
              this.surveyForm.questionAnswerJosn[i].direction=surveyData.qestionAndOption[i].direction;
              this.surveyForm.questionAnswerJosn[i].sort=surveyData.qestionAndOption[i].sort+'';
              this.surveyForm.questionAnswerJosn[i].surveyQuestionOptionList=[];
              var options=surveyData.qestionAndOption[i].optionContent?surveyData.qestionAndOption[i].optionContent.split(','):[];
              let optionIds=surveyData.qestionAndOption[i].optionIdString?surveyData.qestionAndOption[i].optionIdString.split(','):[];
              for(var t in options){
                 this.surveyForm.questionAnswerJosn[i].surveyQuestionOptionList.push(
                     {optionContent:options[t],id:optionIds[t]}
                     )
              }
          }
          console.log(this.surveyForm);
       }
      },
      /* 确定提交按钮 */
      submitTemplate(){
       if(this.$route.params.surveryData&&this.$route.params.typ!=='add'){
          this.updateTemplate('edit');
       }
       else{
          this.updateTemplate('add');
       }
      },
      /* 新增或修改 */
      updateTemplate(str){
        str = 'add';
         this.$refs.surveyForm.validate((valid)=>{
             if(valid){
          var arr=[];
          for(var i in this.surveyForm.questionAnswerJosn){
              arr[i]=this.surveyForm.questionAnswerJosn[i];
              this.surveyForm.questionAnswerJosn[i]=JSON.stringify(this.surveyForm.questionAnswerJosn[i]);
          }
          this.surveyForm.questionAnswerJosn='['+this.surveyForm.questionAnswerJosn+']';
          this.surveyForm.del_question = JSON.stringify(this.del_question);
          this.surveyForm.del_question_option = JSON.stringify(this.del_question_option);
                    this.$axios(
                        {
                            url:str=='add'?this.addTemplateUrl:this.editTemplateUrl,
                            method: str=='add'?'POST':'PUT',
                            data:this.$commonFun.initPostData(this.surveyForm)
                    }).then((res)=>{
                        console.log(res);
                        console.log(this.surveyForm.questionAnswerJosn,arr);
                        if(res.data.code==1){
                        this.$message.success(str=='add'?'添加成功':'修改成功');
                        this.$router.push({name:'调研表模板管理'});

                        }else{
                            this.$confirm(res.data.msg.msgTrim(), "提示",{
                            	confirmButtonText: "确定",
                            	cancelButtonText: "取消",
                            	showCancelButton: false,
                            	type: "error"
                            });
                        }
                    })
                    this.surveyForm.questionAnswerJosn=arr;

             }else{
                 return false;
             }
         })
      },
      /* 新增对象 */
      addObjInfo(){
       this.editObjForm={
           surveyName:'',
           sort:''
        }
        this.isAddNewObj=true;
        this.isEditObj=true;
      },
      /* 修改对象 */
      editObjInfo(obj){
       for(var i in obj){
         this.editObjForm[i]=obj[i]+'';
       }
       this.isAddNewObj=false;
       this.isEditObj=true;
      },
      /* 删除对象 */
      deleteObjInfo(obj){
       this.$confirm('确认删除该对象?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
            this.$axios.delete(this.deleteObjUrl+obj.id+'/remove').then((res)=>{
                if(res.data.code==1){
                    this.isEditObj=false;
                   this.objDialogVisible=false;
                    this.getObjList();
                    this.$message.success('删除成功')
                }else{
                    this.$confirm(res.data.msg.msgTrim(), "提示",{
                    	confirmButtonText: "确定",
                    	cancelButtonText: "取消",
                    	showCancelButton: false,
                    	type: "error"
                    });
                }
            })
        }).catch(() => {
          /*this.$message({
            type: 'info',
            message: '已取消删除'
          });*/
        });
      },
      /* 提交对象编辑 */
      submitObjEdit(){
          this.$refs.editObjForm.validate((valid) => {
           if(valid){
                if(this.isAddNewObj){
                    this.$axios.post(this.addNewObjUrl,
                        this.$commonFun.initPostData(this.editObjForm)
                    ).then((res)=>{
                        console.log(res);
                        if(res.data.code==1){
                        this.isEditObj=false;
                        this.getObjList();
                        this.$message.success('新增成功');
                        }else{
                            this.$confirm(res.data.msg.msgTrim(), "提示",{
                            	confirmButtonText: "确定",
                            	cancelButtonText: "取消",
                            	showCancelButton: false,
                            	type: "error"
                            });
                        }
                    })
                }else{
                    this.$axios.put(this.editObjUrl,
                    this.$commonFun.initPostData(this.editObjForm)
                    ).then((res)=>{
                        console.log(res);
                        if(res.data.code==1){
                        this.isEditObj=false;
                        this.getObjList();
                        this.$message.success('修改成功');
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
           }else{
               return false;
           }
          })

      },
      /* 添加题目 */
      addNewFormItem(i){
          this.isEdit=false;
          this.dialogForm.type=i;
          this.dialogVisible=true;
      },
      /* 对话框 选项删除 */
      deleteDlalogOption(i){

        let delOption = this.dialogForm.surveyQuestionOptionList[i];
        if(delOption.id){
          delOption.isDeleted = 1;
          this.del_dialog_option.push(delOption);
        }
        this.dialogForm.surveyQuestionOptionList.splice(i,1);
      },
      /* 添加对话框选项 */
      addDialogOption(){
          console.log(this.dialogForm);
         this.dialogForm.surveyQuestionOptionList.push({optionContent:''});
      },
      /* 修改表单项 */
      editFormItem(item,index){
          this.isEdit=true;
          this.editIndex=index;
          //数组对象深克隆 对话框临时表单从当前打开选项数组克隆一份，而非直接=赋值，否则对象同指针，修改后点取消也无法消除影响
          this.dialogForm = this.$commonFun.objArrayDeepCopy(item);
          this.dialogVisible=true;
      },
      /* 删除表单项1 */
      deleteFormItem(index){
        let delForm = this.surveyForm.questionAnswerJosn[index];
        if(delForm.id){
          delForm.isDeleted = 1;
          this.del_question.push(delForm);
        }
        this.surveyForm.questionAnswerJosn.splice(index,1);
      },
      /* 弹框表单验证 */
      dialogValid(){
          var isPass=true;
          console.log(this.dialogForm);
          if(this.dialogForm.type==1||this.dialogForm.type==2){
          for(var i in this.dialogForm.surveyQuestionOptionList){
              var str='dialog'+i;
              this.$refs[str][0].validate((valid)=>{
                 if(!valid){
                     isPass=false;
                 }
              })

          }
          }
          return isPass;
      },
      /* 确定添加题目 */
      upLoadFormItem(){
         this.dialogValid();
        this.$refs.dialogForm.validate((valid)=>{
              if(valid&&this.dialogValid()){
                this.del_question_option = this.del_question_option.concat(this.del_dialog_option) ;
                    if(this.isEdit){
                        this.surveyForm.questionAnswerJosn[this.editIndex]=this.dialogForm;
                    }else{
                        if(this.checkOrderNumber(this.dialogForm)){
                         this.surveyForm.questionAnswerJosn.push(this.dialogForm);
                        }else{
                            this.$confirm('该问题序号已存在', "提示",{
                              confirmButtonText: "确定",
                              cancelButtonText: "取消",
                              showCancelButton: false,
                              type: "error"
                            });
                            return ;
                        }
                    }
                this.dialogForm={
                            title:'',
                            type:'',
                            direction:'',
                            sort:'',
                            surveyQuestionOptionList:[
                                {
                                    optionContent:''
                                },
                                {
                                    optionContent:''
                                },
                            ]
                            }
                this.dialogVisible=false;
            }else{
                return false;
            }
          })

      },
      /* 清空dialog */
      reloadDialog(done){
        this.dialogForm={
                    title:'',
                    type:'',
                    direction:'',
                    sort:'',
                    surveyQuestionOptionList:[
                        /*{
                            optionContent:''
                        },
                        {
                            optionContent:''
                        },*/
                    ]
                    };
        this.del_dialog_option = [];
                    done();
      },
      /* 核验问题序号 */
      checkOrderNumber(obj){
       for(var i in this.surveyForm.questionAnswerJosn){
           if(obj.sort==this.surveyForm.questionAnswerJosn[i].sort && !this.surveyForm.questionAnswerJosn[i].isDeleted){
               return false;
           }
       }
       return true;
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
   border-left:1px solid #dadada;
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
label.el-checkbox {
  margin-left: 15px;
}
label.el-radio {
  margin-left: 15px;
  line-height: 36px;
}
</style>
