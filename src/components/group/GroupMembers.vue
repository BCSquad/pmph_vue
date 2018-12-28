<template>
  <div class="groupmember">
    <el-row>
      <el-col :span="24">
        <div class="disinline pull-left marginB10 ">
          <el-input class="fileinput"
                    placeholder="请输入"
                    icon="search"
                    v-model.trim="searchValue"
                    @keyup.enter.native="search"
                    :on-icon-click="search"
          ></el-input>
        </div>
        <div class="pull-left marginT10 marginL10 marginB10  textcolor">共有{{total}}个成员</div>
        <div class="pull-right clearfix">

          <div class="disinline">
            <excelExport
              :api_export_excel="'/pmpheep/groupMembers/exportExcel'"
              :params="{
                 groupId:this.groupId,
                 name:this.searchedValue,
                 groupName : this.currentGroup.groupName
               }"
              :disabled = "!tableData.length">
              导出Excel
            </excelExport>
          </div>

          <div class="disinline">
            <el-button type="warning" :disabled="idSelected" @click="reviseMagage(false)" v-if="crurrentMemberInfo.isFounder||crurrentMemberInfo.isSystemAdmin">取消管理员</el-button>
          </div>
          <div class="disinline">
            <el-button type="primary" :disabled="idSelected" @click="reviseMagage(true)" v-if="crurrentMemberInfo.isFounder||crurrentMemberInfo.isSystemAdmin">设为管理员</el-button>
          </div>
          <div class="disinline marginL10">
            <el-button type="danger" @click="deleted" :disabled="idSelected" v-if="crurrentMemberInfo.isFounder||crurrentMemberInfo.isSystemAdmin||crurrentMemberInfo.isAdmin">删除</el-button>
          </div>
        </div>
      </el-col>
      <el-col :span="24" class="marginT10">
        <el-table
          ref="multipleTable"
          :data="tableData"
          border
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="displayName"
            label="姓名"
            width="80">
            <template scope="scope">
              <input type="text" class="updateName" v-model="scope.row.displayName" v-on:change="getDisplayName(scope.row.displayName,scope.row.id,scope.row.userId,scope.row.groupId)" v-if="crurrentMemberInfo.isFounder||crurrentMemberInfo.isSystemAdmin"/>
              <input type="text" class="updateName" v-model="scope.row.displayName" v-on:change="getDisplayName(scope.row.displayName,scope.row.id,scope.row.userId,scope.row.groupId)" v-else-if="(crurrentMemberInfo.isAdmin&&scope.row.identity=='成员')||$getUserData().userInfo.id==scope.row.userId">
              <input type="text" class="updateName" v-model="scope.row.displayName" v-on:change="getDisplayName(scope.row.displayName,scope.row.id,scope.row.userId,scope.row.groupId)" v-else-if="crurrentMemberInfo.isWriter&&$getUserData().userInfo.id==scope.row.userId">
              <span v-else>{{scope.row.displayName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="username"
            label="账号"
            width="120">
          </el-table-column>
          <el-table-column
            prop="identity"
            label="身份"
            width="80">
           <!--  <template scope="scope">
              {{scope.row.rank=='1'?'创建人':scope.row.rank=='2'?'管理员':'成员'}}
            </template> -->
          </el-table-column>
          <el-table-column
            prop="position"
            label="职位"
            width="120">
          </el-table-column>
          <el-table-column
            prop="workName"
            label="工作单位"
            min-width="120"
            show-overflow-tooltip>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <div class="pagination-wrapper">
      <el-pagination class="pull-right"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20,30, 50, 100]"
        v-if="total>pageSize"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import excelExport from "components/ExcelExport.vue";
export default {
  props:['groupId','isrefreshMange','crurrentMemberInfo','currentGroup'],
  data() {
    return {
      memberManageUrl:'/pmpheep/group/list/manager',  //成员管理列表url
      changeAuthUrl:'/pmpheep/group/update/identity', //修改管理员权限url
      updateNameUrl:'/pmpheep/group/update/displayName', //修改管理员权限url
      deleteMemberUrl:'/pmpheep/group/delete/pmphGroupMembers', //批量删除url
      tableData:[],
      searchValue:'',
      searchedValue:'',
      selections: [],
      visible: false,
      currentPage: 1,
      pageSize:30,
      total:0,
      isMember:false
    }
  },
  computed: {
    idSelected() {
      if (this.selections.length > 0) {
        return false
      } else {
        return true
      }
    },
  },
  methods: {
    /* 获取成员管理列表 */
    getMemberManageList(){
     this.$axios.get(this.memberManageUrl,{
       params:{
           groupId:this.groupId,
           pageNumber:this.currentPage,
           pageSize:this.pageSize,
           name:this.searchValue,
       }
     }).then((res)=>{
          if(res.data.code==1){
            this.tableData=res.data.data.rows;
            this.total=res.data.data.total;
            this.searchedValue = this.searchValue;
          }
     })
    },
    search(){
      this.currentPage=1;
      this.getMemberManageList();
    },
    /* 切换分页条数 */
    handleSizeChange(val) {
      this.pageSize=val;
      this.currentPage=1;
      this.getMemberManageList();
    },
    /* 点击分页 */
    handleCurrentChange(val) {
      this.currentPage=val;
      this.getMemberManageList();
    },
    handleSelectionChange (val) {
      this.selections = val

    },
    // 批量修改管理员
    reviseMagage(bool){
       var subArr=[];
       this.selections.forEach((item)=>{
         var obj ={};
         obj.id=item.id;
         obj.isAdmin=bool;
         subArr.push(obj);
       })
       this.$axios({
         method:'PUT',
         url:this.changeAuthUrl,
         data:this.$initPostData({
             pmphGroupMembers:JSON.stringify(subArr),
             sessionId:this.$getUserData().sessionId,
             groupId:this.groupId
         })
       }).then((res)=>{
               if(res.data.code==1){
                 this.$message.success('修改成功')
                 this.$emit('refeshMember');
                 this.getMemberManageList();
               }else{
                 this.$confirm(res.data.msg.msgTrim(), "提示",{
                 	confirmButtonText: "确定",
                 	cancelButtonText: "取消",
                 	showCancelButton: false,
                 	type: "error"
                 });
               }
         })
    },
    // 批量删除
    deleted () {
      this.$confirm("确定删除该小组成员?", "提示",{
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(()=>{
          var ids='';
          this.selections.forEach(function(item){
            ids+=item.id+',';
          })
          ids=ids.slice(0,-1);

          this.$axios({
            method:'PUT',
            url:this.deleteMemberUrl,
            data:this.$commonFun.initPostData({
              ids:ids,
              sessionId:this.$getUserData().sessionId,
              groupId:this.groupId
            })
          }).then((res)=>{
            if(res.data.code==1){
              this.$message.success('删除成功')
              this.$emit('refeshMember');
              this.getMemberManageList();
            }else{
              this.$confirm(res.data.msg.msgTrim(), "提示",{
              	confirmButtonText: "确定",
              	cancelButtonText: "取消",
              	showCancelButton: false,
              	type: "error"
              })
            }
          })
            .catch((error) => {
              console.log(error);
              this.$confirm('删除失败，请重试', "提示",{
              	confirmButtonText: "确定",
              	cancelButtonText: "取消",
              	showCancelButton: false,
              	type: "error"
              });
            });
        })
        .catch(e=>{})
    },
    getDisplayName:function(value,id,userId,groupId){
      //alert(value);
      this.$axios({
        method:'POST',
        url:this.updateNameUrl,
        data:this.$commonFun.initPostData({
          id:id,
          userId:userId,
          sessionId:this.$getUserData().sessionId,
          displayName:value,
          groupId:groupId
        })
      }).then((res)=>{
          if(res.data.code==1){
            this.$message.success('修改成功')
            // this.$emit('refeshMember');
            // this.getMemberManageList();
          }else{
            this.$confirm('修改失败', "提示",{
            	confirmButtonText: "确定",
            	cancelButtonText: "取消",
            	showCancelButton: false,
            	type: "error"
            });
          }
        }).catch((error) => {
          console.log(error);
          this.$confirm('修改失败，请重试', "提示",{
          	confirmButtonText: "确定",
          	cancelButtonText: "取消",
          	showCancelButton: false,
          	type: "error"
          });
        })

    }
  },
  watch:{
    groupId(newVal){
        this.getMemberManageList();
    },
    isrefreshMange(){
      this.getMemberManageList();
    }
  },
  created(){
    this.getMemberManageList();

    if(window._hmt){
      _hmt.push(['_trackPageview', '/group/group-members']);
    }
  },
  components:{excelExport}
}
</script>

<style>
  .groupmember{
    padding:20px 30px;
    height: 100%;
    overflow: auto;
    box-sizing: border-box;
  }
  .disinline{
    display: inline-block;
  }
  .textcolor{
    color: rgba(2, 2, 2, 0.29);
  }
  .updateName{
    border: none;
    /* min-width: 1em; */
    /* max-width: 4em; */
    padding: 0.2em 0.5em;
    width: 100%;
  }
</style>
