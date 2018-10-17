<template>
  <div class="index">
    <div class="paddingB10 border-dashed-B">
      <span class="fontsize-20 fontBold orange marginR20">{{userInfo.realname}}，欢迎您！</span>
      <span class="marginR20">您的身份是：<span class="fontsize-lg orange">{{pmphRole.roleName || userType}}</span></span>
      <span class="blue">最近登录：{{lastLoginTime || currentTime}}</span>
    </div>
    <ul class="backlogList paddingT20 paddingB20 clearfix">
      <li>
        <router-link :to="{name:'通知列表'}">
          <span><i class="fa fa-home fa-fw"></i></span>
          教材申报
          <span class="orange">({{isShowSide(2)?materialListTotal:'0'}})</span>
        </router-link>
      </li>
      <li>
        <router-link :to="{name:'选题申报审核'}">
          <span><i class="fa fa-home fa-fw"></i></span>
          选题申报
          <span class="orange">({{isShowSide(7)?topicList.total:'0'}})</span>
        </router-link>
      </li>
      <li>
        <router-link :to="{name:'个人用户',params:{activeName:'second'}}">
          <span><i class="fa fa-home fa-fw"></i></span>
          教师认证
          <span class="orange">({{isShowSide(11)||isShowSide(33)?writerUserCount:'0'}})</span>
        </router-link>
      </li>
      <li>
        <router-link :to="{name:'学校 / 医院用户',params:{activeName:'second'}}">
          <span><i class="fa fa-home fa-fw"></i></span>
          机构认证
          <span class="orange">({{isShowSide(11)||isShowSide(34)?orgUserCount:'0'}})</span>
        </router-link>
      </li>
    </ul>

    <ul class="clearfix panel-box">
      <li>
        <div>
          <p class="fontsize-lg fontBold panel-title pull-left paddingR30">教材申报</p>
          <el-tabs v-model="activeName1" @tab-click="materialListChange">
            <el-tab-pane label="全部" name="first">
              <ul class="panel-min-list" v-if="materialList.rows.length!=0&&materialAuthor>0" style="position: relative;height: 248px;">
                <li v-for="(iterm,index) in materialList.rows" :key="index" v-if="index<limit_size" class="ellipsis">
                  <el-tag :type="iterm.state==='已发布'?'success':(iterm.state==='已结束'?'gray':'primary')">{{ iterm.state }}</el-tag>
                  <router-link :to="{name:'通知列表',params:{materialName:iterm.materialName}}">{{iterm.materialName}}</router-link>
                </li>
                <li class="panel-more-btn" v-if="!materialList.last && !materialList.loading" style="position: absolute;bottom: 0;left:40%;">
                  <router-link :to="{name:'通知列表',params:{materialState:this.materialState}}">
                    查看更多
                    <i class="el-icon-d-arrow-right"></i>
                  </router-link>
                </li>
              </ul>
              <p v-else  class="no_conact_data">暂无需要您处理的教材</p>
            </el-tab-pane>
            <el-tab-pane label="已发布" name="second">
              <ul class="panel-min-list" v-if="materialList.rows.length!=0&&materialAuthor>0" style="position: relative;height: 248px;">
                <li v-for="(iterm,index) in materialList.rows" :key="index" v-if="index<limit_size">
                  <el-tag :type="iterm.state==='已发布'?'success':(iterm.state==='已结束'?'gray':'primary')">{{ iterm.state }}</el-tag>
                  <router-link :to="{name:'通知列表',params:{materialName:iterm.materialName}}">{{iterm.materialName}}</router-link>
                </li>
                <li class="panel-more-btn" v-if="!materialList.last" style="position: absolute;bottom: 0; left:40%;">
                  <router-link :to="{name:'通知列表',params:{materialState:this.materialState}}">
                    查看更多
                    <i class="el-icon-d-arrow-right"></i>
                  </router-link>
                </li>
              </ul>
              <p v-else  class="no_conact_data">暂无需要您处理的教材</p>
            </el-tab-pane>
            <el-tab-pane label="报名结束" name="third" style="position: relative;height: 248px;">
              <ul class="panel-min-list" v-if="materialList.rows.length!=0&&materialAuthor>0">
                <li v-for="(iterm,index) in materialList.rows" :key="index" v-if="index<limit_size" >
                  <el-tag :type="iterm.state==='已发布'?'success':(iterm.state==='已结束'?'gray':'primary')">{{ iterm.state }}</el-tag>
                  <router-link :to="{name:'通知列表',params:{materialName:iterm.materialName}}">{{iterm.materialName}}</router-link>
                </li>
                <li class="panel-more-btn" v-if="!materialList.last" style="position: absolute;bottom: 0;left:40%;">
                  <router-link :to="{name:'通知列表',params:{materialState:this.materialState}}">
                    查看更多
                    <i class="el-icon-d-arrow-right"></i>
                  </router-link>
                </li>
              </ul>
              <p v-else  class="no_conact_data">暂无需要您处理的教材</p>
            </el-tab-pane>
            <el-tab-pane label="遴选结束" name="fourth" style="position: relative;height: 248px;">
              <ul class="panel-min-list" v-if="materialList.rows.length!=0&&materialAuthor>0">
                <li v-for="(iterm,index) in materialList.rows" :key="index" v-if="index<limit_size" >
                  <el-tag :type="iterm.state==='已发布'?'success':(iterm.state==='已结束'?'gray':'primary')">{{ iterm.state }}</el-tag>
                  <router-link :to="{name:'通知列表',params:{materialName:iterm.materialName}}">{{iterm.materialName}}</router-link>
                </li>
                <li class="panel-more-btn" v-if="!materialList.last" style="position: absolute;bottom: 0;left:40%;">
                  <router-link :to="{name:'通知列表',params:{materialState:this.materialState}}">
                    查看更多
                    <i class="el-icon-d-arrow-right"></i>
                  </router-link>
                </li>
              </ul>
              <p v-else  class="no_conact_data">暂无需要您处理的教材</p>
            </el-tab-pane>
          </el-tabs>
        </div>
      </li>
      <li>
        <div>
          <p class="fontsize-lg fontBold panel-title paddingR30">小组</p>
          <div class="panel-iterm" style="height:263px;position: relative;">
            <!--小组头像-->
            <router-link class="groupHead"
                         :to="{name:'小组管理'}"
                 v-for="(item,index) in groupList.rows"
                 :key="index"
                 @click="clickGroup(item.id,item)"
                         v-if="index<3&&groupList.rows.length!=0&&groupAuthor>0"
            >
              <div class="groupHead-inner">
                <span class="groupHeadImg">
                  <img :src="item.groupImage" alt="小组头像">
                </span>
                <div class="groupHeadName">
                  <span>{{item.groupName}}</span>
                  <!--<span> ( {{item.num}} 人 )</span>-->
                </div>
                <span class="lastMessageTime">{{$commonFun.getDateDiff(item.gmtLastMessage)}}</span>
              </div>
            </router-link>
            <div class="panel-more-btn" v-if="groupList.total>4&&groupList.rows.length!=0&&groupAuthor>0" style="position: absolute;bottom: 4px;left:40%;">
              <router-link :to="{name:'小组管理'}">
                查看更多
                <i class="el-icon-d-arrow-right"></i>
              </router-link>
            </div>
            <p v-if="groupList.rows.length==0"  class="no_conact_data">您暂未加入任何小组</p>
          </div>

        </div>
      </li>
    </ul>
    <ul class="clearfix panel-box">
      <li>
        <div>
          <p class="fontsize-lg fontBold panel-title pull-left paddingR30">选题申报</p>
          <el-tabs v-model="activeName2">
            <el-tab-pane label="全部" name="first">
              <ul class="panel-min-list" v-if="topicList.rows.length!=0&&topicAuthor>0">
                <li v-for="(iterm,index) in topicList.rows" :key="index" v-if="index<limit_size">
                  <el-tag :type="iterm.state==='不通过'?'gray':'success'">{{ iterm.state }}</el-tag>

                  <router-link  v-if="iterm.state=='通过'||iterm.state=='不通过'"  :to="{name:'选题申报查看',params:{searchInput:iterm.bookname,activeIndex:'second'}}">{{iterm.bookname}}</router-link>
                  <router-link v-else :to="{name:isShowSide(22)||isShowSide(7)?'选题申报查看':'选题申报审核',params:{searchInput:iterm.bookname,activeIndex:'first'}}">{{iterm.bookname}}</router-link>
                </li>
                <li class="panel-more-btn" v-if="topicList.total>limit_size">
                  <router-link :to="{name:isShowSide(22)||isShowSide(7)?'选题申报查看':'选题申报审核'}">
                    查看更多
                    <i class="el-icon-d-arrow-right"></i>                  </router-link>
                </li>
              </ul>
              <p v-else  class="no_conact_data">暂无需要您处理的选题</p>
            </el-tab-pane>
            <el-tab-pane label="进行中" name="second">
              <ul class="panel-min-list"  v-if="topicList.rows.length!=0&&topicAuthor>0">
                <li v-for="(iterm,index) in topicListing.rows" :key="index" v-if="index<limit_size&&iterm.state!='通过'&&iterm.state!='不通过'">
                  <el-tag type="success" >{{iterm.state}}</el-tag>
                  <router-link :to="{name:isShowSide(22)||isShowSide(7)?'选题申报查看':'选题申报审核',params:{searchInput:iterm.bookname,activeIndex:'first'}}">{{iterm.bookname}}</router-link>
                </li>
                <li class="panel-more-btn" v-if="topicing>limit_size">
                  <router-link :to="{name:isShowSide(22)||isShowSide(7)?'选题申报查看':'选题申报审核'}">
                    查看更多
                    <i class="el-icon-d-arrow-right"></i>
                  </router-link>
                </li>
              </ul>
              <p v-else  class="no_conact_data">暂无需要您处理的选题</p>
            </el-tab-pane>
            <el-tab-pane label="已结束" name="fourth">
              <ul class="panel-min-list" v-if="topicList.rows.length!=0&&topicAuthor>0">
                <li v-for="(iterm,index) in topicListEnd.rows" :key="index" v-if="index<limit_size&&(iterm.state=='不通过'||iterm.state=='通过')">
                  <el-tag :type="iterm.state=='不通过'?'gray':'success'" >{{iterm.state}}</el-tag>
                  <router-link :to="{name:'选题申报查看',params:{searchInput:iterm.bookname,activeIndex:'second'}}">{{iterm.bookname}}</router-link>
                </li>
                <li class="panel-more-btn" v-if="topicEnd>limit_size">
                  <router-link :to="{name:'选题申报查看',params:{searchInput:'',activeIndex:'second'}}">
                    查看更多
                    <i class="el-icon-d-arrow-right"></i>
                  </router-link>
                </li>
              </ul>
              <p v-else  class="no_conact_data">暂无需要您处理的选题</p>
            </el-tab-pane>
          </el-tabs>
        </div>
      </li>
      <li>
        <div>
          <el-tabs v-model="activeName3">
            <el-tab-pane label="文章审核" name="first" >
              <ul class="panel-min-list" v-if="cmsContent.rows.length!=0&&(isShowSide(5)||isShowSide(15))&&publishAuthor>0">
                <li v-for="(iterm,index) in cmsContent.rows" :key="index" v-if="index<limit_size" style="text-overflow: ellipsis;overflow: hidden;white-space: nowrap;">
                  <router-link :to="{name:'文章管理',params:{searchInput:iterm.title}}">{{iterm.title}}</router-link>
                </li>
                <li class="panel-more-btn" v-if="cmsContent.total>limit_size">
                  <router-link :to="{name:'文章管理'}">
                    查看更多
                    <i class="el-icon-d-arrow-right"></i>
                  </router-link>
                </li>
              </ul>
              <p v-else  class="no_conact_data">暂无待处理的事项</p>
            </el-tab-pane>
            <el-tab-pane label="图书纠错审核" name="second">
              <ul class="panel-min-list" v-if="bookCorrectionAudit.rows.length!=0&&(isShowSide(8)||isShowSide(23))&&bookerrorAuthor>0">
                <li v-for="(iterm,index) in bookCorrectionAudit.rows" :key="index" v-if="index<limit_size" class="ellipsis" style="text-overflow: ellipsis;overflow: hidden;white-space: nowrap;">
                  <router-link :to="{name:'图书纠错审核',params:{searchInput:iterm.bookname}}">《{{iterm.bookname}}》</router-link>
                </li>
                <li class="panel-more-btn" v-if=" bookCorrectionAudit.total>limit_size">
                  <router-link :to="{name:'图书纠错审核'}">
                    查看更多
                    <i class="el-icon-d-arrow-right"></i>
                  </router-link>
                </li>
              </ul>
              <p v-else  class="no_conact_data">暂无待处理的事项</p>
            </el-tab-pane>
            <el-tab-pane label="图书评论审核" name="three">
              <ul class="panel-min-list" v-if="bookUserComment.rows.length!=0&&(isShowSide(6)||isShowSide(20))&&CommentManageAuthor>0">
                <li v-for="(iterm,index) in bookUserComment.rows" :key="index" v-if="index<limit_size" class="ellipsis" style="text-overflow: ellipsis;overflow: hidden;white-space: nowrap;">
                  <router-link :to="{name:'评论审核',params:{bookname:iterm.bookname,isLong:iterm.isLong}}"><p class="comment">《{{iterm.bookname}}》：<span v-html="iterm.content"></span></p></router-link>
                </li>
                <li class="panel-more-btn" v-if="bookUserComment.total>limit_size">
                  <router-link :to="{name:'评论审核'}">
                    查看更多
                    <i class="el-icon-d-arrow-right"></i>
                  </router-link>
                </li>
              </ul>
              <p v-else  class="no_conact_data">暂无待处理的事项</p>
            </el-tab-pane>
            <el-tab-pane label="读书反馈审核" name="fourth">
              <ul class="panel-min-list" v-if="bookFeedBack.rows.length!=0&&(isShowSide(6)||isShowSide(43))&&bookFeedBackAuthor>0">
                <li v-for="(iterm,index) in bookFeedBack.rows" :key="index" v-if="index<limit_size" class="ellipsis" style="text-overflow: ellipsis;overflow: hidden;white-space: nowrap;">
                  <router-link :to="{name:'读书反馈详情',query:{id: iterm.id,type:iterm.result?'detail':'check'}}"><p class="comment">《{{iterm.bookname}}》：<span v-html="iterm.content"></span></p></router-link>
                </li>
                <li class="panel-more-btn" v-if="bookFeedBack.total>limit_size">
                  <router-link :to="{name:'读书反馈'}">
                    查看更多
                    <i class="el-icon-d-arrow-right"></i>
                  </router-link>
                </li>
              </ul>
              <p v-else  class="no_conact_data">暂无待处理的事项</p>
            </el-tab-pane>
            <!-- <el-tab-pane label="图书附件审核" name="four">
              <ul class="panel-min-list">
                <li v-for="(iterm,index) in bookFiles.rows" :key="index" v-if="index<limit_size" class="ellipsis">
                  <router-link :to="{name:'通知列表'}">《{{iterm.title}}》：{{iterm.file}}</router-link>
                </li>
                <li class="panel-more-btn" v-if="bookFiles.total>limit_size">
                  <router-link to="/404">
                    查看更多
                    <i class="el-icon-d-arrow-right"></i>
                  </router-link>
                </li>
              </ul>
            </el-tab-pane> -->
          </el-tabs>
        </div>
      </li>
    </ul>
  </div>
