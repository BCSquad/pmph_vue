
import 'url-search-params-polyfill'
//获取sessionStorage
function getSessionStorage(key, format) {
    var data;
    if (sessionStorage.getItem(key)) {
        if (format == 'json') {
            data = JSON.parse(sessionStorage.getItem(key));
        } else {
            data = sessionStorage.getItem(key);
        }
    } else {
        data = false
    }
    return data;
}
//写入sessionStorage
function setSessionStorage(key, content, format) {
    var data;
    if (format == 'json') {
        data = JSON.stringify(content);
    } else {
        data = content;
    }
    sessionStorage.setItem(key, data);
}
export var mySessionStorage = {
    get: getSessionStorage,
    set: setSessionStorage
}

/* post数据格式封装 */
export function initPostData(obj, keyArr) {
    var paramdata = new URLSearchParams();

    if (!keyArr) {
        for (var item in obj) {
          paramdata.append(item, obj[item]);
            console.log(item);
        }
    }else{
        keyArr.forEach(function(str){
            paramdata.append(str,obj[str]);
        })
    }
    return paramdata;
}
/* 权限比对 */
export function authorityComparison(matchArr, userArr) {
    var result = false;
    matchArr.forEach(function (elem) {
        userArr.forEach(function (num) {
          if (num && num == elem.meta.authorityId || elem.meta.authorityId===true) {
                result = true;
            }
        })
    })
    return result;
}
/* 教材申报权限判断 */
  export function materialPower(num,powerList) {
  if(!powerList||!(Object.prototype.toString.call(powerList)=='[object Array]'||(typeof powerList).toLowerCase()=='string')){
    return false;
  }
  var str = ((typeof powerList).toLowerCase()=='string')?powerList.split(''):powerList;
  //如果传的是数字
  if((typeof num).toLowerCase() == "number"||(typeof num).toLowerCase() == "string"){
    return str[num]==1;
  }
  //如果是数组,只要匹配到任一一项则返回true
  if(Object.prototype.toString.call(num)=='[object Array]'){
    for(let i = 0, len = num.length; i < len; i++){
      if(!((typeof num[i]).toLowerCase() == "number")){//如果不是数字
        return false;
      }
      if(str[num[i]]==1){//匹配到任一一项则返回true
        return true;
      }
    }
    return false;
  }
  //如果传的参数不是数字类型，也不是数组类型则直接返回false
  return false;
}
export function pagesetup_null() {
  var hkey_root, hkey_path, hkey_key;
  hkey_root = "HKEY_CURRENT_USER"
  hkey_path = "\\Software\\Microsoft\\Internet Explorer\\PageSetup\\";
  try {
    var RegWsh = new ActiveXObject("WScript.Shell");
    hkey_key = "header";
    RegWsh.RegWrite(hkey_root + hkey_path + hkey_key, "");
    hkey_key = "footer";
    RegWsh.RegWrite(hkey_root + hkey_path + hkey_key, "");
  } catch (e) { }
}
/**=================================================================
 cookie相关
 =================================================================*/
export let Cookie = {
  /**
   * getCookie
   * @param name
   * @returns {*}
   */
  get(name) {
    var strCookie = document.cookie;
    var arrCookie = strCookie.split("; ");
    for (var i = 0; i < arrCookie.length; i++) {
      var arr = arrCookie[i].split("=");
      if (arr[0] == name)return arr[1];
    }
    return "";
  },

  /**
   * 添加cookie
   * @param name
   * @param value
   * @param expiresHours
   * @param domain
   */
  set(name, value, expiresHours,domain) {
    var cookieString = name + "=" + (!!value?value:'');
    var date = new Date();

    if(domain!=undefined)
      domain=";domain="+domain;
    else
      domain='';

    date.setTime(date.getTime() + expiresHours * 3600 * 1000);
    cookieString = cookieString + domain+"; path=/; expires=" + date.toGMTString();

    document.cookie = cookieString;
  },
  /**
   * 删除cookie
   * @param name
   */
  remove(name){
    this.set(name,'',-1);
  },
};

