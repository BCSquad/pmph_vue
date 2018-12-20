<template>
  	<div class="re-issue max-width-1300">
    <!--操作按钮-->
    <div class="clearfix marginT30">
      <div class="operation-wrapper">
        <el-button  type="primary" size="large" class="marginR20" @click="reIssueSubmit">发送</el-button>
      </div>
    </div>
    <!--输入标题-->
    <el-form :model="formData" ref="form" :rules="formRules" label-width="110px">
      <el-form-item label="标题：" prop="title">
        <el-input v-model.trim="formData.title" placeholder="请输入消息标题" class="title-input" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="消息内容：" required>
        <div class="clearfix">
          <Editor ref="editor" :config="editorConfig" :defaultMsg="formData.content"></Editor>
        </div>
      </el-form-item>
    </el-form>

	</div>
</template>

<script>
  import Editor from 'components/Editor.vue'
	export default {
		data() {
			return {
        reIssueUrl:'/pmpheep/survey/target/send/message', //补发消息提交URL
        formData:{
          surveyId:'',
          title:'',
          content:''
        },
        editorConfig: {
          initialFrameWidth: null,
          initialFrameHeight: 500
        },
        formRules:{
          title:[
            { required: true, message: '请输入文章标题', trigger: 'blur,change' },
            {max:50, message: '长度不能超过50个字符', trigger: 'blur,change'}
          ]
        },
      }
		},
    components:{
      Editor,
    },
    methods:{
      /* 点击发送 */
      reIssueSubmit(){
         this.formData.content=this.$refs.editor.getContent();
         if(!this.formData.content){
           this.$confirm("消息内容不能为空", "提示",{
           	confirmButtonText: "确定",
           	cancelButtonText: "取消",
           	showCancelButton: false,
           	type: "error"
           });
           return ;
         }
        this.$axios.post(this.reIssueUrl,this.$commonFun.initPostData(this.formData))
        .then((res)=>{
          console.log(res);
          if(res.data.code==1){
            this.$message.success('消息补发成功');
            this.$router.push({name:'调查问卷模板设置'});
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
    },
    created(){
       if(this.$route.params.surveyId){
           this.formData.surveyId=this.$route.params.surveyId;
           this.formData.title=this.$route.params.title;
       }else{
         this.$router.push({name:'调查问卷模板设置'});
       }
    },
	}
</script>

<style scoped>
  a {
    color: #2773c1;
    cursor: pointer;
    margin-left: 5px;
  }
  .title-input{
    width: 60%;
    max-width: 600px;
  }
  .max-width-1300{
    max-width: 1300px;
  }
  .material-notice{
    max-width: 1040px;
    margin: 0 auto;
    padding: 0 30px;
    color:#000;
  }
  .material-notice p,.fileLink p{min-height: 19px;margin: 5px 0;}
  .material-notice-title{
    font-size: 24px;
    color: #333333;
  }
  .material-notice-time{
    color: #bdbdbd;
    padding-top: 10px;
  }
</style>
