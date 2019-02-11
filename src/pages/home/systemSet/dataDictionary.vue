<template>
  <div>
    <el-row class="department">
      <el-col :span="12">
        <div class="paddingR30">
          <div class="max-width-760 paddingB20 clearfix">
            <DataDictionaryType @transferCurrentRow="getCurrentRow"></DataDictionaryType>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="paddingL30">
          <div class="max-width-760">
            <DataDictionaryItem :currentTypeId="currentRow.id"></DataDictionaryItem>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import DataDictionaryType from '../systemSet/dataDictionaryTable/dataDictionaryType.vue';
  import DataDictionaryItem from '../systemSet/dataDictionaryTable/dataDictionaryItem.vue';
  export default {

  data() {
    return {
      //tableData:[],
      currentRow:'',
    };
  },
  methods: {
    getCurrentRow(row){
      this.currentRow = row;
    },
  },
  components:{
    DataDictionaryType,DataDictionaryItem
  },
  created() {
  }
};
</script>
<style>
.department {
  width: 100%;
  box-sizing: border-box;
}

.page-title{
  padding: 10px 0 0;
  line-height: 2em;
}
.page-title.paddingB20{
  padding-bottom: 20px;
}
.max-width-760 {
  max-width: 760px;
}
.text-btn{
  color:  rgb(18, 140, 246);
  margin-left: 0px !important;
}
.text-btn:hover{
  color:  rgb(18, 140, 246);
}
</style>
