<template>
  <div class="teachingMaterial publisherAudit">
    <div class="teachingMaterial-search clearfix" :class="{powerSearch:powerSearch}">
      <div v-if="!powerSearch">

        <!--姓名搜索-->
        <div class="searchBox-wrapper">
          <div class="searchName">账号/姓名：<span></span></div>
          <div class="searchInput">
            <el-input placeholder="请输入" class="searchInputEle" v-model.trim="searchParams.realname" @keyup.enter.native="handleSearchCLick"></el-input>
          </div>
        </div>
        <!--职务搜索-->
        <div class="searchBox-wrapper" style="width: 350px;">
          <div class="searchName" style="width: 120px">职务：<span></span></div>
          <div class="searchInput" style="margin-left: 124px;">
            <el-input placeholder="请输入" class="searchInputEle" v-model.trim="searchParams.position" @keyup.enter.native="handleSearchCLick"></el-input>
          </div>
        </div>


        <div class="searchBox-wrapper" style="width: 350px;">
          <div class="searchName" style="width: 120px">职称：<span></span></div>
          <div class="searchInput" style="margin-left: 124px;">
            <el-input placeholder="请输入" class="searchInputEle" v-model.trim="searchParams.title" @keyup.enter.native="handleSearchCLick"></el-input>
          </div>
        </div>
        <div class="searchBox-wrapper" >
          <div class="searchName" >手机号：<span></span></div>
          <div class="searchInput" >
            <el-input placeholder="请输入" class="searchInputEle" v-model.trim="searchParams.handphone" @keyup.enter.native="handleSearchCLick"></el-input>
          </div>
        </div>

        <!--学校审核状态-->
        <div class="searchBox-wrapper" style="width: 350px;">
          <div class="searchName" style="width: 120px">学校审核状态：<span></span></div>
          <div class="searchInput" style="margin-left: 124px;">
            <el-select v-model="searchParams.schoolStauts" @change="handleSearchCLick"  placeholder="请选择" >
              <el-option
                v-for="item in schoolStauts"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>

        <!--出版社审核状态-->
        <div class="searchBox-wrapper" style="width: 350px;">
          <div class="searchName" style="width: 120px">出版社审核状态：<span></span></div>
          <div class="searchInput" style="margin-left: 124px;">
            <el-select v-model="searchParams.pmphStauts" @change="handleSearchCLick"  placeholder="请选择" >
              <el-option
                v-for="item in pmphStauts"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <!--学校审核状态-->
        <div class="searchBox-wrapper" style="width: 300px;">
          <div class="searchName" style="width: 120px">是否结果公布：<span></span></div>
          <div class="searchInput" style="margin-left: 124px;" >
            <el-select v-model="searchParams.finalResult" @change="handleSearchCLick"  placeholder="请选择" >
              <el-option
                v-for="item in isFinalResultList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>

        <div class="searchBox-wrapper" style="width:550px;">
          <div class="searchName" style="width: 120px">提交时间：<span></span></div>
          <div class="searchInput" tyle="margin-left: 124px;">
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



        <div class="searchBox-wrapper searchBtn">
          <el-button  type="primary" icon="search" @click="handleSearchCLick">搜索</el-button>
        </div>
        <!--姓名搜索-->
        <div class="searchBox-wrapper searchBtn">
          <el-button type="text" @click="toggleSearchType">收起搜索区</el-button>
        </div>
        <!--操作按钮-->
        <div class="operation-wrapper">
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
          <el-input placeholder="请输入" class="searchInputEle" v-model.trim="searchParams.realname" @keyup.enter.native="handleSearchCLick" v-if="powerSearchValue===0"></el-input>
          <el-input placeholder="请输入" class="searchInputEle" v-model.trim="searchParams.position" @keyup.enter.native="handleSearchCLick" v-else-if="powerSearchValue===3"></el-input>
          <el-input placeholder="请输入" class="searchInputEle" v-model.trim="searchParams.title" @keyup.enter.native="handleSearchCLick" v-else-if="powerSearchValue===4"></el-input>
            <el-select v-model="searchParams.schoolStauts" @change="handleSearchCLick"  placeholder="请选择" v-if="powerSearchValue===5">
              <el-option
                v-for="item in schoolStauts"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>

            <el-select v-model="searchParams.pmphStauts" @change="handleSearchCLick"  placeholder="请选择" v-if="powerSearchValue===6">
              <el-option
                v-for="item in pmphStauts"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="searchParams.finalResult" @change="handleSearchCLick"  placeholder="请选择" v-if="powerSearchValue===7">
              <el-option
                v-for="item in isFinalResultList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
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
          <!--<el-button type="danger" :disabled="!tableData.length" @click="exportExcel">批量审核通过</el-button>
          <el-button type="danger" :disabled="!tableData.length" @click="exportExcel">批量最终结果公布</el-button>-->
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
          width="70"
        >
          <template scope="scope">
            <el-button type="text" @click="linkToExpertInfo(scope.row.id)">{{scope.row.realname}}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="账号"
          width="100">
          <template scope="scope">
            {{scope.row.username}}
          </template>
        </el-table-column>
        <!--<el-table-column label="学科分类" min-width="160">
          <template scope="scope">
            <p v-for="(item, index) in scope.row.productSubjectTypeList" :key="index"><i class="fa fa-tags"></i>{{item.type_name}}</p>
          </template>
        </el-table-column>
        <el-table-column label="内容分类" min-width="160">
          <template scope="scope">
            <p v-for="(item, index) in scope.row.productContentTypeList" :key="index"><i class="fa fa-bullseye"></i>{{item.type_name}}</p>
          </template>
        </el-table-column>-->


        <el-table-column label="申报单位/工作单位" width="154">
          <template scope="scope">
            <p><i class="fa fa-briefcase"></i>{{scope.row.unitName}}</p>
            <p><i class="fa fa-university"></i>{{scope.row.org_name}}</p>

          </template>
        </el-table-column>
        <el-table-column label="职务/职称" min-width="100" >
          <template scope="scope">
            <p><i class="fa fa-tags"></i>{{scope.row.position}}</p>
            <p><i class="fa fa-graduation-cap"></i>{{scope.row.title}}</p>
          </template>
        </el-table-column>
        <el-table-column label="联系方式" width="180" >
          <template scope="scope">
            <p v-if="scope.row.handphone"><i class="fa fa-phone fa-fw"></i>{{scope.row.handphone}}</p>
            <p v-if="scope.row.email"><i class="fa fa-envelope fa-fw"></i>{{scope.row.email}}</p>
          </template>
        </el-table-column>
        <el-table-column label="提交时间" width="170">
          <template scope="scope">
            <p>{{$commonFun.formatDate(scope.row.commit_date)}}</p>
          </template>
        </el-table-column>
        <el-table-column label="学校审核 / 出版社审核" width="130">
          <template scope="scope">
            <p><i class="fa fa-briefcase"></i>{{scope.row.schoolStautsText}}</p>
            <p><i class="fa fa-university"></i>{{scope.row.pmphStautsText}}</p>
          </template>
        </el-table-column>
        <!--<el-table-column label="审核状态" min-width="100">-->
          <!--<template scope="scope">-->
            <!--<p>{{scope.row.org_id==0&&scope.row.online_progress==1?"待出版社审核":(scope.row.org_id==0&&scope.row.online_progress==3?"出版社已审核":stateList[scope.row.online_progress])}}</p>-->
          <!--</template>-->
        <!--</el-table-column>-->
    <!--    <el-table-column label="出版社审核" width="90">
          <template scope="scope">

          </template>
        </el-table-column>-->

        <el-table-column label="结果公布" width="100">
          <template scope="scope">
            <p>{{scope.row.finalResult?'已公布':'未公布'}}</p>
          </template>
        </el-table-column>


        <el-table-column label="扫描附件" min-width="100">
          <template scope="scope">
            <p><a href="javascript:void(0)" @click="downloadImage(scope.row.unit_advise)" style="margin-top:10px;color: #70BBC2;cursor: pointer;text-decoration: underline;" >{{scope.row.syllabus_name}}</a></p>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" min-width="150">
          <template scope="scope">
            <div class="handle_btn">
              <p style="text-align: center">
                <el-button type="text"  :disabled="!(scope.row.passbtn&&(isDirector||isAdmin||amIAnAuditor))" @click="pressCheckOpt(1,scope.row.id)" >{{"通&emsp;过"}} </el-button>
                <el-button type="text" :disabled="!(scope.row.notPassbtn&&(isDirector||isAdmin||amIAnAuditor))" @click="pressCheckOpt(2,scope.row.id)" >{{"不通过"}} </el-button>
                <el-button type="text" :disabled="(!scope.row.recall&&(isDirector||isAdmin||amIAnAuditor))" @click="pressCheckOpt(0,scope.row.id)" >{{"撤&emsp;回"}} </el-button>
              </p>
              <p style="text-align: center">
                <el-button type="text"   @click="pressCheckOpt(4,scope.row.id)" :disabled="!(scope.row.pubtn&&(isDirector||isAdmin||amIAnAuditor))">{{"最终结果公布"}}</el-button>
                <el-button type="text"   @click="pressCheckOpt(5,scope.row.id)" :disabled="!((isDirector||isAdmin)&&scope.row.finalResult)">{{"取消结果公布"}}</el-button>
              </p>
            </div>
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

    <el-dialog
      title="正在导出..."
      :visible.sync="exportDialog"
      size="tiny"
      :close-on-click-modal="false"
      :before-close="exportDialogClose">
      <div class="paddingT50 paddingB50">
        <el-progress :text-inside="true" :stroke-width="18" :percentage="exportLoading" status="success"></el-progress>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import bus from 'common/eventBus/bus.js'
  export default {
    props:['productType','product_id'],
    data() {
      return {
        powerSearch:true,
        powerSearchValue:0,
        tableData: [],
        totalNum:0,
        exportDialog:false,
        exportLoading:0,
        exportLoadingTimerHandle:undefined,
        api_clinicalDecision_list:'/pmpheep/expertation/list',
        api_export_excel:'/pmpheep/expertation/exportExpertation',
        //stateSchoolList:['未提交','待学校审核','被学校退回','学校已审核','待学校审核','','',''],
        //stateList:['未提交','','','待出版社审核','出版社退回给学校','被出版社退回','出版社审核通过','出版社审核未通过'],
        //stateList:['未提交','待学校审核','被学校退回','学校已审核','待学校审核','被出版社退回'],
        // schoolStautsText:'',
        // pmphStautsText:'',
        // recall:true,
        // passbtn:true,
        // notPassbtn:true,
        //finalResult:'',
        isDirector:false,
        loginId:'',
        isAdmin:false,
        amIAnAuditor:false,
        searchParams:{
          productId:'',
          pageNumber:1,
          pageSize:20,
          realname:'',
          position:'',
          title:'',
          schoolStauts:'',
          pmphStauts:'',
          handphone:'',
          finalResult:''
        },

        startCommitDate:'',
        endCommitDate:'',
        isFinalResultList:[{
          value:'0',
          label:'未公布'
        },{
          value:'1',
          label:'已公布'
        }],
        schoolStauts:[{
          value:'',
          label:'全部'
        },{
          value:'0',
          label:'学校待审核'
        },{
          value:'1',
          label:'学校审核通过'
        }/*,{
          value:'2',
          label:'学校已退回'
        }*/],
        pmphStauts:[{
          value:'',
          label:'全部'
        },{
          value:'0',
          label:'出版社待审核'
        },{
          value:'1',
          label:'出版社审核通过'
        },{
          value:'2',
          label:'出版社审核不通过'
        },{
          value:'3',
          label:'出版社退回'
        }],
        powerSearchList:[
          {
            value:0,
            label:'账号/姓名'
          },
          {
            value:3,
            label:'职务'
          },{
            value:4,
            label:'职称'
          }
          ,{
            value:5,
            label:'学校审核状态'
          },{
            value:6,
            label:'出版社审核状态'
          },{
            value:7,
            label:'是否发布'
          }
        ],
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

      /**
       *下载扫描附件
       * */
      downloadImage(url){
        this.$commonFun.downloadFile('/pmpheep/file/download/'+url);
      },
      pressCheckOpt(flag,id){
        this.$axios.get('/pmpheep/expertation/changeStatus',{params:{status:flag,id:id}
        }).then(response=>{
          let res = response.data;
          if (res.code == 1) {
                this.$message.success("操作成功");
                this.getTableData();
          } else {
            this.$confirm(res.msg.msgTrim(), "提示",{
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            showCancelButton: false,
            type: "error"
          });
          }
        }).catch(e=>{
          this.$confirm('操作失败，请稍后再试!', "提示",{
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            showCancelButton: false,
            type: "error"
          });
        })
      },
      /**
       * 跳转到专家信息页面
       * @param id
       */
      linkToExpertInfo(id){
       /* var searParams = {};
        searParams = { clinicalDecisionId: id };
        this.$router.push({
          name:'临床决策专家信息',
          query: searParams
        })*/
        this.$emit('toExpertInfoData',id);
      },

      /**
       * 此方法用于展开与收起高级搜索区域
       */
      toggleSearchType(){
        this.powerSearch=!this.powerSearch;
        this.cleanSearchInput();
      },
      cleanSearchInput() {
        var pageNumber = this.searchParams.pageNumber;
        var pageSize = this.searchParams.pageSize;
        this.searchParams = {
          pageNumber: pageNumber,
          pageSize: pageSize,
          realname:'',
          position:'',
          title:'',
          schoolStauts:'',
          pmphStauts:'',
          handphone:'',
          finalResult:'',


        }
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
       * 获取表格数据
       */
      getTableData(){
        this.$axios.get(this.api_clinicalDecision_list,{params:{
            product_id:this.product_id,
            pageNumber:this.searchParams.pageNumber,
            pageSize:this.searchParams.pageSize,
            realname:this.searchParams.realname,
            position:this.searchParams.position,
            title:this.searchParams.title,
            expert_type:this.productType,
            startCommitDate:this.$commonFun.formatDate(+new Date(this.startCommitDate)),
            endCommitDate:this.$commonFun.formatDate(+new Date(this.endCommitDate)),
            schoolStauts:this.searchParams.schoolStauts,
            pmphStauts:this.searchParams.pmphStauts,
            handphone:this.searchParams.handphone,
            finalResult:this.searchParams.finalResult,

          }})
          .then(response=>{
            var res = response.data;
            if(res.code==1){
              this.totalNum = res.data.total;
              this.tableData = res.data.rows;
              if(this.tableData.length>0){
                let audit = res.data.rows[0].auditorArray.split(",");
                audit.forEach(iterm=>{
                    if( parseInt(iterm)== this.loginId){
                        this.amIAnAuditor = true;  //我是产品的审核人
                    }
                })
                let directorArray = res.data.rows[0].director.split(",");
                directorArray.forEach(iterm=>{
                  if(parseInt(iterm) == this.loginId){
                    this.isDirector = true;  //我是产品审核人的主任
                  }
                })
              }
              this.tableData.forEach(iterm=>{
                debugger;
                    iterm["recall"] = (iterm["finalResult"]==false && iterm["pmphAudit"]!=0);


                    iterm["passbtn"] = ( iterm["finalResult"] ==false && iterm["pmphAudit"] ==0 && (iterm["online_progress"] == 3 || iterm["online_progress"] == 1) );


                    iterm["notPassbtn"] = (iterm["finalResult"]==false && iterm["pmphAudit"]==0 && iterm["online_progress"]==1 )
                      ||(iterm["org_id"] !=0 && iterm["finalResult"] ==false && iterm["pmphAudit"] ==0 && (iterm["online_progress"] == 3 || iterm["online_progress"] == 1) );

                iterm["pubtn"]=  iterm["finalResult"] == false && !(iterm["online_progress"] == 4||iterm["online_progress"] == 5||iterm["online_progress"] == 2);


                iterm["schoolStautsText"] = (iterm["org_id"] != 0 && iterm["online_progress"]==1)?"待审核"
                :((iterm["org_id"] != 0 && iterm["online_progress"]==3)?"通过":
                    (iterm["org_id"] !=0 && iterm["pmphAudit"] ==0  && (iterm["online_progress"]  == 4||iterm["online_progress"] == 5)?
                      "出版社退回":(iterm["org_id"]==0?"":"")));


                iterm["pmphStautsText"] = (iterm["pmphAudit"]==1?"通过":
                                          (iterm["pmphAudit"]==2)?"不通过":
                                            ((iterm["online_progress"]==2||iterm["online_progress"]==4||iterm["online_progress"]==5 )?"出版社退回"
                                              :((iterm["pmphAudit"]==0  && iterm["org_id"]!=0  && (iterm["online_progress"] == 1||iterm["online_progress"] == 3 )) || (iterm["org_id"]==0 && iterm["pmphAudit"]==0))?"待审核":""
                                            ));



              });

            }
          })
          .catch(e=>{
            ////console.log(e);
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
          product_id:this.$commonFun.Empty(this.product_id)?"":this.product_id,
          realname:this.searchParams.realname,
          position:this.searchParams.position,
          title:this.searchParams.title,
          expert_type:this.productType,
          startCommitDate:this.$commonFun.formatDate(+new Date(this.startCommitDate)),
          endCommitDate:this.$commonFun.formatDate(+new Date(this.endCommitDate)),
          schoolStauts:this.searchParams.schoolStauts,
          pmphStauts:this.searchParams.pmphStauts,
          handphone:this.searchParams.handphone,
          finalResult:this.searchParams.finalResult
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
      exportDialogClose(done){
        this.exportLoadingTimerHandle&&this.exportLoadingTimerHandle.bort();
        clearInterval(this.handleExportWordtimer)
        done();
      },

    },
    created() {
     // this.isDirector = this.$getUserData().userInfo.isDirector;
      this.loginId = this.$getUserData().userInfo.id;
      this.isAdmin = this.$getUserData().userInfo.isAdmin;
      //this.searchParams.productId = this.$route.query.product_id;
      this.getTableData();
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
  div.handle_btn{
    margin:0.5em ;
  }
  .handle_btn button.el-button {
    background-color: #1ab194;
    color: white !important;
  }
  .handle_btn button.el-button.is-disabled{
    background-color: #d4d9dd !important;
  }
  .handle_btn p:nth-child(1) button.el-button {
    padding: 0.35em 0.57em;
    margin: 0.35em;
  }
  .handle_btn p:nth-child(2) button.el-button {
    padding: 0.35em 0.35em;
    margin: 0.35em;
  }

</style>
