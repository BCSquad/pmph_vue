<template>
  <div class="app-wrapper" :class="{sidebarFlod:!sidebarFlod}">
    <div class="sidebar-wrapper" @click="sidebarWrapperClick">
      <Side-bar :sidebarFlod="sidebarFlod"></Side-bar>
    </div>
    <div class="controlSideBarBtn" @click="toggleSideBarBtnFold">
      <span></span>
    </div>
    <div class="nav-top">
      <div class="nav-top-user">
        <el-popover
          placement="bottom"
          width="160">
          <div style="text-align: right; margin: 0;height: 160px">
            <qriously :value="initQCode" :size="160"/>
          </div>
          <!--<el-button style="margin-right: 20px;" type="text" icon="el-icon-share" slot="reference">微信绑定</el-button>-->
        </el-popover>

        <Message-icon></Message-icon>
        <User :userData="userData"></User>
      </div>
      <div class="breadcrumb-wrapper">
        <Breadcrumb></Breadcrumb>
      </div>
    </div>
    <div class="app-main" ref="main">
      <div class="app-main-border-box">
        <div class="app-main-inner" :class="{'app_main_border':isShowBorder,'app_main_padding':isPadding}">
          <transition name="fade" mode="out-in">
            <router-view></router-view>
          </transition>
        </div>
        <div class="back_to_top" v-if="isShowBackTop" @click="backToTop"></div>
      </div>
    </div>
    <el-dialog
      title="微信绑定"
      :visible.sync="detailVisible"
      @close=""
      size="300"
      top="5%"
    >
      <div  v-if="!isUserId" style="width: 200px;">
      <el-input v-model="userId" placeholder="请输入微信企业号用户名" @keyup.enter.native="submit"></el-input>
       <div  style="padding-top:20px;text-align: center;">
         <el-button type="primary" @click="submit">确 定</el-button>
         <el-button type="primary" @click="close">取 消</el-button>
      </div>
      </div>
      <div v-if="isUserId" >
        <div style="text-align: center;">您当前userId为:{{userId}}</div>
        <div style="color:red;padding-top: 10px;" ><a href="#" style="color:red;" @click="unblind">>>解除绑定</a></div>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import SideBar from 'components/Side-bar'
  import MessageIcon from 'components/Message-icon'
  import User from 'components/User-headIcon';
  import Breadcrumb from 'components/Breadcrumb'
  import createWebsocket from 'common/mixins/createWebsocket'
  import bus from 'common/eventBus/bus'
  import CryptoJS from 'crypto-js'
  import VueQriously from 'vue-qriously'
  import Vue from 'vue'

  Vue.use(VueQriously)
  export default {
    mixins: [createWebsocket],
    data() {
      return {
        isShowBackTop: false,
        userId:'',
        isShowBorder: true,
        isPadding: false,
        sidebarFlod: true,
        userData: undefined,
        initQCode: '',
        detailVisible:false,
        isUserId:false
      }
    },
    computed: {
//      userData(){
//        return this.$getUserData().userInfo;
//      },
    },
    methods: {
      toggleSideBarBtnFold() {
        this.sidebarFlod = !this.sidebarFlod;
        bus.$emit('side-bar:flod_unflod');
      },
      sidebarWrapperClick() {
        if (!this.sidebarFlod) {
          bus.$emit('side-bar:flod_unflod');
        }
      },
      backToTop() {
        this.$refs['main'].scrollTop = 0;
      },
      //回到顶部事件初始化
      initBackTop() {
        var _this = this;
        this.$refs['main'].onscroll = function () {
          //  console.log(_this.$refs['main'].scrollTop,_this.$refs['main'].offsetHeight);
          if (_this.$refs['main'].scrollTop >= _this.$refs['main'].offsetHeight) {

            _this.isShowBackTop = true;
          } else {
            _this.isShowBackTop = false;
          }

        }
      },
      initIsShowBorder() {
          // console.log(this.$router.currentRoute.fullPath.split('/'));
        var str = this.$router.currentRoute.fullPath.split('/')[1];
        var str2 = this.$router.currentRoute.fullPath.split('/')[2];
        this.isShowBorder = true;
        this.isPadding = false;
        window.document.getElementsByClassName("app-main")[0].style.minWidth = '880px';
        if (str2 == 'declareTypeRepairs'||str == 'materialrouter' || str == 'groupmanage' || str == 'auth' || this.$router.currentRoute.name == '评论审核') {
          this.isShowBorder = false;
        }
        if (str2 == 'declareTypeRepairs' ||str2 == 'clinicalDecisionNav' ||this.$router.currentRoute.name == "临床决策专家申报审核"||this.$router.currentRoute.name == "临床决策专家申报"||str == 'user' && this.$router.currentRoute.name != '社内用户' || this.$router.currentRoute.name == '文章管理' || this.$router.currentRoute.name == '帮助管理' || this.$router.currentRoute.name == '常见问题' || this.$router.currentRoute.name == '操作手册上传' || str == "topic" || this.$router.currentRoute.name == '问卷模板新增' || this.$router.currentRoute.name == '结果明细' || this.$router.currentRoute.name == '发起调查' || this.$router.currentRoute.name == '问卷回收结果') {
          this.isPadding = true;
          if(this.$router.currentRoute.name == "临床决策专家申报审核"){
            //console.log(this.$refs['main']);
            //console.log(window.document.getElementsByClassName("app-main")[0].style );
            //window.document.getElementsByClassName("app-main")[0].style.overflowX="auto";
            window.document.getElementsByClassName("app-main")[0].style.minWidth="1500px";

          }
        }

        if (this.$router.currentRoute.name == "通知列表") {
          this.isShowBorder = true;
        }

      },
      /**
       * 获取页面数据
       */
      getPageData() {
        var params = {
          state: '',
          materialName: '',
          groupName: '',
          bookname: '',
          name: '',
          title: '',
          authProgress: '1,2,3',
          topicBookname: '',
        };
        this.$axios.get('/pmpheep/users/pmph/personal/center', {params: params})
          .then(response => {
            var res = response.data;
            if (res.code == 1) {
              this.userData = res.data.pmphUser;
              var encryptByDES = function (message, key) {
                var keyHex = CryptoJS.enc.Utf8.parse(key);
                var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
                  mode: CryptoJS.mode.ECB,
                  padding: CryptoJS.pad.Pkcs7
                });
                return encrypted.toString();
              }

              var data = {};
              data['timestamp'] = new Date().getTime();
              data['data'] = encryptByDES(res.data.pmphUser.username, data['timestamp'] + '123');

              this.initQCode =JSON.stringify(data) //encryptByDES("{'username':" + res.data.pmphUser.username + "}", '123')
            }
          })
          .catch(e => {
            console.log(e);
          })
      },
      showWx(){
        this.$axios.get('/pmpheep/wx/IsUserId') .then(response => {
          let res = response.data;
          console.log(res);
          if(res.data.isUserId){
            this.isUserId = true;
            this.userId = res.data.userId;

          }else{
            this.isUserId = false;
            this.userId = '';
          }
          this.detailVisible = true;
        }).catch(e => {
          this.detailVisible = true;
        })
      },
      close(){
        this.detailVisible = false;
      },
      submit(){
        var params = {
         userId:this.userId
        };
        this.$axios.get('/pmpheep/wx/findUserByUserId', {params: params})
          .then(response => {
            let res = response.data;
            console.log(res);
            if(res.data.errcode==0){
              this.$message.success("绑定成功");
              this.detailVisible = false;
            }else{
              this.$message.success("绑定失败");
            }

          })
          .catch(e => {
            console.log(e);
          })
      },
      unblind(){
        var params = {
          userId:this.userId
        };
        this.$axios.get('/pmpheep/wx/unblind', {params: params})
          .then(response => {
            let res = response.data;
            console.log(res);
            if(res.code==1){
              this.$message.success("解绑成功");
              this.detailVisible = false;
            }else{
              this.$message.success("解绑失败");
            }

          })
          .catch(e => {
            console.log(e);
          })
      }
    },
    components: {
      SideBar,
      User,
      MessageIcon,
      Breadcrumb
    },
    created() {
      this.getPageData();
    },
    mounted() {

      this.initBackTop();
      this.initIsShowBorder()


    },
    watch: {
      '$route': 'initIsShowBorder'
    }
  }
