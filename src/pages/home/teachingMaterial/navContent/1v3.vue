<template>
  <div class="teachingMaterial bookSelect">
    <div class="teachingMaterial-search clearfix">
      <!--书名选择框-->
      <div class="searchBox-wrapper lg">
        <div class="searchName">书名：<span></span></div>
        <div class="searchInput">
          <!-- <el-select v-model="booksChooseValue5" multiple filterable loading-text="正在搜索..."
            remote
            :remote-method="getBooks" :loading="loading" placeholder="全部">
            <el-option
              v-for="item in booksChooseOptions"
              :key="item.textBookId"
              :label="item.textbookName"
              :value="item.textBookId">
            </el-option>
          </el-select> -->
          <!-- <el-input placeholder="请输入" v-model="searchForm.bookName" @keyup.enter.native="search"></el-input> -->
          <el-autocomplete
            class="inline-input input"
            :props="defaultProp"
            v-model="searchForm.bookName"
            :fetch-suggestions="querySearch"
            placeholder="请输入"
            :trigger-on-focus="false"
            @select="handleSelect"
          ></el-autocomplete>
        </div>
      </div>
      <!--进度搜索-->
      <div class="searchBox-wrapper">
        <div class="searchName">进度：<span></span></div>
        <div class="searchInput">
          <el-select v-model="searchForm.state" placeholder="全部" @change="search">
            <el-option
              v-for="item in currentStateList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <!--姓名搜索-->
      <div class="searchBox-wrapper searchBtn">
        <el-button  type="primary" icon="search" @click="search">搜索</el-button>
      </div>
      <!--操作按钮-->
      <div class="operation-wrapper">


        <span v-if=""
              :class="isGetTableDataDone?(allPageSelected?'el-checkbox__input is-checked':'el-checkbox__input'):'selecting_all'"
              id="select_all_checkbox_wrapper"
              :title="allPageSelected?'取消全选':'全分页选中'"
        >
          <span class="el-checkbox__inner"></span>
          <input type="checkbox" id="select_all_checkbox" @click="allPageSelectSwitch(true)" :disabled="!isGetTableDataDone"/>
          <span class="select_all_text">{{isGetTableDataDone?(allPageSelected?'取消全选':'分页全选'):'正在读取'}}</span>
        </span>


        <!--<el-button type="primary" circle  @click="allPageSelectSwitch(true)" id="select_all_btn" :disabled="!isGetTableDataDone" :title="allPageSelected?'取消全选':'全分页选中'" ><i :class="allPageSelected?'el-icon-check':'css-not-pageSelected'"></i></el-button>-->
        <!--<input type="checkbox" @click="allPageSelectSwitch(true)" id="select_all_checkbox" :disabled="!isGetTableDataDone" :title="allPageSelected?'取消全选':'全分页选中'" >-->
        <el-button :type="forceEnd?'primary':'danger'" :disabled="allTextbookPublished || !hasPower(7,tableData)" @click="isForceEnd">{{forceEnd?'恢复':'强制结束'}}</el-button>
        <!-- :disabled="selected.length===0"--> <el-button type="primary"  @click="exportEditor">主编/副主编批量导出</el-button>
        <!--|| isSelected-->  <el-button type="primary" v-if="materialInfo.role==2||materialInfo.role==1" :disabled="forceEnd || allTextbookPublished" @click="pushAllChecked(1)">批量发布主编/副主编</el-button>
        <!--|| !hasPower(2,selected)--> <el-button type="primary" v-else :disabled="isPublished || forceEnd || !hasPower(2,selectedPowerSet)" @click="pushAllChecked(2)">批量发布主编/副主编</el-button>
        <!-- || !hasPower(4,selected)--> <el-button type="primary" :disabled="init_isLocked  || forceEnd" @click="showDialog(1)">批量名单确认</el-button>
        <!--!hasPower(5,selected) ||--> <el-button type="primary" :disabled="  forceEnd" @click="showDialog(0,null,isLocked)">批量结果公布</el-button>
        <!--:disabled="isSelected"-->  <el-button type="primary"  @click="exportExcel()">批量导出名单</el-button>
      </div>
    </div>
    <!--表格-->
    <div class="table-wrapper">
      <el-table
        ref="multipleTable"
        border
        @select-all = "handleSelectAll"
        @selection-change="handleSelectionChange"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55"  >

        </el-table-column>
        <el-table-column
          prop="sort"
          label="书序"
          width="68">
        </el-table-column>
        <el-table-column
          prop="textbookRound"
          label="版次"
          width="68">
        </el-table-column>
        <el-table-column
          label="书名">
          <template scope="scope">
            {{scope.row.textbookName}}
          </template>
        </el-table-column>
        <el-table-column
          prop="applyNum"
          label="申报数"
          width="80">
        </el-table-column>
        <!--主任 start-->
        <el-table-column
          label="策划编辑"
          width="106">
          <template scope="scope">
            <p>
              <span v-if="!scope.row.planningEditorName">待分配</span>
              <span v-else>
                {{scope.row.planningEditorName}}
              </span>
              <el-button type="text" v-if="!(!hasAccess(1,scope.row.myPower) || forceEnd || scope.row.allTextbookPublished ||
                (scope.row.isLocked&&materialInfo.role!==2&&materialInfo.role!==1))" @click="showEditor(scope.row)">
                <i class="fa fa-pencil fa-fw"></i>
              </el-button>
            </p>
          </template>
        </el-table-column>
        <el-table-column
          label="遴选主编/副主编" min-width="170">
          <template scope="scope">
            <div style="display: inline-block;">
              <span v-if="scope.row.editorsAndAssociateEditors" v-html="scope.row.editorsAndAssociateEditors"></span>
              <span v-else>待遴选</span>
            </div>
            <router-link :to="{name:'遴选',query:{bookid:scope.row.textBookId,bookname:scope.row.textbookName,type:'zb',
              q:scope.row.myPower,opt:(((scope.row.isLocked&&materialInfo.role!==2&&materialInfo.role!==1)||scope.row.allTextbookPublished||forceEnd)?'view':'edit'),isChiefPublished:scope.row.isChiefPublished}}">
              <el-button type="text">
                <i v-if="(forceEnd||(scope.row.isLocked&&materialInfo.role!==2&&materialInfo.role!==1)||!hasAccess(2,scope.row.myPower)||scope.row.allTextbookPublished)" class="fa fa-eye fa-fw"></i>
                <i v-else class="fa fa-pencil fa-fw"></i>
              </el-button>
            </router-link>
          </template>
        </el-table-column>

        <el-table-column
          label="遴选编委" min-width="170">
          <template scope="scope">
            <span v-if="scope.row.bianWeis" v-html="scope.row.bianWeis"></span>
            <span v-else>待遴选</span>
            <router-link :to="{name:'遴选',query:{bookid:scope.row.textBookId,type:'bw',bookname:scope.row.textbookName,q:scope.row.myPower,
            opt:(((scope.row.isLocked&&materialInfo.role!==2&&materialInfo.role!==1)||scope.row.allTextbookPublished||forceEnd)?'view':'edit'),isChiefPublished:scope.row.isChiefPublished}}">
              <el-button type="text">
                <i v-if="(forceEnd||(scope.row.isLocked&&materialInfo.role!==2&&materialInfo.role!==1)||!hasAccess(3,scope.row.myPower)||scope.row.allTextbookPublished)" class="fa fa-eye fa-fw"></i>
                <i v-else class="fa fa-pencil fa-fw"></i>
              </el-button>
            </router-link>
          </template>
        </el-table-column>
        <!--主任 end-->

        <el-table-column
          label="操作" min-width="190">
          <template scope="scope">
            <!-- <el-button type="text" :disabled="true" v-if="scope.row.state==0||scope.row.state==2||scope.row.state>4">名单确认</el-button> -->
            <el-button type="text" :disabled=" forceEnd || !hasAccess(4,scope.row.myPower) || scope.row.allTextbookPublished || scope.row.isPublished ||
             scope.row.isLocked"  @click="showDialog(1,scope.row)">{{scope.row.isLocked?'名单已确认':'名单确认'}}</el-button>
            <span class="vertical-line"></span>
            <el-button type="text" @click="showDialog(0,scope.row,scope.row.isLocked)" :disabled=" forceEnd || (scope.row.isPublished && !scope.row.repub) ||
             !hasAccess(5,scope.row.myPower) || scope.row.allTextbookPublished">
              {{(scope.row.isPublished && !scope.row.repub)?'已公布':(scope.row.isPublished && scope.row.repub)?'再次公布':'最终结果公布'}}</el-button>
            <!-- <el-button type="text" :disabled="forceEnd" v-else  v-if="(scope.row.state!=0&&scope.row.state!=2)&&scope.row.state<5">最终结果公布</el-button> -->
            <span class="vertical-line"></span>
            <el-button type="text" @click="exportExcel(scope.row.textBookId)">导出名单</el-button>
            <span class="vertical-line"></span>
            <el-button type="text" :disabled="!hasAccess(6,scope.row.myPower) || forceEnd" @click="showGroup(scope.row.textBookId,scope.row.groupId)">
              {{scope.row.groupId==null?'创建小组':'更新小组成员'}}</el-button>
            <!-- <el-button type="text" :disabled="forceEnd" >创建小组</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-wrapper">
      <el-pagination
        v-if="totalNum"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10,20,30,40]"
        :page-size="searchForm.pageSize"
        :current-page="searchForm.pageNumber"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum">
      </el-pagination>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      size="tiny">
      <p v-html="dialogContent"></p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="makeSure" :loading="isClickPublish">{{isClickPublish?'加载中':'确 定'}}</el-button>
          <el-button @click="dialogVisible = false">取 消</el-button>

        </span>
    </el-dialog>

    <el-dialog title="分配策划编辑" :visible.sync="chooseVisiable2" @close="cleartable" size="large" top="5%">
      <!-- <Departments ref="department" @add="add" :tableData="proptableData,Multichoice"></Departments>
       -->
       <user-pmph @selection-change="selectChange" ref="userPmph" select radio>
         <div class="operation-wrapper">
           <el-button type="primary" @click="updateEditor">确认</el-button>
         </div>
       </user-pmph>
    </el-dialog>

    <!-- 小组名单确认 -->
    <el-dialog title="确认小组名单" :visible.sync="groupVisiable" top="5%">
      <el-table
        :data="groupData"
        stripe
        style="width: 100%">
        <el-table-column
          prop="realname"
          label="姓名"
          width="100">
        </el-table-column>
        <el-table-column
          prop="orgName"
          label="工作单位">
        </el-table-column>
        <!-- <el-table-column
          prop="presetPosition"
          label="申报职位">
          <template scope="scope">
            <p></p>
          </template>
        </el-table-column> -->
        <el-table-column
          label="遴选职位">
          <template scope="scope">
            <p>
              {{positionList[scope.row.chosenPosition]}}
              </p>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="presetPosition"
          label="是否数字编委">
          <template scope="scope">
            <p>{{scope.row.isDigitalEditor?'是':'否'}}</p>
          </template>
        </el-table-column> -->
        <el-table-column
          prop=""
          width="80"
          align="center"
          label="操作">
          <template scope="scope">
            <el-button type="text"  class="delete"  @click="deleteMember(scope.$index,groupData)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pull-right marginT10 marginB10">

        <el-button type="primary" @click="submitGroup">确定</el-button>
        <el-button @click="groupVisiable=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
  // import Departments from 'components/departments'
  import userPmph from 'components/user-pmph'
  import bus from 'common/eventBus/bus.js'
  export default{
    props:['materialInfo'],
    data(){
      return{
        api_position_list:'/pmpheep/position/list',
        api_pushAll_check:'/pmpheep/declaration/batchPublishEditor',    //批量发布主编副主编url
        api_position_list_ids:'/pmpheep/position/listAllIdList',
        searchForm:{
          pageNumber:1,
          pageSize:10,
          materialId:'',
          state:'',
          textBookIds: '',
          bookName:''
        },
        selectAll:false,
        dataChange:false,
        tableData: [],
        forceEnd:false, // 是否强制结束
        isClickPublish:false,
        booksChooseValue5:'',
        booksChooseOptions: [],
        currentStateList:[{
          value:0,
          label:'全部'
        },{
          value:1,
          label:'名单未确认'
        },{
          value:2,
          label:'名单已确认'
        },{
          value:3,
          label:'结果已公布'
        }],
        dialogVisible:false,
        chooseVisiable2:false,
        groupVisiable: false, // 小组名单
        Multichoice:'', // 是否可以多选，传递给Departments子组件
        dialogContent:'',
        totalNum: 0,
        selectedIds:'', // 所有页选择项的ids
        selectedIdsSet:new Set(),//所有页选择项的ids的集合
        selectedPowerSet:new Set(),// 由selectedPowersMap转换为set对象 元素形如{textBookId: 557, myPower: "11111111", isLocked: false, isPublished: false}
        selectedPowersMap:new Map(),//从后台查询得的所选项需校验的属性集合 key为书籍id value形如{myPower: "11111111", isLocked: false, isPublished: false}
        allPageSelected:false, //是否全页选中
        materialId:'', // 教材id
        selected:[], // 当前页选中项
        method:'',
        currentId: '', // 当前id
        planningEditor: '',
        selectedBookId:'',
        groupData: [], // 小组名单
//        myPower:'', // 权限码
        defaultProp:{
          value: 'textbookName',
          label: 'textbookName'
        },
        bookNames:[],
        isGetTableDataDone:false,
        allTextbookPublished: false, // 是否所有书籍都公布
        positionList:['','编委','副主编','副主编，编委','主编','主编，编委','主编，副主编','主编，副主编，编委','数字编委','编委，数字编委','副主编，数字编委','副主编，编委，数字编委','主编，数字编委','主编，编委，数字编委','主编，副主编，数字编委','主编，副主编，编委，数字编委'],
      }
    },
    computed:{
      /**
       * 判断当前是否有选中项来是否可以点击
       * @returns {boolean}
       */
       isSelected() {
        if (this.selectedIds.length > 0) {
          return false;
        } else {
          return true;
        }
      },
      isPublished() {
        let arr = [];
        if (this.selected.length > 0){
          this.selected.forEach(item => {
            arr.push(item.isPublished);
          });
          return arr.some(x=>{
            return x == true;
          })
        } else {
          //console.log(3);
          return true;
        }
      },
      isLocked() {
        let arr = [];
        if (this.selected.length > 0){
          this.selected.forEach(item => {
            //console.log(item.isLocked);
            arr.push(item.isLocked);
          });
          return arr.some(x=>{
            return x == true;
          })
        } else {
          //console.log(3);
          return true;
        }
      },
      init_isLocked() {
        let arr = [];
        this.selected
        if (this.selectedPowerSet){
          this.selectedPowerSet.forEach(item => {
            console.log(item.isLocked);

            arr.push(item.isLocked);
          });
          return arr.some(x=>{
            return x == true;
          })
        } else {
          //console.log(3);
          return false;
        }
      }
    },

    mounted(){

    },

    methods:{
      /**
       * 显示出取人弹出框，
       * @param type 0代表通过按钮，1代表点击结果公布按钮
       * @param data 数据，当为空时代表批量导出或公布
       */
      showDialog(type,data,isLocked){
        if(type == 1 && !this.hasPower(4,this.selectedPowerSet)&&this.$commonFun.Empty(data)){ //
          this.$confirm(this.selectedIds.length>0?'您选择的复选框中包含已确认的名单':'您未选择任何名单', "提示",{
          	confirmButtonText: "确定",
          	cancelButtonText: "取消",
          	showCancelButton: false,
          	type: "error"
          });
          return ;
        }
        if(type == 0 && !this.hasPower(5,this.selectedPowerSet)&&this.$commonFun.Empty(data)){ //
          this.$confirm(this.selectedIds.length>0?'您选择的复选框中包含已公布名单':'您未选择任何名单', "提示",{
          	confirmButtonText: "确定",
          	cancelButtonText: "取消",
          	showCancelButton: false,
          	type: "error"
          });
          return ;
        }
        var html = '';
        if(data) {
          this.currentId = data.textBookId
        }
        if(type==1){
          this.method = 'pass'
          html = `您要通过${data?'《'+data.textbookName+'》':'所有选中'}的名单吗？<br/>名单确认后，只有当前教材指定的主任可以修改`
        }else{
          if (isLocked) {
            this.method = 'result'
            html = `您要公布${data?'《'+data.textbookName+'》':'所有选中'}的遴选结果吗？<br/>结果公布后，只有当前教材指定的主任可以修改名单并再次公布`
          } else {
            this.$confirm('还未进行名单确认，不能公布！', "提示",{
            	confirmButtonText: "确定",
            	cancelButtonText: "取消",
            	showCancelButton: false,
            	type: "error"
            });
            return;
          }
        }
        this.dialogContent = html;

        this.dialogVisible=!this.dialogVisible;
      },
      add(){
        this.chooseVisiable2=false;
      },
      /**获取书籍名称 */
      getBookName(){
         this.$axios.get('/pmpheep/position/getTextbookName',{params:{
           materialId:this.searchForm.materialId
         }}).then(response=>{
            var res = response.data;
            if(res.code==1){
              this.bookNames = res.data;
            } else if (res.code == 2) {
              this.$confirm(res.msg.msgTrim(), "提示",{
              	confirmButtonText: "确定",
              	cancelButtonText: "取消",
              	showCancelButton: false,
              	type: "error"
              })
            }
          })
          .catch(e=>{
            console.log(e);
          })
      },
      /**
       * 获取表格数据
       */
      getTableData(isPageRefresh){
        this.isGetTableDataDone = false;
        // console.log(this.searchForm)
        let _this = this;
        this.$axios.get(this.api_position_list,{params:this.searchForm})
          .then(response=>{
            var res = response.data;
            if(res.code==1){
              this.totalNum = res.data.total;
              res.data.rows.map(iterm=>{
                iterm.actualDeadline = this.$commonFun.formatDate(iterm.actualDeadline).split(' ')[0];
                iterm.deadline = this.$commonFun.formatDate(iterm.deadline).split(' ')[0];
              });
              this.tableData = res.data.rows;

              if(this.tableData.length){
                //_this.$refs.multipleTable.toggleRowSelection(_this.tableData[0],true);
                this.forceEnd = this.tableData[0].forceEnd;
                this.allTextbookPublished = this.tableData[0].allTextbookPublished;
                //console.log(this.allTextbookPublished);
                this.myPower = this.tableData[0].myPower;

                //回填翻页前的选中
                _this.$nextTick(function() {
                  _this.tableData.forEach(item=>{
                    if(_this.selectedIdsSet.has(item.textBookId)){
                      _this.$refs.multipleTable.toggleRowSelection(item,true);
                    }
                  })
                  this.isGetTableDataDone = true;
                  if(!isPageRefresh){
                    _this.allPageSelectSwitch(false);
                  }

                })


              }
            } else if (res.code == 2) {
              this.$confirm(res.msg.msgTrim(), "提示",{
              	confirmButtonText: "确定",
              	cancelButtonText: "取消",
              	showCancelButton: false,
              	type: "error"
              })
            }
          })
          .catch(e=>{
            console.log(e);
          })
      },
      allPageSelectSwitch(is_switch){ //全页选中的ids刷新 is_switch为true时同时切换全选状态
        let _this = this;
        if(is_switch){
          _this.allPageSelected = !_this.allPageSelected;
        }
        this.isGetTableDataDone =false;

        if(_this.allPageSelected){
          this.$axios.get(this.api_position_list_ids,{params:this.searchForm})
            .then(response=>{
              var res = response.data;

              if(res.code==1){
                _this.selectedIdsSet.clear();
                res.data.forEach(id =>{
                  _this.selectedIdsSet.add(id.textBookId)
                  _this.selectedPowersMap.set(id.textBookId,{'myPower':id.myPower,'isLocked':id.isLocked,'isPublished':id.isPublished})
                })
                afSetFun()
              }
              else if (res.code == 2) {
                this.$confirm(res.msg.msgTrim(), "提示",{
                	confirmButtonText: "确定",
                	cancelButtonText: "取消",
                	showCancelButton: false,
                	type: "error"
                })
              }
            })
        }else{
          _this.selectedIdsSet.clear();
          _this.selectedPowersMap.clear();
          afSetFun()
        }
        // 等待axios请求返回并更新完selectedIdsSet后执行的内部方法
        function afSetFun(){

          _this.selectedIds = Array.from(_this.selectedIdsSet).toString();
          _this.$refs.multipleTable.clearSelection();
          _this.tableData.forEach(item => {
            if (_this.selectedIdsSet.has(item.textBookId)) {
              _this.$refs.multipleTable.toggleRowSelection(item, true);
            }
          })

          _this.isGetTableDataDone =true;

          _this.selectedPowerSet.clear();
          _this.selectedPowersMap.forEach(function (value, key, map) {
            _this.selectedPowerSet.add({'textBookId':key,'myPower':value.myPower,'isLocked':value.isLocked,'isPublished':value.isPublished})
          });

        }




      },
      /**远程搜索 */
      querySearch(queryString,cb){
        var restaurants = this.bookNames;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.textbookName.indexOf(queryString.toLowerCase()) === 0);
        };
      },
      /**选中远程搜索项，则触发搜索 */
      handleSelect(item) {
       this.getTableData();
      },
      /**
       * 搜索
       */
      search(){
        this.searchForm.pageSize = 30;
        this.searchForm.pageNumber = 1;
        this.getTableData();
      },
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.searchForm.pageSize = val;
        //console.log(this.searchForm.pageSize);
        this.getTableData(true);
        // this.$nextTick(() => {
        //   this.toggleSelection(this.tableData)
        // })


      },
      handleCurrentChange(val) {
        // console.log(`当前页: ${val}`);
        this.searchForm.pageNumber = val
        this.getTableData(true);

        // this.$nextTick(() => {
        //   this.toggleSelection(this.tableData)
        // })


      },

      /**强制结束 */
      isForceEnd(){
        var title = ''
        if (!this.forceEnd) {
          title =  '确定结束本教材的遴选？'
        } else {
          title = '确定恢复本教材的遴选'
        }
        this.$confirm(title,"提示",{
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.forceEnd=!this.forceEnd
          this.$axios.put('/pmpheep/position/updateMaterial',this.$initPostData({
            id: this.searchForm.materialId,
            isForceEnd: this.forceEnd
          })).then(response => {
            let res = response.data
            if(res.code == 1){
              if(this.forceEnd) {
                this.$message.success('已强制结束')
              } else {
                this.$message.success('已恢复')
              }
              this.getTableData()
              bus.$emit('material:update-info');
            }
          })
        })

      },
      // checkboxInit(row,index){
      //   if(index ==0){
      //
      //   }else{
      //
      //   }
      // },
      handleSelectAll(val){
        if(val.length>0){
          this.selectAll = true;
        }

      },
      handleSelectionChange(val){
        var _this = this;
        this.selected = val

        this.selectedIdsSet;

        if(this.isGetTableDataDone) { //若为页面重新加载数据 如翻页 则不删除所进入页面的数据id 若不是 则是手动操作的 就删除当前页数据 按照val重置当前选中
          _this.tableData.forEach(t => {
            _this.selectedIdsSet.delete(t.textBookId);
            _this.selectedPowersMap.delete(t.textBookId)
          })
          /*if(_this.selected.length<_this.tableData.length){
            _this.allPageSelected = false;
          }*/


          //console.log(_this.selectedIdsSet)
          //console.log(val)
        }
        val.forEach(item => {

          _this.selectedIdsSet.add(item.textBookId);
          _this.selectedPowersMap.set(item.textBookId,{'myPower':item.myPower,'isLocked':item.isLocked,'isPublished':item.isPublished})
        })

        this.selectedIds = Array.from(this.selectedIdsSet).toString();
        _this.selectedPowerSet.clear();
        _this.selectedPowersMap.forEach(function (value, key, map) {
          _this.selectedPowerSet.add({'textBookId':key,'myPower':value.myPower,'isLocked':value.isLocked,'isPublished':value.isPublished})
        });
        console.log(_this.selectedPowersMap)
        console.log(_this.selectedPowerSet)

      },
      /* 批量发布主编副主编*/
      pushAllChecked(type){
        if(type == 1 && this.isSelected){
          this.$confirm("您未选择任何名单", "提示",{
          	confirmButtonText: "确定",
          	cancelButtonText: "取消",
          	showCancelButton: false,
          	type: "error"
          });
          return false;
        }
        if(type == 2 && !this.hasPower(2,this.selectedPowerSet)){

          this.$confirm(this.selectedIds.length>0?"您选择的复选框中包含已发布的主编/副主编":"您未选择任何名单", "提示",{
          	confirmButtonText: "确定",
          	cancelButtonText: "取消",
          	showCancelButton: false,
          	type: "error"
          });
          return false;
        }

        this.$confirm('确定批量发布主编/副主编?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
            this.$axios.put(this.api_pushAll_check,this.$commonFun.initPostData({
              textbookIds:this.selectedIds
            }))
            .then((res)=>{
              //console.log(res);
              if(res.data.code==1){
                      this.$message.success('发布成功');
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
            message: '已取消操作'
          });*/
        });
      },
      /**
       * 批量通过
       */
      pass(ids){
        this.putApi('/pmpheep/position/updateTextbook',ids)
      },
      showEditor(data){
        this.chooseVisiable2 = true
        this.selectedBookId = data.textBookId
      },
      /**
       * 分配策划编辑
       */
      updateEditor(){
        this.$axios.put('/pmpheep/textBook/updateEditor',this.$initPostData({
          id: this.selectedBookId,
          planningEditor: this.planningEditor
        })).then(response => {
          let res = response.data
          if (res.code == 1) {
            this.$message.success('操作成功')
            this.chooseVisiable2 = false
            this.getTableData()
          }
        }).catch(err => {
          this.$confirm('操作失败，请稍后再试', "提示",{
          	confirmButtonText: "确定",
          	cancelButtonText: "取消",
          	showCancelButton: false,
          	type: "error"
        })
        })
      },
      /**
       * 最终结果公布
      */
      result(ids){
        this.putApi('/pmpheep/position/updateResult',ids)
      },
      /**
       * 弹窗确认触发的方法判断
       */
      makeSure(){
        this.isClickPublish=true;
        if (this.method == 'pass') {
          this.pass(this.currentId)
        } else if(this.method == 'result') {
          this.result(this.currentId)
        }
      },
      putApi(url,ids){
        this.$axios.put(url,this.$initPostData({
          ids: ids || this.selectedIds,
          materialId: this.materialId
        })).then(response => {
          let res = response.data
          if(res.code == 1){
            this.dialogVisible = false
            this.$message.success('操作成功')
            this.getTableData()
            //更新教材信息
            bus.$emit('material:update-info');
          } else{
            this.$confirm(res.msg.msgTrim(), "提示",{
            	confirmButtonText: "确定",
            	cancelButtonText: "取消",
            	showCancelButton: false,
            	type: "error"
            })
          }
          this.isClickPublish=false;
        }).catch(err => {
          this.$confirm('操作失败，请稍后再试', "提示",{
          	confirmButtonText: "确定",
          	cancelButtonText: "取消",
          	showCancelButton: false,
          	type: "error"
        })
        })
      },
      /**@augments index
       * 权限判断
       */
      hasAccess(index,list){
        return this.$commonFun.materialPower(index,list);
      },
      hasPower(index,data){
        var arr = [];
        var list = '';
        if (data.length || data.size){
          data.forEach(item => {
            arr.push(item.myPower);
          });
          arr.forEach(item => {
            if (item[index] == 1) {
              list = item;
            }
          });
          if (list == '') {
            return false;
          } else {
            return this.$commonFun.materialPower(index,list);
          }
        } else {
          return false;
        }
      },
      /* 选中社内用户*/
      selectChange(val){
        //console.log(val)
        if (val[0]) {
          this.planningEditor = val[0].id
        }
        //console.log(this.planningEditor)
      },
      /** 清空 选中项 */
      cleartable(){
        this.$refs.userPmph.clear()
      },
      /**显示小组名单 */
      showGroup(id,type){
        this.currentId = id
        if(!type){
          this.groupVisiable = true
          this.$axios.get('/pmpheep/position/editorList',{
            params:{
              textbookId: id,
              pageSize: 20,
              pageNumber: 1
            }
          }).then(response => {
            let res = response.data
            if (res.code == 1) {
              this.groupData = res.data.rows
            }
          }).catch(err => {
            this.$confirm('操作失败，请稍后再试', "提示",{
            	confirmButtonText: "确定",
            	cancelButtonText: "取消",
            	showCancelButton: false,
            	type: "error"
          })
          })
        } else {
          this.addEditor();
        }
        // console.log(id)

      },
      /**提交小组名单 */
      submitGroup(){
        if(this.groupData.length==0){
          this.$confirm('小组名单不能为空', "提示",{
          	confirmButtonText: "确定",
          	cancelButtonText: "取消",
          	showCancelButton: false,
          	type: "error"
          });
          return ;
        }
        this.groupData.forEach(item => {
          item.isWriter = true
        })
        this.$axios.post('/pmpheep/group/addEditorGroup',this.$initPostData({
          textbookId: this.currentId,
          pmphGroupMembers: JSON.stringify(this.groupData),
          sessionId: this.$getUserData().sessionId
        })).then(response => {
          let res = response.data
          if (res.code == 1) {
            this.groupVisiable = false
            this.$router.push({name: '小组管理'})
          }
        }).catch(err => {
          this.$confirm('操作失败，请稍后再试', "提示",{
          	confirmButtonText: "确定",
          	cancelButtonText: "取消",
          	showCancelButton: false,
          	type: "error"
        })
        })
      },
      /**更新小组 */
      addEditor(){
        this.$axios.post('/pmpheep/group/addEditors',this.$initPostData({
          textbookId: this.currentId,
          // pmphGroupMembers: JSON.stringify(this.groupData),
          sessionId: this.$getUserData().sessionId
        })).then(response => {
          let res = response.data;
          if (res.code == 1) {
            this.$message.success('更新成功！');
          }else {
            this.$confirm(res.msg.msgTrim(), "提示",{
            	confirmButtonText: "确定",
            	cancelButtonText: "取消",
            	showCancelButton: false,
            	type: "error"
            });
          }
        })
      },
      /** 导出Excel */
      exportExcel(id){
        // console.log(id,this.selectedIds)
        if(this.isSelected&&this.$commonFun.Empty(id)){
          this.$confirm('您未选择任何名单', "提示",{
          	confirmButtonText: "确定",
          	cancelButtonText: "取消",
          	showCancelButton: false,
          	type: "error"
          });
          return;
        }
        let url = '/pmpheep/chosenPosition/exportExcel/?textbookIds='+ (id || this.selectedIds);
        // console.log(url)
        this.$commonFun.downloadFile(url);
      },
      /**批量导出主编 */
      exportEditor(){
        if(this.selectedIds.length===0){
          this.$confirm("您未选择任何名单", "提示",{
          	confirmButtonText: "确定",
          	cancelButtonText: "取消",
          	showCancelButton: false,
          	type: "error"
          });
          return false;
        }
        let url = '/pmpheep/position/exportEditors/?textbookIds=' + this.selectedIds;
        // console.log(url)
        this.$commonFun.downloadFile(url);
      },
      /**删除成员 */
      deleteMember(index, rows){
        rows.splice(index, 1);
      },
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row,true);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
    },

    created(){
      // console.log(this.materialInfo);
      this.searchForm.materialId = this.$route.params.materialId;
      this.materialId = this.$route.params.materialId;
      //如果没有教材id则跳转到通知列表
      if(!this.searchForm.materialId){
        this.$router.push({name:'通知列表'});
      }
      this.getTableData();
      this.getBookName();


      if(window._hmt){
        _hmt.push(['_trackPageview', '/material-application/1v3']);
      }
    },
    watch:{

      tableData:{

        //注意：当观察的数据为对象或数组时，curVal和oldVal是相等的，因为这两个形参指向的是同一个数据对象
        handler:function(newValue,oldVal){
          //console.log(this);
          if(this.selectAll){
            //this.toggleSelection(newValue);
          }


        },
        deep:true
      }
    },

    components:{
      userPmph
    }
  }
