<template>
  <div class="writerUser">
    <el-tabs type="border-card" v-model="activeName">
  <el-tab-pane label="个人用户" name="first">
   <div class="clearfix">
    <div class="searchBox-wrapper">
      <div class="searchName">姓名/账号：
        <span></span>
      </div>
      <div class="searchInput">
        <el-input placeholder="请输入" class="searchInputEle" v-model="params.name" @keyup.enter.native="searchWriter"></el-input>
      </div>
    </div>
     <div class="searchBox-wrapper" >
       <div class="searchName">手机：
         <span></span>
       </div>
       <div class="searchInput">
         <el-input placeholder="请输入" class="searchInputEle" v-model="params.handphone" @keyup.enter.native="searchWriter"></el-input>
       </div>
     </div>
     <div class="searchBox-wrapper">
       <!--申报职务搜索-->
       <div class="searchName">邮箱：
         <span></span>
       </div>
       <div class="searchInput">
         <el-input placeholder="请输入" class="searchInputEle" v-model="params.email" @keyup.enter.native="searchWriter"></el-input>
       </div>
     </div>
    <div class="searchBox-wrapper" >
      <div class="searchName">所属机构：
        <span></span>
      </div>
      <div class="searchInput">
        <el-input placeholder="请输入" class="searchInputEle" v-model="params.orgName" @keyup.enter.native="searchWriter"></el-input>
      </div>
    </div>
      <div class="searchBox-wrapper">
      <!--申报职务搜索-->
      <div class="searchName">用户类型：
        <span></span>
      </div>
      <div class="searchInput">
        <el-select v-model="params.rank" placeholder="全部" @change="searchWriter" clearable>
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>

     <div class="searchBox-wrapper searchBtn " >

      <el-button type="primary" icon="search" @click="searchWriter">搜索</el-button>
       <el-button type="primary"  @click="exportExcel">导出名单</el-button>
    </div>
            <!--操作按钮-->
    <!-- <div class="pull-right" style="margin-right:10px;">
      <el-button type="primary" @click="addBtn">新增用户</el-button>
    </div> -->
  </div>
    <!--表格-->
    <div class="table-wrapper">
      <el-table :data="tableData" border style="width: 100%" >
        <el-table-column prop="realname" label="姓名" width="110" show-overflow-tooltip>
          <template scope="scope">
            <a class="name" @click="showDetail(scope.$index)">{{scope.row.realname}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="账号" width="120">
        </el-table-column>
        <el-table-column prop="orgName" label="所属机构">
        </el-table-column>
        <!--如果是大屏幕显示两列，小屏幕是将用户邮箱和手机两列合并-->
        <el-table-column v-if="screenWidth_lg" prop="position" label="职务" width="120">
        </el-table-column>
        <el-table-column v-if="screenWidth_lg" prop="title" label="职称" width="100">
        </el-table-column>

        <el-table-column v-if="!screenWidth_lg" label="职务/职称" width="120">
          <template scope="scope">
            <el-tooltip class="item" effect="dark" :content="'职务:'+scope.row.position" placement="top">
              <p>
                <i class="fa fa-tags"></i>
                {{scope.row.position}}
              </p>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="'职称:'+scope.row.title" placement="top">
              <p>
                <i class="fa fa-graduation-cap"></i>
                {{scope.row.title}}
              </p>
            </el-tooltip>
          </template>
        </el-table-column>
        <!--如果是大屏幕显示两列，小屏幕是将用户邮箱和手机两列合并-->
        <el-table-column v-if="screenWidth_lg" label="手机号" width="160">
          <template scope="scope">
            <i class="fa fa-phone fa-fw" v-if="scope.row.handphone"></i>
            {{scope.row.handphone}}
          </template>
        </el-table-column>
        <el-table-column v-if="screenWidth_lg" label="邮箱" width="220">
          <template scope="scope">
            <i class="fa fa-envelope fa-fw" v-if="scope.row.email"></i>
            {{scope.row.email}}
          </template>
        </el-table-column>

        <el-table-column v-if="!screenWidth_lg" label="联系方式" width="180">
          <template scope="scope">
            <p>
              <i class="fa fa-phone fa-fw" v-if="scope.row.handphone"></i>
              {{scope.row.handphone}}
            </p>
            <p>
              <i class="fa fa-envelope fa-fw" v-if="scope.row.email"></i>
              {{scope.row.email}}
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="邮寄地址" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="rankName" label="用户类型" width="120">
        </el-table-column>
        <el-table-column label="启用标识" width="" align="center">
          <template scope="scope">
            {{scope.row.isDisabled?'禁用':'启用'}}
          </template>
        </el-table-column>

        <el-table-column label="操作"
          align="center" width="180">
          <template scope="scope">
            <el-button type="text" @click="eidtInfoBtn(scope.$index)">修改</el-button>
            <el-button type="text" :disabled="scope.row.isDisabled?true:false" @click="login(scope.row.username)">登录</el-button>
            <el-button type="text" @click="resetPassword(scope.row)">重置密码</el-button>
            <el-button type="text" @click="zhiTop(scope.$index,scope.row)">{{scope.row.isTop?'撤销':'置顶'}}</el-button>
            <el-button type="text" @click="expertInfo(scope.$index)">专家资料库</el-button>
            <!-- <el-button type="text">查看详情</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div class="pagination-wrapper">
      <el-pagination
      v-if="totalPages>params.pageSize"
      :page-sizes="[10,20,30, 50, 100]"
      :page-size="params.pageSize"
      :current-page.sync="params.pageNumber"
      @size-change="writerSizeChange"
       @current-change="writerCurrentChange"
       layout="total, sizes, prev, pager, next, jumper"
       :total="totalPages">
      </el-pagination>
    </div>
    <!--增加新用户弹窗-->
    <el-dialog :title="isNew?'新增用户':'修改用户信息'" :visible.sync="dialogVisible" :before-close="closeDialog" size="tiny">
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px" class="padding20">
        <el-form-item label="账号：" prop="username">
          <el-input v-model="form.username" :disabled="!isNew"  placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="姓名：" prop="realname">
          <el-input v-model="form.realname" placeholder="请输入用户姓名"></el-input>
        </el-form-item>
        <el-form-item label="职务：" prop="position">
          <el-input v-model="form.position" placeholder="请输入职务"></el-input>
        </el-form-item>
        <el-form-item label="职称：" prop="title">
          <el-input v-model="form.title" placeholder="请输入职称"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="handphone" >
          <el-input v-model="form.handphone" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input v-model="form.email" placeholder="请请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="所属机构：" prop="orgId" required>
          <el-select v-model="form.orgId" filterable remote placeholder="请输入关键词搜索" loading-text="正在搜索..." :remote-method="searchOrgName" :loading="loading">
            <el-option v-for="item in OrgNameList" :key="item.id" :label="item.orgName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="启用标识：" prop="isDisabled">
          <el-radio-group v-model="form.isDisabled">
            <el-radio :label="false">启用</el-radio>
            <el-radio :label="true">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注：" prop="note">
          <el-input v-model="form.note"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button @click="dialogVisible=false">取消</el-button>

      </span>
    </el-dialog>
    <!-- 查看详情 -->
      <el-dialog
        title="个人用户详情"
        :visible.sync="detailVisible"
        @close="clearDetailTable"
      >
        <div class="detail-info-box">
          <div class="detail-info-item">
            <div class="title">姓名：<span></span></div>
            <div class="info">{{detailData.realname}}</div>
          </div>
          <div class="detail-info-item">
            <div class="title">账号：<span></span></div>
            <div class="info">{{detailData.username}}</div>
          </div>
        </div>
        <div class="detail-info-box">
          <div class="detail-info-item">
            <div class="title">身份证号：<span></span></div>
            <div class="info">{{detailData.idcard}}</div>
          </div>
          <div class="detail-info-item">
            <div class="title">所属机构：<span></span></div>
            <div class="info">{{detailData.orgName}}</div>
          </div>
        </div>
        <div class="detail-info-box">
          <div class="detail-info-item">
            <div class="title">职务：<span></span></div>
            <div class="info">{{detailData.position}}</div>
          </div>
          <div class="detail-info-item">
            <div class="title">职称：<span></span></div>
            <div class="info">{{detailData.title}}</div>
          </div>
        </div>
        <div class="detail-info-box">
          <div class="detail-info-item">
            <div class="title">手机号：<span></span></div>
            <div class="info">{{detailData.handphone}}</div>
          </div>
          <div class="detail-info-item">
            <div class="title">邮箱：<span></span></div>
            <div class="info">{{detailData.email}}</div>
          </div>
        </div>
        <div class="detail-info-box">
          <div class="detail-info-item">
            <div class="title">邮寄地址：<span></span></div>
            <div class="info">{{detailData.address}}</div>
          </div>
          <div class="detail-info-item">
            <div class="title">启用标识：<span></span></div>
            <div class="info">{{detailData.isDisabled?'启用':'禁用'}}</div>
          </div>
        </div>
        <div class="detail-info-box">
          <div class="detail-info-item">
            <div class="title">备注：<span></span></div>
            <div class="info">{{detailData.note}}</div>
          </div>
        </div>
      </el-dialog>
    <el-dialog
      title="专家申报资料"
      :visible.sync="expertInfoVisible"
      @close="clearExpertInfoTable"
    >
      <expertInfo v-if="writerUserId" :writerUserId="writerUserId"></expertInfo>
    </el-dialog>


  </el-tab-pane>
  <el-tab-pane label="审核教师" name="second">
    	<div class="teacher_check">
		<el-row>
			<el-col>
				<div class="searchBox-wrapper">
					<div class="searchName">姓名/账号：
						<span></span>
					</div>
					<div class="searchInput">
						<el-input placeholder="请输入" v-model="realname" @keyup.enter.native="search" class="searchInputEle"></el-input>
					</div>
				</div>
				<div class="searchBox-wrapper">
					<div class="searchName">所属机构：
						<span></span>
					</div>
					<div class="searchInput">
						<el-input placeholder="请输入" v-model="orgName" @keyup.enter.native="search" class="searchInputEle"></el-input>
					</div>
				</div>
				<div class="searchBox-wrapper">
					<div class="searchName">审核状态：
						<span></span>
					</div>
					<div class="searchInput">
						<el-select v-model="progress" placeholder="全部" clearable>
							<el-option v-for="item in state" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</div>
				</div>
				<div class="searchBox-wrapper searchBtn">
					<el-button type="primary" icon="search" @click="search">搜索</el-button>
				</div>
				<el-button class="pull-right marginL10" type="success" @click="check(3)" :disabled="isSelected">通过</el-button>
				<el-button class="pull-right" type="danger"  @click="check(2)" :disabled="isSelected">退回</el-button>
			</el-col>
		</el-row>
		<el-row>
			<el-col>
				<el-table ref="multipleTable" :data="teachTableData" border tooltip-effect="dark" style="width: 100%;margin:10px 0;" @selection-change="handleSelectionChange">
					<el-table-column type="selection" width="55">
					</el-table-column>
					<el-table-column label="教师姓名" prop="realname" width="100">
					</el-table-column>
					<el-table-column prop="username" label="账号" width="120">
					</el-table-column>
          <el-table-column prop="orgName" label="所属机构" min-width="120">
					</el-table-column>
          <el-table-column prop="position" label="职务" v-if="screenWidth_lg">
					</el-table-column>
					<el-table-column prop="title" label="职称" width="80" v-if="screenWidth_lg">
					</el-table-column>
          <el-table-column v-if="!screenWidth_lg" label="职务/职称" width="160">
            <template scope="scope">
              <el-tooltip class="item" effect="dark" :content="'职务:'+scope.row.position" placement="top">
                <p>
                  <i class="fa fa-tags"></i>
                  {{scope.row.position}}
                </p>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="'职称:'+scope.row.title" placement="top">
                <p>
                  <i class="fa fa-graduation-cap"></i>
                  {{scope.row.title}}
                </p>
              </el-tooltip>
            </template>
          </el-table-column>
					<el-table-column label="手机号" width="160" v-if="screenWidth_lg">
            <template scope="scope">
              <i class="fa fa-phone fa-fw" v-if="scope.row.handphone"></i>
              {{scope.row.handphone}}
            </template>
          </el-table-column>
          <el-table-column label="邮箱" width="220" v-if="screenWidth_lg">
            <template scope="scope">
              <i class="fa fa-envelope fa-fw" v-if="scope.row.email"></i>
              {{scope.row.email}}
            </template>
          </el-table-column>
          <el-table-column v-if="!screenWidth_lg" label="联系方式" width="220">
            <template scope="scope">
              <p>
                <i class="fa fa-phone fa-fw" v-if="scope.row.handphone"></i>
                {{scope.row.handphone}}
              </p>
              <p>
                <i class="fa fa-envelope fa-fw" v-if="scope.row.email"></i>
                {{scope.row.email}}
              </p>
            </template>
          </el-table-column>
          <el-table-column prop="idcard" label="身份证" width="190" v-if="screenWidth_lg">
					</el-table-column>
					<el-table-column label="教师资格证" width="" align="center">
						<template scope="scope">
							<a href="javascript:;" v-if="scope.row.cert&&scope.row.cert!='DEFAULT'" style="color:#0000ff;" @click="preview(scope.row.cert)">预览</a>
							<el-tag type="danger" v-if="!scope.row.cert||scope.row.cert=='DEFAULT'">未上传</el-tag>
						</template>
					</el-table-column>
					<el-table-column prop="progress" label="审核状态" width="" align="center">
						<template scope="scope">
              <el-tag type="danger" v-if="scope.row.progress=='0'">未提交</el-tag>
							<el-tag type="warning" v-if="scope.row.progress=='1'">待审核</el-tag>
							<el-tag type="success" v-if="scope.row.progress=='3'">已通过</el-tag>
							<el-tag type="danger" v-if="scope.row.progress=='2'">已退回</el-tag>
						</template>
					</el-table-column>
				</el-table>
			</el-col>
			<el-col>
				<el-pagination class="pull-right marginT10"
                       v-if="dataTotal>pageSize"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="pageNumber"
                       :page-sizes="[10, 20, 30,50]"
                       :page-size="pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="dataTotal">
				</el-pagination>
			</el-col>
		</el-row>
		<el-dialog
			title="教师资格证"
			:visible.sync="previewDialogVisible"
			size="small"
			top="5%"
      @close="clearImgSrc"
			>
      <img :src="imgsrc" width="100%" alt="教师资格证">

		</el-dialog>
	</div>
  </el-tab-pane>
</el-tabs>

  </div>
</template>
<script>
import ScreenSize from "common/mixins/ScreenSize.js";
import expertInfo from "pages/home/userManage/nav/expertInfo.vue";
export default {
  components:{expertInfo},
  mixins: [ScreenSize],
  data() {
    var departmentIdChecked=(rule, value, callback)=>{
         if(value){
            callback();
         }else{
           callback('请输入关键字搜索并选择一个部门');
         }
    }
    return {
      writerUserId:'',
      isNew: true,
      activeName:'first',
      resetPasswordUrl:'/pmpheep/users/writer/resetPassword',  //重置密码url
      isTopUrl:'/pmpheep/users/writer/isTop',  //置顶
      //用户类型数据
      options: [
        {
          value: "0",
          label: "普通用户"
        },
        {
          value: "1",
          label: "教师用户"
        },
        {
          value: "2",
          label: "作家用户"
        },
        {
          value: "3",
          label: "专家用户"
        }
      ],
      state: [
/*         {
          value: '0',
					label: '未提交'
        }, */
				{
					value: '1',
					label: '待审核'
				},
				{
					value: '2',
					label: '已退回'
				},
				{
					value: '3',
					label: '已通过'
				}
      ],
      //表格数据
      tableData: [],
      //是否展开弹出层
      dialogVisible: false,
      previewDialogVisible: false,
      //表单提交数据
      form: {
        id: "",
        realname: "",
        username: "",
        orgId: "",
        handphone: "",
        position:"",
        title:"",
        email: "",
        isDisabled: true,
        note: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户代码", trigger: "blur" },
          { pattern: /^[A-Za-z0-9]+$/, message: '只能输入英文和数字' },
          { min: 1, max: 20, message: "请输入1~20个英文和数字", trigger: "change,blur" }
        ],
        realname: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 1, max: 20, message: "姓名不能超过20个字符", trigger: "change,blur" }
          ],
        email: [
          { min: 1, max: 40, message: "邮箱不能超过40个字符", trigger: "change,blur" },
          { type: "email", message: "邮箱格式错误", trigger: "blur" }
          ],
        position: [
          { min: 0, max: 36, message: "职务不能超过36个字符", trigger: "change,blur" }
        ],
        title: [
          { min: 0, max: 30, message: "职称不能超过30个字符", trigger: "change,blur" }
        ],
        handphone: [
          { pattern: /^1[34578]\d{9}$/, message: '手机号格式错误' }
          ],
        orgId: [{ validator:departmentIdChecked, trigger: "change,blur" }],
        isDisabled: [{type: "boolean",required: true,message: "请选择是否启用",trigger: "change"}],
        note:[
          {min:1,max:100,message:'备注不能超过100字符',trigger:'change,blur'}
        ]
      },
      //搜索所属机构用户
      OrgNameList: [],
      loading: false,
      params: {
        pageSize: 10,
        pageNumber: 1,
        name: "",
        rank: "",
        orgName: "",
        handphone:"",
        email:""
      },
      totalPages: 0,

			visible1: false,
			visible2: false,
			selections:'',
			imgsrc:"",
			teachTableData: [],
      orgName:  '',
      realname: '',
      progress: '',
      pageSize: 10,
      pageNumber: 1,
      dataTotal: 0,
      detailVisible: false, //查看详情
      expertInfoVisible:false,//查看专家资料库
      detailData: {
        realname:'',
        username:"",
        idcard:"",
        orgName:"",
        position:"",
        title:"",
        handphone:"",
        email:"",
        address:"",
        rankName:"",
        isDisabled:"",
        note:""
      }, // 详情数据

    };
  },
  computed:{
    isSelected() {
			if (this.selections.length > 0) {
				return false
			} else {
				return true
			}
		}
  },
  methods: {
    //点击新增按钮
    addBtn() {
      this.isNew = true;
      this.form={
        id: "",
        realname: "",
        username: "",
        orgId: "",
        handphone: "",
        position:"",
        title:"",
        email: "",
        isDisabled: true,
        note: ""
      }
      this.dialogVisible = true;
    },
    //点击修改按钮执行方法
    eidtInfoBtn(index) {
      this.isNew = false;
      this.OrgNameList = [
        {
          id: this.tableData[index].orgId,
          orgName: this.tableData[index].orgName
        }
      ];
      for (let key in this.form) {
        this.form[key] = this.tableData[index][key];
      }
      this.form.isDisabled = !!this.form.isDisabled;
      this.dialogVisible = true;
    },

    /**
     * 查看专家资料库
     * */
    expertInfo(index){
      this.writerUserId = this.tableData[index].id;
      this.expertInfoVisible = true;
    },


    /**
     * 提交表单中搜索所属院校
     * @param query
     */
    searchOrgName(query) {
      var self = this;
      if (query == "") {
        self.OrgNameList = [];
        return;
      }

      this.loading = true;
      this.$axios
        .get("/pmpheep/orgs/list/orgByOrgName", {
          params: { orgName: query || "" }
        })
        .then(function(response) {
          self.loading = false;
          let res = response.data;
          let data = res.data;
          console.log(data);
          if (data.length > 0) {
            self.OrgNameList = data;
          } else {
            self.OrgNameList = [];
          }
        })
        .catch(function(error) {
          self.loading = false;
          console.error(error);
        });
    },
    /**
     * 获取表格数据，
     * 提交的参数写在params里
     */
    refreshTableData() {
      var self = this;
      // 为给定 ID 的 user 创建请求
      this.$axios
        .get("/pmpheep/users/writer/list/writerUser", { params: this.params })
        .then(function(response) {
          let res = response.data;
          let data = res.data.rows;
          self.tableData = data;
          self.totalPages = res.data.total;
        })
        .catch(function(error) {
          console.error(error);
        });
    },
    writerSizeChange(val){
      this.params.pageSize=val;
      this.params.pageNumber=1;
      this.refreshTableData();
    },
    writerCurrentChange(val){
      this.params.pageNumbber=val;
      this.refreshTableData();
    },
    /**
     * 修改新增弹出点击确认按钮时触发提交表单操作
     */
    submit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.isNew) {
            this.addUser();
            return;
          }

          this.updateUser();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /* 重置密码 */
    resetPassword(obj){
        this.$confirm('确定重置用户<'+obj.realname+'>的登录密码?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
        this.$axios.put(this.resetPasswordUrl,this.$commonFun.initPostData({
          id:obj.id
        })).then((res)=>{
           if(res.data.code==1){
             this.$message.success('密码已重置');
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
    },
    zhiTop(index,obj){

      this.$axios.put(this.isTopUrl,this.$commonFun.initPostData({
        id:obj.id,
        isTop:obj.isTop
      })).then((res)=>{
        if(res.data.code==1){
          this.$message.success('操作成功');
          this.tableData[index].isTop = !obj.isTop;
        }else{
          this.$confirm(res.data.msg.msgTrim(), "提示",{
          	confirmButtonText: "确定",
          	cancelButtonText: "取消",
          	showCancelButton: false,
          	type: "error"
          });
        }
      }).catch(() => {

      })
    },
    /**
     * 新增用户
     */
    addUser() {
      var self = this;
      this.$axios({
        method: "POST",
        url: "/pmpheep/users/writer/addUser",
        data: this.$initPostData(this.form)
      })
        .then(function(response) {
          console.log(response)
          let res = response.data;
          //修改成功
          if (res.code === 1) {
            self.refreshTableData();
            self.dialogVisible = false;
            self.$message({
              type: "success",
              message: "添加成功"
            });
          }else{
            self.$confirm(res.msg.msgTrim(), "提示",{
            	confirmButtonText: "确定",
            	cancelButtonText: "取消",
            	showCancelButton: false,
            	type: "error"
            });
          }
        })
        .catch(function(error) {
          // console.log(error)
          self.$message({
            type: "error",
            message: error
          });
        });
    },
    /**
     * 更新用户
     */
    updateUser() {
      var self = this;
      this.$axios({
        method: "PUT",
        url: "/pmpheep/users/writer/updateUser",
        data: this.$initPostData(this.form)
      })
        .then(function(response) {
          let res = response.data;
          //修改成功
          if (res.code === 1) {
            self.refreshTableData();
            self.dialogVisible = false;
            self.$message({
              type: "success",
              message: "修改成功"
            });
          }
        })
        .catch(function(error) {
          self.$message({
            type: "error",
            message: "修改失败，请重试"
          });
        });
    },
    /**
     * 重置form表单数据
     */
    resetForm() {
      this.$refs["ruleForm"].resetFields();
      console.log(this.form);
    },
    /**
     * 监听弹出层关闭事件
     */
    closeDialog(done) {
      this.resetForm();
      done();
    },
    preview(cert) {
      this.$axios
        .get("/pmpheep/image/" + cert)
        .then(response => {
          let res = response.data;
          if (res.code == "1") {
            this.dialogVisible = true;
            console.log(res);
          }
        })
        .catch(error => {
          console.log(error.msg);
        });
    },

    /**
     * 请求初始化列表
     */
    getWritersList() {
      this.$axios.get("/pmpheep/auth/writerList",{
        params:{
          orgName:  this.orgName,
          realname: this.realname,
          progress: this.progress,
          pageSize: this.pageSize,
          pageNumber: this.pageNumber
        }
      }).then((response) => {
        let res = response.data
        if (res.code == '1') {
          this.dataTotal = res.data.total
          // console.log(res)
          this.teachTableData = res.data.rows
        }
      }).catch((error) => {
        console.log(error.msg)
      })
		},
		/**
		 *审核
		 */
		check(progress){
		  let _this = this;
			this.visible1 = false
			this.visible2 = false
			//console.log(this.selections)
			var userIds = []
			this.selections.forEach(item => {
				// console.log(item)
				userIds.push(item.id)
				console.log(userIds)
      })
      var title='';

      if(progress==3) {
        title = "是否确认通过?"
        this.$confirm(title, "提示",{
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let param = {
            progress: progress,
            userIds: userIds.join(','),
            backReason:''
          }
          this.passorback(param)
        })
      } else {
        //title = "是否确认退回?"
        this.$prompt('请输入退回原因', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            let $el_message_box_errormsg = instance.$el.children["0"].children[1].children[2].children[1];//错误信息提醒div
            let value = instance.$children[2].$el.children[0].value; //输入框内容
            if (action === 'confirm') {  //点击的是确认
              //instance.confirmButtonLoading = true;
              //instance.confirmButtonText = '执行中...';
              //console.log(instance.$children[2].$el.children[0].value)
                if(!value){
                  $el_message_box_errormsg.style.visibility="visible";
                  $el_message_box_errormsg.innerHTML="退回原因必填";
                }else if(value&&value.length<=40||!value){
                  let param = {
                    progress: progress,
                    userIds: userIds.join(','),
                    backReason:value
                  };
                  $el_message_box_errormsg.style.visibility="hidden";
                  $el_message_box_errormsg.innerHTML="";
                  done();     //关闭提示框
                  _this.passorback(param);
                }else{
                  $el_message_box_errormsg.style.visibility="visible";
                  $el_message_box_errormsg.innerHTML="不能超过40个字";
                }

            } else {
              $el_message_box_errormsg.style.visibility="hidden";
              $el_message_box_errormsg.innerHTML="";
              done();     //关闭提示框
            }
          },

        }).then(({ value }) => {
          /*if(!value){
            this.check(2);
          }else if(value&&value.length<=40||!value){
            let param = {
              progress: progress,
              userIds: userIds.join(','),
              backReason:value
            };
            this.passorback(param);
          }else{
            this.$message.warning('不能超过40个字');
          }*/
          //_this.myValidateBeforeClose(value);

        })
      }

		},
    passorback(param){
      this.$axios.put("/pmpheep/auth/writerCheck",this.$initPostData(param)).then((response) => {
        let res = response.data
        if (res.code == "1") {
          //console.log(res)
          this.getWritersList()

          this.$message({
            showClose: true,
            message: progress==3?'审核通过!':'已退回',
            type: 'success'
          });
        }else if(res.code ==2){
          this.$confirm(res.msg.msgTrim(), "提示",{
          	confirmButtonText: "确定",
          	cancelButtonText: "取消",
          	showCancelButton: false,
          	type: "error"
          });
        }
      }).catch(error => {
        console.log(error.msg)
      })
    },
    myValidateBeforeClose(){},
    /**
     * 搜索
     */
    search() {
      //this.pageSize = 10;
      this.pageNumber = 1;
      this.getWritersList()
    },
    exportExcel(){
      /** 导出Excel */

      let url = '/pmpheep/users/writer/list/exportWriterUser?name='+this.params.name+'&rank='+this.params.rank+"&orgName="+this.params.orgName+"&handphone="+this.params.handphone+"&email="+this.params.email;
      // console.log(url)
      this.$commonFun.downloadFile(url);
    },
    searchWriter(){
      this.params.pageSize = 10;
      this.params.pageNumber = 1;
      this.refreshTableData();
    },
		/**@argument val 当选中项 */
		handleSelectionChange(val) {
			this.selections = val
		},
		handleSizeChange(val) {
      this.pageSize=val;
      this.pageNumber=1;
      this.getWritersList();
		},
		handleCurrentChange(val) {
      this.pageNumber=val;
      this.getWritersList();
		},
		/**
		 * 预览教师资格证
		 * @argument index */
		preview(cert) {
      this.previewDialogVisible = true
		  this.imgsrc = "/pmpheep/image/"+cert;
      console.log(this.imgsrc);
//			this.$axios.get("/pmpheep/image/"+cert).then(response => {
//				let res = response.data
//				if (res.code == '1'){
//					this.dialogVisible = true
//					console.log(res)
//				}
//			}).catch((error) => {
//        console.log(error.msg)
//      })
    },
    /**
     * 点击查看详情
     */
    showDetail(index){
      this.detailVisible = true;
      for(var key in this.detailData) {
        this.detailData[key] = this.tableData[index][key]
      }
    },
    /**
     * 弹窗关闭，清空详情表格
     */
    clearDetailTable(){
      this.detailData = {
        realname:'',
        username:"",
        idcard:"",
        orgName:"",
        position:"",
        title:"",
        handphone:"",
        email:"",
        address:"",
        rankName:"",
        isDisabled:"",
        note:""
      }
    },
    /**
     * 专家资料库弹窗关闭，清空表格
     */
    clearExpertInfoTable(){
      this.writerUserId = '';
    },

    /**
     * 预览关闭，清除图片路径
     */
    clearImgSrc(){
      this.imgsrc = '';
    },
    // 登录
    login(userName){
      console.log(userName);
      this.$axios.get('pmpheep/pmph/keyToLand',{
        params:{
          userName: userName,
          userType: 1
        }
      }).then(response => {
        let res = response.data;
        if (res.code == 1) {
//          window.location.href = res.data;
          window.open(res.data);
        } else {
          this.$confirm(res.msg.msgTrim(), "提示",{
          	confirmButtonText: "确定",
          	cancelButtonText: "取消",
          	showCancelButton: false,
          	type: "error"
          });
        }
      }).catch(error => {
        this.$confirm('登录失败，请稍后再试!', "提示",{
        	confirmButtonText: "确定",
        	cancelButtonText: "取消",
        	showCancelButton: false,
        	type: "error"
        });
      })
    }
  },
  created() {
    if(this.$route.params.activeName){
      this.activeName=this.$route.params.activeName;
    }
    this.refreshTableData();
    this.getWritersList();
  },
  mounted() {

  }
};
</script>
<style scoped>
  .searchBtn{
    width:200px;
  }
.writerUser .el-tabs--border-card{
  border:0;
  box-shadow: none;
}
.name{
  cursor: pointer;
}
.detail-info-box{
  display: flex;
  font-size: 16px;
  margin-bottom: 10px;
}
.detail-info-item{
  display: flex;
  align-items: flex-start;
  flex: 1;
}
.detail-info-item .title{
  width: 80px;
  text-align: justify;
}
.detail-info-item .info{
  flex: 1;
}
</style>
