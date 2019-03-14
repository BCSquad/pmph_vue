<template>
  <div class="mic_video">
      <p class="header_p">
          <span>图书名称：</span>
          <el-input class="input" v-model="searchParams.bookName" @keyup.enter.native="search" placeholder="请输入图书名称"></el-input>
          <span>状态：</span>
            <el-select v-model="searchParams.state" clearable style="width:150px;margin-right:10px;" placeholder="请选择">
              <el-option label="待审核" value="1"></el-option>
              <el-option label="未通过" value="2"></el-option>
              <el-option label="已通过" value="3"></el-option>
            </el-select>
            <span>上传时间：</span>
                <el-date-picker
                    v-model="searchParams.upLoadTimeStart"
                    type="date"
                    @change="startDateChange"
                    placeholder="选择日期"
                    >
                </el-date-picker>
                <span>—</span>
                <el-date-picker
                    v-model="searchParams.upLoadTimeEnd"
                    type="date"
                    @change="endDateChange"
                    placeholder="选择日期"
                    style="margin-right:5px;"
                    >
                </el-date-picker>
          <el-button icon="search" type="primary" style="margin-bottom:10px;"  @click="search">搜索</el-button>
          <el-button icon="primary" type="primary" style="margin-bottom:10px;"  @click="exportExcel">导出excel</el-button>

          <el-button type="primary"  style="float:right;" @click="selectBook">添加微视频</el-button>
      </p>
      <!-- 列表 -->
      <el-table :data="tableData" border style="width:100%;margin-bottom:10px;">
          <el-table-column label="图书名称" prop="bookName">
          </el-table-column>
          <el-table-column label="微视频" >
              <template scope="scope">
                 <el-button type="text" style="color: #337ab7;" @click="playVideo(scope.row)">{{scope.row.title}}</el-button>
              </template>
          </el-table-column>
          <el-table-column label="上传人" width="130" prop="userName">
          </el-table-column>
          <el-table-column label="上传时间" width="120" >
              <template scope="scope">
                 {{$commonFun.formatDate(scope.row.gmtCreate,'yyyy-MM-dd')}}
              </template>
          </el-table-column>
          <el-table-column label="文件大小" width="110">
              <template scope="scope">
              {{(scope.row.fileSize/1024/1024).toFixed(2)}}M
              </template>
          </el-table-column>
          <el-table-column label="状态" width="90" >
              <template scope="scope">
                {{scope.row.state==1?'待审核':(scope.row.state==2?'未通过':'已通过')}}
              </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
              <template scope="scope">
               <a  style="color:#337ab7;margin-right:5px;" :href="videoDownLoad(scope.row)">下载</a>
               <el-button type="text" style="color:#337ab7;" @click="examVideo(scope.row)">审核</el-button>
               <el-button type="text" style="color:#337ab7;" @click="deleteVideo(scope.row)">删除</el-button>
              </template>
          </el-table-column>
      </el-table>
          <!--分页-->
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
    <!-- 选择书籍弹框  -->
    <el-dialog
        title="选择书籍"
        :visible.sync="bookDialogVisible"
        class='book_dialog'
        size="tiny"
        >
        <p class="header_p"><span>书籍名称：</span>
          <el-input class="input" v-model="bookParams.name" placeholder="请输入书籍名称"></el-input>
          <el-button type="primary" icon="search" @click="bookSearch">搜索</el-button>
        </p>
        <el-table :data="bookListData" border highlight-current-row style="width:100%;margin:10px 0;">
          <el-table-column prop="bookname" label="书籍名称">
           </el-table-column>
          <el-table-column label="书籍类型" prop="typeName" width="130">
          </el-table-column>
          <el-table-column label="操作" width="80">
            <template scope="scope">
                <el-button type="text" style="color:#337ab7;" @click="openAddVideoDialog(scope.row)">选择</el-button>
            </template>
          </el-table-column>
        </el-table>
          <!--分页-->
            <div class="pagination-wrapper">
            <el-pagination
                v-if="bookTotal>bookParams.pageSize"
                @size-change="bookSizeChange"
                @current-change="bookCurrentChange"
                :current-page.sync="bookParams.pageNumber"
                :page-sizes="[10,20,30,50]"
                :page-size="bookParams.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="bookTotal">
            </el-pagination>
            </div>
    </el-dialog>
    <!-- 上传视频对话框 -->
    <el-dialog title="添加微视频" :visible.sync="dialogVisible" size="tiny" width="100%">
       <el-form ref="dialogForm" :model="dialogForm" :rules="dialogRules"  label-width="100px" >
           <el-form-item label="视频名称：" prop="videoName">
               <el-input v-model="dialogForm.videoName" placeholder="请输入视频名称"></el-input>
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
                  <el-button size="small" type="primary" >点击上传</el-button>
                </el-upload>
           </el-form-item>
           <el-form-item label="视频内容：" prop="videoList">
               <el-upload
                  style="float:left;width:260px;"
                  action="/v/upload"
                  name="file"
                  :auto-upload="true"
                  :on-remove="videoUploadRemove"
                  :before-upload="videoBeforeUpload"
                  :on-success="videoUploadSuccess"
                  :file-list="dialogForm.videoList">
                  <el-button size="small" type="primary" >点击上传</el-button>
                </el-upload>
           </el-form-item>
       </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addVideoSubmit" :loading="isUploadVideo" :disabled="isdisabled">{{isUploadVideo?'转码中':'确 定'}}</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
    </el-dialog>
    <!-- 审核视频弹框 -->
        <el-dialog title="审核" :visible.sync="examDialogVisible" width="25%" size="tiny">
        <span style="font-size:15px;">确定审核该视频吗？</span>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="examSubmit(true)">通过</el-button>
              <el-button type="danger" @click="examSubmit(false)">不通过</el-button>
              <el-button @click="examDialogVisible = false">取 消</el-button>
            </span>
    </el-dialog>
    <!-- 查看视频弹框 -->
    <el-dialog :visible.sync="isShowVideoPlayer" size="tiny" :close-on-click-modal="false"  class="video_player_dialog" >
      <video :src="videoSrc" controls="controls" autoplay v-if="isShowVideoPlayer">
        您的浏览器不支持 video 标签。
        </video>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
    export default{
        data(){
            return{
              videoListUrl:'/pmpheep/bookVideo/getVideoList',  //视频列表url
              deleteVideoUrl:'/pmpheep/bookVideo/deleteBookVideo',   //删除微视频
              examVideoUrl:'/pmpheep/bookVideo/audit', //  审核视频url
              dialogBookUrl:'/pmpheep/books/list',      //书籍列表
              addNewVideoUrl:'/pmpheep/bookVideo/addBookVideo',   //添加提交视频url

              transCodingUrl:"/v/query",   //查询视频转码地址
              tableData:[],
              bookListData:[],
              bookDialogVisible:false,
              isShowVideoPlayer:false,
              dialogVisible:false,
              examDialogVisible:false,
              isUploadVideo:false,
              dialogForm:{
               videoName:'',
               videoList:[],
               imgList:[],
               transCoding:[]
               },
               videoSrc:'',
              isdisabled:false,
              pageTotal:100,
              searchParams:{
                  state:'',
                  bookName:'',
                  upLoadTimeStart:'',
                  upLoadTimeEnd:'',
                  pageSize:10,
                  pageNumber:1,
              },
              currentBook:{},
              currentExamId:'',
              bookParams:{
                 name:'',
                 pageSize:10,
                 pageNumber:1,
              },
              bookTotal:20,
                dialogRules:{
                    videoName:[
                        {required: true, message: '请输入视频名称', trigger: 'blur' },
                        { min: 1, max: 50, message: '视频名称不能超过50个字符', trigger: 'blur,change' }
                    ],
                    imgList:[
                        { type: 'array', required: true, message: '请上传视频封面', trigger: 'change' }
                    ],
                    videoList:[
                        { type: 'array', required: true, message: '请上传视频内容', trigger: 'change' }
                    ]

                }
            }
        },
        created(){
           this.getList();
        },
        methods:{

          /**导出excel */
          exportExcel(){
            console.log(this.title);
            let url = "/pmpheep/bookMicVideo/exportExcel?bookname=" + this.searchParams.bookName ;
            this.$commonFun.downloadFile(url);
          },
            /* 获取视频列表 */
            getList(){
             this.$axios.get(this.videoListUrl,{
                 params:this.searchParams
             })
             .then((res)=>{
                 console.log(res);
                 if(res.data.code==1){
                  this.tableData=res.data.data.rows;
                  this.pageTotal=res.data.data.total;
                 }
             })
            },
            /* 搜索按钮 */
            search(){
             this.searchParams.pageNumber=1;
             this.getList();
            },
            /* 开始时间格式重置 */
            startDateChange(val){
            this.searchParams.upLoadTimeStart=val;
            },
            /* 结束时间重置 */
            endDateChange(val){
            this.searchParams.upLoadTimeEnd=val;
            },
            /* 列表分页改变 */
            handleSizeChange(val){
              this.searchParams.pageSize=val;
              this.searchParams.pageNumber=1;
              this.getList();
            },
            handleCurrentChange(val){
              this.searchParams.pageNumber=val;
              this.getList();
            },
            /* 选择书籍 */
            selectBook(){
                this.$axios.get(this.dialogBookUrl,{
                    params:this.bookParams
                }).then((res)=>{
                    if(res.data.code==1){
                        this.bookListData=res.data.data.rows;
                        this.bookTotal=res.data.data.total;
                        this.bookDialogVisible=true;
                    }
                })
            },
            /* 书籍列表 搜索 */
            bookSearch(){
             this.bookParams.pageNumber=1;
             this.selectBook();
            },
            bookSizeChange(val){
             this.bookParams.pageSize=val;
             this.bookParams.pageNumber=1;
             this.selectBook();
            },
            bookCurrentChange(val){
             this.bookParams.pageNumber=val;
             this.selectBook();
            },
            /* 选择一本书籍 */
            openAddVideoDialog(obj){
                 console.log(obj);
                 this.currentBook=obj;
                 this.dialogVisible=true;
            },
         /* 审核微视频 */
         examVideo(val){
             console.log(val);
            this.examDialogVisible=true;
            this.currentExamId=val.id;
         },
                  /* 审核 */
         examSubmit(bool){
          this.$axios.put(this.examVideoUrl,this.$commonFun.initPostData({
              id:this.currentExamId,
              isAuth:bool
          })).then((res)=>{
              console.log(res);
              if(res.data.code==1){
                  this.$message.success('操作成功');
                  this.getList();
                  this.examDialogVisible=false;
              }else{
                  this.$confirm(res.data.msg.msgTrim(), "提示",{
                  	confirmButtonText: "确定",
                  	cancelButtonText: "取消",
                  	showCancelButton: false,
                  	type: "error"
                  });
              }
          })
         },
         /* 删除微视频 */
         deleteVideo(obj){

                this.$confirm('确定删除微视频：<'+obj.title+'>?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                  this.$axios.put(this.deleteVideoUrl,this.$commonFun.initPostData({
                      id:obj.id
                  })).then((res)=>{
                      if(res.data.code==1){
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
         imgUploadRemove(file, fileList){
           console.log(file, fileList);
            this.dialogForm.imgList=fileList;
            this.$refs.dialogForm.validateField('imgList');
         },
         /* 图片改变 */
         imgUploadChange(file,fileList){
            this.dialogForm.imgList=fileList;
            var exStr=file.name.split('.').pop().toLowerCase();
            var exSize=file.size?file.size:1;
            if(exSize/ 1024 / 1024 > 20){
                this.$confirm('图片的大小不能超过20MB！', "提示",{
                	confirmButtonText: "确定",
                	cancelButtonText: "取消",
                	showCancelButton: false,
                	type: "error"
                });
                this.dialogForm.imgList.pop();
                return false;
            }
            if(exSize==0){
                this.$confirm('请勿上传空文件！', "提示",{
                	confirmButtonText: "确定",
                	cancelButtonText: "取消",
                	showCancelButton: false,
                	type: "error"
                });
                this.dialogForm.imgList.pop();
                return false;
            }
            if(exStr!='png'&&exStr!='jpg'&&exStr!='jpeg'){
                this.$confirm('图片的格式必须为png或者jpg或者jpeg格式！', "提示",{
                	confirmButtonText: "确定",
                	cancelButtonText: "取消",
                	showCancelButton: false,
                	type: "error"
                })
                this.dialogForm.imgList.pop();
                return false;
            }
            if(file.name.length>80){
                this.$confirm('图片名称不能超过80个字符！', "提示",{
                	confirmButtonText: "确定",
                	cancelButtonText: "取消",
                	showCancelButton: false,
                	type: "error"
                });
                this.dialogForm.imgList.pop();
                return false;
            }
            this.dialogForm.imgList=[] ;
            this.dialogForm.imgList.push(file);
            console.log(this.dialogForm.imgList);
            this.$refs.dialogForm.validateField('imgList');

         },
         /* 添加上传视频 */
         videoUploadRemove(file,fileList){
           this.dialogForm.videoList=fileList;
           this.$refs.dialogForm.validateField('videoList');
         },
         /* 视频验证 */
         videoBeforeUpload(file,fileList){
          console.log(file,fileList)
            var exStr=file.name.split('.').pop().toLowerCase();
            var exSize=file.size?file.size:1;
            /* if(exSize/ 1024 / 1024 > 20){
                this.$confirm('图片的大小不能超过20MB！', "提示",{
                	confirmButtonText: "确定",
                	cancelButtonText: "取消",
                	showCancelButton: false,
                	type: "error"
                });
                return false;
            } */
            if(exSize==0){
                this.$confirm('请勿上传空文件！', "提示",{
                	confirmButtonText: "确定",
                	cancelButtonText: "取消",
                	showCancelButton: false,
                	type: "error"
                });
                return false;
            }
            if(exStr!='avi'&&exStr!='mpg'&&exStr!='wmv'&&exStr!='3gp'&&exStr!='mov'&&exStr!='mp4'&&exStr!='asf'&&exStr!='asx'&&exStr!='flv'){
                this.$confirm('图片的格式必须为以下格式之一：avi,mpg,wmv,3gp,mov,mp4,asf,asx或flv！', "提示",{
                	confirmButtonText: "确定",
                	cancelButtonText: "取消",
                	showCancelButton: false,
                	type: "error"
                });
                return false;
            }
            if(file.name.length>80){
                this.$confirm('视频名称不能超过80个字符！', "提示",{
                	confirmButtonText: "确定",
                	cancelButtonText: "取消",
                	showCancelButton: false,
                	type: "error"
                });
                return false;
            }
         },
         /* 视频上传成功 */
         videoUploadSuccess(res,file,fileList){
           this.isUploadVideo=true;
           this.videoTransCoding(res.data);
           this.dialogForm.videoList=[];
           this.dialogForm.videoList.push(file);
           this.$refs.dialogForm.validateField('videoList');
           console.log(this.dialogForm)
         },
         /* 视频转码 */
         videoTransCoding(str){
           this.$axios.get(this.transCodingUrl,{
               params:{key:str}
           }).then((res)=>{
               console.log(res);
               if(res.data.code==1){
                var obj=res.data.data;
                 if(obj.done){
                     if(!obj.error){
                         /* 转码成功 */
                        this.isUploadVideo=false;
                        this.dialogForm.transCoding=res.data.data;
                     }else{
                         /* 转码失败 */
                        this.$confirm('视频转码失败，请检查视频格式后再重新上传', "提示",{
                        	confirmButtonText: "确定",
                        	cancelButtonText: "取消",
                        	showCancelButton: false,
                        	type: "error"
                        });
                        this.dialogForm.videoList=[];
                        this.isUploadVideo=false;
                     }
                 }else{
                     /* 正在转码 */
                     setTimeout(() => {
                         this.videoTransCoding(str);
                     }, 1000);
                 }
               }else{
                   this.$confirm(res.data.msg, "提示",{
                   	confirmButtonText: "确定",
                   	cancelButtonText: "取消",
                   	showCancelButton: false,
                   	type: "error"
                   });
               }
           })
         },
         /* 微视频对话框提交 */
         addVideoSubmit(){
             console.log(this.dialogForm);
             this.$refs.dialogForm.validate((valid)=>{
                 if(valid){
                   this.isdisabled = true;
                    var submitObj={
                           bookId:this.currentBook.id, //图书Id
                           title:this.dialogForm.videoName,  //标题
                           cover:this.dialogForm.imgList[0].raw,   //封面图片Id
                           origPath:this.dialogForm.transCoding.origPath,  //原始视频存放路径
                           origFileName: this.dialogForm.transCoding.origFileName,  // 原始文件名
                           origFileSize:this.dialogForm.transCoding.origFileSize,  //原始文件大小
                           path:this.dialogForm.transCoding.path,  //转码后存放路径
                           fileName:this.dialogForm.transCoding.fileName, //转码后文件名
                           fileSize:this.dialogForm.transCoding.fileSize  //转码后大小
                             };
                     let config = {
                         headers: {
                            'Content-Type': 'multipart/form-data'
                            }
                      }
                      let formData=new FormData();
                      for(var i in submitObj){
                          formData.append(i,submitObj[i]);
                      }
                     this.$axios.post(this.addNewVideoUrl,formData,config)
                     .then((res)=>{
                      console.log(res);
                       this.isdisabled = false;
                      if(res.data.code==1){
                          this.getList();
                          this.$message.success('添加成功');
                          this.dialogVisible=false;
                          this.bookDialogVisible=false;
                          this.$refs.dialogForm.resetFields();

                        }
                        else{
                         this.$confirm(res.data.msg.msgTrim(), "提示",{
                         	confirmButtonText: "确定",
                         	cancelButtonText: "取消",
                         	showCancelButton: false,
                         	type: "error"
                         });
                        }
                     }).catch((error)=>{
                       this.isdisabled = false;
                     })
                 }else{
                     return ;
                 }
             })
         },
         /* 下载按钮链接 */
         videoDownLoad(obj){
           if ((obj.path.indexOf('\\')) > 0) {
             return 'v/download?realname='+obj.path.split('\\').pop().split('.')[0]+'&filename='+obj.title;
           } else {
             return 'v/download?realname='+obj.path.split("/").pop().split('.')[0]+'&filename='+obj.title;
           }

         },
         playVideo(obj){
           if ((obj.path.indexOf('\\')) > 0) {
             this.videoSrc='v/play/'+obj.path.split('\\').pop();
           } else {
             this.videoSrc='v/play/'+obj.path.split("/").pop();
           }

          this.isShowVideoPlayer=true;
         }
        }
    }
</script>
<style>
.mic_video .header_p {
  overflow: hidden;
  margin-bottom:5px;
}
.mic_video .header_p .input {
  width: 188px;
  margin-right: 10px;
}
.mic_video .book_dialog .el-dialog{
min-width: 660px;
position: relative;
}
.mic_video .book_dialog .el-dialog .el-dialog__body{
    overflow:hidden;
}
.mic_video .video_player_dialog  .el-dialog__body{
 padding:0;
 background: none;
}
.mic_video .video_player_dialog .el-dialog__header{
   padding:0;
}
.mic_video .video_player_dialog .el-dialog__header .el-dialog__headerbtn{
    margin:3px;
}
.mic_video .video_player_dialog video{
    width:100%;
    vertical-align: bottom;
    min-height:300px;
}
</style>
