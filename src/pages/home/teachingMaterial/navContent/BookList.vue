<template>
    <div class="new_book_release">
        <el-form ref="form" :model="formData" class="release_form" label-width="110px">
            <el-form-item label="教材名称：" class="marginB10">
                <span class="grey_span">{{formData.materialName}}</span>
            </el-form-item>
            <el-form-item label="教材轮次：" class="marginB10">
                <span class="grey_span">第{{formData.materialRound}}轮</span>
            </el-form-item>
            <el-form-item label="教材分类：" class="marginB10">
                <span class="grey_span">{{formData.materialType.join(' > ')}}</span>
                <p><span class="red_span">（*若教材数量较多，可按照下载的模板格式上传，模板中书序、书籍名称、版次不能为空，书序和版次只能填写数字）</span></p>
                <div>
                  <span class="grey_span" style="float:left;">
                    请按照模板格式上传（
                    <a class="grey_button" href="/static/设置书目录模板.xls">模板下载.xls</a>
                    ）：
                  </span>
                  <my-upload
                    class="ChatInputFileBtn"
                    ref="upload"
                    :action="api_upload"
                    :data="{materialId:formData.materialId}"
                    :before-upload="beforeUploadFile"
                    :on-success="upLoadFileSuccess"
                    :on-error="uploadError"
                    :show-file-list="false">
                    <el-button size="small" type="primary" :disabled="uploadLoading"  :loading="uploadLoading">{{uploadLoading?'正在上传解析中...':'点击上传'}}</el-button>
                  </my-upload>
                </div>
            </el-form-item>
            <el-form-item label="书目录：">
              <!--表格-->
              <div class="table-wrapper book-list-catalogue">
                <div class="pull-right">
                  <el-button type="primary" size="small" @click="sortByBookNum" :disabled="extendListData.length<2">按书序排序</el-button>
                  <!--<el-button type="primary" size="small" @click="sortByPreNum">按版次排序</el-button>-->
                  <el-button type="primary" size="small" @click="autoSetBookNum" :disabled="extendListData.length<2">自动设置书序</el-button>
                </div>
                <el-table
                  ref="multipleTable"
                  border
                  stripe
                  :data="extendListData"
                  tooltip-effect="dark"
                  style="width: 100%">
                  <el-table-column
                    prop="orderNum"
                    label="书序"
                    width="160">
                    <template scope="scope">
                      <div class="paddingB15 paddingT10 relative">
                        <el-input
                          placeholder="请输入"
                          class="searchInputEle border-radius-4"
                          :class="{'border-red':!scope.row.sortIsOk}"
                          icon="edit"
                          v-model.trim="scope.row.sort"
                          @blur="sortChange(scope.row)"
                          @change="sortChange(scope.row)"
                        ></el-input>
                        <span class="error fontsize-sm table-input-tips" v-if="!scope.row.sortIsOk">请输入正确数字</span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="bookName"
                    label="书籍名称"
                    width="420">
                    <template scope="scope">
                      <div class="paddingB15 paddingT10 relative">
                        <el-input
                          placeholder="请输入书籍名称"
                          class="searchInputEle border-radius-4"
                          :class="{'border-red':!scope.row.nameIsOk}"
                          icon="edit"
                          v-model.trim="scope.row.textbookName"
                          @blur="nameChange(scope.row)"
                          @change="nameChange(scope.row)"
                        ></el-input>
                        <span class="error fontsize-sm table-input-tips" v-if="!scope.row.nameIsOk">请输入1~100个字符</span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="edition"
                    label="版次"
                    width="160">
                    <template scope="scope">
                      <div class="paddingB15 paddingT10 relative">
                        <el-input
                          placeholder="请输入"
                          class="searchInputEle border-radius-4"
                          :class="{'border-red':!scope.row.roundIsOk}"
                          icon="edit"
                          v-model.trim="scope.row.textbookRound"
                          @blur="roundChange(scope.row)"
                          @change="roundChange(scope.row)"
                        ></el-input>
                        <span class="error fontsize-sm table-input-tips" v-if="!scope.row.roundIsOk">请输入正确数字</span>
                      </div>

                    </template>
                  </el-table-column>
                  <el-table-column
                    label="操作">
                    <template scope="scope">
                      <el-button type="text" @click="insertRow(scope.$index)">插入行</el-button>
                      <el-button type="text" @click="deleteExtendItem(scope.$index)">删除行</el-button>
                    </template>
                  </el-table-column>
                </el-table>

                <div class="out_bottom_box marginT60">
                  <div class="bottom_box">
                   <!-- <el-button type="primary" class="bottom_button" @click="save()">暂存</el-button>-->
                    <el-button type="primary" class="bottom_button" @click="save(true)" >保存，下一步</el-button>
                    <el-checkbox class="marginL20" v-model="formData.isPublic">仅选中学校可见</el-checkbox>
                  </div>
                </div>
              </div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script type="text/javascript">
