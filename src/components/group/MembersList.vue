/*成员列表组件*/
<template>
  <div class="memberlist-wrpper">
    <div class="meberlist-inner">
      <div class="head-title">
        <p>
          小组成员({{memberListData.length}}人)
          <!--<span class="pull-right" @click="settingClick">-->
          <!--<i class="fa fa-cog fa-lg"></i>-->
          <!--</span>-->
        </p>
      </div>
      <div class="meberlist">
        <beauty-scroll ref="beautyScroll">
          <div class="MemberHead" v-for="(item,index) in memberListData" :key="item.id">
            <div class="MemberHead-inner">
              <el-tooltip class="item MemberHeadImg" effect="dark" placement="left" >
                <div slot="content" >
                  <el-button type="info" round class="copy-btn" @click.once="copyInfo($event)"
                             data-clipboard-action="copy"
                             :data-clipboard-text="item.nickname+' '+item.handphone+' '+item.email">点击复制</el-button>
                  {{item.nickname}}<br/>{{item.handphone}}<br/>{{item.email}}
                </div>
                <img :src="item.avatar?$config.DEFAULT_BASE_URL+item.avatar:defaultImage" alt="小组头像">
              </el-tooltip>
              <div class="MemberHeadName">
                <span>{{item.displayName}}</span>
              </div>
              <span class="memberPermission" :style="{color:item.isFounder?'#FAB727':'#67BB4C'}">
                <el-tooltip class="item" effect="dark" content="创建者" placement="top" v-if="item.isFounder">
                  <i class="fa fa-user fa-lg"></i>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="管理员" placement="top" v-if="item.isAdmin">
                  <i class="fa fa-user fa-lg"></i>
                </el-tooltip>
              </span>
            </div>
          </div>
        </beauty-scroll>
      </div>
      <transition name="el-fade-in">
        <div class="addMemberWrapper text-center" v-if="crurrentMemberInfo.isFounder||crurrentMemberInfo.isSystemAdmin||crurrentMemberInfo.isAdmin">
          <el-button type="text" icon="plus" @click="addNewMember" class="button">
            新增成员
          </el-button>
        </div>
      </transition>
    </div>

    <!--新增成员弹窗-->
    <el-dialog :visible.sync="dialogVisible" size="large" top="30px">
      <el-tabs v-model="activeName">
        <el-tab-pane label="本套书籍用户" name="first" v-if="bookId>0">
          <div class="tabsContainer">

            <div class="searchBox-wrapper">
              <span>姓名/账号：</span>
              <div>
                <el-input placeholder="请输入内容" v-model.trim="textBookParams.searchParam" @keyup.enter.native="getTextBookUserList" class="searchInputEle"></el-input>
              </div>
            </div>

            <div class="searchBtn-wrapper text-right">
              <el-button type="primary" icon="search" @click="getTextBookUserList">搜索</el-button>
            </div>
            <div class="tableContainer groupmanageTable">
              <el-table ref="textBookUserTable"
                        :data="textBookTableData"
                        border tooltip-effect="dark"
                        @selection-change="writerCheckChange"
                        style="width: 100%;margin-bottom:20px;">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column prop="realname" label="姓名">
                </el-table-column>
                <el-table-column prop="username" label="账号">
                </el-table-column>
                <el-table-column prop="position" label="遴选职位">
                </el-table-column>
                <el-table-column prop="orgName" label="所属机构" show-overflow-tooltip>
                </el-table-column>
              </el-table>
              <el-pagination class="pull-right"
                             :page-sizes="[10, 20,30, 50, 100]"
                             :current-page.sync="textBookParams.pageNumber"
                             @size-change="textBookSizeChange"
                             @current-change="textBookCurrentChange"
                             v-if="textBookPageTotal>textBookParams.pageSize"
                             :page-size="textBookParams.pageSize"
                             layout="total, sizes, prev, pager, next, jumper"
                             :total="textBookPageTotal">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="作家用户" name="second">
          <div class="tabsContainer">

            <div class="searchBox-wrapper">
              <span>姓名/账号：</span>
              <div>
                <el-input placeholder="请输入内容" v-model.trim="writerParams.name" @keyup.enter.native="getWriterUserList" class="searchInputEle"></el-input>
              </div>
            </div>
            <div class="searchBox-wrapper">
              <span>所属机构：</span>
              <div>
                <el-input placeholder="请输入内容" v-model.trim="writerParams.orgName" @keyup.enter.native="getWriterUserList" class="searchInputEle"></el-input>
              </div>
            </div>
            <div class="searchBox-wrapper">
              <span>用户类型：</span>
              <div>
                <el-select v-model="writerParams.rank" placeholder="请选择" @change="getWriterUserList">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="searchBtn-wrapper text-right">
              <el-button type="primary" icon="search" @click="getWriterUserList">搜索</el-button>
            </div>
            <div class="tableContainer groupmanageTable">
              <el-table ref="writerUserTable"
              :data="writerTableData"
              border tooltip-effect="dark"
              @selection-change="writerCheckChange"
              style="width: 100%;margin-bottom:20px;">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column prop="realname" label="姓名">
                </el-table-column>
                <el-table-column prop="username" label="账号">
                </el-table-column>
                <el-table-column prop="position" label="遴选职位">
                </el-table-column>
                <el-table-column prop="orgName" label="所属机构" show-overflow-tooltip>
                </el-table-column>
              </el-table>
              <el-pagination class="pull-right"
              :page-sizes="[10, 20,30, 50, 100]"
              :current-page.sync="writerParams.pageNumber"
              @size-change="writerSizeChange"
              @current-change="writerCurrentChange"
              v-if="writerPageTotal>writerParams.pageSize"
              :page-size="writerParams.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="writerPageTotal">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="社内用户" name="third">
          <!--社内用户组件-->
          <user-pmph @selection-change="clubUserSelectChange" select :groupId="groupId" ></user-pmph>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showAddDialog" >添加成员</el-button>
      </span>
    </el-dialog>

    <!-- 再次确认弹框 -->
     <el-dialog :visible.sync="againDialogVisible" size="tiny" top="30px" >
          <el-table
          border
          :data="addTableData"
          style="width:100%;"
          >
          <el-table-column
        prop="realname"
        label="姓名"
        >
      </el-table-column>
      <el-table-column
        prop="realname"
        label="是否作家用户"
        >
        <template scope="scope">
          {{scope.row.isWriter?"是":"否"}}
          </template>
      </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">

        <el-button type="primary" @click="addNewSubmit" :loading="isLoadingUp">{{isLoadingUp?'正在提交':'确 定'}}</el-button>
        <el-button @click="againDialogVisible = false">取 消</el-button>
  </div>
     </el-dialog>
  </div>
