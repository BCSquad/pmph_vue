<template>
  <div class="content_publish">
    <el-form :model="formData" :rules="formRules" ref="addForm" label-width="120px" style="margin:20px 30px 20px 0">
      <el-form-item :label="$router.currentRoute.query.columnId==1?'文章标题：':($router.currentRoute.query.columnId==2?'信息快报标题：':'公告管理标题：')" prop="title">
           <el-input placeholder="请输入内容标题" class="input" v-model.trim="formData.title"></el-input>
      </el-form-item>
      <el-form-item label="所属来源：" prop="authorname" v-if="$router.currentRoute.query.columnId==1">
        <el-input placeholder="请输入所属来源" class="input" v-model.trim="formData.authorname"></el-input>
      </el-form-item>
      <el-form-item v-if="formData.authorType==2" label="是否原创：" prop="isOriginal">
        <el-radio class="radio" v-model="formData.isOriginal" :label="true">是</el-radio>
        <el-radio class="radio" v-model="formData.isOriginal" :label="false">否</el-radio>
        <span class="intro">原创文章将按积分规则为提交的作家用户增加积分</span>
      </el-form-item>
      <el-form-item label="所属栏目：" prop="categoryId">
          <el-cascader
            :options="options"
            :clearable="true"
            class="input"
            :disabled="true"
            :props="defaultType"
            v-model="defaultCategoryId"
            :change-on-select="true"
            placeholder="请选择栏目"
            @change="handleChange">
          </el-cascader>
      </el-form-item>
      <el-form-item label="所属教材：">
          <el-select v-model="formData.materialId" clearable placeholder="请选择" class="input">
            <el-option
              v-for="item in bookOptions"
              :key="item.id"
              :label="item.materialName"
              :value="item.id">
            </el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="置顶：" prop="isStick">
          <!-- <el-input class="input" placeholder="请输入数字" v-model="formData.sort"></el-input> -->
           <el-radio class="radio" v-model="formData.isStick" :label="true">是</el-radio>
           <el-radio class="radio" v-model="formData.isStick" :label="false">否</el-radio>
      </el-form-item>
      <el-form-item  label="应用类型：">
      <el-select v-model="formData.apporpc"  placeholder="请选择">
        <el-option label="全部" value="0"></el-option>
        <el-option label="pc端" value="1"></el-option>
        <el-option label="移动端" value="2"></el-option>
       <!-- <el-option
          v-for="item in applyOptions"
          :key="item.apporpc"
          :label="item.label"
          :value="item.apporpc">
        </el-option>-->
      </el-select>
      </el-form-item>
      <el-form-item label="内容：" required>
              <Editor ref="editor" :config="editorConfig"></Editor>
      </el-form-item>
      <el-form-item label="文章封面：" v-if="$route.query.isShowCover">
        <el-upload
          class="upload-demo"
          style="float:left"
          :action="coverUploadUrl"
          :on-success="coverUploadSuccess"
          :on-remove="coverUploadRemove"
          :on-preview="checkCoverUpload"
          :before-upload="coverBeforeUpload"
           :file-list="imgList"
           >
          <el-button size="small" type="primary">添加封面图片</el-button>
        </el-upload>
        </el-form-item>
      <el-form-item label="附件：" >
          <div class="col-content file-upload-wrapper" style="padding-left:0;" >
          <my-upload
            class="upload-demo"
            style="max-width:300px;"
            :action="fileUploadUrl"
            :on-success="upLoadFileSuccess"
            :on-remove="uploadFileRemove"
            :before-upload="beforeAvatarUpload"
            :file-list="fileList">
                  <span>
              <i class="fa fa-paperclip fa-lg"></i> 添加附件</span>
            <div slot="tip" class="el-upload__tip" style="line-height:1;">文件大小不超过200M</div>
          </my-upload>
        </div>
      </el-form-item>
    </el-form>
    <!-- 预览对话框 -->
        <el-dialog
     title=""
     :visible.sync="showPreventDialog"
     size="large">
       <div style="padding:0 10%;">
        <h5 class="previewTitle text-center">{{formData.title}}</h5>
         <p class="senderInfo text-center paddingT10">
      <span class="marginR10">{{routerName}}</span>
      <span>{{$commonFun.getNowFormatDate()}}</span>
       </p>
       <el-form label-width="55px">
         <el-form-item label="" label-width="0">
           <div style="margin:0 auto;width:800px;"> <p v-html="preventContent" class="p_content"></p></div>

         </el-form-item>
         <el-form-item label="附件：" >
              <p type="text" style="color:#337ab7" v-for="(item,index) in fileList" :key="index" @click="download(item.url)">{{item.name}}</p>
         </el-form-item>
       </el-form>
        </div>
    </el-dialog>

    <!-- 查看封面图片弹框 -->
    <el-dialog
     :visible.sync="coverDialogVislble"
     :show-close="false"
     class="cover_dialog"
     title="">
     <img :src="coverImgUrl" />
    </el-dialog>

    <div class="bottom_box">
          <el-button @click="$router.go(-1)">返回</el-button>
          <el-button type="primary" @click="openPreventDialog">预览</el-button>
          <el-button type="primary" v-if="formData.categoryId==1"  @click="examineContent($router.currentRoute.params.cmsContent,2)">发布</el-button>
          <el-button type="danger" v-if="formData.categoryId==1&&$router.currentRoute.query.type!='new'" @click="returnReasonFnc">退回</el-button>
          <el-button type="primary" @click="ContentSubmit(0)" >暂存</el-button>
          <el-button type="primary" @click="publishSubmit(1)"  v-if="formData.categoryId!=1">发布</el-button>
    </div>
    <!--退回理由-->
    <el-dialog title="退回理由" :visible.sync="returnReasonVisible" width="50%">
      <el-input
        type="textarea"
        :rows="3"
        placeholder="请输入退回理由"
        v-model="formData.returnReason">
      </el-input>

      <div class="pull-right marginT10 marginB10">
        <el-button type="danger" @click="examineContent($router.currentRoute.params.cmsContent,1)">退回</el-button>
        <el-button type="primary" @click="returnReasonqx ">取消</el-button>

      </div>
    </el-dialog>
    <!--examineContent($router.currentRoute.params.cmsContent,1)-->
  </div>