</script>

<style>
  .app-wrapper {
    position: relative;
    height: 100%;
  }

  .sidebar-wrapper {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    height: 100%;
    width: 200px;
    background-color: #2a3f54;
    z-index: 1001;
    overflow: hidden;
    transition: all .28s ease-out;
  }

  .app-main {
    position: relative;
    height: calc(100% - 38px);
    transition: all .28s ease-out;
    margin-left: 200px;
    margin-top: 38px;
    /*padding: 15px 20px;*/
    transition: all .3s;
    overflow-y: scroll;
    overflow-x:hidden;
    box-sizing: border-box;
    /*min-width: 1000px;*/
  }

  .app-main .back_to_top {
    position: fixed;
    width: 46px;
    height: 46px;
    right: 30px;
    bottom: 60px;
    background: url('../common/images/back_to_top.png') no-repeat 100%;
    background-position: 0px 0px;
    z-index: 999;
    cursor: pointer;
  }

  .app-main .back_to_top:hover {
    background-position: 0px -47px;
  }

  .app-main-inner {
    min-height: 100%;
    float: left;
    width: 100%;
    box-sizing: border-box;
  }

  .app-main-border-box{
    padding: 15px 15px;
    width: 100%;
    height: 100%;
    position: relative;
    box-sizing: border-box;
  }

  .app_main_border {
    border: 1px solid rgb(209, 217, 229);
    padding: 15px 20px;
    background: #fff;
    min-height: 100%;
  }

  .app_main_padding {
    padding: 0;
  }

  .nav-top {
    height: 38px;
    width: 100%;
    line-height: 38px;
    text-align: left;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    background-color: #ededed;

  }

  .nav-top-user {
    float: right;
    margin-right: 38px;
  }

  .breadcrumb-wrapper {
    display: inline-block;
    margin-left: 220px;
    transition: all 0.28s;
  }

  .app-wrapper.sidebarFlod .breadcrumb-wrapper {
    margin-left: 84px;
  }

  .controlSideBarBtn {
    position: fixed;
    bottom: 20px;
    left: 148px;
    padding: 5px;
    font-size: 0;
    z-index: 1003;
    transform: rotate(180deg);
    transition: all 0.28s;
    cursor: pointer;
    background-color: rgba(255, 255, 255, .3);
    background-position: center center;
    border-radius: 50%;
  }

  .controlSideBarBtn > span {
    position: relative;
    z-index: 1;
    display: inline-block;
    padding: 15px;
    background-image: url(../common/images/right_arrow.png);
    background-size: cover;

  }

  .controlSideBarBtn:hover {
    background-color: rgba(255, 255, 255, .5);
  }

  .app-wrapper.sidebarFlod .controlSideBarBtn {
    transform: rotate(-360deg);
    left: 12px;
    transition: all 0.28s;
  }

  .app-wrapper.sidebarFlod .app-main {
    margin-left: 64px;
  }

  .app-wrapper.sidebarFlod .sidebar-wrapper {
    width: 64px;
  }

  .app-wrapper.sidebarFlod .sidebar-wrapper .el-submenu__title span {
    display: none;
  }

  .app-wrapper.sidebarFlod .sidebar-wrapper .el-menu-item span {
    display: none;
  }

  .app-wrapper.sidebarFlod .sidebar-wrapper .el-submenu .el-menu {
    height: 0;
    overflow: hidden;
  }

  /*鼠标悬浮*/
  /*.app-wrapper.sidebarFlod .sidebar-wrapper:hover{*/
  /*width: 200px;*/
  /*}*/
  /*.app-wrapper.sidebarFlod .sidebar-wrapper:hover .el-submenu__title span{*/
  /*display: inline-block;*/
  /*}*/
  /*.app-wrapper.sidebarFlod .sidebar-wrapper:hover .el-submenu .el-menu{*/
  /*height: auto;*/
  /*overflow: auto;*/
  /*}*/
  /*鼠标悬浮end*/

  /*导航展开列样式*/
  .sidebar-wrapper li.el-submenu.is-opened {
    position: relative;
  }

  .sidebar-wrapper li.el-submenu:after {
    content: ' ';
    display: none;
    width: 8px;
    height: 0;
    position: absolute;
    right: 0;
    top: 0;
    background: #1abb9c;
    z-index: 1;
    transition: all .28s;
  }

  .sidebar-wrapper li.el-submenu.is-opened:after {
    display: inline-block;
    height: 100%;
  }

  .app-wrapper.sidebarFlod .sidebar-wrapper li.el-submenu:after {
    right: 136px;
  }

  .app-wrapper.sidebarFlod .sidebar-wrapper:hover li.el-submenu:after {
    right: 0;
  }

  #cas {
    position: absolute;
    left: 0;
    top: 0;
    width: 200px;
    height: 100%;
    z-index: 0;
  }
</style>
