<template>
  <div class="activity_video">
    <div class="top-nav">
      <div class="header_title_tips">
        <p>活动资源</p>
        <div class="tips_icon"></div>
      </div>
      <div class="header_back_tips">
        <p><el-button href="#" @click="backEditActivity">< 返回上一步</el-button></p>
      </div>
    </div>

    <h3 style="text-align: left" :data="editData">活动名称: {{editData.activityName}}</h3>
    <p class="header_p" style="margin-top: 50px">
      <span>资源名称：</span>
      <el-input class="input" style="width:300px;margin-right:10px;" v-model="searchParams.sourceName"
                @keyup.enter.native="getList()"
                placeholder="请输入资源名称"></el-input>
      <span>状态：</span>
      <el-button icon="search" type="primary" style="margin-bottom:10px;" @click="getList()">搜索</el-button>
      <el-button type="primary" style="float:right;margin-right: 50px" @click="fileUpload">上传资源</el-button>
      <el-button type="primary" style="float:right;" @click="selectSource">选择资源</el-button>
    </p>

    <el-table :data="sourceListData" border highlight-current-row style="width:100%;margin:10px 0;">
      <el-table-column label="序号" prop="index" width="65">
        <template scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column prop="sourceName" label="资源名称">
      </el-table-column>
      <el-table-column prop="realname" label="上传人">
      </el-table-column>
      <el-table-column prop="gmtUpload" label="上传时间">
        <template scope="scope">
          {{$commonFun.formatDate(scope.row.gmtUpload,"yyyy-MM-dd")}}
        </template>
      </el-table-column>
      <el-table-column prop="infoExpressName" label="操作">
        <template scope="scope">
          <el-button type="text" style="color:#337ab7;" @click="delSourceByid(scope.row)">删除</el-button>
          <el-button type="text" style="color:#337ab7;" @click="downFile(scope.row)">下载</el-button>

        </template>
        </el-table-column>


    </el-table>
    <el-dialog title="添加资源" :visible.sync="dialogVisible" size="tiny" width="100%">
      <el-form ref="dialogForm" :model="dialogForm" :rules="dialogRules" label-width="100px">

        <el-form-item label="资源名称：">
          <div class="col-content file-upload-wrapper" style="padding-left:0;">
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
      <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="fileUp">确定</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
    </el-dialog>

    <el-dialog title="选择资源" :visible.sync="selectSourceVisible" size="small" width="100%">
      <p class="header_p" style="margin-top: 50px">
        <span>资源名称：</span>
        <el-input class="input" style="width:300px;margin-right:10px;" v-model="searchParams.sourceName"
                  @keyup.enter.native="search"
                  placeholder="请输入资源名称"></el-input>
        <span>状态：</span>
        <el-button icon="search" type="primary" style="margin-bottom:10px;" @click="getList()">搜索</el-button>

        <el-button type="primary" style="float:right;" @click="selectConfirm">确认选择</el-button>
      </p>

      <el-table :data="sourceListData"
                border highlight-current-row
                @selection-change="handleSelectionChange">
                style="width:100%;margin:10px 0;">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>

        <el-table-column label="序号" prop="index" width="65">
          <template scope="scope">
            {{scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column prop="sourceName" label="资源名称">
        </el-table-column>
        <el-table-column prop="realname" label="上传人">
        </el-table-column>
        <el-table-column prop="gmtUpload" label="上传时间">
          <template scope="scope">
            {{$commonFun.formatDate(scope.row.gmtUpload,"yyyy-MM-dd")}}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        newSourceUrl: "/pmpheep/activitySource/newSource",
        getSourceListUrl: "/pmpheep/activitySource/getSourceList",
        activitySourceChainUrl:"/pmpheep/activitySource/addActivitySourceChain",
        getActivityUrl:'/pmpheep/activity/getActivity/',
        deleteSourceUrl:'/pmpheep/activitySource/deleteSourceById/',
        dialogVisible: false,
        selectSourceVisible: false,
        sourceListData: [],
        selectSourceList: [],
        editData:'',
        searchParams: {
          sourceName:'',
          pageSize: 10,
          pageNumber: 1,
        },
        sourceParams:{
            activityId:'',
            sources:''
        },
        formData: {
          file: [],
          attachment: [],
          sourceName: '',
          fileList: [],
        },
        dialogForm: {
          file: [],
          attachment: [],
          sourceName: '',
          fileList: [],
        },
        fileList: [],
        selectSourceRow: {},
        coverUploadUrl: '/pmpheep/file/image/upload',
        fileUploadUrl: this.$config.BASE_URL + 'messages/message/file',
        formRules: {
          title: [
            {required: true, message: "标题不能为空", trigger: "blur"},
            {min: 1, max: 100, message: "标题不能超过100个字符", trigger: "change"}
          ],
          authorname: [
            {required: true, message: "所属来源不能为空", trigger: "blur"},
            {min: 1, max: 40, message: "所属来源不能超过40个字符", trigger: "change"}
          ],
          categoryId: [{type: 'number', required: true, message: "请选择所属栏目", trigger: "change,blur"}],
          summary: [{min: 1, max: 50, message: "摘要内容不能超过50个字符", trigger: "change"}],
          keyword: [{min: 1, max: 50, message: "关键字不能超过50个字符", trigger: "change"}],
          isStick: [
            /* {validator:this.$formCheckedRules.numberChecked,trigger: "blur"},
            { min:1,max:10, message: "显示顺序不能超过10个字符", trigger: "blur" }, */
            {type: 'boolean', message: '请选择是否置顶', trigger: 'change'}
          ]
        },
        dialogRules: {
          activityName: [
            {required: true, message: '请输入视频名称', trigger: 'blur'},
            {min: 1, max: 50, message: '视频名称不能超过50个字符', trigger: 'blur,change'}
          ],
          imgList: [
            {type: 'array', required: true, message: '请上传视频封面', trigger: 'change'}
          ],
          videoList: [
            {type: 'array', required: true, message: '请上传视频内容', trigger: 'change'}
          ]

        }
      }
    },
    methods: {
      downFile(obj){
        this.$commonFun.downloadFile('/pmpheep/file/download/'+obj.fileId);
      },
      selectConfirm() {
        this.sourceParams.sources="";
        this.sourceParams.activityId='';
        if(this.selectSourceRow.length>0){
          this.sourceParams.activityId=this.editData.id;
          this.selectSourceRow.forEach((i) => {
              this.sourceParams.sources+=i.id+",";
          });
          this.sourceParams.sources= this.sourceParams.sources.substr(0, this.sourceParams.sources.length - 1);
          /*this.sourceParams.sources=this.selectSourceRow;*/
            this.$axios.get(this.activitySourceChainUrl, {
              params: this.sourceParams
            }).then((res) => {
              if (res.data.code == 1) {
                this.selectSourceVisible=false;
                this.$message.success("资源关联成功");
                this.backEditActivity();
              }
            })
        }else{
          this.$message.error("未选择任何资源");
        }
      },
      handleSelectionChange(rows) {
        if (rows) {
          this.selectSourceRow = rows;
        }
      },
      selectSource() {
        this.selectSourceVisible = true;
        this.$axios.get(this.getSourceListUrl, {
          params: this.searchParams
        })
          .then((res) => {
            console.log(res);
            if (res.data.code == 1) {
              this.selectSourceList = res.data.data.rows;
              this.pageTotal = res.data.data.total;
              console.log(tableData.toString());
            }
          })


      },
      fileUpload() {
        this.dialogVisible = true;
      },

      /* 文件移除回调 */
      uploadFileRemove(file, flielist) {
        this.fileList = flielist;
        if (!this.isEditContent) {
          this.dialogForm.file = [];
          flielist.forEach((i) => {
            this.dialogForm.file.push(i.response.data);
          });
        } else {
          if (file.attachment) {
            if (!this.dialogForm.attachment) {
              this.dialogForm.attachment = [];
            }
            this.dialogForm.attachment.push(file.attachment);
          }
        }

      },
      /* 文件上传成功回调 */
      upLoadFileSuccess(res, file, filelist) {
        this.fileList = [];
        this.dialogForm.file = [];

        if (res.code == 1) {
          this.dialogForm.sourceName=file.name;
          this.fileList.push(file) ;
            if (file.response) {
              this.dialogForm.file.push(file.response.data);
            }
        }
      },
      /* 文件上传大小判断 */
      beforeAvatarUpload(file) {
        console.log(file);
        console.log(typeof file);
        const isLt100M = file.size / 1024 / 1024 <= 200;
        if (!isLt100M) {
          this.$confirm('上传文件大小不能超过 200MB!', "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            showCancelButton: false,
            type: "error"
          });
        }
        if (file.size == 0) {
          this.$confirm('请勿上传大小为0kb的空文件', "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            showCancelButton: false,
            type: "error"
          });
          return false;
        }
        /* .com .bat .exe */
        if ((file.name.indexOf('.bat') != -1 || file.name.indexOf('.exe') != -1 || file.name.indexOf('.com')) != -1) {
          console.log()
          this.$confirm('请勿上传可执行文件', "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            showCancelButton: false,
            type: "error"
          });
          return false;
        }
        if (file.name.length > 80) {
          this.$confirm('附件名称长度过长', "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            showCancelButton: false,
            type: "error"
          });
          return false;
        }
        return isLt100M;
      },
      fileUp() {
        if(this.dialogForm.file.length==0){
          this.$message.error("文件不能为空");
          return;
        }
        this.$axios
          .post(this.newSourceUrl, this.$commonFun.initPostData(this.dialogForm))
          .then(res => {
            console.log(res);
            if (res.data.code == 1) {
              this.$message.success("上传资源成功");
              this.dialogVisible = false;
              this.getList();

            } else {
              this.$confirm(res.data.msg, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                showCancelButton: false,
                type: "error"
              });
            }
          });
      }
      ,
      /* 获取视频列表 */
      getList() {
        this.$axios.get(this.getSourceListUrl, {
          params: this.searchParams
        })
          .then((res) => {
            console.log(res);
            if (res.data.code == 1) {
              this.sourceListData = res.data.data.rows;
              this.pageTotal = res.data.data.total;
              console.log(tableData.toString());
            }
          })
      },
      init(){
        this.editData = this.$router.currentRoute.params;
      },

      delSourceByid(obj){
        this.$axios
          .get(this.deleteSourceUrl + obj.id + "/del", {})
          .then(res => {
            console.log(res);
            if (res.data.code == 1) {
              this.$message.success("删除成功");
              this.getList();
            }else{
              this.$message.error("删除失败");
              this.getList();

            }
          });

    },
      backEditActivity() {
        if(this.editData.id!=null){
          this.$axios
            .get(this.getActivityUrl + this.editData.id + "/search", {})
            .then(res => {
              console.log(res);
              if (res.data.code == 1) {
                this.$router.push({
                  name: "添加活动",
                  params: res.data.data,
                  query: { type: "edit", columnId: 1 ,isShowCover:true}
                });
              }
            });
        }else{
          this.$router.go(-1);
        }

      },

    },
    created() {
      this.init();
      this.getList();
    },

  }
</script>

<style scoped>
  .top-nav {
    /* float: left; */
    width: 100%;
    position: relative;
    height: 43px;
    background-color: rgb(238, 241, 246);
    border: 1px solid rgb(209, 217, 229);
    box-sizing: border-box;
  }

  .top-nav .header_title_tips {
    margin-bottom: 15px;
    /* float:left; */
    color: #fff;
    position: absolute;
    left: -8px;
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

  .top-nav .header_back_tips p {
    float: right;
    height: 43px;
    font-size: 17px;
    padding: 2px 20px 2px 15px;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