</template>
<script type="text/javascript">
export default {
  data() {
    return {
      groupListUrl:'/pmpheep/group/list/pmphGroup',  //小组列表url
      limit_size: 5,
      DEFAULT_USER_IMAGE: this.$config.DEFAULT_USER_IMAGE,
      activeName1: "first",
      activeName2: "first",
      activeName3: "first",
      materialList: {
        loading:true,
        rows:[]
      },
      materialListTotal:0,
      materialState:'',
      groupList:{
        loading:true,
        rows:[]
      },

      materialAuthor:0,
      groupAuthor:0,
      topicAuthor:0,
      publishAuthor:0,
      bookerrorAuthor:0,
      CommentManageAuthor:0,
      bookFeedBackAuthor:0,
      topicList:{
        rows:[]
      },
      topicListing:{
        rows:[]
      },
      topicListEnd:{
        rows:[]
      },
      topicing:0,
      topicEnd:0,
      cmsContent:{
        rows:[]
      },
      bookUserComment:{
        rows:[]
      },
      bookCorrectionAudit:{
        rows:[]
      },
      bookFeedBack:{
        rows:[]
      },
      bookFiles:{},
      orgUserCount:'',
      writerUserCount:'',

      PermissionIds:[],
      pmphRole:{},
      lastLoginTime:undefined,
      userInfo:''
    };
  },
  computed: {
//    userInfo(){
//      return this.$getUserData().userInfo;
//    },
    userType(){
      let isAdmin = this.userInfo.isAdmin;
      if(isAdmin){
        return '超级管理员'
      }

      let loginType = this.userInfo.loginType;
      if(loginType===1){
        return '社内用户'
      }else{
        return '学校机构用户'
      }
    },
    currentTime(){
      let time = +new Date();
      return this.$commonFun.formatDate(time);
    },
  },
  methods:{
    SSOIndex(sessionId,token){
      var _this=this;
      //验证成功
      this.$axios.get('/pmpheep/pmph/SSOIndex',{params:{
          oldSessionId:sessionId,
          token:token
        }}).then(function(res) {
        if(res&&res.data.code==1){
          _this.$commonFun.Cookie.set('sessionId',res.data.data.userSessionId,2);
          _this.initUserInfo();
          _this.getPageData();
        }else{
         // _this.$message.error('账号/密码错误');
        }
      }).catch(function(err) {
        console.log(err)
       // _this.$message.error('登录失败');
      })
    },
    /**
     * 获取页面数据
     */
    getPageData(){
      var params = {
        state:'未结束',
        materialName:'',
        groupName:'',
        bookname:'',
        name:'',
        title:'',
        // authProgress:'1,2,3',
        authProgress:'1', //客户要求只显示待执行
        topicBookname:'',
      };
      this.$axios.get('/pmpheep/users/pmph/personal/center',{params:params})
        .then(response=>{
          var res = response.data;
          if(res.code==1){
            this.materialList = res.data.materialList;
            this.groupList = res.data.pmphGroup;
            let authorLength = res.data.userPermission.length;
            console.log(authorLength);
            let $self = this;
            /*switch (authorLength) {
              case 1:
            }*/
            if(authorLength>0){
              $self.materialAuthor = res.data.userPermission[0].materialAuthor;
            }
            if( authorLength>1){
              $self.groupAuthor = res.data.userPermission[1].materialAuthor;
            } if(authorLength>2){
              $self.topicAuthor = res.data.userPermission[2].materialAuthor;
            } if(authorLength>3){
              $self.publishAuthor = res.data.userPermission[3].materialAuthor;
            } if(authorLength>4){
              $self.bookerrorAuthor = res.data.userPermission[4].materialAuthor;
            } if(authorLength>5){
              $self.CommentManageAuthor = res.data.userPermission[5].materialAuthor;
            }if(authorLength>6) {
              //$self.bookFeedBackAuthor = res.data.userPermission[6].materialAuthor;

            }
            $self.bookFeedBackAuthor = $self.$getUserData().permissionIds.indexOf(6)>=-1



            res.data.topicList.rows.map(iterm=>{
            //  if($self.topicing>5&&$self.topicEnd>5)  break;
              /*let item ={
                state:iterm.state,
                bookname:iterm.bookname
              }*/
              if(iterm.state!='通过'&&iterm.state!='不通过'){
                $self.topicing++;
                $self.topicListing.rows.push(iterm);

              }else if(iterm.state=='不通过'||iterm.state=='通过'){
                $self.topicEnd++;
                $self.topicListEnd.rows.push(iterm);
              }


            })
            this.topicList = res.data.topicList;
            this.cmsContent = res.data.cmsContent;
            this.bookUserComment = res.data.bookUserComment;
            this.bookCorrectionAudit = res.data.bookCorrectionAudit;
            this.bookFeedBack = res.data.bookFeedBack;
            this.orgUserCount = res.data.orgUserCount;
            this.writerUserCount = res.data.writerUserCount;
            this.userInfo = res.data.pmphUser;
            this.materialListTotal=this.materialList.total;
            this.pmphRole = res.data.pmphRole[0];
            this.lastLoginTime = res.data.lastLoginTime;
          }
        })
        .catch(e=>{
          console.log(e);
        })
    },
    /**
     * 当点击教材申报列表tab切换时触发
     * @param val
     */
    materialListChange(val){
      let state = val.label;
      state=state==='全部'?'':state;
      this.materialState = state;
      this.$axios.get('/pmpheep/material/list',{params:{
        pageSize:5,
        pageNumber:1,
        isMy:false,
        state:state,
        contactUserName:'',
        materialName:'',
      }})
        .then(response=>{
          var res = response.data;
          if(res.code==1){
            this.materialList = res.data;
          }
        })
        .catch(e=>{
          console.log(e);
        })

    },
      //用户信息级别初始化
    initUserInfo(){
         if(this.$mySessionStorage.get('currentUser')){
          // console.log(this.$mySessionStorage.get('currentUser','json').pmphUserPermissionIds);
           this.PermissionIds = this.$mySessionStorage.get('currentUser','json').pmphUserPermissionIds;
         }
       },
       //判断是否具有权限
    isShowSide(num){
         var isShow=false;
         this.PermissionIds.forEach(function(item) {
           if(item==num){
             isShow=true;
           }
         });
         return isShow;
       },
  },
  mounted() {
    //将四个面板设为等高
  },
  created() {
    if(this.$route.query.sessionId&&this.$route.query.token){
      console.log("ssoIndex0");
      this.SSOIndex(this.$route.query.sessionId,this.$route.query.token);

    }else{
      this.initUserInfo();
      this.getPageData();
    }


  }
};
</script>
<style >
/*待办事项*/
.index .backlogList > li {
  float: left;
}
.index .backlogList > li + li {
  margin-left: 20px;
}
.index .backlogList > li > span:nth-of-type(1) {
  display: inline-block;
  width: 20px;
  height: 20px;
  line-height: 18px;
  text-align: center;
  background: #1abb9c;
  color: #fff;
  border-radius: 50%;
}

