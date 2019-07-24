<template>
  <div class="teachingMaterial expert_info" id="printArea">
    <div class="info-wrapper">

      <!--操作按钮-->
      <div class="paddingB10 text-right print-none">
        <el-button type="primary" @click="openExpertDeclarationList()">上一步</el-button>

        <!--<el-button type="primary" @click="showSendMsg=true">发送私信</el-button>-->
        <!--<el-button type="primary" @click="confirmPaperList" :disabled="expertInfoData.offlineProgress!=0">-->
          <!--{{expertInfoData.offlineProgress==0?'确认收到纸质表':(expertInfoData.offlineProgress==1)?'纸质表已被退回':'已确认收到纸质表'}}-->
        <!--</el-button>expertInfoData.orgId!=0 &&expertInfoData.onlineProgress===1-->

       <!-- <el-button type="primary" @click="print">打印</el-button>
        <el-button type="primary" @click="login">登录</el-button>-->
      </div>

      <!--图书选择-->
      <div class="expert-info-box expert-operation-wrapper">
        <p class="info-box-title operation">图书选择（{{expertInfoData.isMultiBooks?'可以选择多本书籍':'只能选择一本书籍'}}，{{expertInfoData.isMultiPosition?'书籍职位可以多选':'书籍职位只能单选'}}）</p>
        <div>
          <div class="chooseBook clearfix lineheight-36" v-for="(iterm,index) in addBookList" :key="index">
            <!--新增书籍-->
            <div  v-if="iterm.newCreated || (!iterm.chosenPosition&&!iterm.isDigitalEditor)">
              <div v-if="iterm.isNew">
                <div class="searchBox-wrapper marginR20">
                  <div class="searchName">图书：<span></span></div>
                  <div class="searchInput">
                    <el-select v-model="iterm.textbookId" filterable placeholder="请选择" @change="selectBookChange(index)">
                      <el-option
                        v-for="(item,i) in bookList"
                        :key="i"
                        :label="item.textbookName"
                        :value="item.id"
                        :disabled="allRightSelectedBookList.includes(item.id)">
                      </el-option>
                    </el-select>
                  </div>
                </div>
                <el-radio-group v-model="iterm.presetPosition_temp" class=""  v-if="!expertInfoData.isMultiPosition">
                  <el-radio label="主编" :key="1">主编</el-radio>
                  <el-radio label="副主编" :key="2">副主编</el-radio>
                  <el-radio label="编委" :key="3">编委</el-radio>
                  <el-radio label="数字编委" :key="4" v-if="expertInfoData.isDigitalEditorOptional">数字编委</el-radio>
                </el-radio-group>
                <el-checkbox-group v-model="iterm.presetPosition_temp_multi" :min="1" class="inline-block" v-else>
                  <el-checkbox label="主编" :key="1">主编</el-checkbox>
                  <el-checkbox label="副主编" :key="2">副主编</el-checkbox>
                  <el-checkbox label="编委" :key="3">编委</el-checkbox>
                  <el-checkbox label="数字编委" :key="4" v-if="expertInfoData.isDigitalEditorOptional">数字编委</el-checkbox>
                </el-checkbox-group>
                <div class="info-iterm-text widthAuto marginL20">
                  <div>教学大纲：<span></span></div>
                  <div class="ellipsis"  @click="uploadBtnClick(index)">
                    <my-upload
                      v-if="!iterm.syllabusName||iterm.fileUploading"
                      class="upload"
                      ref="upload"
                      :action="api_file_uploadurl"
                      :file-list="iterm.fileList"
                      :on-change="uploadChange"
                      :before-upload="beforeUpload"
                      :on-success="uploadSuccess"
                      :show-file-list="false">
                      <el-button size="small" type="primary" :loading="iterm.fileUploading">点击上传</el-button>
                    </my-upload>
                    <span class="link" :title="iterm.syllabusName" v-if="iterm.syllabusName&&!iterm.fileUploading">{{iterm.syllabusName}}</span>
                  </div>
                </div>
                </div>
              <div v-else>
                <div class="info-iterm-text">
                  <div>图书：<span></span></div>
                  <div class="lineheight-normal paddingT10">{{iterm.textbookName}}</div>
                </div>
                <div class="info-iterm-text">
                  <div>职位：<span></span></div>
                  <div class="lineheight-normal paddingT10">{{iterm.showPosition}}</div>
                </div>
                <div class="info-iterm-text">
                  <div>教学大纲：<span></span></div>
                  <div class="ellipsis">
                    <a :href="iterm.syllabusId" target="_blank" v-if="iterm.syllabusName" :download="iterm.syllabusName">{{iterm.syllabusName}}</a>
                    <span v-else>（无）</span>
                  </div>
                </div>
                 </div>
            </div>
            <!--已有书籍-->
            <div v-else>
              <div class="info-iterm-text">
                <div>图书：<span></span></div>
                <div class="lineheight-normal paddingT10">{{iterm.textbookName}}</div>
              </div>
              <div class="info-iterm-text">
                <div>职位：<span></span></div>
                <div class="lineheight-normal paddingT10">{{iterm.showPosition}}</div>
              </div>
              <div class="info-iterm-text">
                <div>教学大纲：<span></span></div>
                <div class="ellipsis">
                  <a :href="iterm.syllabusId" target="_blank" v-if="iterm.syllabusName" :download="iterm.syllabusName">{{iterm.syllabusName}}</a>
                  <span v-else>（无）</span>
                </div>
              </div>
              <div class="info-iterm-text">
                <div>遴选状态：<span></span></div>
                <div>
                  <el-tag type="success" style="font-size:14px;"   v-if="iterm.showChosenPosition">
                    已被选为{{iterm.showChosenPosition}}
                  </el-tag>
                </div>
              </div>
            </div>
          </div>
          <!--<div class="expert_info-buttonWrapper print-none">
            <el-button type="primary" v-if="expertInfoData.isMultiBooks" @click="addNewBook">添加图书</el-button>
            </div>-->
        </div>
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
          <div class="info-iterm-text">
            <div>教龄(年)：<span></span></div>
            <div>{{expertInfoData.experience}}</div>
          </div>
          <div class="info-iterm-text">
            <div>工作单位：<span></span></div>
            <div><span :title="expertInfoData.orgName" class="one_line_limit">{{expertInfoData.orgName}}</span></div>
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
          <div class="info-iterm-text">
            <div>学历：<span></span></div>
            <div>{{degree[expertInfoData.degree]}}</div>
          </div>
          <div class="info-iterm-text lg-label">
            <div>是否服从调剂：<span></span></div>
            <div>{{expertInfoData.isDispensed?'是':'否'}}</div>
          </div>
          <div class="info-iterm-text xl-label">
            <div>是否参与本科教学评估认证：<span></span></div>
            <div>{{expertInfoData.isUtec?'是':'否'}}</div>
          </div>
          <div class="info-iterm-text lg">
            <div>专业特长：<span></span></div>
            <div>{{expertInfoData.expertise}}</div>
          </div>
        </div>
      </div>

      <!--主要学习经历-->
      <div class="expert-info-box" v-if="material.isEduExpUsed">
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
              <td><div> {{$commonFun.formatDate(iterm.dateBegin,'yyyy.MM.dd')}} &nbsp;-&nbsp; {{$commonFun.formatDate(iterm.dateEnd,'yyyy.MM.dd')}}</div></td>
              <td><div>{{iterm.schoolName}}</div></td>
              <td><div>{{iterm.major}}</div></td>
              <td><div>{{iterm.degree}}</div></td>
              <td><div>{{iterm.note}}</div></td>
            </tr>
          </table>
          <!--<div class="text-center lineheight-24" v-if="!learnExperience.length">暂无数据</div>-->
        </div>
      </div>




      <!--主要工作经历-->
      <div class="expert-info-box" v-if="material.isWorkExpUsed">
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
              <td><div> {{$commonFun.formatDate(iterm.dateBegin,'yyyy.MM.dd')}} &nbsp;-&nbsp; {{$commonFun.formatDate(iterm.dateEnd,'yyyy.MM.dd')}}</div></td>
              <td><div>{{iterm.orgName}}</div></td>
              <td><div>{{iterm.position}}</div></td>
              <td><div>{{iterm.note}}</div></td>
            </tr>
          </table>
          <!--<div class="text-center lineheight-24" v-if="!workExperience.length">暂无数据</div>-->
        </div>
      </div>

      <!--主要教学经历-->
      <div class="expert-info-box" v-if="material.isTeachExpUsed">
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
              <td><div> {{$commonFun.formatDate(iterm.dateBegin,'yyyy.MM.dd')}} &nbsp;-&nbsp; {{$commonFun.formatDate(iterm.dateEnd,'yyyy.MM.dd')}}</div></td>
              <td><div>{{iterm.schoolName}}</div></td>
              <td><div>{{iterm.subject}}</div></td>
              <td><div>{{iterm.note}}</div></td>
            </tr>
          </table>
          <!--<div class="text-center lineheight-24" v-if="!teachExperience.length">暂无数据</div>-->
        </div>
      </div>


      <!--个人成就-->
      <div class="expert-info-box" v-if="material.isAchievementUsed">
        <p class="info-box-title">个人成就</p>
        <div>
          <p class="achievements">
            {{personalAchievements}}
          </p>
        </div>
      </div>

      <!--主要学术兼职-->
      <div class="expert-info-box" v-if="material.isAcadeUsed">
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
              <td><div>{{iterm.orgName}}</div></td>
              <td><div>{{iterm.rank&&iterm.rank<5?rankList[iterm.rank]:'无'}}</div></td>
              <td><div>{{iterm.position}}</div></td>
              <td><div>{{iterm.note}}</div></td>
            </tr>
          </table>
          <!--<div class="text-center lineheight-24" v-if="!academicExperience.length">暂无数据</div>-->
        </div>
      </div>

      <!--上版教材参编情况（未参编请在教材名称栏填无)(必填)-->
      <div class="expert-info-box" v-if="material.isLastPositionUsed">
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
              <td><div>{{iterm.materialName}}</div></td>
              <td><div>{{iterm.position&&iterm.position<4?positionList[iterm.position]:'无'}}</div></td>
              <td><div>{{iterm.isDigitalEditor?'是':'否'}}</div></td>
              <td><div>{{iterm.publisher}}</div></td>
              <td><div>{{$commonFun.formatDate(iterm.publishDate,'yyyy.MM.dd').substring(0,10)}}</div></td>
              <td><div>{{iterm.note}}</div></td>
            </tr>
          </table>
          <!--<div class="text-center lineheight-24" v-if="!lastPositionList.length">暂无数据</div>-->
        </div>
      </div>

      <!--精品课程建设情况-->
      <div class="expert-info-box" v-if="material.isCourseUsed">
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
              <td><div>{{iterm.courseName}}</div></td>
              <td><div>{{iterm.classHour}}</div></td>
              <td><div>{{courseConstructionList[iterm.type]||'无'}}</div></td>
              <td><div>{{iterm.note}}</div></td>
            </tr>
          </table>
          <!--<div class="text-center lineheight-24" v-if="!decCourseConstruction.length">暂无数据</div>-->
        </div>
      </div>


      <!--主编国家级规划教材情况-->
      <div class="expert-info-box" v-if="material.isNationalPlanUsed">
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
              <td><div>{{iterm.materialName}}</div></td>
              <td><div>{{iterm.isbn}}</div></td>
             <!--  <td><div>{{iterm.rank&&iterm.rank<4?national_plan_rankList[iterm.rank]:'无'}}</div></td> -->
              <td><div>{{iterm.rankText}}</div></td>
              <td><div>{{iterm.note}}</div></td>
            </tr>
          </table>
          <!--<div class="text-center lineheight-24" v-if="!nationalPlan.length">暂无数据</div>-->
        </div>
      </div>


      <!--人卫社教材编写情况-->
      <div class="expert-info-box" v-if="material.isPmphTextbookUsed">
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
            <tr v-for="(iterm,index) in rwtextbook">
              <td><div>{{iterm.materialName}}</div></td>
              <td><div> {{iterm.rank?materialLevel[iterm.rank]:'无'}}</div></td>
              <td><div>{{iterm.position&&iterm.position<4?positionList[iterm.position]:'无'}}</div></td>
              <td><div>{{iterm.isDigitalEditor?'是':'否'}}</div></td>
              <td><div>{{$commonFun.formatDate(iterm.publishDate,'yyyy.MM.dd').substring(0,10)}}</div></td>
              <td><div>{{iterm.isbn}}</div></td>
              <td><div>{{iterm.note}}</div></td>
            </tr>
          </table>
          <!--<div class="text-center lineheight-24" v-if="!rwtextbook.length">暂无数据</div>-->
        </div>
      </div>


      <!--其他社教材编写情况-->
      <div class="expert-info-box" v-if="material.isTextbookUsed">
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
            <tr v-for="(iterm,index) in textbook">
              <td><div>{{iterm.materialName}}</div></td>
              <td><div> {{iterm.rank?materialLevel[iterm.rank]:'无'}}</div></td>
              <td><div>{{iterm.position&&iterm.position<4?positionList[iterm.position]:'无'}}</div></td>
              <td><div>{{iterm.publisher}}</div></td>
              <td><div>{{iterm.isDigitalEditor?'是':'否'}}</div></td>
              <td><div>{{$commonFun.formatDate(iterm.publishDate,'yyyy.MM.dd').substring(0,10)}}</div></td>
              <td><div>{{iterm.isbn}}</div></td>
              <td><div>{{iterm.note}}</div></td>
            </tr>
          </table>
          <!--<div class="text-center lineheight-24" v-if="!textbook.length">暂无数据</div>-->
        </div>
      </div>


      <!--参加人卫慕课、数字教材编写情况-->
      <div class="expert-info-box" v-if="material.isMoocDigitalUsed">
        <p class="info-box-title">参加人卫慕课、数字教材编写情况</p>
        <div>
          <p class="achievements">
            {{decMoocDigital}}
          </p>
        </div>
      </div>

      <!--科研情况-->
      <div class="expert-info-box" v-if="material.isResearchUsed">
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
              <td><div>{{iterm.researchName}}</div></td>
              <td><div>{{iterm.approvalUnit}}</div></td>
              <td><div>{{iterm.award}}</div></td>
              <td><div>{{iterm.note}}</div></td>
            </tr>
          </table>
          <!--<div class="text-center lineheight-24" v-if="!researchData.length">暂无数据</div>-->
        </div>
      </div>

      <!--主编学术专著情况表-->
      <div class="expert-info-box" v-if="material.isMonographUsed">
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
            <tr v-for="(iterm,index) in monograph">
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

      <!--出版行业获奖情况表-->
      <div class="expert-info-box" v-if="material.isPublishRewardUsed">
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
              <td><div>{{iterm.rewardName}}</div></td>
              <td><div>{{$commonFun.formatDate(iterm.rewardDate,'yyyy.MM.dd')}}</div></td>
              <td><div>{{iterm.awardUnit}}</div></td>
              <td><div>{{iterm.note}}</div></td>
            </tr>
          </table>
          <!--<div class="text-center lineheight-24" v-if="!publish_reward.length">暂无数据</div>-->
        </div>
      </div>

      <!--SCI论文投稿及影响因子情况-->
      <div class="expert-info-box" v-if="material.isSciUsed">
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
              <td><div>{{iterm.paperName}}</div></td>
              <td><div>{{iterm.journalName}}</div></td>
              <td><div>{{iterm.factor}}</div></td>
              <td><div>{{$commonFun.formatDate(iterm.publishDate,'yyyy.MM.dd')}}</div></td>
              <td><div>{{iterm.note}}</div></td>
            </tr>
          </table>
          <!--<div class="text-center lineheight-24" v-if="!sci.length">暂无数据</div>-->
        </div>
      </div>

      <!--临床医学获奖情况-->
      <div class="expert-info-box" v-if="material.isClinicalRewardUsed">
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
              <td><div>{{iterm.rewardName}}</div></td>
              <td><div>{{$commonFun.formatDate(iterm.rewardDate,'yyyy.MM.dd')}}</div></td>
              <td><div>{{rankList[iterm.awardUnit]}}</div></td>
              <td><div>{{iterm.note}}</div></td>
            </tr>
          </table>
          <!--<div class="text-center lineheight-24" v-if="!clinical_reward.length">暂无数据</div>-->
        </div>
      </div>

      <!--学术荣誉授予情况-->
      <div class="expert-info-box" v-if="material.isAcadeRewardUsed">
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
              <td><div>{{iterm.rewardName}}</div></td>
              <td><div>{{$commonFun.formatDate(iterm.rewardDate,'yyyy.MM.dd')}}</div></td>
              <td><div>{{rankList[iterm.awardUnit]}}</div></td>
              <td><div>{{iterm.note}}</div></td>
            </tr>
          </table>
          <!--<div class="text-center lineheight-24" v-if="!acade_reward.length">暂无数据</div>-->
        </div>
      </div>

      <!--编写内容意向-->
      <div class="expert-info-box" v-if="material.isIntentionUsed">
        <p class="info-box-title">编写内容意向</p>
        <div>
          <p class="achievements">
            {{decIntention}}
          </p>
        </div>
      </div>



      <div v-if="decExtensionList.length">
        <!--扩展项-->
        <div class="expert-info-box" v-for="(iterm,index) in decExtensionList">
          <p class="info-box-title">{{iterm.extensionName?iterm.extensionName:'更多信息'}}</p>
          <div>
            <p class="achievements">
              {{iterm.content}}
            </p>
          </div>
        </div>
      </div>

      <!--申报单位-->
      <div class="expert-info-box">
        <p class="info-box-title">申报单位</p>
        <div>
          <div class="info-iterm-text">
            <div>申报单位：<span></span></div>
            <div>{{expertInfoData.orgId?expertInfoData.orgNameOne:'人民卫生出版社'}}</div>
          </div>
        </div>
      </div>

      <div  class="yxyj" >
        <div>院校推荐意见:</div>
        <div style="height:145px;"></div>
        <div style="text-align:right;"> <span style="padding-right:50px;">负责人签字</span> <span>(院校盖章)</span></div>
        <div style="text-align:right;">年&nbsp;月&nbsp;日</div>
      </div>

    </div>


    <el-dialog
      title="发送私信"
      :visible.sync="showSendMsg"
      :before-close="clearInputMsg"
      size="tiny">
      <el-form :model="ruleForm2"  :rules="rules2" ref="ruleForm2"  >
      <el-form-item class="relative" prop="inputMsg">
        <el-input
          autofocus
          type="textarea"
          :rows="6"
          placeholder="请输入内容"
          @input.native="changeTextarea"
          @keyup.native.enter="sendmsg"
          v-model="ruleForm2.inputMsg">
        </el-input>
        <p class="tip-text" v-if="250-ruleForm2.inputMsg.length<20">还可输入{{250-ruleForm2.inputMsg.length}}个字符</p>
      </el-form-item>
      <!--<span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sendmsg">发 送</el-button>
        <el-button @click="closeInputMsg">取 消</el-button>
      </span>-->
        <el-form-item align="right">
          <el-button type="primary" @click="sendmsg('ruleForm2')">发 送</el-button>
          <el-button @click="closeInputMsg">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="退回原因："
      :visible.sync="showOfflineProgress"
      :before-close="clearOfflineProgressMsg"
      size="tiny">
      <div class="relative">
        <el-input
          autofocus
          type="textarea"
          :rows="6"
          placeholder="请输入退回原因"
          @input.native="changeOfflineProgressTextarea"
          @keyup.native.enter="onlineCheckPass(5)"
          v-model="offlineProgressText">
        </el-input>
        <p class="tip-text" v-if="100-offlineProgressText.length<20">还可输入{{100-offlineProgressText.length}}个字符</p>
        <div class="choosenWarning" v-if="expertChoosen">
          提示:该作者已被遴选为:
          <div class="chooenWarningPosition" v-for="(iterm,index) in addBookList" :key="index">
            <span v-if="iterm.chosenPosition">《{{iterm.textbookName}}》的{{iterm.showChosenPosition}}</span>
          </div>
          退回将会同时 <font color="red" >撤销遴选</font>，是否确认退回？
        </div>
        <div><font  v-if="emptyReturnCauseTipShow" color="red">退回原因不可为空!</font><font>&emsp;</font></div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button :type="expertChoosen?'danger':'primary'" @click="onlineCheckPass(offlineProgressType)">确 定</el-button>
        <el-button @click="closeOfflineProgress">取 消</el-button>

      </span>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
    import bus from 'common/eventBus/bus.js'
    export default{
        props:['materialInfo'],
        data(){
            return{
              api_info:'/pmpheep/declaration/list/declaration/exportExcel',
              api_book_list:'/pmpheep/textBook/list',
              api_update_book:'/pmpheep/declaration/list/declaration/saveBooks',
              api_confirm_paper:'/pmpheep/declaration/list/declaration/confirmPaperList',
              api_file_uploadurl:'/pmpheep/messages/message/file',
              api_send_msg:'/pmpheep/messages/newOneMessage',
              api_online_check:'/pmpheep/declaration/list/declaration/onlineProgress',
              searchFormData:{
                declarationId:'',
                materialId:'',
              },
              currentUploadFileBookIndex:undefined,
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
              textbook:[],
              rwtextbook: [],
              researchData:[],
              decExtensionList:[],
              personalAchievements:'',
              decMoocDigital: '',
              decIntention:'',
              monograph:[],//出版行业获奖情况
              publish_reward:[],//出版行业获奖情况表
              sci:[],//SCI论文投稿及影响因子情况
              clinical_reward:[],//临床医学获奖情况
              acade_reward:[],//学术荣誉授予情况
              bookList:[],
              positionList:['无','主编','副主编','编委'],
              positionList_2:['无','编委,数字编委','副主编','副主编,数字编委','副主编,编委','副主编,编委,数字编委'],
              addBookList:[],
              hasBookListChanged:false,
              showSendMsg:false,
              userId:null,
              ruleForm2: {
                inputMsg:'',
              },
              rules2: {
                inputMsg: [
                  {required: true,message: "请输入回复内容",trigger: "blur"},
                  { min: 1, max: 250, message: "不能超过200个字符", trigger: "change,blur" }
                ]

              },

              rankList:['无','国际','国家','省部','市级'],
              national_plan_rankList:['无','教育部十二五','国家卫计委十二五','教育部十二五&&国家卫计委十二五'],
              textbook_rankList:['无','其他教材','教育部规划','卫计委规划','区域规划','创新教材'],
              courseConstructionList:['无','国际','国家','省部'],
              materialLevel:['无','国际','国家','省部',"市级",'协编','校本','其他','教育部规划','卫计委规划','区域规划','创新教材'],
              degree:['无','专科','本科','硕士','博士'],
              onlineProgressBtn:[],
              //教材信息
              material:{},
              emptyReturnCauseTipShow:false,

              //退回给个人弹窗
              showOfflineProgress:false,
              offlineProgressText:'',
              offlineProgressType:4,
              username: '', // 账号
            }
        },
        computed:{
          /**
           * 判断保存图书按钮是否显示
           * @returns {boolean}
           */
          hasNewAddbook(){
            if(this.addBookList.length==0){
              return false;
            }
            let flag = false;
            for(let iterm of this.addBookList){
              if(iterm.isNew){
                flag = true;
                break;
              };
            }
            return flag;
          },
          allRightSelectedBookList(){
            let flag = [];
            for(let iterm of this.addBookList){
              if(iterm.textbookId){
                flag.push(iterm.textbookId);
              }
            }
            return flag;
          },
          onlineProgressBtn_Back(){
           // let l = [0,2,4,5].includes(this.expertInfoData.onlineProgress);
            let l = [0,2,5].includes(this.expertInfoData.onlineProgress);
//            if(this.addBookList.length==0){
  //            return !l;
    //        }
          //  let flag = true;
           // console.log(this.addBookList);
           // for(let iterm of this.addBookList){
          //    if(iterm.isDigitalEditor||iterm.chosenPosition){
          //      flag = false;
        //        break;
         //     };
       //     }
          //  return flag&&!l;
          return !l;
          },
          onlineProgressBtn_Pass(){
            var l = [0,2,3,4,5];
            return (l.includes(this.expertInfoData.onlineProgress))
          },
          expertChoosen(){
            let flag = false
            this.addBookList.forEach(book =>{
              flag = flag || (book.chosenPosition>0)
            })
            return flag
          }

        },
        created(){
          this.$emit('hideTab')
        },
      methods:{
        /**
         * 点击添加新图书按钮执行方法
         */
        addNewBook(){
          var initObj = {
            id:'',
            isNew:true,
            newCreated:true,
            declarationId:'',
            textbookId:'',
            textbookName:'',
            presetPosition:3,
            presetPosition_temp:'',
            presetPosition_temp_multi:[],
            isDigitalEditor:false,
            fileName:'',
            syllabusName:'',
            fileUploading:false,
            file:undefined,
          }
          this.addBookList.push(initObj);
          this.hasBookListChanged = true;
        },
        /**
         * 选择图书框发生改变时
         */
        selectBookChange(index){
          this.bookList.forEach(iterm=>{
            if(iterm.id == this.addBookList[index].textbookId){
              this.addBookList[index].textbookName = iterm.textbookName;
            }
          })
        },
        /**
         * 点击删除按钮执行此方法
         * @param index
         */
        deleteNew(index,hasChange,iterm){
             if(this.addBookList.length==1&&!this.addBookList[0].isNew){
                this.$confirm('至少要有一本书！', "提示",{
                	confirmButtonText: "确定",
                	cancelButtonText: "取消",
                	showCancelButton: false,
                	type: "error"
                });
              }
            this.$confirm(iterm?'确定删除图书：<'+iterm.textbookName+'>？':'您还未保存图书,确定删除吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }).then(() => {
              this.addBookList.splice(index, 1);
              if(hasChange){
                this.hasBookListChanged=true;
              }
              if(iterm){
                this.saveBook();
              }

            }).catch(() => {
              /*this.$message({
                type: 'info',
                message: '已取消删除'
              });*/
            });
        },
        /**
         * 保存图书，保存成功后就将图书isNew状态改为false
         */
        saveBook(){
          let dataIsReady = true;
          console.log(this.addBookList);
          for(let iterm of this.addBookList){
            if(!iterm.textbookId){
              this.$confirm('请选择图书', "提示",{
              	confirmButtonText: "确定",
              	cancelButtonText: "取消",
              	showCancelButton: false,
              	type: "error"
              });
              return;
            }

            if(!this.$commonFun.Empty(iterm.newCreated)){
              if((this.$commonFun.Empty(iterm.presetPosition_temp)&&this.$commonFun.Empty(iterm.presetPosition_temp_multi))){
                this.$confirm('职位必选', "提示",{
                	confirmButtonText: "确定",
                	cancelButtonText: "取消",
                	showCancelButton: false,
                	type: "error"
                });
                return ;
              }
            }

          }
          //准备上传数据
          let formData = {};
          this.addBookList.forEach((iterm,index)=>{
            if(iterm.newCreated){
              iterm.presetPosition_temp_multi.sort((x,y)=>{
                let list = ['主编','副主编','编委','数字编委'];
                return list.indexOf(x)-list.indexOf(y);
              });
              iterm.showPosition = this.expertInfoData.isMultiPosition?iterm.presetPosition_temp_multi.join(','):iterm.presetPosition_temp;

            }
            formData['list['+index+'].'+'id']=iterm.id;
            formData['list['+index+'].'+'declarationId']=this.searchFormData.declarationId;
            formData['list['+index+'].'+'textbookId']=iterm.textbookId;
            formData['list['+index+'].'+'showPosition']=iterm.showPosition;
            formData['list['+index+'].'+'file']=iterm.filePath?iterm.filePath:'';
          });
          this.$axios.post(this.api_update_book,this.$commonFun.initPostData(formData))
            .then(response=>{
              var res = response.data;
              if(res.code==1){
                this.addBookList.forEach(iterm=>{
                  iterm.isNew = false;
                })
                this.$message.success('保存成功！');
                this.hasBookListChanged=false;
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
         * 点击上传按钮执行此方法
         * @param file
         * @param fileList
         */
        uploadChange(file,fileList){
          var filedata = file.raw;
          var ext=file.name.substring(file.name.lastIndexOf(".")+1).toLowerCase();

          if(this.addBookList[this.currentUploadFileBookIndex].hasHandleFileUid){
            return;
          }
          if(!filedata||!ext){
            return;
          }
          //文件名不超过40个字符
          if(file.name.length>60){
            this.$confirm("文件名不能超过60个字符", "提示",{
            	confirmButtonText: "确定",
            	cancelButtonText: "取消",
            	showCancelButton: false,
            	type: "error"
            });
            return;
          }
          // 类型判断
          if(ext=='exe'||ext=='bat'||ext=='com'||ext=='lnk'||ext=='pif'){
            this.$confirm("请勿上传可执行文件！", "提示",{
            	confirmButtonText: "确定",
            	cancelButtonText: "取消",
            	showCancelButton: false,
            	type: "error"
            });
            return;
          }
          // 判断文件大小是否符合 文件不为0
          if(file.size<1){
            this.$confirm("文件大小不能小于1bt", "提示",{
            	confirmButtonText: "确定",
            	cancelButtonText: "取消",
            	showCancelButton: false,
            	type: "error"
            });
            return;
          }
          // 判断文件大小是否符合 文件不大于100M
          if(file.size/1024/1024 > 100){
            this.$confirm("文件大小不能超过100M！", "提示",{
            	confirmButtonText: "确定",
            	cancelButtonText: "取消",
            	showCancelButton: false,
            	type: "error"
            });
            self.newGroupData.syllabusName=undefined;
            return;
          }
          //赋值
          this.addBookList[this.currentUploadFileBookIndex].file = filedata;
          this.addBookList[this.currentUploadFileBookIndex].syllabusName = file.name;
          this.addBookList[this.currentUploadFileBookIndex].hasHandleFileUid = file.uid;
          this.addBookList[this.currentUploadFileBookIndex].fileUploading = true;
          console.log(this.addBookList[this.currentUploadFileBookIndex])
        },
        beforeUpload(file){
          const ext = file.name.substring(file.name.lastIndexOf('.')+1);
          console.log(file)
          const isLt0M = 0 < file.size / 1024 / 1024 && file.size / 1024 / 1024<100;
          const nameLen = file.name.length <= 60;
          //文件名不超过40个字符
          if(file.name.length>60){
            this.$confirm("文件名不能超过60个字符", "提示",{
            	confirmButtonText: "确定",
            	cancelButtonText: "取消",
            	showCancelButton: false,
            	type: "error"
            });
            return false;
          }
          if (file.size / 1024 / 1024==0) {
            this.$confirm('上传文件大小不能小于 0kb!', "提示",{
            	confirmButtonText: "确定",
            	cancelButtonText: "取消",
            	showCancelButton: false,
            	type: "error"
            });
            return false;
          }
          if (file.size / 1024 / 1024>100) {
            this.$confirm('文件大小不能超过100M！', "提示",{
            	confirmButtonText: "确定",
            	cancelButtonText: "取消",
            	showCancelButton: false,
            	type: "error"
            });
            return false;
          }
          if (ext=='exe'||ext=='bat'||ext=='com'||ext=='lnk'||ext=='pif') {
            this.$confirm('请勿上传可执行文件!', "提示",{
            	confirmButtonText: "确定",
            	cancelButtonText: "取消",
            	showCancelButton: false,
            	type: "error"
            });
            return false;
          }
          if (!nameLen) {
            this.$confirm('上传文件名字长度不能超过80个字符!', "提示",{
            	confirmButtonText: "确定",
            	cancelButtonText: "取消",
            	showCancelButton: false,
            	type: "error"
            });
            return false;
          }
          return isLt0M&&nameLen&&!(ext=='exe'||ext=='bat'||ext=='com'||ext=='lnk'||ext=='pif')
        },
        uploadSuccess(response, file, fileList){
          this.addBookList.forEach(iterm=>{
            if(iterm.hasHandleFileUid == file.uid){
              iterm.fileUploading=false;
              iterm.filePath = response.data;
              console.log('file',iterm)
            }
          })
        },
        /**
         * 点击上传按钮就把当前index 赋值给currentUploadFileBookIndex
         * 用于当文件上传成功后通过currentUploadFileBookIndex找到正在操作哪本书
         */
        uploadBtnClick(index){
          console.log('index',index);
          this.currentUploadFileBookIndex = index;
        },


        openExpertDeclarationList(){

          console.log(this.userId);
          this.$router.push({name:'专家申报表列表',params:{userId:this.userId}});
        },
        /**
         * 获取专家信息数据
         */
        getTableData(){
          this.$axios.get(this.api_info,{params:{
            declarationId:this.searchFormData.declarationId
          }})
            .then(response=>{
              var res = response.data;
              if(res.code==1){
                //初始化添加图书数据
                this.hasBookListChanged=false;
                this.addBookList = res.data.decPositionList;
                // 获取当前专家账号
                this.username = res.data.declaration.username;
                //初始化专家身份信息
                res.data.declaration.sex=res.data.declaration.sex?res.data.declaration.sex==1?'男':'女':'保密';
                res.data.declaration.birthday = this.$commonFun.formatDate(res.data.declaration.birthday).split(' ')[0];
                this.expertInfoData = res.data.declaration;

                //初始化主要学习经历
                this.learnExperience = res.data.decEduExpList;

                //初始化主要工作经历
                this.workExperience = res.data.decWorkExpList;

                //主要教学经历
                this.teachExperience = res.data.decTeachExpList;

                //学术经验
                this.academicExperience = res.data.decAcadeList;

                //个人成就
                this.personalAchievements =  (!!!res.data.decAchievement)?'':res.data.decAchievement.content;

                //上版教材参编情况
                this.lastPositionList = res.data.decLastPositionList;

                //精品课程建设情况
                this.decCourseConstruction = res.data.decCourseConstruction

                // 参加人卫慕课、数字教材编写情况
                this.decMoocDigital = (!!!res.data.decMoocDigital)?'':res.data.decMoocDigital.content;

                // 编写意向
                this.decIntention = (!!!res.data.decIntention)?'':res.data.decIntention.content;

                //作家主编国家级规划教材情况表
                this.nationalPlan = res.data.decNationalPlanList;
                //人卫社教材编写情况
                this.rwtextbook = res.data.decTextbookPmphList;
                //其他社教材编写情况
                this.textbook = res.data.decTextbookList;
                //作家科研情况表
                this.researchData = res.data.decResearchList;

                //出版行业获奖情况
                this.monograph = res.data.decMonographList;
                //出版行业获奖情况表
                this.publish_reward = res.data.decPublishRewardList;
                //SCI论文投稿及影响因子情况
                this.sci = res.data.decSciList;
                //临床医学获奖情况
                this.clinical_reward = res.data.decClinicalRewardList;
                //作家科研情况表
                this.acade_reward = res.data.decAcadeRewardList;

                //扩展项
                this.decExtensionList = res.data.decExtensionList;

                //教材信息
                this.material = res.data.material;

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
         * 获取教材所有书籍
         */
          getBookList(){
          // console.log(this.searchForm)
          this.$axios.get(this.api_book_list,{params:{
            materialId:this.searchFormData.materialId
          }})
            .then(response=>{
              var res = response.data;
              if(res.code==1){
                this.bookList = res.data
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
         * 确认收到纸质表
         */
        confirmPaperList(){
          this.$confirm("确定收到纸质表？", "提示",{
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(()=>{
              this.$axios.get(this.api_confirm_paper,{params:{
                id:this.searchFormData.declarationId,
                offlineProgress:this.expertInfoData.offlineProgress,
              }})
                .then(response=>{
                var res = response.data;
                if(res.code==1){
                  this.$message.success('已确认！')
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
            })
            .catch(e=>{})
        },
        /**
         * 发送消息
         */
        sendmsg(){
          /*if(!this.inputMsg){
            this.$confirm('发送内容不能为空！', "提示",{
            	confirmButtonText: "确定",
            	cancelButtonText: "取消",
            	showCancelButton: false,
            	type: "error"
            });
            return;
          }*/
          this.$refs.ruleForm2.validate((valid) => {
              if (valid) {
          this.$axios.post(this.api_send_msg,this.$commonFun.initPostData({
            content:this.ruleForm2.inputMsg,
            sessionId:this.$getUserData().userInfo.id,
            receiverId:this.expertInfoData.userId
          }))
            .then(response=>{
              var res = response.data;
              if(res.code==1){
                this.$message.success('已发送！')
              }else{
                this.$confirm(res.msg.msgTrim(), "提示",{
                	confirmButtonText: "确定",
                	cancelButtonText: "取消",
                	showCancelButton: false,
                	type: "error"
                })
              }
              this.closeInputMsg();
            })
            .catch(e=>{
              console.log(e);
              this.$confirm('发送失败，请重试！', "提示",{
              	confirmButtonText: "确定",
              	cancelButtonText: "取消",
              	showCancelButton: false,
              	type: "error"
              });
              this.closeInputMsg();
            })
              } else {
                console.log('error submit!!');
                return false;
              }
          });
        },
        /**
         * 当聊天输入框发生变化
         */
        changeTextarea(){
          if(this.ruleForm2.inputMsg.length>250){
            this.$nextTick(() => {
              this.ruleForm2.inputMsg=this.ruleForm2.inputMsg.substring(0,250);
            })
          }
        },
        /**
         * 清除已输入文字
         */
        clearInputMsg(done){
          this.ruleForm2.inputMsg='';
          done();
        },
        closeInputMsg(){
          this.ruleForm2.inputMsg='';
          this.showSendMsg=false;
        },
        /**
         * 打印
         */
        print(){
//          console.log(this.materialInfo);
          document.title = this.materialInfo.materialName;

          window.print();

          return false;
        },
        /**
         * 点击审核通过
         *  type 5 标示退回给个人 4退回给学校 3 标示通过 2退回给单位
         */
        onlineCheckPass(type){
          if ((type == 5||type==4)&&this.offlineProgressText == '') {
            /*this.$confirm('请输入退回原因!', "提示",{
            	confirmButtonText: "确定",
            	cancelButtonText: "取消",
            	showCancelButton: false,
            	type: "error"
            });*/
            this.emptyReturnCauseTipShow = true;
            return;
          }
          this.$axios.get(this.api_online_check,{params:{
            id:this.searchFormData.declarationId,
            onlineProgress:type,
            returnCause:this.offlineProgressText||''
          }})
            .then(response=>{
              var res = response.data;
              if(res.code==1){
                this.$set(this.expertInfoData,"onlineProgress",type);
                //this.expertInfoData.onlineProgress=type;
                this.closeOfflineProgress();
                this.$message.success(type==3?'已通过！':'已退回！')
                this.getTableData();
                this.getBookList();
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
        /**
         * 关闭退回原因弹窗
         */
        clearOfflineProgressMsg(done){
          this.offlineProgressText='';
          done();
        },
        closeOfflineProgress(){
          this.offlineProgressText='';
          this.showOfflineProgress=false;
        },
        changeOfflineProgressTextarea(){
          if(this.offlineProgressText.length>100){
            this.$nextTick(() => {
              this.offlineProgressText=this.offlineProgressText.substring(0,100);
            })
          }
        },
        setOnlineCheckPassType(num){
          this.offlineProgressType = num||4;
          this.emptyReturnCauseTipShow =false;
          this.showOfflineProgress=true;

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
        console.log( ":::::::")
        console.log( this.$route.query.declarationId)
        console.log( this.$route.query.userId)
        console.log( this.$route.params.materialId)
        console.log( this.$route.params.userId)
        console.log( ":::::::")
        this.searchFormData.declarationId = this.$route.query.declarationId;
        this.userId=this.$route.query.userId;
        this.searchFormData.materialId = this.$route.params.materialId;
        this.userId=this.$route.params.userId;
        if(this.$route.query.pageNumber||this.$route.query.pageSize){
          this.fromPageSearchParamsData = this.$route.query;
        }
        //如果没有教材id则跳转到通知列表
        if(!this.searchFormData.materialId){
          this.$router.push({name:'通知列表'});
        }
        //如果没有用户id则跳转到申报审核列表
        if(!this.searchFormData.materialId){
          this.$router.push({name:'申报表审核'});
        }
        this.getTableData();
        this.getBookList();
      },

      beforeDestroy(){
//        console.log(this.$route)
        //当返回到申报表审核页面时要带上原来查询参数
        /**
         * 实现方法，将搜索的参数储存在父组件，通过props传给页面
         */
        if((this.$route.name==='申报表审核'||this.$route.name==='提交到出版社')&&this.fromPageSearchParamsData){
          bus.$emit('pressCheck:searchParams',this.fromPageSearchParamsData);
        }else{
          bus.$emit('pressCheck:searchParams',{});
        }
      },
    }
</script>
<style>
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
