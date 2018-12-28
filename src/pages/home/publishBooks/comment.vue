<template>
  <div class="clearfix page-commnet">



    <el-tabs type="border-card" v-model="activeIndex"  @tab-click="tabClick">
      <el-tab-pane label="短评管理" name="first">
        <TableShort :data.sync="tableData" @selection-change="handleSelectionChange" @audit="getTableData" @stateChange="getTableData" @show-comment-detail="showCommentDetail">
          <div class="clearfix" slot="searchBox">
            <div class="searchBox-wrapper">
              <div class="searchName">书籍名称/ISBN：<span></span></div>
              <div class="searchInput">
                <el-input placeholder="请输入" @keyup.enter.native="search" class="searchInputEle" v-model.trim="searchForm.name"></el-input>
              </div>
            </div>
            <div class="searchBox-wrapper">
              <div class="searchName">审核状态：<span></span></div>
              <div class="searchInput">
                <el-select  v-model="searchForm.isAuth" placeholder="全部" @change="search">
                  <el-option
                    v-for="(item,index) in stateOption"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="searchBox-wrapper searchBtn">
              <el-button  type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <!--操作按钮-->
            <div class="pull-right">

              <excelExport
                :api_export_excel="'/pmpheep/book/commet/exportExcel'"
                :params="{
                  name:this.searchedName,
                  isAuth:this.searchForm.isAuth,
                  isLong:this.searchForm.isLong
               }"
                :disabled = "!tableData.length">
                导出
              </excelExport>



              <el-button type="primary" :disabled="!selectData.length" @click="setState('isStick')">置顶</el-button>
              <el-button type="warning" :disabled="!selectData.length" @click="setState('cancel')">取消置顶</el-button>
              <!--<el-button type="primary" :disabled="!selectData.length" @click="setState('isPromote')">设为精选</el-button>-->
              <el-button type="danger" :disabled="!selectData.length" @click="deleteComment">删除</el-button>
              <el-button type="warning" :disabled="!selectData.length" @click="auditReason(2)">审核不通过</el-button>
              <el-button type="primary" :disabled="!selectData.length" @click="audit(1)">通过</el-button>
            </div>
          </div>

          <div slot="pagination"  class="pagination-wrapper">
            <el-pagination
              v-if="totalNum > searchForm.pageSize&&!searchForm.isLong"
              :page-sizes="[30,50,100, 200, 300, 400]"
              :page-size="searchForm.pageSize"
              :current-page="searchForm.pageNumber"
              @size-change="paginationSizeChange"
              @current-change="paginationCurrentChange"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalNum">
            </el-pagination>
          </div>
        </TableShort>
      </el-tab-pane>
      <!-- <el-tab-pane label="长评管理" name="second">
         <TableLong :data.sync="tableData" @selection-change="handleSelectionChange" @audit="getTableData" @stateChange="getTableData" @show-comment-detail="showCommentDetail">
           <div class="clearfix" slot="searchBox">
             <div class="searchBox-wrapper">
               <div class="searchName">书籍名称/ISBN：<span></span></div>
               <div class="searchInput">
                 <el-input placeholder="请输入" @keyup.enter.native="search" class="searchInputEle" v-model.trim="searchForm.name"></el-input>
               </div>
             </div>
             <div class="searchBox-wrapper">
               <div class="searchName">审核状态：<span></span></div>
               <div class="searchInput">
                 <el-select  v-model="searchForm.isAuth" placeholder="全部" @change="search">
                   <el-option
                     v-for="(item,index) in stateOption"
                     :key="item.label"
                     :label="item.label"
                     :value="item.value">
                   </el-option>
                 </el-select>
               </div>
             </div>
             <div class="searchBox-wrapper searchBtn">
               <el-button  type="primary" icon="search" @click="search">搜索</el-button>
             </div>
             &lt;!&ndash;操作按钮&ndash;&gt;
             <div class="pull-right">
               <el-button type="primary" :disabled="!selectData.length" @click="setState('isStick')">置顶</el-button>
               <el-button type="warning" :disabled="!selectData.length" @click="setState('cancel')">取消置顶</el-button>
               <el-button type="primary" :disabled="!selectData.length" @click="setState('isPromote')">设为精选</el-button>
               <el-button type="primary" :disabled="!selectData.length" @click="setState('isPromoteF')">取消精选</el-button>
               <el-button type="danger" :disabled="!selectData.length" @click="deleteComment">删除</el-button>
               <el-button type="warning" :disabled="!selectData.length" @click="audit(2)">审核不通过</el-button>
               <el-button type="primary" :disabled="!selectData.length" @click="audit(1)">通过</el-button>
             </div>
           </div>

           <div slot="pagination"  class="pagination-wrapper">
             <el-pagination
               v-if="totalNum > searchForm.pageSize&&searchForm.isLong"
               :page-sizes="[30,50,100, 200, 300, 400]"
               :page-size="searchForm.pageSize"
               :current-page.sync="searchForm.pageNumber"
               @size-change="paginationSizeChange"
               @current-change="paginationCurrentChange"
               layout="total, sizes, prev, pager, next, jumper"
               :total="totalNum">
             </el-pagination>
           </div>
         </TableLong>
       </el-tab-pane>-->
    </el-tabs>

    <el-dialog
      title="评论详情"
      :visible.sync="commentDialogVisible">
      <p>{{comment.content}}</p>
      <span slot="footer" class="dialog-footer"> </span>
    </el-dialog>

    <el-dialog
      title=""
      size="large"
      :visible.sync="commentDialogVisible_long">
      <div>
        <h5 class="previewTitle text-center">{{comment.title}}</h5>
        <p class="senderInfo text-center paddingT10">
          <span class="marginR10">{{comment.writerName}}</span>
          <span>{{comment.gmtCreate}}</span>
        </p>
        <div class="comment-main paddingT20" v-html="comment.content"></div>
      </div>
      <span slot="footer" class="dialog-footer"> </span>
    </el-dialog>
    <el-dialog
      title="审核"
      :visible.sync="authsDialogVisible"
      size="tiny"
      width="150px">
      <el-form>
        <el-form-item label="退回理由：">
          <el-input  type="textarea"  :rows="2"
                     placeholder="请输入退回理由" v-model.trim="reasons.reason"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="audit2">保 存</el-button>
                <el-button @click="authsDialogVisible = false">关闭</el-button>
            </span>
    </el-dialog>

  </div>