</template>

<script>
import beautyScroll from 'components/beautyScroll.vue';
import bus from 'common/eventBus/bus.js';
import Clipboard from 'clipboard';

import userPmph from 'components/user-pmph'
export default {
  props: ['groupId','refreshMember','crurrentMemberInfo','bookId'],
  data() {
    return {
      dialogVisible: false,
      groupMemberUrl: '/pmpheep/group/list/pmphGroupMember',  //获取小组成员url
      textbookMemberUrl:'/pmpheep/group/member/getMaterialMember', //获取本套教材成员
      writerUserUrl: '/pmpheep/users/writer/list/writerUser',  //获取作家用户url
      addMemberUrl:'/pmpheep/group/add/groupMember',  //添加小组成员url
      writerParams: {
        groupId: this.groupId,
        orgName: '',
        name: '',
        rank: '',
        pageSize: 10,
        pageNumber: 1
      },
      textBookParams:{
        groupId: this.groupId,
        searchParam:'',
        pageSize: 10,
        pageNumber: 1
      },
      clipboard:"",
      isLoadingUp:false,
      writerPageTotal:0,
      textBookPageTotal:0,
      addMemberArr:[],
      defaultImage: this.$config.DEFAULT_USER_IMAGE,
      memberListData: [],
      /**
       * 新增小组成员的弹窗数据
       */
      activeName: this.bookId>0?'first':'second',
      writerTableData: [],
      textBookTableData: [],
      selectValue: '',
      options: [{
        value: '',
        label: '全部'
      }, {
        value: '0',
        label: '普通用户'
      }, {
        value: '1',
        label: '教师用户'
      }, {
        value: '2',
        label: '作家用户'
      }, {
        value: '3',
        label: '专家用户'
      }],
      againDialogVisible:false,     //再次确认弹窗
      addWriterData:[],
      addClubData:[],
      addTableData:[],
    }
  },
  methods: {
    /* 获取小组成员列表 */
    getGroupMember(val){
        var _this = this;

      this.$axios.get(this.groupMemberUrl, {
        params: {
          groupId: val,
          sessionId: this.$getUserData().sessionId
        }
      }).then(function(res) {
        if (res.data.code == 1) {
          _this.memberListData = res.data.data;
          _this.memberListData.forEach(item => {
            let avarInfo = item.avatarInfo.split("<br/>");
            item["nickname"] = avarInfo[0];
            item["handphone"] = avarInfo[1];
            item["email"] = avarInfo[2];
          })
          _this.$emit('getGroupMemberList',res.data.data);
        }
      })
    },

    /**
     * 点击复制成员信息到剪切板
     * 因el-tooltip要鼠标进入才插入到dom，而clipboard的加载时机最好是目标插入组件之后
     * 且tooltip是npm安装的组件，本地无代码可重写，也无完成回调，无法实现上需求
     * 本方法实现为：第一次点击事件调用本方法，初始化clipboard到复制按钮，然后立即出发一次按钮点击事件（以上仅第一次点击时调用）
     * */
    copyInfo(event){
      let target = event.currentTarget;
      var clip = new Clipboard(event.currentTarget);
      let _this =this;
      clip.on('success', function() {
        _this.$message.success("复制成功,  "+clip.defaultText(target));
      });
      clip.on('error', function() {
        _this.$message.error('复制失败，请手动选择复制！');
      });
      event.currentTarget.dispatchEvent(new Event('click'));
    },
    /* 获取作家用户列表 */
    getWriterUserList() {
       var _this = this;
      this.$axios.get(this.writerUserUrl, {
        params: this.writerParams
      }).then(function(res) {
        if(res.data.code==1){
          _this.writerTableData=res.data.data.rows;
          _this.writerPageTotal= res.data.data.total;
        }
      })
    },
    /* 获取本套教材成员 */
    getTextBookUserList() {
      var _this = this;
      this.$axios.get(this.textbookMemberUrl , {
        params: this.textBookParams
      }).then(function(res) {
        if(res.data.code==1){
          _this.textBookTableData=res.data.data.memberlist;
          _this.textBookPageTotal= res.data.data.total;
        }
      })
    },

    /* 切换作家用户选中状态时 */
    writerCheckChange(arr){
      var _this=this;
      this.addWriterData=[];
       arr.forEach(function(item){
         item.isWriter=true;
         _this.addWriterData.push(item);
       })
    },
    /* 切换社内用户选中状态 */
    clubUserSelectChange(arr){
      var _this=this;
      this.addClubData=[];
      arr.forEach(function(item){
         _this.addClubData.push(item);
       })
    },
    showAddDialog(){
     this.addTableData=this.addWriterData.concat(this.addClubData);
     this.againDialogVisible=true;
    },
    /* 添加小组成员 */
    addNewSubmit(){
     this.isLoadingUp=true;
     var subArr=[];
     let _this = this;
     console.log(this.addTableData);
      this.addTableData.forEach(function(item){
        var obj=new Object();
           obj.userId=item.id;
           obj.isWriter=item.isWriter?item.isWriter:false;
           subArr.push(obj);
     })
      console.log(subArr);
     this.$axios({
       method:'POST',
       url:this.addMemberUrl,
       data:this.$initPostData({
       groupId:this.groupId,
       pmphGroupMembers:JSON.stringify(subArr),
       sessionId:this.$getUserData().sessionId,
     })
     }
       ).then((res)=>{
          if(res.data.code==1){
               this.getGroupMember(this.groupId);
               this.againDialogVisible=false;
               this.dialogVisible=false;
               this.$emit('refreshMange');
               this.$message.success('添加成功');
          }else{
            this.$confirm(res.data.msg.msgTrim(), "提示",{
            	confirmButtonText: "确定",
            	cancelButtonText: "取消",
            	showCancelButton: false,
            	type: "error"
            });
          }
             this.isLoadingUp=false;
     })

    },

    /* 作家用户切换分页条数 */
    writerSizeChange(val){

      this.writerParams.pageSize=val;
      this.writerParams.pageNumber=1;
      this.getWriterUserList();
    },
    /* 作家用户切换当前页数 */
    writerCurrentChange(val){
      this.writerParams.pageNumber=val;
      this.getWriterUserList();
    },
    /* 教材所属用户切换分页条数 */
    textBookSizeChange(val){

      this.textBookParams.pageSize=val;
      this.textBookParams.pageNumber=1;
      this.getTextBookUserList();
    },
    /* 教材所属用户切换当前页数 */
    textBookCurrentChange(val){
      this.textBookParams.pageNumber=val;
      this.getTextBookUserList();
    },
    /* 点击新增成员按钮 */
    addNewMember(){
     this.dialogVisible=true;
     this.getWriterUserList();this.getTextBookUserList();
    },
    /**
     *  当页面左侧导航区域展开和收起时执行此方法
     */
    handleSideBarFlod(){
      this.$refs.beautyScroll.refresh(280);
    }
  },
  components: {
    beautyScroll,
    userPmph
  },
  watch: {

    /* 监测小组id的变化 */
    groupId(newVal, old) {
      //this.groupId = newVal;
      console.log(" 监测小组id的变化"+this.groupId);
      this.writerParams.groupId = newVal;
      this.textBookParams.groupId = newVal;
      this.getGroupMember(newVal);
    },
    refreshMember(){
      console.log("refreshMember"+this.groupId);
      this.getGroupMember(this.groupId);
    },
    bookId(newVal, old){
     this.activeName=this.bookId>0?'first':'second';
      console.log("newVal: "+this.bookId);
    }
  },
  created(){
    console.log("created"+this.groupId);
    console.log("currentGroupInfo: "+this.bookId);
    if(this.groupId){
      this.getGroupMember(this.groupId);
    }

  },
  mounted(){
    /**
     * 当左侧导航栏收起或展开式要重新刷新beautyScroll
     */
    bus.$on('side-bar:flod_unflod',this.handleSideBarFlod);
  },
}
</script>

