<template>

  <div>

    <p class="page-title">数据字典类型：
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
      highlight-current-row
      @current-change="handleCurrentChange"
      style="width: 100%;margin-top: 0.5em;">
      <el-table-column
        property="typeName"
        label="名称"
        align="center"
        width="150">
        <template scope="scope">
          <div class="cell" v-if="!scope.row.edit">{{scope.row.typeName}}</div>
          <el-input type="text" v-else v-model="scope.row.typeName"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        property="typeCode"
        label="业务编码"
        align="center"
        width="150">
        <template scope="scope">
          <div class="cell" v-if="!scope.row.edit">{{scope.row.typeCode}}</div>
          <el-tooltip v-else :content="'影响字典查询业务逻辑,请谨慎修改'" openDelay="500" placement="top" effect="dark" >
            <el-input type="text"  v-model="scope.row.typeCode"></el-input>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        property="note"
        label="备注"
        min-width="150"
      >
        <template scope="scope">
          <div class="cell" v-if="!scope.row.edit">{{scope.row.note}}</div>
          <el-input type="textarea" :autosize="true" v-else v-model="scope.row.note"></el-input>
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
    data() {
      return {
        dataDictionaryTypeListApi:"/pmpheep/dataDictionary/typeList",
        dataDictionaryTypeAddApi:"/pmpheep/dataDictionary/type/add",
        tableData:[],
        visible:false,
        totalNum:0,
        currentRow:'',
        currentRowIndex:'',
        searchParams:{
          typeName:'',
          typeCode:'',
          note:'',
          pageNumber:1,
          pageSize:20,

        },

      };
    },
    methods: {

      /**
       * 获取表格数据
       */
      getTableData(){
        this.$axios.get(this.dataDictionaryTypeListApi,{params:this.searchParams})
          .then(response=>{
            var res = response.data;
            if(res.code==1) {
              this.totalNum = res.data.total;
              this.tableData = res.data.rows;
              this.$nextTick(()=>{
                if(this.tableData.length>0){
                  this.currentRow = this.tableData[0];
                }else{
                  this.currentRow = '';
                }
                this.$refs.mainTable.setCurrentRow(this.currentRow);
                this.$emit('transferCurrentRow',this.currentRow);
              });
            }
          })
      },
      save(obj){
        this.$axios.get(this.dataDictionaryTypeAddApi,{params:obj})
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
            }else if(res.code==1){
              if(res.data.id){
                obj.id = res.data.id;
              }
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
       * 字典类型表 当前选中列改变触发
       */
      handleCurrentChange(val){
        if(val&&val.id){
          this.currentRow = val;
          this.$emit('transferCurrentRow',val);
        }else{
          this.$refs.mainTable.setCurrentRow(this.currentRow);
        }
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
        //新增加的行保存前没有id 此时取消要去掉此行
        if(!isSave&&!this.tableData[index].id){
          this.tableData.splice(index,1);
        }

        //综合当前行是否编辑模式newtable[index].edit后 只有保存点击时isSave最终为true
        if(finalIsSave){
          console.log(_this.tableData[index]);
          this.save(_this.tableData[index]);
        }
      },
      addLine(){
        this.tableData.push({typeName:'',typeCode:'',note:'',edit:true})
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
  .el-table__body tr.current-row > td {
    background: rgb(239, 239, 239);
    font-weight: 600;
  }
</style>
