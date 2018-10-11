<template>
    <div class="newChoose">
          <el-form :model="material" :rules="rules" ref="ruleForm" label-width="150px" :label-position="labelPosition">
            <el-row>
              <el-row>
            <el-col :span="16">
            <el-form-item label="教材名称：" prop="materialName" >
                <el-input v-model="material.materialName" @keyup.enter.native="submitForm"></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="8">
            <el-form-item label="教材轮次：" prop="materialRound" >
                <el-input v-model="material.materialRound" @keyup.enter.native="submitForm"></el-input>
            </el-form-item>
            </el-col>
            </el-row>
            <el-col :span="8">
            <el-form-item label="实际结束日期：" prop="actualDeadline" >
              <el-date-picker type="date" placeholder="选择日期" v-model="material.actualDeadline" @change="actDatePickGetTime" :picker-options="pickOptionsAct" format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
            </el-form-item>
            </el-col>
            <el-col :span="8">
            <el-form-item label="展示结束日期："  prop="deadline">
              <el-date-picker type="date" placeholder="选择日期" v-model="material.deadline" @change="showDatePickGetTime"  :picker-options="pickOptionsShow" format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
            </el-form-item>
            </el-col>
            <el-col :span="8">
            <el-form-item prop="ageDeadline" label="年龄计算截止日期："  >
              <el-date-picker type="date" placeholder="选择日期" v-model="material.ageDeadline" @change="ageDatePickGetTime" format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
            </el-form-item>
            </el-col>
            </el-row>
                <el-form-item label="教材分类："  prop="materialType">
                   <el-cascader
                      :options="chooseBookData"
                      :props="defaultProps"
                      v-model="material.materialType"
                      change-on-select
                      class="classify_input"
                      @change="materialHandleChange">
                    </el-cascader>
                </el-form-item>

            <el-form-item label="联系人：" prop="materialContacts">
              <el-col :span="24">
                <el-button type="primary"  size="small" @click="chooseContact">选择联系人</el-button>
                <br>
                <el-table
                  :data="ruleForm.materialContacts"
                  border
                  style="width: 100%">
                  <el-table-column
                    label="姓名"
                  >
                    <template scope="scope">
                      <!-- <span v-if="!ruleForm.materialContacts[scope.$index].isNameInput">{{scope.row.contactUserName}}
                        <i class="el-icon-edit" @click="isShowEditInput(scope.$index,'isNameInput')"></i>
                      </span>
                      <el-input v-model="scope.row.contactUserName"   :ref="'isNameInput'+scope.$index" @blur="isShowEditInput(scope.$index,'isNameInput')" v-if="scope.row.isNameInput"></el-input> -->
                      <el-form :model="scope.row" :ref="'contactUserName'+scope.$index" :rules="rules" style="margin:18px 0;" >
                        <el-form-item prop="contactUserName" >
                          <el-input v-model="scope.row.contactUserName" @keyup.enter.native="submitForm"></el-input>
                        </el-form-item>
                      </el-form>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="手机号"
                  >
                    <template scope="scope">
                      <!-- <span v-if="!ruleForm.materialContacts[scope.$index].isPhoneInput">{{scope.row.contactPhone}}
                        <i class="el-icon-edit" @click="isShowEditInput(scope.$index,'isPhoneInput')"></i>
                      </span>
                      <el-input v-model="scope.row.contactPhone" :ref="'isPhoneInput'+scope.$index" @blur="isShowEditInput(scope.$index,'isPhoneInput')" v-if="scope.row.isPhoneInput"></el-input> -->
                      <el-form :model="scope.row" :ref="'contactPhone'+scope.$index" :rules="rules" style="margin:18px 0;">
                       <el-form-item prop="contactPhone" style="margin:18px 0;">
                          <el-input v-model="scope.row.contactPhone"  @keyup.enter.native="submitForm"></el-input>
                        </el-form-item>
                       </el-form>

                    </template>
                  </el-table-column>
                  <el-table-column
                    label="邮箱"
                  >
                    <template scope="scope">
                      <!-- <span v-if="!ruleForm.materialContacts[scope.$index].isEmailInput">{{scope.row.contactEmail}}
                        <i class="el-icon-edit" @click="isShowEditInput(scope.$index,'isEmailInput')"></i>
                      </span>
                      <el-input v-model="scope.row.contactEmail" :ref="'isEmailInput'+scope.$index"  @blur="isShowEditInput(scope.$index,'isEmailInput')" v-if="scope.row.isEmailInput"></el-input> -->
                      <el-form :model="scope.row" :ref="'contactEmail'+scope.$index" :rules="rules" style="margin:18px 0;">
                        <el-form-item prop="contactEmail"   style="margin:18px 0;">
                          <el-input v-model="scope.row.contactEmail"  @keyup.enter.native="submitForm"></el-input>
                        </el-form-item>
                      </el-form>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template scope="scope">
                      <el-button
                        size="small"
                        type="danger"
                        @click="handleDelete(scope.$index,ruleForm.materialContacts)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-form-item>

            <el-form-item label="主任："  prop="director">
              <el-col :span="24">
                <el-button type="primary"  size="small" @click="chooseProjectDirector" style="margin-right:10px;">选择</el-button>
                <!--<span>{{projectDirectorData[0].name}}</span>-->
                <el-tag
                  v-for="(tag,index) in projectDirectorData"
                  :key="tag.realname"
                  :closable="true"
                  type="info"
                  @close="handleDirectorClose(index)"
                >
                  {{tag.realname}}
                </el-tag>
                <br>
              </el-col>
            </el-form-item>

            <el-form-item label="项目编辑：" required prop="materialProjectEditors">
              <el-col :span="24">
                <el-button type="primary"  size="small" @click="chooseProjectEditor" style="margin-right:10px;">选择</el-button>
                <el-tag
                  class="marginR10"
                  v-for="(tag,index) in ruleForm.materialProjectEditors"
                  :key="index"
                  :closable="true"
                  type="info"
                  @close="handleEditorClose(index)"
                >
                  {{tag.realname}}
                </el-tag>
                <br>
              </el-col>
            </el-form-item>
            <el-form-item label="项目编辑权限：" prop="projectEditorPowers">
              <el-select v-model="material.projectEditorPowers" multiple @change="projectSelectChange" placeholder="请选择" style="width:600px">
                <el-option
                  v-for="item in powerOptions"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                  >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="策划编辑权限：" prop="cehuaPowers">
              <el-select v-model="material.cehuaPowers" multiple @change="cehuaSelectChange" placeholder="请选择" style="width:600px">
                <el-option
                  v-for="item in powerOptions"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="邮寄地址：" prop="mailAddress"  class="pull-left">
              <el-col>
                <el-input v-model="material.mailAddress" style="width:600px" @keyup.enter.native="submitForm"></el-input>
              </el-col>
            </el-form-item>
            <div class="clearfix"></div>
            <el-form-item label="选项：">
              <el-col>
                <el-table
                  :data="listTableData"
                  border
                  style="width: 100%">
                  <el-table-column
                    prop="name"
                    label="名称"
                  >
                  </el-table-column>
                  <el-table-column
                    label="是否使用"
                    width="150"
                    align="center"
                    >
                    <template scope="scope">
                      <el-checkbox v-model="scope.row.usecheck" @change="optionChange(scope.row)"></el-checkbox>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="是否必填"
                    width="150"
                    align="center">
                    <template scope="scope">
                      <el-checkbox v-if="!scope.row.show" v-model="scope.row.needcheck" :disabled="scope.row.usecheck?false:true"></el-checkbox>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-form-item>

            <el-form-item label="扩展项：">
              <el-col :span="12">
                <el-button type="primary"  size="small" @click="addExtend">新增扩展项</el-button>
                <br>
                <el-table
                  :data.sync="ruleForm.materialExtensions"
                  border
                  style="width: 100%">
                  <el-table-column
                    label="名称"
                  >
                    <template scope="scope">
                      <!-- <span v-if="!ruleForm.materialExtensions[scope.$index].extendIsNameInput">{{scope.row.extensionName}}
                        <i class="el-icon-edit" @click="extendShowInput(scope.$index,'extendIsNameInput')"></i>
                      </span>
                      <el-input v-model="scope.row.extensionName" :ref="'extendIsNameInput'+scope.$index" @blur="extendShowInput(scope.$index,'extendIsNameInput')" v-if="ruleForm.materialExtensions[scope.$index].extendIsNameInput"></el-input> -->
                      <el-form :model="scope.row" :ref="'extensionName'+scope.$index" :rules="rules" style="margin:18px 0;">
                       <el-form-item prop="extensionName" style="margin:18px 0;">
                        <el-input v-model="ruleForm.materialExtensions[scope.$index].extensionName" placeholder="请输入名称" @keyup.enter.native="submitForm"></el-input>
                       </el-form-item>
                      </el-form>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="是否必填"
                    align="center"
                    width="150">
                    <template scope="scope">
                      <el-checkbox v-model="scope.row.isRequired"></el-checkbox>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="操作"
                    align="center"
                    width="150">
                    <template scope="scope">
                      <el-button
                        size="small"
                        type="danger"
                        @click="handleDelete(scope.$index, ruleForm.materialExtensions)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-form-item>

            <el-form-item label="申报通知扫描图片及通知主要内容：" prop="notice">
              <!--<el-col :span="24">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 8, maxRows: 12}"
                  placeholder="请输入内容"
                  v-model="material.notice" @keyup.enter.native="submitForm">
                </el-input>
              </el-col>-->
              <el-col :span="24">
                <Editor ref="editor" :config="editorConfig" ></Editor>
              </el-col>
            </el-form-item>
                <el-form-item label="上传通知扫描图片：" prop="noticeFiles">
                  <my-upload
                    class="upload"
                    :auto-upload="true"
                    name="file"

                    action="/pmpheep/file/image/upload"
                    :on-remove="imgUploadChange"
                    :on-success="imgUploadSuccess"
                    :before-upload="imgBeforeUpload"
                    :file-list="material.noticeFiles">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <!--action="/pmpheep/material/upTempFile"-->
                  </my-upload>
                </el-form-item>
            <!--<el-form-item label="备注：" prop="note">
              <el-col :span="24">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 8, maxRows: 12}"
                  placeholder="请输入内容"
                  v-model="material.note" @keyup.enter.native="submitForm">
                </el-input>
              </el-col>
            </el-form-item>-->
            <el-form-item label="备注："  >
              <el-col :span="24">
                <EditorNote ref="editorNote" :config="editorNoteConfig" ></EditorNote>
              </el-col>
            </el-form-item>

            <el-form-item label="附件：" prop="noteFiles">
              <el-col :span="12">
                <my-upload
                  class="upload"
                  action="/pmpheep/material/upTempFile"
                  name="files"
                  :auto-upload="true"
                  :on-remove="fileUploadChange"
                  :before-upload="fileBeforeUpload"
                  :on-success="fileUploadSuccess"
                  :file-list="material.noteFiles">
                  <el-button size="small" type="primary" >点击上传</el-button>
                </my-upload>
              </el-col>
            </el-form-item>

            <el-form-item class="text-center">
              <el-button icon="arrow-left" type="primary" @click="back()">返回</el-button>
              <el-button type="primary"  @click="openPreventDialog">预览</el-button>
              <el-button type="primary" @click="submitForm" :loading="isloading">下一步</el-button>
            </el-form-item>

          </el-form>

      <el-dialog :title="chooseTitle" :visible.sync="chooseVisiable" size="large" top="5%" @close="closeDialog">
          <user-pmph select :radio="!Multichoice" :clearTableSelect.sync="clearTableSelect"  @selection-change="conactPersonChange">
            <el-button  type="primary" @click="addCheckedConact()">增加</el-button>
          </user-pmph>
      </el-dialog>
      <!-- 预览对话框 -->
      <el-dialog
        title=""
        :visible.sync="showPreventDialog"
        size="large">

        <div style="padding:0 10%;">
          <el-form label-width="125px">
            <p class="material-notice-title text-center">
              {{material.materialName}}
            </p>
            <p class="material-notice-time text-center">
              截止日期：{{$commonFun.getnowDate(material.actualDeadline)}}
            </p>

            <div id = "msg_content">
              <div class = "table" style = "display: table;border-collapse: separate;border-spacing: 0em 1em;">
                <div class = "table_row" style = "display: table-row;padding: 1em 0em;">
                  <div style = "text-align-last: justify;width: 5em;display: table-cell;">简介</div><span class = "cell_2" style = "display: table-cell;padding: 0px 0.5em;">：</span>
                  <div  style="display: table-cell;margin:0 auto;">
                    <p v-html="preventContent" class="p_content"></p>
                  </div>
                </div>

                <div class = "table_row" style = "display: table-row;padding: 1em 0em;" v-if="ruleForm.materialNoticeAttachments">
                  <div style = "text-align-last: justify;width: 5em;display: table-cell;"></div><span class = "cell_2" style = "display: table-cell;padding: 0px 0.5em;">&emsp;</span>
                  <div  style="display: table-cell;margin:0 auto;">
                    <p v-for="(item,index) in ruleForm.materialNoticeAttachments" :key="index" style="text-align: center;"><img  :src="item.url"  /></p>
                    <!--<p v-for="(item,index) in material.noticeFiles" :key="index" style="text-align: center;"><img  :src="'/pmpheep/image/'+item.url"  /></p>-->
                  </div>
                </div>



                <div class = "table_row" style = "display: table-row;padding: 1em 0em;">
                  <div style = "text-align-last: justify;width: 5em;display: table-cell;">备注</div><span class = "cell_2" style = "display: table-cell;padding: 0px 0.5em;">：</span>
                  <div  style="display: table-cell;margin:0 auto;">
                    <p v-html="noteText" class="p_content"></p>
                  </div>
                </div>
                <div class = "table_row" style = "display: table-row;padding: 1em 0em;">
                  <div style = "text-align-last: justify;width: 5em;display: table-cell;">邮寄地址</div><span class = "cell_2" style = "display: table-cell;padding: 0px 0.5em;">：</span>
                  <div style="display: table-cell">
                    <p>北京市朝阳区潘家园南里19号人卫大厦B座</p>
                  </div>
                </div>
                <div class = "table_row" style = "display: table-row;padding: 1em 0em;">
                  <div style = "text-align-last: justify;width: 5em;display: table-cell;">联&nbsp;系&nbsp;人</div><span class = "cell_2" style = "display: table-cell;padding: 0px 0.5em;">：</span>
                  <div style="display: table-cell">
                    <p v-for="(contact,index) in ruleForm.materialContacts" >
                        {{contact.contactUserName}} (电话：{{contact.contactPhone}}, Email：{{contact.contactEmail}} )
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="table">
                <div class = "table_row" style = "display: table-row;padding: 1em 0em;" v-if="show_until_save_msg">
                  <div style = "text-align-last: justify;width: 5em;display: table-cell;" >附件</div><span class = "cell_2" style = "display: table-cell;padding: 0px 0.5em;">：</span>
                  <div style="display: table-cell">
                    <p type="text" style="color:#337ab7" v-for="(item,index) in ruleForm.materialNoteAttachments" :key="index" @click="download(item.url)">{{item.name}}</p>
                  </div>
                </div>
            </div>

          </el-form>
        </div>

        <div style="text-align: center;">
          <el-button type="primary" v-if="msg_save_btn_show" @click="saveMsg" :loading="isloading">保存通知详情</el-button>
        </div>

      </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