</script>
<style>
  .editors_sql_label{
    display:block;
  }
  .scopeSpan1{
    display: inline-block;
    vertical-align: middle;
  }
  .scopeSpan2{
    display: inline-block;
    vertical-align: middle;
    max-width: 110px;
    padding: 0 0 0 10px;
    text-align: center;
  }
  .scopeSpan3{
    display: inline-block;
    vertical-align: middle;
  }
  .delete{
    color:red;
  }
  .input{
    width: 100%;
  }
</style>
<style scoped>
  .operation-wrapper {
    text-align: right;
    width: 100%;
    float: right;
  }
  #select_all_btn {
    float: left;
    border-radius: 100%;
    width: 36px !important;
    padding: 10px 3px;
    margin-left: 5px;
  }
  #select_all_checkbox_wrapper {
    float: left;
    border-radius: 4px;
    height: 36px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding: 9px 0px 9px 15px;
    background-color: #1ab194;
    color: white;
    cursor: inherit;
  }
  #select_all_checkbox_wrapper .el-checkbox__inner{
    float: left;
  }
  input#select_all_checkbox {
    position: relative;
    left: -84px;
    width: 18px;
    height: 18px;
    right: 0px;
    z-index: 1;
    opacity: 0;
    cursor: pointer;
  }

  #select_all_checkbox_wrapper .select_all_text{
    height: 18px;
    line-height: 18px;
    display: inline-block;
    float: left;
    cursor: default;
    margin-left:10px;
  }
  .el-button{
    min-width: 20px;
  }
  .css-not-pageSelected {
    width: 14px;
    height: 14px;
    display: block;
    margin: auto;
    background-color: #ffff;
    border-radius: 100%;
  }

  .selecting_all span.el-checkbox__inner {
    background: gray;
  }
</style>
