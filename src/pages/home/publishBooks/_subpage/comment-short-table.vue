<template>
  <div>
    <slot name="searchBox"></slot>
    <!--表格-->
    <div class="table-wrapper">
      <el-table
        :data="data"
        border
        stripe
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="content"
          label="评论">
          <template scope="scope">
            <div class="ellipsis cursor-pointer blue" @click="showCommentDetail(scope.row)">
              {{scope.row.writerName}}在《{{scope.row.bookname}}》中评论：{{scope.row.content}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="isbn"
          label="ISBN"
          width="145">
        </el-table-column>
        <el-table-column
          prop="gmtCreate"
          label="评论时间"
          width="168">
        </el-table-column>
        <el-table-column
          prop="score"
          label="评分"
          width="70">
        </el-table-column>
        <el-table-column
          prop="isStick"
          label="是否置顶"
          width="100">
          <template scope="scope">
            {{scope.row.isStick?'是':'否'}}
          </template>
        </el-table-column>
        <!--<el-table-column-->
        <!--prop="isPromote"-->
        <!--label="是否精选"-->
        <!--width="95">-->
        <!--<template scope="scope">-->
        <!--{{scope.row.isPromote?'是':'否'}}-->
        <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column
          prop="state"
          label="审核状态"
          width="120">
        </el-table-column>
        <el-table-column
          label="操作"
          width="200"
        >
          <template scope="scope">
            <el-button type="text" v-if="!scope.row.isStick" @click="setState(scope.row.id,'isStick')">置顶</el-button>
            <el-button type="text" v-else @click="setState(scope.row.id,'cancel')">取消置顶</el-button>
            <el-button type="text" :disabled="scope.row.isAuth!=0" @click="audit(scope.row.id,1)">通过</el-button>
            <el-button type="text" :disabled="scope.row.isAuth!=0" @click="auditReason(scope.row.id,2,scope.row.writerId,scope.row.bookname,scope.row.content)">不通过</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <slot name="pagination"></slot>

    <el-dialog
      title="审核"
      :visible.sync="authDialogVisible"
      size="tiny"
      width="150px">
      <el-form>

        <el-form-item label=" 不退回理由：">
          <el-input v-model.trim="reason.id" style="display: none"></el-input>
          <el-input  type="textarea"  :rows="2"
                     placeholder="请输入退回理由" v-model.trim="reason.reason"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="audit2">保 存</el-button>
                <el-button @click="authDialogVisible = false">关闭</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    props: ['data'],
    data() {
      return {
        authDialogVisible:false,
        reason:{
          reason:'',
          id:'',
          num:'',
          writerId:'',
        }
      }
    },
    methods: {
      showCommentDetail(row) {
        this.$emit('show-comment-detail', row)
      },
      handleSelectionChange(list) {
        this.$emit('selection-change', list)
      },
      /**
       * 设置评论状态，是否置顶，是否精选
       * @param typeText isStick-置顶 isHot-热门 isPromote-精选
       */
      setState(id, typeText) {
        let url = '/pmpheep/bookusercomment/comment';
        this.$axios.put(url, this.$commonFun.initPostData({
          ids: id,
          isStick: typeText === 'isStick' ? true : (typeText === 'cancel' ? false : ''),
          sort: '',
          isPromote: typeText === 'isPromote' ? true : '',
          isHot: typeText === 'isHot' ? true : '',
          SortHot: '',
        }))
          .then(response => {
            var res = response.data;
            if (res.code == 1) {
              this.$message.success('提交成功');
//              this.getTableData();
              this.$emit('stateChange');
            } else {
              this.$confirm('操作失败请重试！', "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                showCancelButton: false,
                type: "error"
              });
            }
          })
          .catch(e => {
            console.log(e);
            this.$confirm('操作失败请重试！', "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              showCancelButton: false,
              type: "error"
            });
          })
      },
      /**
       * 点击审核通过或不通过按钮
       * @param num 1为审核通过， 0为审核不通过
       */
      auditReason(id, num,writerId,bookname,content){
        this.authDialogVisible = true;
        this.reason.id=id;
        this.reason.num=num;
        this.reason.writerId=writerId;
        this.reason.bookname=bookname;
        this.reason.content=content;
      },
      audit2() {
        this.$confirm("确定审核" + "不通过" + "所选评论？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let url = '/pmpheep/bookusercomment/update';
            this.$axios.put(url, this.$commonFun.initPostData({
              ids: this.reason.id,
              sessionId: this.$getUserData().sessionId,
              isAuth: this.reason.num,
              reason:this.reason.reason,
              writerId:this.reason.writerId,
              bookname:this.reason.bookname,
              content:this.reason.content
            }))
              .then(response => {
                var res = response.data;
                if (res.code == 1) {
                  this.$message.success('提交成功');
                  this.$emit('audit');
                  this.authDialogVisible=false
                } else {
                  this.$confirm(res.msg.msgTrim(), "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    showCancelButton: false,
                    type: "error"
                  });
                }
              })
              .catch(e => {
                console.log(e);
                this.$confirm('操作失败请重试！', "提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  showCancelButton: false,
                  type: "error"
                });
              })
          })
          .catch(e => {
          })
      }
      ,
      audit(id, num) {
        var str = '';
        if (num == 1) {
          str = '通过';
        } else if (num = 2) {
          str = '不通过';
        }
        this.$confirm("确定审核"+str+"所选评论？", "提示",{
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(()=>{
            let url = '/pmpheep/bookusercomment/update';
            this.$axios.put(url,this.$commonFun.initPostData({
              ids:id,
              sessionId:this.$getUserData().sessionId,
              isAuth:num
            }))
              .then(response=>{
                var res = response.data;
                if(res.code==1){
                  this.$message.success('提交成功');
                  this.$emit('audit');
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
                console.log(e);
                this.$confirm('操作失败请重试！', "提示",{
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  showCancelButton: false,
                  type: "error"
                });
              })
          })
          .catch(e=>{})
      }
    }
  }
</script>

<style scoped>

</style>
