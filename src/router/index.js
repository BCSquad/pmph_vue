import Vue from 'vue';
import Router from 'vue-router';

import Login from 'pages/Login.vue';
import Home from 'pages/Home.vue';
const Index = () => import(/* webpackChunkName: "group-foo" */ '../pages/Index');
/* import Index from '../pages/Index'; */
import NoFind from 'pages/404.vue';
/* import ApplicationList from '../pages/home/teachingMaterial/navContent/ApplicationList'; */
const ApplicationList=() => import('../pages/home/teachingMaterial/navContent/ApplicationList');
import ApplicationRouter from '../pages/home/teachingMaterial/ApplicationRouter'
import BooksSelect_1v1 from '../pages/home/teachingMaterial/navContent/1v1'
import BooksSelect_1v2 from '../pages/home/teachingMaterial/navContent/1v2'
import BooksSelect_1v3 from '../pages/home/teachingMaterial/navContent/1v3'
import ApplicationNav from '../pages/home/teachingMaterial/ApplicationNav'
import PressCheck from '../pages/home/teachingMaterial/navContent/pressCheck'
import ExpertInfo from '../pages/home/teachingMaterial/navContent/expertInfo'
import BookList from '../pages/home/teachingMaterial/navContent/BookList'
import Notice from '../pages/home/teachingMaterial/navContent/Notice'
import Chief from '../pages/home/teachingMaterial/navContent/Chief'
import preSelect from '../pages/home/teachingMaterial/navContent/preSelect'
import NewChooseBooks from 'pages/home/teachingMaterial/navContent/newChooseBooks'
import SchoolQuery from 'components/SchoolQuery'
import ApplicationSchoolQuery from 'components/chooseSchool'
import GroupManage from 'pages/home/Groups/groupManagement'
/* 用户信息管理 */
import UserRouter from '../pages/home/userManage/userRouter'
import pmphUser from '../pages/home/userManage/pmphUser'
import writerUser from '../pages/home/userManage/writerUser'
import orgUser from '../pages/home/userManage/orgUser'
/* 系统消息 */
import MessageRouter from '../pages/home/systemMessage/MessageRouter'
import MessageList from 'pages/home/systemMessage/MessageList'
import MessageState from 'pages/home/systemMessage/MessageState'
import MessageEdit from 'pages/home/systemMessage/MessageEdit'
/* 系统设置 */
import systemRouter from '../pages/home/systemSet/systemRouter'
import Roles from '../pages/home/systemSet/roles'
/* import Authority from '../pages/home/systemSet/authority' */
import Departments from 'pages/home/systemSet/departments'
import Orgs from 'pages/home/systemSet/orgs'
import Area from 'pages/home/systemSet/area'
Vue.use(Router)

export default new Router({
  routes: [
    { path: '/login', name: '登录', component: Login },
    {
      path: '/',
      name: '首页',
      component: Home,
      meta:{ replaceName:'个人中心'},
      children: [
        {path:'index',name:'个人中心',component:Index,meta: { replaceName:false,authorityId:1}},
        {path:'materialrouter',name:'教材申报',component:ApplicationRouter, meta: {replaceName:'通知列表',authorityId:2},
         children:[
            {path:'materials',name:'通知列表',component:ApplicationList, meta: { replaceName:false}},

            {path:'notice',name:'通知详情',component:Notice},
            {
              path: 'materialnav', name: '书目列表', component: ApplicationNav ,meta:{replaceName:'申报表审核'},children: [
                { path: '1v1', name: '策划编辑视图', component: BooksSelect_1v1, meta: {applicationName:'1v1' } },
                { path: '1v2', name: '项目编辑视图', component: BooksSelect_1v2, meta: {applicationName:'1v2' } },
                { path: '1v3', name: '主任视图', component: BooksSelect_1v3, meta: {applicationName:'1v3' } },
                { path: 'presscheck', name: '申报表审核', component: PressCheck, meta: {applicationName:'presscheck',replaceName:false} },
                { path: 'newchoosebooks', name:'新建遴选教材', component:NewChooseBooks,meta:{isShowTags:true}},
                {path:'book-list',name:'设置书目录',component:BookList, meta: { isShowTags:true}},
                { path: 'expertinfo', name: '专家信息', component: ExpertInfo },
                { path: 'chief', name:'遴选主编/副主编', component:Chief},
                { path: 'pre-select', name:'预选编委', component:preSelect},
              { path: 'applicationschoolquery', name:'教材申报选择学校', component:ApplicationSchoolQuery,meta:{isShowTags:true}},
              ]
            },

         ]
      },
      {path:'user',name:'用户信息管理',component:UserRouter,meta: { replaceName:false,authorityId:7},children:[
       {path:'pmph',name:'社内用户',component:pmphUser,meta:{authorityId:9}},
       {path:'writer',name:'作家用户',component:writerUser,meta:{authorityId:10}},
       {path:'org',name:'机构用户',component:orgUser,meta:{authorityId:11}},
      ]},
      {path:'message',name:'系统消息',component:MessageRouter,meta: { replaceName:'消息列表',authorityId:5},children:[
        { path: 'messagelist', name: '消息列表', component: MessageList ,meta: { replaceName:false}}, // 消息列表页面
        { path: 'messagestate', name: '消息状态', component: MessageState },
        { path: 'messageEdit', name: '编辑消息', component: MessageEdit}, //消息编辑页面
        { path: 'schoolquery', name: '选择学校', component: SchoolQuery }
      ]},
      /* 系统设置 */
      {path:'set',name:'系统设置',component:systemRouter ,meta: { replaceName:false,authorityId:8},children:[
        {path:'roles',name:'角色管理',component:Roles,meta:{authorityId:12}},
       /*  {path:'authority',name:'权限管理',component:Authority}, */
        {path:'departments',name:'社内部门设置',component:Departments,meta:{authorityId:16}},
        {path:'orgs',name:'院校机构设置',component:Orgs,meta:{authorityId:15}},
        {path:'area', name:'区域管理',component:Area,meta:{authorityId:14}}
      ]},
        { path: 'groupmanage', name: '小组管理', component: GroupManage,meta:{authorityId:4} },

      ]
    },
    { path: '/*', name: '404', component: NoFind }

  ]
})
