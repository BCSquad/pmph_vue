<template>
    <div class="system_roles">
        <div class="roles_list">
            <h4>角色列表</h4>
            <p>
                <el-input class="input" v-model.trim="searchValue"  placeholder="请输入" @keyup.enter.native="getListData()"></el-input>
                <el-button type="primary" icon="search" @click="getListData()">搜索</el-button>
                <el-button type="primary pull-right" @click="addNewRoles()">增加</el-button>
            </p>

            <el-table :data="rolesListData" class="table-wrapper" border>
                <el-table-column prop="roleName" label="角色名称">
                </el-table-column>
                <el-table-column prop="sort" label="显示顺序">
                </el-table-column>
                <el-table-column prop="isDisabled" label="启用标识" >
                    <template scope="scope">
                        <p v-if="!scope.row.isDisabled">启用</p>
                        <p v-if="scope.row.isDisabled">禁用</p>
                    </template>
                </el-table-column>
                <el-table-column prop="note" label="备注">
                </el-table-column>
                <el-table-column label="操作" width="220">
                    <template scope="scope">
                        <el-button type="text" :disabled="scope.row.roleName=='系统管理员'||scope.row.roleName=='sso登录默认角色'?true:false"  @click="reviseRoles(scope.row)">修改</el-button>
                        <!-- <span style="line-height:16px">|</span> -->
                        <el-button type="text" :disabled="scope.row.roleName=='系统管理员'||scope.row.roleName=='sso登录默认角色'?true:false" @click="updatePower(scope.row)">权限设置</el-button>
                        <el-button type="text" @click="openSeeDialog(scope.row)">查看权限</el-button>
                        <!-- <span style="line-height:16px">|</span> -->
                        <!-- <el-button type="text" @click="deleteRole(scope.row)">删除</el-button> -->
                    </template>
                </el-table-column>
            </el-table>

        </div>
        <!-- 新增对话框 -->
        <el-dialog :title="isAddNewRole?'新增角色':'修改角色'" :visible.sync="rolesDialogVisible" :before-close="resetDialogForm"   class="roles_dialog" size="tiny">
            <div style="padding-right:30px;" >

                <el-form ref="rolesForm" :model="rolesForm" :rules="rolesFormRules"  label-width="110px">
                    <el-form-item label="角色代码："  prop="id" v-if="!isAddNewRole">
                        <el-input v-model.trim="rolesForm.id" :disabled="true" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="角色名称：" prop="roleName">
                        <el-input v-model.trim="rolesForm.roleName" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="启用标识：" prop="isDisabled">
                        <el-radio-group v-model="rolesForm.isDisabled">
                          <el-radio :label="false">启用</el-radio>
                          <el-radio :label="true">禁用</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="显示顺序：" prop="sort">
                        <el-input v-model.trim="rolesForm.sort" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="备注：" prop="note">
                        <el-input v-model.trim="rolesForm.note" placeholder="请输入"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="rolesSubmit()">确 定</el-button>
                <el-button @click="resetDialogForm()">取 消</el-button>

            </span>
        </el-dialog>
        <!-- 权限树弹框 -->
        <el-dialog :title="isSeePower?'查看角色权限':'角色权限设置'" :visible.sync="powerTreeVisible" size="tiny">
          <div style="width:100%;overflow:hidden;">
            <div style="width:100%;float:left;">
              <span style="font-weight:bold;font-size:14px;">{{isSeePower?'菜单栏可见性权限':'菜单栏可见性权限设置'}}</span>
                <transition name="fade" mode="out-in">
                <el-tree class="tree_box" ref="powerTree"
                 style="margin:10px 0;box-sizing:border-box;"
                 :data="treeData"
                show-checkbox node-key="id" :props="defaultProps"
                v-if="powerTreeVisible"
                :default-checked-keys="defaultCheckedData"
                ></el-tree>
                </transition>
            </div>

            <!-- <div style="width:48%;float:right;">
              <span style="font-weight:bold;">{{isSeePower?'教材申报权限':'教材申报权限设置'}}</span>
                <transition name="fade" mode="out-in">
                <el-tree class="tree_box" ref="teachTree"
                 style="margin:10px 0;"
                 :data="teachTreeData"
                show-checkbox node-key="id" :props="defaultProps"
                v-if="powerTreeVisible"
                :default-checked-keys="defaultTeachData"
                ></el-tree>
                </transition>
            </div> -->
            </div>

            <span slot="footer" class="dialog-footer" v-if="!isSeePower">
              <el-button type="primary" @click="reviseSubmit()">确 定</el-button>
              <el-button @click="powerTreeVisible = false">取 消</el-button>
            </span>
            <span v-else style="color:#ff4949">tips：勾选中的即为当前角色拥有权限</span>
        </el-dialog>
    </div>
