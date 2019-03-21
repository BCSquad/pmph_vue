<template>
  <div class="out_content_manage">
           <p class="header_p">
             <el-select v-model="searchValue" class="searchName" placeholder="请选择">
               <el-option
                 v-for="item in searchList"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value">
               </el-option>
             </el-select>
             <el-input placeholder="请输入信息快报标题" v-if="searchValue==0" class="input" v-model.trim="contentParams.title" @keyup.enter.native="searchOutContent"></el-input>
             <el-input placeholder="请输入作者名称" v-if="searchValue==1" class="input" v-model.trim="contentParams.contentUsername" @keyup.enter.native="searchOutContent"></el-input>
             <!--<el-input placeholder="请输入所属教材" v-if="searchValue==2" class="input" v-model.trim="materialName" @keyup.enter.native="searchPublic"></el-input>-->

             <el-select v-model="contentParams.materialId" clearable placeholder="请选择" v-if="searchValue==2" class="input">
               <el-option
                 v-for="item in bookOptions"
                 :key="item.id"
                 :label="item.materialName"
                 :value="item.id">
               </el-option>
             </el-select>

             <el-date-picker
               v-if="searchValue==3"
               v-model="contentParams.startCreateDate"
               type="datetime"
               placeholder="选择创建开始时间"
               :picker-options="pickerOptions">
             </el-date-picker>
             <el-date-picker
               v-if="searchValue==3"
               v-model="contentParams.endCreateDate"
               type="datetime"
               placeholder="选择创建结束时间"
               :picker-options="pickerOptions">
             </el-date-picker>
             <el-date-picker
               v-if="searchValue==4"
               v-model="contentParams.startAuDate"
               type="datetime"
               placeholder="选择发布开始时间"
               :picker-options="pickerOptions">
             </el-date-picker>
             <el-date-picker
               v-if="searchValue==4"
               v-model="contentParams.endAuDate"
               type="datetime"
               placeholder="选择发布结束时间"
               :picker-options="pickerOptions">
             </el-date-picker>
              <span>发布状态：</span>
              <el-select v-model="contentParams.isPublished" clearable  style="width:186px" class="input" placeholder="全部">
               <el-option
                 v-for="item in selectOp"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value"
                 >
             </el-option>
             </el-select>
             <el-button type="primary" icon="search" @click="searchOutContent">搜索</el-button>


             <el-button type="primary" style="float:right;" @click="$router.push({name:'添加内容',query:{columnId:2}})">新增</el-button>
             <excelExport
               class="pull-right"
               :api_export_excel="'/pmpheep/infoExpress/exportExcel'"
               :params="contentParamsSearched"
               :disabled = "!tableData.length">
               导出Excel
             </excelExport>
           </p>
      <el-table :data="tableData" class="table-wrapper" border style="margin:15px 0;">
            <el-table-column
                label="信息快报标题"
                align="left"
                >
                <template scope="scope">
                  <p class="link"  @click="contentDetail(scope.row)">{{scope.row.title}}</p>
                </template>
            </el-table-column>
            <el-table-column
                prop="username"
                label="发布者"
                width="90"
                align="center"
                >
            </el-table-column>
        <el-table-column
          prop="apporpc"
          label="应用类型"
          align="center"
          width="100"
        >
          <template scope="scope">
            {{applyType[scope.row.apporpc]}}
          </template>
        </el-table-column>
           <el-table-column
                label="创建时间"
                align="center"
                width="180"
                >
                <template scope="scope">
                    {{$commonFun.formatDate(scope.row.gmtCreate)}}
                </template>
            </el-table-column>
            <el-table-column
                label="发布状态"
                align="center"
                width="100"
                >
                <template scope="scope">
                   {{scope.row.isPublished?'已发布':'未发布'}}
                </template>
            </el-table-column>
            <el-table-column
                label="发布时间"
                align="center"
                width="180"
                >
                <template scope="scope">
                    {{$commonFun.formatDate(scope.row.authDate)}}
                </template>
            </el-table-column>
            <!-- <el-table-column
                label="被查看次数"
                width="120"
                >
                <template scope="scope">
                    <el-tooltip class="item" effect="dark" content="阅" placement="bottom">
                        <i class="fa fa-book table_i">{{scope.row.clicks}}</i>
                    </el-tooltip>
                </template>
            </el-table-column> -->

            <el-table-column
                label="操作"
                align="center"
                width="190"
                >
                <template scope="scope">
                    <el-button type="text" @click="contentDetail(scope.row)">查看</el-button>
                    <el-button type="text" :disabled="scope.row.authStatus==1"   @click="editContent(scope.row)">修改</el-button>
                    <el-button type="text" :disabled="scope.row.authStatus==1" v-if="!scope.row.isPublished"  @click="tablePublishSubmit(scope.row,true)">发布</el-button>
                    <el-button type="text" :disabled="scope.row.authStatus==1" v-if="scope.row.isPublished"  @click="tablePublishSubmit(scope.row,false)">撤销</el-button>
                    <!-- <el-button type="text" @click="hideContent(scope.row)">隐藏</el-button> -->
                    <el-button type="text" @click="deleteContent(scope.row)">删除</el-button>
                </template>
            </el-table-column>

      </el-table>
      <!--分页-->
    <div class="pagination-wrapper">
      <el-pagination
        v-if="totalPage>contentParams.pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="contentParams.pageNumber"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="contentParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage">
      </el-pagination>
    </div>
     <!-- 内容详情查看界面 -->
   <el-dialog
            title=""
            :visible.sync="showContentDetail"
            size="large">
       <div style="padding:0 10%;">
        <p class="previewTitle text-center">{{contentDetailData.cmsContent.title}}</p>
         <p class="senderInfo text-center paddingT10">
      <span class="marginR10">{{contentDetailData.listObj.categoryName}}</span>
      <span>{{$commonFun.formatDate(contentDetailData.listObj.authDate)}}</span>
       </p>
       <el-form label-width="55px" v-if="contentDetailData.content">
         <el-form-item label-width="0">
           <div style="margin:0 auto;width:800px;"> <p v-html="contentDetailData.content.content"></p> </div>
         </el-form-item>
            <el-form-item label="附件：">
                <p type="text" style="color:#337ab7" v-for="item in contentDetailData.cmsExtras" :key="item.id" @click="download(item.attachment)">{{item.attachmentName}}</p>
           </el-form-item>
       </el-form>
        </div>
        <div style="width:100%;overflow:hidden" class="marginT20">
            <div class="center_box">
            <el-button type="primary"   @click="editContent(contentDetailData.listObj)">修改</el-button>
            <el-button type="primary" :disabled="contentDetailData.listObj.isPublished" @click="publishSubmit(true)">发布</el-button>
            </div>
        </div>
    </el-dialog>
  </div>
