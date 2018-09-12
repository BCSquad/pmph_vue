<template>
	<div class="material-result">
    <el-tabs v-model="activeName" @tab-click="handleTabsClick">
      <el-tab-pane label="学科分类" :name="'subject'">

        <div class="applicationStatistics-byBookName">
        <!--搜索-->
        <div class="clearfix">
          <div class="searchBox-wrapper">
            <div class="searchName">学科分类：<span></span></div>
            <div class="searchInput">
              <el-input placeholder="请输入" class="searchInputEle" v-model.trim="subject.type_name" @keyup.enter.native="getSubjectTableDataFun"></el-input>
            </div>
          </div>
          <div class="searchBox-wrapper searchBtn">
            <el-button  type="primary" icon="search" @click="getSubjectTableDataFun">搜索</el-button>
          </div>
         <!-- <el-button type="primary" class="pull-right" @click="importSubjectExcel">
            <i class="fa fa-cloud-upload" aria-hidden="true"></i>
            点击上传
          </el-button>-->
          <my-upload
            class="pull-right "
            ref="upload"
            :action="api_upload_subject"
            :before-upload="beforeUploadFile"
            :on-success="upLoadFileSuccess"
            :on-error="uploadError"
            :show-file-list="false">
            <el-button type="primary" :disabled="uploadLoading"  :loading="uploadLoading" >{{uploadLoading?'上传解析中...':'点击导入'}}</el-button>
           <!-- <el-button type="primary" :disabled="!productbtn"  v-else>{{'请先维护产品信息'}}</el-button>-->
          </my-upload>
          <span class="pull-right"><a style="color: #337ab7;line-height:36px;margin-right:10px;" href="/static/学科分类导入模板.xlsx">模板下载.xls</a></span>
        </div>
        <!--表格-->
        <div class="table-wrapper">
          <el-table
            :data="subjectTableData"
            border
            style="width: 100%">
            <el-table-column
              type="index" label="序号" align="center"
              width="70">
              <template scope="scope">
                {{(scope.$index+1)+subject.pageSize*(subject.pageNumber-1)}}
              </template>
            </el-table-column>
            <el-table-column
              prop="type_name"
              label="学科分类">
            </el-table-column>
            <el-table-column
              prop="data_sources"
              label="数据来源"
              align="center"
              width="110">
            </el-table-column>
            <el-table-column
              prop="gmt_create"
              label="创建时间"
              align="center"
              width="120">
              <template scope="scope">
                {{$commonFun.formatDate(scope.row.gmt_create,'yyyy-MM-dd')}}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="168">
              <template scope="scope">
                <el-button type="text" @click="deleteOperation(scope.row.id,'subject')">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--分页-->
        <div class="pagination-wrapper">
          <el-pagination
            v-if="subjectTotal>subject.pageSize"
            @size-change="subjectSizeChange"
            @current-change="subjectCurrentChange"
            :page-sizes="[10,20,30, 50, 100]"
            :page-size="subject.pageSize"
            :current-page="subject.pageNumber"
            layout="total, sizes, prev, pager, next, jumper"
            :total="subjectTotal">
          </el-pagination>
        </div>
      </div>
      </el-tab-pane>
      <el-tab-pane label="申报专业" :name="'declareMajor'">
        <div class="applicationStatistics-byContent">
          <!--搜索-->
          <div class="clearfix">
            <div class="searchBox-wrapper">
              <div class="searchName">申报专业：<span></span></div>
              <div class="searchInput">
                <el-input placeholder="请输入" class="searchInputEle" v-model.trim="declareMajor.type_name" @keyup.enter.native="getDeclareMajorTableDataFun"></el-input>
              </div>
            </div>
            <div class="searchBox-wrapper searchBtn">
              <el-button  type="primary" icon="search" @click="getDeclareMajorTableDataFun">搜索</el-button>
            </div>
            <!--<el-button type="primary" class="pull-right marginL10" @click="importContentExcel">
              <i class="fa fa-cloud-upload" aria-hidden="true"></i>
              导出
            </el-button>-->
            <my-upload
              class="pull-right "

              :action="api_upload_declareMajor"
              :before-upload="beforeUploadFile"
              :on-success="upLoadFileSuccess"
              :on-error="uploadError"
              :show-file-list="false">
              <el-button type="primary" :disabled="uploadLoading"  :loading="uploadLoading" >{{uploadLoading?'上传解析中...':'点击导入'}}</el-button>
              <!--<el-button type="primary" :disabled="!productbtn"  v-else>{{'请先维护产品信息'}}</el-button>--> </my-upload>
            <span class="pull-right"><a style="color: #337ab7;line-height:36px;margin-right:10px;" href="/static/申报专业导入模板.xlsx">模板下载.xls</a></span>
          </div>
          <!--表格-->
          <div class="table-wrapper">
            <el-table
              :data="declareMajorTableData"
              border
              style="width: 100%">
              <el-table-column
                type="index" label="序号" align="center"
                width="70">
                <template scope="scope">
                  {{(scope.$index+1)+declareMajor.pageSize*(declareMajor.pageNumber-1)}}
                </template>
              </el-table-column>
              <el-table-column
                prop="type_name"
                label="申报专业">
              </el-table-column>
              <el-table-column
                prop="data_sources"
                label="数据来源"
                align="center"
                width="110" >
              </el-table-column>

              <el-table-column
                prop="gmt_create"
                label="创建时间"
                align="center"
                width="120">
                <template scope="scope">
                  {{$commonFun.formatDate(scope.row.gmt_create,'yyyy-MM-dd')}}
                </template>
              </el-table-column>

              <el-table-column label="操作" width="168">
                <template scope="scope">
                  <el-button type="text" @click="deleteOperation(scope.row.id,'profession')">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!--分页-->
          <div class="pagination-wrapper">
            <el-pagination
              v-if="declareMajorTotal>declareMajor.pageSize"
              @size-change="declareMajorSizeChange"
              @current-change="declareMajorCurrentChange"
              :page-sizes="[10,20,30, 50,100]"
              :page-size="declareMajor.pageSize"
              :current-page="declareMajor.pageNumber"
              layout="total, sizes, prev, pager, next, jumper"
              :total="declareMajorTotal">
            </el-pagination>
          </div>

        </div>
      </el-tab-pane>
      <el-tab-pane label="内容分类" :name="'content'">
        <div class="applicationStatistics-byContent">
          <!--搜索-->
          <div class="clearfix">
            <div class="searchBox-wrapper">
              <div class="searchName">内容分类：<span></span></div>
              <div class="searchInput">
                <el-input placeholder="请输入" class="searchInputEle" v-model.trim="content.type_name" @keyup.enter.native="getContentTableDataFun"></el-input>
              </div>
            </div>
            <div class="searchBox-wrapper searchBtn">
              <el-button  type="primary" icon="search" @click="getContentTableDataFun">搜索</el-button>
            </div>
            <!--<el-button type="primary" class="pull-right marginL10" @click="importContentExcel">
              <i class="fa fa-cloud-upload" aria-hidden="true"></i>
              导出
            </el-button>-->
            <my-upload
              class="pull-right "
              ref="upload"
              :action="api_upload_content"
              :before-upload="beforeUploadFile"
              :on-success="upLoadFileSuccess"
              :on-error="uploadError"
              :show-file-list="false">
              <el-button type="primary" :disabled="uploadLoading"  :loading="uploadLoading" >{{uploadLoading?'上传解析中...':'点击导入'}}</el-button>
              <!--<el-button type="primary" :disabled="!productbtn"  v-else>{{'请先维护产品信息'}}</el-button> v-if="productbtn"-->

            </my-upload>
            <span class="pull-right"><a style="color: #337ab7;line-height:36px;margin-right:10px;" href="/static/内容分类导入模板.xlsx">模板下载.xls</a></span>
          </div>
          <!--表格-->
          <div class="table-wrapper">
            <el-table
              :data="contentTableData"
              border
              style="width: 100%">
              <el-table-column
                type="index" label="序号" align="center"
                width="70">
                <template scope="scope">
                  {{(scope.$index+1)+content.pageSize*(content.pageNumber-1)}}
                </template>
              </el-table-column>
              <el-table-column
                prop="type_name"
                label="内容分类">
              </el-table-column>
              <el-table-column
                prop="data_sources"
                label="数据来源"
                align="center"
                width="110" >
              </el-table-column>

              <el-table-column
                prop="gmt_create"
                label="创建时间"
                align="center"
                width="120">
                <template scope="scope">
                  {{$commonFun.formatDate(scope.row.gmt_create,'yyyy-MM-dd')}}
                </template>
              </el-table-column>

              <el-table-column label="操作" width="168">
                <template scope="scope">
                  <el-button type="text" @click="deleteOperation(scope.row.id,'content')">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!--分页-->
          <div class="pagination-wrapper">
            <el-pagination
              v-if="contentTotal>content.pageSize"
              @size-change="contentSizeChange"
              @current-change="contentCurrentChange"
              :page-sizes="[10,20,30, 50,100]"
              :page-size="content.pageSize"
              :current-page="content.pageNumber"
              layout="total, sizes, prev, pager, next, jumper"
              :total="contentTotal">
            </el-pagination>
          </div>

        </div>
      </el-tab-pane>


    </el-tabs>
	</div>
