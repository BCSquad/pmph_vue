// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import '../static/theme/index.css'
import '../static/font-awesome/css/font-awesome.min.css'
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
//全局封装一个获取用户信息方法
var getUserData=function () {
  var sessionData = commonFun.mySessionStorage.get('currentUser', 'json')||{};
  //console.log(sessionData)
  return {
    token:sessionData.sessionPmphUserToken,
    sessionId:sessionData.userSessionId,
    userInfo:sessionData.sessionPmphUser,
    permissionIds:sessionData.pmphUserPermissionIds
  }
};
Vue.prototype.$getUserData=getUserData;

router.beforeEach((to, from, next) => {
  var userdata = getUserData();
  if (to.path != '/login'&&to.name!='404') {  // 判断是否登录
    if (!userdata.userInfo) {
      next('/login')
    }
    else if (commonFun.authorityComparison(to.matched, getUserData().permissionIds)) {  //判断当前登录角色是否有即将进入的路由权限
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


//添加一个请求拦截器
axios.interceptors.request.use(function (config) {
  var userdata = getUserData();
  //请求发送之前的钩子
  if(userdata.token){
     config.headers.Authorization=userdata.token;
  }else{
    router.push('/login');

  }

     /* 解决IE缓存添加一个随机时间戳 */
  if (config.params){
    config.params._timer=''
  }else{
    config.params={};
  }
  if (config.method.toLowerCase() == 'get' ){
    config.params._timer=+(new Date());
  }
  return config;
}, function (error) {
  //当出现请求错误时的操作
  return Promise.reject(error);
});

//添加一个返回拦截器
axios.interceptors.response.use(function (response) {
  //对返回的数据进行一些处理
  if (response.data.code == 30 ){
    ElementUI.Message.error('当前登录已过期，请重新登录');
    router.push('/login');
  }
  return response;
}, function (error) {
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

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});

