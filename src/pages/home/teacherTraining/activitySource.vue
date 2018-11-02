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

    <p style="text-align: left;margin-top: 20px;font-size: 16px" :data="editData">活动名称: {{editData.activityName}}</p>
    <p class="header_p" style="margin-top: 30px;font-size: 16px">
      <span>资源名称：</span>
      <el-input class="input" style="width:300px;margin-right:10px;" v-model="searchParams.sourceName"
                @keyup.enter.native="getList()"
                placeholder="请输入资源名称"></el-input>
      <el-button icon="search" type="primary" style="margin-bottom:10px;" @click="getList()">搜索</el-button>
      <el-button type="primary" style="float:right;margin-right: 15px;;margin-bottom:10px" @click="selectSource">选择资源</el-button>
      <el-button type="primary" style="float:right;margin-right: 15px;margin-bottom:10px" @click="fileUpload">上传资源</el-button>
    </p>

    <el-table :data="sourceListData" border highlight-current-row style="width:100%;margin:10px 0;">
      <el-table-column label="序号" prop="index" width="80" align="center">
        <template scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column prop="sourceName" label="资源名称" header-align="center" align="left">
      </el-table-column>
      <el-table-column prop="realname" label="上传人" align="center">
      </el-table-column>
      <el-table-column prop="gmtUpload" label="上传时间" align="center">
        <template scope="scope">
          {{$commonFun.formatDate(scope.row.gmtUpload,"yyyy-MM-dd")}}
        </template>
      </el-table-column>
      <el-table-column prop="infoExpressName" label="操作" align="center">
        <template scope="scope">
          <el-button type="text" style="color:#337ab7;" @click="delChain(scope.row)">删除</el-button>
          <a  style="color:#337ab7;font-size: 18px" >|</a>
          <el-button type="text" style="color:#337ab7;" @click="downFile(scope.row)">下载</el-button>
          <a  style="color:#337ab7;font-size: 18px" >|</a>
          <el-button type="text" style="color:#337ab7;" @click="updateChian(scope.row,'up')"  v-if="scope.sort!=0" >上移</el-button>
          <a  style="color:#337ab7;font-size: 18px" >|</a>
          <el-button type="text" style="color:#337ab7;" @click="updateChian(scope.row,'down')">下移</el-button>

        </template>
        </el-table-column>

    </el-table>
    <div class="pagination-wrapper">
      <el-pagination
        v-if="pageTotal>searchParams.pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="searchParams.pageNumber"
        :page-sizes="[10,20,30,50]"
        :page-size="searchParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageTotal">
      </el-pagination>
    </div>
    <el-dialog class='upload_dialog' title="资源上传" :visible.sync="dialogVisible" size="tiny" width="100%">
      <el-form ref="dialogForm" :model="dialogForm" :rules="dialogRules" label-width="100px">

        <el-form-item label="资源名称：" required >
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
              <i class="fa fa-paperclip fa-lg"></i> 选择文件</span>
              <div slot="tip" class="el-upload__tip" style="line-height:1;">文件大小不超过200M</div>
            </my-upload>
          </div>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="fileUp">保 存</el-button>
                <el-button @click="dialogVisible = false">关闭</el-button>
            </span>
    </el-dialog>

    <el-dialog title="资源选择" :visible.sync="selectSourceVisible" size="small" width="100%">
      <p class="header_p" style="margin-top: 0px">
        <span>资源名称：</span>
        <el-input class="input" style="width:300px;margin-right:10px;" v-model="selectParams.sourceName"
                  @keyup.enter.native="search"
                  placeholder="请输入资源名称"></el-input>
        <el-button icon="search" type="primary" style="margin-bottom:10px;" @click="search()">搜索</el-button>

        <el-button type="primary" style="float:right;;margin-right: 10px" @click="selectConfirm">确认选择</el-button>
      </p>

      <el-table  ref="table"
        :data="selectSourceList"
                border highlight-current-row
                @selection-change="handleSelectionChange">
                style="width:100%;margin:10px 0;">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>

        <el-table-column label="序号" prop="index" width="80" align="center">
          <template scope="scope">
            {{scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column prop="sourceName" label="资源名称" header-align="center" align="left">
        </el-table-column>
        <el-table-column prop="realname" label="上传人" align="center">>
        </el-table-column>
        <el-table-column prop="gmtUpload" label="上传时间" align="center">>
          <template scope="scope">
            {{$commonFun.formatDate(scope.row.gmtUpload,"yyyy-MM-dd")}}
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrapper">
        <el-pagination style="margin-top: 10px"
          v-if="sourcepageTotal>selectParams.pageSize"
          @size-change="selectSizeChange"
          @current-change="selectCurrentChange"
          :current-page.sync="selectParams.pageNumber"
          :page-sizes="[10,20,30,50]"
          :page-size="selectParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="sourcepageTotal">
        </el-pagination>
      </div>
    </el-dialog>


  </div>
</template>

<script>
  export default {
    data() {
      return {
        multipleSelectionAll: [],   // 所有选中的数据包含跨页数据
        multipleSelection: [],   // 当前页选中的数据
        idKey: 'activitySourceId', // 标识列表数据中每一行的唯一键的名称(需要按自己的数据改一下)
        newSourceUrl: "/pmpheep/activitySource/newSource",
        getSourceListUrl: "/pmpheep/activitySource/getSourceList",
        activitySourceChainUrl:"/pmpheep/activitySource/addActivitySourceChain",
        getActivityUrl:'/pmpheep/activity/getActivity/',
        deleteSourceUrl:'/pmpheep/activitySource/deleteSourceById/',
        updateSortUrl: "/pmpheep/activitySource/updateSort",
        getSourceChainUrl: "/pmpheep/activitySource/getSourceChain",
        getChainListUrl: "/pmpheep/activitySource/getChainList",
        deleteChainSourceUrl:'/pmpheep/activitySource/delChainSourceByid',
        updateChianUrl: "/pmpheep/activitySource/updateChainSort",
        dialogVisible: false,
        selectSourceVisible: false,
        sourceListData: [],
        selectSourceList: [],
        sourceChainList:[],
        pageTotal:20,
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
        selectParams:{
          sourceName:'',
          pageSize: 10,
          pageNumber: 1,
        },
        sourcepageTotal:20,
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

      delChain(obj){
          this.$axios
            .get(this.deleteChainSourceUrl, {
              params:{
                activityId:this.editData.id,
                activitySourceId:obj.id
              }
            })
            .then(res => {
              console.log(res);
              if (res.data.code == 1) {
                this.$message.success("删除成功");
                this.getList();
              }else{
                this.$message.error("删除失败");
                this.getList();

              }
            })
      },

      updateChian(row,type){
        this.$axios.get(this.updateChianUrl, {
          params: {
            activityId:this.editData.id,
            activitySourceId:row.id,
            sort:row.sort,
            type:type
          }
        }).then((res) => {
          if (res.data.code == 1) {
            if(res.data.data.code==0){
              this.$message.error("移动错误");
              return;
            }
            this.getList();
          }
        })
      },

      updateSort(row,type){
        this.$axios.get(this.updateSortUrl, {
          params: {
            sourceName:this.searchParams.sourceName,
            pageSize:this.searchParams.pageSize,
            PageNumber:this.searchParams.PageNumber,
            id:row.id,
            type:type
          }
        }).then((res) => {
          if (res.data.code == 1) {
            this.getList();
          }
        })




      },
      downFile(obj){
        this.$commonFun.downloadFile('/pmpheep/file/download/'+obj.fileId);
      },
      selectConfirm() {

        this.sourceParams.sources="";
        this.sourceParams.activityId='';
        this.changePageCoreRecordData();
        if(this.sourceChainList.length>0){
          this.sourceParams.activityId=this.editData.id;
          this.sourceChainList.forEach(i => {
            this.sourceParams.sources+=i.activitySourceId+",";
          });
          this.sourceParams.sources= this.sourceParams.sources.substr(0, this.sourceParams.sources.length - 1);
          /*this.sourceParams.sources=this.selectSourceRow;*/
            this.$axios.get(this.activitySourceChainUrl, {
              params: this.sourceParams
            }).then((res) => {
              if (res.data.code == 1) {
                this.selectSourceVisible=false;
                this.$message.success("资源关联成功");
                this.getList();
              }
            })
        }else{
          this.$message.error("未选择任何资源");
        }
      },
      handleSelectionChange(val) {
        // table组件选中事件,记得加上@selection-change="handleSelectionChange"
        this.multipleSelection = val;
      },
      selectSource() {
        this.selectSourceVisible = true;
        this.selectSearch();
        this.searchChain();
      },
      searchChain(){
        this.$axios.get(this.getSourceChainUrl, {
          params: {
            id:this.editData.id
          }
        })
          .then((res) => {
            console.log(res);
            if (res.data.code == 1) {
              if (this.sourceChainList.length <= 0){
                this.sourceChainList=res.data.data;
              }
              this.setSelectRow();

            }
          })


      },

      selectSearch(){
        this.$axios.get(this.getSourceListUrl, {
          params: this.selectParams
        })
          .then((res) => {
            console.log(res);
            if (res.data.code == 1) {
              this.selectSourceList = res.data.data.rows;
              for (var i = 0; i < this.selectSourceList.length; i++) {
                this.selectSourceList[i].activitySourceId = this.selectSourceList[i].id;
              }
              this.searchChain();
              this.sourcepageTotal = res.data.data.total;
              console.log(tableData.toString());

            }
          })
      },
      setSelectRow() {
        if (!this.sourceChainList || this.sourceChainList.length <= 0) {
          return;
        }
        // 标识当前行的唯一键的名称
        let idKey = this.idKey;
        let selectAllIds = [];
        let that = this;
        this.sourceChainList.forEach(row => {
          selectAllIds.push(row[idKey]);
        })
        this.$refs.table.clearSelection();
        for (var i = 0; i < this.selectSourceList.length; i++) {
          if (selectAllIds.indexOf(this.selectSourceList[i][idKey]) >= 0) {
            // 设置选中，记住table组件需要使用ref="table"
            this.$refs.table.toggleRowSelection(this.selectSourceList[i], true);
          }
        }
      },

      // 记忆选择核心方法
      changePageCoreRecordData() {
        // 标识当前行的唯一键的名称
        let idKey = this.idKey;
        let that = this;
        // 如果总记忆中还没有选择的数据，那么就直接取当前页选中的数据，不需要后面一系列计算
        if (this.sourceChainList.length <= 0) {
          this.sourceChainList = this.multipleSelection;
          return;
        }
        // 总选择里面的key集合
        let selectAllIds = [];
        this.sourceChainList.forEach(row => {
          selectAllIds.push(row[idKey]);
        })
        let selectIds = []
        // 获取当前页选中的id
        this.multipleSelection.forEach(row => {
          selectIds.push(row[idKey]);
          // 如果总选择里面不包含当前页选中的数据，那么就加入到总选择集合里
          if (selectAllIds.indexOf(row[idKey]) < 0) {
            that.sourceChainList.push(row);
          }
        })
        let noSelectIds = [];
        // 得到当前页没有选中的id
        this.selectSourceList.forEach(row => {
          if (selectIds.indexOf(row[idKey]) < 0) {
            noSelectIds.push(row[idKey]);
          }
        })
        noSelectIds.forEach(id => {
          if (selectAllIds.indexOf(id) >= 0) {
            for (let i = 0; i < that.sourceChainList.length; i++) {
              if (that.sourceChainList[i][idKey] == id) {
                // 如果总选择中有未被选中的，那么就删除这条
                that.sourceChainList.splice(i, 1);
                break;
              }
            }
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
        this.dialogForm.activityId=this.editData.id;
        this.$axios
          .post(this.newSourceUrl, this.$commonFun.initPostData(this.dialogForm))
          .then(res => {
            console.log(res);
            if (res.data.code == 1) {
              if(res.data.data.code==2){
                this.$message.error("已存在相同的文件名称");
                return;

              }

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
      },
      search(){
        this.selectParams.pageNumber=1;
        this.selectSource();
      }
      ,
      handleSizeChange(val) {
        this.searchParams.pageSize = val;
        this.searchParams.pageNumber = 1;
        this.getList();
      },
      handleCurrentChange(val) {
        this.searchParams.pageNumber = val;
        this.getList();
      },

      selectSizeChange(val) {
        this.selectParams.pageSize = val;
        this.selectParams.pageNumber = 1;
        this.selectSource();
        this.changePageCoreRecordData();
      },
      selectCurrentChange(val) {
        this.selectParams.pageNumber = val;
        this.selectSource();
        this.changePageCoreRecordData();
      },
      /* 获取视频列表 */
      getList() {
        this.searchParams.activityId=this.editData.id;
        this.$axios.get(this.getChainListUrl, {
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
                  name: "活动详情",
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
  .my-upload-list__item{
    font-size: 14px;
    color: #48576a;
    line-height: 1.8;
    width: 100%;

  }
   .upload_dialog {
    min-width: 660px;
  }
</style>
