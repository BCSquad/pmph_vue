<template>
	<div class="message-detail">
    <!--标题-->
    <div class="message-detail-content" style="height: 36px">
      <div class="message-detail-content-title justify-align lineheight-36">
        标题：<span></span>
      </div>
      <div class="message-detail-content-min">
        <h5 class="previewTitle">{{msgData.title}}</h5>
      </div>
    </div>

    <!--发送人-->
    <div class="message-detail-content inline">
      <div class="message-detail-content-title justify-align">
        发送人：<span></span>
      </div>
      <div class="message-detail-content-min">
        <span class="marginR10">{{msgData.senderName}}</span>
      </div>
    </div>
    <!--发送时间-->
    <div class="message-detail-content inline">
      <div class="message-detail-content-title justify-align">
        发送时间：<span></span>
      </div>
      <div class="message-detail-content-min">
        <span>{{msgData.sendTime}}</span>
      </div>
    </div>

    <!--消息内容-->
    <div class="message-detail-content">
      <div class="message-detail-content-title justify-align">
        内容：<span></span>
      </div>
      <div class="message-detail-content-min">
        <div class="previewConten" v-html="msgData.content"></div>
      </div>
    </div>


    <!--附件-->
    <div class="message-detail-content" v-if="msgData.files.length">
      <div class="message-detail-content-title justify-align">
        附件：<span></span>
      </div>
      <div class="message-detail-content-min">
        <div class="previewFile" title="预览界面不提供下载附件功能" v-if="readOnly">
          <span v-for="(iterm,index) in msgData.files">{{iterm[fileLableKey.name]}}</span>
        </div>
        <div class="previewFile" v-else>
          <a v-for="(iterm,index) in msgData.files" :href="iterm[fileLableKey.url]" :key="iterm.id">{{iterm[fileLableKey.name]}}</a>
        </div>
      </div>
    </div>

	</div>
</template>

<script>
	export default {
	  props:{
	    readOnly:{
        type: Boolean,
        required: false
      },
      msgData:{//消息内容
        type:Object,
        default:function () {
          return {
            title:'',
            content:'',
            senderName:'',
            sendTime:'',
            files:[]
          }
        }
      },
      fileLableKey:{
        type:Object,
        default:function () {
          return {
            name:'name',
            url:'url'
          }
        },
        required: false
      }
    },
		data() {
			return {}
		}
	}
</script>

<style scoped>
  /*预览弹窗样式*/
  .message-detail{
    max-width: 1200px;
    margin: 0 auto;
  }
  .previewTitle{
    color: #14232e;
    font-size: 22px;
    font-weight: 500;
  }
  .previewContent{
  }
  .previewFile a{
    display: block;
    color: #337ab7;
    margin: 0 0 10px;
  }
  .previewFile span{
    display: block;
    color: #337ab7;
    margin: 0 0 10px;
  }
  .message-detail-content{
    margin-top: 20px;
  }
  .message-detail-content.inline{
    display: inline-block;
    vertical-align: middle;
    margin-right: 20px;
  }
  .message-detail-content-title{
    width:74px;
    float: left;
  }
  .message-detail-content-min{
    margin-left: 80px;
  }
  .justify-align{
    line-height: 1.4;
  }
  .justify-align.lineheight-36{
    line-height: 36px;
  }
</style>
