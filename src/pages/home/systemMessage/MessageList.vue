<template>
  <div class="message-list">
    <el-row>
      <el-col :span="15">
        <div class="search-title">标题:</div>
        <el-col :span="7" class="search-10">
          <el-input v-model.trim="title" placeholder="请输入" @keyup.enter.native="search"></el-input>
        </el-col>
        <div class="search-title">发送对象:</div>
        <el-col :span="5" class="search-10">
          <el-select v-model="receiverFilterType" placeholder="请选择发送对象" @change="search">
            <el-option v-for="item in state" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3" class="search-10" style="padding-top:0.5em;">
          <el-checkbox v-model="manualOnly" class="check" @change="search">仅查看人为发送的</el-checkbox>
        </el-col>
        <el-button class="btn" type="primary"  icon="search" @click="search">搜索</el-button>
      </el-col>
     <div class="pull-right">
       <el-button class="btn" type="danger" icon="delete" :disabled="isSelected"  @click="delet">批量删除</el-button>
       <router-link :to="{ name: '编辑消息',query:{type:'add'}}">
       <el-button class="btn" type="primary" icon="edit">
         发送新消息
       </el-button>
       </router-link>
     </div>
    </el-row>
    <div class="cutLine-dashed"></div>
    <div class="table-wrapper">
      <el-table
        ref="multipleTable"
        :data="tableData"
        border
        stripe
        empty-text="暂无数据"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="标题"
          show-overflow-tooltip>
          <template scope="scope">
            <el-button type="text" @click="preview(scope.$index,scope.row)">{{scope.row.title}}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="sendName"
          align="center"
          label="发送者">
        </el-table-column>
        <el-table-column
          prop="receiverFilterType"
          align="center"
          label="发送对象">
          <template scope="scope">
            {{scope.row.receiverFilterType?
            (scope.row.receiverFilterType==1?'学校管理员':(
              scope.row.receiverFilterType==2?'所有人':(
              scope.row.receiverFilterType==3?'特定对象':(
              scope.row.receiverFilterType==4?'教材报名者':'')
            )
            )
            ):'系统生成无需选择'
            }}
          </template>
        </el-table-column>
        <el-table-column
          prop="sendTime"
          align="center"
          label="发送时间"
          width="200"
        >
        </el-table-column>
        <el-table-column
          prop="isWithdraw"
          label="状态"
          width="80"  align="center"
        >
          <template scope="scope">
            {{scope.row.isWithdraw?'已撤回':'已发送'}}
          </template>
        </el-table-column>
        <el-table-column label="操作"
        width="300"  align="center">
          <template scope="scope">
            <el-button
              size="small"
              type="text"
              @click="handleEdit(scope.$index, scope.row)">修改</el-button>
            <el-button
              size="small"
              type="text"
              @click="handleReissue(scope.$index, scope.row)">补发</el-button>
            <el-button
              size="small"
              type="text"
              :disabled="scope.row.isWithdraw"
              @click="handleRecall(scope.$index, scope.row)">撤回</el-button>
            <el-button
              size="small"
              type="text"
              :disabled="scope.row.isWithdraw"
              @click="handleState(scope.row.msgId, scope.row)">消息状态</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-pagination class="pull-right"
                   v-if="dataTotal>pageSize"
     @size-change="handleSizeChange"
     @current-change="handleCurrentChange"
     :current-page="pageNumber"
     :page-sizes="[10, 20, 30, 40]"
     :page-size="pageSize"
     layout="total, sizes, prev, pager, next, jumper"
     :total="dataTotal">
    </el-pagination>

    <el-dialog
      title="请选择发送对象"
      :visible.sync="dialogVisible"
      size="tiny">
      <div>
        <!--输入标题-->
        <el-form :model="reissueForm" ref="messageForm" label-width="110px">
          <el-form-item label="发送对象：">
            <el-radio-group v-model="reissueForm.reissueSendType">
              <el-radio :label="1">学校管理员</el-radio>
              <el-radio :label="2">所有人</el-radio>
              <el-radio :label="3">特定对象</el-radio>
              <el-radio :label="4">教材报名者</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">

        <el-button type="primary" @click="reissue">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        popVisible:false,
        dialogVisible:false,
        reissueForm:{
          title:'',
          reissueMsgId:undefined,
          reissueSendType:1,
          senderId: ''
        },
        visible: false,
        tableData: [],
        multipleSelection: [],
        pageNumber: 1,
        pageSize: 20,
        title: '',
        dataTotal: 0,
        logUserInfo:this.$getUserData().userInfo,
        receiverFilterType:"",
        manualOnly:true,
        state: [
          {
            value: '',
            label: '全部'
          },
          {
            value: '1',
            label: '学校管理员'
          },
          {
            value: '2',
            label: '所有人'
          },
          {
            value: '3',
            label: '特定对象'
          },
          {
            value: '4',
            label: '教材报名者'
          }
        ],
      }
    },
    computed:{
      /**
       * 判断当前是否有选中项来设置删除按钮是否可以点击
       * @returns {boolean}
       */
      isSelected() {
        if (this.multipleSelection.length > 0) {
          return false
        } else {
          return true
        }
      }
    },
    mounted() {
       this.getMessageList()
    },
    methods: {
      /**
       * 加载消息列表
       */
      getMessageList() {
        this.$axios.get("/pmpheep/messages/list/message", {
          params: {
            sessionId: this.$getUserData().sessionId,
            title: this.title,
            pageNumber: this.pageNumber,
            pageSize: this.pageSize,
            receiverFilterType:this.receiverFilterType,
            manualOnly : this.manualOnly
          }
        }).then((response) => {
          let res = response.data
          this.dataTotal = res.data.total
          if (res.code == '1') {
            // 将时间戳转为标准格式
            for (let i=0; i< res.data.rows.length; i++) {
              res.data.rows[i].sendTime = this.$commonFun.formatDate(res.data.rows[i].sendTime)
            }

            this.tableData=res.data.rows;
          }
        }).catch((error) => {
          console.log(error.msg)
        })
      },
      /**
       * 搜索
       */
      search() {
        this.pageNumber = 1;
        this.pageSize = 20;
        this.getMessageList()
      },
      /**
       * 选择每页有多少条数据
       */
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.pageSize = val
        this.pageNumber=1;
        this.getMessageList()
      },
      /**
       * 选择当前第几页
       */
      handleCurrentChange(val) {
        // console.log(`当前页: ${val}`);
        this.pageNumber = val
        this.getMessageList()
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
       /**
        * 点击修改
        */
      handleEdit(index, row) {
        this.$router.push({ name: '编辑消息',query:{type:'edit',messageId:row.msgId,id:row.id}});
      },
      /**
       * 撤回
       */
      handleRecall(index, row) {
        this.$confirm("确定撤回此条消息?", "提示",{
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$axios.put('/pmpheep/messages/withdraw',this.$initPostData({
            msgId:row.msgId
          }))
          .then(response=>{
            let res = response.data;
            if(res.code==1){
                this.$message.success('成功撤销此消息');
                row.isWithdraw=true;
            }else{
                this.$confirm(res.msg.msgTrim(), "提示",{
                	confirmButtonText: "确定",
                	cancelButtonText: "取消",
                	showCancelButton: false,
                	type: "error"
                });
            }
          })
          .catch(e=>{
            this.$confirm('撤销失败，请重试', "提示",{
            	confirmButtonText: "确定",
            	cancelButtonText: "取消",
            	showCancelButton: false,
            	type: "error"
            });
          })
        })
      },
      /**
       * 点击补发
       * 根据消息发送类型跳转到相应的页面
       *  @to-do 这里先假设sendType
       */
      handleReissue(index, row) {
        this.reissueForm.title = row.title;
        this.reissueForm.reissueMsgId = row.msgId;
        this.reissueForm.senderId = row.senderId
        this.dialogVisible=true;
      },
      /**
       * 跳转到补发选择人员页面
       */
      reissue(){
        switch (this.reissueForm.reissueSendType){
          case 1 :
            this.$router.push({name:'选择学校',params:{msgId:this.reissueForm.reissueMsgId,sendType:this.reissueForm.reissueSendType,title:this.reissueForm.title,senderId:this.reissueForm.senderId},query:{type:'reissue'}});
            break;
          case 2:
            this.$router.push({name:'选择学校',params:{msgId:this.reissueForm.reissueMsgId,sendType:this.reissueForm.reissueSendType,title:this.reissueForm.title,senderId:this.reissueForm.senderId},query:{type:'reissue'}});
            break;
          case 3:
            this.$router.push({name:'特定对象',query:{type:'reissue'},params:{msgId:this.reissueForm.reissueMsgId,sendType:this.reissueForm.reissueSendType,title:this.reissueForm.title,senderId:this.reissueForm.senderId}});
            break;
          case 4:
            this.$router.push({name:'教材报名者',query:{type:'reissue'},params:{msgId:this.reissueForm.reissueMsgId,sendType:this.reissueForm.reissueSendType,title:this.reissueForm.title,senderId:this.reissueForm.senderId}});
            break;
            dafault:
              this.$message({
                type: 'error',
                message: '补发出错'
              });
        }
      },
      /**
       * 点击消息状态
       * @param id
       * @param row
       */
      handleState(id, row) {
        this.$router.push({path:'messagestate', query: {msgId: row.msgId,senderId:row.senderId}})  //将你的跳转写在这里。
      },
      /**
       * 点击消息标题进入消息详情页面
       */
      preview(index, row){
        this.$router.push({name:'系统消息详情', query: {msgId:row.id}})
      },
      /**
       * 批量删除
       */
      delet() {
        // console.log(1)
        // console.log(this.multipleSelection)
        this.$confirm('确认删除选中的消息？',"提示",{
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(()=>{
            var len = this.multipleSelection.length
            var arr = []
            for (var i = 0; i< len; i++) {
              arr.push(this.multipleSelection[i].msgId)
            }
            this.$axios.put("/pmpheep/messages/deleteMessage",this.$initPostData({
              msgIds:arr.join(',')
            })).then((response) => {
              let res = response.data
              console.log(res)
              if (res.code == '1') {
                this.getMessageList();
                this.$message({
                  message: '恭喜你，删除成功！',
                  type: 'success'
                });
              }
            }).catch((error) => {
              console.log(error.msg)
            })
          })
          .catch(e=>{})
      }
    }
  }
</script>

<style scoped="scoped">
  .search-title{
    margin: 10px 0 0 10px;
    font-size: 16px;
    float: left;
    height:36px;
    line-height: 36px;
  }
  table a{
    color: #337ab7;
  }
</style>