/**=================================================================
  时间相关
  =================================================================*/

/**
 * 将时间戳转化为几天前,几小时前，几分钟前形式
 * @param dateTimeStamp 时间戳
 * @returns {*|string}
 */
export function getDateDiff(dateTimeStamp){
  var result;
  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var halfamonth = day * 15;
  var month = day * 30;
  var now = new Date().getTime();
  var diffValue = now - dateTimeStamp;
  if(diffValue < 0){return;}
  var monthC =diffValue/month;
  var weekC =diffValue/(7*day);
  var dayC =diffValue/day;
  var hourC =diffValue/hour;
  var minC =diffValue/minute;
  var result;
  if(monthC>=1){
    result="" + parseInt(monthC) + "月前";
  }
  else if(weekC>=1){
    result="" + parseInt(weekC) + "周前";
  }
  else if(dayC>=1){
    result=""+ parseInt(dayC) +"天前";
  }
  else if(hourC>=1){
    result=""+ parseInt(hourC) +"小时前";
  }
  else if(minC>=1){
    result=""+ parseInt(minC) +"分钟前";
  }else
    result="刚刚";
  return result;
}

/**
 * 转换标准时间为时间戳：例如将2016/1/20 19:59:30转换成时间戳形式1484913570000
 * @param dateStr
 * @returns {number}
 */
export function getDateTimeStamp(dateStr){
  return Date.parse(dateStr.replace(/-/gi,"/"));
}
/**
 * 时间格式方法
 *
 * @param {any} timeStamp  时间戳，秒级/毫秒级
 * @param {any} type 格式化时间类型，默认  Y-M-D H:I:S
 * @returns {string} formatTime 格式化后的时间 例如： 2017-05-05 12:09:22
 */
export function formatDate(nS,str) {
  var reg = new RegExp("[\\u4E00-\\u9FFF]+","g"); //是否是汉字
  if(!nS||Empty(nS)){
    return "";
  }
  if(!Empty(nS)&&reg.test(nS)){
    return nS;
  }
  if((typeof(nS)=='string')&&nS.indexOf('-')&&str=='yyyy.MM.dd'){
    return nS.replace(/-/g,'.');
  }

  if(parseInt(nS)===NaN){
    return nS;
  }
  var date=new Date(parseInt(nS));
  var year=date.getFullYear();
  var mon = date.getMonth()+1;
  var day = date.getDate();
  var hours = date.getHours();
  var minu = date.getMinutes();
  var sec = date.getSeconds();

 if(str=='yyyy-MM-dd'){
   return year + '-' + (mon < 10 ? '0' + mon : mon) + '-' + (day < 10 ? '0' + day : day);
 }else if(str=='yyyy.MM.dd'){
   return year + '.' + (mon < 10 ? '0' + mon : mon) + '.' + (day < 10 ? '0' + day : day);
 }else{
   return year + '-' + (mon < 10 ? '0' + mon : mon) + '-' + (day < 10 ? '0' + day : day) + ' ' + (hours < 10 ? '0' + hours : hours) + ':' + (minu < 10 ? '0' + minu : minu) + ':' + (sec < 10 ? '0' + sec : sec);
 }

}

/**
 * 过滤html中的特殊字符
 * @param str
 * @returns {string}
 */
export function html(str) {
  return str ? str.replace(/&((g|l|quo)t|amp|#39|nbsp|ldquo|rdquo|amp);/g, function (m) {
    return {
      '&lt;':'<',
      '&amp;':'&',
      '&quot;':'"',
      '&gt;':'>',
      '&#39;':"'",
      '&nbsp;':' ',
      '&ldquo;':'“',
      '&rdquo;':'”',
      '&amp;':'&'
    }[m]
  }) : '';
};
/**
 * 获取当前的日期 格式“yyyyMMdd”
 * @returns {string}
 */
