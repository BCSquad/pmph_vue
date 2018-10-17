<template>
  <div class="common_edit">
    <div class="top-nav">
	  <div class="header_title_tips">
        <p >操作手册上传</p>
        <div class="tips_icon"></div>
      </div>
	</div>
      <!-- 表单 -->
    <div style="margin-top:20px;padding:0 50px 0 0;">
      <el-form :model="formData" ref="formData" :rules="rules"  label-width="140px">
         <el-form-item label="文档名称：" prop="manualName">
             <el-input  placeholder="请输入问题标题" v-model="formData.manualName" style="width:30%"></el-input>
         </el-form-item>
         <el-form-item label="文档附件：" prop="fileList">
          <el-upload
            class="upload-demo"
            style="float:left"
            action="pmpheep/file/image/upload"
            :on-success="fileUploadSuccess"
            :on-remove="fileUploadRemove"
            :before-upload="fileBeforeUpload"
            :file-list="formData.fileList"
            >
            <el-button size="small" type="primary">选择文件</el-button>
          </el-upload>
         </el-form-item >
         <el-form-item label="备注："  prop="note">
             <el-input  type="textarea" :rows="4" v-model="formData.note"></el-input>
         </el-form-item>
      </el-form>
     </div>
     <div class="overflow:hidden;">
   <div class="bottom_button">
       <el-button type="primary" @click="submit">发布</el-button>
       <el-button type="primary" @click="$router.push({name:'帮助管理',params:{activeName:'second'}})">返回</el-button>
    </div>
   </div>
  </div>
</template>
<script type="text/javascript">
    export default{
        data(){
            return{
              addOperationUrl:'/pmpheep/cms/new/manual',    //提交添加操作url
             formData:{
               manualName:'',
               fileList:[],
               attachment:'',
               note:''

             },
             rules:{
               manualName:[
                 { required: true, message: "请输入文档名称", trigger: "blur" },
                 {min:1,max:100,message:'文档名称不能超过100个字符',trigger: "blur,change" }
               ],
               note:[
                 /*{ required: true, message: "备注不能为空", trigger: "blur" },*/
                 {min:0,max:100,message:'备注不能超过100个字符',trigger: "blur,change" }
               ],
               fileList:[
                 { type: 'array', required: true, message: '请上传附件', trigger: 'change' }
               ]
             }
            }
        },
        created(){
           if(!this.$route.params.type) {
             this.$router.push({name:'帮助管理',activeName:'second'});
           }
        },
        methods:{
          /* 提交 */
          submit(){
          this.$refs.formData.validate((valid)=>{
            if(valid){
               this.$axios.post(this.addOperationUrl,this.$commonFun.initPostData({
                 manualName:this.formData.manualName,
                 attachment:this.formData.fileList[0].response.data,
                 note:this.formData.note,
                 userId:this.$getUserData().userInfo.id
               })).then((res)=>{
                 if(res.data.code==1){
                   this.$message.success('添加成功');
                   this.$router.push({name:'帮助管理',params:{activeName:'second'}});
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
              return;
            }
          })
          },
          /* 文件上传 */
          fileUploadSuccess(res,file,filelist){
            console.log(res,file,filelist);
             this.formData.fileList=[];
             this.formData.fileList.push(file);
             this.$refs.formData.validateField('fileList');
          },
          fileUploadRemove(file,filelist){
            this.formData.fileList=filelist;
            this.$refs.formData.validateField('fileList');
          },
          fileBeforeUpload(file){
            const isLt100M = file.size / 1024 / 1024 <= 100;
            if (!isLt100M) {
                this.$confirm('上传文件大小不能超过 100MB!', "提示",{
                	confirmButtonText: "确定",
                	cancelButtonText: "取消",
                	showCancelButton: false,
                	type: "error"
                });
              }
              if(file.size==0){
                this.$confirm('请勿上传大小为0kb的空文件', "提示",{
                	confirmButtonText: "确定",
                	cancelButtonText: "取消",
                	showCancelButton: false,
                	type: "error"
                });
                return false;
              }
              /* .com .bat .exe */
              if((file.name.indexOf('.bat')!=-1||file.name.indexOf('.exe')!=-1||file.name.indexOf('.com'))!=-1){
                console.log()
                this.$confirm('请勿上传可执行文件', "提示",{
                	confirmButtonText: "确定",
                	cancelButtonText: "取消",
                	showCancelButton: false,
                	type: "error"
                });
                return false;
              }
              if(file.name.length>80){
                this.$confirm('附件名称长度过长', "提示",{
                	confirmButtonText: "确定",
                	cancelButtonText: "取消",
                	showCancelButton: false,
                	type: "error"
                });
                return false;
              }
              return isLt100M;
          }
        }
    }
</script>
<style scoped>

.common_edit .bottom_button{
    float:left;
    margin-left:50%;
    transform: translateX(-50%);
}
.top-nav {
  /* float: left; */
  width: 100%;
  position: relative;
  height: 43px;
  background-color: rgb(238, 241, 246);
  border-bottom: 1px solid rgb(209, 217, 229);
  box-sizing: border-box;
}
.top-nav .header_title_tips {
  margin-bottom: 15px;
  /* float:left; */
  color: #fff;
  position: absolute;
  left: -9px;
  top: 8px;
}
.top-nav .header_title_tips p {
  /* float:left; */
  background-color: #12806b;
  font-size: 16px;
  padding: 2px 20px 2px 15px;
  max-width: 545px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.top-nav .header_title_tips .tips_icon {
  border: 4px solid #475669;
  position: absolute;
  left: 0;
  bottom: -8px;
  border-left-color: #fff;
  border-bottom-color: #fff;
}
</style>
