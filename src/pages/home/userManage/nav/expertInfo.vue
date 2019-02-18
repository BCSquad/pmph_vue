<template>
  <div class="teachingMaterial expert_info">
    <div class="info-wrapper">

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
          <div class="info-iterm-text">
            <div>教龄(年)：<span></span></div>
            <div>{{expertInfoData.experience}}</div>
          </div>
          <div class="info-iterm-text">
            <div>工作单位：<span></span></div>
            <div><span :title="expertInfoData.workplace" class="one_line_limit">{{expertInfoData.workplace}}</span></div>
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
          <!--<div class="info-iterm-text">
            <div>证件类型：<span></span></div>
            <div v-if="expertInfoData.idtype==0">身份证</div>
            <div v-if="expertInfoData.idtype==1">护照</div>
            <div v-if="expertInfoData.idtype==2">军官证</div>
          </div>-->
          <div class="info-iterm-text">
            <div>证件号码：<span></span></div>
            <div>{{expertInfoData.idcard}}</div>
          </div>
          <!--<div class="info-iterm-text">
            <div>学历：<span></span></div>
            <div>{{degree[expertInfoData.degree]}}</div>
          </div>-->
          <!--<div class="info-iterm-text lg-label">
            <div>是否服从调剂：<span></span></div>
            <div>{{expertInfoData.isDispensed?'是':'否'}}</div>
          </div>
          <div class="info-iterm-text xl-label">
            <div>是否参与本科教学评估认证：<span></span></div>
            <div>{{expertInfoData.isUtec?'是':'否'}}</div>
          </div>-->
          <!--<div class="info-iterm-text lg">
            <div>专业特长：<span></span></div>
            <div>{{expertInfoData.expertise}}</div>
          </div>-->
        </div>
      </div>

      <!--主要学习经历-->
      <div class="expert-info-box">
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
            <tr v-for="(iterm,index) in learnExperience" :key="index">
              <td><div> {{iterm.date_begin}} &nbsp;-&nbsp; {{iterm.date_end}}</div></td>
              <td><div>{{iterm.school_name}}</div></td>
              <td><div>{{iterm.major}}</div></td>
              <td><div>{{iterm.degree}}</div></td>
              <td><div>{{iterm.note}}</div></td>
            </tr>
          </table>
          <div class="text-center lineheight-24" v-if="!learnExperience||!learnExperience.length">暂无数据</div>
        </div>
      </div>




      <!--主要工作经历-->
      <div class="expert-info-box">
        <p class="info-box-title">主要工作经历</p>
        <div class="no-padding">
          <table class="expert-info-table" border="1">
            <tr>
              <th><div>起止时间</div></th>
              <th><div>工作单位</div></th>
              <th><div>职位</div></th>
              <th><div>备注</div></th>
            </tr>
            <tr v-for="(iterm,index) in workExperience">
              <td><div> {{iterm.date_begin}} &nbsp;-&nbsp; {{iterm.date_end}}</div></td>
              <td><div>{{iterm.org_name}}</div></td>
              <td><div>{{iterm.position}}</div></td>
              <td><div>{{iterm.note}}</div></td>
            </tr>
          </table>
          <div class="text-center lineheight-24" v-if="!workExperience||!workExperience.length">暂无数据</div>
        </div>
      </div>

      <!--主要教学经历-->
      <div class="expert-info-box">
        <p class="info-box-title">主要教学经历</p>
        <div class="no-padding">
          <table class="expert-info-table" border="1">
            <tr>
              <th><div>起止时间</div></th>
              <th><div>学校名称</div></th>
              <th><div>教学科目</div></th>
              <th><div>备注</div></th>
            </tr>
            <tr v-for="(iterm,index) in teachExperience">
              <td><div> {{iterm.date_begin}} &nbsp;-&nbsp; {{iterm.date_end}}</div></td>
              <td><div>{{iterm.school_name}}</div></td>
              <td><div>{{iterm.subject}}</div></td>
              <td><div>{{iterm.note}}</div></td>
            </tr>
          </table>
          <div class="text-center lineheight-24" v-if="!teachExperience||!teachExperience.length">暂无数据</div>
        </div>
      </div>


      <!--个人成就-->
      <div class="expert-info-box">
        <p class="info-box-title">个人成就</p>
        <div>
          <p class="achievements">
            {{personalAchievements}}
          </p>
        </div>
      </div>

      <!--主要学术兼职-->
      <div class="expert-info-box">
        <p class="info-box-title">主要学术兼职</p>
        <div class="no-padding">
          <table class="expert-info-table" border="1">
            <tr>
              <th><div>兼职学术组织</div></th>
              <th><div>级别</div></th>
              <th><div>职务</div></th>
              <th><div>备注</div></th>
            </tr>
            <tr v-for="(iterm,index) in academicExperience">
              <td><div>{{iterm.org_name}}</div></td>
              <td><div>{{iterm.rank&&iterm.rank<5?rankList[iterm.rank]:'无'}}</div></td>
              <td><div>{{iterm.position}}</div></td>
              <td><div>{{iterm.note}}</div></td>
            </tr>
          </table>
          <div class="text-center lineheight-24" v-if="!academicExperience||!academicExperience.length">暂无数据</div>
        </div>
      </div>

      <!--上版教材参编情况（未参编请在教材名称栏填无)(必填)-->
      <div class="expert-info-box">
        <p class="info-box-title">本套上版教材参编情况</p>
        <div class="no-padding">
          <table class="expert-info-table" border="1">
            <tr>
              <th><div>教材名称</div></th>
              <th><div>职务</div></th>
              <th><div>数字编委</div></th>
              <th><div>出版单位</div></th>
              <th><div>出版时间</div></th>
              <th><div>备注</div></th>
            </tr>
            <tr v-for="(iterm,index) in lastPositionList">
              <td><div>{{iterm.material_name}}</div></td>
              <td><div>{{iterm.position&&iterm.position<4?positionList[iterm.position]:'无'}}</div></td>
              <td><div>{{iterm.isDigitalEditor?'是':'否'}}</div></td>
              <td><div>{{iterm.publisher}}</div></td>
              <td><div>{{$commonFun.formatDate(iterm.publishDate,'yyyy.MM.dd').substring(0,10)}}</div></td>
              <td><div>{{iterm.note}}</div></td>
            </tr>
          </table>
          <div class="text-center lineheight-24" v-if="!lastPositionList||!lastPositionList.length">暂无数据</div>
        </div>
      </div>

      <!--精品课程建设情况-->
      <div class="expert-info-box">
        <p class="info-box-title">精品课程建设情况</p>
        <div class="no-padding">
          <table class="expert-info-table" border="1">
            <tr>
              <th><div>课程名称</div></th>
              <th><div>该课程全年课时数</div></th>
              <th><div>级别</div></th>
              <th><div>备注</div></th>
            </tr>
            <tr v-for="(iterm,index) in decCourseConstruction">
              <td><div>{{iterm.course_name}}</div></td>
              <td><div>{{iterm.class_hour}}</div></td>
              <td><div>{{courseConstructionList[iterm.type]||'无'}}</div></td>
              <td><div>{{iterm.note}}</div></td>
            </tr>
          </table>
          <div class="text-center lineheight-24" v-if="!decCourseConstruction||!decCourseConstruction.length">暂无数据</div>
        </div>
      </div>


      <!--主编国家级规划教材情况-->
      <div class="expert-info-box">
        <p class="info-box-title">主编国家级规划教材情况</p>
        <div class="no-padding">
          <table class="expert-info-table" border="1">
            <tr>
              <th><div>规划教材名</div></th>
              <th><div>标准书号</div></th>
              <th><div>教材级别</div></th>
              <th><div>备注</div></th>
            </tr>
            <tr v-for="(iterm,index) in nationalPlan">
              <td><div>{{iterm.material_name}}</div></td>
              <td><div>{{iterm.isbn}}</div></td>
             <!--  <td><div>{{iterm.rank&&iterm.rank<4?national_plan_rankList[iterm.rank]:'无'}}</div></td> -->
              <td><div>{{iterm.rank_text}}</div></td>
              <td><div>{{iterm.note}}</div></td>
            </tr>
          </table>
          <div class="text-center lineheight-24" v-if="!nationalPlan||!nationalPlan.length">暂无数据</div>
        </div>
      </div>


      <!--人卫社教材编写情况-->
      <div class="expert-info-box">
        <p class="info-box-title">人卫社教材编写情况</p>
        <div class="no-padding">
          <table class="expert-info-table" border="1">
            <tr>
              <th><div>教材名称</div></th>
              <th><div>级别</div></th>
              <th><div>编写职务</div></th>
              <th><div>数字编委</div></th>
              <th><div>出版时间</div></th>
              <th><div>标准书号</div></th>
              <th><div>备注</div></th>
            </tr>
            <tr v-for="(iterm,index) in decTextbookPmphList">
              <td><div>{{iterm.material_name}}</div></td>
              <td><div> {{iterm.rank?materialLevel[iterm.rank]:'无'}}</div></td>
              <td><div>{{iterm.position&&iterm.position<4?positionList[iterm.position]:'无'}}</div></td>
              <td><div>{{iterm.isDigitalEditor?'是':'否'}}</div></td>
              <td><div>{{$commonFun.formatDate(iterm.publish_date,'yyyy.MM.dd').substring(0,10)}}</div></td>
              <td><div>{{iterm.isbn}}</div></td>
              <td><div>{{iterm.note}}</div></td>
            </tr>
          </table>
          <div class="text-center lineheight-24" v-if="!decTextbookPmphList||!decTextbookPmphList.length">暂无数据</div>
        </div>
      </div>


      <!--其他社教材编写情况-->
      <div class="expert-info-box">
        <p class="info-box-title">其他社教材编写情况</p>
        <div class="no-padding">
          <table class="expert-info-table" border="1">
            <tr>
              <th><div>教材名称</div></th>
              <th><div>级别</div></th>
              <th><div>编写职务</div></th>
              <th><div>出版社</div></th>
              <th><div>数字编委</div></th>
              <th><div>出版时间</div></th>
              <th><div>标准书号</div></th>
              <th><div>备注</div></th>
            </tr>
            <tr v-for="(iterm,index) in decTextbookList">
              <td><div>{{iterm.material_name}}</div></td>
              <td><div> {{iterm.rank?materialLevel[iterm.rank]:'无'}}</div></td>
              <td><div>{{iterm.position&&iterm.position<4?positionList[iterm.position]:'无'}}</div></td>
              <td><div>{{iterm.publisher}}</div></td>
              <td><div>{{iterm.isDigitalEditor?'是':'否'}}</div></td>
              <td><div>{{$commonFun.formatDate(iterm.publish_date,'yyyy.MM.dd').substring(0,10)}}</div></td>
              <td><div>{{iterm.isbn}}</div></td>
              <td><div>{{iterm.note}}</div></td>
            </tr>
          </table>
          <div class="text-center lineheight-24" v-if="!decTextbookList||!decTextbookList.length">暂无数据</div>
        </div>
      </div>


      <!--参加人卫慕课、数字教材编写情况-->
      <!--<div class="expert-info-box">
        <p class="info-box-title">参加人卫慕课、数字教材编写情况</p>
        <div>
          <p class="achievements">
            {{decMoocDigital}}
          </p>
        </div>
      </div>-->

      <!--科研情况-->
      <div class="expert-info-box">
        <p class="info-box-title">科研情况</p>
        <div class="no-padding">
          <table class="expert-info-table" border="1">
            <tr>
              <th><div>课题名称（包括项目编号）</div></th>
              <th><div>审批单位</div></th>
              <th><div>获奖情况</div></th>
              <th><div>备注</div></th>
            </tr>
            <tr v-for="(iterm,index) in researchData">
              <td><div>{{iterm.research_name}}</div></td>
              <td><div>{{iterm.approval_unit}}</div></td>
              <td><div>{{iterm.award}}</div></td>
              <td><div>{{iterm.note}}</div></td>
            </tr>
          </table>
          <div class="text-center lineheight-24" v-if="!researchData||!researchData.length">暂无数据</div>
        </div>
      </div>

      <!--主编学术专著情况表-->
      <div class="expert-info-box">
        <p class="info-box-title">主编学术专著情况</p>
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
            <tr v-for="(iterm,index) in perMonograph">
              <td><div>{{iterm.monograph_name}}</div></td>
              <td><div>{{$commonFun.formatDate(iterm.monograph_date,'yyyy-MM-dd').substring(0,10)}}</div></td>
              <td><div>{{iterm.is_self_paid?'自费':'公费'}}</div></td>
              <td><div>{{iterm.publisher}}</div></td>
              <td><div>{{$commonFun.formatDate(iterm.publish_date,'yyyy-MM-dd')}}</div></td>
              <td><div>{{iterm.note}}</div></td>
            </tr>
          </table>
          <div class="text-center lineheight-24" v-if="!perMonograph||!perMonograph.length">暂无数据</div>
        </div>
      </div>

      <!--出版行业获奖情况表-->
      <div class="expert-info-box">
        <p class="info-box-title">出版行业获奖情况表</p>
        <div class="no-padding">
          <table class="expert-info-table" border="1">
            <tr>
              <th><div>奖项名称</div></th>
              <th><div>获奖日期</div></th>
              <th><div>评奖单位</div></th>
              <th><div>备注</div></th>
            </tr>
            <tr v-for="(iterm,index) in publish_reward">
              <td><div>{{iterm.reward_name}}</div></td>
              <td><div>{{$commonFun.formatDate(iterm.reward_date,'yyyy-MM-dd')}}</div></td>
              <td><div>{{iterm.award_unit}}</div></td>
              <td><div>{{iterm.note}}</div></td>
            </tr>
          </table>
          <div class="text-center lineheight-24" v-if="!publish_reward||!publish_reward.length">暂无数据</div>
        </div>
      </div>

      <!--SCI论文投稿及影响因子情况-->
      <div class="expert-info-box">
        <p class="info-box-title">SCI论文投稿及影响因子</p>
        <div class="no-padding">
          <table class="expert-info-table" border="1">
            <tr>
              <th><div>论文名称</div></th>
              <th><div>期刊名称</div></th>
              <th><div>期刊SCI影响因子</div></th>
              <th><div>发表日期</div></th>
              <th><div>备注</div></th>
            </tr>
            <tr v-for="(iterm,index) in sci">
              <td><div>{{iterm.paper_name}}</div></td>
              <td><div>{{iterm.journal_name}}</div></td>
              <td><div>{{iterm.factor}}</div></td>
              <td><div>{{$commonFun.formatDate(iterm.publish_date,'yyyy-MM-dd')}}</div></td>
              <td><div>{{iterm.note}}</div></td>
            </tr>
          </table>
          <div class="text-center lineheight-24" v-if="!sci||!sci.length">暂无数据</div>
        </div>
      </div>

      <!--临床医学获奖情况-->
      <div class="expert-info-box">
        <p class="info-box-title">临床医学获奖情况</p>
        <div class="no-padding">
          <table class="expert-info-table" border="1">
            <tr>
              <th><div>奖项名称</div></th>
              <th><div>获奖日期</div></th>
              <th><div>奖项级别</div></th>
              <th><div>备注</div></th>
            </tr>
            <tr v-for="(iterm,index) in clinical_reward">
              <td><div>{{iterm.reward_name}}</div></td>
              <td><div>{{$commonFun.formatDate(iterm.reward_date,'yyyy-MM-dd')}}</div></td>
              <td><div>{{rankList[iterm.award_unit]}}</div></td>
              <td><div>{{iterm.note}}</div></td>
            </tr>
          </table>
          <div class="text-center lineheight-24" v-if="!clinical_reward||!clinical_reward.length">暂无数据</div>
        </div>
      </div>

      <!--学术荣誉授予情况-->
      <div class="expert-info-box">
        <p class="info-box-title">学术荣誉授予情况</p>
        <div class="no-padding">
          <table class="expert-info-table" border="1">
            <tr>
              <th><div>荣誉名称</div></th>
              <th><div>授予日期 </div></th>
              <th><div>荣誉级别</div></th>
              <th><div>备注</div></th>
            </tr>
            <tr v-for="(iterm,index) in acade_reward">
              <td><div>{{iterm.reward_name}}</div></td>
              <td><div>{{$commonFun.formatDate(iterm.reward_date,'yyyy-MM-dd')}}</div></td>
              <td><div>{{rankList[iterm.award_unit]}}</div></td>
              <td><div>{{iterm.note}}</div></td>
            </tr>
          </table>
          <div class="text-center lineheight-24" v-if="!acade_reward||!acade_reward.length">暂无数据</div>
        </div>
      </div>

      <!--编写内容意向-->
      <!--<div class="expert-info-box">
        <p class="info-box-title">编写内容意向</p>
        <div>
          <p class="achievements">
            {{decIntention}}
          </p>
        </div>
      </div>-->

    </div>
  </div>
