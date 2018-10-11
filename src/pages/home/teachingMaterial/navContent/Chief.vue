<template>
    <div class="teachMaterial chief">
      <p class="bookTitle" v-if="formData.bookName">《 {{formData.bookName}} 》</p>
      <div class="teachingMaterial-search clearfix">
        <div class="searchBox-wrapper">
          <div class="searchName">姓名：<span></span></div>
          <div class="searchInput">
            <el-input v-model="realName" @keyup.enter.native="search" placeholder="请输入姓名"></el-input>
          </div>
        </div>
        <div class="searchBox-wrapper">
          <div class="searchName">申报单位：<span></span></div>
          <div class="searchInput">
            <el-input v-model="orgName" @keyup.enter.native="search" placeholder="请输入申报单位"></el-input>
          </div>
        </div>
        <div class="searchBox-wrapper searchBtn">
          <el-button  type="primary" icon="search" @click="search">搜索</el-button>
        </div>
        <div class="operation-wrapper">
          <el-button type="primary" @click="submit(2)"  v-if="showPublishBtn" :disabled="disabledPublishBtn">发布</el-button><!--||isChiefPublished-->
          <el-button type="primary" @click="submit(1)" :disabled="((!hasPermission(2)||tableData.length==0))" v-if="type=='zb'&&!(materialInfo.isForceEnd||materialInfo.isAllTextbookPublished)&&optionsType!='view'">暂存</el-button>
          <el-button type="primary" @click="submit(1)" :disabled="!hasPermission(3)||tableData.length==0" v-if="type=='bw'&&!(materialInfo.isForceEnd||materialInfo.isAllTextbookPublished)&&optionsType!='view'">暂存</el-button>
          <el-button type="warning" @click="reset" :disabled="!hasPermission(2)" v-if="type=='zb'&&!(materialInfo.isForceEnd||materialInfo.isAllTextbookPublished)&&optionsType!='view'">恢复到上次保存结果</el-button>
          <el-button type="warning" @click="reset" :disabled="!hasPermission(3)" v-if="type=='bw'&&!(materialInfo.isForceEnd||materialInfo.isAllTextbookPublished)&&optionsType!='view'">恢复到上次保存结果</el-button>
          <el-button type="primary" @click="dialogVisible = true"> 查看历史记录 </el-button>
        </div>
      </div>

      <div class="table-wrapper">
        <el-table
          ref="multipleTable"
          :data="tableData"
          border
          stripe
          tooltip-effect="dark"
          :row-class-name="setRowClassName"
          style="width: 100%">
          <el-table-column label="姓名">
            <template scope="scope">
              <router-link :to="{name:'专家信息',query: { declarationId: scope.row.declarationId }}" class="table-link">{{scope.row.realname}}</router-link>
            </template>
          </el-table-column>

          <el-table-column label="申报单位" width="100"  prop="reportName"></el-table-column>

          <!--<el-table-column label="工作单位" prop="orgName"></el-table-column>-->
          <el-table-column label="申请职位" width="100" prop="strPresetPosition"></el-table-column>
          <el-table-column label="学校审核" width="100" prop="onlineProgress"></el-table-column>
          <el-table-column label="出版社审核" width="130" prop="offlineProgress"></el-table-column>

          <el-table-column label="是否主编" width="100" align="center" >
            <template scope="scope">
              <el-checkbox
                v-model="scope.row.isZhubian"
                @change="checkboxChange(1,scope.row)"
                :disabled="(scope.row.disabled_zb||!hasPermission(2))||(materialInfo.isForceEnd||materialInfo.isAllTextbookPublished)||optionsType==='view'"
              ></el-checkbox>
            </template>
          </el-table-column>

          <el-table-column label="排序" width="90" align="center">
            <template scope="scope">
              <div class="paddingB15 paddingT10 relative">
                <el-input
                  class="border-radius-4"
                  :class="{'border-red':scope.row.isZhubian&&!scope.row.zhubianSortIsOk}"
                  v-model.trim="scope.row.zhubianSort"
                  :disabled="(scope.row.disabled_zb||!hasPermission(2)||!scope.row.isZhubian)||(materialInfo.isForceEnd||materialInfo.isAllTextbookPublished)||optionsType==='view'"
                  @blur="sortChange(1,scope.row)"
                  @change="sortChange(1,scope.row)"
                  size="mini"
                ></el-input>
                <span class="error fontsize-sm table-input-tips" v-if="scope.row.isZhubian&&!scope.row.zhubianSortIsOk">{{scope.row.zhubianSort?'排序错误':'请输入'}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="是否副主编"
            width="110"
            align="center">
            <template scope="scope">
              <el-checkbox
                v-model="scope.row.isFuzhubian"
                @change="checkboxChange(2,scope.row)"
                :disabled="(scope.row.disabled_zb||!hasPermission(2))||(materialInfo.isForceEnd||materialInfo.isAllTextbookPublished)||optionsType==='view'"
              ></el-checkbox>
            </template>
          </el-table-column>

          <el-table-column label="排序" width="90" align="center">
            <template scope="scope">
              <div class="paddingB15 paddingT10 relative">
                <el-input
                  class="border-radius-4"
                  :class="{'border-red':!scope.row.fuzhubianSortIsOk}"
                  v-model.trim="scope.row.fuzhubianSort"
                  :disabled="(scope.row.disabled_zb||!hasPermission(2)||!scope.row.isFuzhubian)||(materialInfo.isForceEnd||materialInfo.isAllTextbookPublished)||optionsType==='view'"
                  @blur="sortChange(2,scope.row)"
                  @change="sortChange(2,scope.row)"
                  size="mini"
                ></el-input>
                <span class="error fontsize-sm table-input-tips" v-if="scope.row.isFuzhubian&&!scope.row.fuzhubianSortIsOk">{{scope.row.fuzhubianSort?'排序错误':'请输入'}}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="是否编委" width="100" align="center">
            <template scope="scope">
              <el-checkbox
                v-model="scope.row.isBianwei"
                @change="checkboxChange(3,scope.row)"
                :disabled="(scope.row.disabled_bw||!hasPermission(3))||(materialInfo.isForceEnd||materialInfo.isAllTextbookPublished)||optionsType==='view'"
              ></el-checkbox>
            </template>
          </el-table-column>

          <el-table-column label="是否数字编委" width="130" align="center" v-if="IsDigitalEditorOptional">
            <template scope="scope">
              <el-checkbox v-model="scope.row.isDigitalEditor" :disabled="!hasPermission([2,3])||(materialInfo.isForceEnd||materialInfo.isAllTextbookPublished)||optionsType==='view' || type!=='bw'"></el-checkbox>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-dialog
        title="修改记录"
        :visible.sync="dialogVisible">
        <div class="history-box timeLine">
          <ul v-if="historyLog.length>0">
            <li v-for="(iterm,index) in historyLog" :key="index">
              <b></b>
              <p v-for="(item,index) in iterm.detail" :key="index">{{item}}</p>
            </li>
          </ul>
          <p v-else>暂无历史消息</p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props:['materialInfo'],
    data() {
      return {
        type:'zb',
        api_list:'/pmpheep/declaration/list/editor/selection',
        api_submit:'/pmpheep/declaration/editor/selection/update',
        api_log:'/pmpheep/textBookLog/list',
        searchParams:{
          textbookId:'',
          realName:'',
          presetPosition:'',
        },
        formData:{
          materialId:'',
          textbookId:'',
          bookName:'',
        },
        dialogVisible:false,
        tableData:[],
        zhubianSelectSortNumber:[],
        fuzhubianSelectSortNumber:[],
        historyLog:[],
        IsDigitalEditorOptional:false,
        myPower:'00000000',
        optionsType:'edit',
        isChiefPublished:false,
        hasChanged:false,
        realName:'',
        orgName:'',
        iszhubianList:[]
      }
    },
    computed:{
      hasZhubian(){
        var flag = false;
        this.tableData.forEach(iterm=>{
          if(iterm.isZhubian){
            flag=true;
          }
        })
        return flag;
      },
      showPublishBtn(){
        //是否是选择主编的界面
        const is_select_zhubian_view =  this.type=='zb';
        //教材是否结束
        const no_end = !(this.materialInfo.isForceEnd||this.materialInfo.isAllTextbookPublished);
        //是否是遴选操作（分为查看和遴选）
        const is_select_operation = this.optionsType!='view';

        return is_select_zhubian_view && no_end && is_select_operation;
      },
      disabledPublishBtn(){
        //是否有主编
        const hasZhubian =  this.hasZhubian;
        //是否有遴选权限
        const hasPermission = this.hasPermission(2);
        //是否有后选人员
        const select_length = this.tableData.length>0;

        //isChiefPublished 主编副主编是否已经发布
        const isChiefPublished = this.isChiefPublished;

        //用户进来是否有更改
        const hasChanged = this.hasChanged;

        //3、发布后，确认、发布按钮置灰，再次更改人员名单后，发布按钮置为可用

        //return !(hasZhubian&&hasPermission&&select_length) || (isChiefPublished&&!hasChanged);
        //return !(hasPermission) || (isChiefPublished&&!hasChanged);
        return !(hasPermission&&select_length)
        //return !(hasPermission) ;
      },
    },
    created(){
      this.formData.materialId = this.$route.params.materialId;
      this.formData.textbookId = this.$route.query.bookid;
      this.formData.bookName = this.$route.query.bookname;
      this.searchParams.textbookId = this.formData.textbookId;
      this.type = this.$route.query.type;
      this.myPower = this.$route.query.q;
      this.optionsType = this.$route.query.opt;
      this.isChiefPublished = !!this.$route.query.isChiefPublished;
      //如果没有教材id则跳转到通知列表
      if(!this.formData.materialId){
        this.$router.push({name:'通知列表'});
      }
      //如果没有书籍id则跳转到遴选列表页面
      if(!this.formData.materialId){
        this.$router.push({path: '1v3'});
      }

      this.getTableData();

      if(window._hmt){
        _hmt.push(['_trackPageview', '/material-application/press-chief']);
      }
    },
    methods:{
      //获取table数据
      getTableData(){
        this.$axios.get(this.api_list,{params:{
          textbookId:this.formData.textbookId,
          realName:this.realName,
          orgName:this.orgName,
          materialId:this.formData.materialId,
        }})
          .then(response=>{

            var res = response.data;
            this.getHistoryLog();
            if(res.code==1){
              var onlineProgress = ['未提交','待审核','被退回','已审核'];
              var offlineProgress = ['未提交纸质表','未收到纸质表','已收到纸质表'];
              var positionList = ['','主编','副主编','编委'];
              res.data.DecPositionEditorSelectionVO.map(iterm=>{
                iterm.onlineProgress = onlineProgress[iterm.onlineProgress];
                iterm.offlineProgress = offlineProgress[iterm.offlineProgress];

                iterm.isZhubian = (iterm.chosenPosition%8)==4;
                iterm.zhubianSort = iterm.isZhubian?iterm.rank:'';
                iterm.zhubianSortIsOk = true;
                iterm.isFuzhubian = (iterm.chosenPosition%8)==2;
                iterm.fuzhubianSort = iterm.isFuzhubian?iterm.rank:'';
                iterm.fuzhubianSortIsOk = true;
                iterm.isBianwei = (iterm.chosenPosition%8)==1;
                iterm.isDigitalEditor = iterm.chosenPosition>=8;


                iterm.disabled_zb = this.type=='bw'||iterm.isBianwei;
                iterm.disabled_bw = this.type=='zb'||(iterm.isZhubian||iterm.isFuzhubian);

              });
              this.tableData = res.data.DecPositionEditorSelectionVO;
              this.iszhubianList = res.data.isZhuBian;
              /* 排序 */
              for(var k in this.tableData){

              }
              this.IsDigitalEditorOptional = res.data.IsDigitalEditorOptional;
            }
          })
          .catch(e=>{
            this.getHistoryLog();
            console.log(e);
          })
      },
      //获取历史记录
      /**
       * 搜索
       */
      search(){
        this.getTableData();
      },
      /* 获取历史记录 */
      getHistoryLog(){
        this.$axios.get(this.api_log,{params:{
          textbookId:this.formData.textbookId,
          pageNumber:1,
          pageSize:1000
        }})
          .then(response=>{
            var res = response.data;
            if(res.code==1){
              res.data.rows.forEach(iterm=>{
                iterm.detail = iterm.detail.split(';');
              });
              this.historyLog = res.data.rows;
            }
          })
          .catch(e=>{
            console.log(e);
          })
      },
      /**
       * checkbox实现单选功能
       * @param type 类型book-list
       * @param row 数据
       */
      checkboxChange(type,row) {
        this.hasChanged=true;
        let name = row.realname;
        let self = this;
        let title1 = '';
        let title2 = '';
        let is_Zhubian = row.isZhubian;
        let is_Fuzhubian = row.isFuzhubian;
        let n1= 0;
        let n2 =0;
        this.iszhubianList.map(iterm => {
          if(iterm.realname == name &&iterm.iszhubian && (is_Zhubian || is_Fuzhubian)&&this.formData.textbookId != iterm.textbookId ){
            title1 +=  "\""+iterm.textbookName+"\" " ;
            n1++;
          }
          if(iterm.realname == name &&iterm.isfubian && (is_Zhubian || is_Fuzhubian) &&this.formData.textbookId != iterm.textbookId){
            title2 +=  "\""+iterm.textbookName+"\" " ;
            n2++;
          }
        })

        if((n1+n2)>0&&!(type==2&&!row.isFuzhubian)&&!(type==2&&row.isZhubian)&&!(type==1&&row.isFuzhubian)){
          let flag = false;
          let title = name;
          if(n1>0)title+='已被选为'+title1+'的主编，';
          if(n2>0)title+='已被选为'+title2+'的副主编';
          this.$confirm(title, "是否继续",{
            confirmButtonText: "是",
            cancelButtonText: "否",
            type: "warning"
          })
            .then((value)=>{
             flag = true;
              if((type==1&&!row.isZhubian)||(type==2&&!row.isFuzhubian)||(type==3&&!row.isBianwei)){
                row.isZhubian = false;
                row.isFuzhubian = false;
                row.isBianwei = false;
                row.zhubianSort = '';
                row.fuzhubianSort = '';
                row.zhubianSortIsOk = true;
                row.fuzhubianSortIsOk = true;


                return;
              }
              row.chosenPosition = type;
              row.isZhubian = type==1;
              row.isFuzhubian = type==2;
              row.isBianwei = type==3;
              row.zhubianSort = '';
              row.fuzhubianSort = '';
              row.zhubianSortIsOk = true;
              row.fuzhubianSortIsOk = true;
            }).catch(e=>{
            if(!flag){
              if(type==1) row.isZhubian = false ;
              if(type==2)  row.isFuzhubian = false ;

            }
          })

        }else{

          if((type==1&&!row.isZhubian)||(type==2&&!row.isFuzhubian)||(type==3&&!row.isBianwei)){
            row.isZhubian = false;
            row.isFuzhubian = false;
            row.isBianwei = false;
            row.zhubianSort = '';
            row.fuzhubianSort = '';
            row.zhubianSortIsOk = true;
            row.fuzhubianSortIsOk = true;


            return;
          }
          row.chosenPosition = type;
          row.isZhubian = type==1;
          row.isFuzhubian = type==2;
          row.isBianwei = type==3;
          row.zhubianSort = '';
          row.fuzhubianSort = '';
          row.zhubianSortIsOk = true;
          row.fuzhubianSortIsOk = true;
        }


      },
      /**
       * 提交遴选结果
       */
      submit(type){
        let  title = type == 1?"确定保存当前名单?":"确定提交当前名单?";
        if(!this.checkSortIsOk(type)){
          return;
        }

        this.$confirm(title, "提示",{
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(()=>{
            let jsonDecPosition = [];
            for(let i = 0, len = this.tableData.length; i < len; i++){
              this.tableData[i].chosenPosition = (this.tableData[i].isDigitalEditor?8:0)+(this.tableData[i].isZhubian?4:0)+(this.tableData[i].isFuzhubian?2:0)+(this.tableData[i].isBianwei?1:0);
              let tempObj = {
                id:this.tableData[i].id,
                textbookId:this.searchParams.textbookId,
                chosenPosition:this.tableData[i].chosenPosition,
                declarationId:this.tableData[i].declarationId,
                presetPosition:this.tableData[i].presetPosition,
                syllabusId:this.tableData[i].syllabusId,
                syllabusName:this.tableData[i].syllabusName,
                rank:(this.tableData[i].chosenPosition%8)==4?this.tableData[i].zhubianSort:((this.tableData[i].chosenPosition%8)==2?this.tableData[i].fuzhubianSort:'')
              };
              if(this.tableData[i].isZhubian||this.tableData[i].isFuzhubian||this.tableData[i].isBianwei||this.tableData[i].isDigitalEditor){
                jsonDecPosition.push(tempObj);
              }
            }
            console.log(jsonDecPosition);
            //提交
            this.$axios.put(this.api_submit,this.$commonFun.initPostData({
              jsonDecPosition:JSON.stringify(jsonDecPosition),
              selectionType:type?type:1,
              textbookId: this.searchParams.textbookId,
              editorOrEditorialPanel:this.type=='zb'?1:2,
              unselectedHold:this.type=='zb'?0:(jsonDecPosition.length)>0?1:0
              //unselectedHold:(jsonDecPosition.length)>0?1:0
            }))
              .then(response=>{
                var res = response.data;
                if(res.code==1){
                  //if(type===2){
                    this.$router.go(-1);
                  // }else{
                  //   this.getTableData();
                  // }
                  this.$message.success('提交成功！');
                }else{
                  if(type===1&&res.msg.msgTrim()=='遴选职位为空'){
                    this.$router.go(-1);
                  }else{
                    this.$confirm(res.msg.msgTrim(), "提示",{
                    	confirmButtonText: "确定",
                    	cancelButtonText: "取消",
                    	showCancelButton: false,
                    	type: "error"
                    });
                  }

                }
              })
              .catch(e=>{
                console.log(e);
              })

          })
          .catch(e=>{})
      },
      /**
       * 点击重置按钮
       */
      reset(){
        this.$confirm("放弃当前修改，恢复到上次保存的结果？", "提示",{
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(()=>{
            this.hasChanged=false;
            this.getTableData();
          })
          .catch(e=>{})
      },
      /**
       * 当排序码发生变化时检测是否合法
       * @param type 类型 1：主编，2:副主编
       * @param row 表格当前列数据
       */
      sortChange(type,row){
        if(type==1){
          if(row.isZhubian&&!(row.zhubianSort&&this.$commonFun.checkType(row.zhubianSort,'number')&&parseInt(row.zhubianSort)<=255)){
            row.zhubianSortIsOk=false;
          }else{
            row.zhubianSortIsOk=true;
          }
        }


        if(type==2){
          if(row.isFuzhubian&&!(row.fuzhubianSort&&this.$commonFun.checkType(row.fuzhubianSort,'number')&&parseInt(row.fuzhubianSort)<=255)){
            row.fuzhubianSortIsOk=false;
          }else{
            row.fuzhubianSortIsOk=true;
          }
        }
        this.hasChanged=true;
      },
      checkSortIsOk(type){
        var zhubianSortList = [];
        var fuzhubianSortList = [];
        var zhubianData = [];
        var fuzhubianData =[];
        let is_zhubianSort = false;
        let  is_fuzhubianSort = false;
        let zhubianLength = 0;
        let fubianLength = 0;
        this.tableData.forEach(iterm=>{
          if(iterm.isZhubian){
            if(!this.$commonFun.Empty(iterm.zhubianSort))zhubianLength++;
            if(!isNaN(parseInt(iterm.zhubianSort))) zhubianSortList.push(parseInt(iterm.zhubianSort));
            is_zhubianSort = (isNaN(parseInt(iterm.zhubianSort))||(parseInt(iterm.zhubianSort)>255))?true:false;
            zhubianData.push(iterm);
          }
          if(iterm.isFuzhubian){
            if(!this.$commonFun.Empty(iterm.fuzhubianSort))fubianLength++;
            if(!isNaN(parseInt(iterm.fuzhubianSort))) fuzhubianSortList.push(parseInt(iterm.fuzhubianSort));
            is_fuzhubianSort = (isNaN(parseInt(iterm.fuzhubianSort))||(parseInt(iterm.zhubianSort)>255))?true:false;
            fuzhubianData.push(iterm);
          }
        })
        zhubianSortList = zhubianSortList.sort();
        fuzhubianSortList = fuzhubianSortList.sort();

       // let zhubianSortIsOk =zhubianSortList.length==0 || (zhubianSortList[0]==1 && (zhubianSortList[zhubianSortList.length-1] - zhubianSortList[0] == zhubianSortList.length - 1 ? true : false));
       // let fuzhubianSortIsOk = fuzhubianSortList.length==0 || (fuzhubianSortList[0]==1 && (fuzhubianSortList[fuzhubianSortList.length-1] - fuzhubianSortList[0] == fuzhubianSortList.length - 1 ? true : false));

        let sumbit_2 =  type==2 &&zhubianSortList.length==0 &&fuzhubianSortList.length==0?true:false;

        if(is_zhubianSort||is_fuzhubianSort){
         if((is_zhubianSort&&zhubianLength==0)||(is_fuzhubianSort&&fubianLength==0)) {
           this.$confirm((is_zhubianSort&&zhubianLength==0)?'请输入主编排序':'请输入副主编排序', "提示",{
           	confirmButtonText: "确定",
           	cancelButtonText: "取消",
           	showCancelButton: false,
           	type: "error"
           });
         }else{
           this.$confirm((is_zhubianSort?'主编':'副主编')+'排序码必须是不大于255的整数', "提示",{
           	confirmButtonText: "确定",
           	cancelButtonText: "取消",
           	showCancelButton: false,
           	type: "error"
           });
         }

        }else if(sumbit_2){
            this.$confirm("请选择一个"+((zhubianSortList.length==0)?'主编':'副主编')+'发布', "提示",{
            	confirmButtonText: "确定",
            	cancelButtonText: "取消",
            	showCancelButton: false,
            	type: "error"
            });
          }

      //  return (zhubianSortIsOk&&fuzhubianSortIsOk)
        return (!sumbit_2)&&!(is_zhubianSort||is_fuzhubianSort)

      },
      hasPermission(index){
        return this.$commonFun.materialPower(index,this.myPower);
      },
      /**
       * 行的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className。
       * @param row
       * @param index
       */
      setRowClassName(row, index){
        if(row.isZhubian){
          return 'row-zhubian'
        }else if(row.isFuzhubian){
          return 'row-fuzhubian'
        }else if(row.isBianwei){
          return 'row-bianwei'
        }else{
          return ''
        }
      }
    }
  }
</script>

<style>
  .bookTitle{
    margin: 10px 0 0px;
    font-size: 16px;
    height:36px;
    line-height: 36px;
  }
  .history-box{
    min-height: 400px;
  }
  .table-input-tips{
    position: absolute;
    bottom: 7px;
    height: 12px;
    left: 0;
  }
  .row-zhubian,.row-zhubian>td{
    background-color: rgba(76, 175, 80, 0.2) !important;
  }
  .row-fuzhubian ,.row-fuzhubian>td{
    background-color: rgba(76, 175, 80, 0.1) !important;
  }
  .row-bianwei,.row-bianwei>td{
    background-color: rgba(26, 177, 148, 0.06) !important;
  }
</style>
