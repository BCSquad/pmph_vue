import Vue from 'vue';
import Router from 'vue-router';


import Login from 'pages/Login.vue'
import Home from 'pages/Home.vue'

const Index = () => import('../pages/Index');
const NoFind = () => import('pages/404.vue');

/* 教材申报 */
import ApplicationRouter from '../pages/home/teachingMaterial/ApplicationRouter'
import ApplicationNav from '../pages/home/teachingMaterial/ApplicationNav'

const BooksSelect_1v3 = () => import('../pages/home/teachingMaterial/navContent/1v3')
const ApplicationList = () => import('../pages/home/teachingMaterial/navContent/ApplicationList')
const PressCheck = () => import('../pages/home/teachingMaterial/navContent/pressCheck')
const PressCheck_pmph = () => import('../pages/home/teachingMaterial/navContent/pressCheck-pmph')
const ExpertInfo = () => import('../pages/home/teachingMaterial/navContent/expertInfo')
const BookList = () => import('../pages/home/teachingMaterial/navContent/BookList')
const Notice = () => import('../pages/home/teachingMaterial/navContent/Notice')
const Chief = () => import('../pages/home/teachingMaterial/navContent/Chief')
const NewChooseBooks = () => import('pages/home/teachingMaterial/navContent/newChooseBooks')
const ApplicationSchoolQuery = () => import('pages/home/teachingMaterial/navContent/SchoolQuery')
const Result = () => import('pages/home/teachingMaterial/navContent/Result/index')
const EditNotice = () => import('pages/home/teachingMaterial/navContent/EditNotice')
const SetTopicNum = () => import('pages/home/teachingMaterial/navContent/SetTopicNum')

/*临床决策专家申报*/
import ClinicalDecisionRouter from '../pages/home/clinicalDecision/ClinicalDecisionRouter'
import ClinicalDecisionNav from '../pages/home/clinicalDecision/ClinicalDecisionNav'

const ClinicalDecisionNewChooseBooks = () => import('../pages/home/clinicalDecision/navContent/ClinicalDecisionNewChooseBooks')

const ClinicalSchoolQuery = () => import('../pages/home/clinicalDecision/navContent/SchoolQuery')

const  ChineseMedicineAssistantRouter= () => import('../pages/home/clinicalDecision/navContent/ChineseMedicineAssistantRouter')
const  ChineseMedicineAssistantTableRouter= () => import('../pages/home/clinicalDecision/navContent/ChineseMedicineAssistantTableRouter')

const  ClinicalAssistantRouter= () => import('../pages/home/clinicalDecision/navContent/ClinicalAssistantRouter')
const  ClinicalAssistantTableRouter= () => import('../pages/home/clinicalDecision/navContent/ClinicalAssistantTableRouter')

const  MedicineAssistantRouter= () => import('../pages/home/clinicalDecision/navContent/MedicineAssistantRouter')
const  MedicineAssistantTableRouter= () => import('../pages/home/clinicalDecision/navContent/MedicineAssistantTableRouter')

const ClinicalDecisionPressCheck = () => import('../pages/home/clinicalDecision/navContent/ClinicalDecisionPressCheck')
const ClinicalDecisionExpertInfo = () => import('../pages/home/clinicalDecision/navContent/ClinicalDecisionExpertInfo')
const ClinicalDecisionResult = () => import('../pages/home/clinicalDecision/navContent/Result/index')

const DeclareTypeRepairsNav = () => import('../pages/home/clinicalDecision/DeclareTypeRepairsNav')
const ClinicalProductList = () => import('../pages/home/clinicalDecision/navContent/ClinicalProductList.vue')


/* 小组 */
const GroupManage = () => import('pages/home/Groups/groupManagement');
/* 用户信息管理 */
import UserRouter from '../pages/home/userManage/userRouter'

const pmphUser = () => import('../pages/home/userManage/pmphUser')
const writerUser = () => import('../pages/home/userManage/writerUser')
const orgUser = () => import('../pages/home/userManage/orgUser')
/* 系统消息 */
import MessageRouter from 'pages/home/systemMessage/MessageRouter'

