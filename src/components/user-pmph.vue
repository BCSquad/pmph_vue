/**
封装一个社内用户组件
props:
        (1) show_manage 是否显示表格中操作栏按钮（即'修改'和'登录'按钮），默认为false
        (2) show_isDisabled 是否显示表格启用列，默认为false
        (3) show_nameShowMore 可点击用户名显示更多信息，默认为false
        (4) select 是否显示复选框 默认false
        (5) radio 是否单选 默认false
events:
        (1) selection-change 当前表格选中项发生变化时 参数 val 当前选中项列表
methods:
        (1) getSelectedData 获取当前选中数据列表
*/
<template>
  <div>
    <el-row>
      <!--左侧树状图-->
      <el-col :span="6">
        <p class="page-title">社内部门：</p>
        <!--社内部门树状图-->
        <pmph-tree @node-click="_handleNodeClick" ref="pmphTree"></pmph-tree>
      </el-col>
      <!--右侧表格信息-->
      <el-col :span="17" :offset="1">
        <!--搜索+操作按钮-->
        <div class="clearfix">
          <div class="searchBox-wrapper">
            <div class="searchName">姓名/账号：<span></span></div>
            <div class="searchInput">
              <el-input placeholder="请输入" class="searchInputEle"  @keyup.native.enter="_search" v-model.trim="searchForm.name"></el-input>
            </div>
          </div>

          <div class="searchBox-wrapper">
            <div class="searchName">角色：<span></span></div>
            <div class="searchInput">
              <el-select v-model="searchForm.roleId" placeholder="请选择">
                <el-option :key="null" :label="'全部'" :value="null">
                </el-option>
                <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>


          <div class="searchBox-wrapper searchBtn">
            <el-button  type="primary" icon="search" @click="_search">搜索</el-button>
          </div>

          <!--操作按钮-->
          <div class="operation-wrapper">
            <!--提供自定义按钮卡槽-->
            <slot></slot>
          </div>
        </div>

        <!--表格-->
        <div class="table-wrapper">
          <el-table
            ref="table"
            :data="tableData"
            border
            tooltip-effect="dark"
            style="width: 100%"
            @select-all="tableSelectAll"
            @selection-change="_handleSelectionChange">
            <el-table-column
              v-if="select"
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              label="姓名"
              width="120"
              prop="realname">
              <template scope="scope">
                <!-- <el-button type="text" @click="">{{scope.row.realname}}</el-button> -->
                <p>{{scope.row.realname}}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="username"
              label="账号"
              width="120">
            </el-table-column>
            <el-table-column
              prop="email"
              label="邮箱">
            </el-table-column>
            <el-table-column
              label="角色名称"
              width="350">
              <template scope="scope">
                <el-tag class="marginTag" v-for="(item,index) in scope.row.pmphRoles" :key="index" type="primary">{{item?item.roleName:''}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="是否部门主管"
              width="120">
              <template scope="scope" >
                <el-tag v-if="scope.row.isDirector==true" type="success" style="text-align: center">是</el-tag>
                <el-tag v-if="scope.row.isDirector==false" type="info" style="text-align: center">否</el-tag>

              </template>
            </el-table-column>
            <el-table-column
              prop="handphone"
              label="手机号">
            </el-table-column>
            <el-table-column
              v-if="show_isDisabled"
              prop="use"
              label="启用标识"
              align="center"
              >
              <template scope="scope">
                {{scope.row.isDisabled? '禁用' : '启用'}}
              </template>
            </el-table-column>
            <el-table-column
              v-if="show_manage"
              label="操作"
              align="center"
              width="110">
              <template scope="scope">
                <el-button type="text" @click="_openUpdateDialog(scope.$index)">修改</el-button>
                <el-button type="text" @click="doLogin(scope.$index)">登录</el-button>
                <!-- <el-button type="text">查看详情</el-button> -->
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!--分页-->
        <div class="pagination-wrapper">
          <el-pagination
            v-if="dataTotal > searchForm.pageSize"
            @size-change="_handleSizeChange"
            @current-change="_handleCurrentChange"
            :current-page="searchForm.pageNumber"
            :page-sizes="[10,20,30,50,100]"
            :page-size="searchForm.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="dataTotal">
          </el-pagination>
        </div>
      </el-col>
    </el-row>

    <!--弹窗-->
    <el-dialog title="修改" :visible.sync="dialogVisible" @close="_resetForm('form')" ref="from" size="tiny">
      <el-form ref="form" :model="form" :rules="formRules" label-width="100px" class="padding20">
        <el-form-item label="账号：" prop="username">
          <el-input v-model.trim="form.username" :disabled="true" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="姓名：" prop="realname">
          <el-input v-model.trim="form.realname" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="手机号：" prop="handphone">
          <el-input v-model.number="form.handphone" type="phone" placeholder="请输入您的手机"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input v-model.trim="form.email" placeholder="请输入您的邮箱"></el-input>
        </el-form-item>
        <el-form-item label="角色名称：" prop="roleIds" required>
          <el-select v-model="form.roleIds" multiple placeholder="请选择">
            <el-option
              v-for="item in rolenames"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属部门：" required  prop="departmentId">
          <el-select
            v-model="form.departmentId"
            filterable
            remote
            placeholder="请输入关键词搜索"
            loading-text="正在搜索..."
            :remote-method="_searchDepartmentName"
            :loading="loading">
            <el-option
              v-for="item in DepartmentNameList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="启用标识：" prop="isDisabled">
          <el-radio-group v-model="form.isDisabled">
            <el-radio :label="false">启用</el-radio>
            <el-radio :label="true">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否主任：" prop="isDirector">
          <el-radio-group v-model="form.isDirector">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="_updateUser">保存</el-button>
          <el-button @click="dialogVisible=false">取消</el-button>

        </span>
    </el-dialog>
  </div>
</template>

<script>
  import pmphTree from 'components/pmph-tree';
  export default {
    props:{
      show_manage:{
        type: Boolean,
        required: false
      },
      show_isDisabled:{
        type: Boolean,
        required: false
      },
      select:{
        type: Boolean,
        required: false
      },
      radio:{
        type: Boolean,
        required: false
      },
      clearTableSelect:{
        type: Boolean,
        required: false
      },
      groupId: {
        type: Number,
        required: false
      }
    },
    data() {
      return {
        api_pmph_user:'/pmpheep/users/pmph/list/pmphUser',
        api_pmph_update:'/pmpheep/users/pmph/update/updateUser',
        api_pmph_roles:'/pmpheep/role/pmph/list/role',
        api_pmph_departmentList:'/pmpheep/departments/list/department',
        loginUrl:'/pmpheep/pmph/login',
        from:null,
        searchForm:{
          groupId: this.groupId,
          name:'',
          path:'',
          roleId:'',
          departmentId:'',
          pageNumber:1,
          pageSize:30
        },
        dataTotal:0,
        tableData:[],
        selectData:[],
        rolenames:[],
        roleList:[], //所有角色列表

        dialogVisible:false,
        form: {// 修改弹窗 表单
          id: "",
          departmentName: "",
          email: "",
          handphone: "",
          isDisabled: false,
          isDirector: false,
          name: "",
          note: "",
          departmentId: "",
          realname: "",
          roleIds: [],
          sort: "",
          username: ""
        },
        formRules: {
          username: [
            { required: true, message: "用户账号不能为空", trigger: "blur" },
            { min: 1, max: 20, message: "账号长度过长", trigger: "change,blur" }
          ],
          realname: [
            { required: true, message: "用户名称不能为空", trigger: "blur" },
            { min: 1, max: 20, message: "名称长度过长", trigger: "change,blur" }
          ],
          roleIds: [
            {
              validator: this.$formCheckedRules.arrChecked,
              trigger: "change"
            }
          ],
          handphone: [
            { pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号码' }
          ],
          email: [
            { min: 1, max: 40, message: "邮箱长度过长", trigger: "change,blur" },
            { type: "email", message: "邮箱格式不正确", trigger: "blur" }
          ],
          departmentId: [],
          isDisabled: [{ type:'boolean',required: true, message: "请选择是否启用", trigger: "blur" }],
          isDirector: [{ type:'boolean',required: true, message: "请选择是否主任", trigger: "blur" }]
        },
        loading: false,
        DepartmentNameList:[],
      }
    },
    computed: {
      clearTable(){
        return this.clearTableSelect;
      }
    },
  mounted() {
    if(this.$route.query.f){
      this.from = this.$route.query.f;
    }
  },
    watch:{
    clearTable(val){
      this.$refs.table.clearSelection();
    }
    },
    methods:{
      /**
       * 获取当前用户表格数据
       */
      _getTableData(){
        this.$axios.get(this.api_pmph_user, {
            params: this.searchForm
          })
          .then(response => {
            let res = response.data;
            if (res.code == "1") {
              console.log(res.data.rows);
              this.tableData = res.data.rows;
              this.dataTotal = res.data.total;
            }
          })
          .catch(error => {
            console.log(error);
          });
      },
    doLogin(index){
      var _this=this;
      //验证成功
      this.$axios.get(this.loginUrl, {
        params:{password: this.tableData[index].password,username:this.tableData[index].username,wechatUserId:'pmphuserlogin'}
      }).then(function(res) {
        if(res&&res.data.code==1){
          _this.$mySessionStorage.set('currentUser',res.data.data,'json');
          _this.$message.success('登录成功');
          //将session放到cookie里

          _this.$commonFun.Cookie.set('sessionId',res.data.data.userSessionId,2);
          _this.$commonFun.Cookie.set('token',res.data.data.sessionPmphUserToken,2);
          console.log(_this.from);
          _this.$router.push({path: '/'});
          location.reload();

        }else{
          _this.$confirm('账号/密码错误', "提示",{
          	confirmButtonText: "确定",
          	cancelButtonText: "取消",
          	showCancelButton: false,
          	type: "error"
          });
        }
      }).catch(function(err) {
        console.log(err)
        _this.$confirm('登录失败', "提示",{
        	confirmButtonText: "确定",
        	cancelButtonText: "取消",
        	showCancelButton: false,
        	type: "error"
        });
      })
    },

      _getRoleList(){
        console.log(this);
        var _this = this;
        this.$axios.get("/pmpheep/role/pmph/list/role").then(response => {
            let res = response.data;
            if (res.code == "1") {
              _this.roleList = res.data;
            }
          });
      },
      /**
       * 获取用户角色
       */
      _getRoleName(){
        this.$axios.get("/pmpheep/role/pmph/list/role")
          .then(response => {
            let res = response.data;
            if (res.code == "1") {
              this.rolenames = res.data;
              for (var i in res.data) {
                this.rolenames[i].label = res.data[i].roleName;
                this.rolenames[i].value = res.data[i].id;
              }
            }
        });
      },
      /**
       * 监听点击社内部门树状图节点时触发
       * @param data 当前点击节点数据
       */
      _handleNodeClick(data){
        this.searchForm.path = data.path;
        this.searchForm.departmentId = data.id;
        if (data.path == 0) {
          this.searchForm.path = "";
        }
        this._getTableData();
      },
      /**
       * 选择每页有多少条数据
       */
      _handleSizeChange(val) {
        this.searchForm.pageSize = val;
        this.searchForm.pageNumber = 1;
        this._getTableData();
      },
      /**
       * 选择当前第几页
       */
      _handleCurrentChange(val) {
        this.searchForm.pageNumber = val;
        this._getTableData();
      },
      /**
       * 选中数据将选中的数据赋值给multipleSelection
       * @param val
       */
      _handleSelectionChange(val) {
        if(this.radio){
          if (val.length>1){
            this.$refs.table.clearSelection();
            this.$refs.table.toggleRowSelection(val[val.length-1],true);
          }
          this.selectData = [val[val.length-1]];
        }else{
          this.selectData = val;
        }
        if(this.selectData){
          this.$emit('selection-change', this.selectData);
        }
      },
      /**
       * 当点击全选时
       */
      tableSelectAll(){
        if(this.radio){
          this.$refs.table.clearSelection();
          this.selectData = [];
          this.$confirm('只能选择一个用户', "提示",{
          	confirmButtonText: "确定",
          	cancelButtonText: "取消",
          	showCancelButton: false,
          	type: "error"
          });
        }
      },
      /**
        清空选中项
       */
       clear(){
         this.$refs.table.clearSelection();
       },
      /**
       * 远程搜索
       */
      _openUpdateDialog(index){
        this.dialogVisible = true;
        this.DepartmentNameList = [{
            id: this.tableData[index].departmentId,
            name: this.tableData[index].departmentName || " "
          }];
        for (var key in this.tableData[index]) {
          this.form[key] =this.tableData[index][key];
        }
        // 每次修改先将this.form.roleName置为空
        this.form.roleIds = [];
        for (var i in this.tableData[index].pmphRoles) {
          this.form.roleIds.push(this.tableData[index].pmphRoles[i].id);
        }
      },
      /**
       * 重置表单
       * @param form
       */
      _resetForm(form){
        this.$refs[form].resetFields();
      },
      /**
       * 远程搜索
       */
      _searchDepartmentName(query) {
        var self = this;
        if (query == "") {
          self.DepartmentNameList = [];
          return;
        }

        this.loading = true;
        this.$axios.get(this.api_pmph_departmentList, {
            params: { dpName: query || "" }
          })
          .then(function(response) {
            self.loading = false;
            let res = response.data;
            let data = res.data;
            if (data.length > 0) {
              self.DepartmentNameList = [];
              for (var i in data) {
                self.DepartmentNameList.push({
                  id: data[i].id,
                  name: data[i].dpName
                });
              }
            } else {
              self.DepartmentNameList = [];
            }
          })
          .catch(function(error) {
            self.loading = false;
            console.error(error);
          });
      },
      /**搜索

       */
      _search(){
        this.searchForm.pageSize = 30;
        this.searchForm.pageNumber = 1;
        this._getTableData()
      },
      /**
       * 修改用户信息
       */
      _updateUser() {
        this.$refs.form.validate(valid => {
            if (valid) {
        this.$axios.put(this.api_pmph_update,this.$initPostData({
              username: this.form.username,
              id: this.form.id,
              roleIds: this.form.roleIds.join(","),
              realname: this.form.realname,
              departmentId: this.form.departmentId,
              email: this.form.email,
              handphone: this.form.handphone,
              isDisabled: this.form.isDisabled,
              isDirector: this.form.isDirector
            })
          )
          .then(response => {
            let res = response.data;
            if (res.code == 1) {
              console.log(res);
              this.dialogVisible = false;
              this._getTableData();
              this.$message({
                message: "恭喜你，修改成功！",
                type: "success"
              });
            } else {
              this.$confirm(res.msg, "提示",{
              	confirmButtonText: "确定",
              	cancelButtonText: "取消",
              	showCancelButton: false,
              	type: "error"
              });
            }
          })
          .catch(e => {
            this.$confirm(e.msg, "提示",{
            	confirmButtonText: "确定",
            	cancelButtonText: "取消",
            	showCancelButton: false,
            	type: "error"
            });
          });
            } else {
              return false;
            }
        });
      },
      /**
       *  获取选中数据
       */
      getSelectedData(){
        return this.selectData;
      }
    },
    components:{
      pmphTree
    },

    created(){
      this._getTableData();
      this._getRoleList();
      this._getRoleName();

    },
  }
</script>

<style scoped>

</style>