/*面板*/
.index .panel-box {
  /*max-width: 1200px;*/
  /*margin: 0 auto;*/
  overflow: hidden;
}
.index .panel-box > li {
  float: left;
  width: 50%;
  padding-bottom: 2000px;
  margin-bottom: -2000px;
  line-height: 24px;
}
.index .panel-box > li:nth-of-type(2n + 1) > div {
  margin: 10px 30px 10px 0;
}
.index .panel-box > li:nth-of-type(2n) > div {
  margin: 10px 0 10px 30px;
}
.index .panel-box > li > div {
  min-height: 200px;
  padding: 4px 0 0;
  border-top: 4px solid #e7eaec;
}
.index .panel-box > li > div > p {
  line-height: 40px;
}
.index .panel-iterm {
  border-top: 1px solid rgb(209, 217, 229);
}

.index .panel-min-list > li {
  margin: 4px 0;
  padding: 5px;
}
.index .panel-min-list > li:nth-of-type(2n + 1) {
  background: #f7f7f7;
}
.index .panel-min-list > li:hover {
  background: #f1f1f1;
}
.index .panel-more-btn {
  text-align: center;
}
.index .panel-more-btn > a {
  font-weight: 600;
  font-size: 14px;
  line-height: 1.42;
  color: #5a738e;
  display: block;
  padding: 4px 8px;
  margin: 8px 0;
}
/*小组*/
.index .groupHead {
  height: 68px;
  border-radius: 4px;
  cursor: pointer;
}
.index .groupHead:hover {
  background: rgba(255, 255, 255, 0.15);
}
.index .groupHead.active {
  background: rgba(255, 255, 255, 0.2);
}
.index .groupHead.firstIterm {
  /*background: rgba(255,255,255,.1);*/
}
.index .groupHead-inner {
  position: relative;
  padding: 10px 32px 10px 68px;
}
.index .groupHeadImg {
  position: absolute;
  left: 10px;
  top: 8px;
  width: 50px;
  height: 50px;
  overflow: hidden;
  border-radius: 50%;
}
.index .groupHeadImg > img {
  display: block;
  width: 100%;
  height:100%;
}
.index .lastMessageTime {
  position: absolute;
  right: 4px;
  top: 20px;
  width: 30px;
  height: 14px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}
.index .groupHeadName {
  font-size: 14px;
  line-height: 40px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.index .ellipsis {
  height: 25px;
}
.index .ellipsis .comment{
  width:100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.index .ellipsis .comment span p{
  display:inline;
}
.index .no_conact_data{
  color:rgb(94, 112, 130);
  text-align:center;
  margin-top:50px;
}
/*标签等宽 文字自适应填满*/
span.el-tag {
  min-width: 6em;
  text-align-last: justify;
  padding: 0 0.5em;
}
</style>