const MessageList = () => import('pages/home/systemMessage/MessageList')
const MessageState = () => import('pages/home/systemMessage/MessageState')
const MessageEdit = () => import('pages/home/systemMessage/MessageEdit')
const MessageDetails = () => import('pages/home/systemMessage/MessageDetails')
const SchoolQuery = () => import('pages/home/systemMessage/SchoolQuery')
const SpecialObj = () => import('pages/home/systemMessage/specialObj')
const TeachApplicant = () => import('pages/home/systemMessage/TeachApplicant')
/* 系统设置 */
import systemRouter from '../pages/home/systemSet/systemRouter'

const Roles = () => import('../pages/home/systemSet/roles')
const Departments = () => import('pages/home/systemSet/departments')
const Orgs = () => import('pages/home/systemSet/departments')
const Area = () => import('pages/home/systemSet/area')
/*学校/ 教师审核 */
import SchoolRouter from 'pages/home/school/schoolRouter'

const TeacherCheck = () => import('pages/home/school/teacherCheck')
const SchoolAdminCheck = () => import('pages/home/school/schoolAdminCheck')

/* 我的消息 */
import MyMessageRouter from 'pages/home/myMessage/MessageRouter';

const MyMessageList = () => import('pages/home/myMessage/MessageList')
const MyMessageDetails = () => import('pages/home/myMessage/MessageDetails')
/*师资培训*/
import ActivityRouter from '../pages/home/teacherTraining/activityRouter'
const activityManager = () => import('../pages/home/teacherTraining/activityManage')
const activityEdit = () => import('../pages/home/teacherTraining/activityEdit')
const activityVideo = () => import('../pages/home/teacherTraining/activityVideo')
const activitySource = () => import('../pages/home/teacherTraining/activitySource')

/* 内容管理 */
import ContentRouter from '../pages/home/contentManage/contentRouter'

const ContentPublish = () => import('../pages/home/contentManage/contentPublish');
const PublishList = () => import('../pages/home/contentManage/publishList');
const noticeManage = () => import('../pages/home/contentManage/noticeManage');
const infoExpertInfo = () => import('../pages/home/contentManage/infoExpressManage');
const sensitiveWords = () => import('../pages/home/contentManage/sensitiveWords');
const helpManage = () => import('../pages/home/contentManage/helpManage');
const commonEdit = () => import('../pages/home/contentManage/commonEdit');
const operationEdit = () => import('../pages/home/contentManage/operationEdit');
//广告管理
const adList = () => import('../pages/home/contentManage/adManage/ad-list');
const adEdit = () => import('../pages/home/contentManage/adManage/ad-edit');

/** 图书纠错 */
import ErrorRouter from '../pages/home/bookError/errorRouter';

const CheckError = () => import('../pages/home/bookError/checkError');
const AfterError = () => import('../pages/home/bookError/afterError');
const Check = () => import('../pages/home/bookError/check');

/** 积分管理 */
import PointRouter from '../pages/home/pointManage/pointRouter';

const PointRule = () => import('../pages/home/pointManage/pointRule');
const UserPoint = () => import('../pages/home/pointManage/userPoint');
const ConvertibleRule = () => import('../pages/home/pointManage/convertibleRule');

/* 出版图书 */
import BookRouter from 'pages/home/publishBooks/BookRouter'

const BookManage = () => import('pages/home/publishBooks/BookManage');
const materialType = () => import('pages/home/publishBooks/materialType');
const CommentManage = () => import('pages/home/publishBooks/comment');
const MicVideo = () => import('../pages/home/publishBooks/micVideo');
const FeedBack = () => import('../pages/home/publishBooks/feedback');
const FeedBackDetail = () => import('../pages/home/publishBooks/feedbackDetail');

/* 选题申报 */
import SelectTopicRouter from '../pages/home/selectTopic/selectTopicRouter';

const TopicExam = () => import('../pages/home/selectTopic/topicExam');
const TopicCheck = () => import('../pages/home/selectTopic/topicCheck');
const dealTopic = () => import ('../pages/home/selectTopic/dealTopic')
const newDealTopic = () => import ('../pages/home/selectTopic/newDealTopic')
/* 数据分析 */
import AnalysisRouter from 'pages/home/analysis/analysis-router'

