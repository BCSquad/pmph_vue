<template>
  <div class="add_new_survey">
   <p class="header_p">
    <span>模板名称：</span>
    <el-input class="input" placeholder="请输入模板名称"></el-input>
    <el-button type="primary" icon="search">搜索</el-button>
    <el-button type="primary">手动新建调查问卷</el-button>
   </p>
   <div class="left_table_box">
    <el-table :data="modelTableData" border style="margin-bottom:20px">
    <el-table-column label="模板名称" >
      <template scope="scope">
        <p class="link">{{scope.row.modelName}}</p>
      </template>
      </el-table-column> 
    </el-table>
              <!--分页-->
    <div class="pagination-wrapper">
      <el-pagination
        v-if="pageTotal>searchParams.pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchParams.pageNumber"
        :page-sizes="[10,20,30,50]"
        :page-size="searchParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageTotal">
      </el-pagination>
    </div>
   </div>
   <div class="right_list_box">
      <h3>社交网站满意度问卷模板</h3>
      <ul>
        <li>
          1.您是否使用过xx社交网站？
        </li>
        <li>
          2.您使用xx社交网站的目的是？
        </li>
        <li>
          3.您在XX社交网站上主要做什么？
        </li>
        <li>
          4.您使用XX社交网站的频率是？
        </li>
        <li>
          5.到目前为止，您使用XX社交网站有多久了？
        </li>
        <li>
          6.您认为对于XX社交网站而言，哪些因素比较重要？
        </li>
        <li>
          7.总的来说，您对XX社交网站的满意度是？
        </li>
        <li>
          8.您是否愿意继续使用XX社交网站？
        </li>
        <li>
          9.您是否愿意推荐身边的人（亲朋好友）使用XX社交网站？
        </li>
        <li>
          10.您对xx社交网站“网站界面布局合理设计美观”的同意程度是？
        </li>
        <li>
          11.您对xx社交网站“网站内容更新速度快”的同意程度是？
        </li>
        <li>
          12.您对xx社交网站“网站内容更新速度快”的同意程度是？
        </li>
      </ul>
      <el-button type="primary" class="bottom_button">使用该模板创建问卷</el-button>
   </div>
  </div>
</template>
<script type="text/javascript">
export default {
  data() {
    return {
      searchParams:{
        pageSize:10,
        pageNumber:1, 
      },
      pageTotal:1000,
      modelTableData:[
        {
          modelName:'社交网站满意度问卷调查模板',
        },
        {
          modelName:'购物网用户满意度调查'
        },
        {
          modelName:'数码家电类产品满意度模板'
        },
        {
          modelName:'网购消费者的行为习惯调查'
        },
        {
          modelName:'社交网站满意度问卷调查模板',
        },
        {
          modelName:'购物网用户满意度调查'
        },
        {
          modelName:'数码家电类产品满意度模板'
        },
        {
          modelName:'网购消费者的行为习惯调查'
        },
        {
          modelName:'社交网站满意度问卷调查模板',
        },
        {
          modelName:'购物网用户满意度调查'
        },
        {
          modelName:'数码家电类产品满意度模板'
        },
        {
          modelName:'网购消费者的行为习惯调查'
        }
      ]
    };
  },
  methods:{
    handleSizeChange(){

    },
    handleCurrentChange(){

    }
  }
};
</script>
<style>
.add_new_survey {
  overflow: hidden;
}
.add_new_survey .header_p {
  overflow: hidden;
  margin-bottom:20px;
}
.add_new_survey .header_p .input {
  width: 217px;
  margin-right: 10px;
}
.add_new_survey .left_table_box{
  width:55%;
  float:left;
}
.add_new_survey .right_list_box{
  width:40%;
  float: left;
  padding-left:20px;
  box-sizing: border-box;
  margin-left:3%;
  border-left:1px solid #dadada;
  min-height: 750px;
}
.add_new_survey .right_list_box h3{
  text-align: center;
  margin-bottom:20px;
}
.add_new_survey .right_list_box ul{
  margin-bottom:35px;
}
.add_new_survey .right_list_box ul li{
  line-height: 28px;
  color:#999;
}
.add_new_survey .right_list_box .bottom_button{
  margin-left: 50%;
  transform: translateX(-50%);
}
</style>
