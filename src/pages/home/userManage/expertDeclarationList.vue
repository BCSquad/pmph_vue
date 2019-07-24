<template>
  <div class="teachingMaterial publisherAudit">
    <div class="clearfix" style="margin-top: 30px">
      <div class="searchBox-wrapper">
        <div class="searchName">教材名称：
          <span></span>
        </div>
        <div class="searchInput">
          <el-input placeholder="请输入" class="searchInputEle" v-model="searchParams.materialName"  @keyup.enter.native="getTableData()"></el-input>
        </div>
      </div>
      <div class="searchBox-wrapper">
        <div class="searchName">申报单位：<span></span></div>
        <div class="searchInput">
          <el-input placeholder="请输入" class="searchInputEle" v-model.trim="searchParams.unitName" @keyup.enter.native="handleSearchCLick"></el-input>
        </div>
      </div>
      <div class="searchBox-wrapper searchBtn " >
        <el-button type="primary" :disabled="!tableData.length" @click="getTableData">搜索</el-button>
      </div>
      <div class="operation-wrapper" style="margin-right: 30px">

        <el-button type="primary"  @click="back">上一步</el-button>
      </div>
    </div>
    <div class="table-wrapper">
      <el-table border
        :data="tableData"
        style="width: 100%">
        <el-table-column
          label="姓名"
          min-width="80"
        >
          <template scope="scope">
            <el-button type="text" @click="linkToExpertInfo(scope.row.id,scope.row.materialId)">{{scope.row.realname}}</el-button>
          </template>
        </el-table-column>

        <el-table-column
          label="申报教材名称"
          min-width="150"
        >
          <template scope="scope">
            {{scope.row.materialName}}
          </template>
        </el-table-column>
       <!-- <el-table-column
          label="账号"
          min-width="110">
          <template scope="scope">
            {{scope.row.username}}
          </template>
        </el-table-column>-->

        <el-table-column label="申报单位/工作单位" min-width="160">
          <template scope="scope">
            <p><i class="fa fa-university"></i>{{scope.row.unitName}}</p>
            <p><i class="fa fa-briefcase"></i>{{scope.row.orgName}}</p>
          </template>
        </el-table-column>
        <el-table-column label="职务/职称" min-width="100" >
          <template scope="scope">
            <p><i class="fa fa-tags"></i>{{scope.row.position}}</p>
            <p><i class="fa fa-graduation-cap"></i>{{scope.row.title}}</p>
          </template>
        </el-table-column>
        <el-table-column label="联系方式" min-width="120">
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
            <p>{{scope.row.orgId==0&&scope.row.onlineProgress==1?"待出版社审核":(scope.row.orgId==0&&scope.row.onlineProgress==3?"出版社已审核":stateList[scope.row.onlineProgress])}}</p>
          </template>
        </el-table-column>
        <el-table-column label="提交时间" min-width="110">
          <template scope="scope">
            <p>{{$commonFun.formatDate(scope.row.commitDate)}}</p>
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
        :close-on-click-modal="false"
        :before-close="handleExportDialogClose">
        <div class="paddingT50 paddingB50">
          <el-progress :text-inside="true" :stroke-width="18" :percentage="exportLoading" status="success"></el-progress>
        </div>
      </el-dialog>

      <el-dialog
        title="下载word"
        :visible.sync="downloadWordDialog"
        size="tiny"
      >
        <div class="paddingT20 paddingB50 text-center">
          <div class="width100 inline-block">
            <el-progress type="circle" :percentage="100" status="success"></el-progress>
          </div>
          <div class="paddingT10">
            <el-button type="text" class="link" @click="downloadWord">点击此链接下载word</el-button>
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

  import bus from 'common/eventBus/bus.js'
  export default {
    props:['materialInfo','pressCheckSearchParams','declareHistory'],
    data() {
      return {
        api_confirm_paper:'/pmpheep/declaration/list/declaration/confirmPaperList',
        api_declaration_list:'/pmpheep/declaration/list/declarationByUserId',
        api_book_list:'/pmpheep/textBook/list',
        api_getAllTitle:"/pmpheep/dataDictionary/getListByCode",
        api_export_excel:'/pmpheep/excel/declaration',
        api_export_word_getid:'/pmpheep/word/identification',
        api_export_word_start:'/pmpheep/word/declaration',
        api_export_word_progress:'/pmpheep/word/progress',
        api_export_word_download:'/pmpheep/zip/download',
        powerSearch:true,
        userId:null,
        powerSearchList:[
          {
            value:0,
            label:'账号/姓名'
          },
          {
            value:1,
            label:'书名'
          },{
            value:2,
            label:'申报单位'
          },{
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
          },{
            value:10,
            label:'是否被遴选'
          },{
            value:11,
            label:'提交时间'
          }
        ],
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        powerSearchValue:0,
        positionValue:[
          {
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
        titleValue:[
          { value: '',
           label: '全部'}
        ],
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
        isSelectList:[{
          value:'',
          label:'全部'
        },{
          value:true,
          label:'是'
        },{
          value:false,
          label:'否'
        }],
        offlineProgress:['未收到纸质表','已退回纸质表','已收到纸质表'],
        searchParams:{
          pageNumber:1,
          pageSize:20,
          userId:null,
          materialId:'',
          materialName:'',
          textBookids:[],
          realname:'',
          position:'',
          title:'',
          orgName:'',
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
        stateList:['未提交','待学校审核','被学校退回','学校已审核','待学校审核','被出版社退回'],
        noWatchFirst:false,//做浏览记录 第一次watch不生效
      }
    },
    watch:{
     powerSearchValue(val){
       if(this.noWatchFirst){
           this.cleanSearchInput();
        }
        this.noWatchFirst=true;
     }
    },
    methods:{

      getAllTile(){
        this.$axios.get(this.api_getAllTitle,{params:{
            code:'writer_user_title'
          }})
          .then(response=>{
            var res = response.data;
            if(res.code==1){


              res.data.forEach(iterm=>{
                let item={
                  value:iterm.code,
                  label:iterm.name
                };
                this.titleValue.push(item);
                console.log(iterm);

              })

            }
          })
          .catch(e=>{
            console.log(e);
          })
      },
      back(){
        this.$router.push({name:'专家档案库'})
      },

      hasback(row){
        if(row.onlineProgress=='2'||row.onlineProgress=='4'||row.onlineProgress=='5'){
          return true;
        }
        return false;
      },
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
          orgName:'',
          unitName:'',
          positionType:'',
          onlineProgress:'',
          offlineProgress:'',
          haveFile:'',
         isSelect:''
       }

      },
      /**
       * 获取表格数据
       */
      getTableData(){
        console.log(this.userId);
        console.log('11111',this.searchParams.haveFile);
        this.$axios.get(this.api_declaration_list,{params:{
          pageNumber:this.searchParams.pageNumber,
          pageSize:this.searchParams.pageSize,
            userId:this.searchParams.userId,
            materialName:this.searchParams.materialName,
            unitName:this.searchParams.unitName
        }})
          .then(response=>{
            var res = response.data;
            console.log(res);
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
       * 分页每页显示条数发生改变
       * @param val
       */
      handleSizeChange(val){
        this.searchParams.pageSize=val;
        this.searchParams.pageNumber=1;
        this.getTableData();
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
          orgName:this.searchParams.orgName,
          unitName:this.searchParams.unitName,
          positionType:this.searchParams.positionType,
          onlineProgress:this.searchParams.onlineProgress,
          offlineProgress:this.searchParams.offlineProgress,
          isSelect:this.searchParams.isSelect
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
          unitName:this.searchParams.unitName,
          positionType:this.searchParams.positionType,
          onlineProgress:this.searchParams.onlineProgress,
          offlineProgress:this.searchParams.offlineProgress,
            isSelect:this.searchParams.isSelect
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
                console.log("exportWordDownload  "+res.detail);
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
        console.log("url   "+url);
        //this.$commonFun.downloadFile('/pmpheep'+url);
        this.exportDialog=false;
        this.exportLoadingTimerHandle&&this.exportLoadingTimerHandle.end();
        this.downloadWordDialog=true;
        console.log("url   /pmpheep"+url);
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
      linkToExpertInfo(id,materialId){
        this.searchParams.materialId=materialId;
        var searParams = {};
        for(let key in this.searchParams){
          searParams[key] = this.searchParams[key];
        }
        searParams = { declarationId: id ,materialId:materialId,userId:this.searchParams.userId};
        this.$router.push({
          name:'专家申报表',
          query: searParams,
          params:searParams
        })
      },
    },

    created(){
      this.searchParams.userId=this.$route.params.userId;
      this.getTableData();
      if(window._hmt){
        _hmt.push(['_trackPageview', '/material-application/pressCheck']);
      }
    },
    /* 离开当前页面记录搜索数据 */
    beforeRouteLeave(to,from,next){
      var obj={
        searchParams:this.searchParams,
        powerSearchValue:this.powerSearchValue,
        powerSearch:this.powerSearch
      }
      this.$emit('selectHistory',obj,1)
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
<style>
  th.is-leaf{
    text-align: center;
  }
</style>
