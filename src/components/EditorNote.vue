<template>
  <div class="editor">
    <script id="editorNote" type="text/plain" ref="editorNote" name="editorNote"></script>
  </div>
</template>
<script>
  import '../../static/ueditor/ueditor.config.js'
  import '../../static/ueditor/ueditor.all.js'
  import '../../static/ueditor/lang/zh-cn/zh-cn.js'
  export default {
    name: 'EditorNote',
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
        editorNote: null,
        editorNoteHasReady:false,
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
      //UE.delEditor('editorNote');
      this.editorNote = UE.getEditor('editorNote', this.editorConfig); // 初始化UE
      console.log("editorNote set content");
      this.editorNote.addListener("ready", function () {
        console.log("editorNote set content");
        if(_this.defaultMsg){
          _this.editorNote.setContent(_this.defaultMsg);
        }
        _this.editorNoteHasReady=true;
        //_this.setHeight(400); //设置ue的固定高度
        //_this.$emit('editor_ready');
      });
    },
    methods: {
      getContent() { // 获取内容方法
        if(this.editorNote){
          return this.editorNote.getContent();
        }
        return '';
      },
      setContent(Msg){
        var timer;
        if(!this.editorNoteHasReady){
          timer = setInterval(()=>{
            this.editorNote.setContent(Msg);
            clearInterval(timer);
          },50);
          return;
        }
        this.editorNote.setContent(Msg);
      },
      destroy(){
        this.editorNote.destroy();
        this.editorNote=undefined;
      },
    },
    destroyed(){
      if(this.editorNoteHasReady&&this.editorNote){
        this.editorNote.destroy();
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