const Flow = () => import('pages/home/analysis/flow');
const FlowMap = () => import('pages/home/analysis/flow-map');
const BookFlow = () => import('pages/home/analysis/book-flow');
const BookPreference = () => import('pages/home/analysis/book-preference');

/*用户主页(个人设置)*/
import PersonalRouter from 'pages/home/personal/PersonalRouter'

const PersonalSetting = () => import('pages/home/personal/Setting');

/* 问卷调查 */
import questionSurveyRouter from '../pages/home/questionSurvey/questionSurveyRouter';

const addNewModel = () => import('../pages/home/questionSurvey/addNewModel');
const addNewSurvey = () => import('../pages/home/questionSurvey/addNewSurvey');
const reIssue = () => import('../pages/home/questionSurvey/reIssue');
const surveyModelSet = () => import('../pages/home/questionSurvey/surveyModelSet');
const surveyRecovery = () => import('../pages/home/questionSurvey/surveyRecovery');
const surveryResultStatistic = () => import('../pages/home/questionSurvey/surveyResultStatistic')
const surveryResultDetail = () => import('../pages/home/questionSurvey/surveyResultDetail')
const launchSurvey = () => import('../pages/home/questionSurvey/launchSurvey')
const recoveryResult = () => import('../pages/home/questionSurvey/recoveryResult')

/*调研表*/
const materialSurveyModelSet = () => import('../pages/home/materialSurvey/surveyModelSet');
const materialSurveyPublishManage = () => import('../pages/home/materialSurvey/surveyPublishManage');
const materialAddNewModel = () => import('../pages/home/materialSurvey/addNewModel');

