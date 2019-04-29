<template>
  <div class="check" style="height:100%;">
		<div class="top-nav">
			<div class="header_title_tips">
        <p >{{ruleForm.bookname}}</p>
        <div class="tips_icon"></div>
      </div>
		</div>
		<div class="bottom-content">
			<el-row>
				<el-col :span="12">
					<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
						<el-form-item label="书名:">
							<p>{{ruleForm.bookname}}</p>
						</el-form-item>
            <el-form-item label="页码行数:">
              <p>页码：{{ruleForm.page}} 行数：{{ruleForm.line}}</p>
            </el-form-item>
						<el-form-item label="纠错内容:">
							<div class="messageBox">
								<p>{{ruleForm.content}}</p>
							</div>
						</el-form-item>
            <el-form-item label="附件:">
              <a type="text" :href="'/pmpheep/file/download/'+ruleForm.attachment" style="color:#337ab7">{{ruleForm.attachmentName}}</a>
            </el-form-item>
						<el-form-item label="纠错人:">
							<p>{{ruleForm.username}}</p>
						</el-form-item>
						<el-form-item label="提交时间:">
							<p>{{ruleForm.gmtCreate}}</p>
						</el-form-item>
						<el-form-item label="主编回复:">
							<!--<div class="messageBox">-->
								<!--<p>{{ruleForm.authorReply}}</p>-->
							<!--</div>-->
              <el-input
                type="textarea"
                :disabled="type=='detail'"
                :autosize="{ minRows: 4, maxRows: 8}"
                placeholder="请输入内容"
                v-model="ruleForm.authorReply">
              </el-input>
						</el-form-item>
						<el-form-item label="检查结果:" prop="result">
							<el-radio-group v-model="ruleForm.result" class="radio-group" :disabled="type=='detail'">
									<el-radio :label="true">图书勘误</el-radio>
									<el-radio :label="false">内容无误</el-radio>
								</el-radio-group>
						</el-form-item>
						<el-form-item label="回复用户:" prop="editorReply">
							<el-input
								type="textarea"
                :disabled="type=='detail'"
								:autosize="{ minRows: 4, maxRows: 8}"
								placeholder="请输入内容"
								v-model="ruleForm.editorReply">
							</el-input>
						</el-form-item>
						<el-form-item>
							<el-button icon="arrow-left" @click="back">返回</el-button>
							<el-button type="primary" :disabled="type=='detail'"  @click="submit('ruleForm')">提交</el-button>
						</el-form-item>
					</el-form>
				</el-col>
			</el-row>
		</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      id: "", // 主键id
      ruleForm: {
        bookname: "", // 书名
        page: "",
        line: "",
        realname: "", // 纠错人
        username:"",
        gmtCreate: "", // 提交时间
        result: "",
        authorReply:"",
        editorReply: ""
      },
      type:'',
      rules: {
        authorReply: [
          {
            type: "string",
            required: true,
            message: "请输入回复内容",
            trigger: "blur"
          },
          { min: 1, max: 1000, message: "不能超过1000个字符", trigger: "change,blur" }
        ],
        editorReply: [
          {
            type: "string",
            required: true,
            message: "请输入回复内容",
            trigger: "blur"
          },
          { min: 1, max: 1000, message: "不能超过1000个字符", trigger: "change,blur" }
        ],
        result: [
          { type: "boolean", required: true, message: "检查结果", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.type = this.$route.query.type;
    // alert(this.$route.query);
    this.getBookError();
  },
  methods: {
    /**请求数据 */
    getBookError() {
      this.$axios
        .get("/pmpheep/bookCorrection/detail?id="+this.id)
        .then(response => {
          console.log(response);
          let res = response.data;
          if (res.code == 1) {
            this.ruleForm = res.data;
//            this.id = this.ruleForm.id;
            this.ruleForm.gmtCreate = this.$commonFun.formatDate(
              this.ruleForm.gmtCreate
            );
            // 如果isEditorHandling 为false  发送该请求
            if (
              !this.ruleForm.isEditorHandling &&
              this.ruleForm.isAuthorReplied
            ) {
              this.updateStatus();
            }
          }
        });
    },
    /**更新状态 */
    updateStatus() {
      this.$axios
        .put(
          "/pmpheep/bookCorrection/updateToAcceptancing",
          this.$initPostData({
            id: this.id
          })
        )
        .then(response => {
          let res = response.data;
        });
    },
    /**提交 */
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
//          if (this.ruleForm.isAuthorReplied) {
            this.$axios
              .put(
                "/pmpheep/bookCorrection/replyWriter",
                this.$initPostData({
                  id: this.id,
                  result: this.ruleForm.result,
                  authorReply: this.ruleForm.authorReply||'',
                  editorReply: this.ruleForm.editorReply||''
                })
              )
              .then(response => {
                let res = response.data;
                if (res.code == 1) {
                  this.$message.success("提交成功！");
                  this.back();
                } else {
                  this.$confirm(res.msg.msgTrim(), "提示",{
                  	confirmButtonText: "确定",
                  	cancelButtonText: "取消",
                  	showCancelButton: false,
                  	type: "error"
                  });
                }
              })
              .catch(err => {
                this.$confirm("提交失败，请稍后再试！", "提示",{
                	confirmButtonText: "确定",
                	cancelButtonText: "取消",
                	showCancelButton: false,
                	type: "error"
                });
              });
//          } else {
//            this.$message.error("主编没有回复，不能提交！");
//          }
        } else {
          console.log("错误提交，请检查输入内容!!");
          return false;
        }
      });
    },
    /** 返回上一步*/
    back() {
      this.$router.go(-1);
    }
  }
};
</script>
<style>
.top-nav {
  /* float: left; */
  width: 100%;
  position: relative;
  height: 43px;
  background-color: rgb(238, 241, 246);
  border: 1px solid rgb(209, 217, 229);
  box-sizing: border-box;
}
.top-nav .header_title_tips {
  margin-bottom: 15px;
  /* float:left; */
  color: #fff;
  position: absolute;
  left: -8px;
  top: 8px;
}
.top-nav .header_title_tips p {
  /* float:left; */
  background-color: #12806b;
  font-size: 16px;
  padding: 2px 20px 2px 15px;
  max-width: 545px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.top-nav .header_title_tips .tips_icon {
  border: 4px solid #475669;
  position: absolute;
  left: 0;
  bottom: -8px;
  border-left-color: #fff;
  border-bottom-color: #fff;
}
.bottom-content {
  border: 1px solid rgb(209, 217, 229);
  box-sizing: border-box;
  border-top: 0;
  padding: 15px 20px;
  float: left;
  width: 100%;
  background-color: #fff;
}
.messageBox {
  min-height: 50px;
  border: 1px solid #e2dddd;
  padding: 0px 15px 20px 15px;
  margin-top: 5px;
  background: #f3f3f3;
}
</style>