export function getcurrentDate(nS) {
  var date=nS?new Date(nS):new Date();
  var year=date.getFullYear();
  var mon = date.getMonth()+1;
  mon=mon>9?mon:'0'+mon;
  var day = date.getDate();
  day=day>9?day:'0'+day;
  return ''+year+mon+day;

}
/* 获取当前时间 格式YYYY-MM-DD */
export function getnowDate(nS) {
  var date = nS?new Date(nS):new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  return year + '-' + (month <= 9 ? '0' + month : month) + '-' + (strDate <= 9 ? '0' + strDate : strDate);

}
/* 获取一周前时间 格式YYYY-MM-DD */
export function getoneWeekDate() {
  var oneweekdate = new Date(new Date().getTime() - 7 * 24 * 3600 * 1000);
  var y = oneweekdate.getFullYear();
  var m = oneweekdate.getMonth() + 1;
  var d = oneweekdate.getDate();
  return y + '-' + (m<=9?'0'+m:m )+ '-' + (d<=9?'0'+d:d);

}
/* 获取一个月前时间 格式YYYY-MM-DD */
export function getoneMonthDate() {
  var nowdate = new Date();
  nowdate.setMonth(nowdate.getMonth() - 1);
  var y = nowdate.getFullYear();
  var m = nowdate.getMonth() + 1;
  var d = nowdate.getDate();
  return  y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
}
/**
 * 获取当前的日期时间 格式“yyyy-MM-dd HH:MM:SS”
 * @returns {string}
 */
export function getNowFormatDate() {
  var date = new Date();
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
    + " " + date.getHours() + seperator2 + date.getMinutes()
    + seperator2 + date.getSeconds();
  return currentdate;
}
/**
 * 将秒数换成时分秒格式
 */
export function formatSeconds(value) {
  var secondTime = parseInt(value);// 秒
  var minuteTime = 0;// 分
  var hourTime = 0;// 小时

  if(!secondTime){
    return value
  }

  if(secondTime > 60) {//如果秒数大于60，将秒数转换成整数
    //获取分钟，除以60取整数，得到整数分钟
    minuteTime = parseInt(secondTime / 60);
    //获取秒数，秒数取佘，得到整数秒数
    secondTime = parseInt(secondTime % 60);
    //如果分钟大于60，将分钟转换成小时
    if(minuteTime > 60) {
      //获取小时，获取分钟除以60，得到整数小时
      hourTime = parseInt(minuteTime / 60);
      //获取小时后取佘的分，获取分钟除以60取佘的分
      minuteTime = parseInt(minuteTime % 60);
    }
  }
  var result = "" + (parseInt(secondTime)>10?parseInt(secondTime):0+parseInt(secondTime));

  if(minuteTime >= 0) {
    result = "" + (parseInt(minuteTime)>10?parseInt(minuteTime):'0'+parseInt(minuteTime)) + " : " + result;
  }
  if(hourTime >= 0) {
    result = "" + (parseInt(hourTime)>10?parseInt(hourTime):'0'+parseInt(hourTime)) + " : " + result;
  }
  return result;
}

/**=================================================================
 输入相关
 =================================================================*/
/**
 * Created by huang on 2017/9/10.
 */
/**
 * 获取当前textarea光标位置
 */
export function getCursorPosition(textarea) {
  var rangeData = {text: "", start: 0, end: 0 };
  textarea.focus();
  if (textarea.setSelectionRange) { // W3C
    rangeData.start= textarea.selectionStart;
    rangeData.end = textarea.selectionEnd;
    rangeData.text = (rangeData.start != rangeData.end) ? textarea.value.substring(rangeData.start, rangeData.end): "";
  } else if (document.selection) { // IE
    var i,
      oS = document.selection.createRange(),
      // Don't: oR = textarea.createTextRange()
      oR = document.body.createTextRange();
    oR.moveToElementText(textarea);
    rangeData.text = oS.text;
    rangeData.bookmark = oS.getBookmark();
    // object.moveStart(sUnit [, iCount])
    // Return Value: Integer that returns the number of units moved.
    for (i = 0; oR.compareEndPoints('StartToStart', oS) < 0 && oS.moveStart("character", -1) !== 0; i ++) {
      // Why? You can alert(textarea.value.length)
      if (textarea.value.charAt(i) == '/n') {
        i ++;
      }
    }
    rangeData.start = i;
    rangeData.end = rangeData.text.length + rangeData.start;
  }
  return rangeData;
}

