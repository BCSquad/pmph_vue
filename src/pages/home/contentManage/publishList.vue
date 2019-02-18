<template>
  <div class="publish_list" >
      <el-tabs type="border-card">
  <el-tab-pane label="内容">
      <p class="header_p">
        <el-select v-model="searchValue" class="searchName" placeholder="请选择">
          <el-option
            v-for="item in searchList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input placeholder="请输入文章标题" v-if="searchValue==0" class="input" v-model.trim="searchTitle" @keyup.enter.native="searchPublic"></el-input>
        <el-input placeholder="请输入作者名称" v-if="searchValue==1" class="input" v-model.trim="contentUsername" @keyup.enter.native="searchPublic"></el-input>
        <!--<el-input placeholder="请输入所属教材" v-if="searchValue==2" class="input" v-model.trim="materialName" @keyup.enter.native="searchPublic"></el-input>-->

        <el-select v-model="materialId" clearable placeholder="请选择" v-if="searchValue==2" class="input">
          <el-option
            v-for="item in bookOptions"
            :key="item.id"
            :label="item.materialName"
            :value="item.id">
          </el-option>
        </el-select>

        <el-date-picker
          v-if="searchValue==3"
          v-model="startCreateDate"
          type="datetime"
          placeholder="选择创建开始时间"
          :picker-options="pickerOptions">
        </el-date-picker>
        <el-date-picker
          v-if="searchValue==3"
          v-model="endCreateDate"
          type="datetime"
          placeholder="选择创建结束时间"
          :picker-options="pickerOptions">
        </el-date-picker>
        <el-date-picker
          v-if="searchValue==4"
          v-model="startAuDate"
          type="datetime"
          placeholder="选择发布开始时间"
          :picker-options="pickerOptions">
        </el-date-picker>
        <el-date-picker
          v-if="searchValue==4"
          v-model="endAuDate"
          type="datetime"
          placeholder="选择发布结束时间"
          :picker-options="pickerOptions">
        </el-date-picker>
          <span>审核状态：</span>
          <el-select v-model="selectValue" clearable  style="width:150px" class="input" placeholder="全部">
             <el-option
               v-for="item in selectOp"
               :key="item.value"
               :label="item.label"
               :value="item.value"
               >
             </el-option>
          </el-select>
          <el-button type="primary" icon="search" @click="searchPublic">搜索</el-button>
          <el-button type="primary" style="float:right;" @click="$router.push({name:'添加内容',query:{columnId:1,type:'new',isShowCover:true}})">新增</el-button>
          <el-button type="primary"   style="float:right;" @click="syncDialogVisible=true">同步</el-button>
          <excelExport
            class="pull-right "
            :api_export_excel="'/pmpheep/articel/exportExcel'"
            :params="searchedParams"
            :disabled = "!tableData.length">
            导出Excel
          </excelExport>
      </p>
      <el-table :data="tableData" class="table-wrapper" border style="margin:15px 0;">
            <el-table-column
                label="文章标题"
                align="center" min-width="100"
                >
                <template scope="scope">
                    <p class="link"  @click="contentDetail(scope.row)">{{scope.row.title}}</p>
                </template>
            </el-table-column>
            <!-- 管理员才予以显示 -->
            <el-table-column
                prop="authorname"
                label="文章来源"
                align="center"
                width="100"
                >
            </el-table-column>
        <el-table-column
          prop="realname"
          label="发布者"
          align="center"
          width="90"
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
                width="120"
                >
                <template scope="scope">
                    {{$commonFun.formatDate(scope.row.gmtCreate)}}
                </template>
            </el-table-column>
            <el-table-column
                label="审核时间"
                align="center"
                width="120"
                >
                <template scope="scope">
                    {{$commonFun.formatDate(scope.row.authDate)}}
                </template>
            </el-table-column>
            <el-table-column
                label="审核状态"
                align="center"
                width="100"
                >
                <template scope="scope">
                  <p v-if="scope.row.authStatus==0&scope.row.authorType==2">未审核</p>
                  <p v-if="scope.row.authStatus==0&scope.row.authorType!=2">暂存</p>
                  <p v-if="scope.row.authStatus==1&scope.row.authorType==2">未通过</p>
                  <p v-if="scope.row.authStatus==2&&scope.row.isPublished==false">未发布</p>
                  <p v-if="scope.row.authStatus==2&&scope.row.isPublished==true">已发布</p>
                </template>
            </el-table-column>
            <el-table-column
                label="相关统计"
                align="center"
                width="190"
                >
                <template scope="scope">
                    <!-- <el-tooltip class="item" effect="dark" content="赞" placement="bottom">
                        <i class="fa fa-thumbs-o-up table_i" >{{scope.row.likes}}</i>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="阅" placement="bottom">
                        <i class="fa fa-book table_i">{{scope.row.clicks}}</i>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="评" placement="bottom">
                        <i class="fa fa-comment table_i">{{scope.row.comments}}</i>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="藏" placement="bottom">
                        <i class="fa fa-star-o table_i">{{scope.row.bookmarks}}</i>
                    </el-tooltip> -->
                    <i class="fa fa-thumbs-o-up table_i"  title="赞">{{scope.row.likes}}</i>
                    <i class="fa fa-book table_i" title="阅">{{scope.row.clicks}}</i>
                     <i class="fa fa-comment table_i" title="评">{{scope.row.comments}}</i>
                     <i class="fa fa-star-o table_i" title="藏">{{scope.row.bookmarks}}</i>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                min-width="160"
                >
                <template scope="scope">
                  <!-- <el-button type="text" :disabled="scope.row.isPublished"  @click="publishContent(scope.row)">发布</el-button> -->
                  <el-button type="text" @click="contentDetail(scope.row)">查看</el-button>
                  <el-button type="text"  v-if="scope.row.isPublished!=true" @click="editContent(scope.row,scope.row.authStatus)">编辑</el-button>
                  <el-button type="text" :disabled="scope.row.authStatus==1"
                             v-if="scope.row.authStatus==0&&scope.row.authorType==2"
                             @click="examineContent(scope.row,2)">通过
                  </el-button>
                  <el-button type="text" :disabled="scope.row.authStatus==1"
                             v-if="scope.row.authStatus==0&&scope.row.authorType==2"
                             @click="examineContent(scope.row,1)">退回
                  </el-button>
                  <el-button type="text" :disabled="scope.row.authStatus==1"
                             v-if="scope.row.authStatus==2&&scope.row.isPublished==false"
                             @click="examineContent(scope.row,3)">发布
                  </el-button>
                  <el-button type="text" :disabled="scope.row.authStatus==1" v-if="scope.row.isPublished==true"
                             @click="examineContent(scope.row,4)">撤回
                  </el-button>
                  <!-- <el-button type="text" @click="hideContent(scope.row)">隐藏</el-button> -->
                  <el-button type="text" @click="deleteContent(scope.row)">删除</el-button>
                  <el-button type="text" :disabled="scope.row.isPublished==false" @click="recommend(scope.row)">推荐
                  </el-button>
                </template>
            </el-table-column>

      </el-table>
      <!--分页-->
    <div class="pagination-wrapper">
      <el-pagination
        v-if="pageTotal>pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10,20,30,50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageTotal">
      </el-pagination>
    </div>

    <!-- 文章查看界面 -->
    <el-dialog
     title=""
     :visible.sync="showContentDetail"
     size="large">
       <div style="padding:0 10%;">
        <p class="previewTitle text-center">{{contentDetailData.cmsContent.title}}</p>
         <p class="senderInfo text-center paddingT10">
      <span class="marginR10">{{contentDetailData.listObj.authorname}}</span>
      <span>{{$commonFun.formatDate(contentDetailData.listObj.gmtCreate)}}</span>
       </p>
       <el-form label-width="90px" v-if="contentDetailData.content">
         <el-form-item label="" label-width="0">
           <div style="margin:0 auto;width:800px;">
             <p v-html="contentDetailData.content.content"></p>
           </div>
         </el-form-item>
         <el-form-item label="封面图片：" v-if="contentDetailData.imgFilePath">
           <img  :src="contentDetailData.imgFilePath.split('/').length>=2?contentDetailData.imgFilePath:'pmpheep/image/'+contentDetailData.imgFilePath" />
         </el-form-item>
         <el-form-item label="附件：" v-if="contentDetailData.cmsExtras.length!=0">
              <a type="text" :href="item.attachment" style="color:#337ab7;display:block;" v-for="item in contentDetailData.cmsExtras" :key="item.id">{{item.attachmentName}}</a>
         </el-form-item>
       </el-form>
        </div>
        <div style="width:100%;overflow:hidden" class="marginT20">
            <div class="center_box">
       <!--     <el-button type="primary"   :disabled="contentDetailData.listObj.authStatus==1"  @click="editContent(contentDetailData.listObj)">修改</el-button>
            <el-button type="danger" :disabled="contentDetailData.listObj.authStatus!=0"  @click="examineContent(contentDetailData.listObj,1)" >退回</el-button>
            <el-button type="primary" :disabled="contentDetailData.listObj.authStatus!=0"  @click="examineContent(contentDetailData.listObj,2)" >通过</el-button>-->
            </div>
        </div>
    </el-dialog>

    <!--文章推荐-->
    <el-dialog

      :visible.sync="recommendDialogVisible"
      fullscreen = "true"
      min-width="800px"
      width="100%"
    >
      <span slot="title" class="el-dialog__title">相关文章推荐配置【{{recommendCmsTitle}}】</span>
      <div class="searchBox-wrapper" style="line-height: 36px;float:left;width: 635px">
        <div  style="display:inline-block;width: 310px;">
            <div  style="width: 80px;display:inline-block;">文章标题：</div>
            <el-input placeholder="请输入" style="display:inline-block;width: 200px;"  @keyup.enter.native="recommendSearch" v-model.trim="recommendSearchForm.cmsTitle"></el-input>
          </div>
        <div style="display:inline-block;width: 300px;">
          <div style="width: 50px;display:inline-block;">作者：</div>
          <el-input placeholder="请输入" style="display:inline-block;width: 200px;"  @keyup.enter.native="recommendSearch" v-model.trim="recommendSearchForm.cmsAuthorName"></el-input>
        </div>
        </div>
        <div style="line-height: 36px;float:left;">
            <el-checkbox label="相关文章" v-model="recommendSearchForm.relationCms"></el-checkbox>
        </div>

        <div style="text-align:right;margin-bottom:15px;display:inline-block;float:right;">
          <!-- <el-button @click="recommendDialogVisible = false">取 消</el-button>-->
          <!--<el-button  @click="recommendreset"  type="primary" icon="search" >重置</el-button>-->
          <el-button  @click="recommendSearch"  type="primary" icon="search" >搜索</el-button>
        </div>
        <el-table :data="recommendData" border>
          <el-table-column property="cmsTitle" label="文章标题"  align="center"></el-table-column>
          <el-table-column  property="cmsAuthorName" label="作者" width="150" align="center" >
          </el-table-column>
          <el-table-column   label="相关文章"width="200" align="center" >
            <template scope="scope">
              <el-checkbox v-model="scope.row.relationCms"  @change="checkboxChange(scope.row)"></el-checkbox>
            </template>
          </el-table-column>

      </el-table>
      <!--分页-->
      <div class="pagination-wrapper" style="padding-top:10px;padding-bottom:10px;">
        <el-pagination
          v-if="recommendTotalNum "
          :page-sizes="[10,20,30, 40]"
          :page-size="recommendSearchForm.recommendPageSize"
          :current-page.sync="recommendSearchForm.recommendPageNumber"
          @size-change="recommendPaginationSizeChange"
          @current-change="getRecommendTableData"
          layout="total, sizes, prev, pager, next, jumper"
          :total="recommendTotalNum">
        </el-pagination>
      </div>
    </el-dialog>
   <!-- 同步弹框 -->
    <el-dialog title="稿件同步"
     :visible.sync="syncDialogVisible"
     size="tiny"
     class="sync_dialog"
    >
      <el-input placeholder="请输入链接地址" v-model="syncInputUrl"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="syncGetArticle" type="primary" :loading="isSyncLoading">{{isSyncLoading?'同步中':'确 定'}}</el-button>
      </span>
    </el-dialog>

    <el-dialog title="稿件同步"
               :visible.sync="syncDialogVisible1"
               size="tiny"
               class="sync_dialog"
    >
      <!--<el-input placeholder="请输入链接地址" v-model="syncInputUrl"></el-input>-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="syncCheckDetail" type="primary">确定</el-button>
      </span>
    </el-dialog>
  </el-tab-pane>
  <el-tab-pane label="评论">
      <p class="header_p">
          <!-- <el-cascader
            :options="options"
            v-model="selectedOptions"
            :clearable="true"
            class="input"
            placeholder="请选择栏目"
            @change="handleChange">
          </el-cascader> -->
          <span>文章标题：</span>
          <el-input placeholder="请输入" class="input" v-model="commentTitle" @keyup.enter.native="searchComment"></el-input>
          <span style="margin-left:10px;">评论人：</span>
          <el-input placeholder="输入姓名/账号" class="input" v-model="commentName" @keyup.enter.native="searchComment"></el-input>
          <span>审核状态：</span>
          <el-select v-model="commentSelect" clearable  style="width:186px" class="input" placeholder="全部">
           <el-option
             v-for="item in commentSelectOp"
             :key="item.value"
             :label="item.label"
             :value="item.value"
             >
         </el-option>
         </el-select>
         <el-button type="primary" icon="search" @click="searchComment">搜索</el-button>

      </p>
    <p >
      <el-button type="primary" icon="search" style="float:right;margin:10px 10px;"  @click="exportExcel">导出</el-button>
      <el-button type="danger" style="float:right;margin:10px 0;" :disabled="!isCommentSelected" @click="deleteComment()">批量删除</el-button>
    </p>
      <el-table :data="commentTableData" class="table-wrapper" @selection-change="commentSelectChange" border style="margin:15px 0;">
            <el-table-column
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column
                label="文章标题"
                prop="title"
                >
                <template scope="scope">
                    <p class="link" @click="commentDetail(scope.row)">{{scope.row.title}}</p>
                </template>
            </el-table-column>
            <el-table-column
              label="评论人"
              prop="username"
              width="100"
            >
            </el-table-column>
            <el-table-column
                prop="gmtCreate"
                label="评论时间"
                >
            </el-table-column>
            <el-table-column
                prop="authDate"
                label="审核时间"
                >
            </el-table-column>
            <el-table-column
                label="审核状态"
                width="110"
                >
                <template scope="scope">
                    <p v-if="scope.row.authStatus==0">待审核</p>
                    <p v-if="scope.row.authStatus==1">未通过</p>
                    <p v-if="scope.row.authStatus==2">已通过</p>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                width="180"
                >
                <template scope="scope">
                    <el-button type="text" :disabled="!scope.row.authStatus==0" @click="commentModeration(scope.row.id,2)">通过</el-button>
                    <el-button type="text" :disabled="!scope.row.authStatus==0" @click="commentModeration(scope.row.id,1)">未通过</el-button>
                    <el-button type="text"  @click="deleteComment(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>

      </el-table>

    <div class="pagination-wrapper">
      <el-pagination
      v-if="comDataTotal>20"
        @size-change="commentHandleSizeChange"
        @current-change="commentHandleCurrentChange"
        :current-page="comPageNumber"
        :page-sizes="[10, 20, 30, 40,50]"
        :page-size="comPageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="comDataTotal">
      </el-pagination>
    </div>
    <!-- 评论查看界面 -->
    <el-dialog
     title="评论详情"
     :visible.sync="showCommentDetail"
     size="large">
       <div style="padding:0 10%;">
        <p class="previewTitle text-center">{{commentDetailData.cmsContent.title}}</p>
         <p class="senderInfo text-center paddingT10">
      <span class="marginR10">{{commentDetailData.listObj.username}}</span>
      <span>{{commentDetailData.listObj.authDate}}</span>
       </p>
       <el-form label-width="55px">

         <el-form-item label="" label-width="0">
           <div style="margin:0 auto;width:800px;">
           <p v-html="commentDetailData.content.content"></p>
           </div>
         </el-form-item>
       </el-form>
        </div>
        <div style="width:100%;overflow:hidden">
            <div class="center_box">
            <el-button type="danger" :disabled="commentDetailData.listObj.authStatus!=0"  @click="commentModeration(commentDetailData.listObj.id,1)" >退回</el-button>
            <el-button type="primary" :disabled="commentDetailData.listObj.authStatus!=0"  @click="commentModeration(commentDetailData.listObj.id,2)" >通过</el-button>
            </div>
        </div>
    </el-dialog>
  </el-tab-pane>

