<template>
  <div class="mic_video">
    <el-tabs type="border-card" @tab-click="tabChange" v-model="activeName">
      <el-tab-pane label="待确认" name="first">
        <p class="header_p">
          <span>图书名称：</span>
          <el-input class="input" v-model="searchParams.bookName" @keyup.enter.native="search"
                    placeholder="请输入图书名称"></el-input>
          <span>类型：</span>
          <el-select v-model="searchParams.synchronizationType" clearable style="width:150px;margin-right:10px;"
                     placeholder="请选择">
            <el-option label="新增" value="add"></el-option>
            <el-option label="修改" value="update"></el-option>
            <el-option label="上架" value="shelf"></el-option>
            <el-option label="下架" value="obtained"></el-option>
          </el-select>
          <span>同步时间：</span>
          <el-date-picker
            v-model="searchParams.syncTimeStart"
            type="date"
            @change="startDateChange"
            placeholder="选择日期"
          >
          </el-date-picker>
          <span>—</span>
          <el-date-picker
            v-model="searchParams.syncTimeEnd"
            type="date"
            @change="endDateChange"
            placeholder="选择日期"
            style="margin-right:5px;"
          >
          </el-date-picker>
          <el-button icon="search" type="primary" style="margin-bottom:10px;" @click="search(1)">搜索</el-button>
          <el-button type="primary" style=""  @click="syncBook()" :disabled="bookSyncVisible">{{bookSyncVisible?'正在同步中...':'图书全量同步'}}<i v-if="bookSyncVisible" class="fa fa-spinner fa-pulse loading"></i></el-button>


          <el-button  style="float: right" type="danger" @click="batchDel">批量删除</el-button>
          <el-button  style="float: right" type="primary" @click="batchConfirm">批量导入</el-button>


        </p>
        <!-- 列表 -->
        <el-table :data="tableData" border style="width:100%;margin-bottom:10px;"  @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column label="图书名称" prop="bookname">
          </el-table-column>
          <el-table-column label="ISBN" prop="isbn">
          </el-table-column>
          <el-table-column label="同步日期">
            <template scope="scope">
              {{$commonFun.formatDate(scope.row.syncGmt,'yyyy-MM-dd HH:mm:ss ')}}
            </template>
          </el-table-column>

          <el-table-column label="是否增量更新">
            <template scope="scope">
              {{scope.row.increment?'增量更新':'全量更新'}}
            </template>
          </el-table-column>
          <el-table-column label="类型">
            <template scope="scope">
              {{scope.row.synchronizationType=='add'?'新增':scope.row.synchronizationType=='update'?"修改":scope.row.synchronizationType=='shelf'?"上架":"下架"}}
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template scope="scope">
              <el-button type="text" style="color:#337ab7;" @click="showDetail(scope.row)">查看详情</el-button>
              <el-button type="text" style="color:#337ab7;" @click="getMaterialTypeTree(scope.row)">确认导入</el-button>
              <el-button type="text" style="color:#337ab7;" @click="delectBookSyncConfirm(scope.row.id)">删除</el-button>

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
      </el-tab-pane>
      <el-tab-pane label="已确认" name="second">
        <p class="header_p">
          <span>图书名称：</span>
          <el-input class="input" v-model="searchParams.bookName" @keyup.enter.native="search(2)"
                    placeholder="请输入图书名称"></el-input>
          <span>类型：</span>
          <el-select v-model="searchParams.synchronizationType" clearable style="width:150px;margin-right:10px;"
                     placeholder="请选择">
            <el-option label="新增" value="add"></el-option>
            <el-option label="修改" value="update"></el-option>
            <el-option label="上架" value="shelf"></el-option>
            <el-option label="下架" value="obtained"></el-option>
          </el-select>
          <span>同步时间：</span>
          <el-date-picker
            v-model="searchParams.syncTimeStart"
            type="date"
            @change="startDateChange"
            placeholder="选择日期"
          >
          </el-date-picker>
          <span>—</span>
          <el-date-picker
            v-model="searchParams.syncTimeEnd"
            type="date"
            @change="endDateChange"
            placeholder="选择日期"
            style="margin-right:5px;"
          >
          </el-date-picker>
          <el-button icon="search" type="primary" style="margin-bottom:10px;" @click="search">搜索</el-button>
        </p>
        <!-- 列表 -->
        <el-table :data="tableData" border style="width:100%;margin-bottom:10px;">
          <el-table-column label="图书名称" prop="bookname">
          </el-table-column>
          <el-table-column label="isbn" prop="isbn">
          </el-table-column>
          <el-table-column label="同步日期">
            <template scope="scope">
              {{$commonFun.formatDate(scope.row.syncGmt,'yyyy-MM-dd HH:mm:ss ')}}
            </template>
          </el-table-column>

          <el-table-column label="是否增量更新">
            <template scope="scope">
              {{scope.row.increment?'增量更新':'全量更新'}}
            </template>
          </el-table-column>
          <el-table-column label="类型">
            <template scope="scope">
              {{scope.row.synchronizationType=='add'?'新增':scope.row.synchronizationType=='update'?"修改":scope.row.synchronizationType=='shelf'?"上架":"下架"}}
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template scope="scope">

              <el-button type="text" style="color:#337ab7;" @click="revokeBookSyncComfirm(scope.row)">撤回导入</el-button>

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

      </el-tab-pane>
    </el-tabs>


    <el-dialog
      title="图书同步详情"
      :visible.sync="syncDetailDialog"
      class='book_dialog'
      size="tiny"
    >
      <el-table :data="detailData" border style="width:100%;margin-bottom:10px;">

        <el-table-column label="属性名称" prop="name">
        </el-table-column>
        <el-table-column label="修改前" prop="oldBook">
        </el-table-column>
        <el-table-column label="修改后" prop="newBook">

          <template scope="scope">
            <span v-if="scope.row.equals==true">{{scope.row.newBook}}</span>
            <span v-else style="color: red">{{scope.row.newBook}}</span>
          </template>
        </el-table-column>



      </el-table>
      <div style="width:100%" class="marginT20">
        <div class="center_box">
          <el-button type="primary"   @click="getMaterialTypeTree()">确认导入</el-button>
          <el-button type="delect" @click="delectBookSyncConfirm">删除</el-button>
          <el-button type="close" @click="closedialg">关闭</el-button>
        </div>
      </div>


    </el-dialog>



    <!-- 选择书籍弹框  -->
      <el-dialog
        title="选择分类"
        :visible.sync="materialTypeTreeDialog"
        class='book_dialog'
        size="tiny"
      >
        <div class="materialType-tree">
          <div class="clearfix">
            <div class="operation-wrapper">
              <el-button type="primary" @click="confirmSubmit()" :disabled="!hasSelected"> 确认选择</el-button>
            </div>
          </div>
          <div class="table-wrapper">
            <el-tree :data="treeData"
                     :highlight-current=true
                     :expand-on-click-node=false
                     :auto-expand-parent=true
                     :props="defaultProps"
                     @node-click="_handleNodeClick"
                     :lazy="true"
                     :load="_loadNode"
                     node-key="id"
                     :default-expanded-keys="default_expanded_keys"
            ></el-tree>
          </div>
        </div>
      </el-dialog>
    <!--同步弹窗-->
    <div class="shade" v-if="bookSyncVisible">
      <h1 class="text-center sync-title"><i class="fa fa-spinner fa-pulse loading"></i>正在同步……</h1>
      <el-progress class="progress" :text-inside="true" :stroke-width="18" :percentage="progresspoint" status="success"></el-progress>
    </div>


  </div>