</template>
<script type="text/javascript">
import Editor from "../../../components/Editor.vue";
export default {
  data() {
    return {
      newContentUrl: "/pmpheep/cms/newContent", //新建文章
      newLettersUrl:'/pmpheep/cms/newLetters', //新建信息快报
      newNoticeUrl:'/pmpheep/cms/newNotice' , //新建公告管理
      columnListUrl: "/pmpheep/cms/set", //栏目列表Url
      editContentUrl:'/pmpheep/cms/content/update',    //修改文章
      editLettersUrl:'/pmpheep/cms/letters/update',  //修改信息快报
      editNoticeUrl:'/pmpheep/cms/notice/update',  //修改公告
      examineUrl: "/pmpheep/cms/content/update", //审核内容
      formData: {
        title: "",
        categoryId: "",
        isStick:true,
        apporpc:"0",
        content: "",
        file: [],
        imgFile:[],
        imgAttachment:'',
        scheduledTime:'',
        isPublished: "",
        path:'0',
        materialId:'',
        returnReason: '',
        authorname:'',
        isOriginal:false
      },
      applyOptions: [{
        apporpc: 0,
        label: '全部'
      }, {
        apporpc: 1,
        label: 'PC端'
      }, {
        apporpc: 2,
        label: '移动端'
      }],

      coverDialogVislble:false,
      showPreventDialog:false,
      preventContent:'',
      isEditContent:false,
      fileList: [],
      imgList:[],
      coverImgUrl:'',
      formRules: {
        title: [
          { required: true, message: "标题不能为空", trigger: "blur" },
          { min: 1, max: 100, message: "标题不能超过100个字符", trigger: "change" }
        ],
        authorname: [
          { required: true, message: "所属来源不能为空", trigger: "blur" },
          { min: 1, max: 40, message: "所属来源不能超过40个字符", trigger: "change" }
        ],
        categoryId: [{type:'number', required: true, message: "请选择所属栏目", trigger: "change,blur" }],
        summary: [{ min: 1, max: 50, message: "摘要内容不能超过50个字符", trigger: "change" }],
        keyword: [{ min: 1, max: 50, message: "关键字不能超过50个字符", trigger: "change" }],
        isStick:[
            /* {validator:this.$formCheckedRules.numberChecked,trigger: "blur"},
            { min:1,max:10, message: "显示顺序不能超过10个字符", trigger: "blur" }, */
            {type:'boolean',message:'请选择是否置顶',trigger:'change'}
        ]
      },
      defaultType: {
        value: "id",
        label: "categoryName"
      },
      // bookType:{
      //   value: "id",
      //   label: "materialName"
      // },
      defaultCategoryId:[],
      uploadFileList: [],
      coverUploadUrl:'/pmpheep/file/image/upload',
         fileUploadUrl:this.$config.BASE_URL+'messages/message/file',
      /* fileUploadUrl:
        "http://192.168.200.109:8090/pmpheep/messages/message/file", */
      editorConfig: {
        initialFrameWidth: null,
        initialFrameHeight: 500
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      options: [
        {
          id:1,
          categoryName:'文章管理',
          children:null
        },
        {
          id:2,
          categoryName:'信息快报管理',
          children:null
        },
        {
          id:3,
          categoryName:'公告管理',
          children:null
        }
      ],
      bookOptions: [],
      returnReasonVisible: false, // 退回理由
      returnReason:''
    };
  },
  computed: {
    addNewUrl(){
      switch (this.$router.currentRoute.query.columnId) {
        case 1:
          return this.newContentUrl;
          break;
        case 2:
          return this.newLettersUrl;
        case 3:
         return this.newNoticeUrl;
        default:
          break;
      }
    },
    editUrl(){
      switch (this.$router.currentRoute.query.columnId) {
        case 1:
          return this.editContentUrl;
          break;
        case 2:
        return this.editLettersUrl;
        break;
        case 3:
        return this.editNoticeUrl;
        break;
        default:
          break;
      }
    },
    routerName(){
      switch (this.$router.currentRoute.query.columnId) {
        case 1:
          return '文章管理'
          break;
        case 2 :
         return  '信息快报管理'
         break;
         case 3 :
         return  '公告管理'
         break;
        default:
        break;
      }
    },
  },
  watch:{
   /* 'formData.isScheduled':function(val){
      this.formData.isPublished=!val;
   } */
  },
  methods: {
    publishSubmit(num){
    if(num==0){
      this.ContentSubmit(num);
    }else{
      this.$confirm('确定发布？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.ContentSubmit(num);
        }).catch(() => {
          /*this.$message({
            type: 'info',
            message: '已取消发布'
          });*/
        });
    }
    },
    /* 发布新内容url */
    ContentSubmit(num) {
      this.formData.content = this.$refs.editor.getContent();
      if (!this.formData.content) {
        this.$confirm("内容不能为空", "提示",{
        	confirmButtonText: "确定",
        	cancelButtonText: "取消",
        	showCancelButton: false,
        	type: "error"
        });
        return false;
      }
      this.$refs["addForm"].validate(valid => {
        if (valid) {

            /* 判断暂存还是发布 */

            if(num==0){
               this.formData.isStaging=true;
               this.formData.authStatus=0;
            }
            if(num==1){
              this.formData.isPublished=true;
              this.formData.authStatus=2;
            }
          this.formData.sessionId = this.$getUserData().sessionId;
          /* 判断新增还是修改 */
          if(!this.isEditContent){
              this.$axios
            .post(this.addNewUrl, this.$commonFun.initPostData(this.initFormData(this.formData)))
            .then(res => {
              console.log(res);
              if (res.data.code == 1) {
                switch (num) {
                  case 0:
                    this.$message.success("暂存成功");
                    break;
                  case 1:
                   this.$message.success("发布成功");
                   break;
                  default:
                    break;
                }
                this.$router.push({ name: this.routerName });
              } else {
                this.$confirm(res.data.msg, "提示",{
                	confirmButtonText: "确定",
                	cancelButtonText: "取消",
                	showCancelButton: false,
                	type: "error"
                });
              }
            });
          }else{
            this.$axios.put(this.editUrl,this.$commonFun.initPostData(this.initFormData(this.formData))).then((res)=>{
                console.log(res);
                if(res.data.code==1){
                switch (num) {
                  case 0:
                    this.$message.success("暂存成功");
                    break;
                  case 1:
                    this.$message.success("发布成功");
                   break;
                  default:
                    break;
                }
                  this.$router.push({ name: this.routerName });
                }else {
                this.$confirm(res.data.msg, "提示",{
                	confirmButtonText: "确定",
                	cancelButtonText: "取消",
                	showCancelButton: false,
                	type: "error"
                });
              }
            })
          }


        } else {

          this.$nextTick(this.focuFuntion);
         return false;
        }
      });
    },focuFuntion(){
      let _this = this;
      console.log(this.$refs["addForm"].$el.getElementsByClassName("el-form-item is-error is-required")[0].getElementsByTagName("input")[0]);
      if(this.$refs["addForm"].$el.getElementsByClassName("el-form-item is-error is-required")[0].getElementsByTagName("input").length>0){
        var ss= this.$refs["addForm"].$el.getElementsByClassName("el-form-item is-error is-required")[0].getElementsByTagName("input")[0];
        ss.focus();
      }else if(this.$refs["addForm"].$el.getElementsByClassName("el-form-item is-error is-required")[0].getElementsByTagName("textarea").length>0){
        var ss= this.$refs["addForm"].$el.getElementsByClassName("el-form-item is-error is-required")[0].getElementsByTagName("textarea")[0];
        ss.focus();
      }
    },
    download(url){
      console.log("url"+url);
      this.$commonFun.downloadFile(url);
    },
//    点击退回
    returnReasonFnc(){
      this.returnReasonVisible = true;
    },
    returnReasonqx(){
      this.returnReasonVisible = false;
    },
    /* 预览 */
    openPreventDialog(){
      console.log(this.formData);
     this.preventContent=this.$refs.editor.getContent();
     this.showPreventDialog=true;
    },
    /* 审核 */
    examineContent(obj,status) {
      this.$refs["addForm"].validate(valid => {
          if (valid) {
            this.formData.materialId = this.formData.materialId != '' ? this.formData.materialId : '0';
            this.$confirm(status == 2 ? "确定审核通过该文章？" : "确定退回该文章？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          this.formData.sessionId = this.$getUserData().sessionId;
          this.formData.authStatus = status;
          this.formData.content = this.$refs.editor.getContent();
          this.$axios
          ({
            method: this.$route.query.type == 'new' ? 'post' : 'put',
            url: this.$route.query.type == 'new' ? this.addNewUrl : this.examineUrl,
            data: this.$commonFun.initPostData(this.formData)
          })
            .then(res => {
              console.log(res);
              if (res.data.code == 1) {
                this.formData.materialId = this.formData.materialId == '0' ? '' : this.formData.materialId;
                this.$message.success("操作成功");
                this.showContentDetail = false;
                this.$router.push({name: '文章管理'})
              } else {
                this.$confirm(res.data.msg.msgTrim(), "提示",{
                	confirmButtonText: "确定",
                	cancelButtonText: "取消",
                	showCancelButton: false,
                	type: "error"
                });
              }
            });
        })
        .catch(() => {
          /*this.$message({
            type: "info",
            message: "已取消操作"
          });*/
        });
          } else {
            this.$nextTick(this.focuFuntion);
            return false;
          }
      });
    },
    /* 栏目选择改变 */
    handleChange(value) {
      this.formData.categoryId = value[value.length - 1] + "";
      this.formData.path = value.join("-");
      console.log(value);
    },
    /* 文件上传大小判断 */
    beforeAvatarUpload(file){
      console.log(file);
      console.log(typeof file);
      const isLt100M = file.size / 1024 / 1024 <= 200;
       if (!isLt100M) {
          this.$confirm('上传文件大小不能超过 200MB!', "提示",{
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
    },
    /* 文件上传成功回调 */
    upLoadFileSuccess(res, file, filelist) {
       this.fileList=filelist;
      this.formData.file = [];
      if (res.code == 1) {
        filelist.forEach(item => {
          if(item.response){
            this.formData.file.push(item.response.data);
          }
        });
      }

    },
    /* 文件移除回调 */
    uploadFileRemove(file, flielist) {
      this.fileList=flielist;
      if(!this.isEditContent){
          this.formData.file = [];
         flielist.forEach((i) => {
        this.formData.file.push(i.response.data);
      });
      }else{

        if(file.attachment){
          if(!this.formData.attachment){
            this.formData.attachment=[];
          }
            this.formData.attachment.push(file.attachment);
        }
      }

    },
    /* 推荐到期时间改变 */
    promoteDateChange(val) {
      console.log(val);
      this.formData.deadlinePromote = val;
    },
    /* 置顶到期时间改变 */
    stickDateChange(val) {
      this.formData.deadlineStick = val;
    },
    /* 热门到期时间改变 */
    hotDateChange(val) {
      this.formData.deadlineHot = val;
    },
    /* 定时发布时间改变 */
    scheduledDateChange(val) {
      this.formData.scheduledTime = val;
    },
    /* 初始化是新增还是修改 */
    initIsEdit() {
      if(this.$router.currentRoute.query.columnId){
                this.defaultCategoryId.push(this.$router.currentRoute.query.columnId);
                this.formData.categoryId=this.$router.currentRoute.query.columnId;
      }else{
           this.$router.push({ name: "文章管理" });
      }
      this.isEditContent=false;
      if (this.$router.currentRoute.query.type == "edit") {
           var editData=this.$router.currentRoute.params;
           console.log(editData);
        if (editData.content) {
          this.isEditContent=true;
          for(var item in editData.cmsContent){
            if(item.indexOf('gmt')!=0){
                if(typeof editData.cmsContent[item]!='boolean'){
                 this.formData[item]=editData.cmsContent[item]==null?'':editData.cmsContent[item]+'';
            }else{
                this.formData[item]=editData.cmsContent[item]==null?'':editData.cmsContent[item];
            }
            }

            if(item=='materialId') {
              this.formData[item]=editData.cmsContent[item]==0?'':editData.cmsContent[item];
            }
          }
          /* 设置默认栏目 */
          this.formData.categoryId=parseInt(this.formData.categoryId);
          /* 填充默认内容 */
          var _this=this;
          setTimeout(function() {
             _this.$refs.editor.setContent(editData.content.content);
          }, 1000);
          /* 填充默认附件 */
          for(var i in editData.cmsExtras){
             var obj={};
          obj.name=editData.cmsExtras[i].attachmentName;
          obj.url=editData.cmsExtras[i].attachment;
          obj.attachment=editData.cmsExtras[i].attachment.split('/').pop();
          this.fileList.push(obj);
            console.log("fileList")
          console.log(this.fileList);
          }
          /* 填充封面图片 */
          if(this.$route.query.isShowCover){
            this.imgList.push({name:editData.imgFileName,url:editData.imgFilePath});
          }
         /* editData.cmsExtras.forEach((item)=>{

          obj.name=item.attachmentName;
          obj.url=item.attachment;
          obj.attachment=item.attachment.split('/').pop();
          console.log('1111111111',obj);
          this.fileList.push(obj);
         }) */
         this.formData.attachment=[];
        } else {
          var _this=this;
          _this.$confirm('文章内容为空', "提示",{
          	confirmButtonText: "确定",
          	cancelButtonText: "取消",
          	showCancelButton: false,
          	type: "error"
          });
        setTimeout(function() {
             _this.$router.go(-1);
        }, 1000);

        }
      }
    },
    /**获取教材列表 */
    getBookLists(){
      this.$axios.get('/pmpheep/material/published').then(response => {
        let res = response.data;
        if (res.code == '1') {
          this.bookOptions=res.data;
        }
      })
    },
    /* 提交数据处理 */
    initFormData(obj){
      var formData={};
      for(var i in obj){
        if(i=='materialId'){
           formData[i]=obj[i]?obj[i]:0;
        }else{
          formData[i]=obj[i];
        }
      }

      return formData;
    },
    coverUploadSuccess(res, file, filelist){
     if(!filelist[0].response){
      this.formData.imgAttachment=filelist[0].url.split('/').pop();
     }
      this.imgList=[];
      this.formData.imgFile='';
      if(this.formData.categoryId==1&&this.$router.currentRoute.query.type=='new'){
        this.formData.cover='';
        this.formData.cover=res.data;
      }
      this.imgList.push({name:file.name,url:res.data});
      this.formData.imgFile=res.data;
    },
    coverUploadRemove(file, flielist){
      if(file.url){
        this.formData.imgAttachment=file.url.split('/').pop();
      }
    },
    coverBeforeUpload(file){
      var exStr=file.name.split('.').pop().toLowerCase();
      var exSize=file.size?file.size:1;
      if(exSize/ 1024 / 1024 > 20){
        this.$confirm('图片的大小不能超过20MB！', "提示",{
        	confirmButtonText: "确定",
        	cancelButtonText: "取消",
        	showCancelButton: false,
        	type: "error"
        });
       // this.material.noticeFiles.pop();
        return false;
      }
      if(exSize==0){
        this.$confirm('请勿上传空文件！', "提示",{
        	confirmButtonText: "确定",
        	cancelButtonText: "取消",
        	showCancelButton: false,
        	type: "error"
        });
       // this.material.noticeFiles.pop();
        return false;
      }
      if(exStr!='png'&&exStr!='jpg'&&exStr!='jpeg'){
        this.$confirm('图片的格式必须为png或者jpg或者jpeg格式！', "提示",{
        	confirmButtonText: "确定",
        	cancelButtonText: "取消",
        	showCancelButton: false,
        	type: "error"
        });
       // this.material.noticeFiles.pop();
        return false;
      }
      if(file.name.length>80){
        this.$confirm('图片名称不能超过80个字符！', "提示",{
        	confirmButtonText: "确定",
        	cancelButtonText: "取消",
        	showCancelButton: false,
        	type: "error"
        });
        //this.material.noticeFiles.pop();
        return false;
      }
    },
    checkCoverUpload(file){
      this.coverImgUrl='pmpheep/image/'+file.url;
      this.coverDialogVislble=true;
    }
  },
  created() {
    this.initIsEdit();
    this.getBookLists();
    //$(".p_content").parent.css({"width":"800px","margin":"0,auto"});
  },
  components: {
    Editor
  }
};
</script>
<style >
.content_publish .input {
  width: 500px;
}
.content_publish .date_input {
  width: 300px;
}
.content_publish .bottom_box {
  margin-left: 45%;
  transform: translateX(-50%);
  display: inline-block;
}
.previewTitle{
  color: #14232e;
  font-size: 22px;
  font-weight: 500;
}
.content_publish .center_box{
    float:left;
 margin-left:50%;
 transform: translateX(-50%);
}
.content_publish .el-tabs--border-card {
    border: 0;
    box-shadow: none;
  }
  .content_publish .cover_dialog .el-dialog{
    background: none;
    width:auto;
  }
  .content_publish .cover_dialog .el-dialog .el-dialog__header{
    padding:0;
  }
   .content_publish .cover_dialog .el-dialog .el-dialog__body{
     padding:0;
   }
  .intro{
    color: #0e4def;
    margin-left: 2em;
  }
</style>