/**
 *得到 Textarea 元素光标位置，当Textarea 中的光标丢失了，再设置回来时
 */
export function setCursorPosition(textarea, rangeData) {
  if(!rangeData) {
    alert("You must get cursor position first.")
  }
  if (textarea.setSelectionRange) { // W3C
    textarea.focus();
    textarea.setSelectionRange(rangeData.start, rangeData.end);
  } else if (textarea.createTextRange) { // IE
    var oR = textarea.createTextRange();
    // Fixbug :
    // In IE, if cursor position at the end of textarea, the setCursorPosition function don't work
    if(textarea.value.length === rangeData.start) {
      oR.collapse(false)
      oR.select();
    } else {
      oR.moveToBookmark(rangeData.bookmark);
      oR.select();
    }
  }
}

/**
 *获取HTML中的纯文本信息
 */
export function getHTMLText(str) {
  str=str?str:'';
  str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
  str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
  //str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
  str=str.replace(/&nbsp;/ig,'');//去掉&nbsp;
  str=str.replace(/\s/g,''); //将空格去掉
  return str;
}

/**
 * 数组或对象递归遍历 （其中如果参数是数组，那么数组元素应该是对象形式）
 * @param objOrList 要递归遍历的对象 or 数组
 * @param children 子节点字段
 * @param fn 处理函数
 */
export function recurveList(objOrList,children,handleFn){
  children = children?children:'children';
  for(var key in objOrList){
    if(handleFn){
      handleFn(objOrList[key],key)
    }
    if(objOrList[key][children] && objOrList[key][children].length > 0){
      recurveList(objOrList[key][children],children,handleFn);
    }
  }
}

/**
 * 处理接口返回的msg 将返回错误信息中的====>去掉
 */
export function handleMsg(msg) {
 return this.replace(/(\S*)===>/,'');
}


export let Browser = (function () {

  var ua = navigator.userAgent.toLowerCase(),s;
  var B = {
    ie 			: (s = ua.match(/(msie\s|trident.*rv:)([\d.]+)/))? parseInt(s[2]):false,
    firefox 	: (s =ua.match(/firefox\/([\d.]+)/))? parseInt(s[1]):false,
    chrome 		: (s = ua.match(/chrome\/([\d.]+)/))?parseInt(s[1]):false,
    opera 		: (s = ua.match(/opera.([\d.]+)/))?parseInt(s[1]):false,
    safari 		: (s = ua.match(/version\/([\d.]+).*safari/))?parseInt(s[1]):false,
    android		: (s=ua.match(/android/))?s:false,
    iphone 		: (s=ua.match(/iphone os/))?s:false,
    ipad 		: (s=ua.match(/ipad/))?s:false,
    isWin32 	: /win32/i.test(window.navigator.platform),
    isWeixin 	: (s=ua.match(/MicroMessenger/i))?!!s:false, //判断是否是在微信浏览器里面
    isUcweb 	: (s=ua.match(/ucbrowser/))?!!s:false,
    isMqq 		: (s=ua.match(/mqqbrowser/))?!!s:false, //是否是手机qq浏览器
    isWeiBo 	: (s=ua.match(/__weibo__/))?!!s:false, //是否微博浏览器
  };
  B.ios = B.ipad || B.iphone;//判断是否是ios

  return B;
})();

/**
 * 字符串格式验证
 */
//checkType('165226226326','phone')
//false
//大家可以根据需要扩展
export function checkType (str, type) {
  str=str?str.toString():'';
  switch (type) {
    case 'email':
      return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(str);
    case 'phone':
      return /^1[3|4|5|7|8][0-9]{9}$/.test(str);
    case 'tel':
      return /^(0\d{2,3}-\d{7,8})(-\d{1,4})?$/.test(str);
    case 'number':
      return /^\+?[1-9][0-9]*$/.test(str);
    case 'english':
      return /^[a-zA-Z]+$/.test(str);
    case 'chinese':
      return /^[\u4E00-\u9FA5]+$/.test(str);
    case 'lower':
      return /^[a-z]+$/.test(str);
    case 'upper':
      return /^[A-Z]+$/.test(str);
    default :
      return true;
  }
}