</template>

<script>
  import { Loading } from 'element-ui';
	export default {
    props:['productType'],
		data() {
			return {
       // fullscreenLoading: false,
        loadingInstance:undefined,
        activeName:"subject",
        declareMajorUrl:'/pmpheep/productType/'+this.productType+'/profession/list'   ,  //内容统计URL
        contentUrl:'/pmpheep/productType/'+this.productType+'/content/list'   ,  //内容统计URL
        subjectUrl:'/pmpheep/productType/'+this.productType+'/subject/list',   //学科统计URL
        deleteUrl:'/pmpheep/productType/',
        api_upload_content: '/pmpheep/productType/'+this.productType+'/content/importExcel',
        api_upload_subject: '/pmpheep/productType/'+this.productType+'/subject/importExcel',
        api_upload_declareMajor: '/pmpheep/productType/'+this.productType+'/profession/importExcel',
        content:{
        pageNumber:1,
          pageSize:10,
          type_name:''
      },
        uploadLoading:false,
        productbtn:true,
        contentTotal:1,
        contentTableData:[],
        subject:{
        pageNumber:1,
          pageSize:10,
          type_name:''
      },
        subjectTotal:1,
        subjectTableData:[],
        declareMajor:{
          pageNumber:1,
          pageSize:10,
          type_name:''
        },
        declareMajorTotal:1,
        declareMajorTableData:[],

    };
		},methods: {
      /*openFullScreen2() {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        setTimeout(() => {
          loading.close();
        }, 2000);
      },*/
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
        /* if(file.name.length>40){
         this.$confirm("文件名不能超过40个字符", "提示",{
             confirmButtonText: "确定",
             cancelButtonText: "取消",
             showCancelButton: false,
             type: "error"
         });
         return;
         } */
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
        this.uploadLoading=flag;
        return flag;
        //this.loadingInstance = Loading.service({ fullscreen: true });
        },
      /**
       * 上传文件请求成功的回调
       */
      upLoadFileSuccess(res, file, fileList){
        if (res.code == '1') {
         /* this.excelVisible = true;
          this.excelTableData = res.data.list;
          this.uuid=res.data.uuid;*/
          if(this.activeName=="content"){
            this.getContentTableDataFun();
          }else if(this.activeName=="subject"){
            this.getSubjectTableDataFun();
          }else{
            this.getDeclareMajorTableDataFun();
          }

         this.$message.success("导入成功");
          console.log(res);
        }else{
          this.$confirm(res.msg.msgTrim(), "提示",{
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            showCancelButton: false,
            type: "error"
          });
        }
        var _this = this;
        // this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
        //   _this.loadingInstance.close();
        // });
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
        var _this = this;
        // this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
        //   _this.loadingInstance.close();
        // });
        this.uploadLoading = false;
      },


      getDeclareMajorTableDataFun(){
        this.declareMajor.pageNumber=1;
        this.getDeclareMajorTableData();
      },
      /* 获取内容申报情况统计数据 */
      getDeclareMajorTableData(){
        this.$axios.get(this.declareMajorUrl,{
          params:this.declareMajor
        }).then((res)=>{
          if(res.data.code==1){
            var resData = res.data.data;
            this.declareMajorTotal=resData.total;
            resData.rows.forEach(iterm=>{
              iterm["data_sources"]="导入";
            });
            this.declareMajorTableData=resData.rows;

          }
        })
      },
      getContentTableDataFun(){
        this.content.pageNumber=1;
        this.getContentTableData();
      },
      /* 获取内容申报情况统计数据 */
      getContentTableData(){
        this.$axios.get(this.contentUrl,{
          params:this.content
        }).then((res)=>{
          if(res.data.code==1){
            var resData = res.data.data;
            this.contentTotal=resData.total;
            resData.rows.forEach(iterm=>{
              iterm["data_sources"]="导入";
            });
            this.contentTableData=resData.rows;

          }
        })
      },

      getSubjectTableDataFun(){
        this.subject.pageNumber=1;
        this.getSubjectTableData();
      },
      /* 获取按学科统计申报情况 */
      getSubjectTableData(){
        this.$axios.get(this.subjectUrl,{
          params:this.subject
        }).then((res)=>{
          console.log(res)
          console.log(this.subjectTableData)
          if(res.data.code==1){
            this.subjectTotal=res.data.data.total;
            res.data.data.rows.forEach(iterm=>{
              iterm["data_sources"]="导入";
            });
            this.subjectTableData=res.data.data.rows;
          }
        })
      },

      /* 分页切换 */
      declareMajorSizeChange(val){
        this.declareMajor.pageSize=val;
        this.declareMajor.pageNumber=1;
        this.getDeclareMajorTableData();
      },
      declareMajorCurrentChange(val){
        this.declareMajor.pageNumber=val;
        this.getDeclareMajorTableData();
      },
      /* 分页切换 */
      contentSizeChange(val){
        this.content.pageSize=val;
        this.content.pageNumber=1;
        this.getContentTableData();
      },
      contentCurrentChange(val){
        this.content.pageNumber=val;
        this.getContentTableData();
      },
      subjectSizeChange(val){
        this.subject.pageSize=val;
        this.subject.pageNumber=1;
        this.getSubjectTableData();
      },
      subjectCurrentChange(val){
        this.subject.pageNumber=val;
        this.getSubjectTableData();
      },
      deleteOperation(id,type){
        this.$confirm("确定删除选中数据?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
        this.$axios.get(this.deleteUrl+type+'/delete',{
          params:{
            id:id
          }
        }).then((res)=>{
          if(res.data.code==1){
            this.$message.success('删除成功');
            if(type=="content"){
              this.getContentTableDataFun();
            }else if(type == "subject"){
              this.getSubjectTableDataFun();
            }else{
              this.getDeclareMajorTableDataFun();
            }
          }else{
            this.$confirm(res.data.msg.msgTrim(), "提示",{
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              showCancelButton: false,
              type: "error"
            });
          }
        }).catch(e=>{console.log(e)})
          })
          .catch(() => {});
      },
      /**
       * 点击tabs切换
       */
      handleTabsClick(tab, event) {
        console.log(tab,event);
        this.subject.type_name='';
        this.content.type_name='';
        if(tab.name=='subject'){
          this.getSubjectTableDataFun();
        }else if(tab.name == "content"){
          this.getContentTableDataFun();
        }else{
          this.getDeclareMajorTableDataFun();
        }
      },
      getBtnStatus(){
        this.$axios.get('/pmpheep/productType/getBtnStatus',{
          params:{
            productType:this.productType
          }
        }).then((res)=>{
          if(res.data.code==1){
            this.productbtn =res.data.data.subject?true:false;
          }else{
            this.$confirm(res.data.msg.msgTrim(), "提示",{
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              showCancelButton: false,
              type: "error"
            });
          }
        }).catch(e=>{console.log(e)})
      }

    },
    watch:{
    //   productType(val,old){
    //     alert(111);
    //   this.getBtnStatus();
    // }
    },
    components:{


    },
    created(){
      //this.getContentTableData();
      this.getSubjectTableDataFun();
        this.getBtnStatus();

    },
    mounted() {


    }
	}
