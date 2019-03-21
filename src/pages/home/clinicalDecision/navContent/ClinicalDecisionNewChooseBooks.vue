<template>

  <div class="ClinicalDecision_nav">
    <div class="tab_nav_outbox" >
      <div style="float:left;"><div class="div_img"><img :src="productImage" style="width: 20px;height: 20px;"/></div> <span type="text"  class="back_button">{{productName[ruleForm.product_type]}}</span></div>
      <el-button type="text"  class="back_button2" icon="arrow-left" @click="$router.go(-1)">返回上一步</el-button>
      <!--<div class="div_publicInfo" v-if="!ruleForm.is_published">发布人：无，发布时间：无，状态：待发布</div>-->
    </div>

    <div class="bottom_tab_content" ref="bottom_tab_content" :style="{'min-height':contentH}">
    <div class="newChoose">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" :label-position="labelPosition">
        <el-row>
          <el-col :span="24">
              <el-form-item label="产品名称：" prop="product_name" style="">
                <el-input v-model="ruleForm.product_name" @keyup.enter.native="submitForm"></el-input>
              </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="报名截止日期：" prop="actualDeadline" >
              <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.actualDeadline"   format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="16">
            <el-form-item label="是否当前申报公告：" required style="margin-left: 30px">
              <el-checkbox v-model="ruleForm.is_active" class="check" ><span style="margin-left:20px;color: red;">(注意:用于设置当前产品为可申报的公告)</span></el-checkbox>
            </el-form-item>
          </el-col>

        </el-row>

        <el-form-item label="审核人:"  prop="auditorList">
          <el-col :span="24">
            <el-button type="primary"  size="small" @click="chooseProjectAuditor" style="margin-right:10px;">选择</el-button>
            <el-tag
              class="marginR10"
              v-for="(tag,index) in ruleForm.auditorList"
              :key="index"
              :closable="true"
              type="info"
              @close="handleAuditorClose(index)"
            >
              {{tag.auditor_name}}
            </el-tag>
            <br>
          </el-col>
        </el-form-item>
        <el-form-item label="选项：">
          <el-col>
            <el-table
              :data="listTableData"
              border
              style="width: 100%">
              <el-table-column
                prop="name"
                label="名称"
              >
              </el-table-column>
              <el-table-column
                label="是否使用"
                width="150"
                align="center"
              >
                <template scope="scope">
                  <el-checkbox v-model="scope.row.usecheck" @change="optionChange(scope.row)"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                label="是否必填"
                width="150"
                align="center">
                <template scope="scope">
                  <el-checkbox v-if="!scope.row.show" v-model="scope.row.needcheck" :disabled="scope.row.usecheck?false:true"></el-checkbox>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-form-item>
        <el-form-item label="扩展项：">
          <el-col :span="24">
            <el-button type="primary"  size="small" @click="addExtend">新增扩展项</el-button>
            <br>
            <el-table
              :data.sync="ruleForm.productExtensionList"
              border
              style="width: 100%">
              <el-table-column label="名称">
              <template scope="scope">
                <el-form :model="scope.row" :ref="'extensionName'+scope.$index" :rules="rules" style="margin:18px 0;">
                  <el-form-item prop="extensionName" style="margin:18px 0;">
                    <el-input v-model="ruleForm.productExtensionList[scope.$index].extensionName" placeholder="请输入名称" @keyup.enter.native="submitForm"></el-input>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
              <el-table-column
                label="是否必填"
                align="center"
                width="150">
                <template scope="scope">
                  <el-checkbox v-model="scope.row.isRequired"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                align="center"
                width="150">
                <template scope="scope">
                  <el-button
                    size="small"
                    type="danger"
                    @click="handleDelete(scope.$index, ruleForm.productExtensionList)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-form-item>

        <el-form-item label="产品简介："  >
          <el-col :span="24">
              <Editor ref="editor" :config="editorConfig" ></Editor>
          </el-col>
        </el-form-item>
        <el-form-item label="上传通知扫描图片：" prop="producntImgList">
          <my-upload
            class="upload"
            :auto-upload="true"
            name="file"
            action="/pmpheep/file/image/upload"
            :on-remove="imgUploadChange"
            :on-success="imgUploadSuccess"
            :before-upload="imgBeforeUpload"
            :file-list="ruleForm.producntImgList">
            <el-button size="small" type="primary">点击上传</el-button>
          </my-upload>
        </el-form-item>
        <el-form-item label="备注："  >
          <el-col :span="24">
              <EditorNote ref="editorNote" :config="editorNoteConfig" ></EditorNote>
          </el-col>
        </el-form-item>

        <el-form-item label="附件：" prop="productAttachmentList">
          <el-col :span="12">
            <my-upload
              class="upload"
              action="/pmpheep/material/upTempFile"
              name="files"
              :auto-upload="true"
              :on-remove="fileUploadChange"
              :before-upload="fileBeforeUpload"
              :on-success="fileUploadSuccess"
              :file-list="ruleForm.productAttachmentList">
              <el-button size="small" type="primary" >点击上传</el-button>
            </my-upload>
          </el-col>
        </el-form-item>

        <el-form-item class="text-center">
          <el-button type="primary"  @click="openPreventDialog">预览</el-button>
          <!--<el-button type="primary" @click="submitForm(0)" :disabled = "isDisabled" :loading="isloadingZC">暂存</el-button>-->
          <el-button type="primary" @click="submitForm(0)" :loading="isloading">下一步</el-button>
        </el-form-item>
      </el-form>


      <el-dialog :title="chooseTitle" :visible.sync="chooseVisiable" size="large" top="5%" @close="closeDialog">
        <user-pmph select :radio="!Multichoice" :clearTableSelect.sync="clearTableSelect"  @selection-change="conactPersonChange">
          <el-button  type="primary" @click="addCheckedConact()">增加</el-button>
        </user-pmph>
      </el-dialog>


      <!-- 预览对话框 -->
      <el-dialog
        title=""
        :visible.sync="showPreventDialog"
        size="large">
        <div style="padding:0 10%;">
          <!--<h5 class="previewTitle text-center">{{productName[ruleForm.product_type]}}申报说明</h5>
          <p class="senderInfo text-center paddingT10" v-if="ruleForm.is_published">
            <span class="marginR10">发布人：{{ruleForm.publisher}}</span>
            <span class="marginR10">发布时间：{{ruleForm.gmt_publish}}</span>
            <span>{{'状态：已发布'}}</span>
          </p>
          <p class="senderInfo text-center paddingT10" v-if="!ruleForm.is_published">
            <span class="marginR10">发布人：{{'无'}}</span>
            <span class="marginR10">发布时间：{{'无'}}</span>
            <span>{{'状态：待发布'}}</span>
          </p>-->
          <el-form label-width="125px">
            <el-form-item label="" >
              <div style="margin:0 auto;width:800px;"> <p v-html="preventContent" class="p_content"></p></div>
            </el-form-item>
            <el-form-item label=""  v-if="ruleForm.producntImgList">
              <p v-for="(item,index) in ruleForm.producntImgList" :key="index" style="text-align: center;"><img  :src="item.attachment"  /></p>
            </el-form-item>
            <el-form-item label="" >
              <div style="margin:0 auto;width:800px;"> <p v-html="noteText" class="p_content"></p></div>
            </el-form-item>
            <el-form-item label="附件：" >
              <p type="text" style="color:#337ab7" v-for="(item,index) in ruleForm.productAttachmentList" :key="index" @click="download(item.url)">{{item.name}}</p>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
    </div>
    </div>
  </div>

