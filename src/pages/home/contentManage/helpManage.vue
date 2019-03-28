<template>
  <div class="help_manage">
  <el-tabs v-model="activeName" type="border-card"  @tab-click="handleClick">
    <el-tab-pane label="常见问题" name="first">
     <p class="header_p">
         <span>问题标题：</span>
         <el-input class="input" v-model="commonParams.title" @keyup.enter.native="commonSearch" placeholder="请输入问题标题"></el-input>
         <span>创建人：</span>
         <el-input class="input" v-model="commonParams.username" @keyup.enter.native="commonSearch"  placeholder="请输入创建人"></el-input>
         <el-button type="primary" icon="search" @click="commonSearch">搜索</el-button>

         <el-button type="primary" style="float:right" @click="$router.push({name:'常见问题',params:{type:'new'}})">新增</el-button>
     </p>
     <!-- 列表 -->
     <el-table :data="commonTableData" border class="table-wrapper" style="width:100%;margin-bottom:10px;">
         <el-table-column  label="问题标题" prop="title">
             <template scope="scope">
                <el-button type="text" @click="editSearch(scope.row.id,'check')" >{{scope.row.title}}</el-button>
             </template>
         </el-table-column>
         <el-table-column  label="创建人"  width="110" prop="username">
         </el-table-column>
         <el-table-column  label="创建时间"  width="120" >
             <template scope="scope">
                 {{$commonFun.formatDate(scope.row.gmtCreate,'yyyy-MM-dd')}}
             </template>
         </el-table-column>
         <el-table-column  label="操作"  width="120">
             <template scope="scope">
                 <el-button type="text" @click="editSearch(scope.row.id)">修改</el-button>
                 <span>|</span>
                 <el-button type="text" @click="deleteCommon(scope.row)">删除</el-button>
             </template>
         </el-table-column>
     </el-table>
          <!--分页-->
        <div class="pagination-wrapper">
            <el-pagination
                v-if="commonTotal>commonParams.pageSize"
                @size-change="commonSizeChange"
                @current-change="commonCurrentChange"
                :current-page.sync="commonParams.pageNumber"
                :page-sizes="[10,20,30,50]"
                :page-size="commonParams.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="commonTotal">
            </el-pagination>
            </div>

    </el-tab-pane>
    <el-tab-pane label="操作手册上传" name="second">
     <p class="header_p">
         <span>操作手册名称：</span>
         <el-input class="input" placeholder="请输入操作手册名称" @keyup.enter.native="operationSearch"  v-model="operationParams.manualName"></el-input>
         <span>创建人：</span>
         <el-input class="input" placeholder="请输入创建人"  @keyup.enter.native="operationSearch" v-model="operationParams.userName"></el-input>
         <el-button type="primary" icon="search" @click="operationSearch">搜索</el-button>

         <el-button type="primary" style="float:right" @click="$router.push({name:'操作手册上传',params:{type:'new'}})">新增</el-button>
     </p>
     <!-- 列表 -->
     <el-table :data="operationTableData" border  class="table-wrapper" style="width:100%;margin-bottom:10px;">
         <el-table-column  label="操作手册名称" prop="manualName">
           <template scope="scope">
             <a type="text" :href="'pmpheep/file/download/'+scope.row.attachment" style="color:#337ab7;display:block;"  >{{scope.row.manualName}}</a>
           </template>
         </el-table-column>
         <el-table-column  label="创建人"  width="110" prop="userName">
         </el-table-column>
         <el-table-column  label="创建时间"  width="120" >
             <template scope="scope">
               {{$commonFun.formatDate(scope.row.gmtCreate,'yyyy-MM-dd')}}
             </template>
         </el-table-column>
         <el-table-column  label="备注" prop="note">
         </el-table-column>
         <el-table-column  label="操作"  width="160">
             <template scope="scope">
                <!--  <el-button type="text">下载</el-button>
                 <span>|</span> -->
               <el-button type="text" @click="editHelpFile(scope.row.id)">编辑</el-button>
                 <el-button type="text" @click="deleteOperation(scope.row)">删除</el-button>
             </template>
         </el-table-column>
     </el-table>
          <!--分页-->
        <div class="pagination-wrapper">
            <el-pagination
                v-if="operationTotal>operationParams.pageSize"
                @size-change="operationSizeChange"
                @current-change="operationCurrentChange"
                :current-page.sync="operationParams.pageNumber"
                :page-sizes="[10,20,30,50]"
                :page-size="operationParams.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="operationTotal">
            </el-pagination>
        </div>
    </el-tab-pane>
  </el-tabs>

    <el-dialog
      :visible.sync="editDiaLog"
      fullscreen = "true"
      width="100%"
      title="修改操作手册"
    >


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
          <el-button type="primary"  style="display:block;margin:0 auto" @click="submit">保存</el-button>
        </div>
      </div>

    </el-dialog>

  </div>