import 'url-search-params-polyfill';
import userPmph from "components/user-pmph";
import Editor from "../../../../components/Editor.vue";
import EditorNote from  "../../../../components/EditorNote.vue";
export default {
  data() {
    return {
      mytest:false,
      materialTypeUrl:'/pmpheep/books/list/materialType',//教材分类url
      addNewmaterialUrl:'/pmpheep/material/add' ,   //新增教材url
      editMaterialUrl:'/pmpheep/material/get',     //请求教材详细信息URL
      updateMaterialUrl:'/pmpheep/material/update',  //更新教材url
      api_msg_save:'/pmpheep/material/extra/update', //保存教材信息
      labelPosition: "right",
      mainContent: "",
      remark: "",
      isloading:false,
      dialogVisiable: false,
      chooseVisiable: false, // 选择弹窗
      chooseTitle: "", // 选择弹出窗的title
      Multichoice: true, // 是否可以多选，传递给Departments子组件
      classify: "", // 分类
      projectDirectorData: [], // 项目主任
      checkedTreeData: [],   //教材分类树
      show_until_save_msg:true,
      msg_save_btn_show:false,
      defaultProps: {
        // 树结构
        children: "childrenMaterialTypeVO",
        label: "typeName",
        value:'id'
      },
      checkedConactPersonData:[],
      clearTableSelect:false,
      powerOptions:[
        {
              label:'修改教材通知',
              id:0
            },
            {
              label:'分配策划编辑',
              id:1
            },
            {
              label:'遴选主编副主编',
              id:2
            },
            {
              label:'遴选编委',
              id:3
            },
            {
              label:'名单确认',
              id:4
            },
            {
              label:'最终结果公布',
              id:5
            },
            {
              label:'创建小组',
              id:6
            },
            {
              label:'强制结束整套教材',
              id:7
            },
      ],
      listTableData: [
        {
          name: "书籍多选",
          key: "material.isMultiBooks",
          usecheck: false,
          show: true
        },
        {
          name: "职位多选",
          key:'material.isMultiPosition',
          usecheck: false,
          show: true
        },
        {
          name: "数字编委遴选",
          key:'material.isDigitalEditorOptional',
          usecheck: false,
          show: true
        },
        {
          name: "主要学习经历",
          key:'material.isEduExpUsed',
          requiredKey:'material.isEduExpRequired',
          usecheck: false,
          needcheck: false
        },
        {
          name: "主要工作经历",
          key:'material.isWorkExpUsed',
          requiredKey:'material.isWorkExpRequired',
          usecheck: false,
          needcheck: false
        },
        {
          name: "主要教学经历",
          key:'material.isTeachExpUsed',
          requiredKey:'material.isTeachExpRequired',
          usecheck: false,
          needcheck: false
        },
        {
          name: "个人成就",
          key:'material.isAchievementUsed',
          requiredKey:'material.isAchievementRequired',
          usecheck: false,
          needcheck: false
        },
        {
          name: "主要学术兼职",
          key:'material.isAcadeUsed',
          requiredKey:'material.isAcadeRequired',
          usecheck: false,
          needcheck: false
        },
        {
          name: "本套上版教材参编情况",
          key:'material.isLastPositionUsed',
          requiredKey:'material.isLastPositionRequired',
          usecheck: false,
          needcheck: false
        },
        {
          name: "精品课程建设情况",
          key:'material.isCourseUsed',
          requiredKey:'material.isCourseRequired',
          usecheck: false,
          needcheck: false
        },
        /* {
          name: "国家级精品课程建设情况",
          key:'material.isNationalCourseUsed',
          requiredKey:'material.isNationalCourseRequired',
          usecheck: false,
          needcheck: false
        },
        {
          name: "省部级精品课程建设情况",
          key:'material.isProvincialCourseUsed',
          requiredKey:'material.isProvincialCourseRequired',
          usecheck: false,
          needcheck: false
        },
        {
          name: "学校精品课程建设情况",
          key:'material.isSchoolCourseUsed',
          requiredKey:'material.isSchoolCourseRequired',
          usecheck: false,
          needcheck: false
        }, */
        {
          name: "主编国家规划教材情况",
          key:'material.isNationalPlanUsed',
          requiredKey:'material.isNationalPlanRequired',
          usecheck: false,
          needcheck: false
        },
        {
          name: "人卫社教材编写情况",
          key:'material.isPmphTextbookUsed',
          requiredKey:'material.isPmphTextbookRequired',
          usecheck: false,
          needcheck: false
        },
        {
          name: "主编学术专著情况",
          key:'material.isMonographUsed',
          requiredKey:'material.isMonographRequired',
          usecheck: false,
          needcheck: false
        },
        {
          name: "其他社教材编写情况",
          key:'material.isTextbookUsed',
          requiredKey:'material.isTextbookRequired',
          usecheck: false,
          needcheck: false
        },
        {
          name: "参加人卫慕课、数字教材编写情况",
          key:'material.isMoocDigitalUsed',
          requiredKey:'material.isMoocDigitalRequired',
          usecheck: false,
          needcheck: false
        },
        {
          name: "科研情况",
          key:'material.isResearchUsed',
          requiredKey:'material.isResearchRequired',
          usecheck: false,
          needcheck: false
        },
        {
          name: "出版行业获奖情况",
          key:'material.isPublishRewardUsed',
          requiredKey:'material.isPublishRewardRequired',
          usecheck: false,
          needcheck: false
        },
        {
          name: "SCI论文投稿及影响因子",
          key:'material.isSciUsed',
          requiredKey:'material.isSciRequired',
          usecheck: false,
          needcheck: false
        },
        {
          name: "临床医学获奖情况",
          key:'material.isClinicalRewardUsed',
          requiredKey:'material.isClinicalRewardRequired',
          usecheck: false,
          needcheck: false
        },
        {
          name: "学术荣誉授予情况",
          key:'material.isAcadeRewardUsed',
          requiredKey:'material.isAcadeRewardRequired',
          usecheck: false,
          needcheck: false
        },
        {
          name: "编写内容意向",
          key:'material.isIntentionUsed',
          requiredKey:'material.isIntentionRequired',
          usecheck: false,
          needcheck: false
        },
      ],
      material:{
         id:'',
         materialName:'',
         materialRound:'',
         deadline:''  ,
         actualDeadline:'',
         ageDeadline:'',
         materialType:[],
         materialContacts:[],
         director:'',
         materialProjectEditors:[],
         projectEditorPowers:[],
         cehuaPowers :[],
         mailAddress:'',
         noticeFiles:[],
         noteFiles:[],
         notice:'',
         note:'',
      },
      ruleForm: {
        "material.materialName": "",
        "material.materialRound": "",
        deadline: "",
        actualDeadline: "",
        ageDeadline: "",
        "material.mailAddress": "",
         materialContacts:[],     //联系人
        "material.director": "",   //主任
         materialProjectEditors:[], //项目编辑
         materialExtensions:[],   //扩展项
         "materialExtra.notice":'',
         "materialExtra.note":'',
          /* noticeFiles:[],
          noteFiles:[], */
          materialNoticeAttachments:[],
          materialNoteAttachments:[]

      },
      editorConfig: {
        initialFrameWidth: null,
        initialFrameHeight: 200
      },
      editorNoteConfig:{
        initialFrameWidth: null,
        initialFrameHeight: 200
      },
      preventContent:"",
      noteText:"",
      showPreventDialog:false,
      /* noticeFiles:[],
      noteFiles:[], */
      chooseBookData:[],
      rules: {
        materialName: [
          { required: true, message: "请输入教材名称", trigger: "blur" },
          {min:1,max:50,message:'教材名称不能超过50个字符',trigger:'change,blur'}
          ],
        materialRound: [
          { required: true, message: "请输入教材轮次", trigger: "blur" },
          {min:0,max:10,message:'轮次不能超过10个字符',trigger:'blur'},
          {validator:this.$formCheckedRules.numberChecked,trigger: "blur"},
          {validator:this.$formCheckedRules.positiveChecked,trigger: "blur"},
          ],
        actualDeadline:[{type:'date', required: true, message: "请选择日期", trigger: "change" }],
        deadline:[{ type:'date',required: true, message: "请选择日期", trigger: "change" }],
        ageDeadline:[{type:'date', required: true, message: "请选择日期", trigger: "change" }],
        materialType:[{type:'array', required: true, message: "请选择教材分类", trigger: "change" }],
        materialContacts:[{type:'array', required: true,message:'请至少选择一个联系人' ,trigger: "change" }],
        director:[{type:'number', required: true, message: "请选择主任", trigger: "change" }],
        materialProjectEditors:[{type:'array', required: true,message:'请至少选择一个项目编辑' ,trigger: "change" }],
        projectEditorPowers:[{type:'array', required: true,message:'请指定至少一个项目编辑权限' ,trigger: "change" }],
        cehuaPowers:[{type:'array', required: true,message:'请指定至少一个策划编辑权限' ,trigger: "change" }],
        mailAddress:[
          { required: true, message: "邮寄地址不能为空", trigger: "blur" },
          {min:1,max:100,message:'邮寄地址不能超过100个字符',trigger:'change,blur'}
          ],
        contactUserName:[
         {required: true, message: "请填写姓名", trigger: "blur" },
         {min:1,max:20,message:'姓名不能超过20个字符',trigger:'change,blur'}
        ],
        contactPhone:[
         {required: true, message: "请填写手机号码", trigger: "blur" },
         {validator:this.$formCheckedRules.phoneNumberChecked,trigger: "blur"}
        ],
        contactEmail:[
          {required: true, message: "请填写邮箱", trigger: "blur" },
          { min: 1, max: 40, message: "邮箱不能超过40个字符", trigger: "change,blur" },
          { type: "email", message: "邮箱格式不正确", trigger: "blur,change" }
        ],
        extensionName:[
          {required: true, message: "请填写名称", trigger: "blur" },
          {min:1,max:100,message:'不能超过100个字符',trigger:'change,blur'}
        ],
        noticeFiles:[
          {type:'array',required: false, message: "请至少上传一张图片", trigger: "blur" },
        ],
        noteFiles:[
          {type:'array',required: true, message: "请至少上传一个文件", trigger: "blur" },
        ],
        notice:[
          {required: true, message: "请填写主要内容", trigger: "blur" },
          {min:1,max:2000,message:'内容不能超过2000个字符',trigger:'blur'}
          ],
        note:[
          {min:1,max:2000,message:'备注不能超过2000个字符',trigger:'blur'}
          ]

      },
      pickOptionsAct:{
         disabledDate(time) {

           //console.log(material.deadline);
          // return time.getTime() < Date.now() - 8.64e7;
        }
      },
      pickOptionsShow:{
         disabledDate(time) {
         //  return time.getTime() < Date.now() - 8.64e7;
        }
      },
    };
  },
  computed:{
   isCkeckNumEdiotr(){
     return this.listTableData[2].usecheck;
   },
   isCheckJob(){
     return this.listTableData[1].usecheck;
   }
  },
  watch:{
   isCkeckNumEdiotr(val){
     if(val){
       this.listTableData[1].usecheck=val;
     }
   },
   isCheckJob(val){
     if(this.isCkeckNumEdiotr){
       this.listTableData[1].usecheck=true;
     }
   }
  },
  created() {
    this.initEditData();
    this.getBookType();
  },
  mounted () {
    document.onkeydown = function() {
      if(window.event.keyCode==13) {
        return false;
      }
      }
  },
  methods: {
          /**
       * 获取教材分类树数据
       */
      getBookType(){
        this.$axios.get(this.materialTypeUrl)
          .then((res)=>{
            if(res.data.code==1){
               this.chooseBookData=res.data.data.childrenMaterialTypeVO;
            }
          })
          .catch(e=>{
            console.log(e);
          })
      },
      //修改教材初始化
      initEditData(){
        if(this.$router.currentRoute.params.materialId!='new'){
          console.log('修改');
          console.log(this.listTableData);
           this.$axios.get(this.editMaterialUrl,{
             params:{
               id:this.$router.currentRoute.params.materialId
             }
           }).then((res)=>{
             console.log(res);
             if(res.data.code==1){
               this.ruleForm['material.id']=res.data.data.material.id;
               this.ruleForm['materialExtra.id']=res.data.data.materialExtra?res.data.data.materialExtra.id:'';
               //选项赋值
               for(var i in this.listTableData){
                    this.listTableData[i].usecheck=res.data.data.material[this.listTableData[i].key.split('.')[1]];
                  if(this.listTableData[i].requiredKey){
                    this.listTableData[i].needcheck=res.data.data.material[this.listTableData[i].requiredKey.split('.')[1]];
                  }
               }
             //material对象赋值
               for(var m in this.material){
                 if(res.data.data.material[m]){
                   if(m=='actualDeadline'||m=='ageDeadline'||m=='deadline'){
                     this.material[m]=new Date(res.data.data.material[m]);
                     this.ruleForm[m]=new Date(res.data.data.material[m]);
                   }else if(m=='materialType'){}
                   else{
                     this.material[m]=m=='materialRound'?res.data.data.material[m]+'':res.data.data.material[m];
                   }
                 }
               }
               //教材分类赋值
               var typeArr=res.data.data.materialType.replace(/\[|\]/g,'').split(',');
                  for(var k in typeArr){
                    typeArr[k]=parseInt(typeArr[k]);
                  }
                 this.material.materialType=typeArr;
                 this.ruleForm.materialType= typeArr;
             //主任赋值
              this.projectDirectorData=[{id:this.material.director,realname:res.data.data.directorName}];
             //联系人赋值
              this.ruleForm.materialContacts=this.stringToArray(res.data.data.materialContacts);
              this.material.materialContacts=this.stringToArray(res.data.data.materialContacts);
              console.log(this.ruleForm.materialContacts)
               //项目编辑赋值
              this.ruleForm.materialProjectEditors=this.stringToArray(res.data.data.materialProjectEditors);
              this.material.materialProjectEditors=this.stringToArray(res.data.data.materialProjectEditors);
              //内容备注赋值
              this.material.notice=res.data.data.materialExtra?res.data.data.materialExtra.notice:'';
              this.material.note=res.data.data.materialExtra?res.data.data.materialExtra.note:'';
              //扩展项赋值
              this.ruleForm.materialExtensions=this.stringToArray(res.data.data.materialExtensions);
              //文件赋值
              var noticeArr=this.stringToArray(res.data.data.materialNoticeAttachments);
              for(var i in noticeArr){
                  this.ruleForm.materialNoticeAttachments.push({
                    id:noticeArr[i].id,
                    attachment:'/pmpheep/image/'+noticeArr[i].attachment,
                    url:'/pmpheep/image/'+noticeArr[i].attachment,
                    attachmentName:noticeArr[i].attachmentName,
                  })
                  this.material.noticeFiles.push({
                    id:noticeArr[i].id,
                    name:noticeArr[i].attachmentName,
                    url:noticeArr[i].attachment
                  })
              }
             // this.material.noticeFiles=this.ruleForm.materialNoticeAttachments;
              //this.noticeFiles=this.ruleForm.materialNoticeAttachments;
              var noteArr=this.stringToArray(res.data.data.materialNoteAttachments);
              for(var i in noteArr){
                  this.ruleForm.materialNoteAttachments.push({
                    id:noteArr[i].id,
                    attachment:'/pmpheep/file/note/download/'+noteArr[i].attachment,
                    url:'/pmpheep/file/note/download/'+noteArr[i].attachment,
                    name:noteArr[i].attachmentName,
                  })
                 this.material.noteFiles.push({
                   id:noteArr[i].id,
                    name:noteArr[i].attachmentName,
                    url:noteArr[i].attachment
                 })
              }
              //this.material.noteFiles=this.ruleForm.materialNoteAttachments;
              //this.noteFiles=this.ruleForm.materialNoteAttachments;
              //编辑权限赋值
              this.ruleForm.cehuaPowers=res.data.data.cehuaPowers;
              this.ruleForm.projectEditorPowers=res.data.data.projectEditorPowers;
               var cehuaArr=res.data.data.cehuaPowers.split('');
               var projectArr=res.data.data.projectEditorPowers.split('');
               for(var i in cehuaArr){
                  if(cehuaArr[i]==1){
                    this.material.cehuaPowers.push(parseInt(i));
                  }
               }
               for(var i in projectArr){
                  if(projectArr[i]==1){
                    this.material.projectEditorPowers.push(parseInt(i));
                  }
               }
               this.ruleForm.noteContent=res.data.data.noteContent||{};
               this.ruleForm.descriptionContent=res.data.data.descriptionContent||{};
               let _this=this;
               setTimeout(function() {
                 if(!_this.$commonFun.Empty(_this.material.note)){_this.$refs.editorNote.setContent(_this.material.note)}else{
                   // _this.$refs.editorNote.setContent("");
                 };
                 if(!_this.$commonFun.Empty(_this.material.notice)){
                   _this.$refs.editor.setContent(_this.material.notice)
                 }
                 else{
                   // _this.$refs.editor.setContent("");
                 };
               },1000);
             }
           })
        }
      },
      /* 字符串转数组 */
      stringToArray(str){
        var arr=str.replace(/\[|\]/g,'').split('},');
        var result=[];
        if(arr[0]!=''){
            for(var j=0;j<arr.length;j++){
           result.push((j==arr.length-1)?(JSON.parse(arr[j])):(JSON.parse(arr[j]+'}')));
          }
        }
        return result;
      },
      /* 选择教材分类 */
      materialHandleChange(val){
        this.material.materialType=val;
        console.log(val);
        this.ruleForm.materialType=val;
      },
      /* 联系人点击切换输入编辑框 */
      isShowEditInput(num,str){
        this.ruleForm.materialContacts[num][str]=!this.ruleForm.materialContacts[num][str];
        var arr=this.ruleForm.materialContacts;
        this.ruleForm.materialContacts=[];
        this.ruleForm.materialContacts=arr;
        if(this.ruleForm.materialContacts[num][str]){
          //聚焦
          this.$nextTick(_ => {
                this.$refs[str+num].$refs.input.focus()
          })

        }
      },
      /* 选项checkbox改变 */
      optionChange(obj){
        if(!obj.usecheck){
          obj.needcheck=false;
        }
      },
      download(url){
        this.$commonFun.downloadFile(url);
      },
      /* 联系人选择 */
      conactPersonChange(val){
        this.checkedConactPersonData=val;
        console.log(this.checkedConactPersonData);
      },
      /* 权限选择改变 */
      projectSelectChange(val){
          var arr=[0,0,0,0,0,0,0,0];
          for(var j in val){
            arr[val[j]]=1;
          }
          this.ruleForm.projectEditorPowers=arr.join().replace(/,/g,'');
      },
      cehuaSelectChange(val){
          var arr=[0,0,0,0,0,0,0,0];
          for(var j in val){
            arr[val[j]]=1;
          }
          this.ruleForm.cehuaPowers=arr.join().replace(/,/g,'');
      },
      /* 增加 */
      addCheckedConact(){
        if(this.classify == "contact"){
          for(var i in this.checkedConactPersonData){
               /* 去重 */
              if(this.removeRepeat(this.ruleForm.materialContacts,this.checkedConactPersonData[i])){
                  this.ruleForm.materialContacts.push(
                    {
                      contactUserId:this.checkedConactPersonData[i].id,
                      contactUserName:this.checkedConactPersonData[i].realname,
                      contactPhone:this.checkedConactPersonData[i].handphone,
                      contactEmail:this.checkedConactPersonData[i].email,
                      sort:this.checkedConactPersonData[i].sort
                    }
                  );
                  this.material.materialContacts.push(
                    {
                      contactUserId:this.checkedConactPersonData[i].id,
                      contactUserName:this.checkedConactPersonData[i].realname,
                      contactPhone:this.checkedConactPersonData[i].handphone,
                      contactEmail:this.checkedConactPersonData[i].email,
                      sort:this.checkedConactPersonData[i].sort
                    }
                  );
               }
           }
         /* if(!this.$commonFun.Empty(this.ruleForm.materialContacts)&&!this.$commonFun.Empty(this.material.materialContacts)){
            this.$message({
              message: `添加成功！`,
              type: "success"
            });
          }*/
          console.log('12312',this.ruleForm.materialContacts);
         }
         else if(this.classify == "director"){
                 this.projectDirectorData=[];
                 this.projectDirectorData.push(this.checkedConactPersonData[0]);
                // this.ruleForm['material.director']=this.projectDirectorData[0].id;
                 this.material.director=this.projectDirectorData[0].id;
                 this.$refs.ruleForm.validateField('director');
          /*if(!this.$commonFun.Empty(this.projectDirectorData)){
            this.$message({
              message: `添加成功！`,
              type: "success"
            });
          }*/
           console.log('主任',this.projectDirectorData,this.material.director)
         }
         else if(this.classify == 'editor'){
          for(var i in this.checkedConactPersonData){
               /* 去重 */
              if(this.removeRepeat(this.ruleForm.materialProjectEditors,this.checkedConactPersonData[i])){
                  this.ruleForm.materialProjectEditors.push({editorId:this.checkedConactPersonData[i].id,realname:this.checkedConactPersonData[i].realname});
                  this.material.materialProjectEditors.push({editorId:this.checkedConactPersonData[i].id,realname:this.checkedConactPersonData[i].realname});
               }
           }
           this.$refs.ruleForm.validateField('materialProjectEditors');
          /*if(!this.$commonFun.Empty(this.ruleForm.materialProjectEditors)&&!this.$commonFun.Empty(this.material.materialProjectEditors)){
            this.$message({
              message: `添加成功！`,
              type: "success"
            });
          }*/
           console.log('项目编辑',typeof(this.material.materialProjectEditors));
         }

       this.chooseVisiable=false;
      },
      /* 数组去重 */
    removeRepeat(arr,obj){
      for(var i in arr){
        if(arr[i].contactUserId==obj.id||arr[i].editorId==obj.id){
          return false;
        }
      }
      return true;
    },
    /* 选项合并到ruleForm中 */
    optionMerge(){
     for(var i in this.listTableData){
          this.ruleForm[this.listTableData[i].key]=this.listTableData[i].usecheck;
        if(this.listTableData[i].requiredKey){
          this.ruleForm[this.listTableData[i].requiredKey]=this.listTableData[i].needcheck;
         /*  console.log(this.listTableData[i].needcheck) */
        }
     }
    /*  console.log('11111',this.ruleForm);
     return true; */
    },
    /* 扩展项切换输入框 */
    extendShowInput(num,str){
      this.ruleForm.materialExtensions[num][str]=!this.ruleForm.materialExtensions[num][str];
      var arr=this.ruleForm.materialExtensions;
      this.ruleForm.materialExtensions=[];
      this.ruleForm.materialExtensions=arr;
      if(this.ruleForm.materialExtensions[num][str]){
        this.$nextTick(_ => {
                this.$refs[str+num].$refs.input.focus()
          })
      }

    },
    /* 文件上传改变 */
    /* 图片 */
    imgUploadChange(file,filelist){
     this.material.noticeFiles=filelist;   //表单验证用
      this.ruleForm.materialNoticeAttachments=[];
      /*filelist.forEach((item)=>{
        this.ruleForm.materialNoticeAttachments.push({id:item.id?item.id:null,attachment:item.response?item.response.data[0]:item.url});
      })*/
      filelist.forEach((item)=>{
        this.ruleForm.materialNoticeAttachments.push(
          {id:item.id?item.id:null,materialId:this.ruleForm["material.id"],attachment:item.response?item.response.data:item.url,url:item.response?('/pmpheep/image/'+item.response.data):('/pmpheep/image/'+item.url),attachmentName:item.name}
        );
        /*{id:item.id?item.id:null,attachment:item.response?item.response.data[0]:item.url,name:item.name}*/
      })
     console.log(file,filelist);
     this.$refs.ruleForm.validateField('noticeFiles');
    },
    imgBeforeUpload(file){
       for(var i in this.ruleForm.materialNoticeAttachments){
         if(this.ruleForm.materialNoticeAttachments[i].attachmentName==file.name){
           this.$confirm('请勿多次上传同一图片', "提示",{
           	confirmButtonText: "确定",
           	cancelButtonText: "取消",
           	showCancelButton: false,
           	type: "error"
           });
           return false;
         }
       }
       for(var i in this.material.noticeFiles){
         if(this.material.noticeFiles[i].name==file.name){
           this.$confirm('请勿多次上传同一图片', "提示",{
           	confirmButtonText: "确定",
           	cancelButtonText: "取消",
           	showCancelButton: false,
           	type: "error"
           });
           return false;
         }
       }

      var exStr=file.name.split('.').pop().toLowerCase();
      var exSize=file.size?file.size:1;
      if(exSize/ 1024 / 1024 > 20){
        this.$confirm('图片的大小不能超过20MB！', "提示",{
        	confirmButtonText: "确定",
        	cancelButtonText: "取消",
        	showCancelButton: false,
        	type: "error"
        });
       // this.material.noticeFiles.pop();
        return false;
      }
      if(exSize==0){
        this.$confirm('请勿上传空文件！', "提示",{
        	confirmButtonText: "确定",
        	cancelButtonText: "取消",
        	showCancelButton: false,
        	type: "error"
        });
       // this.material.noticeFiles.pop();
        return false;
      }
      if(exStr!='png'&&exStr!='jpg'&&exStr!='jpeg'){
        this.$confirm('图片的格式必须为png或者jpg或者jpeg格式！', "提示",{
        	confirmButtonText: "确定",
        	cancelButtonText: "取消",
        	showCancelButton: false,
        	type: "error"
        });
       // this.material.noticeFiles.pop();
        return false;
      }
      if(file.name.length>80){
        this.$confirm('图片名称不能超过80个字符！', "提示",{
        	confirmButtonText: "确定",
        	cancelButtonText: "取消",
        	showCancelButton: false,
        	type: "error"
        });
        //this.material.noticeFiles.pop();
        return false;
      }
    },
    imgUploadSuccess(res,file,filelist){
      console.log(filelist);
      this.material.noticeFiles=filelist;   //表单验证用
      this.ruleForm.materialNoticeAttachments=[];
      filelist.forEach((item)=>{
        this.ruleForm.materialNoticeAttachments.push(
          {id:item.id?item.id:null,materialId:this.ruleForm["material.id"],attachment:item.response?item.response.data:item.url,url:item.response?('/pmpheep/image/'+item.response.data):('/pmpheep/image/'+item.url),attachmentName:item.name}
          );
        /*{id:item.id?item.id:null,attachment:item.response?item.response.data[0]:item.url,name:item.name}*/
      })
      this.$refs.ruleForm.validateField('noticeFiles');
    },
    /* 文件 */
    fileUploadChange(file,filelist){
     this.material.noteFiles=filelist;   //表单验证用
      this.ruleForm.materialNoteAttachments=[];
      filelist.forEach((item)=>{
        this.ruleForm.materialNoteAttachments.push({id:item.id?item.id:null,attachment:item.response?item.response.data[0]:item.url,name:item.name});
      })
     this.$refs.ruleForm.validateField('noteFiles');
    },
    fileBeforeUpload(file){
        for(var i in this.ruleForm.materialNoteAttachments){
         if(this.ruleForm.materialNoteAttachments[i].name==file.name){
           this.$confirm('请勿多次上传同一附件', "提示",{
           	confirmButtonText: "确定",
           	cancelButtonText: "取消",
           	showCancelButton: false,
           	type: "error"
           });
           return false;
         }
       }
       for(var i in this.material.noteFiles){
         if(this.material.noteFiles[i].name==file.name){
           this.$confirm('请勿多次上传同一附件', "提示",{
           	confirmButtonText: "确定",
           	cancelButtonText: "取消",
           	showCancelButton: false,
           	type: "error"
           });
           return false;
         }
       }

     var exStr=file.name.split('.').pop().toLowerCase();
     var exSize=file.size?file.size:1;
     if(exSize/1024/1024>100){
        this.$confirm('附件大小不能超过100MB！', "提示",{
        	confirmButtonText: "确定",
        	cancelButtonText: "取消",
        	showCancelButton: false,
        	type: "error"
        });
       // this.material.noteFiles.pop();
        return false;
     }
     if(exSize==0){
        this.$confirm('请勿上传空文件！', "提示",{
        	confirmButtonText: "确定",
        	cancelButtonText: "取消",
        	showCancelButton: false,
        	type: "error"
        });
        //this.material.noteFiles.pop();
        return false;
     }
     if(exStr=='bat'||exStr=='com'||exStr=='exe'){
        this.$confirm('请勿上传可执行文件', "提示",{
        	confirmButtonText: "确定",
        	cancelButtonText: "取消",
        	showCancelButton: false,
        	type: "error"
        });
        //this.material.noteFiles.pop();
        return false;
     }
     if(file.name.length>80){
        this.$confirm('附件名称不能超过80个字符', "提示",{
        	confirmButtonText: "确定",
        	cancelButtonText: "取消",
        	showCancelButton: false,
        	type: "error"
        });
        //this.material.noteFiles.pop();
        return false;
     }
    },
    fileUploadSuccess(res,file,filelist){
     console.log(res,file,filelist);
     this.material.noteFiles=filelist;   //表单验证用
      this.ruleForm.materialNoteAttachments=[];
      filelist.forEach((item)=>{
        this.ruleForm.materialNoteAttachments.push({id:item.id?item.id:null,attachment:item.response?item.response.data[0]:item.url,name:item.name});
      })
      this.$refs.ruleForm.validateField('noteFiles');
    },
    /**
       * 删除选中的项目主任
       */
    handleDirectorClose(val) {
      // console.log(val)
      this.projectDirectorData.splice(val, 1);
      this.material.director='';
      this.$refs.ruleForm.validateField('director');
    },
    /**
       * 删除选中的项目编辑
       */
    handleEditorClose(val) {
      console.log(1111,val);

      this.ruleForm.materialProjectEditors.splice(val, 1);
      this.material.materialProjectEditors.splice(val, 1);
      this.$refs.ruleForm.validateField('materialProjectEditors');
    },
    /**
       * 返回上一级
       */
    back() {
      this.$router.go(-1);
    },
    handleNodeClick(data) {
      this.checkedTreeData = data;
      console.log(data);
    },
    /* 预览 */
    openPreventDialog(msg_save_btn_show){
      this.msg_save_btn_show = msg_save_btn_show === true;
      this.preventContent=this.$refs.editor.getContent();
      this.noteText = this.$refs.editorNote.getContent();
      this.showPreventDialog=true;
    },
    /**
     * 保存消息下一步
     */
    saveMsg(){
      let _this = this;

      this.show_until_save_msg = false;
      let msg_content = document.getElementById("msg_content").innerHTML;

      this.show_until_save_msg = true;
      //验证表单是否正确
      if(!(this.material.materialName&&this.material.materialName.length<50&&msg_content)){
        this.$confirm('标题和内容都不能为空', "提示",{
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          showCancelButton: false,
          type: "error"
        });
        return;
      }


      this.$confirm("确定保存通知详情？", "提示",{
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(()=>{
          _this.$axios.put(this.api_msg_save,this.$commonFun.initPostData({
            materialId:_this.material.id,
            content:msg_content,
            materialName:_this.material.materialName,
          }))
            .then((response)=>{
              let res = response.data
              if (res.code == '1'){
                _this.$message.success('保存成功！');
                _this.$router.push({name:'设置书目录'});
              }
            })
            .catch(e=>{

            })
        })
        .catch(e=>{})


    },
    /**
       *
       * @param index
       * @param row
       */
    // 删除数据
    handleDelete(index, data) {
      data.splice(index, 1);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    addExtend() {
      this.ruleForm.materialExtensions.push({
        extensionName: "",
        isNameInput: false,
        isRequired: false
      });
    },
    deleteExtend(index) {
      this.ruleForm.materialExtensions.splice(index, 1);
    },
    /**
       * 选择联系人
       */
    chooseContact() {
      this.chooseVisiable = true;
      this.chooseTitle = "选择联系人";
      this.Multichoice = true;
      this.classify = "contact";
    },
    /**
       * 项目主任设置
       */
    chooseProjectDirector() {
      this.chooseVisiable = true;
      this.chooseTitle = "项目主任设置";
      this.Multichoice = false;
      this.classify = "director";
    },
    /**
       * 项目编辑设置
       */
    chooseProjectEditor() {
      this.chooseVisiable = true;
      this.chooseTitle = "项目编辑设置";
      this.Multichoice = true;
      this.classify = "editor";
    },
    /**
       * 关闭弹出层
       */
    closeDialog() {
      this.clearTableSelect=!this.clearTableSelect;
    },
    /* 日期检查 */
    dateOptionsChecked(){
     console.log(this.material.actualDeadline,this.material.deadline)
     var actTime=new Date(this.material.actualDeadline);
     var showTime=new Date(this.material.deadline);
     if(actTime.getTime()>=showTime.getTime()){
       return true;
     }else{
       return false;
     }
    },
    /* 日期选择框格式化 */
    actDatePickGetTime(date){
     this.ruleForm.actualDeadline=date;
    },
    showDatePickGetTime(date){
     this.ruleForm.deadline=date;
    },
    ageDatePickGetTime(date){
     this.ruleForm.ageDeadline=date;
    },
    /* 合并material  ruleForm */
    mergeForms(){
      for(var i in this.material){
        if(i=='notice'||i=='note'){
          this.ruleForm['materialExtra.'+i]=this.material[i];
        }else if(i=='materialProjectEditors'||i=='noticeFiles'||i=='noteFiles'||i=='actualDeadline'||i=='deadline'||i=='ageDeadline'||i=='materialType'||i=='projectEditorPowers'||i=='cehuaPowers'){
          continue ;
        }else{
         this.ruleForm['material.'+i]=this.material[i];
        }
      }
      console.log(this.ruleForm);
    },
    /* 表单处理 */
    uploadFormMerge(obj){
      var paramdata = new URLSearchParams();
      //var formdata=new FormData();
         for(var i in obj){
            if(typeof(obj[i])=='object'){
             var arr=[];
                 for(var j in obj[i]){
                  arr.push(typeof(obj[i][j])=='object'?JSON.stringify(obj[i][j]):obj[i][j]);
                 }
                 paramdata.append(i,'['+arr.join()+']');
           }else{
               paramdata.append(i,obj[i])
           }

         }
         console.log(paramdata);
         return paramdata;
    },
    /* 表单内表格验证 */
    formTableChecked(){
      /* 联系人验证 */
      var checked=true;
      for(var i in this.ruleForm.materialContacts){
        this.$refs['contactUserName'+i].validate((valid)=>{
          if(!valid){
             checked=false;
          }
        })
        this.$refs['contactPhone'+i].validate((valid)=>{
          if(!valid){
             checked=false;
          }
        })
        this.$refs['contactEmail'+i].validate((valid)=>{
          if(!valid){
             checked=false;
          }
        })
      }
      //扩展项验证
      for(var j in this.ruleForm.materialExtensions){
        this.$refs['extensionName'+j].validate((valid)=>{
          if(!valid){
             checked=false;
          }
        })
      }

      return checked;
    },

    /* 提交表单 */
    submitForm(){
        let _this = this;
        this.ruleForm.noteContent["content"] = this.$refs.editorNote.getContent();
        this.ruleForm.descriptionContent["content"] = this.$refs.editor.getContent();
        this.material.note = this.$refs.editorNote.getContent();
        this.material.notice = this.$refs.editor.getContent();
        this.optionMerge()  //选项合并
        this.mergeForms();   //表单合并


        this.$refs.ruleForm.validate((valid) => {
          if (valid&&this.formTableChecked()) {
            if(!this.dateOptionsChecked()){
              this.$confirm('实际结束日期应大于展示结束日期', "提示",{
              	confirmButtonText: "确定",
              	cancelButtonText: "取消",
              	showCancelButton: false,
              	type: "error"
              });
               return false;
                }

              this.isloading=true;
               //提交
                  this.$axios.post(this.$router.currentRoute.params.materialId=='new'?this.addNewmaterialUrl:this.updateMaterialUrl,
                    this.uploadFormMerge(this.ruleForm)).then((res)=>{
                    console.log(res);
                    this.isloading=false;
                    if(res.data.code==1){
                      // this.$message.success('已保存教材通知');
                      _this.material.id = res.data.data;
                      _this.openPreventDialog(true);

                      //this.$router.push({name:'编辑通知详情',params:{materialId:res.data.data}});
                    }else{
                      this.$confirm(res.data.msg.msgTrim(), "提示",{
                      	confirmButtonText: "确定",
                      	cancelButtonText: "取消",
                      	showCancelButton: false,
                      	type: "error"
                      });
                    }
                  })


          } else {

            /*this.$confirm('输入的内容不正确，请正确填写', "提示",{
            	confirmButtonText: "确定",
            	cancelButtonText: "取消",
            	showCancelButton: false,
            	type: "error"
            });*/

           this.$nextTick(this.focuFuntion)
            return false;
          }
        });
    },
    focuFuntion(){
      let _this = this;
      console.log(_this.$refs.ruleForm.$el.getElementsByClassName("el-form-item is-error is-required")[0].getElementsByTagName("input")[0]);
      if(this.$refs.ruleForm.$el.getElementsByClassName("el-form-item is-error is-required")[0].getElementsByTagName("input").length>0){
        var ss= _this.$refs.ruleForm.$el.getElementsByClassName("el-form-item is-error is-required")[0].getElementsByTagName("input")[0];
          ss.focus();
      }else if(this.$refs.ruleForm.$el.getElementsByClassName("el-form-item is-error is-required")[0].getElementsByTagName("textarea").length>0){
        var ss= _this.$refs.ruleForm.$el.getElementsByClassName("el-form-item is-error is-required")[0].getElementsByTagName("textarea")[0];
        ss.focus();
      }
    }
  },
  components: {
    userPmph,
    Editor,
    EditorNote

  }
};
</script>

<style>
.upload {
  float: left;
}
.classify_input {
  width: 585px;
  margin-right: 20px;
}

.classify_button {
  color: #1abb9c;
}

.classify_button:hover {
  opacity: 0.9;
}
.checkTree_dialog .button {
  float: right;
}
.checkTree_dialog .tree_box {
  box-sizing: border-box;
  width: calc(100% - 100px);
  height: 200px;
  overflow-y: scroll;
  overflow-x: hidden;
  float: left;
}
.checkTree_dialog .tree_box::-webkit-scrollbar {
  display: none;
}

.checkTree_dialog .button {
  float: right;
}
.extend_list {
  width: 100%;
}
.extend_list .table-header {
  background-color: #d4d9dd;
}
.extend_list tr {
  border: 1px solid #d4d4d4;
}

.extend_list tr td {
  width: 25%;
  color: #5e5e5e;
  text-align: center;
  padding: 5px 0;
}

.extend_list tr td i {
  margin-left: 5px;
  cursor: pointer;
}
.extend_list .add_button {
  color: #1ab194;
}
.form-item{
  margin:182px 0 0 -150px;
}
  .cell_1{
    text-align-last: justify;
    width: 5em;
    display: table-cell;
  }
  .cell_2{
    display: table-cell;
    padding: 0px 0.5em;
  }
.material-notice-title.text-center{
  font-size: 24px;
  color: black;
}
.material-notice-time.text-center{
  color: #bdbdbd;
  padding-top: 10px;
  margin-bottom: 2em;
}
  .table_row{
    display: table-row;
    padding: 1em 0em;
  }
  .table{
    display: table;
    border-collapse: separate;
    border-spacing: 0em 1em;
  }
.app-main-border-box{
  box-sizing: border-box;
}
</style>
