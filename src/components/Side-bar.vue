<template>
	<div class="sildbar-wrapper">
    <div class="userHead">
      <div>
        <img src="../common/images/logo-text.png" alt="">
      </div>
    </div>

    <el-menu :default-active="activeIndex" theme="dark" class="sildbar-list" unique-opened router>
      <el-menu-item index="/index" v-if="isShowSide(1)">
        <i class="fa fa-home fa-fw"></i>
        <span slot="title">个人中心(首页)</span>
      </el-menu-item>
      <el-menu-item index="/materialrouter/materials" v-if="isShowSide(2)">
        <i class="fa fa-book fa-fw"></i>
        <span slot="title">教材申报</span>
      </el-menu-item>

      <el-submenu index="/clinicalDecisionRouter" v-if="isShowSide(52)||isShowSide(53)||isShowSide(54)||isShowSide(55)||isShowSide(56)">
        <template slot="title">
          <i class="iconfont icon-path-chufatiaoyan"></i>
          <span slot="title">调研表</span>
        </template>
        <el-menu-item index="/clinicalDecisionRouter/clinicalAssistant/clinicalProductList" v-if="isShowSide(52)||isShowSide(53)">调研表模板管理</el-menu-item>
        <el-menu-item index="/clinicalDecisionRouter/medicineAssistant/clinicalProductList" v-if="isShowSide(52)||isShowSide(54)">调研表发布管理</el-menu-item>
        <el-menu-item index="/clinicalDecisionRouter/chineseMedicineAssistant/clinicalProductList" v-if="isShowSide(52)||isShowSide(55)">教材相关调研统计</el-menu-item>
        <el-menu-item index="/clinicalDecisionRouter/declareTypeRepairs" v-if="isShowSide(52)||isShowSide(56)">其他调研统计</el-menu-item>
      </el-submenu>

      <el-submenu index="/clinicalDecisionRouter" v-if="isShowSide(44)||isShowSide(45)||isShowSide(46)||isShowSide(47)||isShowSide(48)||isShowSide(49)||isShowSide(50)||isShowSide(51)">
        <template slot="title">
          <i class="iconfont icon-linchuangjuecetubiao"></i>
          <span slot="title">临床决策</span>
        </template>
        <el-menu-item index="/clinicalDecisionRouter/clinicalAssistant/clinicalProductList" v-if="isShowSide(44)||isShowSide(45)">临床助手申报</el-menu-item>
        <el-menu-item index="/clinicalDecisionRouter/medicineAssistant/clinicalProductList" v-if="isShowSide(44)||isShowSide(46)">用药助手申报</el-menu-item>
        <el-menu-item index="/clinicalDecisionRouter/chineseMedicineAssistant/clinicalProductList" v-if="isShowSide(44)||isShowSide(47)">中医助手申报</el-menu-item>
        <!--<el-menu-item index="/clinicalDecisionRouter/clinicalAssistantTable" v-if="isShowSide(44)||isShowSide(49)">临床助手申报表</el-menu-item>
        <el-menu-item index="/clinicalDecisionRouter/medicineAssistantTable" v-if="isShowSide(44)||isShowSide(50)">用药助手申报表</el-menu-item>
        <el-menu-item index="/clinicalDecisionRouter/chineseMedicineAssistantTable" v-if="isShowSide(44)||isShowSide(51)">中医助手申报表</el-menu-item>-->
        <el-menu-item index="/clinicalDecisionRouter/declareTypeRepairs" v-if="isShowSide(44)||isShowSide(48)">申报分类维护</el-menu-item>
      </el-submenu>
      <el-menu-item index="/groupmanage" v-if="isShowSide(3)">
        <i class="fa fa-group fa-fw"></i>
        <span slot="title">我的小组</span>
      </el-menu-item>
      <el-menu-item index="/message/messagelist" v-if="isShowSide(4)">
        <i class="fa fa-comments-o fa-fw"></i>
        <span slot="title">系统消息</span>
      </el-menu-item>

      <el-submenu index="/content" v-if="isShowSide(5)||isShowSide(15)||isShowSide(16)||isShowSide(17)||isShowSide(18)">
        <template slot="title">
          <i class="fa  fa-file-text fa-fw"></i>
          <span slot="title">内容管理</span>
        </template>
        <el-menu-item index="/content/list" v-if="isShowSide(5)||isShowSide(15)">文章管理</el-menu-item>
        <el-menu-item index="/content/info" v-if="isShowSide(5)||isShowSide(16)">信息快报管理</el-menu-item>
        <el-menu-item index="/content/notice" v-if="isShowSide(5)||isShowSide(17)">公告管理</el-menu-item>
        <!-- <el-menu-item index="/content/set" v-if="isShowSide(12)">栏目设置</el-menu-item> -->
        <el-menu-item index="/content/ad" v-if="isShowSide(5)||isShowSide(18)">广告管理</el-menu-item>
        <el-menu-item index="/content/sensitive" v-if="isShowSide(5)||isShowSide(40)">敏感词管理</el-menu-item>
        <el-menu-item index="/content/help" v-if="isShowSide(5)||isShowSide(42)">帮助管理</el-menu-item>
      </el-submenu>
      <el-submenu index="/book" v-if="isShowSide(6)||isShowSide(19)||isShowSide(20)">
        <template slot="title">
          <i class="fa fa-align-justify fa-fw"></i>
          <span slot="title">商品管理</span>
        </template>
        <el-menu-item index="/book/manage" v-if="isShowSide(6)||isShowSide(19)">图书管理</el-menu-item>
        <el-menu-item index="/book/materialType" v-if="isShowSide(6)||isShowSide(44)">图书分类</el-menu-item>
        <el-menu-item index="/book/comment" v-if="isShowSide(6)||isShowSide(20)">评论审核</el-menu-item>
        <el-menu-item index="/book/video" v-if="isShowSide(6)||isShowSide(41)">微视频管理</el-menu-item>
        <el-menu-item index="/book/feedback" v-if="isShowSide(6)||isShowSide(43)">读者反馈</el-menu-item>
        <el-menu-item index="/bookerror/check" v-if="isShowSide(6)||isShowSide(23)">图书纠错审核</el-menu-item>
        <el-menu-item index="/bookerror/after" v-if="isShowSide(6)||isShowSide(24)">图书纠错跟踪</el-menu-item>
      </el-submenu>

      <el-submenu index="/topic"  v-if="isShowSide(7)||isShowSide(21)||isShowSide(22)">
        <template slot="title">
          <i class="fa fa-paste fa-fw"></i>
          <span slot="title">选题申报</span>
        </template>
        <el-menu-item index="/topic/exam" v-if="isShowSide(7)||isShowSide(21)">选题申报审核</el-menu-item>
        <el-menu-item index="/topic/check" v-if="isShowSide(7)||isShowSide(22)">选题申报查看</el-menu-item>
      </el-submenu>

     <!-- <el-submenu index="/bookerror" v-if="isShowSide(8)||isShowSide(23)||isShowSide(24)">
        <template slot="title">
          <i class="fa fa-exclamation-triangle fa-fw"></i>
          <span slot="title">图书纠错</span>
        </template>
        <el-menu-item index="/bookerror/check" v-if="isShowSide(8)||isShowSide(23)">图书纠错审核</el-menu-item>
        <el-menu-item index="/bookerror/after" v-if="isShowSide(8)||isShowSide(24)">图书纠错跟踪</el-menu-item>
      </el-submenu>-->

      <el-submenu index="/pointmanage" v-if="isShowSide(9)||isShowSide(25)||isShowSide(26)||isShowSide(27)">
        <template slot="title">
          <i class="fa fa-database fa-fw"></i>
          <span slot="title">积分管理</span>
        </template>
        <el-menu-item index="/pointmanage/pointrule" v-if="isShowSide(9)||isShowSide(25)">积分规则管理</el-menu-item>
        <el-menu-item index="/pointmanage/userpoint" v-if="isShowSide(9)||isShowSide(26)">用户积分看板</el-menu-item>
        <el-menu-item index="/pointmanage/convertiblerule" v-if="isShowSide(9)||isShowSide(27)">积分兑换规则</el-menu-item>
      </el-submenu>

      <el-submenu index="/analysis" v-if="isShowSide(10)||isShowSide(28)||isShowSide(29)||isShowSide(30)||isShowSide(31)">
        <template slot="title">
          <i class="fa fa-bar-chart fa-fw"></i>
          <span slot="title">数据分析</span>
        </template>
        <el-menu-item index="/analysis/flow" v-if="isShowSide(10)||isShowSide(28)">流量概况</el-menu-item>
        <el-menu-item index="/analysis/flow-map" v-if="isShowSide(10)||isShowSide(29)">流量地图</el-menu-item>
        <el-menu-item index="/analysis/book-flow" v-if="isShowSide(10)||isShowSide(30)">图书流量概况</el-menu-item>
        <el-menu-item index="/analysis/book-preference" v-if="isShowSide(10)||isShowSide(31)">用户图书偏好分析</el-menu-item>
      </el-submenu>

      <el-submenu index="/userrouter" v-if="isShowSide(11)||isShowSide(32)||isShowSide(33)||isShowSide(34)">
        <template slot="title">
          <i class="fa fa-user-plus fa-fw"></i>
          <span slot="title">用户管理</span>
        </template>
        <el-menu-item index="/user/pmph" v-if="isShowSide(11)||isShowSide(32)">社内用户</el-menu-item>
        <el-menu-item index="/user/writer" v-if="isShowSide(11)||isShowSide(33)">个人用户</el-menu-item>
        <el-menu-item index="/user/org" v-if="isShowSide(11)||isShowSide(34)">学校 / 医院用户</el-menu-item>
      </el-submenu>


      <el-submenu index="/set" v-if="isShowSide(12)||isShowSide(35)||isShowSide(36)">
        <template slot="title">
          <i class="fa fa-cog fa-fw"></i>
          <span slot="title">系统设置</span>
        </template>
        <el-menu-item index="/set/roles" v-if="isShowSide(12)||isShowSide(35)">角色</el-menu-item>
        <!-- <el-menu-item index="/set/area" v-if="isShowSide(19)">地区</el-menu-item>
        <el-menu-item index="/set/orgs" v-if="isShowSide(20)">院校机构</el-menu-item> -->
        <el-menu-item index="/set/departments" v-if="isShowSide(12)||isShowSide(36)">社内部门</el-menu-item>
      </el-submenu>

       <el-submenu index="/survey" v-if="isShowSide(13)||isShowSide(37)||isShowSide(38)||isShowSide(39)">
        <template slot="title">
          <i class="fa fa-pencil-square-o fa-fw"></i>
          <span slot="title">问卷调查</span>
        </template>
        <el-menu-item index="/survey/setmodel" v-if="isShowSide(13)||isShowSide(37)">调查问卷设置</el-menu-item>
        <!-- <el-menu-item index="/survey/newmodel" v-if="isShowSide(16)">问卷模板新增</el-menu-item>
        <el-menu-item index="/survey/newsurvey" v-if="isShowSide(17)">新建调查问卷</el-menu-item> -->
        <el-menu-item index="/survey/statistic" v-if="isShowSide(13)||isShowSide(38)">调查结果统计</el-menu-item>
        <el-menu-item index="/survey/recovery" v-if="isShowSide(13)||isShowSide(39)">调查问卷回收</el-menu-item>
      </el-submenu>

      <el-menu-item index="/systemlog" v-if="isShowSide(14)">
        <i class="fa fa-file-text-o fa-fw"></i>
        <span slot="title">系统日志</span>
      </el-menu-item>
    </el-menu>

	</div>