</template>
<script type="text/javascript">
    export default{
        data(){
            return{
               commonListUrl:'/pmpheep/help/list',      //常见问题列表url
               operationListUrl:'/pmpheep/cms/manual/list',         //操作手册列表url
                getManualUrl:'/pmpheep/cms/manual/getManual',
              addOperationUrl:'/pmpheep/cms/update/manual',
              activeName:'first',
               commonTableData:[],
              editDiaLog:false,
               commonTotal:100,
               commonParams:{
                   pageSize:10,
                   pageNumber:1,
                   title:'',
                   username:''
               },


              formData:{
                manualName:'',
                attachment:'',
                note:'',
                fileList:[],
              },
               operationTableData:[],
               operationTotal:100,
               operationParams:{
                   pageSize:10,
                   pageNumber:1,
                   manualName:'',
                   userName:''
               }

            }
        },
        created () {
            this.activeName=this.$route.params.activeName?this.$route.params.activeName:'first';
            if(this.activeName=='first'){
                  this.getCommonList();
            }else{
                 this.getOperationList();
            }
        },
        methods:{


          /* 提交 */
          submit(){
            this.$refs.formData.validate((valid)=>{
              var _this=this;
              if(valid){
                this.$axios.post(_this.addOperationUrl,_this.$commonFun.initPostData({
                  id:_this.formData.id,
                  manualName:_this.formData.manualName,
                  attachment:this.formData.fileList[0].attachment,
                  note:_this.formData.note
                })).then((res)=>{
                  console.log(2);
                  if(res.data.code==1){
                    this.$message.success('修改成功');
                    this.editDiaLog=false;

                    this.getOperationList();
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

          editHelpFile(id) {
            this.formData.fileList=[];
            this.formData={};
            this.editDiaLog=true;
            this.$axios.get(this.getManualUrl,{
              params:{id:id}
            }).then((res)=>{
              console.log(res.data);
              if(res.data.code==1){

                this.formData=res.data.data;
                this.formData.fileList=[];
                  var obj={};
                  obj.name=res.data.data.manualName;
                  obj.url=res.data.data.attachment;
                  obj.attachment=res.data.data.attachment.split('/').pop();
                  this.formData.fileList.push(obj);
                  console.log("fileList")

              }
            })

          },



          /* 文件上传 */
          fileUploadSuccess(res,file,filelist){
            this.formData.fileList=[];
            this.formData.manualName=file.name;
            var obj={};
            obj.name=file.name;
            obj.url=file.url;
            obj.attachment=file.response.data;
            this.formData.fileList.push(obj);
            this.$refs.formData.validateField('fileList');
          },
          fileUploadRemove(file,filelist){
            this.formData.fileList=[];
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
        ,




          /* 获取常见问题列表 */
          getCommonList(){
            this.$axios.get(this.commonListUrl,{
                params:this.commonParams
            }).then((res)=>{
                console.log(res);
                if(res.data.code==1){
                    this.commonTableData=res.data.data.rows;
                    this.commonTotal=res.data.data.total;
                }
            })
          },
          /* 常见问题搜索 */
          commonSearch(){
            this.commonParams.pageNumber=1;
            this.getCommonList();
          },
          /* 修改查询 */
          editSearch(id,str){
            this.$axios.get('/pmpheep/help/'+id+'/detail',)
            .then((res)=>{
                if(res.data.code==1){
                    this.$router.push({name:'常见问题',params:{type:'edit',editData:res.data.data}});
                    this.$router.push({name:'常见问题',params:{type:'edit',editData:res.data.data,check:str}});
                }
            })
          },
          /* 删除常见问题 */
          deleteCommon(obj){
            this.$confirm('确认删除问题：<'+obj.title+'>?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            }).then(() => {
               this.$axios.delete('/pmpheep/help/'+obj.id+'/delete')
               .then((res)=>{
                   console.log(res);
                   if(res.data.code==1){
                       this.$message.success('问题已删除');
                       this.getCommonList();
                   }else{
                       this.$confirm(res.data.msg.msgTrim(), "提示",{
                       	confirmButtonText: "确定",
                       	cancelButtonText: "取消",
                       	showCancelButton: false,
                       	type: "error"
                       });
                   }
               })
            }).catch(() => {
            /*this.$message({
                type: 'info',
                message: '已取消删除'
             });*/
            });
          },
          handleClick(tab, event){
              console.log(tab);
              if(tab.name=='first'){
                this.getCommonList();
              }else{
                this.getOperationList();
              }
          },
          /* 常见问题分页 */
          commonSizeChange(val){
             this.commonParams.pageSize=val;
             this.commonParams.pageNumber=1;
             this.getCommonList();
          },
          commonCurrentChange(val){
             this.commonParams.pageNumber=val;
             this.getCommonList();
          },
          /* 操作列表 */
          getOperationList(){
              this.$axios.get(this.operationListUrl,{
                  params:this.operationParams
              }).then((res)=>{
                if(res.data.code==1){
                    this.operationTableData=res.data.data.rows;
                    this.operationTotal=res.data.data.total;
                }
              })
          },
          /* 操作搜索 */
          operationSearch(){
            this.operationParams.pageNumber=1;
             this.getOperationList();
          },
          deleteOperation(obj){
            this.$confirm('确认删除操作手册：<'+obj.manualName+'>?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                }).then(() => {
                  this.$axios.delete('pmpheep/cms/manual/'+obj.id+'/delete')
                  .then((res)=>{
                      if(res.data.code==1){
                          this.$message.success('成功删除');
                          this.getOperationList();
                      }else{
                          this.$confirm(res.data.msg.msgTrim(), "提示",{
                          	confirmButtonText: "确定",
                          	cancelButtonText: "取消",
                          	showCancelButton: false,
                          	type: "error"
                          });
                      }
                  })
                }).catch(() => {
                /*this.$message({
                    type: 'info',
                    message: '已取消删除'
                });*/
            });
          },
          /* 操作分页 */
          operationSizeChange(val){
             this.operationParams.pageSize=val;
             this.operationParams.pageNumber=1;
             this.getOperationList();
          },
          operationCurrentChange(val){
             this.operationParams.pageNumber=val;
             this.getOperationList();
          }
        }
    }
</script>
<style scoped>
.help_manage .el-tabs{
   border:none;
   box-shadow: none;
}
.help_manage .header_p {
  overflow: hidden;
  margin-bottom:10px;
}
.help_manage .header_p .input {
  width: 188px;
  margin-right: 10px;
}
</style>
