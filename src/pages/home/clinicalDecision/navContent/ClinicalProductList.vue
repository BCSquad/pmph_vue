<template>
    <div class="application_list">
        <p class="header_search_p">
            <el-select v-model="selectValue" class="select_input" placeholder="请选择">
                <el-option v-for="item in selectOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
            <el-input class="input" v-model.trim="searchForm.product_name" @keyup.enter.native="handleSearchCLick" v-if="selectValue==1"></el-input>
            <!--<el-input class="input" v-model.trim="searchForm.contactUserName" @keyup.enter.native="handleSearchCLick" v-if="selectValue==2"></el-input>-->
            <span style="margin-left:25px;">状态：</span>
            <el-select v-model="searchForm.is_published" class="select_input" @change="handleSearchCLick" style="float:none;" placeholder="全部">
                <el-option label="全部" value=""></el-option>
                <el-option label="未发布" value="0"></el-option>
                <el-option label="已发布" value="1"></el-option>
            </el-select>
            <el-button type="primary" class="button" icon="search" @click="handleSearchCLick">搜索</el-button>
            <!--<el-checkbox v-model="searchForm.isMy" class="check" @change="handleSearchCLick">仅查看我的</el-checkbox>-->
            <el-checkbox v-model="searchForm.is_active" class="check" @change="handleSearchCLick">查看当前公告</el-checkbox>
            <router-link :to="{name:'临床决策专家申报',query:{product_id:'new',clinicaltype:product_type}}">
                <el-button class="right_button" type="primary">新建通知</el-button>
            </router-link>
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
            <el-table-column label="临床申报名称" width="130">
                <template scope="scope">
                    <el-button type="text" style="color:#337ab7;white-space: normal;text-align:left;" @click="operation('toProcess',scope.row)" v-if="hasAccessAuthority(true,scope.row)">{{scope.row.product_name}}</el-button>
                    <p v-else>{{scope.row.product_name}}</p>
                </template>
            </el-table-column>
            <!--<el-table-column label="显示结束日期" width="128" >
                <template scope="scope">
                    <p>{{scope.row.deadline}}</p>
                </template>
            </el-table-column>-->
            <!--<el-table-column label="实际结束日期" width="128">
                <template scope="scope">
                    <p>
                        {{scope.row.actualDeadline}}
                    </p>
                </template>
            </el-table-column>-->
          <el-table-column label="发布日期" width="110">
            <template scope="scope">
              <p>
               {{scope.row.gmtCreate}}
              </p>
            </template>
          </el-table-column>
          <el-table-column label="创建人" >
            <template scope="scope">
              <p>
                {{scope.row.founder}}
              </p>
            </template>
          </el-table-column>
          <el-table-column label="报名截止日期" width="130">
            <template scope="scope">
              <p>
                {{scope.row.actualDeadline}}
              </p>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="80">
            <template scope="scope">
              {{scope.row.is_published?'已发布':'未发布'}}
            </template>
          </el-table-column>

          <el-table-column label="修改时间" width="110">
            <template scope="scope">
              <p>
                {{scope.row.gmtPublish}}
              </p>
            </template>
          </el-table-column>
          <el-table-column label="修改人" >
            <template scope="scope">
              <p>
                {{scope.row.publisher}}
              </p>
            </template>
          </el-table-column>
          <el-table-column label="创建部门" width="100" align="center">
            <template scope="scope">
              <p>
                {{scope.row.founderDepartment}}
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

          <el-table-column label="是否当前公告" width="130" align="center">
            <template scope="scope">
              <div v-if="scope.row.is_active&&scope.row.is_published"><font color="red">是</font></div>
              <div v-else-if="scope.row.is_active&&!scope.row.is_published">是</div>
              <div v-else>否</div>
            </template>

          </el-table-column>
            <el-table-column label="操作" min-width="140">
                <template scope="scope">
                    <p class="operation_p">
                        <el-button type="text" class="op_button" @click="operation('edit',scope.row)" :disabled="!hasAccessAuthority(0,scope.row)">修改</el-button>
                        <span class="op_span">|</span>
                        <el-button type="text" class="op_button" @click="operation('publish',scope.row)" :disabled="!hasAccessAuthority(0,scope.row)">通知发布</el-button>
                       <!-- <span class="op_span">|</span>
                        <el-button type="text" class="op_button" @click="operation('msg',scope.row)">通知详情</el-button>-->
                        <el-dropdown trigger="click">
                            <span class="el-dropdown-link more_button">
                                更多
                                <i class="el-icon-caret-bottom el-icon&#45;&#45;right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>
                                  <el-button type="text" style="width: 100%" @click="operation('msgState',scope.row)" :disabled="!hasAccessAuthority(true,scope.row,true)">消息状态</el-button>
                                </el-dropdown-item>
                              <!--<el-dropdown-item>
                                <el-button type="text"  style="width: 100%" @click="operation('setBookList',scope.row)" :disabled="!hasAccessAuthority(0,scope.row)">设置书目录</el-button>
                              </el-dropdown-item>
                              <el-dropdown-item>
                                <el-button type="text"  style="width: 100%" @click="operation('result',scope.row)" :disabled="!hasAccessAuthority(true,scope.row,true)">结果统计</el-button>
                              </el-dropdown-item>
                              <el-dropdown-item>
                                <el-button type="text"  style="width: 100%" @click="operation('setTopic',scope.row)" :disabled="!hasAccessAuthority(0,scope.row,true)">设置选题号</el-button>
                              </el-dropdown-item>
                              &lt;!&ndash;<el-dropdown-item>&ndash;&gt;
                                &lt;!&ndash;<el-button type="text" @click="operation('exportExcel',scope.row)" :disabled="!hasAccessAuthority(0,scope.row,true)">导出学校(Excel)</el-button>&ndash;&gt;
                              &lt;!&ndash;</el-dropdown-item>&ndash;&gt;
                              <el-dropdown-item>
                                <el-button type="text"  style="width: 100%" @click="operation('delete',scope.row)" :disabled="!hasAccessAuthority(0,scope.row,true)">删除</el-button>
                              </el-dropdown-item>-->
                          </el-dropdown-menu>
                      </el-dropdown>
                    </p>
                </template>
            </el-table-column>
        </el-table>
      <div class="pagination-wrapper">
        <el-pagination
          v-if="totalNum>searchForm.pageSize"
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
  props:['product_type','queryName'],
    data() {
        return {
            //product_type: this.$route.query.clinicaltype,

            api_product_list:'/pmpheep/product/list',
            /*api_material_del:'/pmpheep/material/delete',
            api_export_excel:'/pmpheep/excel/published/org',*/
            searchForm:{
              pageSize:20,
              pageNumber:1,
              //isMy:false,
              is_active:'',
              product_type:this.product_type,
              is_published:'',
             // contactUserName:'',
              product_name:'',
            },
            totalNum:0,
            selectValue: 1,
            selectOptions: [{
                value: 1,
                label: '临床申报名称'
            }/*, {
                value: 2,
                label: '联系人'
            }*/],
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
        this.$axios.post(this.api_product_list,this.$commonFun.initPostData(this.searchForm))
          .then(response=>{
            var res = response.data;
            if(res.code==1){
              this.totalNum = res.data.total;
              res.data.rows.map(iterm=>{
                iterm.actualDeadline = this.$commonFun.formatDate(iterm.actualDeadline).split(' ')[0];
                iterm.gmtPublish = this.$commonFun.formatDate(iterm.gmt_publish).split(' ')[0];
                iterm.gmtCreate = this.$commonFun.formatDate(iterm.gmt_create).split(' ')[0];
              });
              this.tableData = res.data.rows;
            }
          })
          .catch(e=>{
            console.log(e);
          })
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
      /*showMoreContact(list){
        this.moreContactUserList = list;
        this.dialogVisible=true;
      },*/
      /**
       * 是否有权限访问
       * @param index 权限表下标
       * @param row 该套教材data
       */
      hasAccessAuthority(index,row,endShow){
        return true;
        /*if(!row.isMy){
          return false;
        }
        //如果传的是boolean类型，就直接返回
        if((typeof index).toLowerCase() == "boolean"){
          return (row.isMy && index || (endShow || !(row.isForceEnd||row.isAllTextbookPublished)));
        }

        let rolesAccessAuthority = this.$commonFun.materialPower(index,row.myPower);

        return (row.isMy && rolesAccessAuthority && (endShow || !(row.isForceEnd||row.isAllTextbookPublished)));*/
      },
      /**
       * 点击操作按钮，
       * * @param type 操作类型，修改：edit, 发布：publish, 通知详情：msg, 消息状态：msgState, 设置书目录：setBookList,
       *                        结果统计：result, 设置选题号：setTopic, 删除：delete, 遴选办理：select
       * * @param materialData  当前教材数据
       */
      operation(type,prodcutData){
        //console.log(materialData)
        switch (type){
          case 'edit':
            this.$router.push({name:'临床决策专家申报',query:{clinicaltype:prodcutData.product_type,product_id:prodcutData.id}});
            //this.$router.push({name:'新建通知',params:{materialId:materialData.id,type:'reEdit'}});
            break;
          /*case 'delete':
            this.delete(materialData.id);
            break;*/
          case 'publish':
            /*if(materialData.materialStep=="编辑通知详情"){
              this.$router.push({name:'编辑通知详情',params:{materialId:materialData.id}});
            }else if(materialData.materialStep=="设置书目录"){
              this.$router.push({name:'设置书目录',params:{materialId:materialData.id}});
            }else{
              this.$router.push({name:'教材申报选择学校',params:{materialId:materialData.id,type:'reEdit'}});
            }*/
            this.$router.push({name:'临床决策申报选择学校',query:{productId:prodcutData.id,product_type:prodcutData.product_type,type:'reEdit'}});
            break;
         /* case 'msg':
            this.$router.push({name:'通知详情',params:{materialId:materialData.id,type:'reEdit'}});
            break;*/
          case 'msgState':
            this.$router.push({name:'消息状态',query:{materialId:prodcutData.id,senderId:prodcutData.founder_id,isProduct:true}});
            break;
         /* case 'setBookList':
            this.$router.push({name:'设置书目录',params:{materialId:materialData.id}});
            break;
          case 'result':
            this.$router.push({name:'结果统计',params:{materialId:materialData.id}});
            break;
          case 'setTopic':
            this.$router.push({name:'设置选题号',params:{materialId:materialData.id}});
            break;*/
          case 'toProcess':
            this.$router.push({name:'临床决策专家申报审核',query:{clinicalTabletype:prodcutData.product_type,product_id:prodcutData.id,queryName:'临床决策专家申报审核',product_name:prodcutData.product_name}});
            //this.$router.push({name:'申报表审核',params:{materialId:materialData.id}});
            break;
          /*case 'exportExcel':
            this.exportExcel(prodcutData.id);
            break;*/
          default:
            throw new error('没有该类型操作');
        }
      },
      /**
       * 删除通知
       * @param id
       */
      /*delete(id){
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

      },*/
      /**
       * 导出学校列表
       * @param id 教材id
       */
      /*exportExcel(id){
        let url = this.api_export_excel+"?materialId="+id
        this.$commonFun.downloadFile(url);
      }*/
    },
    created() {
      /* 是否从首页跳转过来 */
     /* if(this.$route.params.productName){
        this.searchForm.productName=this.$route.params.productName;
      }*/
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
</style>
