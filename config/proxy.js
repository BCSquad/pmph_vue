

let proxyTable =  {
  '/pmpheep': {
    target: 'http://127.0.0.1:11000',//设置你调用的接口域名和端口号 别忘了加http
    changeOrigin: true,               // needed for virtual hosted sites
    ws: true,
  },
  'pmph_vedio':{
    target: 'http://127.0.0.1:11000',//设置你调用的接口域名和端口号 别忘了加http
    changeOrigin: true,               // needed for virtual hosted sites
    ws: true,
  },
  '/v': {
    target: 'http://192.168.100.131:11100',//设置你调用的接口域名和端口号 别忘了加http
    changeOrigin: true,               // needed for virtual hosted sites
    ws: true,
  }
};
module.exports = proxyTable;
