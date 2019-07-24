<template>
	<div class="personalSetting clearfix">
    <div class="personal-info">
      <div>
        <p class="personalSetting-title">个人信息</p>
        <div class="user-image">
          <img :src="userInfo.avatar?userInfo.avatar:'/static/default_image.png'" alt="">
        </div>
        <div class="user-info">
          <p><span>账号：</span><span>{{userInfo.username}}</span></p>
          <p><span>姓名：</span><span>{{userInfo.realname}}</span></p>
          <!-- <p><span>性别：</span><span>{{userInfo.sex?(userInfo.sex==1?'男':'女'):'保密'}}</span></p> -->
          <p><span>手机号：</span><span>{{userInfo.handphone}}</span></p>
          <p><span>邮箱：</span><span>{{userInfo.email}}</span></p>
          <!-- <p><span>地址：</span><span>{{userInfo.address}}</span></p> -->
        </div>
      </div>
    </div>
    <div class="personal-setting">
      <div>
        <p class="personalSetting-title">修改信息</p>
        <div>
          <el-tabs v-model="activeName">
            <el-tab-pane label="修改个人信息" name="setting">
              <div class="setting-iterm">
                <el-form :model="formSetting"  ref="ruleForm" :rules="formRules"  label-width="80px">
                  <el-form-item label="头像:">
                    <div class="headImageWrapper">
                      <el-tooltip class="item" effect="dark" content="点击上传头像" placement="top-start" v-if="!isIe9">
                        <div class="headImageWrapper-bg"><i class="el-icon-plus avatar-uploader-icon"></i></div>
                      </el-tooltip>
                      <!--上传文件按钮-->
                      <my-upload
                        v-if="!isIe9"
                        class="fileInput"
                        ref="upload"
                        name="files"
                        action="/pmpheep/material/upTempFile"
                        :on-success="upLoadFileSuccess"
                        :before-upload="fileBeforeUpload"
                        :show-file-list="false"
                        :auto-upload="true">
                        <el-button class="fileInput">上传</el-button>
                      </my-upload>
                      <div ref="headImageWrapper" v-show="!userHeadImage.fileName">
                        <img :src="userInfo.avatar?userInfo.avatar:'/static/default_image.png'" class="avatar">
                      </div>
                      <div v-show="userHeadImage.fileName">
                        <img :src="userHeadImage.imageUrl?userHeadImage.imageUrl:'/static/default_image.png'" class="avatar">
                      </div>
                    </div>
                  </el-form-item>
                  <el-form-item label="姓名:" prop="realname">
                    <el-input v-model="formSetting.realname"></el-input>
                  </el-form-item>
                  <!-- <el-form-item label="性别:" prop="sex">
                    <el-radio-group v-model="formSetting.sex">
                      <el-radio :label="1">男</el-radio>
                      <el-radio :label="2">女</el-radio>
                      <el-radio :label="0">保密</el-radio>
                    </el-radio-group>
                  </el-form-item> -->
                  <el-form-item label="手机号:" prop="handphone">
                    <el-input v-model="formSetting.handphone"></el-input>
                  </el-form-item>
                  <el-form-item label="邮箱:" prop="email">
                    <el-input v-model="formSetting.email"></el-input>
                  </el-form-item>
                  <!-- <el-form-item label="地址:" prop="address">
                    <el-input v-model="formSetting.address"></el-input>
                  </el-form-item> -->
                </el-form>
                <div class="text-right paddingT30">
                  <el-button type="primary" @click="updateUserInfoBtn">确认修改</el-button>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="password">
              <div class="setting-iterm">
                <el-form :model="formPassword" :rules="rules2" ref="formPassword" label-width="140px">
                  <el-form-item label="旧密码" prop="oldPass">
                    <el-input type="password" v-model="formPassword.oldPass"></el-input>
                  </el-form-item>
                  <el-form-item label="新密码" prop="pass">
                    <el-input type="password" v-model="formPassword.newPass"></el-input>
                  </el-form-item>
                  <el-form-item label="再次输入新密码" prop="checkPass">
                    <el-input type="password" v-model="formPassword.reEnterNewpass"></el-input>
                  </el-form-item>
                </el-form>
                <div class="text-right paddingT30">
                  <el-button type="primary" @click="updatePassword">确认修改</el-button>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
	</div>
