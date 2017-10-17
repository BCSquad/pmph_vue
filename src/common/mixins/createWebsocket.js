import bus from '../eventBus/bus'
import {BASE_WS_URL} from '../config';
import { mySessionStorage} from '../../../static/commonFun.js';
export default {
  created() {
    if(!WebSocket){
      console.error('浏览器不支持websocket')
    };
    var userType = mySessionStorage.get('currentUser', 'json').loginType || '';
    console.log(BASE_WS_URL + 'websocket?userType=' + userType);
    var socket = new WebSocket(BASE_WS_URL + 'websocket?userType=' + userType);
    /**
     * websocket创建成功事件
     */
    socket.addEventListener('open', function (event) {
      console.log('websocket 连接成功');
      console.log(event);
    });
    /**
     * websocket error事件
     */
    socket.addEventListener('error', function (event) {
      console.log('websocket 连接失败');
      console.log(event);
    });
    /**
     * websocket close事件
     */
    socket.addEventListener('close', function (event) {
      console.log('websocket 连接关闭');
      console.log(event);
    });
    /**
     * 接收到消息用vue event bus抛出事件
     */
    socket.addEventListener('message', function (event) {
      bus.$emit('ws:message', event.data);
    });
    /**
     * 监听发送消息事件
     */
    bus.$on('ws:send', function (data) {
      socket.send(JSON.stringify(data));
    });
    /**
     * 关闭websocket事件
     */
    bus.$on('ws:close', function () {
      socket.close();
    });
  },
  beforeDestroy(){
    bus.$emit('ws:close');
  },
};
