<template>
  <div class="editor">
    <script id="editor" type="text/plain" ref="editor" name="editor" ></script>
  </div>
</template>
<script>
  import '../../static/ueditor/ueditor.config.js'
  import '../../static/ueditor/ueditor.all.js'
  import '../../static/ueditor/lang/zh-cn/zh-cn.js'
  export default {
    name: 'Editor',
    props: {
      defaultMsg: {
        type: String
      },
      config: {
        type: Object,
      }
    },
    data(){
      return {
        editor: null,
        editorHasReady:false,
      }
    },
    computed:{
      editorConfig(){
        var option = {};
        for(let key in this.config){
          option[key] = this.config[key];
        }
        option.lang='zh-cn';
        return option;
      },
    },
    mounted(){
      const _this = this;
      this.editor = UE.getEditor('editor', this.editorConfig); // 初始化UE
      this.editor.addListener("ready", function () {

        if(_this.defaultMsg){
          _this.editor.setContent(_this.defaultMsg);
        }
        _this.editorHasReady=true;
        //_this.setHeight(400); //设置ue的固定高度
        //_this.$emit('editor_ready');
      });
    },
    methods: {
      getContent() { // 获取内容方法
        if(this.editor){
          return this.editor.getContent();
        }
        return '';
      },
      setContent(Msg){
        var timer;
        if(!this.editorHasReady){
          timer = setInterval(()=>{
            this.editor.setContent(Msg);
            clearInterval(timer);
          },50);
          return;
        }
        this.editor.setContent(Msg);
      },
      destroy(){
        this.editor.destroy();
        this.editor=undefined;
      },
    },
    destroyed(){
      if(this.editorHasReady&&this.editor){
        this.editor.destroy();
      }
    }
  }
</script>
<style scoped>
.editor{
  line-height: 1;
  height:auto !important;height:600px;
}
p{
  text-indent: 2em !important;
}

  p img{
    text-indent: -2em !important;
  }
</style>
