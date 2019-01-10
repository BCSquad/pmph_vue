<template>
  <div class="searchKey_words">

    <p class="header_p">
      <span>站点名称：</span>
      <el-input class="input" placeholder="请输入" v-model="searchParams.name" @keyup.enter.native="search"></el-input>
      <el-button type="primary" icon="search" @click="search">搜索</el-button>
      <el-button type="danger" style="float:right;" @click="deleteSearchKey">删除</el-button>
      <el-button type="primary" style="float:right;" @click="openEditDialog(false)">增加</el-button>
    </p>
    <el-table :data="tableData" class="table-wrapper" border style="width:100%;"
     @selection-change="handleSelectionChange"
    >
      <el-table-column
      type="selection"
      width="45">
      </el-table-column>

        <el-table-column label="站点名称" prop="name">
          <template scope = "scope">
            <div style="padding:5px;float:left;width: 100%;">
              <span style="float:left;display: inline-block;line-height: 32px;">{{scope.row.name}}</span>
              <div style="display:inline-block;float: right;">
                <i class="sort-arrow el-icon-arrow-up" title="行内上移" @click="sortMove(scope.row.id,1)"></i>
                <i class="sort-arrow el-icon-arrow-down" title="行内下移" @click="sortMove(scope.row.id,0)"></i>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="站点地址" prop="href"></el-table-column>
        <el-table-column label="行序" prop="rowNum" width="80"></el-table-column>
        <!--<el-table-column label="添加时间" width="175">
          <template scope="scope">
            {{$commonFun.formatDate(scope.row.gmtCreate)}}
          </template>
        </el-table-column>-->

        <el-table-column label="启用标志" width="100" >
          <template scope="scope">
            {{scope.row.isActive?'启用':'禁用'}}
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="note"></el-table-column>
        <el-table-column label="操作" width="80" >
          <template scope="scope">
             <el-button type="text" @click="openEditDialog(true,scope.row)">修改</el-button>

          </template>
        </el-table-column>
    </el-table>
          <!--分页-->
    <div class="pagination-wrapper">
      <el-pagination
        v-if="pageTotal>searchParams.pageSize"
        @size-change="HandleSizeChange"
        @current-change="HandleCurrentChange"
        :current-page="searchParams.pageNumber"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="searchParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageTotal">
      </el-pagination>
    </div>

    <!-- 增加修改弹框 -->
    <el-dialog
    :title="isEdit?'修改':'新增'"
    :visible.sync="dialogVisible"
      size="tiny">
      <el-form :model="dialogForm" ref="dialogForm" :rules="rules" label-width="110px" class="dialog_from">
        <el-form-item label="站点名称：" prop="name">
           <el-input placeholder="请输入站点名称"  v-model="dialogForm.name"></el-input>
        </el-form-item>
        <el-form-item label="站点地址：" prop="href">
           <el-input placeholder="请输入站点地址"  v-model="dialogForm.href"></el-input>
        </el-form-item>
        <el-form-item label="所在行序：" prop="rowNum">
          <el-input placeholder="请输入所在行序"  v-model="dialogForm.rowNum"></el-input>
        </el-form-item>
        <!-- <el-form-item label="发表时间：">
           <el-date-picker
            v-model="dialogForm.data"
            type="datetime"
            style="width:100%"
            placeholder="请选择发表时间">
          </el-date-picker>
        </el-form-item> -->
        <el-form-item label="备注：" prop="note">
          <el-input type="textarea" v-model="dialogForm.note" :rows="3" placeholder="请填写备注"></el-input>
        </el-form-item>
        <el-form-item label="启用：" prop="isActive">
           <el-select v-model="dialogForm.isActive" placeholder="请选择">
              <el-option label="启用" :value="true"></el-option>
              <el-option label="禁用" :value="false"></el-option>
            </el-select>
        </el-form-item>
        </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogSubmit">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>

      </span>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
    export default{
      data(){
        return{
          searchKeyListUrl:'/pmpheep/SiteLink/list' ,  //搜索站点列表url
          editSearchKeyUrl:'/pmpheep/SiteLink/update',   //修改搜索站点url
          addSearchKeyUrl:'/pmpheep/SiteLink/add' ,  //新增搜索站点url
          deleteSearchKeyUrl:'/pmpheep/SiteLink/isDeleted',   //删除搜索站点url
          sortMoveUrl:'/pmpheep/SiteLink/sortMove', //上下移
          tableData:[],
          pageTotal:100,
          keywordNum:7,
          searchParams:{
             pageSize:10,
             pageNumber:1,
             name:''
          },
          dialogForm:{
              name:'',
            href:'',
            rowNum:'',
              note:'',
            isActive:''
          },
          deleteIds:[],
          dialogVisible:false,
          isEdit:false,
          rules:{
             name:[
              {required:'true',message:'站点名称不能为空',trigger:'blur'},
              {min:1,max:50, message: "站点名称不能超过50个字符", trigger: "change,blur" }
             ],
            href:[
              {min:1,max:200, message: "站点地址不能超过200个字符", trigger: "change,blur" }
            ],
            rowNum:[
              {required:'true',message:'所在行号不能为空',trigger:'change,blur'},
              {min:1,max:3, message: "所在行号不能超过3个字符", trigger: "change,blur" },
              {validator:this.$formCheckedRules.numberChecked,trigger: "change,blur"}
            ],
             sort: [
              {min:1,max:10, message: "显示顺序不能超过10个字符", trigger: "change,blur" },
              {validator:this.$formCheckedRules.numberChecked,trigger: "blur"}
            ],
            note:[

            ],
            isActive:[
              {required:'true',type:'boolean',message:'请选择是否启用',trigger:'change'}
            ]
          }
        }
      },
      created(){
         this.getList();
      },
      methods:{
        /* 获取搜索站点列表 */
        getList(){
          this.$axios.get(this.searchKeyListUrl,{
            params:this.searchParams
          }).then((res)=>{
            console.log(res);
            if(res.data.code==1){
              this.tableData=res.data.data.rows;
              this.pageTotal=res.data.data.total;
            }
          })
        },
        /* 搜索按钮 */
        search(){
         this.searchParams.pageNumber=1;
         this.getList();
        },
        /* 打开编辑对话框 修改或新增 */
        openEditDialog(bool,obj){
          this.isEdit=bool;
          if(bool){
            this.dialogForm.id=obj.id;
            this.dialogForm.name=obj.name;
            this.dialogForm.href=obj.href+'';
            this.dialogForm.rowNum=obj.rowNum+'';
            this.dialogForm.note=obj.note?obj.note:"";
            this.dialogForm.isActive=obj.isActive;
          }else{
            this.dialogForm={
                    name:'',
                    sort:'',
                    note:'',
                    isActive:false
                    }
          }
          this.dialogVisible=true;

        },
        /* 修改或新增提交 */
        dialogSubmit(){
          this.$refs.dialogForm.validate((valid)=>{
            if(valid){
              if(this.isEdit){
                /* 修改 */
                this.$axios.put(this.editSearchKeyUrl,this.$commonFun.initPostData(this.dialogForm))
                .then((res)=>{
                   if(res.data.code==1){
                       this.$message.success('修改成功')  ;
                       this.getList();
                       this.dialogVisible=false;
                   }else{
                     this.$confirm(res.data.msg.msgTrim(), "提示",{
                     	confirmButtonText: "确定",
                     	cancelButtonText: "取消",
                     	showCancelButton: false,
                     	type: "error"
                     });
                   }
                }).catch((error)=>{})
              }else{
                /* 新增 */
                this.$axios.post(this.addSearchKeyUrl,this.$commonFun.initPostData(this.dialogForm))
                .then((res)=>{
                   if(res.data.code==1){
                     this.$message.success('新增成功')  ;
                     this.getList();
                     this.dialogVisible=false;
                   }else{
                     this.$confirm(res.data.msg.msgTrim(), "提示",{
                     	confirmButtonText: "确定",
                     	cancelButtonText: "取消",
                     	showCancelButton: false,
                     	type: "error"
                     });
                   }
                }).catch((error)=>{})
              }
            }else{
              return;
            }
          })
        },
        sortMove(id,up){
          this.$axios.get(this.sortMoveUrl,{params:{
              up:up,id:id
            }}).then((res) => {
            if(res.data.code==1){
              this.getList();
            }else{
              this.$confirm(res.data.msg.msgTrim(), "提示",{
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                showCancelButton: false,
                type: "info"
              });
            }
          })


        },
        deleteSearchKey(){
         if(this.deleteIds.length!=0){
            this.$confirm('确定删除选中的友情链接吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
              }).then(() => {
                 this.$axios.delete(this.deleteSearchKeyUrl,{
                   params:{
                     ids:this.deleteIds.join(',')
                   }
                 }).then((res)=>{
                   if(res.data.code==1){
                     this.$message.success('已成功删除');
                     this.getList();
                   }else{
                     this.$confirm(res.data.msg.msgTrim(), "提示",{
                     	confirmButtonText: "确定",
                     	cancelButtonText: "取消",
                     	showCancelButton: false,
                     	type: "error"
                     });
                   }
                 })
              }).catch(() => {
                /*this.$message({
                  type: 'info',
                  message: '已取消操作'
                });*/
            });
         }else{
           this.$confirm('请至少选中一个搜索链接', "提示",{
           	confirmButtonText: "确定",
           	cancelButtonText: "取消",
           	showCancelButton: false,
           	type: "error"
           });
         }
        },
        /*table选中切换  */
        handleSelectionChange(val){
          this.deleteIds=[];
            for(var i in val){
              this.deleteIds.push(val[i].id);
            }
            console.log(this.deleteIds);

        },
        HandleSizeChange(val){
         this.searchParams.pageSize=val;
         this.searchParams.pageNumber=1;
         this.getList();
        },
        HandleCurrentChange(val){
          this.searchParams.pageNumber=val;
          this.getList();
        }
      }
    }
</script>
<style scoped>
.searchKey_words .header_p {
  overflow: hidden;
}
.searchKey_words .header_p .input {
  width: 190px;
  margin-right: 10px;
}
.searchKey_words  .dialog_from .input{
  width:80%;
}
i.sort-arrow {
  clear: right;
  float: right;
  display: block;
  border: 1px solid #d4d9dd;
  color: #d4d9dd;
  height: 12px;
  width: 16px;
  text-align: center;
  padding: 1px;
  cursor: pointer;
}
i.sort-arrow:hover {
  background-color: #ffffff;
}
i.sort-arrow:active {
  background-color: #d4d9dd;
}
.sort-arrow.el-icon-arrow-up{
  border-radius: 4px 4px 0px 0px;
}
.sort-arrow.el-icon-arrow-down{
  border-radius: 0px 0px 4px 4px;
}

</style>
