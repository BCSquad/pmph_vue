
<template>
  <div class="teachingMaterial clic_expert_info" id="clicprintArea">
    <div class="info-wrapper">
      <!--操作按钮-->
      <div class="paddingB10 text-right print-none">
        <el-button type="primary" :disabled="btn_Pass"  v-if="(isDirector||isAdmin||amIAnAuditor)&&!recall" @click="check(3)">
          {{'通过'}}
        </el-button>
        <el-button type="primary" :disabled="btn_notPass"  v-if="(isDirector||isAdmin||amIAnAuditor)&&!recall" @click="check(2)">
          {{'不通过'}}
        </el-button>
        <el-button type="primary" v-if="(isDirector||isAdmin||amIAnAuditor)&&recall" @click="check(0)" >
          {{"撤回"}}
        </el-button>
        <el-button type="danger"  :disabled="btn_back_school" @click="check(4)" v-if="(isDirector||isAdmin||amIAnAuditor)&&(expertInfoData.org_id!=0 )" >
          {{'退回给学校'}}
        </el-button>
        <el-button type="danger"  :disabled="btn_back_person" @click="check(5)" v-if="(isDirector||isAdmin||amIAnAuditor)">
          {{'退回给个人'}}
        </el-button>

        <!--<el-button type="primary"  @click="print" >-->
          <!--{{'打印'}}-->
        <!--</el-button>-->
        <el-button type="primary"  @click="login">
          {{'登录'}}
        </el-button>
        <!--<el-button type="primary"   icon="arrow-left" @click="$router.go(-1)">返回上一步</el-button>-->
      </div>
      <div class="expert-info-box user-info-wrapper">
        <p class="info-box-title">专家信息</p>
        <div>
          <div class="info-iterm-text">
            <div>姓名：<span></span></div>
            <div>{{expertInfoData.realname}}</div>
          </div>
          <div class="info-iterm-text">
            <div>性别：<span></span></div>
            <div>{{expertInfoData.sex}}</div>
          </div>
          <div class="info-iterm-text">
            <div>出生年月：<span></span></div>
            <div>{{expertInfoData.birthday}}</div>
          </div>
          <!--<div class="info-iterm-text">
            <div>教龄(年)：<span></span></div>
            <div>{{expertInfoData.experience}}</div>
          </div>-->
          <div class="info-iterm-text">
            <div>工作单位：<span></span></div>
            <div><span :title="expertInfoData.org_name" class="one_line_limit">{{expertInfoData.org_name}}</span></div>
          </div>
          <div class="info-iterm-text">
            <div>职务：<span></span></div>
            <div><span :title="expertInfoData.position" class="one_line_limit">{{expertInfoData.position}}</span></div>
          </div>
          <div class="info-iterm-text">
            <div> 职称：<span></span></div>
            <div>{{expertInfoData.title}}</div>
          </div>
          <div class="info-iterm-text">
            <div>邮编：<span></span></div>
            <div>{{expertInfoData.postcode}}</div>
          </div>
          <div class="info-iterm-text">
            <div>地址：<span></span></div>
            <div class="lineheight-normal paddingT10"><span :title="expertInfoData.address" class="one_line_limit">{{expertInfoData.address}}</span></div>
          </div>
          <div class="info-iterm-text">
            <div>联系电话：<span></span></div>
            <div>{{expertInfoData.telephone}}</div>
          </div>
          <div class="info-iterm-text">
            <div>传真：<span></span></div>
            <div>{{expertInfoData.fax}}</div>
          </div>
          <div class="info-iterm-text">
            <div>手机：<span></span></div>
            <div>{{expertInfoData.handphone}}</div>
          </div>
          <div class="info-iterm-text">
            <div>Email：<span></span></div>
            <div>{{expertInfoData.email}}</div>
          </div>
          <div class="info-iterm-text">
            <div>证件类型：<span></span></div>
            <div v-if="expertInfoData.idtype==0">身份证</div>
            <div v-if="expertInfoData.idtype==1">护照</div>
            <div v-if="expertInfoData.idtype==2">军官证</div>
          </div>
          <div class="info-iterm-text">
            <div>证件号码：<span></span></div>
            <div>{{expertInfoData.idcard}}</div>
          </div>
          <div class="info-iterm-text" >
            <div>学历：<span></span></div>
            <div>{{degree[expertInfoData.education]}}</div>
          </div>
          <div class="info-iterm-text2" style="width: 99%;">
            <div style="width: 230px;display: inline-block;vertical-align: middle;float: left; text-align: justify; ">专业特长（疾病诊治及研究方向）：<span></span></div>
            <div>{{expertInfoData.expertise}}</div>
          </div>
          <div class="info-iterm-text"  style="width: 33%">
            <div>卡号：<span></span></div>
            <div>{{expertInfoData.banknumber}}</div>
          </div>

          <div class="info-iterm-text">
            <div >开户行：<span></span></div>
            <div>{{expertInfoData.bankaddress}}</div>
          </div>

        </div>
      </div>

      <!--主要学习经历-->
      <div class="expert-info-box" v-if="!$commonFun.Empty(decEduExpList)">
        <p class="info-box-title">主要学习经历</p>
        <div class="no-padding">
          <table class="expert-info-table" border="1">
            <tr>
              <th><div>起止时间</div></th>
              <th><div>学校名称</div></th>
              <th><div>专业</div></th>
              <th><div>学历</div></th>
              <th><div>备注</div></th>
            </tr>
            <tr v-for="(iterm,index) in decEduExpList" :key="index">
              <td style="width: 200px;"><div > {{$commonFun.formatDate(iterm.dateBegin,'yyyy.MM.dd')}} &nbsp;-&nbsp; {{$commonFun.formatDate(iterm.dateEnd,'yyyy.MM.dd')}}</div></td>
              <td><div>{{iterm.schoolName}}</div></td>
              <td><div>{{iterm.major}}</div></td>
              <td><div>{{iterm.degree}}</div></td>
              <td><div>{{iterm.note}}</div></td>
            </tr>
          </table>
        </div>
      </div>
      <!--主要工作经历-->
      <div class="expert-info-box" v-if="!$commonFun.Empty(decWorkExpList)">
        <p class="info-box-title">主要工作经历</p>
        <div class="no-padding">
          <table class="expert-info-table" border="1">
            <tr>
              <th><div>起止时间</div></th>
              <th><div>工作单位</div></th>
              <th><div>职位</div></th>
              <th><div>备注</div></th>
            </tr>
            <tr v-for="(iterm,index) in decWorkExpList">
              <td style="width: 200px"><div  > {{$commonFun.formatDate(iterm.dateBegin,'yyyy.MM.dd')}} &nbsp;-&nbsp; {{$commonFun.formatDate(iterm.dateEnd,'yyyy.MM.dd')}}</div></td>
              <td><div>{{iterm.orgName}}</div></td>
              <td><div>{{iterm.position}}</div></td>
              <td><div>{{iterm.note}}</div></td>
            </tr>
          </table>
        </div>
      </div>
      <!--主要学术兼职-->
      <div class="expert-info-box" v-if="!$commonFun.Empty(decAcadeList)">
        <p class="info-box-title">主要学术兼职</p>
        <div class="no-padding">
          <table class="expert-info-table" border="1">
            <tr>
              <th><div>兼职学术组织</div></th>
              <th><div>级别</div></th>
              <th><div>职务</div></th>
              <th><div>备注</div></th>
            </tr>
            <tr v-for="(iterm,index) in decAcadeList">
              <td ><div>{{iterm.orgName}}</div></td>
              <td><div>{{iterm.rank&&iterm.rank<5?rankList[iterm.rank]:'无'}}</div></td>
              <td><div>{{iterm.position}}</div></td>
              <td><div>{{iterm.note}}</div></td>
            </tr>
          </table>
          <!--<div class="text-center lineheight-24" v-if="!academicExperience.length">暂无数据</div>-->
        </div>
      </div>


      <!--  &lt;!&ndash;主要工作经历&ndash;&gt;
        <div class="expert-info-box" v-if="!$commonFun.Empty(decWorkExpList)">
          <p class="info-box-title">主要工作经历</p>
          <div class="no-padding">
            <table class="expert-info-table" border="1">
              <tr>
                <th><div>起止时间</div></th>
                <th><div>工作单位</div></th>
                <th><div>职位</div></th>
                <th><div>备注</div></th>
              </tr>
              <tr v-for="(iterm,index) in decWorkExpList">
                <td><div> {{$commonFun.formatDate(iterm.dateBegin,'yyyy.MM.dd')}} &nbsp;-&nbsp; {{$commonFun.formatDate(iterm.dateEnd,'yyyy.MM.dd')}}</div></td>
                <td><div>{{iterm.orgName}}</div></td>
                <td><div>{{iterm.position}}</div></td>
                <td><div>{{iterm.note}}</div></td>
              </tr>
            </table>
          </div>
        </div>-->

      <!--主编国家级规划教材情况-->
      <!--<div class="expert-info-box" v-if="!$commonFun.Empty(decNationalPlanList)">
        <p class="info-box-title">主编国家级规划教材情况</p>
        <div class="no-padding">
          <table class="expert-info-table" border="1">
            <tr>
              <th><div>规划教材名</div></th>
              <th><div>标准书号</div></th>
              <th><div>教材级别</div></th>
              <th><div>备注</div></th>
            </tr>
            <tr v-for="(iterm,index) in decNationalPlanList">
              <td><div>{{iterm.materialName}}</div></td>
              <td><div>{{iterm.isbn}}</div></td>
              &lt;!&ndash;  <td><div>{{iterm.rank&&iterm.rank<4?national_plan_rankList[iterm.rank]:'无'}}</div></td> &ndash;&gt;
              <td><div>{{iterm.rankText}}</div></td>
              <td><div>{{iterm.note}}</div></td>
            </tr>
          </table>
          &lt;!&ndash;<div class="text-center lineheight-24" v-if="!nationalPlan.length">暂无数据</div>&ndash;&gt;
        </div>
      </div>-->

      <!--人卫社教材编写情况-->
      <div class="expert-info-box" v-if="!$commonFun.Empty(decTextbookPmphList)">
        <p class="info-box-title">人卫社教材编写情况</p>
        <div class="no-padding">
          <table class="expert-info-table" border="1">
            <tr>
              <th><div>教材名称</div></th>
              <th style="min-width: 70px;"><div>级别</div></th>
              <th style="min-width: 100px;"><div>编写职务</div></th>
              <th style="min-width: 100px;"><div>数字编委</div></th>
              <th style="min-width: 110px;"><div>出版时间</div></th>
              <th><div>标准书号</div></th>
              <th><div>备注</div></th>
            </tr>
            <tr v-for="(iterm,index) in decTextbookPmphList">
              <td style="max-width: 300px;"><div>{{iterm.materialName}}</div></td>
              <td><div> {{iterm.rank?materialLevel[iterm.rank]:'无'}}</div></td>
              <td><div>{{iterm.position&&iterm.position<4?positionList[iterm.position]:'无'}}</div></td>
              <td style="text-align: center;"><div>{{iterm.isDigitalEditor?'是':'否'}}</div></td>
              <td><div>{{$commonFun.formatDate(iterm.publishDate,'yyyy.MM.dd').substring(0,10)}}</div></td>
              <td><div>{{iterm.isbn}}</div></td>
              <td><div>{{iterm.note}}</div></td>
            </tr>
          </table>
          <!--<div class="text-center lineheight-24" v-if="!textbook.length">暂无数据</div>-->
        </div>
      </div>


      <!--主编学术专著情况表-->
      <div class="expert-info-box" v-if="!$commonFun.Empty(decMonographList)">
        <p class="info-box-title"> 图书出版情况</p>
        <div class="no-padding">
          <table class="expert-info-table" border="1">
            <tr>
              <th><div>专著名称</div></th>
              <th><div>专著发表日期</div></th>
              <th><div>出版方式</div></th>
              <th><div>出版单位</div></th>
              <th><div>出版时间</div></th>
              <th><div>备注</div></th>
            </tr>
            <tr v-for="(iterm,index) in decMonographList">
              <td><div>{{iterm.monographName}}</div></td>
              <td><div>{{$commonFun.formatDate(iterm.monographDate,'yyyy.MM.dd').substring(0,10)}}</div></td>
              <td><div>{{iterm.isSelfPaid?'自费':'公费'}}</div></td>
              <td><div>{{iterm.publisher}}</div></td>
              <td><div>{{$commonFun.formatDate(iterm.publishDate,'yyyy.MM.dd')}}</div></td>
              <td><div>{{iterm.note}}</div></td>
            </tr>
          </table>
          <!--<div class="text-center lineheight-24" v-if="!monograph.length">暂无数据</div>-->
        </div>
      </div>

      <!--主编或参编图书情况-->
      <div class="expert-info-box" v-if="!$commonFun.Empty(decEditorBookList)">
        <p class="info-box-title">主编或参编图书情况</p>
        <div class="no-padding">
          <table class="expert-info-table" border="1">
            <tr>
              <th><div>图书名称</div></th>
              <th><div>出版单位</div></th>
              <th><div>出版时间</div></th>
              <th><div>备注</div></th>
            </tr>
            <tr v-for="(iterm,index) in decEditorBookList">
              <td><div>{{iterm.materialName}}</div></td>
              <td><div>{{iterm.publisher}}</div></td>
              <td><div>{{$commonFun.formatDate(iterm.publishDate,'yyyy.MM.dd')}}</div></td>
              <td><div>{{iterm.note}}</div></td>
            </tr>
          </table>
        </div>
      </div>

      <!--文章发表情况-->
      <div class="expert-info-box" v-if="!$commonFun.Empty(decArticlePublishedList)">
        <p class="info-box-title">文章发表情况</p>
        <div class="no-padding">
          <table class="expert-info-table" border="1">
            <tr>
              <th><div>题目</div></th>
              <th><div>期刊名称</div></th>
              <th><div>期刊级别（SCI或国内核心期刊）</div></th>
              <th><div>备注</div></th>
            </tr>
            <tr v-for="(iterm,index) in decArticlePublishedList">
              <td><div>{{iterm.title}}</div></td>
              <td><div>{{iterm.periodicalTitle}}</div></td>
              <td><div>{{iterm.periodicalLevel}}</div></td>
              <td><div>{{iterm.note}}</div></td>
            </tr>
          </table>
        </div>
      </div>

      <!-- 本专业获奖情况-->
      <div class="expert-info-box" v-if="!$commonFun.Empty(decProfessionAwardList)">
        <p class="info-box-title">本专业获奖情况</p>
        <div class="no-padding">
          <table class="expert-info-table" border="1">
            <tr>
              <th><div>题目</div></th>
              <th><div>级别</div></th>
              <th><div>备注</div></th>
            </tr>
            <tr v-for="(iterm,index) in decProfessionAwardList">
              <td><div>{{iterm.title}}</div></td>
              <td><div>{{rankList2[iterm.rank?iterm.rank:0]}}</div></td>
              <td><div>{{iterm.note}}</div></td>
            </tr>
          </table>
        </div>
      </div>

      <div v-if="decExtensionList.length">
        <!--扩展项-->
        <div class="expert-info-box" v-for="(iterm,index) in decExtensionList">
          <p class="info-box-title">{{iterm.extension_name?iterm.extension_name:'更多信息'}}</p>
          <div>
            <p class="achievements">
              {{iterm.content}}
            </p>
          </div>
        </div>
      </div>


      <!--学科分类-->
      <div class="expert-info-box" v-if="!$commonFun.Empty(productSubjectTypeList)">
        <p class="info-box-title">学科分类</p>
        <div class="no-padding">
          <table class="expert-info-table" border="1">
            <p v-for="(iterm,index) in productSubjectTypeList" :key="index" style="padding: 5px;"><i class="fa fa-tags"></i>  {{iterm.type_name}}</p>
          </table>
          <!--<div class="text-center lineheight-24" v-if="!monograph.length">暂无数据</div>-->
        </div>
      </div>

      <!--内容分类-->
      <div class="expert-info-box" v-if="!$commonFun.Empty(productContentTypeList)">
        <p class="info-box-title">内容分类</p>
        <div class="no-padding">
          <table class="expert-info-table" border="1">
            <p v-for="(iterm,index) in productContentTypeList" :key="index" style="padding: 5px;"><i class="fa fa-bullseye"></i>{{iterm.type_name}}</p>
          </table>
          <!--<div class="text-center lineheight-24" v-if="!monograph.length">暂无数据</div>-->
        </div>
      </div>

      <!--申报专业-->
      <div class="expert-info-box" v-if="!$commonFun.Empty(productProfessionTypeList)">
        <p class="info-box-title">申报专业</p>
        <div class="no-padding">
          <table class="expert-info-table" border="1">
            <p v-for="(iterm,index) in productProfessionTypeList" :key="index" style="padding: 5px;"><i class="fa fa-bullseye"></i>{{iterm.typeName}}</p>
          </table>
          <!--<div class="text-center lineheight-24" v-if="!monograph.length">暂无数据</div>-->
        </div>
      </div>

      <!--备注-->
      <div class="expert-info-box" v-if="!$commonFun.Empty(expertInfoData.remark)">
        <p class="info-box-title">备注</p>
        <div class="no-padding">
          <table class="expert-info-table" border="1" style="padding: 20px 10px;" >
            <p style="padding: 10px;" >{{expertInfoData.remark}}</p>
          </table>
          <!--<div class="text-center lineheight-24" v-if="!monograph.length">暂无数据</div>-->
        </div>
      </div>

      <!--所在单位意见-->
      <div class="expert-info-box" v-if="!$commonFun.Empty(expertInfoData.unit_advise_online)">
        <p class="info-box-title">所在单位意见</p>
        <div class="no-padding">
          <table class="expert-info-table" border="1" style="padding: 20px 10px;" >
            <p style="padding: 10px;" >{{expertInfoData.unit_advise_online}}</p>
          </table>
          <!--<div class="text-center lineheight-24" v-if="!monograph.length">暂无数据</div>-->
        </div>
      </div>
      <div class="expert-info-box" v-if="!$commonFun.Empty(expertInfoData.unit_advise)">
        <p class="info-box-title">上传扫描附件</p>
        <div style="padding: 20px 10px;">
          <table class="expert-info-table" border="1" >
            <a href="javascript:void(0)" @click="downloadImage(expertInfoData.unit_advise)" style="margin-top:10px;color: #70BBC2;cursor: pointer;text-decoration: underline;" >{{expertInfoData.syllabus_name}}</a>
          </table>
          <!--<div class="text-center lineheight-24" v-if="!monograph.length">暂无数据</div>-->
        </div>
      </div>

      <!--申报单位-->
      <div class="expert-info-box" >
        <p class="info-box-title">申报单位</p>
        <div class="no-padding">
          <table class="expert-info-table" border="1">
            <p style="padding: 20px 10px;"><strong>申报单位:  </strong>{{expertInfoData.declare_name}}</p>
          </table>
          <!--<div class="text-center lineheight-24" v-if="!monograph.length">暂无数据</div>-->
        </div>
      </div>


    </div>
  </div>