<style scoped>
.memberlist-wrpper {
  height: 100%;
  padding-top: 71px;
  overflow: hidden;
  box-sizing: border-box;
}

.meberlist-inner {
  box-sizing: border-box;
  position: relative;
  height: 100%;
  padding: 42px 0;
  border-top: 1px solid #e6e7e8;
  border-left: 1px solid #e6e7e8;
}

.head-title {
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 10px 10px 10px;
}

.head-title i {
  cursor: pointer;
}

.addMemberWrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 40px;
  width: 100%;
  color: #fff;
  border-top: 1px solid #c8c8c8;
  background-color: #e9e9e9;
  z-index: 10;
}

.meberlist {
  height: 100%;
}

.meberlist>div {
  box-sizing: border-box;
  position: relative;
  padding-left: 0;
}

.memberSetting>div {
  padding-left: 30px;
}

.meberlist-checkBox {
  position: absolute;
  top: 50%;
  left: 10px;
  margin-top: -12px;
}


/*成员*/

.MemberHead {
  height: 48px;
  cursor: pointer;
}

.MemberHead:hover {
  /*background: #DDDDDE;*/
}

.MemberHead.active {
  background: #C8C6C6;
}

.MemberHead.firstIterm {
  background: rgb(219, 217, 216);
}

.MemberHead-inner {
  position: relative;
  padding: 5px 42px 5px 46px
}