export default {
    data() {
        return {
            api_book_list:'/pmpheep/textBook/list/textbooks',
            api_save:'/pmpheep/textBook/add/textbook',
            api_upload:'/pmpheep/textBook/import/excel',
            formData: {
              materialId:'',
              materialName: '',
              materialType: [],
              materialRound: undefined,
              isPublic:false
            },
            uploadLoading:false,
            extendListData: [{
              id:'',
              sort: '',
              textbookName: '',
              textbookRound: '',
              sortIsOk : true,
              nameIsOk : true,
              roundIsOk : true,
            }],
            currentUserId:this.$getUserData().userInfo.id,
        }
    },
    methods: {
      /**
       * 获取当前教材下所有书籍
       * @param val
       */
      getBookList(){
        this.$axios.get(this.api_book_list,{params:{
          materialId:this.formData.materialId
        }})
          .then(response=>{
            var res = response.data;
            if(res.code==1){
              this.formData.materialName = res.data[0].materialName;
              this.formData.materialType = res.data[0].materialType;
              this.formData.materialRound = res.data[0].materialRound;
              this.formData.isPublic = !res.data[0].isPublic;
              var bookList =[];
              res.data.map(iterm=>{
                if(!!iterm.textbook){
                  iterm.textbook.sortIsOk = true;
                  iterm.textbook.nameIsOk = true;
                  iterm.textbook.roundIsOk = true;
                  bookList.push(iterm.textbook);
                }
              });
              if(bookList.length>0){
                this.extendListData = bookList;
              }
            }
          })
          .catch(e=>{
            console.log(e);
          })
      },
      /**
       * 删除入行
       * @param index
       */
      deleteExtendItem(index) {
        this.extendListData.splice(index, 1);
        if(this.extendListData.length==0){
          this.insertRow(-1);
        }
      },
      /**
       * 插入行
       * @param index
       */
      insertRow(index){
        console.log(index)
        this.extendListData.splice(index+1,0,{
          id:'',
          sort: '',
          textbookName: '',
          textbookRound: '',
          sortIsOk : true,
          nameIsOk : true,
          roundIsOk : true,
        });
      },
      /**
       * 按照书序排序显示
       */
      sortByBookNum(){
        this.extendListData.sort((x,y)=>{
          return x['sort']-y['sort'];
        });
        this.$message.success('已排序完成！');
      },
      /**
       * 按照版次排序
       */
      sortByPreNum(){
        this.extendListData.sort((x,y)=>{
          return x['textbookRound']-y['textbookRound'];
        })
        this.$message.success('已排序完成！');
      },
      /**
       * 自动设置书序
       */
      autoSetBookNum(){
        //提交
        this.$confirm("确定清除当前书序，重新设置书序吗？", "提示",{
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(()=>{
            this.extendListData.forEach((iterm,index)=>{
              iterm.sort = index+1;
              iterm.sortIsOk=true;
            });
            this.$message.success('自动设置书序完成！');
          })
          .catch(e=>{})

      },
      /**
       * 判断输入是否合法
       */
      sortChange(row){
        var temp = true;
        if(row.textbookName==''&&row.textbookRound==''){
          if(row.sort!=''){
            temp = this.$commonFun.checkType(row.sort,'number');
          }
        }else{
          temp = this.$commonFun.checkType(row.sort,'number');
        }
        if(row.sort.length>9){
          temp=false;
        }
        row.sortIsOk=temp;
        if(row.textbookName==''&&row.textbookRound==''&&row.sort==''){
          row.nameIsOk=true;
          row.roundIsOk=true;
          row.sortIsOk=true;
        }
      },
      /**
       * 判断输入是否合法
       */
      nameChange(row){
        var temp = true;
        if(row.sort!=''||row.textbookRound!=''){
          if(!row.textbookName){
            temp=false;
          }
        }
        if(row.textbookName.length>100){
          temp=false;
        }
        row.nameIsOk = temp;
        if(row.textbookName==''&&row.textbookRound==''&&row.sort==''){
          row.nameIsOk=true;
          row.roundIsOk=true;
          row.sortIsOk=true;
        }
      },
      /**
       * 判断输入是否合法
       */
      roundChange(row){
        var temp = true;
        if(row.textbookName==''&&row.sort==''){
          if(row.textbookRound!=''){
            temp = this.$commonFun.checkType(row.textbookRound,'number');
          }
        }else{
          temp = this.$commonFun.checkType(row.textbookRound,'number');
        }
        if(row.textbookRound.length>9){
          temp=false;
        }
        row.roundIsOk=temp;
        if(row.textbookName==''&&row.textbookRound==''&&row.sort==''){
          row.nameIsOk=true;
          row.roundIsOk=true;
          row.sortIsOk=true;
        }
      },
      /**
       * 检查表格中书籍数据输入是否合法
       */
      checkDataIsOk(){
        var flag = true;

        this.extendListData.map(iterm=>{
          if(iterm.textbookName==''&&iterm.textbookRound==''&&iterm.sort==''){
            iterm.roundIsOk=false;
            iterm.sortIsOk=false;
            iterm.nameIsOk=false;
                flag = false;
          }else{
            if(!iterm.textbookRound || !this.$commonFun.checkType(iterm.textbookRound,'number')){
              iterm.roundIsOk=false;
              flag = false;
            }
            if(!iterm.sort || !this.$commonFun.checkType(iterm.sort,'number')){
              iterm.sortIsOk=false;
              flag = false;
            }
            if(!iterm.textbookName||iterm.textbookName.length>100){
              iterm.nameIsOk=false;
              flag = false;
            }
          }
        });
        return flag;
      },
      /**
       * 保存书籍目录
       */
      save(next){
        var bookList = [];
        if(!this.checkDataIsOk()){
          /*this.$confirm('请正确填写每本书籍数据', "提示",{
          	confirmButtonText: "确定",
          	cancelButtonText: "取消",
          	showCancelButton: false,
          	type: "error"
          });*/
          return;
        }
        this.extendListData.map(iterm=>{
          let tempObj = {
            id:iterm.id?iterm.id:null,
            materialId:this.formData.materialId,
            textbookName:iterm.textbookName?iterm.textbookName:null,
            textbookRound:iterm.textbookRound?iterm.textbookRound:null,
            sort:iterm.sort?iterm.sort:null,
            founderId:this.currentUserId
          };
          if(!tempObj.sort&&!tempObj.textbookName&&!tempObj.textbookRound){
            //空数据给过滤掉
          }else{
            bookList.push(tempObj);
          }
        })
        //提交
        this.$confirm("确认保存修改？", "提示",{
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"

        })
          .then(()=>{
            this.$axios.post(this.api_save,this.$commonFun.initPostData({
              materialId:this.formData.materialId,
              materialName:this.formData.materialName,
              materialRound:this.formData.materialRound,
              materialType:this.formData.materialType,
              isPublic:!this.formData.isPublic,
              textbooks:JSON.stringify(bookList),
            }))
              .then((response) => {
                let res = response.data;
                console.log(res)
                if (res.code == '1') {
                  if(next){
                    //this.$router.push({name:'教材申报选择学校'});
                    this.$router.push({name:'设置教材调研表'});
                  }else{
                    this.$message.success('保存成功！');
                    this.getBookList();
                  }
                }else{
                  this.$confirm(res.msg.msgTrim(), "提示",{
                  	confirmButtonText: "确定",
                  	cancelButtonText: "取消",
                  	showCancelButton: false,
                  	type: "error"
                  });
                }
              })
              .catch((error) => {
                this.$confirm('保存失败，请重试', "提示",{
                	confirmButtonText: "确定",
                	cancelButtonText: "取消",
                	showCancelButton: false,
                	type: "error"
                });
              });
          })
          .catch(e=>{})
      },
      /**
       * 当上传按钮添加excel
       * @param file
       */
      beforeUploadFile(file){
        let flag = true;

        var filedata = file.raw;
        var ext=file.name.substring(file.name.lastIndexOf(".")+1).toLowerCase();
        // 类型判断
        if(!(ext=='xls'||ext=='xlsx')){
          this.$confirm("请按照模板格式的文档上传文件", "提示",{
          	confirmButtonText: "确定",
          	cancelButtonText: "取消",
          	showCancelButton: false,
          	type: "error"
          });
          return;
        }
        //文件名不超过40个字符
        if(file.name.length>40){
          this.$confirm("文件名不能超过40个字符", "提示",{
          	confirmButtonText: "确定",
          	cancelButtonText: "取消",
          	showCancelButton: false,
          	type: "error"
          });
          return;
        }
        // 判断文件大小是否符合 文件不为0
        if(file.size<1){
          this.$confirm("文件大小不能小于1bt", "提示",{
          	confirmButtonText: "确定",
          	cancelButtonText: "取消",
          	showCancelButton: false,
          	type: "error"
          });
          return;
        }
        // 判断文件大小是否符合 文件不大于100M
        if(file.size/1024/1024 > 100){
          this.$confirm("文件大小不能超过100M！", "提示",{
          	confirmButtonText: "确定",
          	cancelButtonText: "取消",
          	showCancelButton: false,
          	type: "error"
          });
          return;
        }

        this.uploadLoading=flag;
        return flag;
      },
      /**
       * 上传文件请求成功的回调
       */
      upLoadFileSuccess(res, file, fileList){
        if (res.code == '1') {
          this.extendListData=[];
          res.data.forEach(iterm=>{
            this.extendListData.push({
              id:iterm.id,
              sort: iterm.sort,
              textbookName: iterm.textbookName,
              textbookRound: iterm.textbookRound,
              sortIsOk : true,
              nameIsOk : true,
              roundIsOk : true,
            })
          })
        }else{
          this.$confirm(res.msg.msgTrim(), "提示",{
          	confirmButtonText: "确定",
          	cancelButtonText: "取消",
          	showCancelButton: false,
          	type: "error"
          });
        }

        this.uploadLoading = false;
      },
      /**
       * 上传文件请求失败的回调
       */
      uploadError(err, file, fileList){
        console.log(err);
        this.$confirm(err.msg.msgTrim(), "提示",{
        	confirmButtonText: "确定",
        	cancelButtonText: "取消",
        	showCancelButton: false,
        	type: "error"
        });
        this.uploadLoading = false;
      },
    },
  created(){
    this.formData.materialId = this.$route.params.materialId;
    //如果没有教材id则跳转到通知列表
    if(!this.formData.materialId){
      this.$router.push({name:'通知列表'});
    }
    if(this.formData.materialId!='new'){
      this.getBookList();
    }
  },
}

</script>
<style scoped>
 .book-list-catalogue{
   max-width: 900px;
 }


.new_book_release .grey_span {
    color: #9c9c9c;
}

.new_book_release .grey_span .grey_button {
    color: #337ab7;
}

.new_book_release .grey_span .grey_button:hover {
    color: #23527c;
}

.new_book_release .upload {
    float: left;
}

.new_book_release .red_span {
    color: #f5596e;
}

.release_form .classify_input {
    width: 600px;
    margin-right: 20px;
}

.release_form .classify_button {
    color: #1abb9c;
}

.release_form .classify_button:hover {
    opacity: .9;
}

.new_book_release .checkTree_dialog .el-dialog__body{
    overflow: hidden;
}
.new_book_release .checkTree_dialog .tree_box {
    box-sizing: border-box;
    width: calc(100% - 100px);
    height: 200px;
    overflow-y: scroll;
    overflow-x: hidden;
    float: left;
}

.new_book_release .checkTree_dialog .tree_box::-webkit-scrollbar {
    display: none;
}

.new_book_release .checkTree_dialog .button {
    float: right;
}

.extend_list {
    width: 80%;
}

.extend_list tr {
    border: 1px solid #d4d4d4;
}

.extend_list tr td {
    width: 25%;
    color: #5e5e5e;
    text-align: center;
    padding: 5px 0;
}

.extend_list tr td i {
    margin-left: 5px;
    cursor: pointer;
}

.extend_list .add_button {
    color: #1ab194;
}

.extend_list .delete_button {
    color: #e57e2f;
}

.out_bottom_box {
    width: 100%;
    overflow: hidden;
}

.out_bottom_box .bottom_box {
    float: left;
    margin-left: 50%;
    transform: translateX(-50%);
}
  .table-input-tips{
    position: absolute;
    bottom: 7px;
    height: 12px;
    left: 0;
  }
</style>
