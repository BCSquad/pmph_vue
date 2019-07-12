// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill';
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import '../static/theme/index.css'
import '../static/font-awesome/css/font-awesome.min.css'
import '../static/font-awesome/fonts/iconfont.css'
import 'common/css/common.css'
require('es6-promise').polyfill();//解决axios ie9不兼容问题
import axios from 'axios'




/*全局方法和配置挂载*/
import * as config from 'common/config';
import * as commonFun from './common/js/commonFun.js'
import {formCheckedRules,formRules} from './common/js/formCheckRules.js'

/*全局组件引用*/
import myUpload from 'components/my-upload'


/*全局方法和配置挂载*/
Vue.config.productionTip = false
Vue.use(ElementUI);


/*polyfill插件*/
require('./common/js/ie9-oninput-polyfill');//解决ie9输入框绑不响应删除键bug
require('./common/js/jsApiPolyfill');

//请求根地址配置
// axios.defaults.baseURL = config.BASE_URL;
 //axios.defaults.baseURL = 'http://192.168.200.109:8090/pmpheep/';

//全局挂载
Vue.prototype.$axios = axios;
Vue.prototype.$mySessionStorage = commonFun.mySessionStorage;
Vue.prototype.$initPostData = commonFun.initPostData;


Vue.prototype.$config = config;
Vue.prototype.$commonFun = commonFun;
Vue.prototype.$formCheckedRules = formCheckedRules;
Vue.prototype.$formRules = formRules;
//Vue.prototype.$message.alert = commonFun.myAlert;
//全局封装一个获取用户信息方法
var getUserData=function () {
  var sessionData = commonFun.mySessionStorage.get('currentUser', 'json')||{};
 // console.log(sessionData)
  //debugger;
  return {
    token:sessionData.sessionPmphUserToken,
    sessionId:sessionData.userSessionId,
    userInfo:sessionData.sessionPmphUser,
    permissionIds:sessionData.pmphUserPermissionIds
  }
};
Vue.prototype.$getUserData=getUserData;

router.beforeEach((to, from, next) => {
  // console.log("    from ");
  // console.log(from);
  // console.log("    to ");
  // console.log(to);

  if (to.path != '/login'&&to.name!='404') {  // 判断是否登录
    if(to.path == '/index'&&to.query.sessionId&&to.query.currentUser&&to.query.token&&to.query.permissionIds){
      commonFun.Cookie.set('sessionId',to.query.sessionId,2)
      commonFun.Cookie.set('token',to.query.token,2);
      commonFun.mySessionStorage.set('currentUser',to.query.currentUser)
    }
    var userdata = getUserData();
    //debugger;
    if (!userdata.userInfo) {
      if(config.IS_DEBUG){
        next('/login')
      }else{
        window.location.href='http://sso.pmph.com/sso/logon/password.jsp'
      }
    }
    else if (commonFun.authorityComparison(to.matched, getUserData().permissionIds)) {  //判断当前登录角色是否有即将进入的路由权限
      //debugger;
      next();
    } else {
      ElementUI.Message.error('抱歉，您没有进入该模块的权限');
     next(from.path);

    }
  }
  else {
    next();
  }
})

var loadingInstance2;
var box = document.getElementsByClassName("app-main-inner app_main_border")[0];
//添加一个请求拦截器
axios.interceptors.request.use(function (config) {
  var currentLocation = window.location.hash.replace('#','');
  var userdata = getUserData();
  //请求发送之前的钩子
  if(userdata.token){
     config.headers.Authorization=userdata.token;
  }else{
    router.push({name:'登录',query:{f:currentLocation}});

  }
    /*console.log(config);
   console.log(router);*/
     /* 解决IE缓存添加一个随机时间戳 */
  if (config.params){

  }else{
    config.params={};
  }
  if (config.method.toLowerCase() == 'get' ){
    config.params._timer=+(new Date());
  }
  if(config.url != '/pmpheep/pmph/login'){
    loadingInstance2 = ElementUI.Loading.service({
      // target:box,
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
  }

  return config;
}, function (error) {
  //当出现请求错误时的操作
  return Promise.reject(error);
});

//添加一个返回拦截器
axios.interceptors.response.use(function (response) {
  var currentLocation = window.location.hash.replace('#','');
  //对返回的数据进行一些处理
  // console.log("response.data  ")
  // console.log(response.data);

  if (response.data.code == 30 ){
    ElementUI.Message.error('当前登录已过期，请重新登录');
    if(config.IS_DEBUG){
      router.push({name:'登录',query:{f:currentLocation}});
    }else{
      window.location.href='http://sso.pmph.com/sso/logon/password.jsp'
    }
  }
  if(!commonFun.Empty(loadingInstance2)){
    loadingInstance2.close();
  }

  return response;
}, function (error) {
  if(!commonFun.Empty(loadingInstance2)){
    loadingInstance2.close();
  }
  //对返回的错误进行一些处理
  return Promise.reject(error);
});


/**
 * 挂载全局组件
 */
Vue.use(myUpload);


/**
 * 添加原型方法,去掉字符串中===>及===>前的所有内容
 * 使用示例：str.msgTrim()
 */
String.prototype.msgTrim=function() {
  return this.replace(/(\S*)===>/g, '');
};
String.prototype.replaceAll = function(s1,s2){
  return this.replace(new RegExp(s1,"gm"),s2);
}

// Array.prototype.uniq = function() {
//   return Array.from(new Set(this));
// }
// Array.prototype.distinct = function(){
//   var arr = this,
//     result = [],
//     i,
//     j,
//     len = arr.length;
//   for(i = 0; i < len; i++){
//     for(j = i + 1; j < len; j++){
//       if(arr[i] === arr[j]){
//         j = ++i;
//       }
//     }
//     result.push(arr[i]);
//   }
//   return result;
// }

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});

