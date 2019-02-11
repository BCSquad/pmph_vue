<template>
	<div class="ad-edit-page">
    <div class="page-section paddingB0">
      <!--操作按钮-->
      <div class="operation-wrapper">
        <el-button type="primary" size="large" @click="saveAd">保存</el-button>
      </div>


      <el-form ref="form" :model="formData" class="ad-edit-form" label-width="100px">
        <el-form-item label="广告位置:">
          <el-input v-model="formData.adname" :disabled="true"></el-input>
        </el-form-item>
        <!--<el-form-item  label="应用类型：">
          <el-select v-model="formData.apporpc"  placeholder="请选择">
            <el-option label="全部" value="0"></el-option>
            <el-option label="pc端" value="1"></el-option>
            <el-option label="移动端" value="2"></el-option>

          </el-select>
        </el-form-item>-->
        <el-form-item label="是否启用:">
          <el-radio-group v-model="formData.isDisabled">
            <el-radio :label="false">启用</el-radio>
            <el-radio :label="true">禁用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="备注:">
          <el-input type="textarea" v-model="formData.note" :autosize="{ minRows: 3}"></el-input>
        </el-form-item>
        <el-form-item label="点击跳转链接:" v-if="formData.type===0||formData.type===2">
          <el-input v-model="formData.url" placeholder="输入地址:http://www.xxx.com"></el-input>
        </el-form-item>
      </el-form>
    </div>

    <div class="page-section">
      <div class="section-title">
        当前广告
      </div>
      <!--单选图片-->
      <div class="section-content section-content-arrow" v-if="formData.type===0||formData.type===2">
        <div class="carousel carousel-1" :style="{width:adWHobj.width+'px',height:adWHobj.height}">
          <img :src="currentPlayAd.image" alt="" v-if="imageLibs.length>0&&formData.type===0">
          <img v-for="(iterm,index) in currentPlayAdList" :key="index" :src="iterm.image" alt="" v-if="imageLibs.length>0&&formData.type===2" class="inline-block marginB10 marginR10">
        </div>
      </div>
      <!--多选图片-->
      <div class="section-content section-content-arrow" v-else>
        <div class="carousel carousel-1" :style="{width:adWHobj.width+'px',height:adWHobj.height+'px'}">
          <div class="ad-preview-box">
            <el-carousel
              :height="adWHobj.height+'px'"
              :interval="formData.animationInterval*1000"
              arrow="always"
              indicator-position="none"
              :autoplay="formData.autoPlay"
              ref="carousel"
            >
              <el-carousel-item v-for="(iterm,index) in currentPlayAdList" :key="index">
                点击跳转地址: <el-input style="margin-bottom: 20px;width: 48%" v-model="iterm.imageJumpUrl" placeholder="输入地址:http://www.xxx.com"></el-input>
                <img :src="iterm.image" alt="">
              </el-carousel-item>
            </el-carousel>
          </div>
        </div>
      </div>

    </div>

    <div class="page-section">
      <div class="section-title">
        图片管理
        <span class="inline-block marginL10 orange">(当前广告图片最佳尺寸为{{basetSize}},请上传{{basetSize}}尺寸的图片，或者与最佳尺寸宽高比相同的图片)</span>
        <div class="paddingL20 inline-block">
          <!--<el-button type="primary" size="mini">增加</el-button>-->
        </div>
      </div>
      <div class="section-content section-content-arrow">
        <el-row v-if="formData.type===0">
        <!--单选图片-->
        <el-radio-group v-model="radio2" class="ad-image-manage inline-block" >
          <el-radio v-for="(iterm,index) in imageLibs" :key="index" :label="iterm.id">
            <div  class="imageList-iterm">
              <img :src="iterm.image" alt="" class="vertical-align-middle" />
              <i
                class="cursor-pointer el-icon-close remove-btn"
                @click.prevent="removeImage(iterm.id,iterm.image,index)"
                v-if="!(index==radio2)"
              ></i>
            </div>
          </el-radio>
        </el-radio-group>
        </el-row>
        <!--多选图片-->
        <el-row v-else>
        <el-checkbox-group
          class="ad-image-manage inline-block"
          v-model="checkedImage"
          :min="1"
           >
           <!-- :disabled="(!checkedImage.includes(iterm.id))" -->
          <el-checkbox v-for="(iterm,index) in imageLibs" :label="iterm.id" :key="index" >
            <div class="imageList-iterm">
              <img :src="iterm.image" alt="" class="vertical-align-middle" />
              <i
                class="cursor-pointer el-icon-close remove-btn"
                @click.prevent="removeImage(iterm.id,iterm.image,index)"
                v-if="!(checkedImage.includes(iterm.id))"
              ></i>
            </div>
          </el-checkbox>
        </el-checkbox-group>
        </el-row>
        <my-upload
          class="fileInput"
          ref="upload"
          :action="api_add_iamge"
          :data="uploadImageData"
          :on-success="upLoadFileSuccess"
          :on-error="uploadError"
          :before-upload="beforeUpload"
          :show-file-list="false">
          <div class="inline-block add-img-btn-wrapper">
            <i class="el-icon-plus add-img-btn" v-if="!uploadBtnLoading"></i>
            <i class="el-icon-loading add-img-btn" v-else></i>
          </div>
        </my-upload>

      </div>
    </div>

    <div class="page-section"  v-if="formData.type===1">
      <div class="section-title">
        全局设置
      </div>
      <div class="section-content section-content-arrow">
        <el-checkbox v-model="formData.autoPlay" :true-label="1" :false-label="0" @change="change">自动播放</el-checkbox>
        <div class="inline-block paddingL10">
          动画间隔（秒）
          <el-input-number
            size="small"
            v-model="formData.animationInterval"
            :min="0.1"
            :max="3600"
            :step="0.1"
            @change="animationIntervalChange"
          ></el-input-number>
        </div>
      </div>
    </div>


	</div>
