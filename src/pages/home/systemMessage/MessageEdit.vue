<template>
  <div class="message-edit">

    <div class="nextStep-wrapper text-right">
      <el-button type="primary" @click="back">返回</el-button>
      <el-button type="primary" @click="preview">预览</el-button>
      <el-button type="primary" @click="nextStep()" v-if="currentMessageType!='edit'">下一步</el-button>
      <el-button type="primary" @click="editSave()" v-if="currentMessageType=='edit'">保存</el-button>
    </div>
    <!--输入标题-->
    <el-form :model="messageForm" ref="messageForm" :rules="messageRules" label-width="110px">
      <el-form-item label="消息标题：" prop="title">
           <el-input v-model="messageForm.title" placeholder="请输入标题" class="message-title-input"></el-input>
      </el-form-item>
      <el-form-item label="发送对象：" prop="sendType" v-if="currentMessageType!='edit'">
           <el-radio-group v-model="messageForm.sendType">
            <el-radio :label="1">学校管理员</el-radio>
            <el-radio :label="2">所有人</el-radio>
            <el-radio :label="3">特定对象</el-radio>
            <el-radio :label="4">教材报名者</el-radio>
          </el-radio-group>
      </el-form-item>
      <el-form-item label="消息内容：" required>
        <el-input v-model="messageForm.title" class="none"></el-input>
        <div class="clearfix">
          <Editor ref="editor" :config="editorConfig"></Editor>
        </div>
      </el-form-item>
      <!--分割线-->
      <!--<el-form-item>
          <el-row>
        <div class="cutLine-dashed" style="width:100%;margin-left:0;"></div>
    </el-row>
      </el-form-item>-->
    <el-form-item label="附件：" prop="fileList">
        <div class="col-content file-upload-wrapper" style="padding-left:0;" >
          <my-upload
            class="upload-demo"
            :action="fileUploadUrl"
            :on-success="upLoadFileSuccess"
            :on-remove="uploadFileRemove"
            :before-upload="beforeUpload"
            :file-list="uploadFileList">
                  <span>
              <i class="fa fa-paperclip fa-lg"></i> 添加附件</span>
            <div slot="tip" class="el-upload__tip" style="line-height:1;">文件大小不超过100M</div>
          </my-upload>
        </div>
    </el-form-item>
    </el-form>


    <!--预览弹窗-->
    <el-dialog
      :visible.sync="previewShow"
      size="large">
      <message-detail :msgData="previewData" readOnly></message-detail>
    </el-dialog>
  </div>