</el-tabs>


  </div>
</template>
<script type="text/javascript">
  import excelExport from "components/ExcelExport.vue";
  export default {
    components:{excelExport},
    data() {
      return {
      syncDialogVisible1: false,
      publicListUrl: "/pmpheep/cms/contents", //获取列表url
      editContentUrl: "/pmpheep/cms/content/", //修改查询url
      deleteContentUrl: "/pmpheep/cms/content/", //删除内容url
      examineUrl: "/pmpheep/cms/content/check", //审核内容
      backUrl:'/pmpheep/cms/content/update',
      commentListUrl:'/pmpheep/cms/comments',         //评论列表url
      syncGetUrl:'/pmpheep/cms/wechat/article/getArticle',         //同步地址url
      syncGetDetailUrl:'/pmpheep/cms/wechat/article/synchro',          //获取稿件详情detail
      selectOp: [
        {
          value: 5,
          label: "暂存"
        },
        {
          value: 0,
          label: "未审核"
        },
        {
          value: 1,
          label: "未通过"
        },
        {
          value: 4,
          label: "未发布"
        },
        {
          value: 3,
          label: "已发布"
        }
      ],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      commentSelectOp: [
        {
          value: 0,
          label: "待审核"
        },
        {
          value: 1,
          label: "未通过"
        },
        {
          value: 2,
          label: "已通过"
        }
      ],
      searchValue:0,
      searchList:[
        {
          value:0,
          label:'文章标题'
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
      applyType:['全部','PC端','移动端'],
      showContentDetail: false,
      syncDialogVisible:false,
      isSyncLoading:false,
      syncInputUrl:'',
      contentDetailData: {
        cmsContent: "",
        cmsExtras: "",
        listObj: "",
        content: ""
      },
      tableData: [],
      recommendData: [],
      recommendSearchForm:{
        currentCmsId:0,
        relationCms:null,
        cmsTitle:'',
        cmsAuthorName:'',
        recommendPageSize:10,
        recommendPageNumber:1
      },
      recommendTotalNum:0,
      recommendDialogVisible:false,
      recommendCmsTitle:'',

        contentUsername:'',
        selectValue: "",
        currentPage: 1,
        searchTitle: "",
        pageTotal: 30,
        pageSize: 30,
        /* 评论*/
        options: [],
        selectedOptions: [],
        showCommentDetail: false,
        commentDetailData:{
          cmsContent: "",
          cmsExtras: "",
          listObj: "",
          content: ""
        },
        commentTableData: [],
        comPageSize: 20,
        comDataTotal: 21,
        comPageNumber: 1,
        commentSelectData: [],
        commentName:'',
        commentTitle:'',
        commentSelect:'',
        startCreateDate: '', // 创建开始时间
        endCreateDate:'',
        startAuDate: '',
        endAuDate:'',
        bookOptions: [],
        materialId:''
      };
    },
    computed: {
      isCommentSelected() {
        if (this.commentSelectData.length > 0) {
          return true;
        } else {
          return false;
        }
      }
    },
    methods: {
      exportExcel(){
        /** 导出Excel */
        let url = '/pmpheep/article/exportComments?title='+this.searchTitle+'&username='+this.contentUsername+"&authStatus="+this.selectValue;
        // console.log(url)
        this.$commonFun.downloadFile(url);
      },
      /* 获取内容列表 */
      getPublicList() {
        this.searchedParams = {
          title: this.searchTitle,
          username:this.contentUsername,
          authStatus: this.selectValue,
          sessionId: this.$getUserData().sessionId,
          pageSize: this.pageSize,
          pageNumber: this.currentPage,
          startCreateDate: this.$commonFun.formatDate(+new Date(this.startCreateDate)),
          endCreateDate: this.$commonFun.formatDate(+new Date(this.endCreateDate)),
          startAuDate: this.$commonFun.formatDate(+new Date(this.startAuDate)),
          endAuDate: this.$commonFun.formatDate(+new Date(this.endAuDate)),
          materialId: this.materialId
        };
        this.$axios
          .get(this.publicListUrl, {
            params: this.searchedParams
          })
          .then(res => {
            console.log(res);
            if (res.data.code == 1) {
              this.pageTotal = res.data.data.total;
              this.tableData = res.data.data.rows;
            }
          });
      },
      searchPublic(){
        this.pageSize = 30;
        this.currentPage = 1;
        this.getPublicList()
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
      /* 获取评论列表 */
      getCommentList(){
        this.$axios.get(this.commentListUrl,{
            params:{
              title:this.commentTitle,
              authStatus:this.commentSelect,
              categoryId:0,
              username:this.commentName,
              pageSize:this.comPageSize,
              pageNumber:this.comPageNumber,
              sessionId:this.$getUserData().sessionId,
            }
        }).then((response)=>{
            // console.log(res);
            let res = response.data
            if (res.code == 1 ) {
              this.comDataTotal = res.data.total
              // this.commentTableData.gmtCreate =
              res.data.rows.map(item=>{
                  item.gmtCreate=this.$commonFun.formatDate(item.gmtCreate);
                  item.authDate = this.$commonFun.formatDate(item.authDate);
              });
              this.commentTableData = res.data.rows
              console.log(this.commentTableData )
            }
        })
      },
      searchComment(){
        this.comPageSize = 20;
        this.comPageNumber = 1;
        this.getCommentList();
      },
      /**评论审核 */
      commentModeration(id, status){
        this.$axios.put('/pmpheep/cms/comment/check',this.$initPostData({
          id: id,
          authStatus: status,
          sessionId: this.$getUserData().sessionId
        })).then(response => {
          let res = response.data
          if (res.code == 1) {
            this.$message.success('审核完成！')
            this.getCommentList()
            if (this.showCommentDetail) {
              this.showCommentDetail = false
            }
          }
        })
      },
      /**批量删除评论 */
      deleteComment(id){
        var ids = []
        this.$confirm(id?'确认删除该条评论？':'确认删除选中的评论吗？',"提示",{
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }).then(()=>{
          if(id){
            ids=id;
          }else{
           this.commentSelectData.forEach(item => {
            ids.push(item.id)
          })
          }
          this.$axios.delete('/pmpheep/cms/comment/delete',{
            params: {
              ids :id?id:ids.toString()
            }
          }).then(response => {
            let res = response.data
            if (res.code == 1) {
              this.$message.success('删除成功!');
              this.getCommentList()
            }else{
              this.$confirm(res.msg.msgTrim(), "提示",{
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                showCancelButton: false,
                type: "error"
              });
            }
          })
        })

    },
    /**展示评论详情 */
    commentDetail(obj){
      console.log(obj);
      this.$axios
        .get(this.editContentUrl + obj.id + "/detail", {})
        .then(res => {
          if (res.data.code == 1) {
            this.commentDetailData = res.data.data;
            this.commentDetailData.listObj = obj;
            this.showCommentDetail = true;
            // console.log(this.contentDetailData);
          }
        });
    },
    /* 查看详情 */
    contentDetail(obj) {
      this.$axios
        .get(this.editContentUrl + obj.id + "/detail", {})
        .then(res => {
          if (res.data.code == 1) {
            this.contentDetailData = res.data.data;
            this.contentDetailData.listObj = obj;
            console.log(res);
           // this.commentDetailData.content = res.data.content;
            this.showContentDetail = true;
            console.log(this.contentDetailData);
          }
        });
    },
    /* 发布内容 */
    publishContent(obj) {
      this.$axios
        .put("/pmpheep/cms/content/" + obj.id + "/publish")
        .then(res => {
          console.log(res);
          if (res.data.code == 1) {
            this.$message.success("文章已发布");
            this.getPublicList();
          } else {
            this.$confirm(res.data.msg, "提示",{
            	confirmButtonText: "确定",
            	cancelButtonText: "取消",
            	showCancelButton: false,
            	type: "error"
            });
          }
        });
    },
    /* 修改内容 */
    editContent(obj,authStatus) {
      this.$axios
        .get(this.editContentUrl + obj.id + "/search", {})
        .then(res => {
          console.log(res);
          if (res.data.code == 1) {
            this.$router.push({
              name: "添加内容",
              params: res.data.data,
              query: { type: "edit", columnId: 1 ,isShowCover:true}
            });
          }
        });
    },
    /* 审核内容 */
    examineContent(obj, status) {
      console.log(obj);
      if(status==1){
        this.$prompt('请输入退回原因', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          this.$axios
            .put(
              this.backUrl,
              this.$commonFun.initPostData({
                id: obj.id,
                materialId:obj.materialId,
                categoryId:obj.categoryId,
                authorId:obj.authorId,
                title:obj.title,
                authorType:obj.authorType,
                returnReason:value,
                authStatus: status,
                sessionId: this.$getUserData().sessionId
              })
            )
            .then(res => {
              console.log(res);
              if (res.data.code == 1) {
                this.$message.success("退回成功");
                this.showContentDetail = false;
                this.getPublicList();
              } else {
                this.$confirm(res.data.msg, "提示",{
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  showCancelButton: false,
                  type: "error"
                });
              }
            });
        }).catch(() => {
          /* this.$message({
             type: 'info',
             message: '已取消操作'
           });*/
        });
      }else{
        let msg='';
        let rmsg='';
        switch (status) {
          case 2: msg="确定审核文章",rmsg='审核成功' ;
            break;
          case 3: msg="确定发布该文章",rmsg='发布成功';
          break;
          case 4: msg='确定撤回该文章',rmsg='撤回成功';
          break;
        }

        this.$confirm(msg, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$axios
              .put(
                this.examineUrl,
                this.$commonFun.initPostData({
                  id: obj.id,
                  authStatus: status,
                  sessionId: this.$getUserData().sessionId
                })
              )
              .then(res => {
                console.log(res);
                if (res.data.code == 1) {
                  this.$message.success(rmsg);
                  this.showContentDetail = false;
                  this.getPublicList();
                } else {
                  this.$confirm(res.data.msg, "提示",{
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    showCancelButton: false,
                    type: "error"
                  });
                }
              });
          })
          .catch(() => {
            /* this.$message({
               type: "info",
               message: "已取消操作"
             });*/
          });




      }
    },
    recommendPaginationSizeChange(val){
      this.recommendSearchForm.recommendPageSize=val;
      this.recommendSearchForm.recommendPageNumber=1;
      this.getRecommendTableData();
    },
    checkboxChange(row){
      this.$axios.get('/pmpheep/cms/recommendcheck',{params:{
          currentCmsId:this.recommendSearchForm.currentCmsId,
          relationCmsId:row.id,
          relationCms:row.relationCms,

          }}).then(response=>{
          var res = response.data;
          if(res.code==1){ // 返回数据没有异常 回显数据 避免重复点击 数据操作异常
            row.relationCms = res.data;
          }

        })
      },
      getRecommendTableData(){

        this.$axios.get('/pmpheep/cms/recommendlist',{params:{
            cmsTitle:this.recommendSearchForm.cmsTitle,
            currentCmsId:this.recommendSearchForm.currentCmsId,
            recommendPageSize:this.recommendSearchForm.recommendPageSize,
            recommendPageNumber:this.recommendSearchForm.recommendPageNumber,
            relationCms:this.recommendSearchForm.relationCms?this.recommendSearchForm.relationCms:null,
            cmsAuthorName:this.recommendSearchForm.cmsAuthorName

          }})
          .then(response=>{
            var res = response.data;
            if(res.code==1){
              this.recommendTotalNum = res.data.total;
              this.recommendData = res.data.rows;
              this.recommendData.forEach(row=>{
                row.relationCms = row.relationCms == 1?true:false;
              })
            }

          }).catch(e=>{
          console.log(e);
        })
      },
      recommendSearch(){
        this.recommendSearchForm.recommendPageNumber=1;
        this.getRecommendTableData();
      },
      recommendreset(){
        this.recommendSearchForm.cmsTitle = '';
        this.recommendSearchForm.cmsAuthorName='';
        this.recommendSearchForm.relationCms=null;
        this.recommendSearchForm.recommendPageNumber=1;
        this.getRecommendTableData();
      },
      /**推荐*/
      recommend(row){
        this.recommendData=[];
        this.recommendSearchForm.cmsTitle = '';
        this.recommendSearchForm.cmsAuthorName='';
        this.recommendSearchForm.relationCms=null;
        this.recommendSearchForm.recommendPageNumber=1;
        this.recommendCmsTitle = row.title;
        this.recommendSearchForm.currentCmsId = row.id;
        this.recommendDialogVisible = true;
        this.recommendTotalNum=0;
        this.getRecommendTableData();
      },
      /* 删除内容 */
      deleteContent(obj) {{
        url:this.syncInputUrl
      }
        this.$confirm("确定删除该文章?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$axios
              .delete(this.deleteContentUrl + obj.id + "/delete")
              .then(res => {
                if (res.data.code == 1) {
                  this.getPublicList();
                  this.$message.success("删除操作成功");
                } else {
                  this.$confirm(res.data.msg.msgTrim(), "提示",{
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
      handleSizeChange(val) {
        this.pageSize = val;
        this.currentPage = 1;
        this.getPublicList();
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getPublicList();
      },
      commentSelectChange(val) {
        this.commentSelectData = val;
      },
      commentHandleSizeChange(val) {
        this.comPageSize = val;
        this.getCommentList()
      },
      commentHandleCurrentChange(val) {
        this.comPageNumber = val
        this.getCommentList()
      },
      /* 同步弹框确定按钮 */
      syncGetArticle(){
        this.isSyncLoading=true;
        this.$axios.post('/pmpheep/cms/wechat/article/getArticle',this.$commonFun.initPostData(
          {
            url:this.syncInputUrl
          }
        )).then((res)=>{
          console.log(res);
          if(res.data.code==1){
           // this.getPublicList();
            setTimeout(() => {
              this.syncCheckDetail(res.data.data);
            }, 3000);
  //          this.syncDialogVisible1 = true;

          }else{
            this.isSyncLoading=false;
            this.$confirm(res.data.msg.msgTrim(), "提示",{
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              showCancelButton: false,
              type: "error"
            });
          }
        })
      },
      /* 查看稿件详情 */
      syncCheckDetail(id){

       this.$axios.get('/pmpheep/cms/wechat/article/synchro',{
         params:{
             guid:id
         }
       }).then((res)=>{
         console.log(res);
         if(res.data.code==1){
             if(!res.data.data.id){
               setTimeout(() => {
                 this.syncCheckDetail(id);
               }, 5000);

             }else{
               /* 有值的时候 */
               this.getPublicList();
               this.isSyncLoading=false;
               this.$message.success('同步成功!');
               this.syncDialogVisible=false;
               this.syncInputUrl='';
               return;
             }
         }else{
           this.isSyncLoading=false;
           this.$confirm(res.data.msg.msgTrim(), "提示",{
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            showCancelButton: false,
            type: "error"
           });
         }
       })
      }
    },
    created() {
      /* 是否从首页跳转过来 */
      if(this.$route.params.searchInput){
        this.searchTitle=this.$route.params.searchInput;
      }
      this.getPublicList();
      this.getCommentList();
      this.getBookLists();
    }
  };
</script>
<style >
  .el-dialog--small {
    width: 70% !important;
  }
  .el-dialog__title{
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    width: 400px;
    text-overflow: ellipsis;
    line-height: 20px;
  }
  </style>
<style scoped>


.publish_list .header_p {
  overflow: hidden;
}
.publish_list .header_p .input {
  width: 190px;
  margin-right: 10px;
}
.publish_list .table_i {
  margin-right: 10px;
}
.publish_list .grey_icon {
  color: #999;
  cursor: pointer;
}
.publish_list .active_green {
  color: #13ce66;
}
.publish_list .active_orange {
  color: rgb(254, 215, 79);
}
.publish_list .active_blue {
  color: #20a0ff;
}
.publish_list .active_red {
  color: #ff4949;
}
.publish_list .active_yellow {
  color: #f7ba2a;
}
.publish_list .active_hide {
  color: #58b7ff;
}
.previewTitle {
  color: #14232e;
  font-size: 22px;
  font-weight: 500;
}
.publish_list .center_box {
  float: left;
  margin-left: 50%;
  transform: translateX(-50%);
}
.publish_list .el-tabs--border-card {
  border: 0;
  box-shadow: none;
}
  .searchName{
    width: 120px;
  }
</style>

