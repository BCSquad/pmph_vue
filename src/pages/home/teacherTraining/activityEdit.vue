<template>
  <div class="activity_edit" style="width: 95%;margin-left: 25px;">
    <div class="top-nav">
      <div class="header_title_tips">
        <p>活动详情</p>
        <div class="tips_icon"></div>
      </div>
      <div class="header_back_tips">
        <p>
          <el-button href="#"
                     @click="$router.push({name:'活动管理',query:{columnId:1,type:'activityList',isShowCover:true}})"><
            返回上一步
          </el-button>
        </p>
      </div>
    </div>
    <div>
      <el-form :model="formData" :rules="formRules" ref="addForm" label-width="150" style="margin:20px 30px 20px 0;">

        <el-form-item class="cs" label="活动名称：" prop="activityName" required>
          <el-input placeholder="请输入活动名称" class="input" v-model.trim="formData.activityName"></el-input>
        </el-form-item>

        <el-form-item class="cs" label="活动日期："  style="height: 35px;" prop="activityDate"   required >
          <el-date-picker
            v-model="formData.activityDate"
            type="date"
            placeholder=" 选择日期"
            value-format="timestamp">
          </el-date-picker>
          <div v-if="formData.status!=1"
               style="float: right;position: relative;width: 400px;margin-right: 50px;margin-top: -60px;">
            <el-button class="but" type="primary" @click="openPreventDialog">预览</el-button>
            <el-button class="but" type="primary" @click="CheckSubmit(0)">暂存</el-button>
            <el-button class="but" type="primary" @click="CheckSubmit(1)">发布</el-button>
            <el-button class="but" type="primary" style="background-color: #F34141"
                       @click="videoManage">视频维护
            </el-button>
            <el-button class="but" type="primary" style="background-color: #F34141"
                       @click="sourceManage">资源维护
            </el-button>
          </div>

          <div v-if="formData.status==1"
               style="float: right;position: relative;width: 300px;margin-right: 50px;margin-top: -60px;">
            <el-button class="but" type="primary" @click="openPreventDialog">预览</el-button>
            <el-button class="but" type="primary" @click="CheckSubmit(1)">发布</el-button>
            <el-button class="but" type="primary" style="background-color: #F34141"
                       @click="videoManage">视频维护
            </el-button>
            <el-button class="but" type="primary" style="background-color: #F34141"
                       @click="sourceManage">资源维护
            </el-button>
          </div>
        </el-form-item>


        <el-form-item label=" 是否置顶：" prop="isSetTop">
          <!-- <el-input class="input" placeholder="请输入数字" v-model="formData.sort"></el-input> -->
          <el-radio class="radio" v-model="formData.isSetTop" :label=true>是</el-radio>
          <el-radio class="radio" v-model="formData.isSetTop" :label=false>否</el-radio>
        </el-form-item>
        <el-form-item label=" 所属教材：">
          <el-button size="small" type="primary" @click="selectmaterial">选择教材</el-button>
        </el-form-item>
        <el-tag
          v-if="formData.materialId!=''"
          :key="materialExpressTag.name"
          :type="materialExpressTag.type"
          @close="materialRemoveTag()"
          closable
          style="margin-left: 85px;margin-bottom: 10px">
          {{materialExpressTag.name}}
        </el-tag>

        <el-form-item label=" 活动封面：" v-if="$route.query.isShowCover">
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
            <el-button size="small" type="primary">上传活动封面</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label=" 信息快报：">
          <el-button size="small" type="primary" @click="selectInfoExpress">选择快报</el-button>
        </el-form-item>
        <el-tag ref="InfoExpressT"
                v-if="formData.infoExpressCmsId!=''"
                :key="infoExpressTag.name"
                @close="InfoExpressRemoveTag()"
                closable
                :type="infoExpressTag.type" style="margin-left: 85px;margin-bottom: 10px">
          {{infoExpressTag.name}}
        </el-tag>

        <el-form-item id="cs" label=" 活动介绍：" prop="content" required>
          <Editor ref="editor" :config="editorConfig"></Editor>
        </el-form-item>
      </el-form>
    </div>
    <!-- 预览对话框 -->
    <el-dialog
      title=""
      :visible.sync="showPreventDialog"
      size="large" top="5%">
      <div style="padding:0 05%;">
        <h1 class="previewTitle text-center">{{formData.activityName}}</h1>
        <p class="senderInfo text-center paddingT10">
          <span class="marginR10"></span>
          <span style="color: grey;margin-right:680px">活动日期:{{this.$commonFun.getnowDate(formData.gmtCreate)}}</span>
        </p>
        <el-form label-width="55px">
          <el-form-item label="" label-width="0">
            <div style="margin:0 auto;width:800px;"><p v-html="preventContent" class="p_content"></p></div>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

    <!-- 选择书籍弹框  -->
    <el-dialog ref="InfoExpresstable"
      title="选择教材"
      :visible.sync="materialDialogVisible"
      class='material_dialog'
      size="small"
    >
      <p class="header_p" style="margin-bottom: 10px"><span>教材名称：</span>
        <el-input class="input" v-model="materialParams.materialName" placeholder="请输入教材名称"></el-input>
        <el-button type="primary" icon="search" @click="selectmaterial">搜索</el-button>
        <el-button type="primary" @click="confirmMaterial" style="float: right">确认选择</el-button>
      </p>
      <el-table ref="multipleTable"
                :data="materialListData" border highlight-current-row
                @current-change="materialSlectRow"
                @row-click="clickRow"
                @selection-change="handleSelectionChange">
        style="width:100%;margin:10px 0;">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column prop="materialName" label="教材名称" header-align="center" align="left">
        </el-table-column>
      </el-table>
      <div class="pagination-wrapper">
        <el-pagination  style="margin-top:10px;margin-bottom: 5px"
          v-if="materialTotal>materialParams.pageSize"
          @size-change="materialSizeChange"
          @current-change="materialCurrentChange"
          :current-page.sync="materialParams.pageNumber"
          :page-sizes="[10,20,30,50]"
          :page-size="materialParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="materialTotal">
        </el-pagination>
      </div>
    </el-dialog>

    <el-dialog ref="materialtable"
      title="选择信息快报"
      :visible.sync="infoExpressDialogVisible"
      class='material_dialog'
      size="small"
    >
      <p class="header_p"><span>快报标题：</span>
        <el-input class="input" v-model="infoExpressParams.title" placeholder="请输入信息快报标题"></el-input>
        <el-button type="primary" icon="search" @click="selectInfoExpress">搜索</el-button>
        <el-button type="primary" @click="confirmInfoExpress" style="float: right">确认选择</el-button>
      </p>
      <el-table ref="multipleTable"
                :data="infoExpressListData"
                border highlight-current-row
                @current-change="infoExpressSlectRow"
                @row-click="clickRow"
                @selection-change="handleSelectionChange"
                style="width:100%;margin:10px 0;">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column prop="index" label="序号" width="75px" align="center">

          <template scope="scope">
            {{scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column prop="title" label="信息快报标题" header-align="center" align="left">
        </el-table-column>
        <el-table-column prop="materialName" label="所属教材" header-align="center" align="left">
        </el-table-column>
        <el-table-column prop="gmtCreate" width="120" label="创建时间" align="center">
          <template scope="scope">
            {{$commonFun.formatDate(scope.row.gmtCreate,"yyyy-MM-dd")}}
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrapper">
        <el-pagination
          v-if="infoExpressTotal>infoExpressParams.pageSize"
          @size-change="infoExpressSizeChange"
          @current-change="infoExpressCurrentChange"
          :current-page.sync="infoExpressParams.pageNumber"
          :page-sizes="[10,20,30,50]"
          :page-size="infoExpressParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="infoExpressTotal">
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Editor from "../../../components/Editor.vue";

  export default {
    data() {
      return {
        newActivityUrl: "/pmpheep/activity/newActivity", //新建文章
        editActivityUrl: '/pmpheep/activity/updateActivity',    //修改文章
        editLettersUrl: '/pmpheep/cms/letters/update',  //修改信息快报
        getLettersList: '/pmpheep/activity/getLetters',  //获取信息快报列表
        getMaterialistList: "/pmpheep/activity/getMaterialist", //获取教材列表
        nameflag:true,
        formData: {
          activityName: "",
          activityDate: '',
          isSetTop: false,
          materialId: "",
          infoExpressCmsId: "",
          content: "",
          imgFile: [],
          status: 0,
        },
        chainflag:false,
        materialExpressTag: {},
        infoExpressTag: {},
        materialListData: [],
        materialDialogVisible: false,
        coverDialogVislble: false,
        showPreventDialog: false,
        infoExpressDialogVisible: false,
        infoExpressListData: [],
        preventContent: '',
        isEditContent: false,
        imgList: [],
        coverImgUrl: '',
        infoCurrentRow: null,
        materialCurrentRow: null,
        formRules: {
          activityName: [
            {required: true, message: "活动名称不能为空", trigger: "blur"},
            {min: 1, max: 100, message: "活动名称不能超过100个字符", trigger: "change"}
          ],activityDate:[
            {required:true,message:'活动时间不能为空'},
          ],
        },
        // materialType:{
        //   value: "id",
        //   label: "materialName"
        // },
        defaultCategoryId: [],
        uploadFileList: [],
        coverUploadUrl: '/pmpheep/file/image/upload',
        fileUploadUrl: this.$config.BASE_URL + 'messages/message/file',
        /* fileUploadUrl:
          "http://192.168.200.109:8090/pmpheep/messages/message/file", */
        editorConfig: {
          initialFrameWidth: null,
          initialFrameHeight: 500,
          wordCount:true, //是否开启字数统计
        },
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        materialOptions: [],
        returnReasonVisible: false, // 退回理由
        returnReason: '',
        searchParams: {
          state: '',
          materialName: '',
          upLoadTimeStart: '',
          upLoadTimeEnd: '',
          pageSize: 10,
          pageNumber: 1,
        },
        currentmaterial: {},
        currentExamId: '',
        materialParams: {
          materialName: '',
          pageSize: 10,
          pageNumber: 1,
        },
        infoExpressParams: {
          title: '',
          pageSize: 10,
          pageNumber: 1,
        },
        materialTotal: 20,
        infoExpressTotal: 20,
        dialogRules: {
          activityName: [
            {required: true, message: '请输入视频名称', trigger: 'blur'},
            {min: 1, max: 50, message: '视频名称不能超过50个字符', trigger: 'blur,change'}
          ],
          activityDate:[
            {required: true, message: '活动日期不能为空', trigger: 'blur'},
          ],
          imgList: [
            {type: 'array', required: true, message: '请上传视频封面', trigger: 'change'}
          ],
          videoList: [
            {type: 'array', required: true, message: '请上传视频内容', trigger: 'change'}
          ],


        }

      }


    },
    methods: {
      clickRow(row) {
        this.$refs.multipleTable.clearSelection();
        this.$refs.multipleTable.toggleRowSelection(row)
      },

      handleSelectionChange(rows) {
        if (rows.length > 1) {
          this.$refs.multipleTable.clearSelection();
          this.$refs.multipleTable.setCurrentRow(rows[rows.length - 1]);
        } else {
          this.$refs.multipleTable.setCurrentRow(rows[0]);
        }
      },

      /* 视频维护 维护之前前先暂存*/
      videoManage() {
        if (!this.formData.activityName || !this.$refs.editor.getContent()) {
          this.$message.error("请先输入标题和内容");
          return;
        }
        if (!this.isEditContent) {
          this.activitySubmit(0);
        } else {
          this.activitySubmit(this.formData.status);
          this.chainflag=true;
        }
        this.$router.push({
          name: '视频列表',
          params: this.formData,
          query: {columnId: 1, type: 'toVideo', isShowCover: true}
        })
      },

      /* 资源维护之前前先暂存*/
      sourceManage() {
        if (!this.formData.activityName || !this.$refs.editor.getContent()) {
          this.$message.error("请先输入标题和内容");
          return;
        }
        if (!this.isEditContent) {
          this.activitySubmit(0);

        } else {
          this.activitySubmit(this.formData.status);
          this.chainflag=true;
        }
        this.$router.push({
          name: '资源列表',
          params: this.formData,
          query: {columnId: 1, type: 'toSource', isShowCover: true}
        })
      },


      materialRemoveTag() {
        this.formData.materialId = '';
        this.materialCurrentRow = {
          name: null,
          type: null
        };
      },
      InfoExpressRemoveTag() {
        this.formData.infoExpressCmsId = '';
        this.infoCurrentRow = {
          name: '',
          type: ''
        };
      },

      activitySubmit(num) {
        this.formData.content = this.$refs.editor.getContent();
        if (this.formData.activityDate) {
          if (this.formData.activityDate.toString().indexOf('gmt') != 0) {
            this.formData.activityDate = new Date(this.formData.activityDate).getTime();
          }
        }
        if (!this.formData.content) {
          this.$confirm("内容不能为空", "提示", {
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
            if (num == 0) {
              this.formData.status = 0;
            }
            if (num == 1) {
              this.formData.status = 1;
            }
            this.formData.sessionId = this.$getUserData().sessionId;
            /* 判断新增还是修改 */
            if (!this.isEditContent) {
              this.$axios
                .post(this.newActivityUrl, this.$commonFun.initPostData(this.formData))
                .then(res => {
                  console.log(res);
                  if (res.data.code == 1) {
                    if(res.data.data.code==2){
                      this.$message.error("已存在相同的活动名称");
                      return;
                    }
                    switch (num) {
                      case 0:
                        this.$message.success("暂存成功");
                        this.formData.id = res.data.data.id;
                        this.formData.activityDescCmsId = res.data.data.activityDescCmsId;
                        this.isEditContent = true;
                        break;
                      case 1:
                        this.$message.success("发布成功");

                        this.$router.push({name: '活动管理', query: {columnId: 1, type: 'activityList', isShowCover: true}})
                        break;
                      default:
                        break;
                    }
                  } else {
                    this.$confirm(res.data.msg, "提示", {
                      confirmButtonText: "确定",
                      cancelButtonText: "取消",
                      showCancelButton: false,
                      type: "error"
                    });
                  }
                });
            } else {
              this.$axios.put(this.editActivityUrl, this.$commonFun.initPostData(this.formData)).then((res) => {
                console.log(res);
                if (res.data.code == 1) {
                  if(res.data.data.code==2){
                    this.$message.error("已存在相同的活动名称");
                    return;
                  }
                  switch (num) {
                    case 0:
                      this.$message.success("暂存成功");
                      this.isEditContent = true;
                      break;
                    case 1:
                      if(!this.chainflag){
                        this.$message.success("发布成功");
                        this.$router.push({name: '活动管理', query: {columnId: 1, type: 'activityList', isShowCover: true}})
                      }
                      break;
                    default:
                      break;
                  }
                  this.$router.push({name: this.routerName});
                }else if(res.data.code == 2){
                  alert(1);
                } else {
                  this.$confirm(res.data.msg, "提示", {
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
      },
      /*提交*/
      CheckSubmit(num) {
        if (!this.formData.activityName || !this.$refs.editor.getContent()) {
          this.$message.error("请先输入标题和内容");
          return;
        }

        if (num == 0) {
          this.activitySubmit(num);
        } else {
          this.$confirm('确定发布？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.activitySubmit(num);
          }).catch(() => {
            /*this.$message({
              type: 'info',
              message: '已取消发布'
            });*/
          });
        }
      },
      /* 关联快报 */
      confirmInfoExpress() {
        this.infoExpressDialogVisible = false;
        this.infoExpressTag.name = this.infoCurrentRow.title;
        this.infoExpressTag.type = "waring";
        this.formData.infoExpressCmsId = this.infoCurrentRow.id;
      }
      ,
      /* 关联教材 */
      confirmMaterial() {
        this.materialDialogVisible = false;
        this.materialExpressTag.name = this.materialCurrentRow.materialName;
        this.materialExpressTag.type = "waring";
        this.formData.materialId = this.materialCurrentRow.id;
      },
      /* 预览 */
      openPreventDialog() {
        console.log(this.formData);
        this.preventContent = this.$refs.editor.getContent();
        this.showPreventDialog = true;
      }, /* 书籍列表 搜索 */
      materialSizeChange(val) {
        this.materialParams.pageSize = val;
        this.materialParams.pageNumber = 1;
        this.selectmaterial();
      },
      materialCurrentChange(val) {
        this.materialParams.pageNumber = val;
        this.selectmaterial();
      },
      infoExpressSizeChange(val) {
        this.infoExpressParams.pageSize = val;
        this.infoExpressParams.pageNumber = 1;
        this.selectInfoExpress();
      },
      infoExpressCurrentChange(val) {
        this.infoExpressParams.pageNumber = val;
        this.selectInfoExpress();
      },
      infoExpressSlectRow(val) {
        this.infoCurrentRow = val;
      },
      materialSlectRow(val) {
        this.materialCurrentRow = val;
      },
      selectmaterial() {
        this.$axios.get(this.getMaterialistList, {
          params: this.materialParams
        }).then((res) => {
          if (res.data.code == 1) {
            this.materialListData = res.data.data.rows;
            this.materialTotal = res.data.data.total;
            this.materialDialogVisible = true;
            this.sourceChainList.forEach(i => {
              this.$refs.materialtable.toggleRowSelection((this.formData.infoExpressCmsId ===  parseInt(i.id)), true)  // 设置默认选中
            })
          }
        })
      },
      selectInfoExpress() {
        this.$axios.get(this.getLettersList, {
          params: this.infoExpressParams
        }).then((res) => {
          if (res.data.code == 1) {
            this.infoExpressListData = res.data.data.rows;
            this.infoExpressTotal = res.data.data.total;
            this.infoExpressDialogVisible = true;
            this.infoExpressListData.forEach(i => {
              this.$refs.InfoExpresstable.toggleRowSelection(this.formData.materialId === parseInt(i.id), true)  // 设置默认选中
            })
          }
        })


      },

      coverUploadSuccess(res, file, filelist) {
        if (!filelist[0].response) {
          this.formData.imgAttachment = filelist[0].url.split('/').pop();
        }
        this.imgList = [];
        this.formData.imgFile = '';
        if (this.formData.categoryId == 1 && this.$router.currentRoute.query.type == 'new') {
          this.formData.cover = '';
          this.formData.cover = res.data;
        }
        this.imgList.push({name: file.name, url: res.data});
        this.formData.imgFile = res.data;
      },
      coverUploadRemove(file, flielist) {
        if (file.url) {
          this.formData.imgAttachment = "";
          this.imgList=[];
          this.formData.imgFile ="";
          this.formData.cover="";
        }
      },
      coverBeforeUpload(file) {
        var exStr = file.name.split('.').pop().toLowerCase();
        var exSize = file.size ? file.size : 1;
        if (exSize / 1024 / 1024 > 20) {
          this.$confirm('图片的大小不能超过20MB！', "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            showCancelButton: false,
            type: "error"
          });
          // this.material.noticeFiles.pop();
          return false;
        }
        if (exSize == 0) {
          this.$confirm('请勿上传空文件！', "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            showCancelButton: false,
            type: "error"
          });
          // this.material.noticeFiles.pop();
          return false;
        }
        if (exStr != 'png' && exStr != 'jpg' && exStr != 'jpeg') {
          this.$confirm('图片的格式必须为png或者jpg或者jpeg格式！', "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            showCancelButton: false,
            type: "error"
          });
          // this.material.noticeFiles.pop();
          return false;
        }
        if (file.name.length > 80) {
          this.$confirm('图片名称不能超过80个字符！', "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            showCancelButton: false,
            type: "error"
          });
          //this.material.noticeFiles.pop();
          return false;
        }
      },
      checkCoverUpload(file) {
        this.coverImgUrl = 'pmpheep/image/' + file.url;
        this.coverDialogVislble = true;
      },
      initIsEdit() {
        this.isEditContent = false;
        if (this.$router.currentRoute.query.type == "edit") {
          var editData = this.$router.currentRoute.params;
          console.log(editData);
          if (editData.content) {
            this.isEditContent = true;
            /*  this.formData = editData.activity;*/
            for (var item in editData.activity) {
              if (item.indexOf('gmt') != 0) {
                if (typeof editData.activity[item] != 'boolean') {
                  this.formData[item] = editData.activity[item] == null ? '' : editData.activity[item] + '';
                } else {
                  this.formData[item] = editData.activity[item] == null ? '' : editData.activity[item];
                }
              }
              if (item == "activityDate") {
                this.formData[item] = editData.activity[item] == null ? '' : new Date(editData.activity[item]);
              }

            }

            if (!!editData.material) {
              this.materialExpressTag.name = editData.material.materialName;
              this.materialExpressTag.type = "waring";
              this.formData.materialId = editData.material.id;
            }
            if (!!editData.infoExpress) {
              this.infoExpressTag.name = editData.infoExpress.title;
              this.infoExpressTag.type = "waring";
              this.formData.infoExpressCmsId = editData.infoExpress.id;
            }


            /* 填充默认内容 */
            var _this = this;
            setTimeout(function () {
              _this.$refs.editor.setContent(editData.content.content);
            }, 100);
            /* 填充封面图片 */
            if (editData.imgFileName) {
              if (this.$route.query.isShowCover) {
                this.imgList.push({name: editData.imgFileName, url: editData.imgFilePath});
              }
            }

          } else {
            var _this = this;
            _this.$confirm('活动内容为空', "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              showCancelButton: false,
              type: "error"
            });
            setTimeout(function () {
              _this.$router.go(-1);
            }, 1000);

          }
        }
      },
    },

    components: {
      Editor
    }
    ,
    created() {
      this.initIsEdit();
    }
  }
</script>

<style>
  .activity_edit .input {
    width: 40%;

  }

  .activity_edit .date_input {
    width: 300px;
  }

  .activity_edit .bottom_box {
    margin-left: 45%;
    transform: translateX(-50%);
    display: inline-block;
  }

  .previewTitle {
    color: #14232e;
    font-size: 22px;
    font-weight: 500;
  }

  .activity_edit .center_box {
    float: left;
    margin-left: 50%;
    transform: translateX(-50%);
  }

  .edui-editor {
    float: right;
    margin-left: 80px;
    margin-top: -30px;

  }

  .activity_edit .cover_dialog .el-dialog .el-dialog__header {
    padding: 0;
  }

  .but {
    min-width: 100px;
    margin: 10px;
    margin-top: 0;
    margin-right: 20px;
  }

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

  .material_dialog .el-dialog.infoExpres_dialog {
    min-width: 660px;
    position: relative;
  }

  .el-form-item__error {
    color: #ff4949;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    position: absolute;
    top: 100%;
    margin-left: 92px;

  }

  #cs .el-form-item__label {
    margin-left: -10px;
  }
  .activity_edit .el-dialog__body thead th:nth-child(1) .cell {
    display: none;
  }

</style>