</template>
<script>
import Editor from 'components/Editor.vue'
import messageDetail from 'components/message-detail'
export default {
  data: function() {
    return {
      fileUploadUrl:'/pmpheep/messages/message/file',
      currentMessageType:'add',
      currentMessageId:undefined,
      messageForm:{
        title:'',
        content:'',
        sendType:1,
        originalFileList:[],
        filePathList:[],
        removeFile:[],
      },
      messageRules:{
       title:[
          { required: true, message: '请输入标题', trigger: 'blur' },
          {max:50, message: '标题不能超过50个字符', trigger: 'change,blur'}
       ],
       sendType:[
          {type: 'number', required: true, message: '请选择发送对象', trigger: 'change' },
       ],
       fileList:[
        /*  { type: 'array', required: true, message: '请至少上传一个附件', trigger: 'change' } */
       ]

      },
      previewShow: false,
      editorConfig: {
          initialFrameWidth: null,
          initialFrameHeight: 500
      },
      uploadFileList:[],
    }
  },
  computed:{
    previewData(){
      var data = {};
      data.title = this.messageForm.title;
      data.content = this.messageForm.content;
      data.senderName = this.$getUserData().userInfo.realname;
      data.sendTime = this.$commonFun.getNowFormatDate();
      data.files = [];
      this.messageForm.originalFileList.forEach(iterm=>{
        data.files.push(iterm);
      });
      this.messageForm.filePathList.forEach(iterm=>{
        data.files.push(iterm);
      });

      return data;
    },
    currentUserInfo(){
      return this.$getUserData().userInfo;
    },
  },
  methods: {
    /**
     * 添加上传文件
     */
    upLoadFileSuccess(response, file, fileList){
      this.saveFilesToMessageForm(fileList);
    },
    /**
     * 上传之前检验
     */
    beforeUpload(file){

      const ext = file.name.substring(file.name.lastIndexOf('.')+1);
      console.log(file)
      const isLt0M = 0 < file.size / 1024 / 1024 && file.size / 1024 / 1024<100;
      const nameLen = file.name.length <= 50;
      if (file.size / 1024 / 1024==0) {
        this.$confirm('文件大小不能为0kb!', "提示",{
        	confirmButtonText: "确定",
        	cancelButtonText: "取消",
        	showCancelButton: false,
        	type: "error"
        });
      }
      if (file.size / 1024 / 1024>100) {
        this.$confirm('文件上传最大为100M！', "提示",{
        	confirmButtonText: "确定",
        	cancelButtonText: "取消",
        	showCancelButton: false,
        	type: "error"
        });
      }
      if (ext=='exe'||ext=='bat'||ext=='com'||ext=='lnk'||ext=='pif') {
        this.$confirm('请勿上传可执行文件!', "提示",{
        	confirmButtonText: "确定",
        	cancelButtonText: "取消",
        	showCancelButton: false,
        	type: "error"
        });
      }
      if (!nameLen) {
        this.$confirm('文件名称不能超过50个字符!', "提示",{
        	confirmButtonText: "确定",
        	cancelButtonText: "取消",
        	showCancelButton: false,
        	type: "error"
        });
      }
      return isLt0M&&nameLen&&!(ext=='exe'||ext=='bat'||ext=='com'||ext=='lnk'||ext=='pif')
    },
    /**
     * 移除已添加文件
     */
    uploadFileRemove(file, fileList){
      this.saveFilesToMessageForm(fileList);
      if(!file.response){
        this.messageForm.removeFile.push(file.fileId);
      }
    },
    saveFilesToMessageForm(fileList){
      fileList = fileList||[];
      //将文件列表信息存入messageForm里
      var tempNewFileList = [];
      var tempOldFileList = [];
      fileList.forEach(iterm=>{
        var temp
        if(iterm.response){
          if(iterm.response.code==1){
            temp = iterm;
            temp.path = iterm.response.data;
            tempNewFileList.push(temp);
          }
        }else{
          tempOldFileList.push(iterm)
        }
      });
      this.messageForm.originalFileList = tempOldFileList;
      this.messageForm.filePathList = tempNewFileList;
    },
    preview() {
      this.messageForm.content = this.$refs.editor.getContent();
      this.previewShow = true;
    },
    /**
     * 点击下一步
     */
    nextStep(){
      if(!this.$refs.editor.getContent()){
        this.$confirm('内容不能为空', "提示",{
        	confirmButtonText: "确定",
        	cancelButtonText: "取消",
        	showCancelButton: false,
        	type: "error"
        });
        return;
      }
      this.$refs['messageForm'].validate((valid) => {
          if (valid) {
            this.messageForm.content = this.$refs.editor.getContent();
            console.log(this.$refs.editor.getContent())
             switch(this.messageForm.sendType){
                case 1:
                  this.$router.push({name:'选择学校',query:{type:'new'},params:this.messageForm});
                  break;
                case 2:
                  this.$router.push({name:'选择学校',query:{type:'new'},params:this.messageForm});
                  break;
                case 3:
                  this.$router.push({name:'特定对象',query:{type:'new'},params:this.messageForm});
                  break;
                case 4:
                  this.$router.push({name:'教材报名者',query:{type:'new'},params:this.messageForm});
                  break;
                dafault:
                  this.$message({
                    type: 'error',
                    message: '请选择发送对象'
                  });
              }
          } else {

            return false;
          }
        });
    },
    /**
     * 编辑消息时请求当前消息的数据
     */
    getCurrentMessageData(){
      if(!this.$route.query.id){
        return;
      }
      this.$axios.get('/pmpheep/messages/message/content',{params:{
        userMsgId:this.$route.query.id
      }})
        .then(response=>{
          let res = response.data;
          //初始化title
          this.messageForm.title=res.data.title;
          //初始化message 数据，将内容填充到相应位置
          this.$refs.editor.setContent(res.data.content);
          //将已上传文件push到上传组件文件列表中
          res.data.MessageAttachment.forEach(iterm=>{
            iterm.fileId = iterm.attachment.split('/file/download/')[1];
            iterm.attachment = this.$config.BASE_URL + iterm.attachment.substring(1);
            iterm.name = iterm.attachmentName;
          });
          this.messageForm.originalFileList = res.data.MessageAttachment;
          this.uploadFileList = res.data.MessageAttachment;
        })
        .catch(e=>{
          console.log(e);
          this.$confirm('获取当前系统消息失败！', "提示",{
          	confirmButtonText: "确定",
          	cancelButtonText: "取消",
          	showCancelButton: false,
          	type: "error"
          });
        })
    },
    /**
     * 点击修改进入编辑消息后保存
     */
    editSave(){
      this.$refs['messageForm'].validate((valid)=>{
          if(valid){
            console.log(this.messageForm);
      let filePath = [];
      this.messageForm.filePathList.forEach(iterm=>{
        filePath.push(iterm.path);
      });
      this.messageForm.content = this.$refs.editor.getContent();
      this.$axios.put('/pmpheep/messages/updateMessage',this.$commonFun.initPostData({
        msgId:this.currentMessageId,
        msgTitle:this.messageForm.title,
        content:this.messageForm.content,
        file:filePath.join(','),
        attachment:this.messageForm.removeFile.join(',')
      }))
        .then(response=>{
          let res = response.data;
          if(res.code==1){
            this.$message.success('修改成功！');
            this.$router.push({name: '消息列表'});
          }else{
            this.$confirm(res.msg.msgTrim(), "提示",{
            	confirmButtonText: "确定",
            	cancelButtonText: "取消",
            	showCancelButton: false,
            	type: "error"
            });
          }
        })
        .catch(e=>{
          console.log(e);
          this.$confirm('提交失败，请重试！', "提示",{
          	confirmButtonText: "确定",
          	cancelButtonText: "取消",
          	showCancelButton: false,
          	type: "error"
          });
        })
          }
      })

    },
    /**
     * 由选择发送对象页面返回编辑页面，需要将原有内容插入编辑器中，供再次编辑
     * 内容参数由路由钩子获取
     */
    reEditMessage(message){
      if(!message.title){
        return;
      }
      for(let key in this.messageForm){
        this.messageForm[key] = message[key]
      }
      //将content插入编辑器
      this.$refs.editor.setContent(this.messageForm.content);
      //将已有文件插入列表
      this.messageForm.originalFileList.forEach(iterm=>{
        this.uploadFileList.push(iterm);
      });
      this.messageForm.filePathList.forEach(iterm=>{
        this.uploadFileList.push(iterm);
      });
    },
    back(){
      this.$router.push({name: '消息列表'})
    }
  },
  components:{
    Editor,
    messageDetail
  },
  mounted(){
    var routerParams = this.$route.params;
    this.currentMessageType = this.$route.query.type;
    this.currentMessageId = this.$route.query.messageId;
    if(this.currentMessageType=='edit'&&this.currentMessageId){
      this.getCurrentMessageData()
    }
    if(this.currentMessageType=='reEdit'){
      setTimeout(()=>{
        this.reEditMessage(routerParams)
      },1000)

    }
  },
  beforeDestroyed(){
    this.$refs.editor.destroy();
  }
}
</script>

<style scoped>
.message-edit {
  max-width: 1580px;
}

.message-edit .el-row {
  margin-bottom: 24px;
}

.message-edit .col-content {
  padding: 0 0 0 16px;
}

.message-edit .text-right .col-content {
  padding: 0 16px 0 0;
}

.lineHeight-36 {
  line-height: 36px;
}

.message-title-input {
  width: 60%;
  max-width: 600px;
}

.cutLine-dashed {
  width: auto;
  margin-top: 28px;
  margin-left: 16px;
}

.file-upload-wrapper {
  width: 60%;
  max-width: 240px;
}

.nextStep-wrapper {
  padding-right: 48px;
}
/*预览弹窗样式*/
.message-preview{
  max-width: 1060px;
  margin: 0 auto;
  min-height: 400px;
}
.previewTitle{
  color: #14232e;
  font-size: 22px;
  font-weight: 500;
}
.previewContent{
  margin-top: 48px;
}
.previewFile>span{
  display: block;
  color: #337ab7;
  margin: 0 0 10px;
}
.fontSize-16{
  font-size: 16px;
}
  .message-preview img{
    max-width: 100%;
  }
</style>