/**系统日志 */
const SystemLog = () => import('pages/home/systemLog/systemLog');

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/login', name: '登录', component: Login},
    {
      path: '/',
      name: '首页',
      component: Home,
      meta: {replaceName: '个人中心'},
      redirect: {name: '个人中心'},
      children: [
        {path: 'index', name: '个人中心', component: Index, meta: {replaceName: false, authorityId: 1}},
       // {path: 'indexSSO', name: '', component: Index, meta: {replaceName: '个人中心', authorityId: 1}},
        {
          path: 'materialrouter',
          name: '教材申报',
          component: ApplicationRouter,
          meta: {replaceName: '通知列表', authorityId: 2},
          children: [
            {path: 'materials', name: '通知列表', component: ApplicationList, meta: {replaceName: false}},
            {
              path: 'materialnav/:materialId',
              name: '书目列表',
              component: ApplicationNav,
              meta: {replaceName: false},
              children: [
                {
                  path: '1v3',
                  name: '角色遴选',
                  component: BooksSelect_1v3,
                  meta: {applicationName: '1v3'}
                },
                {path: 'result', name: '结果统计', component: Result, meta: {applicationName: 'result'}},
                {
                  path: 'presscheck',
                  name: '申报表审核',
                  component: PressCheck,
                  meta: {applicationName: 'presscheck'}
                },
                {
                  path: 'presscheck-pmph',
                  name: '提交到出版社',
                  component: PressCheck_pmph,
                  meta: {applicationName: 'presscheck-pmph'}
                },
                {path: 'newchoosebooks', name: '新建通知', component: NewChooseBooks, meta: {isShowTags: true}},
                {path: 'book-list', name: '设置书目录', component: BookList, meta: {isShowTags: true}},
                {path: 'expertinfo', name: '专家信息', component: ExpertInfo,},
                {path: 'chief', name: '遴选', component: Chief, meta: { applicationName: '1v3'},},
                {
                  path: 'applicationschoolquery',
                  name: '教材申报选择学校',
                  component: ApplicationSchoolQuery,
                  meta: {isShowTags: true}
                },
                {path: 'set-topic', name: '设置选题号', component: SetTopicNum, meta: {isShowTags: true}},
                {path: 'notice', name: '通知详情', component: Notice, meta: {isShowTags: true, hideTabs: true},},
                {path: 'edit-notice', name: '编辑通知详情', component: EditNotice, meta: {isShowTags: true, hideTabs: true},},
              ]
            },

          ]
        },
        {
          path: 'clinicalDecisionRouter',
          name: '临床决策',
          component: ClinicalDecisionRouter,
          meta: {replaceName: '', authorityId: true},
          children: [
            {path: 'clinicalAssistant', name: '临床助手申报', component: ClinicalAssistantRouter, meta: {replaceName: false, authorityId: 45},
            children:[
              {path: 'clinicalProductList', name: '临床决策专家申报列表', component: ClinicalProductList, meta: {replaceName: '临床助手申报', isShowTags: true,authorityId:true}},
            ]
            },
            {path: 'medicineAssistant', name: '用药助手申报', component: MedicineAssistantRouter, meta: {replaceName: false, authorityId: 46},
              children:[
                {path: 'clinicalProductList', name: '用药助手专家申报列表', component: ClinicalProductList, meta: {replaceName: '用药助手申报',isShowTags: true,authorityId:true}},
              ]},
            {path: 'chineseMedicineAssistant', name: '中医助手申报', component: ChineseMedicineAssistantRouter, meta: {replaceName: false, authorityId: 47},
              children:[
                {path: 'clinicalProductList', name: '中医助手专家申报列表', component: ClinicalProductList, meta: {replaceName: '中医助手申报',isShowTags: true,authorityId:true}},
              ]
            },
            {path: 'clinicalAssistantTable',name: '临床助手申报表', component: ClinicalAssistantTableRouter,meta: { authorityId: 49}},
            {path: 'medicineAssistantTable',name: '用药助手申报表', component: MedicineAssistantTableRouter,meta: { authorityId: 50}},
            {path: 'chineseMedicineAssistantTable',name: '中医助手申报表', component: ChineseMedicineAssistantTableRouter,meta: { authorityId: 51}},

            {path: 'clinicalDecisionNewChooseBooks', name: '临床决策专家申报', component: ClinicalDecisionNewChooseBooks, meta: {isShowTags: true,authorityId:true}},
            { path: 'clinicalschoolquery',name: '临床决策申报选择学校',component: ClinicalSchoolQuery, meta: {isShowTags: true}},

            {
              path: 'clinicalDecisionNav',
              name: '临床决策专家申报审核',
              component: ClinicalDecisionNav,
              meta: {replaceName: '临床决策专家申报审核'},
              children: [
            {path: 'clinicalDecisionResult', name: '临床决策专家结果统计', component: ClinicalDecisionResult, meta: {applicationName: 'clinicalDecisionResult',hideTabs: true}},
            {path: 'clinicalDecisionPressCheck', name: '临床决策专家申报表审核',component: ClinicalDecisionPressCheck,meta: {replaceName: false,applicationName: 'clinicalDecisionPressCheck',hideTabs: true}},
            {path: 'clinicalDecisionExpertInfo', name: '临床决策专家信息', component: ClinicalDecisionExpertInfo,meta: {hideTabs: false}},

            ]
            },
            {path: 'declareTypeRepairs', name: '申报分类维护', component: DeclareTypeRepairsNav, meta: {replaceName: '申报分类维护', authorityId: 48}},
          ]
        }

        /*{
          path: 'clinicalDecisionRouter',
          name: '临床决策',
          component: ClinicalDecisionRouter,
          meta: {replaceName: '', authorityId: true},
          children: [
            {path: 'clinicalAssistant', name: '临床助手申报', component: ClinicalAssistantRouter, meta: {replaceName: false, authorityId: 45}},
            {path: 'medicineAssistant', name: '用药助手申报', component: MedicineAssistantRouter, meta: {replaceName: false, authorityId: 46}},
            {path: 'chineseMedicineAssistant', name: '中医助手申报', component: ChineseMedicineAssistantRouter, meta: {replaceName: false, authorityId: 47}},

            {path: 'clinicalAssistantTable',name: '临床助手申报表', component: ClinicalAssistantTableRouter,meta: { authorityId: 49}},
            {path: 'medicineAssistantTable',name: '用药助手申报表', component: MedicineAssistantTableRouter,meta: { authorityId: 50}},
            {path: 'chineseMedicineAssistantTable',name: '中医助手申报表', component: ChineseMedicineAssistantTableRouter,meta: { authorityId: 51}},
            {path: 'clinicalDecisionNewChooseBooks', name: '临床决策专家申报', component: ClinicalDecisionNewChooseBooks, meta: {isShowTags: true,authorityId:true}},
            {path: 'clinicalProductList', name: '临床决策专家申报列表', component: ClinicalProductList, meta: {isShowTags: true,authorityId:true}},
            { path: 'clinicalschoolquery',name: '临床决策申报选择学校',component: ClinicalSchoolQuery, meta: {isShowTags: true}},
            {
              path: 'clinicalDecisionNav',
              name: '临床决策专家申报审核',
              component: ClinicalDecisionNav,
              meta: {replaceName: '临床决策专家申报审核'},
              children: [
                {path: 'clinicalDecisionResult', name: '临床决策专家结果统计', component: ClinicalDecisionResult, meta: {applicationName: 'clinicalDecisionResult',hideTabs: true}},
                {path: 'clinicalDecisionPressCheck', name: '临床决策专家申报表审核',component: ClinicalDecisionPressCheck,meta: {replaceName: false,applicationName: 'clinicalDecisionPressCheck',hideTabs: true}},
                {path: 'clinicalDecisionExpertInfo', name: '临床决策专家信息', component: ClinicalDecisionExpertInfo,meta: {hideTabs: false}},
              ]
            },

            {path: 'declareTypeRepairs', name: '申报分类维护', component: DeclareTypeRepairsNav, meta: {replaceName: '申报分类维护', authorityId: 48}},
          ]
        }*/,
        {
          path: 'bookerror',
          name: '图书纠错',
          component: ErrorRouter,
          meta: {replaceName: "", authorityId: 8}, /*商品分类*/
          children: [
            {path: 'check', name: '图书纠错审核', component: CheckError, meta: {authorityId: 23}},
            {path: 'checkerror', name: '纠错审核', component: Check,},
            {path: 'after', name: '图书纠错跟踪', component: AfterError, meta: {authorityId: 24}}
          ]
        },
        {
          path: 'pointmanage',
          name: '积分管理',
          component: PointRouter,
          meta: {replaceName: false, authorityId: 9},
          children: [
            {path: 'pointrule', name: '积分管理', component: PointRule, meta: {authorityId: 25}},
            {path: 'userpoint', name: '用户积分', component: UserPoint, meta: {authorityId: 26}},
            {path: 'convertiblerule', name: '兑换规则', component: ConvertibleRule, meta: {authorityId: 27}}
          ]
        },
        {
          path: 'user', name: '用户信息管理', component: UserRouter, meta: {replaceName: false, authorityId: 11}, children: [
            {path: 'pmph', name: '社内用户', component: pmphUser, meta: {authorityId: 32}},
            {path: 'writer', name: '个人用户', component: writerUser, meta: {authorityId: 33}},
            {path: 'org', name: '学校 / 医院用户', component: orgUser, meta: {authorityId: 34}},
          ]
        },
        {
          path: 'message',
          name: '系统消息',
          component: MessageRouter,
          meta: {replaceName: '消息列表', authorityId: 4},
          children: [
            {path: 'messagelist', name: '消息列表', component: MessageList, meta: {replaceName: false}}, // 消息列表页面
            {path: 'messagestate', name: '消息状态', component: MessageState},
            {path: 'messageEdit', name: '编辑消息', component: MessageEdit}, //消息编辑页面
            {path: 'messageDetails', name: '系统消息详情', component: MessageDetails},
            {path: 'schoolquery', name: '选择学校', component: SchoolQuery},
            {path: 'specialobj', name: '特定对象', component: SpecialObj},
            {path: 'teachapplicant', name: '教材报名者', component: TeachApplicant},

          ]
        },
        /* 系统设置 */
        {
          path: 'set', name: '系统设置', component: systemRouter, meta: {replaceName: false, authorityId: 12}, children: [
            {path: 'roles', name: '角色管理', component: Roles, meta: {authorityId: 35}},
            /*  {path:'authority',name:'权限管理',component:Authority}, */
            {path: 'departments', name: '社内部门设置', component: Departments, meta: {authorityId: 36}},
            /* { path: 'orgs', name: '院校机构设置', component: Orgs, meta: { authorityId: 20 } },
            { path: 'area', name: '区域管理', component: Area, meta: { authorityId: 19 } } */
          ]
        },
        {path: 'groupmanage', name: '小组管理', component: GroupManage, meta: {authorityId: 3}},
        /*学校/ 教师审核 */
        {
          path: 'auth',
          name: '学校/教师审核',
          component: SchoolRouter,
          meta: {replaceName: false, authorityId: 3},
          children: [
            {path: 'writers', name: '教师审核', component: TeacherCheck, meta: {authorityId: true}},
            {path: 'orgs', name: '学校管理员审核', component: SchoolAdminCheck, meta: {authorityId: true}}
          ]
        },

        {
          path: 'activity',
          name: '活动管理',
          component: ActivityRouter,
          meta: {replaceName: false, authorityId: 57},
          children: [
            {path: 'activityList', name: '活动管理', meta: {authorityId: 58}, component: activityManager},
            {path: 'newActivity', name: '添加活动',  component: activityEdit,meta: {authorityId: true}},
            {path: 'toVideo', name: '活动视频',  component: activityVideo,meta: {authorityId: true}},
            {path: 'toSource', name: '活动资源',  component: activitySource,meta: {authorityId: true}},
          ]
        },
        /* 内容管理 */
        {
          path: 'content',
          name: '内容管理',
          component: ContentRouter,
          meta: {replaceName: false, authorityId: 5},
          children: [
            {path: 'list', name: '文章管理', meta: {authorityId: 15}, component: PublishList},
            {path: 'new', name: '添加内容', component: ContentPublish, meta: {authorityId: true}},
            {path: 'info', name: '信息快报管理', meta: {authorityId: 16}, component: infoExpertInfo},
            {path: 'notice', name: '公告管理', meta: {authorityId: 17}, component: noticeManage},
            {path: 'sensitive', name: '敏感词管理', component: sensitiveWords, meta: {authorityId: 40}},
            {path: 'help', name: '帮助管理', component: helpManage},
            {path: 'common', name: '常见问题', component: commonEdit},
            {path: 'operation', name: '操作手册上传', component: operationEdit},
            /*  { path: 'set', name: '栏目设置', meta: { authorityId: 12 }, component: ColumnSet }, */
            {path: 'ad', name: '广告管理', meta: {authorityId: 18}, component: adList},
            {path: 'ad/:id', name: '广告编辑', meta: {authorityId: 18}, component: adEdit}

          ]
        },
        /* 出版图书 */
        {
          path: 'book', name: '出版图书', component: BookRouter, meta: {replaceName: false, authorityId: 6}, children: [
            {
              path: 'manage',
              name: '图书管理',
              component: BookManage,
              meta: {authorityId: 19},
              beforeRouteLeave: (to, from, next) => {
                clearInterval(window.handleExportWordtimer);
              }
            },
            {path: 'materialType', name: '图书分类', component: materialType, meta: {authorityId: 44}},
            {path: 'comment', name: '评论审核', component: CommentManage, meta: {authorityId: 20}},
            {path: 'video', name: '微视频管理', component: MicVideo, meta: {authorityId: 41}},
            {path: 'feedback', name: '读者反馈', component: FeedBack, meta: {authorityId: 43}},
            {path: 'feedbackdetail', name: '读者反馈详情', component: FeedBackDetail}

          ]
        },
        /*数据分析 */
        {
          path: 'analysis',
          name: '数据分析',
          component: AnalysisRouter,
          meta: {replaceName: false, authorityId: 10},
          children: [
            {path: 'flow', name: '流量概况', component: Flow, meta: {authorityId: 28}},
            {path: 'flow-map', name: '流量地图', component: FlowMap, meta: {authorityId: 29}},
            {path: 'book-flow', name: '图书流量概况', component: BookFlow, meta: {authorityId: 30}},
            {path: 'book-preference', name: '用户图书偏好分析', component: BookPreference, meta: {authorityId: 31}}
          ]
        },
        /* 选题申报 */
        {
          path: 'topic',
          name: '选题申报',
          component: SelectTopicRouter,
            meta: {replaceName: false, authorityId: 7},
          children: [
            {path: 'exam', name: '选题申报审核', component: TopicExam, meta: {authorityId: 21}},
            {path: 'check', name: '选题申报查看', component: TopicCheck, meta: {authorityId: 22}},
            /*  { path: 'deal', name: '选题受理', component: dealTopic,meta: { authorityId: true }}, */
            {path: 'deal', name: '选题受理', component: newDealTopic, meta: {authorityId: true}}

          ]
        },
        /* 问卷调查 */
        {
          path: 'survey',
          name: '问卷调查',
          component: questionSurveyRouter,
          meta: {replaceName: false, authorityId: 13},
          children: [
            {path: 'setmodel', name: '调查问卷模板设置', component: surveyModelSet, meta: {authorityId: 37}},
            {path: 'launch', name: '发起调查', component: launchSurvey, meta: {authorityId: true}},
            {path: 'reissue', name: '补发消息', component: reIssue, meta: {authorityId: true}},
            {path: 'newmodel', name: '问卷模板新增', component: addNewModel, meta: {authorityId: true}},
            {path: 'newsurvey', name: '新建调查问卷', component: addNewSurvey, meta: {authorityId: true}},
            {path: 'statistic', name: '调查问卷结果统计', component: surveryResultStatistic, meta: {authorityId: 38}},
            {path: 'detail', name: '结果明细', component: surveryResultDetail, meta: {authorityId: true}},
            {path: 'recovery', name: '调查问卷回收', component: surveyRecovery, meta: {authorityId: 39}},
            {path: 'result', name: '问卷回收结果', component: recoveryResult, meta: {authorityId: true}},
          ]
        },

        /* 调研表 */
        {
          path: 'materialsurvey',
          name: '调研表',
          component: questionSurveyRouter,
          meta: {replaceName: false, authorityId: 13},
          children: [
            {path: 'setmodel', name: '调研表模板管理', component: materialSurveyModelSet, meta: {authorityId: 53}},

            {path: 'publishManage', name: '调研表发布管理', component: materialSurveyPublishManage, meta: {authorityId: 54}},

            {path: 'newmodel', name: '调研表模板新增', component: materialAddNewModel, meta: {authorityId: true}},

            {path: 'launch', name: '发起调查', component: launchSurvey, meta: {authorityId: true}},
            {path: 'reissue', name: '补发消息', component: reIssue, meta: {authorityId: true}},

            {path: 'newsurvey', name: '新建调查问卷', component: addNewSurvey, meta: {authorityId: true}},
            {path: 'statistic', name: '调查问卷结果统计', component: surveryResultStatistic, meta: {authorityId: 38}},
            {path: 'detail', name: '结果明细', component: surveryResultDetail, meta: {authorityId: true}},
            {path: 'recovery', name: '调查问卷回收', component: surveyRecovery, meta: {authorityId: 39}},
            {path: 'result', name: '问卷回收结果', component: recoveryResult, meta: {authorityId: true}},
          ]
        },

        /* 我的消息 */
        {
          path: 'mymsg',
          name: '我的消息',
          component: MyMessageRouter,
          meta: {replaceName: false, authorityId: 1},
          children: [
            {path: 'msglist', name: '我的消息列表', component: MyMessageList, meta: {authorityId: true}},
            {path: 'msgdetails', name: '我的消息详情', component: MyMessageDetails, meta: {authorityId: true}}
          ]
        },
        /*用户主页(个人设置)*/
        {
          path: 'personal',
          name: '个人资料',
          component: PersonalRouter,
          meta: {replaceName: false, authorityId: 1},
          children: [
            {path: 'setting', name: '个人信息', component: PersonalSetting, meta: {authorityId: true}},
          ]
        },
        /*用户主页(个人设置)*/
        {
          path: 'systemlog', name: '系统日志', component: SystemLog, meta: {replaceName: false, authorityId: 14}
        },
      ]
    },
    {path: '/*', name: '404', component: NoFind, meta: {authorityId: true}}

  ]
})
