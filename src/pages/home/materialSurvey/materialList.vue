<template>
    <div class="application_list">
        <p class="header_search_p">
            <!--<el-select v-model="selectValue" class="select_input" placeholder="请选择">
                <el-option v-for="item in selectOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>-->
            <span style="margin-left:25px;">教材名称：</span>
            <el-input class="input" v-model.trim="searchForm.materialName" @keyup.enter.native="handleSearchCLick" ></el-input>
            <!--<el-input class="input" v-model.trim="searchForm.contactUserName" @keyup.enter.native="handleSearchCLick" v-if="selectValue==2"></el-input>-->
            <span style="margin-left:25px;">状态：</span>
            <el-select v-model="searchForm.state" class="select_input" @change="handleSearchCLick"  placeholder="全部">
                <el-option label="全部" value=""></el-option>
              <el-option label="未发布" value="未发布"></el-option>
                <el-option label="已发布" value="已发布"></el-option>
                <el-option label="报名结束" value="报名结束"></el-option>
              <el-option label="遴选结束" value="遴选结束"></el-option>
            </el-select>
            <el-button type="primary" class="button" icon="search" @click="handleSearchCLick">搜索</el-button>
            <!--<el-checkbox v-model="searchForm.isMy" class="check" @change="handleSearchCLick">仅查看我的</el-checkbox>-->
            <!--<router-link :to="{name:'新建通知',params:{materialId:'new'}}">
                <el-button class="right_button" type="primary">新建通知</el-button>
            </router-link>-->
        </p>

        <el-table :data="tableData" style="width:100%" class="table_list table-wrapper" stripe border>
            <!--<el-table-column type="selection" width="55">-->
            <!--</el-table-column>-->
          <el-table-column
            type="index" label="序号" align="center"
            width="70">
            <template scope="scope">
              {{(scope.$index+1)+searchForm.pageSize*(searchForm.pageNumber-1)}}
            </template>
          </el-table-column>
            <el-table-column label="教材名称" min-width="100">
                <template scope="scope">
                    <p>{{scope.row.materialName}}</p>
                </template>
            </el-table-column>
            <el-table-column label="显示结束日期" width="128" >
                <template scope="scope">
                    <p>{{scope.row.deadline}}</p>
                </template>
            </el-table-column>
            <el-table-column label="实际结束日期" width="128">
                <template scope="scope">
                    <p>
                        {{scope.row.actualDeadline}}
                    </p>
                </template>
            </el-table-column>
          <el-table-column label="发布日期" width="110">
            <template scope="scope">
              <p>
                {{scope.row.gmtCreate}}
              </p>
            </template>
          </el-table-column>
            <el-table-column :className="'justify'" label="创建人" width="80">
                <template scope="scope">
                    <p>
                        {{scope.row.founderName}}
                    </p>
                </template>
            </el-table-column>
          <el-table-column label="创建部门" min-width="100" align="center">
            <template scope="scope">
              <p>
                {{scope.row.dpName}}
              </p>
            </template>
          </el-table-column>
            <!--<el-table-column label="联系人" align="center">
                <template scope="scope">
                  <div class="contact_p" v-if="scope.row.contacts&&scope.row.contacts.length">
                      <span>{{scope.row.contacts[0].contactUserName}}</span>
                      <span> <i class="fa fa-phone"></i> {{scope.row.contacts[0].contactPhone}}</span>
                      &lt;!&ndash; <span> <i class="fa fa-envelope-o"></i> {{scope.row.contacts[0].contactEmail}}</span> &ndash;&gt;
                    <el-button type="text" v-if="scope.row.contacts.length>1" @click="showMoreContact(scope.row.contacts)">更多</el-button>
                  </div>
                </template>
            </el-table-column>-->
            <el-table-column prop="status" label="状态" :className="'justify'" width="98">
                <template scope="scope">
                    {{scope.row.state}}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
                <template scope="scope">
                    <p class="operation_p">
                      <el-button type="text"  @click="resultCount(scope.row.id,scope.row.materialName);">结果统计</el-button>
                      <!--<router-link :to="{name:'教材相关调研统计',query:{materialId:scope.row.id,materialName:scope.row.materialName,materialRelative:true}}">结果统计</router-link>-->
                    </p>
                </template>
            </el-table-column>
        </el-table>
      <div class="pagination-wrapper">
        <el-pagination
          v-if="totalNum"
          @size-change="handleSizeChange"
          @current-change="getTableData"
          :current-page.sync="searchForm.pageNumber"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="searchForm.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNum">
        </el-pagination>
      </div>


      <el-dialog
        title="更多联系人"
        :visible.sync="dialogVisible"
        size="tiny">
        <div>
          <el-table
            :data="moreContactUserList"
            border
            stripe
            style="width: 100%">
            <el-table-column
              prop="contactUserName"
              label="姓名"
              width="100">
            </el-table-column>
            <el-table-column
              prop="contactPhone"
              label="电话">
            </el-table-column>
            <el-table-column
              prop="contactEmail"
              label="邮箱">
            </el-table-column>
          </el-table>
        </div>
      </el-dialog>
    </div>