</script>

<style scoped>
  .title {
    margin-bottom: 18px;
    margin-left: 20px;
    font-size: 15px;
    color: #8a8585;
  }
  .num-chart-iterm {
    display: inline-block;
    width: 180px;
  }
  .num-chart-iterm > div {
    margin: 0 auto;
    width: 104px;
    height: 62px;
    border-bottom: none !important;
    border-radius: 68px 68px 0 0;
    text-align: center;
    line-height: 20px;
  }
  .num-chart-iterm > div > span {
    font-size: 14px;
    font-weight: bold;
  }
  .num-chart-iterm > div > span.small {
    font-size: 18px;
  }
  .num-chart-iterm > p {
    background: #fff;
    border: 1px solid #ccc;
    height: 20px;
    line-height: 20px;
    border-radius: 10px;
    width: 140px;
    margin: 0 auto;
    text-align: center;
  }
  .num-chart-iterm:nth-of-type(n + 1) > div {
    border: 8px solid #c24fb7;
    color: #c24fb7;
  }
  .num-chart-iterm:nth-of-type(n + 2) > div {
    border: 8px solid #ff9f40;
    color: #ff9f40;
  }
  .num-chart-iterm:nth-of-type(n + 3) > div {
    border: 8px solid #ff685f;
    color: #ff685f;
  }
  .num-chart-iterm:nth-of-type(n + 4) > div {
    border: 8px solid #25a3de;
    color: #25a3de;
  }
  .num-chart-iterm:nth-of-type(n + 5) > div {
    border: 8px solid #2dc183;
    color: #2dc183;
  }
  .num-chart-iterm:nth-of-type(n + 6) > div {
    border: 8px solid #357ab3;
    color: #357ab3;
  }

  .gray{
    color:#8a8585;
    font-weight: normal;
  }
  .marginspan{
    display: inline-block;
    margin-top: 27px;
  }
</style>
