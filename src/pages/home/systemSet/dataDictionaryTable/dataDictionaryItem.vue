<template>

  <div>

    <p class="page-title">数据字典项：
      <el-button type="primary"
                 @click ="addLine"
                 class="pull-right" >
        新增
      </el-button>
    </p>

    <el-table
      max-height="10000px"
      ref="mainTable"
      :data="tableData"
      style="width: 100%;margin-top: 0.5em;">
      <el-table-column
        property="name"
        label="名称"
        align="center"
        width="150">
        <template scope="scope">
          <div class="cell" :class="scope.row.unDeleted?'':'deleted'" v-if="!scope.row.edit">{{scope.row.name}}</div>
          <el-tooltip v-else :content="'影响字典数据的业务展示,请谨慎修改'" openDelay="500" placement="top" effect="dark" >
            <el-input type="text" :maxlength="30" v-model="scope.row.name"></el-input>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        property="code"
        label="业务编码"
        align="center"
        width="100">
        <template scope="scope">
          <div class="cell" :class="scope.row.unDeleted?'':'deleted'" v-if="!scope.row.edit">{{scope.row.code}}</div>
          <el-tooltip v-else :content="'影响字典数据的业务关联,请谨慎修改'" openDelay="500" placement="top" effect="dark" >
            <el-input type="text" :maxlength="20"  v-model="scope.row.code"></el-input>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        property="sort"
        label="排序"
        align="center"
        width="100">
        <template scope="scope">
          <div class="cell" :class="scope.row.unDeleted?'':'deleted'" v-if="!scope.row.edit">{{scope.row.sort}}</div>
          <el-input type="text" :maxlength="11" v-else v-model="scope.row.sort"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        property="note"
        label="备注"
        min-width="100"
      >
        <template scope="scope">
          <div class="cell" :class="scope.row.unDeleted?'':'deleted'" v-if="!scope.row.edit">{{scope.row.note}}</div>
          <el-input type="textarea" :maxlength="30" :autosize="true" v-else v-model="scope.row.note"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="启用"
        property="unDeleted"
        width="80"
      >
        <template scope="scope">
          <el-checkbox :disabled="!scope.row.edit" v-model="scope.row.unDeleted"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="80"
        fixed="right"
      >
        <template scope="scope">
          <el-button type="text" class="text-btn" @click="editFun(scope.$index,true)">{{!scope.row.edit?'修改':'保存'}}</el-button>
          <el-button type="text" class="text-btn" v-if="scope.row.edit" @click="editFun(scope.$index,false)">取消</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-wrapper">
      <el-pagination
        v-if="totalNum>searchParams.pageSize"
        @size-change="handleSizeChange"
        @current-change="getTableData"
        :current-page.sync="searchParams.pageNumber"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="searchParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum">
      </el-pagination>
    </div>

  </div>

</template>
<script>

  export default {
    props:['currentTypeId'],
    data() {
      return {
        dataDictionaryItemListApi:"/pmpheep/dataDictionary/itemList",
        dataDictionaryItemAddApi:"/pmpheep/dataDictionary/item/add",
        tableData:[],

        totalNum:0,
        currentRow:'',
        searchParams:{
          name:'',
          code:'',
          note:'',
          deleted:'',
          typeId:'',
          pageNumber:1,
          pageSize:20,

        },

      };
    },
    methods: {

      /**
       * 获取表格数据
       */
      getTableData() {
        if (this.currentTypeId) {
        this.searchParams.typeId = this.currentTypeId;
        this.$axios.get(this.dataDictionaryItemListApi, {params: this.searchParams})
          .then(response => {
            var res = response.data;
            if (res.code == 1) {
              this.totalNum = res.data.total;
              this.tableData = res.data.rows;
            }
          })
        }
      },
      save(obj){
        obj.deleted = !obj.unDeleted;
        this.$axios.get(this.dataDictionaryItemAddApi,{params:obj})
          .then(response=>{
            var res = response.data;
            if(res.code!=1) {
              this.getTableData();
              this.$confirm(res.msg.replaceAll(/^.*?===>/ig,'')||'请求失败', "提示",{
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                showCancelButton: false,
                type: "error"
              });
            }
          })
          .catch(e=>{
            this.getTableData();
          this.$confirm(e.msg.replaceAll(/^.*?===>/ig,'')||'请求失败', "提示",{
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            showCancelButton: false,
            type: "error"
          });
        })
      },

      /**
       *  修改、保存、取消保存 公用按钮
       *  isSave 修改、保存时传入ture 取消传入false
       *  综合当前行是否编辑模式newtable[index].edit后 只有保存点击时isSave最终为true
       */
      editFun(index,isSave){
        let _this = this;
        //tableData的指向对象改变，表格才会刷新
        let newtable= this.$commonFun.objArrayDeepCopy(this.tableData);
        newtable[index].edit = !newtable[index].edit ;
        this.tableData = newtable;

        let finalIsSave = isSave && !newtable[index].edit;
        console.log(finalIsSave);
        //新增加的行保存前没有id 此时取消要去掉此行
        if(!isSave&&!this.tableData[index].id){
          this.tableData.splice(index,1);
        }

        //综合当前行是否编辑模式newtable[index].edit后 只有保存点击时isSave最终为true
        if(finalIsSave){
          this.save(_this.tableData[index]);
        }
      },
      addLine(){
        this.tableData.push({typeId:this.currentTypeId,code:'',name:'',note:'',deleted:false,unDeleted:true,edit:true})
      },
      /**
       * 分页每页显示条数发生改变
       * @param val
       */
      handleSizeChange(val){
        this.searchParams.pageSize=val;
        this.searchParams.pageNumber=1;
        this.getTableData();
      },
    },
    components:{

    },
    created() {
      this.getTableData();
    },
    watch:{
      currentTypeId(val){
        this.getTableData();
      },
    },
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
  .max-width-460 {
    max-width: 760px;
  }
  .text-btn{
    color:  rgb(18, 140, 246);
    margin-left: 0px !important;
  }
  .text-btn:hover{
    color:  rgb(18, 140, 246);
  }
  .el-table--fluid-height .el-table__fixed, .el-table--fluid-height .el-table__fixed-right {
    bottom: 0 !important;
    overflow: hidden;
  }
  .el-table__fixed-header-wrapper thead div {
    background-color: rgb(212, 217, 221);
  }
  .cell.deleted {
    color: #cacccd;
  }
</style>