</template>

<script>
  //  广告尺寸写死 对应广告id     当id=1时广告尺寸为adSize[1]
  var adSize = ['',[815,400],[280,80],[400,400],[815,400]];
	export default {
		data() {
			return {
			  api_add_iamge:'/pmpheep/cms/cmsAdvertisement/addimage',
        api_image_delete:'/pmpheep/cms/cmsAdvertisement/delete',
        api_ad_save:'/pmpheep/cms/cmsAdvertisement/update',
        currentAdData:undefined,
        formLabel:{
			    title:'',
          des:'',
        },
        radio2:0,
        checkedImage:[],
        num:3,
        hasTitle:false,
        adId:0,
        formData:{
          advertId:'',
			    id:0,
          adname:'',
          url:'',
          isDisabled:false,
          sort:'999',
          note:'',
          style:'',
          type:0,
          apporpc:"0",
          autoPlay:true,
          navigationColor:'',
          isNavigation:'',
          animationInterval:3,
          animationEffect:'',
          isShowHeading:false,
          image:[],
        },
        uploadBtnLoading:false,
        imageLibs:[],
        timer:null,
        deleteImages:[],
        deleteImagesIds:[],
        isDelete: false
      }
		},
    computed:{
      uploadImageData(){
        let obj = {
          advertId:this.formData.id
        }
        return obj;
      },
      currentPlayAd(){
        let obj = {}
        this.imageLibs.forEach((iterm,index)=>{
          if(iterm.id==this.radio2){
            obj = iterm;
          }
        });
        return obj;
      },
      currentPlayAdList(){
        return this.imageLibs.filter(iterm=>{
          if(this.checkedImage.includes(iterm.id)){
            return iterm;
          }
        });
      },
      adWHobj(){
        let wh = this.formData.style;
        if(!wh||wh.indexOf('*')<0){
          return {}
        }
        let whObj = wh.split('*');
        whObj=[parseInt(whObj[0]),parseInt(whObj[1])];
        let scale = 400/whObj[0];
        return {
          width:whObj[0]*scale,
          height:whObj[1]*scale
        }
      },
      basetSize(){
        let id = this.adId;
        console.log(this.adId)
        if(id===0||id>4){
          return '';
        }
        return adSize[id][0]+'*'+adSize[id][1]
      },
    },
    methods:{
      change(){
        this.autoPlay = !!(this.formData.autoPlay==1)

        console.log(this.formData,this.autoPlay)
      },
      beforeUpload(file){
        let flag = true;
        const ext = file.name.substring(file.name.lastIndexOf('.')+1);
        const isLt0M = 0 < file.size / 1024 / 1024 && file.size / 1024 / 1024<100;
        const nameLen = file.name.length <= 60;
        if (file.size / 1024 / 1024==0) {
          this.$confirm('文件大小不能为0kb!', "提示",{
          	confirmButtonText: "确定",
          	cancelButtonText: "取消",
          	showCancelButton: false,
          	type: "error"
          });
          flag = false;
        }
        if (file.size / 1024 / 1024>10) {
          this.$confirm('文件上传最大为10M！', "提示",{
          	confirmButtonText: "确定",
          	cancelButtonText: "取消",
          	showCancelButton: false,
          	type: "error"
          });
          flag = false;
        }
        if (ext=='exe'||ext=='bat'||ext=='com'||ext=='lnk'||ext=='pif') {
          this.$confirm('不能上传可执行文件!', "提示",{
          	confirmButtonText: "确定",
          	cancelButtonText: "取消",
          	showCancelButton: false,
          	type: "error"
          });
          flag = false;
        }
        if (!nameLen) {
          this.$confirm('文件名称不能超过50个字符!', "提示",{
          	confirmButtonText: "确定",
          	cancelButtonText: "取消",
          	showCancelButton: false,
          	type: "error"
          });
          flag = false;
        }
        // 上传图片格式
        if(ext!='png'&&ext!='jpg'&&ext!='jpeg'&&ext!='gif'){
          this.$confirm("图片的格式必须为png或者jpg或者jpeg或者gif格式！", "提示",{
          	confirmButtonText: "确定",
          	cancelButtonText: "取消",
          	showCancelButton: false,
          	type: "error"
          });
          flag = false;
        }
        if(flag){
          this.uploadBtnLoading=true;
        }
        return flag;
      },
      upLoadFileSuccess(response,file,filelist){
        this.uploadBtnLoading=false;
        this.imageLibs.push(response.data);
        this.checkAdSizeIsOk(this.adId, response.data.image)
      },
      uploadError(){
        this.$confirm('上传失败，请重试！', "提示",{
        	confirmButtonText: "确定",
        	cancelButtonText: "取消",
        	showCancelButton: false,
        	type: "error"
        });
        this.uploadBtnLoading=false;
      },
      /**
       * 删除图片，
       * @param id 当前图id
       */
      removeImage(id,image,index){
        this.deleteImages.push(image);
        this.deleteImagesIds.push(id);
        this.$confirm("确定删除该图片吗?", "提示",{
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(()=>{
//            this.$axios.delete(this.api_image_delete,{params:{
//              id:id,
//              image:image
//            }})
//              .then(response=>{
//                let res = response.data;
//                if (res.code == '1') {
                  this.imageLibs.splice(index,1);
                  this.isDelete = true;
//                  if(index<this.radio2){
//                    this.radio2--;
//                  }
//                }else{
//                  this.$message.error(res.msg.msgTrim());
//                }
//              })
//              .catch(e=>{
//                this.$message.error('删除失败，请重试！');
//              })
          })
          .catch(e=>{})
      },
//      /**
//       真正删除图片
//       * /
       deleteImg(id,image){
//        console.log(id,image);
         var ids = '';
         var images = '';
         for(var i = 0; i < id.length;i++) {
           ids += id[i]+','
         }
         for(var i = 0; i < image.length;i++) {
           images += image[i]+','
         }
         this.$axios.delete(this.api_image_delete,{params:{
          id:ids,
          image:images
        }})
         .then(response=>{
            let res = response.data;
           if (res.code == '1') {

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
            this.$confirm('删除失败，请重试！', "提示",{
            	confirmButtonText: "确定",
            	cancelButtonText: "取消",
            	showCancelButton: false,
            	type: "error"
            });
          })
       },


      /**
       * 保存广告
       */
      saveAd(){
        if(!this.formData.adname){
          this.$confirm('广告位置名称不能为空！', "提示",{
          	confirmButtonText: "确定",
          	cancelButtonText: "取消",
          	showCancelButton: false,
          	type: "error"
          });
          return false;
        }
        var regex =/(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
        if(this.formData.url&&!regex.test(this.formData.url)){
          this.$confirm('请输入正确的跳转链接！', "提示",{
          	confirmButtonText: "确定",
          	cancelButtonText: "取消",
          	showCancelButton: false,
          	type: "error"
          });
          return false;
        }
        let adIds = [];
        let disableIds = [];
        let imgurl=[];
        if(this.formData.type==0){
          adIds.push(this.currentPlayAd.id)
        }else{
          this.currentPlayAdList.forEach((iterm,index)=>{
            adIds.push(iterm.id)
            imgurl.push(iterm.imageJumpUrl);
          })
        }
        this.imageLibs.forEach(iterm=>{
          if(this.formData.type==0){
            if(adIds[0]!=iterm.id){
              disableIds.push(iterm.id);
            }
          }else{
            if(!adIds.includes(iterm.id)){
              disableIds.push(iterm.id);
            }
          }
        });
        console.log(adIds.join(","));
        console.log(imgurl.join(","));
        this.$axios.put(this.api_ad_save,this.$commonFun.initPostData({
          id:this.formData.id,
          adname:this.formData.adname,
          url:this.formData.url||'',
          isDisabled:this.formData.isDisabled,
          sort:this.formData.sort,
          note:this.formData.note,
          style:this.formData.style||'',
          type:this.formData.type,
          autoPlay:this.formData.autoPlay||true,
          navigationColor:this.formData.navigationColor||'',
          isNavigation:this.formData.isNavigation||false,
          animationInterval:this.formData.animationInterval*1000||'',
          animationEffect:this.formData.animationEffect||'',
          isShowHeading:this.formData.isShowHeading||false,
          apporpc:this.formData.apporpc,
          isDisplay:false,
          imageId:adIds.join(','),
          imageJumpUrl:imgurl.join(','),
          disable:disableIds.join(',')
        }))
          .then(response=>{
            console.log(response);
            let res = response.data;
            if (res.code == '1') {
              console.log(111111);
              this.$message.success('修改成功！');
              if (this.isDelete) {
                this.deleteImg(this.deleteImagesIds,this.deleteImages);
              }
              this.$router.push({name:'广告管理'});
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
            this.$confirm('保存失败，请重试！', "提示",{
            	confirmButtonText: "确定",
            	cancelButtonText: "取消",
            	showCancelButton: false,
            	type: "error"
            });
          })

      },
      /**
       * 当动画间隔发生变化时触发下当前轮播重置
       */
      animationIntervalChange(){
        const carousel = this.$refs.carousel;
        if(this.formData.autoPlay){
          carousel.pauseTimer();
          carousel.startTimer();
        }
      },
      /**
       * 判断是否是最佳尺寸
       * @param id
       * @param sizeArray
       */
      checkAdSizeIsOk(id,imageUrl){
        if(id===0||id>4){
          return;
        }
        let sizeArray = [0,0];
        let image = new Image();
        image.onload=()=>{
          sizeArray[0] = image.width;
          sizeArray[1] = image.height;
          let bestSize = adSize[id];

          console.log(id,imageUrl,adSize,sizeArray)
          if((bestSize[0]===sizeArray[0]&&bestSize[1]===sizeArray[1])||(bestSize[0]/bestSize[1]===sizeArray[0]/sizeArray[1])){
            return;
          }else{
            this.$message.warning('请上传'+bestSize[0]+'*'+bestSize[1]+'尺寸，或者同样宽高比的图片!');
          }
        };
        image.src= imageUrl;

      },
    },
    created(){
		  this.currentAdData = this.$route.params.adData;
      if(!this.currentAdData){
		    this.$router.push({name:'广告管理'})
      }else{

        this.formData=this.currentAdData;

         this.formData.animationInterval=this.formData.animationInterval/1000;
        this.adId = this.currentAdData.id;
        this.imageLibs = this.formData.image||[];
        this.formData.apporpc =  this.formData.apporpc+'';
      }

      if(this.formData.type===0){
        this.imageLibs.forEach(iterm=>{
          if(!iterm.isDisabled){
            this.radio2=iterm.id;
          }
        })
      }else{
        this.imageLibs.forEach(iterm=>{
          if(!iterm.isDisabled){
            this.checkedImage.push(iterm.id);
          }
        })
      }
    }
	}
</script>

<style scoped>
  .page-section{
    padding-bottom: 30px;
    padding-top: 10px;
    display: block;
    max-width: 1000px;
  }
  .page-section.paddingB0{
    padding-bottom: 0;
  }
  .ad-edit-form{
    max-width: 400px;
    padding-bottom: 0;
  }
  .section-title{
    padding:10px 0;
  }
.section-content{
  padding:10px 20px;
  min-height: 60px;
  border: 1px solid #ccc;
  position: relative;
}
  .section-content-arrow:before{
    content: " ";
    display: inline-block;
    background: #fff;
    padding: 4px;
    border: 1px solid #ccc;
    border-right-color: transparent;
    border-bottom-color: transparent;
    transform: rotate(45deg);
    position: absolute;
    top: -5px;
    left: 14px;
  }
  .imageList-iterm{
    display: inline-block;
    width: 116px;
    height: 100px;
    line-height: 100px;
    position: relative;
    text-align: center;
    border:1px dashed #ccc;
    margin-bottom: 10px;
  }
  .imageList-iterm img{
    max-height: 100%;
    max-width: 100%;
  }
  .iterm-img-box{
    display: inline-block;
    height: 100%;
  }
  .iterm-img-box img{
    display: inline-block;
    vertical-align: middle;
    max-width: 100%;
    max-height: 100%;

  }
  .add-img-btn-wrapper{
    display: inline-block;
    width: 80px;
    height: 80px;
    border: 1px dashed #ccc;
    margin-left: 23px;
    cursor: pointer;
    transition: all .28s;
  }
  .add-img-btn {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
  }
  .add-img-btn-wrapper:hover{
    background: rgba(0,0,0,.3);
  }
  .add-img-btn-wrapper:hover i{
    transition: all .28s;
    color: #eee;
  }
.ad-edit-input-title{
  max-width: 400px;
  padding-top: 60px;
}
  .imageList-iterm .remove-btn{
    position: absolute;
    top:0;
    right: 0;
    font-size: 12px;
    padding:2px;
  }
  .imageList-iterm .remove-btn:hover{
    color: #f5596e;
  }
  .ad-image-manage .el-checkbox{
    margin-right: 10px;
    margin-left: 0 !important;
  }
  .carousel{
    padding: 20px 10px;
  }
  .carousel.carousel-1 img{
    display: inline-block;
    max-width: 400px;
  }
  .ad-preview-box{

  }
</style>
