<template>
  <div class="activity_chain_video">
    <p class="header_p"><span>教材名称：</span>
      <el-input class="input" v-model="materialParams.materialName" placeholder="请输入教材名称"></el-input>
      <el-button type="primary" icon="search" @click="selectmaterial">搜索</el-button>
      <el-button type="primary" @click="confirmMaterial" style="float: right">确认选择</el-button>
    </p>
    <el-table :data="materialListData" border highlight-current-row
              @current-change="materialSlectRow"
              style="width:100%;margin:10px 0;">
      <el-table-column prop="materialName" label="教材名称">
      </el-table-column>
    </el-table>
    <div class="pagination-wrapper">
      <el-pagination
        v-if="materialTotal>materialParams.pageSize"
        @size-change="materialSizeChange"
        @current-change="materialCurrentChange"
        :current-page.sync="materialParams.pageNumber"
        :page-sizes="[10,20,30,50]"
        :page-size="materialParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="materialTotal">
      </el-pagination>
    </div>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        materialListData:[],
        materialParams:{
          pageSize:10,
          pageNumber:1
        }
      }

    },
    methods: {


    }

  }
</script>

<style scoped>
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

  .top-nav .header_back_tips p {
    float: right;
    height: 43px;
    font-size: 17px;
    padding: 2px 20px 2px 15px;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
