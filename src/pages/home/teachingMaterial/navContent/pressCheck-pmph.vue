<template>
  <div class="teachingMaterial publisherAudit">
    <div class="teachingMaterial-search clearfix" :class="{powerSearch:powerSearch}">
      <div v-if="!powerSearch">
        <!--书名选择框-->
        <div class="searchBox-wrapper lg">
          <div class="searchName">书名：<span></span></div>
          <div class="searchInput">
            <el-select v-model="searchParams.textBookids" @change="handleSearchCLick" multiple placeholder="请选择">
              <el-option
                v-for="item in booksChooseOptions"
                :key="item.id"
                :label="item.textbookName"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
        </div>
        <!--姓名搜索-->
        <div class="searchBox-wrapper">
          <div class="searchName">账号/姓名：<span></span></div>
          <div class="searchInput">
            <el-input placeholder="请输入" class="searchInputEle" v-model.trim="searchParams.realname" @keyup.enter.native="handleSearchCLick"></el-input>
          </div>
        </div>
        <!--职务搜索-->
        <div class="searchBox-wrapper">
          <div class="searchName">职务：<span></span></div>
          <div class="searchInput">
            <el-input placeholder="请输入" class="searchInputEle" v-model.trim="searchParams.position" @keyup.enter.native="handleSearchCLick"></el-input>
          </div>
        </div>
        <!--职称搜索-->
        <div class="searchBox-wrapper">
          <div class="searchName">职称：<span></span></div>
          <div class="searchInput">
            <el-input placeholder="请输入" class="searchInputEle" v-model.trim="searchParams.title" @keyup.enter.native="handleSearchCLick"></el-input>
          </div>
        </div>
        <!--工作单位搜索-->
        <div class="searchBox-wrapper">
          <div class="searchName">工作单位：<span></span></div>
          <div class="searchInput">
            <el-input placeholder="请输入" class="searchInputEle" v-model.trim="searchParams.orgName" @keyup.enter.native="handleSearchCLick"></el-input>
          </div>
        </div>
        <!--申报单位搜索-->
        <!--<div class="searchBox-wrapper">-->
          <!--<div class="searchName">申报单位：<span></span></div>-->
          <!--<div class="searchInput">-->
            <!--<el-input placeholder="请输入" class="searchInputEle" v-model.trim="searchParams.unitName" @keyup.enter.native="handleSearchCLick"></el-input>-->
          <!--</div>-->
        <!--</div>-->
        <!--申报职务搜索-->
        <div class="searchBox-wrapper">
          <div class="searchName">申报职务：<span></span></div>
          <div class="searchInput">
            <el-select v-model="searchParams.positionType" placeholder="请选择" @change="handleSearchCLick">
              <el-option
                v-for="item in positionValue"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <!--学校审核搜索-->
        <div class="searchBox-wrapper">
          <div class="searchName">学校审核：<span></span></div>
          <div class="searchInput">
            <el-select v-model="searchParams.onlineProgress" placeholder="请选择" @change="handleSearchCLick">
              <el-option
                v-for="item in onlineProgressList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <!--纸质表搜索-->
        <div class="searchBox-wrapper">
          <div class="searchName">纸质表：<span></span></div>
          <div class="searchInput">
            <el-select v-model="searchParams.offlineProgress" placeholder="请选择" @change="handleSearchCLick">
              <el-option
                v-for="item in offlineProgressList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <!--教材大纲-->
        <div class="searchBox-wrapper">
          <div class="searchName">教材大纲：<span></span></div>
          <div class="searchInput">
            <el-select v-model="searchParams.haveFile" placeholder="请选择" @change="handleSearchCLick">
              <el-option
                v-for="item in haveFileList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="searchBox-wrapper" style="width:550px;">
          <div class="searchName">提交时间：<span></span></div>
          <div class="searchInput">
            <el-date-picker
              v-model="startCommitDate"
              type="datetime"
              placeholder="选择提交开始时间"
            >
            </el-date-picker>
            <el-date-picker
              v-model="endCommitDate"
              type="datetime"
              placeholder="选择提交结束时间"
            >
            </el-date-picker>
          </div>
        </div>
        <!--姓名搜索-->
        <div class="searchBox-wrapper searchBtn">
          <el-button  type="primary" icon="search" @click="handleSearchCLick">搜索</el-button>
        </div>
        <!--姓名搜索-->
        <div class="searchBox-wrapper searchBtn">
          <el-button type="text" @click="toggleSearchType">收起搜索区</el-button>
        </div>
        <!--操作按钮-->
        <div class="operation-wrapper">
          <el-button type="primary" :disabled="!tableData.length" @click="exportWordStart">导出Word</el-button>
          <el-button type="primary" :disabled="!tableData.length" @click="exportExcel">导出Excel</el-button>
        </div>
      </div>
      <!--高级搜索-->
      <div v-else>
        <div class="searchBox-wrapper powerSearch" :class="{lg : powerSearchValue===1}">
          <el-select v-model="powerSearchValue" class="searchName" placeholder="请选择">
            <el-option
              v-for="item in powerSearchList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <div class="searchInput">
            <el-select v-model="searchParams.textBookids" @change="handleSearchCLick" multiple placeholder="请选择" v-if="powerSearchValue===1">
              <el-option
                v-for="item in booksChooseOptions"
                :key="item.id"
                :label="item.textbookName"
                :value="item.id">
              </el-option>
            </el-select>
            <el-select v-model="searchParams.positionType" placeholder="请选择" @change="handleSearchCLick" v-else-if="powerSearchValue===6">
              <el-option
                v-for="item in positionValue"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="searchParams.onlineProgress" placeholder="请选择" @change="handleSearchCLick" v-else-if="powerSearchValue===7">
              <el-option
                v-for="item in onlineProgressList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="searchParams.offlineProgress" placeholder="请选择" @change="handleSearchCLick" v-else-if="powerSearchValue===8">
              <el-option
                v-for="item in offlineProgressList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="searchParams.haveFile" placeholder="请选择" @change="handleSearchCLick" v-else-if="powerSearchValue===9">
              <el-option
                v-for="item in haveFileList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-input placeholder="请输入" class="searchInputEle" v-model.trim="searchParams.realname" @keyup.enter.native="handleSearchCLick" v-else-if="powerSearchValue===0"></el-input>
            <!--<el-input placeholder="请输入" class="searchInputEle" v-model.trim="searchParams.unitName" @keyup.enter.native="handleSearchCLick" v-else-if="powerSearchValue===2"></el-input>-->
            <el-input placeholder="请输入" class="searchInputEle" v-model.trim="searchParams.position" @keyup.enter.native="handleSearchCLick" v-else-if="powerSearchValue===3"></el-input>
            <el-input placeholder="请输入" class="searchInputEle" v-model.trim="searchParams.title" @keyup.enter.native="handleSearchCLick" v-else-if="powerSearchValue===4"></el-input>
            <el-input placeholder="请输入" class="searchInputEle" v-model.trim="searchParams.orgName" @keyup.enter.native="handleSearchCLick" v-else-if="powerSearchValue===5"></el-input>
          </div>
        </div>
        <div class="searchBox-wrapper searchBtn">
          <el-button  type="primary" icon="search" @click="handleSearchCLick">搜索</el-button>
        </div>
        <div class="searchBox-wrapper searchBtn">
          <el-button type="text" @click="toggleSearchType">高级搜索</el-button>
        </div>
        <!--操作按钮-->
        <div class="operation-wrapper">
          <el-button type="primary" :disabled="!tableData.length" @click="exportWordStart">导出Word</el-button>
          <el-button type="primary" :disabled="!tableData.length" @click="exportExcel">导出Excel</el-button>
        </div>
      </div>
    </div>
    <!--表格-->
    <div class="table-wrapper">
      <el-table border
                :data="tableData"
                style="width: 100%">
        <el-table-column
          label="姓名"
          min-width="80"
        >
          <template scope="scope">
            <el-button type="text" @click="linkToExpertInfo(scope.row.id)">{{scope.row.realname}}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="账号"
          min-width="80">
          <template scope="scope">
            {{scope.row.username}}
          </template>
        </el-table-column>

        <el-table-column label="申报单位/工作单位" min-width="160">
          <template scope="scope">
            <p><i class="fa fa-university"></i>{{scope.row.unitName}}</p>
            <p><i class="fa fa-briefcase"></i>{{scope.row.orgName}}</p>
          </template>
        </el-table-column>
        <el-table-column label="职务/职称" min-width="120" >
          <template scope="scope">
            <p><i class="fa fa-tags"></i>{{scope.row.position}}</p>
            <p><i class="fa fa-graduation-cap"></i>{{scope.row.title}}</p>
          </template>
        </el-table-column>
        <el-table-column label="联系方式" min-width="150">
          <template scope="scope">
            <p v-if="scope.row.handphone"><i class="fa fa-phone fa-fw"></i>{{scope.row.handphone}}</p>
            <p v-if="scope.row.email"><i class="fa fa-envelope fa-fw"></i>{{scope.row.email}}</p>
          </template>
        </el-table-column>
        <el-table-column label="所选书籍与职位" min-width="140">
          <template scope="scope">
            <p v-html="scope.row.chooseBooksAndPostions"></p>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" min-width="100">
          <template scope="scope">
            <p>{{stateList[scope.row.onlineProgress]}}</p>
          </template>
        </el-table-column>
        <el-table-column label="提交时间" min-width="100">
          <template scope="scope">
            <p>{{$commonFun.formatDate(scope.row.commitDate)}}</p>
          </template>
        </el-table-column>
        <el-table-column label="是否收到纸质表" width="135">
          <template scope="scope">
            <p type="text" v-if="scope.row.offlineProgress==0" class="link" @click="confirmPaperList(scope.row)">确认收到纸质表</p>

            <p v-else>{{offlineProgress[scope.row.offlineProgress]}}</p>

          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-wrapper">
      <el-pagination
        v-if="totalNum>searchParams.pageSize"
        @size-change="handleSizeChange"
        @current-change="getTableData"
        :current-page.sync="searchParams.pageNumber"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="searchParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum">
      </el-pagination>
    </div>

    <div>
      <el-dialog
        title="正在导出..."
        :visible.sync="exportDialog"
        size="tiny"
        :before-close="handleExportDialogClose">
        <div class="paddingT50 paddingB50">
          <el-progress :text-inside="true" :stroke-width="18" :percentage="exportLoading" status="success"></el-progress>
        </div>
      </el-dialog>

      <el-dialog
        title="下载Word"
        :visible.sync="downloadWordDialog"
        size="tiny"
      >
        <div class="paddingT20 paddingB50 text-center">
          <div class="width100 inline-block">
            <el-progress type="circle" :percentage="100" status="success"></el-progress>
          </div>
          <div class="paddingT10">
            <el-button type="text" class="link" @click="downloadWord">点击此链接下载Word</el-button>
            <el-button type="text" @click="copyDownloadUrl">
              <i class="fa fa-copy"></i>
            </el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  export default {
    props:['materialInfo','pressCheckSearchParams','declareHistory'],
    data() {
      return {
        api_confirm_paper:'/pmpheep/declaration/list/declaration/confirmPaperList',
        api_declaration_list:'/pmpheep/declaration/list/declaration',
        api_book_list:'/pmpheep/textBook/list',
        api_export_excel:'/pmpheep/excel/declaration',
        api_export_word_getid:'/pmpheep/word/identification',
        api_export_word_start:'/pmpheep/word/declaration',
        api_export_word_progress:'/pmpheep/word/progress',
        api_export_word_download:'/pmpheep/zip/download',
        powerSearch:true,
        powerSearchList:[
          {
            value:0,
            label:'账号/姓名'
          },
          {
            value:1,
            label:'书名'
          },{
//            value:2,
//            label:'申报单位'
//          },{
            value:3,
            label:'职务'
          },{
            value:4,
            label:'职称'
          },{
            value:5,
            label:'工作单位'
          },{
            value:6,
            label:'申报职务'
          },{
            value:7,
            label:'学校审核'
          },{
            value:8,
            label:'出版社审核'
          },{
            value:9,
            label:'教材大纲'
          }

        ],
        powerSearchValue:0,
        positionValue:[{
          value:'',
          label:'全部'
        },{
          value:1,
          label:'主编'
        },{
          value:2,
          label:'副主编'
        },{
          value:3,
          label:'编委'
        }],
        booksChooseOptions: [],
        onlineProgressList:[{
          value: '',
          label: '全部'
        }, {
          value: 1,
          label: '待审核'
        }, {
          value: 3,
          label: '已审核'
        }],
        offlineProgressList:[{
          value: '',
          label: '全部'
        }, {
          value: 0,
          label: '未收到纸质表'
        }, {
          value: 2,
          label: '已收到纸质表'
        }],

        haveFileList:[{
          value:'',
          label:'全部'
        },{
          value:true,
          label:'有'
        },{
          value:false,
          label:'无'
        }],
        offlineProgress:['未收到纸质表','已退回纸质表','已收到纸质表'],
        searchParams:{
          pageNumber:1,
          pageSize:20,
          materialId:'',
          textBookids:[],
          realname:'',
          position:'',
          title:'',
          orgId:0,
          unitName:'',
          positionType:'',
          onlineProgress:'',
          offlineProgress:'',
          haveFile:'',

        },
        startCommitDate:'',
        endCommitDate:'',
        tableData: [],
        totalNum:0,
        exportDialog:false,
        exportLoading:0,
        exportLoadingTimerHandle:undefined,
        handleExportWordtimer:null,
        downloadWordDialog:false,
        wordUrl:'',
        noWatchFirst:false,//做浏览记录 第一次watch不生效
        stateList:['未提交','待出版社审核','被出版社退回','已审核','待出版社审核','被出版社退回'],
      }
    },
    props:['pressHistory'],
    watch:{
      powerSearchValue(val){
        if(this.noWatchFirst){
           this.cleanSearchInput();
        }
        this.noWatchFirst=true;
      }
    },
    methods:{
      /**
       * 此方法用于展开与收起高级搜索区域
       */
      toggleSearchType(){
        this.powerSearch=!this.powerSearch;
        this.cleanSearchInput();
      },
      /* 清空搜索框 */
      cleanSearchInput(){
        var pageNumber=this.searchParams.pageNumber;
        var pageSize=this.searchParams.pageSize;
        var materialId=this.searchParams.materialId;
        this.searchParams={
          pageNumber:pageNumber,
          pageSize:pageSize,
          materialId:materialId,
          textBookids:[],
          realname:'',
          position:'',
          title:'',
          orgId:0,
          unitName:'',
          positionType:'',
          onlineProgress:'',
          offlineProgress:'',
          haveFile:''
        }

      },
      /**
       * 获取表格数据
       */
      getTableData(){
        this.$axios.get(this.api_declaration_list,{params:{
          pageNumber:this.searchParams.pageNumber,
          pageSize:this.searchParams.pageSize,
          materialId:this.searchParams.materialId,
          textBookids:'['+this.searchParams.textBookids.join(',')+']',
          realname:this.searchParams.realname,
          position:this.searchParams.position,
          title:this.searchParams.title,
          orgId:0,
          unitName:this.searchParams.unitName,
          positionType:this.searchParams.positionType,
          onlineProgress:this.searchParams.onlineProgress,
          offlineProgress:this.searchParams.offlineProgress,
          haveFile:this.searchParams.haveFile,
          startCommitDate:this.$commonFun.formatDate(+new Date(this.startCommitDate)),
          endCommitDate:this.$commonFun.formatDate(+new Date(this.endCommitDate))
        }})
          .then(response=>{
            var res = response.data;
            if(res.code==1){
              this.totalNum = res.data.total;
              res.data.rows.map(iterm=>{

              });
              this.tableData = res.data.rows;
            }
          })
          .catch(e=>{
            console.log(e);
          })
      },
      /**
       * 点击搜索按钮
       * @param val
       */
      handleSearchCLick(){
        if(this.searchParams.pageNumber==1){
          this.getTableData();
        }else{
          this.searchParams.pageNumber=1;
        }
      },
      /**
       * 获取当前教材下所有书籍
       * @param val
       */
      getBookList(){
        this.$axios.get(this.api_book_list,{params:{
          materialId:this.searchParams.materialId
        }})
          .then(response=>{
            var res = response.data;
            if(res.code==1){
              this.booksChooseOptions = res.data;
            }
          })
          .catch(e=>{
            console.log(e);
          })
      },

      /**
       * 分页每页显示条数发生改变
       * @param val
       */
      handleSizeChange(val){
        this.searchParams.pageSize=val;
        this.searchParams.pageNumber=1;
        this.getTableData();
      },

      /**
       * 确认收到纸质表
       */
      confirmPaperList(row){
        this.$axios.get(this.api_confirm_paper,{params:{
          id:row.id,
          offlineProgress:2
        }})
          .then(response=>{
            var res = response.data;
            if(res.code==1){
              this.$message.success('已确认收到纸质表！');
              row.offlineProgress=2;
            }else{
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
       * 导出excel
       */
      exportExcel(){
        if(this.exportDialog){
          this.$message.warning('已有文件正在导出，请稍后再试！');
          return;
        }
        this.exportDialog=true;
        this.exportLoadingTimerHandle&&this.exportLoadingTimerHandle.bort();
        this.exportLoadingTimerHandle = this.$commonFun.perfectAnimate(0,100,6000,(val)=>{
          this.exportLoading = val;
          if(this.exportLoading==100){
            this.exportDialog=false;
          }
        });

        let params = {
          materialId:this.searchParams.materialId,
          textBookids:this.searchParams.textBookids.join(','),
          realname:this.searchParams.realname,
          position:this.searchParams.position,
          title:this.searchParams.title,
          orgName:this.searchParams.orgName?this.searchParams.orgName:'',
          unitName:'人民卫生出版社',
          positionType:this.searchParams.positionType,
          onlineProgress:this.searchParams.onlineProgress,
          offlineProgress:this.searchParams.offlineProgress,
        };
        let excelUrl = this.api_export_excel;
        for(let key in params){
          excelUrl+=((excelUrl.includes('?')?'&':'?')+key+'='+params[key]);
        }
        this.$commonFun.downloadFile(excelUrl);
      },
      /**
       * 导出进度条关闭前
       */
      handleExportDialogClose(done){
        this.exportLoadingTimerHandle&&this.exportLoadingTimerHandle.bort();
        clearInterval(this.handleExportWordtimer)
        done();
      },
      /**
       * 下载
       */
      exportWordGetId(){
        if(this.exportDialog){
          this.$message.warning('已有文件正在导出，请稍后再试！');
          return;
        }

        this.$axios.get(this.api_export_word_getid)
          .then(response=>{
            var res = response.data;
            this.exportWordStart(res);
            this.exportWordProgress(res);
          })
          .catch(e=>{
            console.log(e);
            this.$confirm('导出失败，请重试！', "提示",{
            	confirmButtonText: "确定",
            	cancelButtonText: "取消",
            	showCancelButton: false,
            	type: "error"
            })
          })
      },
      exportWordStart(id){
        this.exportDialog=true;
        this.exportLoadingTimerHandle&&this.exportLoadingTimerHandle.bort();
        this.exportLoadingTimerHandle = this.$commonFun.perfectAnimate(0,100,60000,(val)=>{
          this.exportLoading = val;
          if(this.exportLoading==100){
            this.exportDialog=false;
          }
        },true);
        this.$axios.get(this.api_export_word_start,{params:{
          materialId:this.searchParams.materialId,
          textBookids:this.searchParams.textBookids.join(','),
          realname:this.searchParams.realname,
          position:this.searchParams.position,
          title:this.searchParams.title,
          orgName:this.searchParams.orgName,
          unitName:'人民卫生出版社',
          positionType:this.searchParams.positionType,
          onlineProgress:this.searchParams.onlineProgress,
          offlineProgress:this.searchParams.offlineProgress,
        }})
          .then(response=>{
            this.exportWordProgress(response.data);
          })
          .catch(e=>{
            console.log(e);
            this.exportDialog=false;
            clearInterval(this.handleExportWordtimer);
            this.$confirm('导出失败，请重试！', "提示",{
            	confirmButtonText: "确定",
            	cancelButtonText: "取消",
            	showCancelButton: false,
            	type: "error"
            })
          })
      },
      exportWordProgress(id){
        var timeout = 3*60*1000;//设置3分钟超时
        var useTime = 0;
        this.handleExportWordtimer = setInterval(()=>{
          useTime+=1500;
          this.$axios.get(this.api_export_word_progress,{params:{
            id:id
          }})
            .then(response=>{
              let res = response.data;
              if(res.state==1){
                clearInterval(this.handleExportWordtimer);
                this.exportWordDownload(res.detail);
              }
            })
            .catch(e=>{
              console.log(e);
              if(this.exportDialog){
                this.$confirm('导出失败，请重试！', "提示",{
                	confirmButtonText: "确定",
                	cancelButtonText: "取消",
                	showCancelButton: false,
                	type: "error"
                });
                this.exportDialog=false;
                clearInterval(this.handleExportWordtimer);
                this.exportLoadingTimerHandle&&this.exportLoadingTimerHandle.end();
              }
            })
          //超时提醒
          if(useTime>timeout){
            this.$confirm('导出请求超时，请重试！', "提示",{
            	confirmButtonText: "确定",
            	cancelButtonText: "取消",
            	showCancelButton: false,
            	type: "error"
            });
            clearInterval(this.handleExportWordtimer);
            this.exportLoadingTimerHandle&&this.exportLoadingTimerHandle.end();
          }
        },1500)

      },
      exportWordDownload(url){
        //this.$commonFun.downloadFile('/pmpheep'+url);
        console.log("url   /pmpheep"+url);
        this.exportDialog=false;
        this.exportLoadingTimerHandle&&this.exportLoadingTimerHandle.end();
        this.downloadWordDialog=true;
        this.wordUrl='/pmpheep'+url;

      },
      downloadWord(){
        if(this.wordUrl){
          this.$commonFun.downloadFile(this.wordUrl);
        }
      },
      copyDownloadUrl(){
        if(this.wordUrl){
          this.$commonFun.copy(window.location.origin+this.wordUrl);
        }
      },
      /**
       * 跳转到专家信息页面
       * @param id
       */
      linkToExpertInfo(id){
        var searParams = {};
        for(let key in this.searchParams){
          searParams[key] = this.searchParams[key];
        }
        searParams = { declarationId: id };
        this.$router.push({
          name:'专家信息',
          query: searParams
        })
      },
    },
    created(){
      /* 搜索记录赋值 */
      if(this.pressHistory){
        this.powerSearchValue=this.pressHistory.powerSearchValue;
         this.searchParams=this.pressHistory.searchParams;
         this.powerSearch=this.pressHistory.powerSearch;
      }
      this.searchParams.materialId = this.$route.params.materialId;

      for(let key in this.pressCheckSearchParams){
        this.searchParams[key] = this.pressCheckSearchParams[key];
      }

      //如果没有教材id则跳转到通知列表
      if(!this.searchParams.materialId){
        this.$router.push({name:'通知列表'});
      }
      this.getTableData();
      this.getBookList();
    },
    beforeRouteLeave(to,from,next){
     var obj={
        searchParams:this.searchParams,
        powerSearchValue:this.powerSearchValue,
        powerSearch:this.powerSearch
      }
      this.$emit('selectHistory',obj,0)
     next();
    }
  }

</script>

<style scoped>
  .searchBox-wrapper.powerSearch .searchName{
    width: 130px;
  }
  .searchBox-wrapper.powerSearch .searchInput{
    margin-left: 134px;
  }
</style>