</template>
<script type="text/javascript">
  export default {
    props: {
      manage: {
        type: Boolean,
        required: false
      },
      sync: {
        type: Boolean,
        required: false
      }
    },
    watch:{
      dialogFormVisible(val){
        if(val){
          this.activeName='first';
          this.getList(1);
        }

      }
    },
    data() {
      return {
        detailData:[],
        activeName: 'first',
        treeDataUrl: "/pmpheep/materialType/tree", //获取教材分类树url
        bookSyncListUrl: '/pmpheep/aiptest/getList',  //视频列表url
        confirmUrl: '/pmpheep/aiptest/confirmBook', //  审核视频url
        detailUrl: '/pmpheep/aiptest/showDetail',
        batchdelUrl:'/pmpheep/aiptest/batchdel',
        batchConfirmUrl:'/pmpheep/aiptest/batchConfirm',
        delectUrl: '/pmpheep/aiptest/delectBookSyncConfirm', //  审核视频url
        revokeUrl: '/pmpheep/aiptest/revokeBookSyncComfirm', //  审核视频url
        tableData: [],
        bookListData: [],
        progresspoint: 0,
        bookSyncVisible:false,
        materialTypeTreeDialog: false,
        syncDetailDialog:false,
        multipleSelection:"",
        detail:{},
        nodeId: 0,
        pageTotal: 100,
        searchParams: {
          confirm: false,
          synchronizationType: "",
          bookName: "",
          syncTimeStart: '',
          syncTimeEnd: '',
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
        bookTotal: 20,
        api_pmph_list: '/pmpheep/materialType/tree',
        api_pmph_add: '/pmpheep/materialType/addbelow',
        api_pmph_delete: '/pmpheep/materialType/delete',
        treeData: [],
        defaultProps: {
          children: "childrenMaterialTypeVO",
          label: "typeName",
          isLeaf: 'isLeaf'
        },
        default_expanded_keys: [0],//默认展开层
        hasSelected: false,
        dialogVisible: false,
        currentClickedParentId: "",
        dialogForm: {
          typeName: "",
          sort: "",
          note: "",
          parentId: "",
          path: "",
          isLeaf: ""
        },

        confirmForm: {
          bookId: '',
          nodeId: '',
          synchronizationType: "",
          sessionId: this.$getUserData().sessionId,
        }
      }

    },
    created() {
      this.getList(1);
    },
    methods: {

      continueSync() {
        if (this.progresspoint == 100) {
          return;
        }
        this.$axios.get('/pmpheep/aiptest/getSpeed')
          .then(response => {
            let res = response.data;
            if (res.code == 1) {
                this.progresspoint = res.data;
                if(this.progresspoint!=100){
                  setTimeout(function(){
                    this.continueSync()
                  },2000);
                }
            }
          });
      },


      syncBook() {
        this.bookSyncVisible = true;
        this.continueSync(this.progresspoint);
        this.$axios.get('/pmpheep/aiptest/syncFullBooks').then(response => {
          let res = response.data;
          if (res.code == 1) {


          }
          if(res.code==2){
            this.bookSyncVisible = false;
            this.$message.error(res.msg);
          }

        }).catch(error => {
          /*   this.$confirm('同步错误，请稍后再试!', "提示",{
                 confirmButtonText: "确定",
                 cancelButtonText: "取消",
                 showCancelButton: false,
                 type: "error"
             });*/
        })
      },


      batchConfirm(){

        let _this = this;
        var params=this.multipleSelection;
        if(params.length==0){
          _this.$message.error("未勾选任何数据");
          return;
        }
        var ids=[];
        params.forEach(item => {
          ids.push(item.id);
        })
        this.$axios.get(this.batchConfirmUrl,{params:this.$initPostData({
            ids:ids.join(',')
          })})
          .then(response => {
            let res = response.data;
            console.log(res);
            if (res.code == 1) {
              _this.$message.success("批量导入成功");
              this.getList(1);

            }
          })
          .catch(error => {
            console.log(error);
          });

      },
      batchDel(){
        let _this = this;
        var params=this.multipleSelection;
        if(params.length==0){
          _this.$message.error("未勾选任何数据");
          return;
        }
        var ids=[];
        params.forEach(item => {
          ids.push(item.id);
        })

        this.$axios.get(this.batchdelUrl,{params:this.$initPostData({
          ids:ids.join(',')
        })})
          .then(response => {
            let res = response.data;
            console.log(res);
            if (res.code == 1) {
              _this.$message.success("批量删除成功");
              this.getList(1);

            }
          })
          .catch(error => {
            console.log(error);
          });

      },
      closedialg(){
        this.syncDetailDialog=false;
      },
      showDetail(row){
        this.detail.id=row.id;
        this.detail.type=row.synchronizationType;
        this.syncDetailDialog=true;
        var params={id:row.id,type:row.synchronizationType}

        this.$axios.get(this.detailUrl, {params: params})
          .then(response => {
            let res = response.data;
            console.log(res);
            if (res.code == 1) {
            this.detailData = res.data

            }
          })
          .catch(error => {
            console.log(error);
          });




      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
        console.log(this.multipleSelection);
      },
      getMaterialTypeTree(row) {


        this._getTree("-1");
        if(row==null){
          this.confirmForm.bookId = this.detail.id;
          this.confirmForm.synchronizationType = this.detail.type;
        }else{
          this.confirmForm.bookId = row.id;
          this.confirmForm.synchronizationType = row.synchronizationType;
          console.log(2)
        }
        if(this.confirmForm.synchronizationType=='add'){
          this.materialTypeTreeDialog = true

        }else{
          this.confirmSubmit();
        }


      },
      confirmSubmit() {
        this.$axios.get(this.confirmUrl, {params: this.confirmForm})
          .then(response => {
            console.log(response.data)

            let res = response.data;
            console.log(response.data.code)
            if(res.code==1){

              this.materialTypeTreeDialog = false
              this.getList(1)
              this.closedialg();
              this.$message.success("导入成功");
            }else{

              this.$message.error(response.data.msg);
            }
          })
          .catch(error => {
            console.log(error);
          });

      },


      /**
       * 请求组织树
       */
      _getTree(id = '-1', callback) {
        let _this = this;
        this.$axios.get(this.api_pmph_list, {
          params: {
            parentId: id
          }
        })
          .then(response => {
            let res = response.data;
            if (res.code == 1) {
              if (callback) {
                callback(res.data);
              }
              if (id != '-1') {
                return;
              }
              /*if(id!=0){*/

              _this.treeData = [res.data];

              if (_this.treeData.length > 0) {
                _this.default_expanded_keys.push(_this.treeData[0].id);
              }
              //}

            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      /**
       * 点击节点
       */
      _handleNodeClick(data, node) {
        this.hasSelected = true;
        this.dialogForm.path = data.path;
        this.dialogForm.parentId = data.id;
        this.dialogForm.isLeaf = data.isLeaf;
        this.currentClickedParentId = data.parentId;
        this.$emit('node-click', data)
        this.confirmForm.nodeId = data.id;

      },
      /**
       * 展开式加载子节点
       */
      _loadNode(node, resolve) {
        this._getTree(node.key, (data) => {

          resolve(data.childrenMaterialTypeVO);

        })
      },

      _openAddDialog() {
        this.dialogVisible = true;
        this.$nextTick(() => {
          this.$refs.dialogForm.resetFields();
        })
      },

      /**
       *  提供一个刷新树状图方法
       *
       */
      refresh() {
        this._getTree("-1");
      },

      tabChange(tab) {
        if (tab.name == 'first') {
          this.getList(1)
        }
        if(tab.name == 'second'){
          this.getList(2)
        }
      },
      delectBookSyncConfirm(id){
        if(id==null){
          id=this.detail.id;
        }

        this.$axios.get(this.delectUrl, {
          params: {id:id}
        })
          .then((res) => {
            console.log(res);
            if (res.data.code == 1) {
              this.getList(1);
              this.closedialg();
              this.$message.success("删除成功");
            }
          })
      },
      revokeBookSyncComfirm(row){

        var param={
          synchronizationType:row.synchronizationType,
          id:row.id
        };

        this.$axios.get(this.revokeUrl, {
          params: param
        })
          .then((res) => {
            console.log(res);
            if (res.data.code == 1) {
              this.getList(2);
            }
          })
      },


      /* 获取视频列表 */
      getList(teb) {
        if (teb == 1) {
          this.searchParams.confirm = false;
        } else if (teb == 2) {
          this.searchParams.confirm = true;
        }

        this.$axios.get(this.bookSyncListUrl, {
          params: this.searchParams
        })
          .then((res) => {
            console.log(res);
            if (res.data.code == 1) {
              this.tableData = res.data.data.rows;
              this.pageTotal = res.data.data.total;

            }
          })
      },
      /* 搜索按钮 */
      search(tab) {
        this.searchParams.pageNumber = 1;
        this.getList(tab);
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
      /* 选择书籍 */
      selectBook() {
        this.$axios.get(this.dialogBookUrl, {
          params: this.bookParams
        }).then((res) => {
          if (res.data.code == 1) {
            this.bookListData = res.data.data.rows;
            this.bookTotal = res.data.data.total;
            this.bookDialogVisible = true;
          }
        })
      }


    },
  }
</script>
<style>
  .mic_video .header_p {
    overflow: hidden;
    margin-bottom: 5px;
  }

  .mic_video .header_p .input {
    width: 188px;
    margin-right: 10px;
  }

  .mic_video .book_dialog .el-dialog {
    min-width: 660px;
    position: relative;
  }

  .mic_video .book_dialog .el-dialog .el-dialog__body {
    overflow: hidden;
  }

  .mic_video .video_player_dialog .el-dialog__body {
    padding: 0;
    background: none;
  }

  .mic_video .video_player_dialog .el-dialog__header {
    padding: 0;
  }

  .mic_video .video_player_dialog .el-dialog__header .el-dialog__headerbtn {
    margin: 3px;
  }

  .mic_video .video_player_dialog video {
    width: 100%;
    vertical-align: bottom;
    min-height: 300px;
  }
  .center_box {
    float: left;
    margin-left: 50%;
    transform: translateX(-50%);
  }

  .shade{
    position: absolute;
    z-index:10000;
    background: rgba(0,0,0,.5);
    width: 100%;
    height:100%;
    top:0;
    left:0;
  }
</style>