</template>
<style scoped>
.out_content_manage .el-tabs--border-card {
  border: 0;
  box-shadow: none;
}
.out_content_manage .header_p {
  overflow: hidden;
}
.out_content_manage .header_p .input {
  width: 217px;
  margin-right: 10px;
}
.out_content_manage .table_i {
  margin-right: 10px;
}
.out_content_manage .grey_icon {
  color: #999;
  cursor: pointer;
}
.out_content_manage .active_green {
  color: #13ce66;
}
.out_content_manage .active_orange {
  color: rgb(254, 215, 79);
}
.out_content_manage .active_blue {
  color: #20a0ff;
}
.out_content_manage .active_red {
  color: #ff4949;
}
.out_content_manage .active_yellow {
  color: #f7ba2a;
}
.out_content_manage .active_hide {
  color: #58b7ff;
}
.previewTitle {
  color: #14232e;
  font-size: 22px;
  font-weight: 500;
}
.out_content_manage .center_box {
  float: left;
  margin-left: 50%;
  transform: translateX(-50%);
}
.searchName{
  width: 150px;
}
</style>
<script type="text/javascript">
  import excelExport from "components/ExcelExport.vue";
  export default {
    data() {
      return {
        outContentUrl: "/pmpheep/cms/letters", //内容列表url
        publishedUrl:'/pmpheep/cms/letters/update',  //发布url
        deleteInfoUrl: "/pmpheep/cms/letters/content/", //信息快报删除url
        contentParams: {
          categoryId: "",
          title: "",
          isPublished: "",
          pageSize: 30,
          pageNumber: 1,
          contentUsername:'',
          materialId:'',
          startCreateDate: '', // 创建开始时间
          endCreateDate:'',
          startAuDate: '',
          endAuDate:''
        },
        contentParamsSearched:{},
        applyType:['全部','PC端','移动端'],
        bookOptions:[],
        totalPage: 10,
        options: [],
        defaultType: {
          value: "id",
          label: "categoryName"
        },
        selectOp: [
        {
          value:true,
          label:'已发布'
        },
        {
          value:false,
          label:'未发布'
        }
        ],
        tableData: [
          {
            id: 1,
            title: "关于开展“精准扶贫示范企业”试点工作的通知",
            comment: "信息快报",
            creatTime: "2017/10/23  03:47:00",
            name: "张武",
            isPublish: true,
            isExam: true,
            isTop: true,
            isHot: true,
            recommend: true,
            isHide: true
          }
        ],
        searchValue:0,
        searchList:[
          {
            value:0,
            label:'信息快报标题'
          },
          {
            value:1,
            label:'作者'
          },{
            value:2,
            label:'所属教材'
          },{
            value:3,
            label:'创建时间'
          },{
            value:4,
            label:'发布时间'
          }
        ],
        commentTableData: [],
        showContentDetail: false,
        contentDetailData: {
          cmsContent: "",
          cmsExtras: "",
          listObj: "",
          content: ''
        }
      };
    },
    components:{excelExport},
    methods: {

      /* 获取内容列表 */
      getOutContentList() {
        this.contentParams.startCreateDate = this.$commonFun.formatDate(+new Date(this.contentParams.startCreateDate));
        this.contentParams.endCreateDate = this.$commonFun.formatDate(+new Date(this.contentParams.endCreateDate));
        this.contentParams.startAuDate = this.$commonFun.formatDate(+new Date(this.contentParams.startAuDate));
        this.contentParams.endAuDate = this.$commonFun.formatDate(+new Date(this.contentParams.endAuDate));
        this.contentParams.sessionId = this.$getUserData().sessionId;
        this.contentParamsSearched = this.$commonFun.objArrayDeepCopy(this.contentParams);
        this.$axios
          .get(this.outContentUrl, {
            params: this.contentParams
          })
          .then(res => {
            console.log(res);
            if (res.data.code == 1) {
              this.tableData = res.data.data.rows;
              this.totalPage = res.data.data.total;
            }
          });
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
      searchOutContent(){
        this.contentParams.pageSize = 30;
        this.contentParams.pageNumber = 1;
        this.getOutContentList();
      },
      download(attachment){
        console.log("11111111111111"+attachment)
        this.$commonFun.downloadFile(attachment);
      },
      /* 发布 */
      publishSubmit(bool){
         this.$confirm(bool?'确定发布该快报?':'确定撤销改快报', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
        /* 接口字段复制 */
           var editData=this.contentDetailData;
           var obj={};
            for(var item in editData.cmsContent){
              if(item.indexOf('gmt')!=0){
                  if(typeof editData.cmsContent[item]!='boolean'){
                   obj[item]=editData.cmsContent[item]==null?'':editData.cmsContent[item]+'';
              }else{
                  obj[item]=editData.cmsContent[item]==null?'':editData.cmsContent[item];
              }
              }
            }
           obj.categoryId=parseInt(obj.categoryId);
           obj.isPublished=bool;
           obj.authStatus=bool?2:0;
           obj.content=editData.content.content;
           obj.attachment=[];
           obj.file=[];
           obj.scheduledTime='';

           console.log(obj);
           console.log(JSON.stringify(obj));
        this.$axios.put(this.publishedUrl,this.$commonFun.initPostData(obj)).then((res)=>{
                  console.log(res);
                  if(res.data.code==1){
                     this.$message.success(bool?"发布成功":'撤销成功');
                     this.getOutContentList();
                     this.showContentDetail=false;
                  }else {
                  this.$confirm(res.data.msg, "提示",{
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
              message: '已取消操作'
            });*/
          });
      },
      /* 查看详情 */
      contentDetail(obj) {
        this.$axios
          .get(this.outContentUrl + "/content/" + obj.id + "/detail", {})
          .then(res => {
            if (res.data.code == 1) {
              this.contentDetailData = res.data.data;
              this.contentDetailData.listObj = obj;
              console.log(this.contentDetailData);
            }
          });
        this.showContentDetail = true;
      },
      /* table发布 */
      tablePublishSubmit(obj,bool){
        this.$axios
          .get(this.outContentUrl + "/content/" + obj.id + "/detail", {})
          .then(res => {
            if (res.data.code == 1) {
              this.contentDetailData = res.data.data;
              this.contentDetailData.listObj = obj;
              console.log(this.contentDetailData);
              this.publishSubmit(bool);
            }
          });
      },
      /* 修改内容 */
      editContent(obj) {
        this.$axios
          .get(this.outContentUrl + "/content/" + obj.id + "/detail", {})
          .then(response => {
            console.log(res);
            let res = response.data
            if (res.code == 1) {
              if(res.data.content == null) {
                this.$confirm('此快报内容为空，错误数据，不能调转！', "提示",{
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  showCancelButton: false,
                  type: "error"
                });
                return;
              } else {
                this.$router.push({
                  name: "添加内容",
                  params: res.data,
                  query: { type: "edit", columnId: 2 }
                });
              }
            }
          });
      },
      /* 删除内容 */
      deleteContent(obj) {
        this.$confirm("确定删除该条信息快报?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$axios
              .delete(this.deleteInfoUrl + obj.id + "/delete")
              .then(res => {
                if (res.data.code == 1) {
                  this.getOutContentList();
                  this.$message.success("内容已删除");
                } else {
                  tthis.$confirm(res.data.msg, "提示",{
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
              message: "已取消删除"
            });*/
          });
      },
      /* 栏目选项改变 */
      handleChange(value) {
        this.contentParams.categoryId = value[value.length - 1] + "";
      },
      handleSizeChange(val) {
        this.contentParams.pageSize = val;
        this.contentParams.pageNumber = 1;
        this.getOutContentList();
      },
      handleCurrentChange(val) {
        this.contentParams.pageNumber = val;
        this.getOutContentList();
      }
    },
    created() {
      this.getOutContentList();
      this.getBookLists();
    }
  };
</script>