</template>
<script type="text/javascript">
export default {
    data() {
        return {
            api_material_list:'/pmpheep/material/list',
            api_material_del:'/pmpheep/material/delete',
            api_export_excel:'/pmpheep/excel/published/org',
            searchForm:{
              pageSize:20,
              pageNumber:1,
              isMy:false,
              state:'',
              contactUserName:'',
              materialName:'',
            },
            totalNum:0,
            selectValue: 1,
            selectOptions: [{
                value: 1,
                label: '教材名称'
            }],
            tableData: [],
          dialogVisible:false,
          moreContactUserList:[],
        }
    },
    methods: {
      /**
       * 获取表格数据
       */
      getTableData(){
        this.$axios.get(this.api_material_list,{params:this.searchForm})
          .then(response=>{
            var res = response.data;
            if(res.code==1){
              this.totalNum = res.data.total;
              res.data.rows.map(iterm=>{
                iterm.actualDeadline = this.$commonFun.formatDate(iterm.actualDeadline).split(' ')[0];
                iterm.deadline = this.$commonFun.formatDate(iterm.deadline).split(' ')[0];
                iterm.gmtCreate = this.$commonFun.formatDate(iterm.gmtCreate).split(' ')[0];
              });
              this.tableData = res.data.rows;
            }
          })
          .catch(e=>{
            console.log(e);
          })
      },
      resultCount(materialId,materialName){
        this.$router.push({name:'教材相关调研统计',query:{materialId:materialId,materialName:materialName,materialRelative:true}});
      },
      /**
       * 点击搜索按钮
       * @param val
       */
      handleSearchCLick(){
        if(this.searchForm.pageNumber==1){
          this.getTableData();
        }else{
          this.searchForm.pageNumber=1;
          this.getTableData();
        }
      },

      /**
       * 分页每页显示条数发生改变
       * @param val
       */
      handleSizeChange(val){
        this.searchForm.pageSize=val;
        this.searchForm.pageNumber=1;
        this.getTableData();
      },
      /**
       * 显示更多联系人
       * @param list 联系人列表
       */
      showMoreContact(list){
        this.moreContactUserList = list;
        this.dialogVisible=true;
      },
      /**
       * 是否有权限访问
       * @param index 权限表下标
       * @param row 该套教材data
       */
      hasAccessAuthority(index,row,endShow){
        if(!row.isMy){
          return false;
        }
        //如果传的是boolean类型，就直接返回
        if((typeof index).toLowerCase() == "boolean"){
          return (row.isMy && index || (endShow || !(row.isForceEnd||row.isAllTextbookPublished)));
        }

        let rolesAccessAuthority = this.$commonFun.materialPower(index,row.myPower);

        return (row.isMy && rolesAccessAuthority && (endShow || !(row.isForceEnd||row.isAllTextbookPublished)));
      },
      /**
       * 点击操作按钮，
       * * @param type 操作类型，修改：edit, 发布：publish, 通知详情：msg, 消息状态：msgState, 设置书目录：setBookList,
       *                        结果统计：result, 设置选题号：setTopic, 删除：delete, 遴选办理：select
       * * @param materialData  当前教材数据
       */
      operation(type,materialData){
        switch (type){
          case 'edit':
            this.$router.push({name:'新建通知',params:{materialId:materialData.id,type:'reEdit'}});
            break;
          case 'delete':
            this.delete(materialData.id);
            break;
          case 'publish':
            if(materialData.materialStep=="编辑通知详情"){
              this.$router.push({name:'编辑通知详情',params:{materialId:materialData.id}});
            }else if(materialData.materialStep=="设置书目录"){
              this.$router.push({name:'设置书目录',params:{materialId:materialData.id}});
            }else{
              this.$router.push({name:'教材申报选择学校',params:{materialId:materialData.id,type:'reEdit'}});
            }
            break;
          case 'msg':
            this.$router.push({name:'通知详情',params:{materialId:materialData.id,type:'reEdit'}});
            break;
          case 'msgState':
            this.$router.push({name:'消息状态',query:{materialId:materialData.id,senderId:materialData.founderId}});
            break;
          case 'setBookList':
            this.$router.push({name:'设置书目录',params:{materialId:materialData.id}});
            break;
          case 'result':
            this.$router.push({name:'结果统计',params:{materialId:materialData.id}});
            break;
          case 'setTopic':
            this.$router.push({name:'设置选题号',params:{materialId:materialData.id}});
            break;
          case 'toProcess':
            this.$router.push({name:'申报表审核',params:{materialId:materialData.id}});
            break;
          case 'exportExcel':
            this.exportExcel(materialData.id);
            break;
          default:
            throw new error('没有该类型操作');
        }
      },
      /**
       * 删除通知
       * @param id
       */
      delete(id){
        this.$confirm("确定删除教材通知？", "提示",{
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(()=>{
            this.$axios.put(this.api_material_del,this.$commonFun.initPostData({
              id:id
            }))
              .then(response=>{
                let res = response.data;
                if(res.code==1){
                  this.$message.success('删除成功!');
                  this.getTableData();
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
                console.log(e);
              })
          })
          .catch(e=>{})

      },
      /**
       * 导出学校列表
       * @param id 教材id
       */
      exportExcel(id){
        let url = this.api_export_excel+"?materialId="+id
        this.$commonFun.downloadFile(url);
      }
    },
    created() {
      /* 是否从首页跳转过来 */
      if(this.$route.params.materialName){
        this.searchForm.materialName=this.$route.params.materialName;
      }
      if(this.$route.params.materialState){
        this.searchForm.state=this.$route.params.materialState;
      }
      this.getTableData();
    }
}

</script>
<!--<style>
  .el-table .cell {
    padding-left:8px;
    padding-right: 8px;
  }
</style-->>
<style scoped>
.application_list {
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
}

.header_search_p {
    margin-bottom: 20px;
    overflow: hidden;
}

.header_search_p .select_input {
    width: 150px;
    float: left;
}

.header_search_p .input {
    float: left;
    width: 250px;
    margin-left: 15px;
}

.header_search_p .button,
.header_search_p .check {
    margin-left: 15px;
}

.header_search_p .right_button {
    float: right;
}

/*.table_list p{*/
  /*text-align: center;*/
/*}*/

.table_list .contact_p {

    overflow: hidden;
    width: 100%;
}

.table_list .contact_p span {
    margin-right: 10px;
}

.table_list .operation_p {
    float: left;
}

.table_list .operation_p .op_button {
    /*  color: #1ab194; */
    float: left;
}

.table_list .operation_p .op_span {
    margin: 0 5px;
    float: left;
    line-height: 32px;
}

.table_list .operation_p .more_button {
    cursor: pointer;
    line-height: 34px;
    margin-left: 20px;
    color: #337ab7;
}

.table_list .operation_p .more_button:hover {

    color: #23527c;
}

.application_list .pagination {
    float: right;
    margin-top: 20px;
}

.header_search_p span,.header_search_p button{
  float: left;
  display: inline-block;
}
.header_search_p span{
  height: 36px;
  line-height: 36px;
}

</style>
<style>
  /*姓名列 不同长度名字自适应字间距 对齐总长度*/
  td.justify{
    text-align-last: justify;
  }
  .application_list th{
    text-align: center;
  }

</style>