</template>
<script type="text/javascript">
    import bus from 'common/eventBus/bus.js'
    export default{
      props:['writerUserId'],
      data(){
          return{
            api_info1:'/pmpheep/declaration/list/declaration/exportExcel',
            api_info:'/pmpheep/users/writer/expertInfo',
            searchFormData:{
              declarationId:'',
              materialId:'',
            },
            expertInfoData:{
              userId:'',
              realname:'',
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
              offlineProgress:'',
              onlineProgress:'',
              isMultiBooks: false,
              isMultiPosition: false,
              isDigitalEditorOptional:false,
              selectDigitalEditor:false,
            },
            learnExperience: [],
            workExperience: [],
            teachExperience:[],
            academicExperience:[],
            lastPositionList:[],
            decCourseConstruction:[],
            nationalPlan:[],
            decTextbookList:[],
            decTextbookPmphList: [],
            researchData:[],
            personalAchievements:'',
            decMoocDigital: '',
            //decIntention:'',
            monograph:[],//出版行业获奖情况
            publish_reward:[],//出版行业获奖情况表
            sci:[],//SCI论文投稿及影响因子情况
            clinical_reward:[],//临床医学获奖情况
            acade_reward:[],//学术荣誉授予情况
            bookList:[],
            positionList:['无','主编','副主编','编委'],
            positionList_2:['无','编委,数字编委','副主编','副主编,数字编委','副主编,编委','副主编,编委,数字编委'],
            rankList:['无','国际','国家','省部','市级'],
            national_plan_rankList:['无','教育部十二五','国家卫计委十二五','教育部十二五&&国家卫计委十二五'],
            textbook_rankList:['无','其他教材','教育部规划','卫计委规划','区域规划','创新教材'],
            courseConstructionList:['无','国际','国家','省部'],
            materialLevel:['无','国家','省部','协编','校本','其他','教育部规划','卫计委规划','区域规划','创新教材'],
            degree:['无','专科','本科','硕士','博士'],
            onlineProgressBtn:[],
            emptyReturnCauseTipShow:false,
            username: '', // 账号
          }
      },
      computed:{

      },
      methods:{

        /**
         * 获取专家信息数据
         */
        getTableData(){
          this.$axios.get(this.api_info,{params:{
            writerUserId:this.writerUserId
          }})
            .then(response=>{
              var res = response.data;
              if(res.code==1){

                console.log(res.data);
                // 获取当前专家账号
                this.username = res.data.username;
                //初始化专家身份信息
                res.data.sex=res.data.sex?res.data.sex==1?'男':'女':'保密';
                res.data.birthday = this.$commonFun.formatDate(res.data.birthday).split(' ')[0];
                this.expertInfoData = res.data;

                //初始化主要学习经历
                this.learnExperience = res.data.learnExperience;

                //初始化主要工作经历
                this.workExperience = res.data.workExperience;

                //主要教学经历
                this.teachExperience = res.data.teachExperience;

                //学术经验
                this.academicExperience = res.data.academicExperience;

                //个人成就
                this.personalAchievements =  (!!!res.data.personalAchievements)?'':res.data.personalAchievements.content;

                //上版教材参编情况
                this.lastPositionList = res.data.lastPositionList;

                //精品课程建设情况
                this.decCourseConstruction = res.data.decCourseConstruction

                //主编学术专著情况
                this.perMonograph = res.data.perMonograph;
                /*// 参加人卫慕课、数字教材编写情况
                this.decMoocDigital = res.data.decMoocDigital;*/
                // 编写意向
                //this.decIntention = (!!!res.data.decIntention)?'':res.data.decIntention.content;

                //作家主编国家级规划教材情况表
                this.nationalPlan = res.data.nationalPlan;
                //人卫社教材编写情况
                this.decTextbookPmphList = res.data.decTextbookPmphList;
                //其他社教材编写情况
                this.decTextbookList = res.data.decTextbookList;
                //作家科研情况表
                this.researchData = res.data.researchData;

                //出版行业获奖情况
                this.monograph = res.data.monograph;
                //出版行业获奖情况表
                this.publish_reward = res.data.publish_reward;
                //SCI论文投稿及影响因子情况
                this.sci = res.data.sci;
                //临床医学获奖情况
                this.clinical_reward = res.data.clinical_reward;
                //作家科研情况表
                this.acade_reward = res.data.acade_reward;

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
      },
      created(){
        this.searchFormData.declarationId = 12033;
        this.searchFormData.materialId = 42;
        this.getTableData();
      }

    }
</script>

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