</template>

<script>
  export default {
    props:{
      sidebarFlod:{
        type:Boolean,
        default:true,

      }
    },
    data() {
      return {
        userLevel:0,
        activeIndex:'/index',
        PermissionIds:[],
      };
    },
    methods:{
      //用户信息级别初始化
       initUserInfo(){
         if(this.$mySessionStorage.get('currentUser')){
          // console.log(this.$mySessionStorage.get('currentUser','json').pmphUserPermissionIds);
           this.PermissionIds = this.$mySessionStorage.get('currentUser','json').pmphUserPermissionIds;
         }
       },
       //判断是否显示导航栏
       isShowSide(num){
         var isShow=false;


         this.PermissionIds.forEach(function(item) {
           if(item==num){
             isShow=true;
           }
         });
         return isShow;
       },
       //初始化列表active状态
       initActiveIndex(){
        // console.log(this.$router.currentRoute);
         var str =this.$router.currentRoute.path.split('/')[1];
         this.activeIndex=this.$router.currentRoute.path;
        /*  if(str=='userrouter'){
            this.activeIndex=this.$router.currentRoute.path;
         } */
         if(this.$router.currentRoute.name=="添加内容"){
           this.activeIndex='/content/publish/list';
         }
         if(str=='materialrouter'){
           this.activeIndex='/materialrouter/materials';
         }
         if(str=='auth'){
           this.activeIndex='/auth/writers';
         }
         if(str=='message'){
           this.activeIndex='/message/messagelist';
         }

       },
       //列表显示权限初始化
       initSideiShow(num){

       }
    },
    watch:{
       '$route':'initActiveIndex'
    },
    created(){
      this.initUserInfo();
      this.initActiveIndex();
    }
  }
</script>

<style>
  .sildbar-wrapper{
    width: 220px;
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    position: relative;
    z-index: 10;

  }
  .userHead{
    padding: 20px 0 30px;
  }
  .userHead>div{
    margin-left: -14px;
  }
  .userHead img {
    display: block;
    margin: 0 auto;
  }
  .icon {
    position: absolute;
    left: 210px;
    top: 3px;
    font-size: 30px;
    color: #2a3f54;
    line-height: 30px;
    cursor: pointer;
    transform: rotate(180deg);
    transition: all 0.4s;
  }
  .icon.isCollapse{
    transform: rotate(-180deg);
    transition: all 0.4s;
  }
  .sildbar-list{
    padding-bottom: 50px;
  }
</style>
