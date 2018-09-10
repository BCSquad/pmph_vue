<template>
  <div class="messagestate">
    <el-row>




      <el-col :span="24">
        <el-col :span="3">
          <el-col :span="23" class="search-10">
            <el-select v-model="personalOrOrg" placeholder="请选择" @change="search">
              <el-option v-for="item in state" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-col>
        <el-col :span="8">
          <el-col :span="14" class="search-10">
            <el-input v-model.trim="name" placeholder="请输入姓名/机构名称" @keyup.enter.native="search"></el-input>
          </el-col>
          <el-button class="btn" type="primary"  icon="search" @click="search">搜索</el-button>
        </el-col>
        <el-col :span="5" class="msgradio">
          <el-radio-group v-model="isRead" @change="change">
            <el-radio :label="0">全部</el-radio>
            <el-radio :label="1">已读</el-radio>
            <el-radio :label="2">未读</el-radio>
          </el-radio-group>
        </el-col>
        <el-button class="btn pull-right" type="primary" icon="arrow-left" @click="back">返回</el-button>
      </el-col>
    </el-row>
    <div class="cutLine-dashed"></div>
    <el-row>
      <el-col :span="24">
        <el-table
          ref="multipleTable"
          :data="tableData"
          border
          stripe
          empty-text="暂无数据"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <!--<el-table-column
            label="用户名"
            align="center"
            width="120"
            prop="username"
            show-overflow-tooltip>
          </el-table-column>-->
          <el-table-column
            label="姓名"
            align="center"
            width="120"
            prop="name"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            label="工作单位"
            align="center"
            width="120"
            prop="workplace"
            show-overflow-tooltip>
          </el-table-column>
          <!--<el-table-column
            prop="orgusername"
            label="机构账号"
            align="center"
            width="200">
          </el-table-column>-->
          <el-table-column
            prop="dptname"
            label="机构名称"
            align="center"
            width="200">
          </el-table-column>
          <el-table-column
            prop="orgusername"
            label="管理员姓名"
            align="center"
            width="200">
          </el-table-column>
          <el-table-column
            prop="handphone"
            align="center"
            label="联系方式"
          >
          </el-table-column>
          <el-table-column
            prop="sendTime"
            align="center"
            label="发送时间"
          >
          </el-table-column>
          <el-table-column
            prop="reciveTime"
            align="center"
            label="接收时间"
          >
          </el-table-column>

          <el-table-column
            label="状态"
            width="80"
            align="center"
          >
            <template scope="scope">
              <el-tag :type="scope.row.isRead?'success':'danger'">{{ scope.row.isRead?'已读':'未读' }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-pagination class="pull-right" v-show="dataTotal > 20"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="dataTotal">
    </el-pagination>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        input: '',
        isRead: 0,
        currentPage: 1, // 分页当前页
        tableData: [],
        materialId: '',
        isProduct: false,
        msgId:'',
        pageNumber: 1,
        pageSize: 20,
        name: '',
        dataTotal: 0,
        senderId:0,
        personalOrOrg:'0',
        state: [
          {
            value: '0',
            label: '全部'
          },
          {
            value: '1',
            label: '社内用户'
          },
          {
            value: '2',
            label: '作家用户'
          },
          {
            value: '3',
            label: '机构管理员'
          }
        ],
      }
    },
    mounted() {
      //console.log(this.$route.query.id)
      // 获取当前消息id
      this.materialId = this.$route.query.materialId
      this.msgId = this.$route.query.msgId
      this.senderId = this.$route.query.senderId;
      this.isProduct = (this.$commonFun.Empty(this.$route.query.isProduct)||!this.$route.query.isProduct)?false:true;
      console.log(this.$route,this.msgId)
      this.getMessageState()
    },
    methods:{
      /**
       * 初始化数据
       */
      getMessageState() {
        this.$axios.get("/pmpheep/messages/message/state", {
          params: {
            name: this.name,
            sessionId: this.$getUserData().sessionId,
            msgId: this.msgId,
            materialId: this.materialId,
            senderId:this.senderId,
            pageNumber: this.pageNumber,
            pageSize: this.pageSize,
            receiverType:this.personalOrOrg,
            isRead: this.isRead==0?'':this.isRead==1?true:false,
            isProduct:this.isProduct
          }
        }).then((response) => {
          let res = response.data
          this.dataTotal = res.data.total
          // console.log(res)
          if (res.code == '1') {
            this.tableData=res.data.rows
            // 将时间戳转为标准格式
            for (let i=0; i< this.tableData.length; i++) {
              this.tableData[i].sendTime = this.$commonFun.formatDate(this.tableData[i].sendTime)
              this.tableData[i].reciveTime = this.$commonFun.formatDate(this.tableData[i].reciveTime)
            }
          }
        }).catch((error) => {
          console.log(error.msg)
        })
      },
      /**
       * 返回上一级
       */
      back() {
        // this.$router.push(this.backRouter)
        this.$router.go(-1)
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      /**
      * 搜索
      */
      search() {
        this.getMessageState()
      },
      /**
       * 选择每页有多少条数据
       */
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.pageSize = val
        this.pageNumber=1
        this.getMessageState()
      },
      /**
       * 选择当前第几页
       */
      handleCurrentChange(val) {
        // console.log(`当前页: ${val}`);
        this.pageNumber = val
        this.getMessageState()
      },
      /**
       * 选择全部，已读，未读
       * @param val
       */
      change(val) {
        // console.log(val)
        this.isRead = val
        this.getMessageState()
      }
    },
    components: {
    }
  }
</script>

<style scoped="scoped">
.msgradio{
  height:36px;
  line-height:36px;
  margin:10px 0 0 10px;
}
.el-select{
  width: 100%;
}
</style>