</template>

<script type="text/ecmascript-6">
import 'url-search-params-polyfill';
import userPmph from "components/user-pmph";
import Editor from "../../../../components/Editor.vue";
import EditorNote from  "../../../../components/EditorNote.vue";
export default {
  data() {
    return {
      editProductUrl:'/pmpheep/product/init',
      submitProductUrl:'/pmpheep/product/save/',
      chooseVisiable: false, // 选择弹窗
      chooseTitle: "", // 选择弹出窗的title
      Multichoice: true, // 是否可以多选，传递给Departments子组件
      productName:['','人卫临床助手','人卫用药助手','人卫中医助手'],
      contentH:'auto',
      productImage:'../../../../../static/static-image/rwej01.png',
      labelPosition: "right",
      //isloadingZC:false,
      isloading:false,
      clearTableSelect:false,
      rules: {
        auditorList:[{type:'array', required: true,message:'请至少选择一个审核人' ,trigger: "change" }],
        product_name: [
          { required: true, message: "请输入产品名称", trigger: "blur" },
          {min:1,max:50,message:'产品名称不能超过50个字符',trigger:'change,blur'}
        ],
        extensionName:[
          {required: true, message: "请填写名称", trigger: "blur" },
          {min:1,max:100,message:'不能超过100个字符',trigger:'change,blur'}
        ],
        producntImgList:[
          {type:'array',required: true, message: "请至少上传一张图片", trigger: "blur" },
        ],
        productAttachmentList:[
          {type:'array',required: true, message: "请至少上传一个文件", trigger: "blur" },
        ],
        actualDeadline:[{type:'date', required: true, message: "请选择日期", trigger: "change" }],

      },

      ruleForm: {
        id:this.$route.query.product_id=='new'?"":this.$route.query.product_id,
        auditorList:[], //审核人
        productExtensionList:[],   //扩展项
        producntImgList:[],
        productAttachmentList:[],
        descriptionContent :{},
        noteContent:{},
        product_type: this.$route.query.clinicaltype,
        is_published:false,
        publisher:'',
        gmt_publish:'',
        actualDeadline:'',
        product_name:'',
        is_active:true,
      },
      editorConfig: {
        initialFrameWidth: null,
        initialFrameHeight: 200
      },
      editorNoteConfig:{
        initialFrameWidth: null,
        initialFrameHeight: 200
      },
      preventContent:"",
      noteText:"",
     // isDisabled:false,
      /*product:{
        id:'',
        product_type: this.$route.query.clinicaltype,
        auditorList:[], //审核人
        descriptionContent :{},
        noteContent:{},
        producntImg:[],
        productAttachment:[],
        is_published:false,
        publisher:'',
        gmt_publish:''
      },*/
      showPreventDialog:false,
      listTableData: [
        // {
        //   name: "所在单位意见",
        //   key: "is_unit_advise_used",
        //   usecheck: false,
        //   show: true
        // },
        {
          name: "学科分类",
          key:'is_subject_type_used',
          requiredKey:'is_subject_type_required',
          usecheck: false,
          needcheck: false
        },
        {
          name: "内容分类",
          key:'is_content_type_used',
          requiredKey:'is_content_type_required',
          usecheck: false,
          needcheck: false
        },
        {
          name: "专业分类",
          key:'is_profession_type_used',
          requiredKey:'is_profession_type_required',
          usecheck: false,
          needcheck: false
        },
        {
          name: "主要学习经历",
          key:'is_edu_exp_used',
          requiredKey:'is_edu_exp_required',
          usecheck: false,
          needcheck: false
        },
        {
          name: "主要工作经历",
          key:'is_work_exp_used',
          requiredKey:'is_work_exp_required',
          usecheck: false,
          needcheck: false
        },
        {
          name: "主要学术兼职",
          key:'is_acade_used',
          requiredKey:'is_acade_required',
          usecheck: false,
          needcheck: false
        },
        {
          name: "人卫社教材编写情况",
          key:'is_pmph_textbook_used',
          requiredKey:'is_pmph_textbook_required',
          usecheck: false,
          needcheck: false
        },
        {
          name: "图书出版情况", //主编学术专著情况
          key:'is_monograph_used',
          requiredKey:'is_monograph_required',
          usecheck: false,
          needcheck: false
        },
        {
          name: "主编或参编图书情况",
          key:'is_edit_book_used',
          requiredKey:'is_edit_book_required',
          usecheck: false,
          needcheck: false
        },{
          name: "文章发表情况",
          key:'is_article_published_used',
          requiredKey:'is_article_published_required',
          usecheck: false,
          needcheck: false
        },{
          name: "本专业获奖情况",
          key:'is_profession_award_used',
          requiredKey:'is_profession_award_required',
          usecheck: false,
          needcheck: false
        },


      ],

    };
  },
  computed:{

  },
  watch:{

  },
  created() {
    if(this.$route.query.product_id!='new'&&!this.$commonFun.Empty(this.$route.query.product_id)){
      this.initEditData();
    }

  },
  mounted () {
    document.onkeydown = function() {
      if(window.event.keyCode==13) {
        return false;
      }
    }
    //初始化页面高度，当页面内容很少时也要保证页面拉满整个屏幕
    var windowH = document.documentElement.clientHeight;
    this.contentH = windowH-100+'px';
    switch (parseInt(this.$route.query.clinicaltype)) {
      case 1: this.productImage = '../../../../../static/static-image/rwej05.png';break;
      case 2: this.productImage = '../../../../../static/static-image/rwej04.png';break;
      case 3: this.productImage = '../../../../../static/static-image/rwej03.png';break;
      default: this.productImage = '../../../../../static/static-image/rwej03.png';break;
    }
  },

  methods: {
    /* 日期选择框格式化 */
    /*actDatePickGetTime(date){
      this.ruleForm.actualDeadline=date;
    },*/
   /* pickOptionsAct:{
      disabledDate(time) {

        //console.log(material.deadline);
        // return time.getTime() < Date.now() - 8.64e7;
      }
    },*/

    //修改教材初始化
    initEditData(){

        this.$axios.get(this.editProductUrl,{
          params:{
            type:this.ruleForm.product_type,
            id:this.ruleForm.id
          }
        }).then((res)=>{
          if(res.data.code==1){
            // 获取到 相应的数据
            //this.ruleForm.id = res.data.data.id;
            this.ruleForm.is_published=this.$commonFun.Empty(res.data.data.is_published)?false:res.data.data.is_published;
            this.isDisabled = res.data.data.is_published&&!this.$commonFun.Empty(this.ruleForm.id);
            this.ruleForm.product_name = res.data.data.product_name;
            this.ruleForm.actualDeadline =new Date(res.data.data.actualDeadline);
            this.ruleForm.is_active = res.data.data.is_active;
            if(this.ruleForm.is_published){
              this.ruleForm.publisher = res.data.data.publisher;
              this.ruleForm.gmt_publish = this.$commonFun.formatDate(res.data.data.gmt_publish);
            }

            //选项赋值
            for(var i in this.listTableData){
              this.listTableData[i].usecheck=res.data.data[this.listTableData[i].key];
              console.log(this.listTableData[i].usecheck);
              if(this.listTableData[i].requiredKey){
                this.listTableData[i].needcheck=res.data.data[this.listTableData[i].requiredKey];
              }
            }
            //项目编辑赋值
            console.log(res.data.data.auditorList);
            for(var i in res.data.data.auditorList){
             // this.product.auditorList.push(res.data.data.auditorList[i]);
              this.ruleForm.auditorList.push(res.data.data.auditorList[i]);
            }
            //扩展项赋值
            this.ruleForm.productExtensionList=res.data.data.productExtensionList||[];
            //文件赋值
            var noticeArr=res.data.data.producntImgList;
            for(var i in noticeArr){
              this.ruleForm.producntImgList.push({
                id:noticeArr[i].id,
                attachment:'/pmpheep/image/'+noticeArr[i].attachment,
                url:'/pmpheep/image/'+noticeArr[i].attachment,
                product_id:this.ruleForm.id,
                name:noticeArr[i].name,
                is_scan_img:true
              })
              /*this.product.producntImg.push({
                id:noticeArr[i].id,
                product_id:this.product.id,
                name:noticeArr[i].name,
                url:noticeArr[i].attachment,
                is_scan_img:true
              })*/
            }
            var noteArr=res.data.data.productAttachmentList;

            for(var i in noteArr){
              console.log(noteArr[i].attachment);
              this.ruleForm.productAttachmentList.push({
                id:noteArr[i].id,
                attachment:'/pmpheep/file/clinic/download/'+noteArr[i].attachment,
                url:'/pmpheep/file/clinic/download/'+noteArr[i].attachment,
                name:noteArr[i].name,
                product_id:this.ruleForm.id,
                is_scan_img:false
              })
             /* this.product.productAttachment.push({
                id:noteArr[i].id,
                product_id:this.product.id,
                name:noteArr[i].name,
                url:noteArr[i].attachment,
                is_scan_img:false
              })*/
            }
             //内容备注赋值
           // this.product.noteContent=res.data.data.noteContent||{};
            //this.product.descriptionContent=res.data.data.descriptionContent||{};
            this.ruleForm.noteContent=res.data.data.noteContent||{};
            this.ruleForm.descriptionContent=res.data.data.descriptionContent||{};
            var _this=this;
            setTimeout(function() {
              if(!_this.$commonFun.Empty(res.data.data.noteContent)){_this.$refs.editorNote.setContent(res.data.data.noteContent.content)}else{
               // _this.$refs.editorNote.setContent("");
              };
              if(!_this.$commonFun.Empty(res.data.data.descriptionContent)){
                _this.$refs.editor.setContent(res.data.data.descriptionContent.content)
              }
              else{
               // _this.$refs.editor.setContent("");
              };
            },1000);
          }
        })

    },/* 字符串转数组 */
    stringToArray(str){
      var arr=str.replace(/\[|\]/g,'').split('},');
      var result=[];
      if(arr[0]!=''){
        for(var j=0;j<arr.length;j++){
          result.push((j==arr.length-1)?(JSON.parse(arr[j])):(JSON.parse(arr[j]+'}')));
        }
      }
      return result;
    },
    /* 预览 */
    openPreventDialog(){
      console.log(this.formData);
      this.preventContent=this.$refs.editor.getContent();
      this.noteText = this.$refs.editorNote.getContent();
      this.showPreventDialog=true;
    },
    handleDelete(index, data) {
      data.splice(index, 1);
    },
    addExtend() {
      this.ruleForm.productExtensionList.push({
        id:null,
        productId:this.ruleForm.id,
        extensionName: "",
        isRequired: false,
        isDeleted:false
      });
    },
    /* 选项checkbox改变 */
    optionChange(obj){
      if(!obj.usecheck){
        obj.needcheck=false;
      }
    },
    download(url){
      console.log("url"+url);
      this.$commonFun.downloadFile(url);
    },
    chooseProjectAuditor() {
      this.chooseVisiable = true;
      this.chooseTitle = "审核人设置";
      this.Multichoice = true;
    },
    /**
     * 删除选中的项目编辑
     */
    handleAuditorClose(val) {
      this.ruleForm.auditorList.splice(val, 1);
      //this.product.auditorList.splice(val, 1);
      this.$refs.ruleForm.validateField('auditorList');
    },
    /**
     * 关闭弹出层
     */
    closeDialog() {
      this.clearTableSelect=!this.clearTableSelect;
    },
    /* 联系人选择 */
    conactPersonChange(val){
      this.checkedConactPersonData=val;
      console.log(this.checkedConactPersonData);
    },
    /* 增加 */
    addCheckedConact(){
        //debugger;
        for(var i in this.checkedConactPersonData){
          /* 去重 */
          if(this.removeRepeat(this.ruleForm.auditorList,this.checkedConactPersonData[i])){
           // this.product.auditorList.push({product_id:this.product.id,auditor_id:this.checkedConactPersonData[i].id,auditor_name:this.checkedConactPersonData[i].realname});
            this.ruleForm.auditorList.push({product_id:this.ruleForm.id,auditor_id:this.checkedConactPersonData[i].id,auditor_name:this.checkedConactPersonData[i].realname});
          }
          this.$refs.ruleForm.validateField('auditorList');
      }
      this.chooseVisiable=false;
    },
    /* 数组去重 */
    removeRepeat(arr,obj){
      for(var i in arr){
        if(arr[i].auditor_id==obj.id){
          return false;
        }
      }
      return true;
    },
    /* 文件上传改变 */
    /* 图片 */
    imgUploadChange(file,filelist){
      //this.product.producntImg=filelist;   //表单验证用
      this.ruleForm.producntImgList=filelist;
      /*filelist.forEach((item)=>{
        this.ruleForm.producntImgList.push({id:item.id?item.id:null,attachment:item.response?item.response.data[0]:item.attachment,url:item.response?item.response.data[0]:item.attachment,name:item.name,is_scan_img:true});
      })*/
      console.log(22222);
      console.log(file,filelist);
      this.$refs.ruleForm.validateField('producntImgList');
    },
    imgBeforeUpload(file){
      for(var i in this.ruleForm.producntImgList){
        if(this.ruleForm.producntImgList[i].name==file.name){
          this.$confirm('请勿多次上传同一图片', "提示",{
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            showCancelButton: false,
            type: "error"
          });
          return false;
        }
      }
      /*for(var i in this.product.producntImg){
        if(this.product.producntImg[i].name==file.name){
          this.$confirm('请勿多次上传同一图片', "提示",{
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            showCancelButton: false,
            type: "error"
          });
          return false;
        }
      }*/

      var exStr=file.name.split('.').pop().toLowerCase();
      var exSize=file.size?file.size:1;
      if(exSize/ 1024 / 1024 > 20){
        this.$confirm('图片的大小不能超过20MB！', "提示",{
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          showCancelButton: false,
          type: "error"
        });
        // this.product.producntImgList.pop();
        return false;
      }
      if(exSize==0){
        this.$confirm('请勿上传空文件！', "提示",{
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          showCancelButton: false,
          type: "error"
        });
        // this.product.producntImgList.pop();
        return false;
      }
      if(exStr!='png'&&exStr!='jpg'&&exStr!='jpeg'){
        this.$confirm('图片的格式必须为png或者jpg或者jpeg格式！', "提示",{
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          showCancelButton: false,
          type: "error"
        });
        // this.product.producntImgList.pop();
        return false;
      }
      if(file.name.length>80){
        this.$confirm('图片名称不能超过80个字符！', "提示",{
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          showCancelButton: false,
          type: "error"
        });
        //this.product.producntImgList.pop();
        return false;
      }
    },
    imgUploadSuccess(res,file,filelist){
      console.log(res,file,filelist);
      //this.product.producntImg=filelist;   //表单验证用
      this.ruleForm.producntImgList=[];
      filelist.forEach((item)=>{
        this.ruleForm.producntImgList.push({id:item.id?item.id:null,product_id:this.ruleForm.id,attachment:item.response?('/pmpheep/image/'+item.response.data):item.attachment,url:item.response?('/pmpheep/image/'+item.response.data):item.attachment,name:item.name,is_scan_img:true});
      })
      this.$refs.ruleForm.validateField('producntImgList');
    },
    /* 文件 */
    fileUploadChange(file,filelist){
      //this.product.productAttachment=filelist;   //表单验证用

      this.ruleForm.productAttachmentList=filelist;
     /* filelist.forEach((item)=>{
        this.ruleForm.productAttachmentList.push({id:item.id?item.id:null,product_id:this.ruleForm.id,attachment:item.response?item.response.data[0]:item.url,url:item.response?item.response.data[0]:item.url,name:item.name,is_scan_img:false});
      })*/
      this.$refs.ruleForm.validateField('productAttachmentList');
    },

    fileBeforeUpload(file){
      for(var i in this.ruleForm.productAttachmentList){
        if(this.ruleForm.productAttachmentList[i].name==file.name){
          this.$confirm('请勿多次上传同一附件', "提示",{
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            showCancelButton: false,
            type: "error"
          });
          return false;
        }
      }
     /* for(var i in this.product.productAttachment){
        if(this.product.productAttachment[i].name==file.name){
          this.$confirm('请勿多次上传同一附件', "提示",{
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            showCancelButton: false,
            type: "error"
          });
          return false;
        }
      }*/

      var exStr=file.name.split('.').pop().toLowerCase();
      var exSize=file.size?file.size:1;
      if(exSize/1024/1024>100){
        this.$confirm('附件大小不能超过100MB！', "提示",{
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          showCancelButton: false,
          type: "error"
        });
        // this.product.productAttachmentList.pop();
        return false;
      }
      if(exSize==0){
        this.$confirm('请勿上传空文件！', "提示",{
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          showCancelButton: false,
          type: "error"
        });
        //this.product.productAttachmentList.pop();
        return false;
      }
      if(exStr=='bat'||exStr=='com'||exStr=='exe'){
        this.$confirm('请勿上传可执行文件', "提示",{
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          showCancelButton: false,
          type: "error"
        });
        //this.product.productAttachmentList.pop();
        return false;
      }
      if(file.name.length>80){
        this.$confirm('附件名称不能超过80个字符', "提示",{
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          showCancelButton: false,
          type: "error"
        });
        //this.product.productAttachmentList.pop();
        return false;
      }
    },
    fileUploadSuccess(res,file,filelist){
      console.log(res,file,filelist);
      //this.product.productAttachment=filelist;   //表单验证用
      this.ruleForm.productAttachmentList=[];
      filelist.forEach((item)=>{
        this.ruleForm.productAttachmentList.push({id:item.id?item.id:null,attachment:item.response?('/pmpheep/file/clinic/download/'+item.response.data[0]):item.attachment,url:item.response?('/pmpheep/file/clinic/download/'+item.response.data[0]):item.attachment,name:item.name,is_scan_img:false});
      })
      console.log(this.ruleForm.productAttachmentList);
      this.$refs.ruleForm.validateField('productAttachmentList');
    },
    /* 选项合并到中 */
    optionMerge(){
      for(var i in this.listTableData){
        this.ruleForm[this.listTableData[i].key]=this.listTableData[i].usecheck;
        if(this.listTableData[i].requiredKey){
          this.ruleForm[this.listTableData[i].requiredKey]=this.listTableData[i].needcheck;
        }
      }
    },
    /* 合并product  ruleForm */
    mergeForms(){
      /*for(var i in this.product){
        /!*if(typeof(this.product[i])=='object'){
          this.ruleForm[i] = {};
          for(var j in this.product[i]){
            this.ruleForm[i][j]= this.product[i][j];
          }
        }else{*!/
        //debugger;
        if(i=="descriptionContent"||i=="noteContent"){
          continue;
        }else{
          this.ruleForm[i]=this.product[i];
        }*/

        //}

      //}
      console.log(this.ruleForm);
    },
    /* 表单内表格验证 */
    formTableChecked(){
      var checked=true;
      //扩展项验证
      for(var j in this.ruleForm.productExtensionList){
        this.$refs['extensionName'+j].validate((valid)=>{
          if(!valid){
            checked=false;
          }
        })
      }

      return checked;
    },
    /* 表单处理 */
    uploadFormMerge(obj){
      var paramdata = new URLSearchParams();
      //var formdata=new FormData();
      debugger;
      for(var i in obj){
        if(typeof(obj[i])=='object'){
          if(i=="descriptionContent"||i=="noteContent"){
            paramdata.append(i,JSON.stringify(obj[i]));
          }else{
            var arr=[];
            for(var j in obj[i]){
              arr.push(typeof(obj[i][j])=='object'?JSON.stringify(obj[i][j]):obj[i][j]);
            }
            paramdata.append(i,'['+arr.join()+']');
          }

        }else{
          paramdata.append(i,obj[i])
        }
      }
      return paramdata;
    },

    /* 提交表单 */
    submitForm(type){
      //this.product.noteContent["content"] = this.$refs.editorNote.getContent();
      //this.product.descriptionContent["content"] = this.$refs.editor.getContent();
      this.ruleForm.noteContent["content"] = this.$refs.editorNote.getContent();
      this.ruleForm.descriptionContent["content"] = this.$refs.editor.getContent();
      this.optionMerge();  //选项合并
     // this.mergeForms();   //表单合并
      /*if (!this.$refs.editor.getContent()) {
        this.$confirm(" 产品简介不能为空", "提示",{
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          showCancelButton: false,
          type: "error"
        });
        return false;
      }*/
      this.$refs.ruleForm.validate((valid) => {
        if (valid&&this.formTableChecked()) {
         /* if(type==0){
            this.isloadingZC=true;
          }else{
            this.isloadingFB=true;
          }*/
         this.isloading = true;

          //提交
          var formdate=JSON.parse(JSON.stringify(this.ruleForm));
        //  delete formdate['producntImg'];
         // delete formdate['productAttachment'];
          delete formdate['gmt_publish'];
          this.$axios.post(this.submitProductUrl+(type==0?"noPub":"pub"),
            formdate).then((res)=>{
            console.log(res);
           /* this.isloadingZC=false;
            this.isloadingFB=false;*/
            this.isloading = false;
            if(res.data.code==1){
              //this.isDisabled = !this.$commonFun.Empty(res.data.data.id)&&res.data.data.is_published;
              // this.ruleForm={
              //   id:'',
              //   auditorList:[], //审核人
              //   productExtensionList:[],   //扩展项
              //   producntImgList:[],
              //   productAttachmentList:[],
              //   descriptionContent :{},
              //   noteContent:{},
              //   product_type: this.$route.query.clinicaltype,
              //   is_published:false,
              //   publisher:'',
              //   gmt_publish:''
              // };
              // this.initEditData();
              // this.$message.success(type==0?'保存成功':'发布成功');
              //this.$router.query.product_id = res.data.data.id;
              this.$router.push({name:'临床决策申报选择学校',query:{productId:res.data.data.id,product_type:this.ruleForm.product_type,type:'reEdit'}});

            }else{
              this.$confirm(res.data.msg.msgTrim(), "提示",{
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                showCancelButton: false,
                type: "error"
              });
            }
          })


        } else {
          this.$nextTick(this.focuFuntion)
          return false;
        }
      });
    },
    focuFuntion(){
      let _this = this;
      console.log(_this.$refs.ruleForm.$el.getElementsByClassName("el-form-item is-error is-required")[0].getElementsByTagName("input")[0]);
      if(this.$refs.ruleForm.$el.getElementsByClassName("el-form-item is-error is-required")[0].getElementsByTagName("input").length>0){
        var ss= _this.$refs.ruleForm.$el.getElementsByClassName("el-form-item is-error is-required")[0].getElementsByTagName("input")[0];
        ss.focus();
      }else if(this.$refs.ruleForm.$el.getElementsByClassName("el-form-item is-error is-required")[0].getElementsByTagName("textarea").length>0){
        var ss= _this.$refs.ruleForm.$el.getElementsByClassName("el-form-item is-error is-required")[0].getElementsByTagName("textarea")[0];
        ss.focus();
      }
    }
  },
  components: {
    userPmph,
    Editor,
    EditorNote
  }
};
</script>