</template>

<script>
	export default {
		data() {
      var validateOldPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.formPassword.oldPass !== '') {
            this.$refs.formPassword.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass = (rule, value, callback) => {
        if (this.formPassword.newPass === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.formPassword.newPass !== '') {
            if(!/^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,16}$/.test(this.formPassword.newPass))
            {
              callback(new Error('密码必须由 8-16位大写字母，小写字母，数字，字符至少三种组成'));
            }else{
              this.$refs.formPassword.validateField('checkPass');
            }
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (this.formPassword.reEnterNewpass === '') {
          callback(new Error('请再次输入密码'));
        } else if (this.formPassword.reEnterNewpass !== this.formPassword.newPass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
			return {
			  api_update_userInfo:'/pmpheep/users/pmph/updatePersonalData',
        api_get_userInfo:'/pmpheep/users/pmph/getInfo',
        api_update_password:'/pmpheep/users/pmph/updatePassword',
        activeName:'setting',
        formSetting:{
          id: '',
          username:'',
          realname:'',
          sex:1,
          handphone: '',
          realname:'',
          email:'',
          address:'',
        },
        formPassword:{
          oldPass:'',
          newPass:'',
          reEnterNewpass:''
        },
        userHeadImage:{
          fileName:'',
          imageUrl:'',
          currentFile:'',
          currentId:''
        },
        userInfo:{
          id: '',
          username: "",
          password: null,
          isDisabled: false,
          realname: "",
          departmentId: 0,
          handphone: null,
          email: null,
          avatar: "/static/default_image.png",
          note: "",
          sort: null,
          isDeleted: false,
          gmtCreate: null,
          gmtUpdate: null,
          loginType: 1,
          isAdmin: true,
          sex:0,
          address:'',
        },
        postData:{
          id:'',
          realname:'',
          avatar:'',
          handphone: '',
          email:'',
        },
        formRules: {
          realname:[
            { required: true, message: "用户名称不能为空", trigger: "change,blur" },
            { max: 20, message: "名称长度过长", trigger: "change,blur" }
          ],
          handphone:[
            {validator:this.$formCheckedRules.phoneNumberChecked,trigger: "change,blur"}
          ],
          email: [
           {type: 'email', message: '请输入正确的邮箱地址', trigger: 'change,blur' }
          ]
//          address: [
//            { max: 250, message: "名称长度过长", trigger: "change,blur" }
//          ],
        },
        rules2: {
          oldPass:[
            { validator: validateOldPass, trigger: 'change,blur' }
          ],
          pass: [
            { validator: validatePass, trigger: 'change,blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'change,blur' }
          ]
        }
      }
		},
    computed:{
      isIe9(){
        return this.$commonFun.Browser.ie==9
      }
    },
    methods:{
      /**
       * 上传头像input发生改变时触发
       * @param e input内置事件对象
       */
      /* filechange(file){
        let self=this;
        let prevDiv = this.$refs.headImageWrapper;
        let ext=file.name.substring(file.name.lastIndexOf(".")+1).toLowerCase();
        if(!ext){return;}
        // gif在IE浏览器暂时无法显示
        if(ext!='png'&&ext!='jpg'&&ext!='jpeg'&&ext!='gif'){
          this.$confirm("图片的格式必须为png或者jpg或者jpeg或者gif格式！", "提示",{
          	confirmButtonText: "确定",
          	cancelButtonText: "取消",
          	showCancelButton: false,
          	type: "error"
          });
          self.userHeadImage.filename=undefined;
          return;
        }
        //文件名不超过40个字符
        if(file.name.length>50){
          this.$confirm("文件名不能超过50个字符", "提示",{
          	confirmButtonText: "确定",
          	cancelButtonText: "取消",
          	showCancelButton: false,
          	type: "error"
          });
          return;
        }
        // 判断文件大小是否符合 文件不为0
        if(file.size==0){
          this.$confirm("图片大小不能为0kb", "提示",{
          	confirmButtonText: "确定",
          	cancelButtonText: "取消",
          	showCancelButton: false,
          	type: "error"
          });
          self.userHeadImage.filename=undefined;
          return;
        }
        // 判断文件大小是否符合 文件不大于10M
        if(file.size/1024/1024 > 10){
          this.$confirm("图片大小不能大于10M", "提示",{
          	confirmButtonText: "确定",
          	cancelButtonText: "取消",
          	showCancelButton: false,
          	type: "error"
          });
          self.userHeadImage.filename=undefined;
          return;
        }
        self.userHeadImage.currentFile = file;
        if(window.FileReader){
          let reader = new FileReader();
          reader.onload = function(evt) {
            self.userHeadImage.filename=file.name;
            prevDiv.innerHTML = '<img src="' + evt.target.result + '" class="avatar" style="display:block;width: 100%;height: 100%;" />';
          }
          reader.readAsDataURL(file.raw);
        }else{
          self.userHeadImage.filename=file.name;
          prevDiv.innerHTML='<div class="avatar" style="display:block;width: 100%;height: 100%;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src=\'' + file.raw.value + '\'"></div>';
          prevDiv.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
          prevDiv.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = file.raw.value;
        }

      }, */
      fileBeforeUpload(file){
        var exStr=file.name.split('.').pop().toLowerCase();
        var exSize=file.size?file.size:1;
        if(exSize/ 1024 / 1024 > 20){
          this.$confirm('图片的大小不能超过20MB！', "提示",{
          	confirmButtonText: "确定",
          	cancelButtonText: "取消",
          	showCancelButton: false,
          	type: "error"
          });
        // this.material.noticeFiles.pop();
          return false;
        }
        if(exSize==0){
          this.$confirm('请勿上传空文件！', "提示",{
          	confirmButtonText: "确定",
          	cancelButtonText: "取消",
          	showCancelButton: false,
          	type: "error"
          });
        // this.material.noticeFiles.pop();
          return false;
        }
        if(exStr!='png'&&exStr!='jpg'&&exStr!='jpeg'){
          this.$confirm('图片的格式必须为png或者jpg或者jpeg格式！', "提示",{
          	confirmButtonText: "确定",
          	cancelButtonText: "取消",
          	showCancelButton: false,
          	type: "error"
          });
        // this.material.noticeFiles.pop();
          return false;
        }
        if(file.name.length>80){
          this.$confirm('图片名称不能超过80个字符！', "提示",{
          	confirmButtonText: "确定",
          	cancelButtonText: "取消",
          	showCancelButton: false,
          	type: "error"
          });
          //this.material.noticeFiles.pop();
          return false;
        }
      },
      /**
       * 创建小组请求成功的回调
       */
      upLoadFileSuccess(response, file, fileList){
          console.log(response, file, fileList);
         this.userHeadImage.fileName=file.name;
         this.userHeadImage.currentId=response.data[0];
         this.userHeadImage.imageUrl='/pmpheep/material/getTempFile?tempFileId='+response.data[0];
         console.log(this.userHeadImage);
         this.$message.success('上传成功');

      },
      /**
       * 创建小组请求失败的回调
       */
      /* uploadError(err, file, fileList){
        this.$confirm('创建小组失败', "提示",{
        	confirmButtonText: "确定",
        	cancelButtonText: "取消",
        	showCancelButton: false,
        	type: "error"
        });
      }, */
      /**
       * 点击修改按钮
       */
      updateUserInfoBtn(){
        //将post参数赋值给this.postData
        /* for(let key in this.postData){
          this.postData[key] = this.formSetting[key];
        } */

        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.updateUserInfo();
          } else {
            this.$confirm('请完善表单！', "提示",{
            	confirmButtonText: "确定",
            	cancelButtonText: "取消",
            	showCancelButton: false,
            	type: "error"
            });
            return false;
          }
        });

      },
      /**
       * 修改个人信息
       */
      updateUserInfo() {
        /* if (this.userHeadImage.filename) {
          this.userHeadImage.currentFile.upload();
          return;
        } */
        this.$axios.put(this.api_update_userInfo, this.$commonFun.initPostData({
          id: this.formSetting.id,
          realname: this.formSetting.realname,
          avatar: this.userInfo.avatar,
          handphone: this.formSetting.handphone || '',
          email: this.formSetting.email || '',
          file: this.userHeadImage.currentId
        }))
          .then((response)=> {
            let res = response.data;
            //修改成功
            if (res.code === 1) {
              this.$message.success('修改成功!');
              this.getUserInfo();
            } else {
              self.$confirm(res.msg.msgTrim(), "提示",{
              	confirmButtonText: "确定",
              	cancelButtonText: "取消",
              	showCancelButton: false,
              	type: "error"
              });
            }
          })
          .catch( (error)=> {
            console.log(error);
            this.$confirm('请求失败，请重试!', "提示",{
            	confirmButtonText: "确定",
            	cancelButtonText: "取消",
            	showCancelButton: false,
            	type: "error"
            });
          });
      },
      /**
       * 获取当前用户信息
       */
      getUserInfo(){
        this.$axios.get(this.api_get_userInfo,{params:{
          id:this.userInfo.id
        }})
          .then(response=>{
            let res = response.data;
            if (res.code === 1) {
              this.userInfo = res.data;
                for(let key in this.formSetting){
                      console.log(key,this.userInfo[key]);
                      this.formSetting[key] = this.userInfo[key];
                            }
                       }
          })
          .catch(function (error) {});
      },
      /**
       * 修改密码
       */
      updatePassword(){
        var self= this;
        this.$refs['formPassword'].validate((valid) => {
          if (valid) {
            this.$axios.put(this.api_update_password, this.$commonFun.initPostData({
              id: this.formSetting.id,
              oldPassword:this.formPassword.oldPass,
              newPassword:this.formPassword.reEnterNewpass
            }))
              .then(function (response) {
                let res = response.data;
                //修改成功
                if (res.code === 1) {
                  self.$message.success('修改成功!');
                } else {
                  self.$confirm(res.msg.msgTrim(), "提示",{
                  	confirmButtonText: "确定",
                  	cancelButtonText: "取消",
                  	showCancelButton: false,
                  	type: "error"
                  });
                }
              })
              .catch(function (error) {
                console.log(error);
                self.$confirm('请求失败，请重试!', "提示",{
                	confirmButtonText: "确定",
                	cancelButtonText: "取消",
                	showCancelButton: false,
                	type: "error"
                });
              });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
    },
    created(){
      this.activeName=this.$route.query.type||'setting';
      this.userInfo = this.$getUserData().userInfo;
      //this.userInfo.sex = this.userInfo.sex===undefined?1:this.userInfo.sex;
      this.getUserInfo();
    },
	}
</script>

<style scoped>
.personalSetting{
}
.personal-info{
  width: 400px;
  float: left;
}
.personal-info>div{
  width: 360px;
  padding: 10px 20px 30px;
  border-top: 4px solid #e7eaec;
  margin: 0 auto;
}
.personal-setting{
  margin-left: 460px;
}
.personal-setting>div{
  padding-top: 10px;
  border-top: 4px solid #e7eaec;
}
.personalSetting .user-image{
  width: 80px;
  height: 80px;
  margin-left: 6px;
  border-radius: 50%;
  overflow: hidden;
}
.personalSetting .user-image>img{
  display:block;
  width: 100%;
  height:100%;
}
  .user-info>p{
    padding: 10px;
  }
.user-info>p>span:first-child{
  display: inline-block;
  width: 60px;
}
  .personalSetting-title{
    font-size: 16px;
    font-weight: bold;
    padding-bottom: 30px;
  }
  .setting-iterm{
    max-width: 500px;
    padding-top: 30px;
  }

  /*设置中用户头像区域*/
.headImageWrapper{
  width: 100px;
  height: 100px;
  position: relative;
}
.headImageWrapper-bg{
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  right: 0;
  background: rgba(0,0,0,.7);
  opacity: 0;
}
.headImageWrapper-bg>i{opacity: 1;}
.headImageWrapper:hover .headImageWrapper-bg{
  opacity: 0.75;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
.fileInput{
  display: block;
  opacity: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  z-index:10;
}
.headImageWrapper>div>img{
  display: block;
  width: 100%;
  height: 100%;
}
.headImageWrapper>div{
  width: 100%;
  height:100%;
}
</style>