/**
 * 封装一个缓动函数
 * @param start 初始值
 * @param end 最终值
 * @param time 运动时间
 * @param callback 回调函数
 */
export function perfectAnimate(start,end,time,callback,noEnd){
  var t = 0;
  var unm = time/40;
  var timer;
  var state=start;
  var easeOut = function(t, b, c, d) {
    return -c * ((t = t/d - 1) * t * t*t - 1) + b;
  };

  timer = setInterval(()=>{
    let m = Math.ceil(easeOut(t,start,end-start,unm))
    t++;
    if(t<unm){
      state = m;
      callback&&callback(state);
      if(noEnd&&(end-m)<=1){
        clearInterval(timer);
      }
    }else{
      state = end;
      callback&&callback(state);
      clearInterval(timer);
    }
  },40);

  return {
    bort:function () {
      timer&&clearInterval(timer);
    },
    end:function () {
      timer&&clearInterval(timer);
      let endState = state;
      var endTime = setInterval(()=>{
        endState++;
        if(endState<end){
          callback&&callback(endState);
        }else{
          callback&&callback(end);
          clearInterval(endTime);
        }
      },20);
    }
  }
}

/**
 * 下载文件
 * @param url
 */
export function downloadFile(url) {
  var iframe = document.createElement("iframe");
  iframe.name = 'iframe-' + (+new Date())
  iframe.style.display = "none";
  iframe.src = url;
  document.body.appendChild(iframe);
}

/**
 * 复制到剪切板
 * @param str
 */
export function copy(str){
  var save = function (e){
    e.clipboardData.setData('text/plain',str);//下面会说到clipboardData对象
    e.preventDefault();//阻止默认行为
  }
  document.addEventListener('copy',save);
  document.execCommand("copy");//使文档处于可编辑状态，否则无效
}
/**
 * 解析url地址
 * @param url
 * @returns {{source: *, protocol, host: (*|string), port, query, params, file: *, hash, path: string, relative: string, segments: Array}}
 */
export function parseURL(url) {
  var a =  document.createElement('a');
  a.href = url;
  return {
    source: url,
    protocol: a.protocol.replace(':',''),
    host: a.hostname,
    port: a.port,
    query: a.search,
    params: (function(){
      var ret = {},
        seg = a.search.replace(/^\?/,'').split('&'),
        len = seg.length, i = 0, s;
      for (;i<len;i++) {
        if (!seg[i]) { continue; }
        s = seg[i].split('=');
        ret[s[0]] = s[1];
      }
      return ret;
    })(),
    file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
    hash: a.hash.replace('#',''),
    path: a.pathname.replace(/^([^\/])/,'/$1'),
    relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
    segments: a.pathname.replace(/^\//,'').split('/')
  };


}

/**
 * 对象数组深拷贝
 * @param source
 * @returns {*}
 */
export function objArrayDeepCopy(source) {
  var sourceCopy = source instanceof Array ? [] : {};
  for (var item in source) {
    sourceCopy[item] = typeof source[item] === 'object' ? objDeepCopy(source[item]) : source[item];
  }
  return sourceCopy;
}


/*
 * 判断变量是否空值
 * undefined, null, '', false, 0, [], {} 均返回true，否则返回false
 */
export function Empty(v) {
  switch (typeof v) {
    case 'undefined':
      return true;
      break;
    case 'string':
      if (v.length == 0)
        return true;
      break;
    case 'boolean':
      if (!v)
        return true;
      break;
    case 'number':
      if (0 === v)
        return true;
      break;
    case 'object':
      if (null == v)
        return true;
      if (undefined !== v.length && v.length == 0)
        return true;
      for (var k in v) {
        return false;
      }
      return false;
      break;
  }
  return false;
}
