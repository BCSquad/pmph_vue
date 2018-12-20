<template>
  <div class="activity_video">
    <div class="top-nav">
      <div class="header_title_tips">
        <p>活动视频</p>
        <div class="tips_icon"></div>
      </div>
      <div class="header_back_tips">
        <p>
          <el-button href="#" @click="backEditActivity">< 返回上一步</el-button>
        </p>
      </div>
    </div>

    <p style="text-align: left;margin-top: 20px;font-size: 16px" :data="editData">活动名称: {{editData.activityName}}</p>
    <p class="header_p" style="margin-top: 30px">
      <span>视频标题：</span>
      <el-input class="input" style="width:300px;margin-right:10px;" v-model="searchParams.title"
                @keyup.enter.native="getList()"
                placeholder="请输入资源名称"></el-input>
      <el-button icon="search" type="primary" style="margin-bottom:10px;" @click="getList()">搜索</el-button>

      <el-button type="primary" style="float:right;margin-right: 15px" @click="search">选择视频</el-button>
      <el-button type="primary" style="float:right;margin-right: 15px" @click="openAddVideoDialog">上传视频</el-button>
    </p>

    <el-table :data="videoListData" border highlight-current-row style="width:100%;margin:10px 0;">
      <el-table-column prop="index" width="80" label="序号" align="center">
        <template scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      playVideo
      <el-table-column prop="cover" label="封面" align="center">
        <template scope="scope">
          <img style="width: 88px;height: 86px;" :src="'/pmpheep/image/'+scope.row.cover" @click="playVideo(scope.row)">
        </template>
      </el-table-column>
      <el-table-column prop="title" label="视频标题" align="center">
      </el-table-column>
      <el-table-column prop="realname" label="上传人" align="center">
      </el-table-column>
      <el-table-column prop="gmtCreate" label="上传时间" align="center">
        <template scope="scope">
          {{$commonFun.formatDate(scope.row.gmtCreate,"yyyy-MM-dd")}}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template scope="scope" align="center">
          <el-button type="text" style="color:#337ab7;" @click="delChain(scope.row)">删除</el-button>
          <a style="color:#337ab7;font-size: 18px">|</a>
          <a style="color:#337ab7;" :href="videoDownLoad(scope.row)">下载</a>
          <a style="color:#337ab7;font-size: 18px">|</a>
          <el-button type="text" style="color:#337ab7;" @click="updateChian(scope.row,'up')">上移</el-button>
          <a style="color:#337ab7;font-size: 18px">|</a>
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
    <el-dialog :visible.sync="isShowVideoPlayer" size="tiny" :close-on-click-modal="false" class="video_player_dialog">
      <video :src="videoSrc" controls="controls" autoplay v-if="isShowVideoPlayer">
        您的浏览器不支持 video 标签。
      </video>
    </el-dialog>

    <el-dialog title="视频选择" :visible.sync="selectVideoVisible" size="small" width="100%">
      <p class="header_p" style="margin-top: 0px">
        <span>视频标题：</span>
        <el-input class="input" style="width:300px;margin-right:10px;" v-model="videoSearch.title"
                  @keyup.enter.native="searchVideo"
                  placeholder="请输入视频标题"></el-input>
        <el-button icon="search" type="primary" style="margin-bottom:10px;" @click="searchVideo()">搜索</el-button>

        <el-button type="primary" style="float:right;margin-right: 10px" @click="selectConfirm">确认选择</el-button>
      </p>

      <el-table ref="table"
                :data="vListData"
                border highlight-current-row
                @selection-change="handleSelectionChange">
        style="width:100%;margin:10px 0;">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column prop="index" label="序号" width="80" align="center">>
          <template scope="scope">
            {{scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column label="封面" align="center">>
          <template scope="scope">
            <img style="width: 88px;height: 86px;" :src="'/pmpheep/image/'+scope.row.cover"
                 @click="playVideo(scope.row)">
          </template>
        </el-table-column>
        <el-table-column prop="title" label="视频标题" align="center">>
        </el-table-column>
        <el-table-column prop="realname" label="上传人" align="center">>
        </el-table-column>
        <el-table-column prop="gmt_create" label="上传时间" align="center">>
          <template scope="scope">
            {{$commonFun.formatDate(scope.row.gmtCreate,"yyyy-MM-dd")}}
          </template>
        </el-table-column>
        </el-table-column>
      </el-table>
      <div class="pagination-wrapper">
        <el-pagination style="margin-top: 10px"
          v-if="videopageTotal>videoSearch.pageSize"
          @size-change="videoSizeChange"
          @current-change="videoCurrentChange"
          :current-page.sync="videoSearch.pageNumber"
          :page-sizes="[10,20,30,50]"
          :page-size="videoSearch.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="videopageTotal">
        </el-pagination>
      </div>
    </el-dialog>


    <el-dialog title="视频上传" :visible.sync="dialogVisible" size="tiny" width="100%">
      <el-form ref="dialogForm" :model="dialogForm" :rules="dialogRules" label-width="100px">
        <el-form-item label="视频标题：" prop="videoName">
          <el-input v-model="dialogForm.videoName" placeholder="请输入视频标题"></el-input>
        </el-form-item>
        <el-form-item label="视频封面：" prop="imgList">
          <el-upload
            action="#"
            style="float:left;width:260px;"
            name="files"
            :on-remove="imgUploadRemove"
            :auto-upload="false"
            :on-change="imgUploadChange"
            :file-list="dialogForm.imgList">
            <el-button size="small" type="primary">上传封面</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="视频上传：" prop="videoList">
          <el-upload
            style="float:left;width:260px;"
            action="/v/upload"
            name="file"
            :auto-upload="true"
            :on-remove="videoUploadRemove"
            :before-upload="videoBeforeUpload"
            :on-success="videoUploadSuccess"
            :file-list="dialogForm.videoList">
            <el-button size="small" type="primary">上传视频</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addVideoSubmit" :loading="isUploadVideo" :disabled="isdisabled">{{isUploadVideo?'转码中':'保 存'}}</el-button>
                <el-button @click="dialogVisible = false">关 闭</el-button>
            </span>
    </el-dialog>


  </div>
</template>

<script>
  export default {
    data() {
      return {

        multipleSelectionAll: [],   // 所有选中的数据包含跨页数据
        multipleSelection: [],   // 当前页选中的数据
        idKey: 'activityVideoId', // 标识列表数据中每一行的唯一键的名称(需要按自己的数据改一下)
        tableData: [], // 表格数
        videoListUrl: '/pmpheep/activityVideo/getVideoList',  //视频列表url
        deleteVideoUrl: '/pmpheep/activityVideo/deleteVideoById/',   //删除微视频
        examVideoUrl: '/pmpheep/bookVideo/audit', //  审核视频url
        getActivityUrl: '/pmpheep/activity/getActivity/',
        activitySourceChainUrl: "/pmpheep/activityVideo/addActivitySourceChain",
        addNewVideoUrl: '/pmpheep/activityVideo/addActivityVideo',   //添加提交视频url
        transCodingUrl: "/v/query",   //查询视频转码地址
        updateSortUrl: '/pmpheep/activityVideo/updateSort',  //视频列表url
        getVideoChainUrl: "/pmpheep/activityVideo/getVideoChain",
        getChainListUrl: "/pmpheep/activityVideo/getChainList",
        deleteChainVideoUrl: "/pmpheep/activityVideo/delChainVideoByid",
        updateChainUrl: '/pmpheep/activityVideo/updateChainSort',  //视频列表url
        videoListData: [],
        bookDialogVisible: false,
        isShowVideoPlayer: false,
        dialogVisible: false,
        examDialogVisible: false,
        isUploadVideo: false,
        selectVideoVisible: false,
        VideoChainList: [],
        dialogForm: {
          videoName: '',
          videoList: [],
          imgList: [],
          transCoding: []
        },
        videoParams: {
          activityId: '',
          videos: ''
        },
        videoSearch: {
          title: '',
          pageSize: 10,
          pageNumber: 1,
        },
        vListData: [],
        selectVideoRow: {},
        videoSrc: '',
        isdisabled: false,
        pageTotal: 100,
        searchParams: {
          title: '',
          pageSize: 10,
          pageNumber: 1,
        },
        currentBook: {},
        currentExamId: '',
        bookParams: {
          name: '',
          pageSize: 10,
          pageNumber: 1,
        },
        videopageTotal: 20,
        dialogRules: {
          videoName: [
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
      delChain(obj) {
        this.$axios
          .get(this.deleteChainVideoUrl, {
            params: {
              activityId: this.editData.id,
              activityVideoId: obj.id
            }
          })
          .then(res => {
            console.log(res);
            if (res.data.code == 1) {
              this.$message.success("删除成功");
              this.getList();
            } else {
              this.$message.error("删除失败");
              this.getList();

            }
          })
      },
      updateChian(row,type){
        this.$axios.get(this.updateChainUrl, {
          params: {
            activityId:this.editData.id,
            activityVideoId:row.id,
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

      updateSort(row, type) {
        this.$axios.get(this.updateSortUrl, {
          params: {
            sourceName: this.searchParams.sourceName,
            pageSize: this.searchParams.pageSize,
            PageNumber: this.searchParams.PageNumber,
            id: row.id,
            type: type
          }
        }).then((res) => {
          if (res.data.code == 1) {
            this.getList();
          }
        })

      },

      delVideoByid(obj) {
        this.$axios
          .get(this.deleteVideoUrl + obj.id + "/del", {})
          .then(res => {
            console.log(res);
            if (res.data.code == 1) {
              this.$message.success("删除成功");
              this.getList();
            } else {
              this.$message.error("删除失败");
              this.getList();

            }
          });

      },

      selectConfirm() {
        let activityVideoChainList=[];
        this.videoParams.videos = "";
        this.videoParams.activityId = '';
        this.changePageCoreRecordData();
        if (this.VideoChainList.length > 0) {
          this.videoParams.activityId = this.editData.id;
          this.VideoChainList.forEach(i => {
            this.videoParams.videos += i.activityVideoId + ",";
          });
          this.videoParams.videos = this.videoParams.videos.substr(0, this.videoParams.videos.length - 1);
          /*this.videoParams.sources=this.selectVideoRow;*/
          this.$axios.get(this.activitySourceChainUrl, {
            params: this.videoParams
          }).then((res) => {
            if (res.data.code == 1) {
              this.selectVideoVisible = false;
              this.$message.success("资源关联成功");
              this.getList();
            }
          })
        } else {
          this.$message.error("未选择任何资源");
        }
      },
      handleSelectionChange(val) {
        // table组件选中事件,记得加上@selection-change="handleSelectionChange"
        this.multipleSelection = val;
      },
      selectVideo() {
        this.selectVideoVisible = true;
        this.searchSelect();
        this.searchChain();
      },
      searchChain() {
        this.$axios.get(this.getVideoChainUrl, {
          params: {
            id: this.editData.id
          }
        })
          .then((res) => {
            console.log(res);
            if (res.data.code == 1) {
              if (this.VideoChainList.length <= 0) {
                this.VideoChainList = res.data.data;
              }
              this.setSelectRow();
            }
          })


      },
      // 设置选中的方法
      setSelectRow() {
        if (!this.VideoChainList || this.VideoChainList.length <= 0) {
          return;
        }
        // 标识当前行的唯一键的名称
        let idKey = this.idKey;
        let selectAllIds = [];
        let that = this;
        this.VideoChainList.forEach(row => {
          selectAllIds.push(row[idKey]);
        })
        this.$refs.table.clearSelection();
        for (var i = 0; i < this.vListData.length; i++) {
          if (selectAllIds.indexOf(this.vListData[i][idKey]) >= 0) {
            // 设置选中，记住table组件需要使用ref="table"
            this.$refs.table.toggleRowSelection(this.vListData[i], true);
          }
        }
      },

      // 记忆选择核心方法
      changePageCoreRecordData() {
        // 标识当前行的唯一键的名称
        let idKey = this.idKey;
        let that = this;
        // 如果总记忆中还没有选择的数据，那么就直接取当前页选中的数据，不需要后面一系列计算
        if (this.VideoChainList.length <= 0) {
          this.VideoChainList = this.multipleSelection;
          return;
        }
        // 总选择里面的key集合
        let selectAllIds = [];
        this.VideoChainList.forEach(row => {
          selectAllIds.push(row[idKey]);
        })
        let selectIds = []
        // 获取当前页选中的id
        this.multipleSelection.forEach(row => {
          selectIds.push(row[idKey]);
          // 如果总选择里面不包含当前页选中的数据，那么就加入到总选择集合里
          if (selectAllIds.indexOf(row[idKey]) < 0) {
            that.VideoChainList.push(row);
          }
        })
        let noSelectIds = [];
        // 得到当前页没有选中的id
        this.vListData.forEach(row => {
          if (selectIds.indexOf(row[idKey]) < 0) {
            noSelectIds.push(row[idKey]);
          }
        })
        noSelectIds.forEach(id => {
          if (selectAllIds.indexOf(id) >= 0) {
            for (let i = 0; i < that.VideoChainList.length; i++) {
              if (that.VideoChainList[i][idKey] == id) {
                // 如果总选择中有未被选中的，那么就删除这条
                that.VideoChainList.splice(i, 1);
                break;
              }
            }
          }
        })
      },

      searchVideo(){
        this.videoSearch.pageNumber = 1;
        this.searchSelect();
      },
      searchSelect() {
        this.$axios.get(this.videoListUrl, {
          params: this.videoSearch
        })
          .then((res) => {
            console.log(res);
            if (res.data.code == 1) {
              this.vListData = res.data.data.rows;
              for (var i = 0; i < this.vListData.length; i++) {
                this.vListData[i].activityVideoId = this.vListData[i].id;
              }
              this.searchChain();
              this.videopageTotal = res.data.data.total;
            }
          })
      },


      /* 获取视频列表 */
      getList() {
        this.searchParams.activityId = this.editData.id;
        this.$axios.get(this.getChainListUrl, {
          params: this.searchParams
        })
          .then((res) => {
            console.log(res);
            if (res.data.code == 1) {
              this.videoListData = res.data.data.rows;
              this.pageTotal = res.data.data.total;
            }
          })
      },
      /* 搜索按钮 */
      search() {
        this.searchParams.pageNumber = 1;
        this.videoSearch.pageNumber = 1;
        this.selectVideo();
      },
      /* 开始时间格式重置 */
      startDateChange(val) {
        this.searchParams.upLoadTimeStart = val;
      },
      /* 结束时间重置 */
      endDateChange(val) {
        this.searchParams.upLoadTimeEnd = val;
      },
      /* 列表分页改变 */
      handleSizeChange(val) {
        this.searchParams.pageSize = val;
        this.searchParams.pageNumber = 1;
        this.getList();
      },
      handleCurrentChange(val) {
        this.searchParams.pageNumber = val;
        this.getList();
      },
      videoSizeChange(val) {
        this.videoSearch.pageSize = val;
        this.videoSearch.pageNumber = 1;
        this.searchSelect();
        this.changePageCoreRecordData();
      },
      videoCurrentChange(val) {
        this.videoSearch.pageNumber = val;
        this.searchSelect();
        this.changePageCoreRecordData();
      },

      openAddVideoDialog() {
        this.dialogVisible = true;
      },
      /* 审核微视频 */
      examVideo(val) {
        console.log(val);
        this.examDialogVisible = true;
        this.currentExamId = val.id;
      },
      /* 审核 */
      examSubmit(bool) {
        this.$axios.put(this.examVideoUrl, this.$commonFun.initPostData({
          id: this.currentExamId,
          isAuth: bool
        })).then((res) => {
          console.log(res);
          if (res.data.code == 1) {
            this.$message.success('操作成功');
            this.getList();
            this.examDialogVisible = false;
          } else {
            this.$confirm(res.data.msg.msgTrim(), "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              showCancelButton: false,
              type: "error"
            });
          }
        })
      },
      /* 删除微视频 */
      deleteVideo(obj) {

        this.$confirm('确定删除微视频：<' + obj.title + '>?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.put(this.deleteVideoUrl, this.$commonFun.initPostData({
            id: obj.id
          })).then((res) => {
            if (res.data.code == 1) {
              this.$message.success('删除成功');
              this.getList();
            }
          })
        }).catch(() => {
          /*this.$message({
              type: 'info',
              message: '已取消删除'
          });*/
        });
      },
      /* 添加上传视频图片 */
      imgUploadRemove(file, fileList) {
        console.log(file, fileList);
        this.dialogForm.imgList = fileList;
        this.$refs.dialogForm.validateField('imgList');
      },
      /* 图片改变 */
      imgUploadChange(file, fileList) {
        this.dialogForm.imgList = fileList;
        var exStr = file.name.split('.').pop().toLowerCase();
        var exSize = file.size ? file.size : 1;
        if (exSize / 1024 / 1024 > 20) {
          this.$confirm('图片的大小不能超过20MB！', "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            showCancelButton: false,
            type: "error"
          });
          this.dialogForm.imgList.pop();
          return false;
        }
        if (exSize == 0) {
          this.$confirm('请勿上传空文件！', "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            showCancelButton: false,
            type: "error"
          });
          this.dialogForm.imgList.pop();
          return false;
        }
        if (exStr != 'png' && exStr != 'jpg' && exStr != 'jpeg') {
          this.$confirm('图片的格式必须为png或者jpg或者jpeg格式！', "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            showCancelButton: false,
            type: "error"
          })
          this.dialogForm.imgList.pop();
          return false;
        }
        if (file.name.length > 80) {
          this.$confirm('图片名称不能超过80个字符！', "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            showCancelButton: false,
            type: "error"
          });
          this.dialogForm.imgList.pop();
          return false;
        }
        this.dialogForm.imgList = [];
        this.dialogForm.imgList.push(file);
        console.log(this.dialogForm.imgList);
        this.$refs.dialogForm.validateField('imgList');

      },
      /* 添加上传视频 */
      videoUploadRemove(file, fileList) {
        this.dialogForm.videoList = fileList;
        this.$refs.dialogForm.validateField('videoList');
      },
      /* 视频验证 */
      videoBeforeUpload(file, fileList) {
        console.log(file, fileList)
        var exStr = file.name.split('.').pop().toLowerCase();
        var exSize = file.size ? file.size : 1;
        /* if(exSize/ 1024 / 1024 > 20){
            this.$confirm('图片的大小不能超过20MB！', "提示",{
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                showCancelButton: false,
                type: "error"
            });
            return false;
        } */
        if (exSize == 0) {
          this.$confirm('请勿上传空文件！', "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            showCancelButton: false,
            type: "error"
          });
          return false;
        }
        if (exStr != 'avi' && exStr != 'mpg' && exStr != 'wmv' && exStr != '3gp' && exStr != 'mov' && exStr != 'mp4' && exStr != 'asf' && exStr != 'asx' && exStr != 'flv') {
          this.$confirm('视频的格式必须为以下格式之一：avi,mpg,wmv,3gp,mov,mp4,asf,asx或flv！', "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            showCancelButton: false,
            type: "error"
          });
          return false;
        }
        if (file.name.length > 80) {
          this.$confirm('视频名称不能超过80个字符！', "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            showCancelButton: false,
            type: "error"
          });
          return false;
        }
      },
      /* 视频上传成功 */
      videoUploadSuccess(res, file, fileList) {
        this.isUploadVideo = true;
        this.videoTransCoding(res.data);
        this.dialogForm.videoList = [];
        this.dialogForm.videoList.push(file);
        this.$refs.dialogForm.validateField('videoList');
        console.log(this.dialogForm)
      },
      /* 视频转码 */
      videoTransCoding(str) {
        this.$axios.get(this.transCodingUrl, {
          params: {key: str}
        }).then((res) => {
          console.log(res);
          if (res.data.code == 1) {
            var obj = res.data.data;
            if (obj.done) {
              if (!obj.error) {
                /* 转码成功 */
                this.isUploadVideo = false;
                this.dialogForm.transCoding = res.data.data;
              } else {
                /* 转码失败 */
                this.$confirm('视频转码失败，请检查视频格式后再重新上传', "提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  showCancelButton: false,
                  type: "error"
                });
                this.dialogForm.videoList = [];
                this.isUploadVideo = false;
              }
            } else {
              /* 正在转码 */
              setTimeout(() => {
                this.videoTransCoding(str);
              }, 1000);
            }
          } else {
            this.$confirm(res.data.msg, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              showCancelButton: false,
              type: "error"
            });
          }
        })
      },
      /* 微视频对话框提交 */
      addVideoSubmit() {
        console.log(this.dialogForm);
        this.$refs.dialogForm.validate((valid) => {
          if (valid) {
            this.isdisabled = true;
            var submitObj = {
              activityId: this.editData.id,
              title: this.dialogForm.videoName,  //标题
              cover: this.dialogForm.imgList[0].raw,   //封面图片Id
              origPath: this.dialogForm.transCoding.origPath,  //原始视频存放路径
              origFileName: this.dialogForm.transCoding.origFileName,  // 原始文件名
              origFileSize: this.dialogForm.transCoding.origFileSize,  //原始文件大小
              path: this.dialogForm.transCoding.path,  //转码后存放路径
              fileName: this.dialogForm.transCoding.fileName, //转码后文件名
              fileSize: this.dialogForm.transCoding.fileSize  //转码后大小
            };
            let config = {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
            let formData = new FormData();
            for (var i in submitObj) {
              formData.append(i, submitObj[i]);
            }

            this.$axios.post(this.addNewVideoUrl, formData, config)
              .then((res) => {
                console.log(res);
                this.isdisabled = false;
                if (res.data.code == 1) {
                  if (res.data.data.code == 2) {
                    this.$message.error("已存在相同的视频标题");
                    return;

                  }


                  this.getList();
                  this.$message.success('添加成功');
                  this.dialogVisible = false;
                  this.bookDialogVisible = false;
                  this.$refs.dialogForm.resetFields();

                }
                else {
                  this.$confirm(res.data.msg.msgTrim(), "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    showCancelButton: false,
                    type: "error"
                  });
                }
              }).catch((error) => {
              this.isdisabled = false;
            })
          } else {
            return;
          }
        })
      },
      /* 下载按钮链接 */
      videoDownLoad(obj) {
        if ((obj.path.indexOf('\\')) > 0) {
          return 'v/download?realname=' + obj.path.split('\\').pop().split('.')[0] + '&filename=' + obj.title;
        } else {
          return 'v/download?realname=' + obj.path.split("/").pop().split('.')[0] + '&filename=' + obj.title;
        }

      },
      playVideo(obj) {
        if ((obj.path.indexOf('\\')) > 0) {
          this.videoSrc = 'v/play/' + obj.path.split('\\').pop();
        } else {
          this.videoSrc = 'v/play/' + obj.path.split("/").pop();
        }

        this.isShowVideoPlayer = true;
      }
      ,
      init() {
        this.editData = this.$router.currentRoute.params;
      },
      backEditActivity() {
        if (this.editData.id != null) {
          this.$axios
            .get(this.getActivityUrl + this.editData.id + "/search", {})
            .then(res => {
              console.log(res);
              if (res.data.code == 1) {
                this.$router.push({
                  name: "活动详情",
                  params: res.data.data,
                  query: {type: "edit", columnId: 1, isShowCover: true}
                });
              }
            });
        } else {
          this.$router.go(-1);
        }

      },


    }, created() {
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

  .activity_video .video_player_dialog .el-dialog__body {
    padding: 0;
    background: none;
  }

  .activity_video .video_player_dialog .el-dialog__header {
    padding: 0;
  }

  .activity_video .video_player_dialog .el-dialog__header .el-dialog__headerbtn {
    margin: 3px;
  }

  .activity_video .video_player_dialog video {
    width: 100%;
    vertical-align: bottom;
    min-height: 300px;
  }

  .mic_video .book_dialog .el-dialog {
    min-width: 660px;
    position: relative;
  }
</style>
 