</template>
<script type="text/javascript">
export default {
  data() {
    return {
      listUrl: "/pmpheep/role/pmph/list", //列表数据接口
      revisePowerUrl: "/pmpheep/role/pmph/resource", //更新权限接口
      addRoleUrl: "/pmpheep/role/pmph/add", //添加角色接口
      editRoleUrl: "/pmpheep/role/pmph/update", //修改角色接口
      deleteRoleUrl:'',   //删除角色url
      searchValue: "",
      rolesListData: [],
      rolesDialogVisible: false,
      isSeePower:false,
      rolesForm: {
        id: "",
        roleName: "",
        isDisabled: false,
        sort: '',
        note: ""
      },
      isAddNewRole: true,
      rolesFormRules: {
        id: [{type:'number' ,required: true, message: "请输入角色代码", trigger: "blur" }],
        roleName: [
             { required: true, message: "请输入角色名称", trigger: "blur" },
            {min:0,max:20,message:'角色名称不能超过20个字符',trigger: "change,blur"}
            ],
        isDisabled: [{type:'boolean', required: true, message: "请选择", trigger: "change" }],
        sort: [
            {min:1,max:10, message: "显示顺序不能超过10个字符", trigger: "change,blur" },
            {validator:this.$formCheckedRules.numberChecked,trigger: "blur"}
            ],
        note:[
            {min:0,max:20,message:'备注不能超过20个字符',trigger: "change,blur"}
        ]
      },
      powerTreeVisible: false,
      defaultCheckedData: [],
      defaultTeachData:[],
      revisePowerId: "", //更新角色的id
      teachTreeData:[
          {
              label:'修改教材通知',
              id:0
            },
            {
              label:'分配策划编辑',
              id:1
            },
            {
              label:'遴选主编副主编',
              id:2
            },
            {
              label:'遴选编委',
              id:3
            },
            {
              label:'名单确认',
              id:4
            },
            {
              label:'最终结果公布',
              id:5
            },
            {
              label:'创建小组',
              id:6
            },
            {
              label:'强制结束整套教材',
              id:7
            },
      ],
      treeData: [
        {
          label: "个人中心（首页）",
          id: 1,
          disabled:true
        },
        {
          label: "教材申报",
          id: 2,
        },{
          label: "调研表",
          id: 52,
          children: [
            {
              label: "调研表模板管理",
              id: 53
            },{
              label: "调研表发布管理",
              id: 54
            },{
              label: "教材相关调研统计",
              id: 55
            },{
              label: "其他调研统计",
              id: 56
            }
          ]
        },{
          label: "临床决策",
          id: 44,
          children: [
            {
              label: "临床助手申报",
              id: 45
            },{
              label: "用药助手申报",
              id: 46
            },{
              label: "中医助手申报",
              id: 47
            },/*{
              label: "临床助手申报表",
              id: 49
            },{
              label: "用药助手申报表",
              id: 50
            },{
              label: "中医助手申报表",
              id: 51
            },*/{
              label: "申报分类维护",
              id: 48
            }
          ]
        },
        {
          label: "我的小组",
          id: 3
        },
        {
          label: "系统消息",
          id: 4
        },
        {
          label:"师资培训",
          id:57,
          children:[
            {
              label:"活动管理",
              id:58
            }
          ]
        },
        {
          label: "内容管理",
          id: 5,
          children: [
            {
              label: "文章管理",
              id: 15
            },
            {
              label: "信息快报管理",
              id: 16
            },
            {
              label: "公告管理",
              id: 17
            },
            {
              label: "广告管理",
              id: 18
            },
            {
              label: "敏感词管理",
              id: 40
            },
            {
              label: "帮助管理",
              id: 42
            }
          ]
        },
        {
          label: "商品管理",
          id: 6,
          children: [
            {
              label: "图书管理",
              id: 19
            },
            {
              label: "评论审核",
              id: 20
            },
            {
              label: "微视频管理",
              id: 41
            },
            {
              label: "资源管理",
              id: 62
            },
            {
              label: "图书同步管理",
              id: 63
            },
            {
              label: "读者反馈",
              id: 43
            },
            {
              label: "图书纠错审核",
              id: 23
            },
            {
              label: "图书纠错跟踪",
              id: 24
            }
          ]
        },
        {
          label: "选题申报",
          id: 7,
          children:[
            {
              label: "选题申报审核",
              id: 21
            },
            {
              label: "选题申报查看",
              id: 22
            }
          ]
        },
        // {
        //   label: "图书纠错",
        //   id: 8,
        //   children:[
        //     {
        //       label: "图书纠错审核",
        //       id: 23
        //     },
        //     {
        //       label: "图书纠错跟踪",
        //       id: 24
        //     }
        //   ]
        // },
        {
          label: "积分管理",
          id: 9,
          children:[
            {
              label: "积分规则管理",
              id: 25
            },
            {
              label: "用户积分看板",
              id: 26
            },
            {
              label: "积分兑换规则",
              id: 27
            },
          ]
        },
        {
          label: "数据分析",
          id: 10,
          children:[
            {
              label: "流量概况",
              id: 28
            },
            {
              label: "流量地图",
              id: 29
            },
            {
              label: "图书流量概况",
              id: 30
            },
            {
              label: "用户图书偏好分析",
              id: 31
            },
          ]

        },
        {
          label: "用户管理",
          id: 11,
          children: [
            {
              label: "社内用户",
              id: 32
            },
            {
              label: "个人用户",
              id: 33
            },
            {
              label: "学校/医院用户",
              id: 34
            },
            {
              label: "专家档案库",
              id: 60
            },
            {
              label: "专家申报表列表",
              id: 61
            },

          ]
        },
        {
          label: "系统设置",
          id: 12,
          children: [
            {
              label: "角色权限",
              id: 35
            },
            {
              label: "社内部门",
              id: 36
            }
          ]
        },
        {
          label: "问卷调查",
          id: 13,
          children:[
            {
              label: "调查问卷模板设置",
              id: 37
            },
            {
              label: "调查问卷结果统计",
              id: 38
            },
            {
              label: "调查问卷回收",
              id: 39
            },
          ]
        },
        {
          label: "系统日志",
          id: 14,
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },
  methods: {
    //新增按钮
    addNewRoles() {
      this.isAddNewRole = true;
      this.rolesForm = {
        roleName: "",
        isDisabled: false,
        sort: "",
        note: ""
      };
      this.rolesDialogVisible = true;
      // this.$refs['rolesForm'].resetFields();
    },
    rolesSubmit() {
      var _this = this;
      this.$refs["rolesForm"].validate(valid => {
        if (valid) {
          //验证通过
          /* 添加默认权限 */
          this.rolesForm.ids=[1];
          if (this.isAddNewRole) {
            //添加
            this.rolesForm.ids=[1];
            this.$axios({
              method: "POST",
              url: this.addRoleUrl,
              data: _this.$initPostData(this.rolesForm)
            })
              .then(function(res) {
                console.log(res);
                if (res.data.code == 1) {
                  _this.$message.success("添加成功");
                  _this.getListData();
                  _this.rolesDialogVisible = false;
                } else {
                  _this.$confirm(res.data.msg.msgTrim(), "提示",{
                  	confirmButtonText: "确定",
                  	cancelButtonText: "取消",
                  	showCancelButton: false,
                  	type: "error"
                  });
                }
              })
              .catch(function(err) {
                console.log(err);
              });
          } else {
            //修改
            this.$axios({
              method: "PUT",
              url: this.editRoleUrl,
              data: _this.$initPostData(this.rolesForm, [
                "id",
                "roleName",
                "isDisabled",
                "note",
                "sort"
              ])
            })
              .then(function(res) {
                console.log(res);
                if (res.data.code == 1) {
                  _this.$message.success("修改成功");
                  _this.getListData();
                  _this.rolesDialogVisible = false;
                }else{
                   _this.$confirm(res.data.msg.msgTrim(), "提示",{
                   	confirmButtonText: "确定",
                   	cancelButtonText: "取消",
                   	showCancelButton: false,
                   	type: "error"
                   });
                }
              })
              .catch(function(err) {
                console.log(err);
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //更新权限弹框 确定提交按钮
    reviseSubmit() {
      /* 节点权限处理 */
      var arr = [1];
      var teachArr=[0,0,0,0,0,0,0,0];
      this.$refs.powerTree.getCheckedNodes().forEach(function(item) {
        if(!arr.includes(item.id)){
          arr.push(item.id);
        }
      });
      /* this.$refs.teachTree.getCheckedNodes().forEach(function(item) {
        teachArr[item.id]=1;
        console.log(teachArr);
      }); */
      var _this = this;
      this.$axios({
        method: "POST",
        url: _this.revisePowerUrl,
        data: _this.$initPostData({
          roleId: _this.revisePowerId,
          permissionIds: arr.join(","),
         // materialId:teachArr.join().replace(/,/g,'')
        })
      })
        .then(function(res) {
          console.log(res);
          if (res && res.data.code == 1) {
            _this.getListData();
            _this.$message.success("更新成功");
          } else {
            _this.$confirm(res.data.msg.msgTrim(), "提示",{
            	confirmButtonText: "确定",
            	cancelButtonText: "取消",
            	showCancelButton: false,
            	type: "error"
            });
          }
          _this.powerTreeVisible = false;
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    /* 查看角色权限 */
    openSeeDialog(obj){
      console.log(obj);
      this.isSeePower=true;
      this.defaultCheckedData = obj.pmphRolePermissionChild;
      this.initMaterialDefault(obj.materialPermission);
      this.revisePowerId = obj.id;
      this.powerTreeVisible = true;
    },
    /* 教材申报权限 */
    initMaterialDefault(str){
      this.defaultTeachData=[];
     for (var i in  this.teachTreeData){
       console.log('index',i,str[i]);
       if(str[i]==1){
         this.defaultTeachData.push(i);
       }
     }
    },
    //获取角色列表数据
    getListData() {
      var _this = this;
      this.$axios({
        method: "GET",
        url: this.listUrl,
        params: {
          roleName: this.searchValue
        }
      })
        .then(function(res) {
          console.log(res);
          if (res.data.code == 1) {
            /* res.data.data.map(iterm=>{
              iterm.isDisabled=!!iterm.isDisabled;
              iterm.sort=iterm.sort+'';
            }) */
            _this.rolesListData = res.data.data;
          }
        })
        .catch(function(err) {
          console.log("错误");
          console.log(err);
        });
    },
    //更新权限按钮
    updatePower(obj) {
      console.log(obj);
      this.isSeePower=false;
      this.defaultCheckedData = obj.pmphRolePermissionChild;
      this.initMaterialDefault(obj.materialPermission);
      this.revisePowerId = obj.id;
      this.powerTreeVisible = true;
    },
    //修改按钮
    reviseRoles(obj) {
      for (var item in obj) {
        // obj[item]=obj[item]+'';
        this.rolesForm[item] = item=='sort'?obj[item]+'':obj[item];
      }
      this.isAddNewRole = false;
      // this.rolesForm = obj;
      this.rolesDialogVisible = true;
      // this.$refs['rolesForm'].resetFields();
    },
    //删除角色
    deleteRole(obj){
      console.log(obj);
    },
    resetDialogForm() {
      this.$refs["rolesForm"].resetFields();
      this.rolesDialogVisible = false;
    }
  },
  created() {
    this.getListData();
  },
  watch: {
    isAddNewRole() {
      var obj = this.rolesFormRules;
      this.rolesFormRules = [];

      this.rolesFormRules = obj;
    }
  }
};
</script>
<style >
.system_roles {
  width: 100%;
  overflow: hidden;
}

.system_roles .roles_list {
  width: 100%;
  float: left;
}

.system_roles .roles_list h4,
.system_roles .roles_user_list h4 {
  font-size: 16px;
  margin-bottom: 22px;
}

.system_roles .roles_list .input,
.system_roles .roles_user_list .input {
  width: 250px;
  margin-right: 15px;
}

.system_roles .roles_user_list {
  width: 48%;
  float: right;
}

.system_roles .roles_dialog .el-dialog {
  min-width: 550px;
}

.system_roles .tree_box {
  height: 400px;
  overflow-y: scroll;
}

/* .system_roles .user_dialog .el-dialog {
    min-width: 900px;
}

.system_roles .user_dialog .el-dialog__body {
    overflow: hidden;
}

.system_roles .user_dialog .left_tree_box {
    width: 25%;
    float: left;
}

.system_roles .user_dialog .right_table_box {
    width: 70%;
    float: right;
} */
</style>
