<template>
  <div>


      <el-table ref="multipleTable"
                border
                @select-all = "handleSelectAll"
                @selection-change="handleSelectionChange"
                :data="modelListData"
                tooltip-effect="dark"
                style="width: 100%">

        <el-table-column
          type="selection"
          width="55"  >
        </el-table-column>

        <el-table-column
          prop="templateName"
          label="调研表名称"
          >
        </el-table-column>

        <el-table-column
          prop="intro"
          label="概述"
          >
        </el-table-column>

       <!-- <el-table-column
          prop="preVersionMaterialRound"
          label="版次"
          width="100">
        </el-table-column>-->

        <el-table-column
          prop="surveyName"
          label="调研对象"
          width="100">
        </el-table-column>

      </el-table>





    <div class="pagination-wrapper">
      <el-pagination
        v-if="totalNum"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10,20,30,40]"
        :page-size="searchParams.pageSize"
        :current-page="searchParams.pageNumber"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum">
      </el-pagination>
    </div>

  </div>
</template>

<script type="text/javascript">
export default {
    props: {
      selectedIdsSet: {
        type: Set,
        default: function () {
          return new Set();
        }
      },
      duplicateIdsSet: {
        type: Set,
        default: function () {
          return new Set();
        }
      },
    },
    data() {
        return {
          surveyLsitUrl:'/pmpheep/materialSurvey/template/list', //调研表模板列表url
          totalNum: 0,
          modelListData:[],
          searchParams:{
            templateName:'',
            startTime:'',
            endTime:'',
            pageSize:10,
            pageNumber:1,
            duplicateIds:'',
            isActive:true
          },
          isGetTableDataDone:false,
          currentUserId:this.$getUserData().userInfo.id,
          selectAll:false,
          selectedIds:'',
          /*selectedIdsSet:new Set(),*/
          selectedIdsMap:new Map(),
          selectedValSet:new Set(),
        }
    },
    methods: {

      getModelList(){
        let _this = this;
        this.isGetTableDataDone = false;
        this.$axios.get(this.surveyLsitUrl,{
          params:this.searchParams
        }).then((res)=>{
          if(res.data.code==1){
            this.totalNum=res.data.data.total;
            this.modelListData=res.data.data.rows;

            //回填翻页前的选中
            _this.$nextTick(function() {
              _this.modelListData.forEach(item=>{
                if(_this.selectedIdsSet.has(item.id)){
                  _this.$refs.multipleTable.toggleRowSelection(item,true);
                }
              })
              this.isGetTableDataDone = true;

            })

          }
        })
      },
      handleSelectAll(val){
        if(val.length>0){
          this.selectAll = true;
        }
      },
      handleSelectionChange(val){
        var _this = this;
        if(this.isGetTableDataDone){//若为页面重新加载数据 如翻页 则不删除所进入页面的数据id 若不是 则是手动操作的 就删除当前页数据 按照val重置当前选中
          _this.modelListData.forEach(t => {
            _this.selectedIdsSet.delete(t.id);
            _this.selectedIdsMap.delete(t.id);
          })
        }

        val.forEach(item => {

          _this.selectedIdsSet.add(item.id);
          _this.selectedIdsMap.set(item.id,
            {'templateName':item.templateName,
              'preVersionMaterialName':item.preVersionMaterialName,
              'preVersionMaterialId':item.preVersionMaterialId,
              'preVersionMaterialRound':item.preVersionMaterialRound,
              'surveyName':item.surveyName,
              'intro':item.intro,
              'typeId':item.typeId,
            })
        })

        this.selectedIds = Array.from(this.selectedIdsSet).toString();
        _this.selectedValSet.clear();
        _this.selectedIdsMap.forEach(function (value, key, map) {
          _this.selectedValSet.add({'id':key,
            'templateName':value.templateName,
            'preVersionMaterialName':value.preVersionMaterialName,
            'preVersionMaterialId':value.preVersionMaterialId,
            'preVersionMaterialRound':value.preVersionMaterialRound,
            'surveyName':value.surveyName,
            'typeId':value.typeId,
          })
        });



      },
      /* 分页改变 */
      handleSizeChange(val){
        this.searchParams.pageSize=val;
        this.searchParams.pageNumber=1;
        this.getModelList();
      },
      handleCurrentChange(val){
        this.searchParams.pageNumber=val;
        this.getModelList();
      },
    },
  created(){
    this.searchParams.duplicateIds=Array.from(this.duplicateIdsSet).toString();
    console.log(this.selectedIdsSet);
    this.getModelList();
  },
}

</script>
<style scoped>

</style>
