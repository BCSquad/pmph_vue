/**
 * Created by huang on 2017/9/10.
 *
 * 自定义一些配置文件信息
 */

let host = window.location.host;

//默认api请求头地址
export let BASE_WS_URL = 'ws://39.107.80.79/pmpheep/';
export let BASE_URL = 'http://'+host+'/pmpheep/';
//
// export const BASE_WS_URL = 'ws://192.168.200.126:8090/pmpheep/';
// export const BASE_URL = 'http://192.168.200.126:8090/pmpheep/';

//默认头像地址
export let DEFAULT_USER_IMAGE = 'http://'+host+'/static/default_image.png';
export let DEFAULT_BASE_URL = 'http://'+host;
//请求教材图片根路径地址
export let teachPicUrl ='http://120.76.221.250'