<style scoped>
 .newChoose{
   padding-right: 20px;
 }
  .ClinicalDecision_nav{
    width:100%;
  }
  .ClinicalDecision_nav .el-tabs--border-card {
    border: 0;
    box-shadow: none;
  }
  .bottom_tab_content{
    padding-top:20px;
    background-color: #fff;
    clear:both;
  }


  .ClinicalDecision_nav .tab_nav_outbox{
    width: 100%;
    height: 40px;
    padding: 0 10px;
    background-color: rgb(238, 241, 246);
    /*border: 1px solid rgb(209, 217, 229);*/
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    /* position: relative; */
  }
  .previewTitle{
    color: #14232e;
    font-size: 22px;
    font-weight: 500;
  }
  .ClinicalDecision_nav .tab_nav_outbox .back_button{
    /*margin: 20px;*/
    line-height: 40px;
    /* padding: 20px; */
    font-size: 16px;
  }
  .div_img{
    display: table-cell;
    vertical-align: middle;
    float: left;
    margin-right: 10px;
    line-height: 36px;
  }
  .div_publicInfo{
    float: right;
    font-size: 14px;
    line-height: 40px;
  }
 .back_button2{
   float:right;
   margin-right:20px;
   margin-left:20px;
   line-height: 20px;
   z-index: 1;
   position: relative;
 }
 .upload{
   font-size:16px !important;
 }



</style>