</template>

<script>
  import TableLong from './_subpage/comment-long-table.vue'
  import TableShort from './_subpage/comment-short-table.vue'
  import excelExport from "components/ExcelExport.vue";
  export default {
    data() {
      return {
        activeIndex:'first',
        tableData:[],
        selectData:[],
        searchedName:'',
        searchForm:{
          name:'',
          isAuth:'',
          pageSize:30,
          pageNumber:1,
          isLong:false,
        },
        stateOption:[{
          value:'',
          label:'全部'
        },{
          value:0,
          label:'待审核'
        },
          {
            value:1,
            label:'已通过'
          },
          {
            value:2,
            label:'不通过'
          }],
        totalNum:0,
        commentDialogVisible:false,
        commentDialogVisible_long:false,
        authsDialogVisible:false,
        reasons:{
          reason:'',
          num:'',
        },
        comment:{
          content:'',
          title:'',
        },
      }
    },
    created(){
      /* 是否从首页跳转过来 */
      if(this.$route.params.bookname){
        this.activeIndex=this.$route.params.isLong?'second':'first';
        this.searchForm.name=this.$route.params.bookname;
      }
      this.getTableData();
    },
    components:{
      TableLong,
      TableShort,
      excelExport
    },
    methods:{

      auditReason(num){
        this.authsDialogVisible = true;
        this.reasons.num=num;
      },
      audit2() {
        this.$confirm("确定审核" + "不通过" + "所选评论？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let url = '/pmpheep/bookusercomment/update';
            let ids=[];

            let writerIds=[];
            let booknames=[];
            let contents=[];
            this.selectData.forEach(iterm=>{
              ids.push(iterm.id);
              writerIds.push(iterm.writerId);
              booknames.push(iterm.bookname);
              contents.push(iterm.content);
            });
            this.$axios.put(url, this.$commonFun.initPostData({
              ids: ids,
              sessionId: this.$getUserData().sessionId,
              isAuth: this.reasons.num,
              reason:this.reasons.reason,
              writerId:writerIds,
              bookname:booknames,
              content:contents
            }))
              .then(response => {
                var res = response.data;
                if (res.code == 1) {
                  this.$message.success('提交成功');
                  this.$emit('audit');
                  this.authsDialogVisible=false
                  this.search()
                } else {
                  this.$confirm(res.msg.msgTrim(), "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    showCancelButton: false,
                    type: "error"
                  });
                }
              })
              .catch(e => {
                console.log(e);
                this.$confirm('操作失败请重试！', "提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  showCancelButton: false,
                  type: "error"
                });
              })
          })
          .catch(e => {
          })
      }
      ,
      /**
       * 获取表格数据
       */
      getTableData(){

        this.$axios.post('/pmpheep/bookusercomment/list',this.$initPostData({
          name:this.searchForm.name,
          isAuth:this.searchForm.isAuth,
          pageSize:this.searchForm.pageSize,
          pageNumber:this.searchForm.pageNumber,
          isLong:this.searchForm.isLong
        }))
          .then(response=>{
            var res = response.data;
            this.searchedName = this.searchForm.name;
            if(res.code==1){
              let list = ['待审核','已通过','不通过']
              res.data.rows.map(iterm=>{
                iterm.gmtCreate = this.$commonFun.formatDate(iterm.gmtCreate);
                iterm.state=list[iterm.isAuth];
              });
              console.log(11111);
              this.totalNum = res.data.total;
              this.tableData = res.data.rows;
            }
          })
          .catch(e=>{
            console.log(e);
          })
      },
      search(){
        this.searchForm.pageNumber=1;
        this.getTableData();
      },
      /**
       * 表格复选框发生变化触发事件
       */
      handleSelectionChange(val) {
        console.log(val)
        this.selectData = val;
      },
      /**
       * 删除选中行
       */
      deleteComment(){
        this.$confirm("确定删除所选评论？", "提示",{
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(()=>{
            let select = [];
            this.selectData.forEach(iterm=>{
              select.push(iterm.id);
            });
            this.$axios.delete('/pmpheep/bookusercomment/delete',{params:{
                ids:select.join(',')
              }})
              .then(response=>{
                let res = response.data;
                if(res.code==1){
                  this.$message.success('删除成功!');
                  this.getTableData();
                }else{
                  this.$confirm(res.msg.msgTrim(), "提示",{
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    showCancelButton: false,
                    type: "error"
                  });
                }
              })
              .catch(e=>{
                console.log(e);
              })
          })
          .catch(e=>{})
      },
      /**
       * 点击审核通过或不通过按钮
       * @param num 1为审核通过， 0为审核不通过
       */
      audit(num){
        var str = '';
        if (num == 1) {
          str = '通过';
        } else if (num = 2) {
          str = '不通过';
        }
        this.$confirm("确定审核"+str+"所选评论？", "提示",{
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(()=>{
            let url = '/pmpheep/bookusercomment/update';
            let select = [];
            this.selectData.forEach(iterm=>{
              select.push(iterm.id);
            });
            this.$axios.put(url,this.$commonFun.initPostData({
              ids:select.join(','),
              sessionId:this.$getUserData().sessionId,
              isAuth:num
            }))
              .then(response=>{
                var res = response.data;
                if(res.code==1){
                  this.$message.success('提交成功');
                  this.getTableData();
                }else{
                  this.$confirm(res.msg.msgTrim(), "提示",{
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    showCancelButton: false,
                    type: "error"
                  });
                }
              })
              .catch(e=>{
                console.log(e);
                this.$confirm('操作失败请重试！', "提示",{
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  showCancelButton: false,
                  type: "error"
                });
              })
          })
          .catch(e=>{})

      },
      /**
       * 设置评论状态，是否置顶，是否精选
       * @param typeText
       */
      setState(typeText){
        let url = '/pmpheep/bookusercomment/comment';
        let select = [];
        this.selectData.forEach(iterm=>{
          select.push(iterm.id);
        });
        this.$axios.put(url,this.$commonFun.initPostData({
          ids:select.join(','),
          isStick:typeText==='isStick'?true:(typeText==='cancel'? false : ''),
          sort:'',
          isPromote:typeText==='isPromote'?true:(typeText==='isPromoteF'?false:''),
          isHot:typeText==='isHot'?true:'',
          SortHot:'',
        }))
          .then(response=>{
            var res = response.data;
            if(res.code==1){
              this.$message.success('提交成功');
              this.getTableData();
            }else{
              this.$confirm('操作失败请重试！', "提示",{
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                showCancelButton: false,
                type: "error"
              });
            }
          })
          .catch(e=>{
            console.log(e);
            this.$confirm('操作失败请重试！', "提示",{
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              showCancelButton: false,
              type: "error"
            });
          })
      },
      /**
       * 显示评论详情
       * @param row
       */
      showCommentDetail(row){
        console.log(1,row)
        this.comment=row;
        if(this.searchForm.isLong){
          this.commentDialogVisible_long=true;
        }else{
          this.commentDialogVisible=true;
        }
      },
      /**
       * 分页每页显示条数发生改变
       * @param val
       */
      paginationSizeChange(val){
        this.searchForm.pageSize=val;
        this.searchForm.pageNumber=1;
        this.getTableData();
      },
      paginationCurrentChange(val){
        this.searchForm.pageNumber=val;
        this.getTableData();
      },
      /**
       * 切换标签页
       */
      tabClick(tab){
        let isLong = tab.label==='长评管理';
        this.searchForm.isLong=isLong;
        this.tableData = [];
        this.selectData = [];
        this.totalNum = 0;
        this.getTableData();
      }
    },
  }
</script>


<style scoped>
  .searchBox-wrapper{
    width: 340px;
  }
  .searchBox-wrapper.searchBtn{
    width: 94px;
  }
  .searchBox-wrapper .searchName{
    width: 110px;
  }
  .searchBox-wrapper .searchInput{
    margin-left: 114px;
  }
  .searchBox-wrapper.searchBtn{
    width: 100px;
  }
  .previewTitle {
    color: #14232e;
    font-size: 22px;
    font-weight: 500;
  }
</style>