</template>
<script type="text/javascript">
  import bus from 'common/eventBus/bus.js'
  export default{
    props:["expertInfoId"],
    data(){
      return{
        api_info:'/pmpheep/expertation/get',
        api_online_check:'/pmpheep/expertation/onlineProgress',
        materialLevel:['无','国家','省部','协编','校本','其他','教育部规划','卫计委规划','区域规划','创新教材'],
        degree:['专科','本科','硕士','博士后','博士'],
        positionList:['无','主编','副主编','编委'],
        rankList:['无','国际','国家','省部','市级'],
        rankList2:['无','国家','省部','市级'],
        loginId:'',
        expertInfoData:{
          org_id:'',
          userId:'',
          username:'',
          realname:'',
          org_name:'',
          sex:'男',
          birthday:'',
          orgName:'',
          position:'',
          title:'',
          address:'',
          postcode:'',
          handphone:'',
          email:'',
          telephone:'',
          idcard:'',
          experience:'',
          online_progress:'',
          degree:0,
          education:0,
          idtype:0,
          banknumber:'',
          bankaddress:'',
          declare_name:'',
          expertise:'',
          unit_advise_online:''
        },
        btn_Pass:false,
        btn_notPass:false,
        btn_back_person:false,
        btn_back_school:false,
        btn_back:false,
        amIAnAuditor:false,
        isDirector:false,
        recall:false,
        isAdmin:'',
        decEduExpList:[],
        decWorkExpList: [],
        productSubjectTypeList:[],
        productContentTypeList:[],
        productProfessionTypeList:[],
        productSubjectTypeStr:"",
        productContentTypeStr:"",
        decNationalPlanList:[],
        decTextbookPmphList:[],
        decMonographList:[],
        decEditorBookList:[],
        decExtensionList:[],
        decAcadeList:[],
        decArticlePublishedList:[],
        decProfessionAwardList:[],


      }
    },
    watch:{
      /*expertInfoId(val, oldVal){//普通的watch监听
        console.log("expertInfoInfo: "+val, oldVal);
         // this.getExpertInfoData();
        alert(2222);
      },*/
    },
    computed:{
    },

    methods:{

      /**
       *审核
       */
      check(progress) {
        var title='';
        if(progress==3||progress==2) {
          title = "是否确认"+(progress==3?'':'不')+"通过?"
          this.$confirm(title, "提示",{
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            let param = {
              id:this.expertInfoId,
              onlineProgress:progress,
              returnCause:""
            };
            this.onlineCheckPass(param,progress);
          })
        }else if(progress==0){
          this.$axios.get('/pmpheep/expertation/changeStatus',{params:{status:progress,id:this.expertInfoId}
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
        }else {

          //  title = "是否确认退回?"
          this.$prompt('请输入退回原因', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(({ value }) => {
            //debugger;
            if(!this.$commonFun.Empty(value)&&value.length<=40){
              let param = {
                id:this.expertInfoId,
                onlineProgress:progress,
                returnCause:value
              };
              this.onlineCheckPass(param,progress);
            }else if(this.$commonFun.Empty(value)){
              this.$message.warning('退回原因不能为空');
            }else{
              this.$message.warning('不能超过40个字');
            }

          })

        }
      },
      /**
       * 点击审核通过
       */
      onlineCheckPass(params,type){
        this.$axios.get(this.api_online_check,{params:params})
          .then(response=>{
            var res = response.data;
            if(res.code==1){
             // this.$set(this.expertInfoData,"online_progress",type);
              this.$message.success('操作成功');
              this.getTableData();
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
            this.$confirm('请求失败，请重试！', "提示",{
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              showCancelButton: false,
              type: "error"
            });
          })
      },
      downloadImage(url){
        this.$commonFun.downloadFile('/pmpheep/file/download/'+url);
      },
      /**
       * 获取专家信息数据
       */
      getTableData(){
        //this.expertInfoId = val;
        this.$axios.get(this.api_info,{params:{
            id:this.expertInfoId
          }})
          .then(response=>{
            var res = response.data;
            if(res.code==1){
              //初始化专家身份信息
             // debugger;
              res.data.sex=res.data.sex=='2'?'女':'男';
              res.data.birthday = res.data.birthday;
              //this.amIAnAuditor = res.data.amIAnAuditor?true:false;
              if(!this.$commonFun.Empty(res.data)){
                let audit =  this.$commonFun.Empty(res.data.auditorArray)?[]:res.data.auditorArray.split(",");
                audit.forEach(iterm=>{
                  if(parseInt(iterm) == this.loginId){
                    this.amIAnAuditor = true;  //我是产品的审核人
                  }
                })
                let directorArray = this.$commonFun.Empty(res.data.director)?[]:res.data.director.split(",");
                directorArray.forEach(iterm=>{
                  if(parseInt(iterm) == this.loginId){
                    this.isDirector = true;  //我是产品审核人的主任
                  }
                })
              }
              // 获取当前专家账号
              this.username = res.data.username;
              for(var i in res.data){
                if(i != "productSubjectTypeStr"&& i!="productSubjectTypeStr" && typeof i !="object"){
                  this.expertInfoData[i] = res.data[i]||"";
                }
              }
              this.expertInfoData.degree = res.data.degree;
              this.expertInfoData.idtype = res.data.idtype;


              //初始化主要学习经历
              this.decEduExpList = res.data.decEduExpList||[];

              //初始化主要工作经历
              this.decWorkExpList = res.data.decWorkExpList||[];

              // 学科分类
              this.productSubjectTypeList = res.data.productSubjectTypeList||[];

              // 内容分类
              this.productContentTypeList = res.data.productContentTypeList||[];

              //申报专业
              this.productProfessionTypeList = res.data.productProfessionTypeList||[];

              //
              this.productSubjectTypeStr = res.data.productSubjectTypeStr||"";

              //
              this.productContentTypeStr = res.data.productContentTypeStr||"";

              //
              this.decNationalPlanList = res.data.decNationalPlanList||[];

              //
              this.decTextbookPmphList = res.data.decTextbookPmphList||[];

              //
              this.decMonographList = res.data.decMonographList||[];

              //
              this.decAcadeList = res.data.decAcadeList||[];

              // 扩展项
              this.decExtensionList = res.data.decExtensionList||[];

              // 编或参编图书情况
              this.decEditorBookList = res.data.decEditorBookList||[];

              // 文章发表情况
              this.decArticlePublishedList = res.data.decArticlePublishedList||[];
              // 本专业获奖情况
              this.decProfessionAwardList = res.data.decProfessionAwardList||[];

              //this.onlineProgressBtn_Pass(res.data.online_progress);
              this.btn_Pass =!(res.data.finalResult == 0 && res.data.pmphAudit==0 && (res.data.online_progress == 1 || res.data.online_progress == 3) )
              this.btn_notPass =!(res.data.finalResult == 0 && res.data.pmphAudit==0 && (res.data.online_progress == 1 || res.data.online_progress == 3) )
              this.btn_back_person = !(res.data.finalResult == 0 && res.data.pmphAudit ==0 && ( res.data.online_progress == 1  ||res.data.online_progress==3 || res.data.online_progress==4))
              this.btn_back_school = !(res.data.finalResult == 0 && res.data.pmphAudit ==0  && (res.data.online_progress==3)) /*res.data.online_progress == 1 ||*/
              //this.onlineProgressBtn_Back(res.data.online_progress);
              this.recall = (res.data.finalResult == 0  && res.data.pmphAudit!=0);

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
      onlineProgressBtn_Pass(progress){
       let L = [0,2,3,4,5].includes(progress);
       this.btn_Pass = L;
        //return !l;
      },
      onlineProgressBtn_Back(progress){
        let L = [0,2,5].includes(progress);
        this.btn_back = L;
        //return !l;
      },
      /**
       * 打印
       */
      print(){
//          console.log(this.materialInfo);
        document.title = '申报详情';


        window.print();

        return false;
      },
      // 登录
      login(){
//          console.log(userName);
        this.$axios.get('pmpheep/pmph/keyToLand',{
          params:{
            userName: this.username,
            userType: 1
          }
        }).then(response => {
          let res = response.data;
          if (res.code == 1) {
//          window.location.href = res.data;
            window.open(res.data);
          } else {
            this.$confirm(res.msg.msgTrim(), "提示",{
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              showCancelButton: false,
              type: "error"
            });
          }
        }).catch(error => {
          this.$confirm('登录失败，请稍后再试!', "提示",{
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            showCancelButton: false,
            type: "error"
          });
        })
      }
    },
    created(){
      console.log(this.expertInfoId);
      this.getTableData();
      //alert(this.expertInfoId)
      this.isAdmin = this.$getUserData().userInfo.isAdmin;
      this.loginId = this.$getUserData().userInfo.id;

    },

    beforeDestroy(){


    },
  }
</script>
<style scoped>
  .yxyj{
    display:none;
  }
  @media print{
    .yxyj{
      border:1px solid #5b6877;padding:5px;display: block;
    }}
</style>
<style scoped>



  .info-wrapper{
    /*width: 1100px;*/
    padding-bottom: 20px;
  }
  .expert-info-box{

  }
  .expert-info-box .info-box-title{
    display: inline-block;
    padding: 0 20px;
    background: #1A806B;
    color:#fff;
  }
  .expert-info-box .info-box-title.operation{
    background: #de8333;
  }
  .expert-info-box>div{
    border:1px solid #f1f1f1;
    padding: 20px 15px;
    margin-bottom: 28px;
  }
  .expert-info-box>div.no-padding{
    padding: 0 !important;
  }

  /*专家信息*/
  .info-iterm-text{
    display: inline-block;
    height: 36px;
    width: 33%;
    max-width: 410px;
    line-height: 36px;
    vertical-align: middle;
  }
  .info-iterm-text2{
    display: inline-block;
    height: 36px;
    width: 33%;
    /*max-width: 410px;*/
    line-height: 36px;
    vertical-align: middle;
  }
  .info-iterm-text.lg{
    width: 100%;
    max-width: 1200px;
  }
  .user-info-wrapper .info-iterm-text{
    padding-bottom: 8px;
  }
  .user-info-wrapper .info-iterm-text .one_line_limit{
    white-space: nowrap;
    width:100%;
    text-overflow:ellipsis;
    overflow: hidden;
    display: inline-block;
  }
  .info-iterm-text>div:nth-of-type(1){
    display: inline-block;
    vertical-align: middle;
    width: 80px;
    float: left;
    text-align: justify;
  }
  .info-iterm-text>div:nth-of-type(1) > span { display: inline-block /* Opera */; padding-left: 100%; }
  .info-iterm-text>div:nth-of-type(2){
    margin-left: 88px;
    padding-right: 10px;
  }

  .info-iterm-text.lg-label>div:nth-of-type(1){
    width: 120px;
  }

  .info-iterm-text.lg-label>div:nth-of-type(2){
    margin-left: 120px;
  }
  .info-iterm-text.xl-label>div:nth-of-type(1){
    width: 200px;
  }

  .info-iterm-text.xl-label>div:nth-of-type(2){
    margin-left: 200px;
  }
  .expert_info-buttonWrapper{
    margin-top: 30px;
  }
  .searchBox-wrapper{
    padding: 0;
  }
  .chooseBook{
    margin-bottom: 10px;
  }
  .chooseBook .searchBox-wrapper{
    width: auto;
  }
  .widthAuto{
    width: auto;
  }

  .expert-operation-wrapper .info-iterm-text{
    width: 24%;
    max-width: 270px;
  }

  .info-iterm-text a{
    color:#337ab7;
  }
  .info-iterm-text a:hover{
    color: #23527c;
  }
  .el-textarea{
    margin-bottom: 10px;
  }
  .tip-text {
    color: #ccc;
    text-align: right;

  }

  .info-wrapper table{
    width: 100%;
    text-align: left;
    border-color: rgb(223, 229, 236);
    border: none;
  }
  .info-wrapper table tr:nth-of-type(2n+1){
    background: #fafafa;
  }
  .info-wrapper table tr th{
    background-color: #d4d9dd;
    color: #5b6877;
    height: 40px;
  }
  .info-wrapper table tr td{
    height: 40px;
  }
  .info-wrapper table tr th>div,.info-wrapper table tr td>div{
    box-sizing: border-box;
    overflow: hidden;
    white-space: normal;
    word-break: break-all;
    line-height: 24px;
    padding-left: 18px;
    padding-right: 18px;
    text-overflow: ellipsis;
    position: relative;
    word-wrap: normal;
    display: inline-block;
    vertical-align: middle;
    width: 100%;
  }
  .achievements{
    min-height: 60px;
  }
  .school-device{
    padding: 160px 0 0;
  }

  .choosenWarning {
    line-height: 24px;
    word-break: break-all;
  }

</style>