.MemberHeadImg {
  position: absolute;
  left: 10px;
  top: 10px;
  width: 30px;
  height: 30px;
  overflow: hidden;
  border-radius: 50%;
}

.MemberHeadImg>img {
  display: block;
  width: 100%;
  height: 100%;
}

.MemberHeadName {
  font-size: 14px;
  line-height: 38px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.memberPermission {
  position: absolute;
  right: 14px;
  top: 16px;
}


/*新增成员弹窗样式*/

.btn-wrapper {
  margin-top: 20px;
}

.tabsContainer el-input {
  display: inline-block;
}

.searchBox-wrapper {
  box-sizing: border-box;
  display: inline-block;
  max-width: 320px;
  padding: 0 10px;
  margin-bottom: 6px;
}

.searchBox-wrapper>span {
  float: left;
  line-height: 36px;
  width: 90px;
  vertical-align: middle;
}

.searchBox-wrapper>div {
  margin-left: 90px;
  box-sizing: border-box;
}

.searchBtn-wrapper {
  margin-bottom: 16px;
}

.s-title {
  line-height: 36px;
  margin-right: 10px;
}
  .copy-btn{
    font-size: inherit;
    height: 1.2em;
    line-height: 0.2em;
    float: right;
    margin-left: 1em;
  }
</style>
