<template>
  <div class="activity_manage" style="margin-top: 20px">
    <p class="header_p">
      <span>活动名称：</span>
      <el-input class="input" style="width:300px;margin-right:10px;" v-model="searchParams.activityName"
                @keyup.enter.native="search"
                placeholder="请输入活动名称"></el-input>
      <span>状态：</span>
      <el-select v-model="searchParams.status" clearable style="width:150px;margin-right:10px;" placeholder="请选择">
        <el-option label="全部" value=""></el-option>
        <el-option label="已暂存" value="0"></el-option>
        <el-option label="已发布" value="1"></el-option>
        <el-option label="已撤回" value="2"></el-option>
      </el-select>
      <el-button icon="search" type="primary" style="margin-bottom:10px;" @click="search">搜索</el-button>


      <el-checkbox style="margin-left: 40px" true-label="1" false-label="" v-model="searchParams.isSetTop" checked="true" @change="search" >
        <span>是否置顶</span></el-checkbox>
      <el-button type="primary" style="float:right;margin-right: 50px"
                 @click="$router.push({name:'活动详情',query:{columnId:1,type:'newActivity',isShowCover:true}})">新建活动
      </el-button>
    </p>
    <el-table :data="tableData" border style="width:98%;">
      <el-table-column label="序号" prop="index" width="65" align="center">
        <template scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>

      <el-table-column label="活动名称"  prop="activityName" header-align="center" align="left">
        <template scope="scope">
          <p class="link" @click="openPreventDialog(scope.row)">{{scope.row.activityName}}</p>
        </template>
      </el-table-column>
      <el-table-column label="活动日期" prop="activityDate"   width="120"  format="yyyy-MM-dd" align="center">
        <template scope="scope">
          {{$commonFun.formatDate(scope.row.activityDate,"yyyy-MM-dd")}}
        </template>
      </el-table-column>
      <el-table-column label="是否置顶"  width="120"   prop="isSetTop" align="center">
        <template scope="scope">
          {{scope.row.isSetTop==0?'否':'是'}}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status"  width="100"  align="center">
        <template scope="scope">
          {{scope.row.status==0?'已暂存':(scope.row.status==1?'已发布':'已撤回')}}
        </template>
      </el-table-column>
      <el-table-column label="创建人"  width="120"  prop="realname" align="center">
      </el-table-column>
      <el-table-column label="创建时间"  width="110" prop="gmtCreate"  align="center">
        <template scope="scope">
          {{$commonFun.formatDate(scope.row.gmtCreate,"yyyy-MM-dd")}}
        </template>
      </el-table-column>
      <el-table-column label="操作"  width="180" header-align="center" align="center">
        <template scope="scope">
          <el-button type="text" style="color:#337ab7;" @click="editActivity(scope.row)">修改</el-button>
          <a  style="color:#337ab7;font-size: 18px" >|</a>

          <el-button type="text" style="color:#337ab7;" @click="setStatus(scope.row,2)" v-if="scope.row.status==1">撤回</el-button>
          <el-button type="text" style="color:#337ab7;" @click="setStatus(scope.row,1)"
                     v-if="scope.row.status!=1">发布</el-button>

          <a  style="color:#337ab7;font-size: 18px" >|</a>
          <el-button type="text" style="color:#337ab7;" @click="setTop(scope.row,'true')"
                     v-if="scope.row.isSetTop==false">置顶
          </el-button>
          <el-button type="text" style="color:#337ab7;" @click="setTop(scope.row,'false')"
                     v-if="scope.row.isSetTop==true">取消置顶
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-wrapper">
      <el-pagination
        v-if="pageTotal>searchParams.pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="searchParams.pageNumber"
        :page-sizes="[10,20,30,50]"
        :page-size="searchParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageTotal">
      </el-pagination>
    </div>
    <!--显示活动详情-->
    <el-dialog
      title=""
      :visible.sync="showPreventDialog"
      size="large" top="5%" >
      <div style="padding:0 05%;">
        <h1 class="previewTitle text-center">{{formData.activityName}}</h1>
        <p class="senderInfo text-center paddingT10">
          <span class="marginR10"></span>
          <span style="color: grey;margin-right: 680px">活动日期:{{this.$commonFun.getnowDate(formData.gmtCreate)}}</span>
        </p>
        <el-form label-width="55">
          <el-form-item label="" label-width="0">
            <div style="margin:0 auto;width:800px;"><p v-html="preventContent" class="p_content"></p></div>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        activityListUrl: '/pmpheep/activity/getActivityList',  //活动列表列表url
        getActivityUrl: '/pmpheep/activity/getActivity/',   //修改活动
        updateActivityUrl: '/pmpheep/activity/updateActivity',   //修改活动
        updateActivityStatusUrl: '/pmpheep/activity/updateActivityStatus', // 修改活动状态
        dialogActivityVideoUrl: '/pmpheep/activityVideo/getActivityVideoList',      //活动视频列表
        addActivitySourceUrl: '/pmpheep/activitySource/getActivitySourceList',   //获取活动资源列表
        setStatusUrl: '/pmpheep/activity/updateActivityStatus',
        setTopUrl: '/pmpheep/activity/updateSetTop',
        transCodingUrl: "/v/query",   //查询视频转码地址
        tableData: [],
        preventContent: '',
        activityDialogVisible: false,
        showPreventDialog: false,
        dialogVisible: false,
        examDialogVisible: false,
        isUploadVideo: false,
        dialogForm: {
          videoName: '',
          videoList: [],
          imgList: [],
          transCoding: []
        },
        formData: {},
        upStatusDate: {
          id: '',
          status: 0,
        },
        setTopDate: {
          id: '',
          isSetTop: true,
        },
        videoSrc: '',
        pageTotal: 100,
        searchParams: {
          status: '',
          activityName: '',
          isSetTop: 1,
          pageSize: 10,
          pageNumber: 1,
        },
      }
    },
    created() {
      this.getList();
    },
    methods: {
      /*修改状态*/
      setStatus(obj, status) {
        this.upStatusDate.id = obj.id;
        this.upStatusDate.status = status;
        this.$axios
          .get(this.setStatusUrl, {
              params: this.upStatusDate
            }
          )
          .then(res => {
            console.log(res);
            this.getList();
          });
      },
      /*置顶*/
      setTop(obj, isSetTop) {
        this.setTopDate.id = obj.id;
        this.setTopDate.isSetTop = isSetTop;
        this.$axios
          .get(this.setTopUrl, {
            params: this.setTopDate
          })
          .then(res => {
            console.log(res);
            this.getList();

          });
      }
      ,
      /* 修改内容 */
      editActivity(obj) {
        this.$axios
          .get(this.getActivityUrl + obj.id + "/search", {})
          .then(res => {
            console.log(res);
            if (res.data.code == 1) {
              this.$router.push({
                name: "活动详情",
                params: res.data.data,
                query: {type: "edit", columnId: 1, isShowCover: true}
              });
            }
          });
      },

      /* 获取视频列表 */
      getList() {
        this.$axios.get(this.activityListUrl, {
          params: this.searchParams
        })
          .then((res) => {
            console.log(res);
            if (res.data.code == 1) {
              this.tableData = res.data.data.rows;
              this.pageTotal = res.data.data.total;
              console.log(tableData.toString());
            }
          })
      },
      /* 搜索按钮 */
      search() {
        this.searchParams.pageNumber = 1;
        this.getList();
      },
      /* 列表分页改变 */
      handleSizeChange(val) {
        this.searchParams.pageSize = val;
        this.searchParams.pageNumber = 1;
        this.getList();
      },
      handleCurrentChange(val) {
        this.searchParams.pageNumber = val;
        this.getList();
      },
      /* 显示活动详情 */
      openPreventDialog(obj) {
        this.$axios
          .get(this.getActivityUrl + obj.id + "/search", {})
          .then(res => {
            console.log(res);
            if (res.data.code == 1) {
              this.formData.gmtCreate = res.data.data.activity.gmtCreate;
              this.formData.activityName = res.data.data.activity.activityName;
              this.preventContent = res.data.data.content.content;
              this.showPreventDialog = true;
            }
          });
      }
    }
  }
</script>

<style>

</style>
