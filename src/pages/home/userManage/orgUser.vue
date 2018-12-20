<template>
  <div class="orgUser">
    <el-tabs type="border-card" v-model="activeName">
  <el-tab-pane label="学校/医院用户" name="first">
    <p class="header_p">
      <span>管理员姓名/账户：</span>
      <el-input placeholder="请输入" class="input" v-model="params.name" @keyup.enter.native="refreshTableData"></el-input>
      <span>机构名称：</span>
      <el-input placeholder="请输入" class="input" v-model="params.orgName" @keyup.enter.native="refreshTableData"></el-input>
      <span>机构类型：</span>
      <el-select v-model="params.orgTypeName" class="input" :disabled="params.isHospital==1" placeholder="全部"  clearable >
              <el-option v-for="item in orgoptions" :key="item.value" :label="item.label" :value="item.label" @click.native ="specialSearch">
              </el-option>
      </el-select>
      <el-radio-group v-model="params.isHospital"  @change ="orgSearch">
          <el-radio :label="0">全选</el-radio>
          <el-radio :label="1">医院</el-radio>
          <el-radio :label="2">学校</el-radio>
      </el-radio-group>
      <el-button  type="primary" icon="search" style="margin-left:10px;margin-bottom:10px;" @click="searchOrg">搜索</el-button>
      <el-button type="primary" @click="clearSearch">清空搜索</el-button>
      <el-button type="primary" class="pull-right" @click="addBtn(true)">新建机构用户</el-button>
      <el-button type="primary" class="pull-right" @click="exportExcel">导出名单</el-button>
      <my-upload
        class="ChatInputFileBtn"
        ref="upload"
        :action="api_upload"
        :before-upload="beforeUploadFile"
        :on-success="upLoadFileSuccess"
        :on-error="uploadError"
        :show-file-list="false">
        <el-button type="primary" :disabled="uploadLoading"  :loading="uploadLoading">{{uploadLoading?'上传解析中...':'点击导入'}}</el-button>
      </my-upload>
            <span class="pull-right"><a style="color: #337ab7;line-height:36px;margin-right:10px;" href="/static/机构管理模板.xlsx">模板下载.xls</a></span>
    </p>
      <!--表格-->
      <div class="table-wrapper">
        <el-table
          border
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="orgName"
            label="机构名称">
            <template scope="scope">
                    <a class="title" @click="showDetail(scope.$index)">{{scope.row.orgName}}</a>
                </template>
          </el-table-column>
          <el-table-column
            prop="username"
            label="机构账号"
            width="100">
          </el-table-column>
          <el-table-column
            prop="orgTypeName"
            label="机构类型"
            width="100">
          </el-table-column>
          <el-table-column
            prop="realname"
            label="管理员姓名"
            width="110">
          </el-table-column>

          <!--如果是大屏幕显示两列，小屏幕是将用户邮箱和手机两列合并-->
          <el-table-column
            v-if="screenWidth_lg"
            label="手机号"
            width="160">
            <template scope="scope">
              <i class="fa fa-phone fa-fw" v-if="scope.row.handphone"></i>
              {{scope.row.handphone}}
            </template>
          </el-table-column>
          <el-table-column
            v-if="screenWidth_lg"
            label="邮箱"
            width="180">
            <template scope="scope">
              <i class="fa fa-envelope fa-fw" v-if="scope.row.email"></i>
              {{scope.row.email}}
            </template>
          </el-table-column>

          <el-table-column
            v-if="!screenWidth_lg"
            label="联系方式"
            width="180">
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

          <!--如果是大屏幕显示两列，小屏幕是将用户邮箱和手机两列合并-->
          <!-- <el-table-column
            v-if="screenWidth_lg_computed"
            prop="position"
            label="职务"
            width="100">
          </el-table-column>
          <el-table-column
            v-if="screenWidth_lg_computed"
            prop="title"
            label="职称"
            width="100">
          </el-table-column> -->

          <!-- <el-table-column
            v-if="!screenWidth_lg_computed"
            label="职务/职称"
            width="100">
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
          </el-table-column> -->

          <el-table-column
            prop="address"
            label="邮寄地址">
          </el-table-column>
          <!-- <el-table-column
            prop="postcode"
            label="邮编"
            width="100">
          </el-table-column> -->
          <el-table-column
            label="启用标识"
            width="100"
            align="center">
            <template scope="scope">
              {{scope.row.isDisabled?'禁用':'启用'}}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="180"
            align="center"
            >
            <template scope="scope">
              <el-button type="text" @click="eidtInfoBtn(scope.$index)">修改</el-button>
              <el-button type="text" :disabled="scope.row.isDisabled" @click="login(scope.row.username)">登录</el-button>
              <el-button type="text" @click="resetPassword(scope.row)">重置密码</el-button>
              <!-- <el-button type="text">查看详情</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--分页-->
      <div class="pagination-wrapper">
        <el-pagination v-if="totalPages>params.pageSize"
          :page-sizes="[10,20,30, 50, 100]"
          :page-size="params.pageSize"
           :current-page.sync="params.pageNumber"
           @size-change="orgHandleSizeChange"
           @current-change="orgHandleCurrentChange"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalPages">
        </el-pagination>
      </div>
      <!--增加新用户弹窗-->
      <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        :before-close="resetForm"
        size="tiny">
        <el-form :model="form" :rules="rules" ref="ruleForm"  label-width="110px" class="padding20">
          <el-form-item label="机构账号：" prop="username">
            <el-input v-model="form.username" :disabled="!isNew"></el-input>
          </el-form-item>
          <el-form-item label="机构名称：" prop="orgName">
            <el-input v-model="form.orgName"></el-input>
          </el-form-item>
          <el-form-item label="机构类型："  prop="orgTypeId">
            <el-select v-model="form.orgTypeId" placeholder="请选择院校类型">
              <el-option
                v-for="item in orgTypeList"
                :key="item.id"
                :label="item.typeName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="管理员姓名：" prop="realname">
            <el-input v-model="form.realname"></el-input>
          </el-form-item>
          <el-form-item label="手机号："  prop="handphone" >
            <el-input v-model="form.handphone"></el-input>
          </el-form-item>
          <el-form-item label="邮箱：" prop="email" >
            <el-input v-model="form.email"></el-input>
          </el-form-item>
          <el-form-item label="所属地区："  prop="areaId">
          <el-select v-model="form.areaId" filterable  placeholder="请选择或搜索">
            <el-option
              v-for="item in area"
              :key="item.id"
              :label="item.areaName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
          <!--<el-form-item label="启用标识：" prop="isDisabled">-->
            <!--<el-radio-group v-model="form.isDisabled">-->
              <!--<el-radio :label="false">启用</el-radio>-->
              <!--<el-radio :label="true">禁用</el-radio>-->
            <!--</el-radio-group>-->
          <!--</el-form-item>-->
          <el-form-item label="地址：" prop="address">
            <el-input v-model="form.address"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
           <el-button type="primary" @click="submit">确 定</el-button>
          <el-button @click="dialogVisible=false">取 消</el-button>

        </span>

      </el-dialog>
      <!-- 查看详情 -->
      <el-dialog
        title="机构用户详情"
        :visible.sync="detailVisible"
        @close="clearDetailTable"
      >
        <div class="detail-info-box">
          <div class="detail-info-item">
            <div class="title">机构名称：<span></span></div>
            <div class="info">{{detailData.orgName}}</div>
          </div>
          <div class="detail-info-item">
            <div class="title">机构账号：<span></span></div>
            <div class="info">{{detailData.username}}</div>
          </div>
        </div>
        <div class="detail-info-box">
          <div class="detail-info-item">
            <div class="title">机构类型：<span></span></div>
            <div class="info">{{detailData.orgTypeName}}</div>
          </div>
          <div class="detail-info-item">
            <div class="title">管理员姓名：<span></span></div>
            <div class="info">{{detailData.realname}}</div>
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
            <div class="info">{{detailData.isDisabled?'禁用':'启用'}}</div>
          </div>
        </div>
        <div class="detail-info-box">
          <div class="detail-info-item">
            <div class="title">备注：<span></span></div>
            <div class="info">{{detailData.note}}</div>
          </div>
        </div>
      </el-dialog>
      <!--点击上传excel-->
      <el-dialog
        title="机构用户"
        :visible.sync="excelVisible"
      >
      <p class="header_p">
        <el-button type="primary" style="float:right;"  @click="importExcel">导出</el-button>
      </p>
        <el-table
          :data="excelTableData"
          class="table-wrapper"
          border
          style="width: 100%">
          <el-table-column
            prop="orgName"
            label="机构名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="username"
            label="机构账号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="realname"
            label="管理员名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="orgTypeName"
            label="机构类型">
          </el-table-column>
        </el-table>
        <!-- <div class="pull-right marginT10 marginB10">
          <el-button type="warning" @click="excelVisible=false">取消</el-button>

        </div> -->
      </el-dialog>
  </el-tab-pane>
  <!-- 学校审核 -->
  <el-tab-pane label="审核管理员" name="second">
      <el-row>
			<el-col>
				<div class="searchBox-wrapper">
					<div class="searchName searchName1">管理员姓名/账户：
						<span></span>
					</div>
					<div class="searchInput searchInput1">
						<el-input placeholder="请输入" v-model="realname" @keyup.enter.native="search" class="searchInputEle"></el-input>
					</div>
				</div>
				<div class="searchBox-wrapper">
					<div class="searchName">机构名称：
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



        <div class="searchBox-wrapper searchBtn" >
          <el-button type="primary" icon="search" @click="search">搜索</el-button>
          <el-button type="primary" @click="clearSearch">清空搜索</el-button>
        <el-button type="primary"  @click="exportAdminExcel">导出名单</el-button>
				<el-button class="pull-right marginL10" type="success" @click="check(1)" :disabled="isSelected">通过</el-button>
				<el-button class="pull-right" type="danger" @click="check(2)" :disabled="isSelected">退回</el-button>
        </div>

			</el-col>
		</el-row>
		<el-row>
			<el-col>
				<el-table ref="multipleTable"
				:data="schoolTableData"
				border tooltip-effect="dark"
				style="width: 100%;margin-top:10px;"
				@selection-change="handleSelectionChange">
					<el-table-column type="selection" width="55">
					</el-table-column>
          <el-table-column prop="orgName" label="机构名称">
					</el-table-column>
          <el-table-column prop="username" label="机构账号" width="100">
					</el-table-column>
					<el-table-column label="管理员姓名" prop="realname" width="110">
					</el-table-column>
          <el-table-column prop="position" label="职务">
					</el-table-column>
					<el-table-column prop="title" label="职称" width="80">
					</el-table-column>
					<el-table-column label="手机号" >
            <template scope="scope">
              <i class="fa fa-phone fa-fw" v-if="scope.row.handphone"></i>
              {{scope.row.handphone}}
            </template>
          </el-table-column>
          <el-table-column label="邮箱">
            <template scope="scope">
              <i class="fa fa-envelope fa-fw" v-if="scope.row.email"></i>
              {{scope.row.email}}
            </template>
          </el-table-column>
					<el-table-column prop="address" label="邮寄地址" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="postcode" label="邮编" width="90">
					</el-table-column>
					<el-table-column label="委托书" width="110" align="center">
						<template scope="scope">
							<a href="javascript:;"  style="color:#0000ff;" @click="preview(scope.row.proxy)">预览</a>
							<!-- <el-tag type="danger" v-if="!scope.row.proxy||scope.row.proxy=='DEFAULT'">未上传</el-tag> -->
						</template>
					</el-table-column>
					<el-table-column prop="progress" label="审核状态" width="100" align="center">
						<template scope="scope">
							<el-tag type="warning" v-if="scope.row.progress=='0'">待审核</el-tag>
							<el-tag type="success" v-if="scope.row.progress=='1'">已通过</el-tag>
							<el-tag type="danger" v-if="scope.row.progress=='2'">已退回</el-tag>
						</template>
					</el-table-column>
				</el-table>
			</el-col>
			<el-col>
				<el-pagination class="pull-right marginT10"
                       v-if="dataTotal>20"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="pageNumber"
                       :page-sizes="[10, 20, 30, 40]"
                       :page-size="pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="dataTotal">
				</el-pagination>
			</el-col>
		</el-row>
		<el-dialog
			title="委托书"
			:visible.sync="schoolDialogVisible"
			size="small"
			top="5%"
      @close="clearImgSrc"
			>
			<img :src="imgsrc" width="100%" alt="委托书">
		</el-dialog>
  </el-tab-pane>
</el-tabs>
  </div>
</template>
<script>
import ScreenSize from "common/mixins/ScreenSize.js";
export default {
  mixins: [ScreenSize],
  data() {
    return {
      api_upload: '/pmpheep/users/org/importExcel',
      resetPasswordUrl:'/pmpheep/users/org/resetPassword',  // 重置密码url
      screenWidth_lg_computed: true,
      activeName:'first',
      isNew: true, // 判断是否是新增
      // isAddSchool:true,
      area:[], // 所属地区
      // 用户类别
      options: [
        {
          value: "",
          label: "全部"
        },
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
      // 审核状态
      state: [
				{
					value: '0',
					label: '待审核'
				},
				{
					value: '2',
					label: '已退回'
				},
				{
					value: '1',
					label: '已通过'
				}
			],
      selections:[], // 选中项
      tableData: [], // 机构用户数据
      dialogVisible: false, // 新增用户弹窗
      // 弹窗表单中间变量
      form: {
        id: "",
        realname: "",
        username: "",
        orgId: "",
        orgName: "",
        handphone: "",
        orgTypeId: "",
        // orgTypeName:"",
        email: "",
        areaId:'',
        isDisabled: false,
        address: ""
      },
      // 表单校验规则
      rules: {
        username: [
          { required: true, message: "请输入机构账号", trigger: "blur" },
          { pattern: /^[A-Za-z0-9]+$/, message: '只能输入英文和数字' },
          { min: 1, max: 20, message: "机构账号不能超过20个字符", trigger: "change,blur" }
        ],
        orgName: [
          { required: true, message: "请输入机构名称", trigger: "blur" },
          { min: 1, max: 20, message: "机构名称不能超过20个字符", trigger: "change,blur" }
          ],
        email: [
          { min: 1, max: 40, message: "邮箱不能超过40个字符", trigger: "change,blur" },
          { type: "email", message: "邮箱格式错误", trigger: "blur" }
        ],
        realname:[
          { required: false, message: "请输入管理员姓名", trigger: "blur" },
          { min: 1, max: 20, message: "管理员姓名不能超过20个字符", trigger: "change,blur" }
        ],
        handphone: [
          { pattern: /^1[34578]\d{9}$/, message: '手机号格式错误' }
        ],
        orgTypeId: [
            { required: true, message: '请选择院校类型', trigger: 'blur' },
        ],
        areaId: [{required: true, message: "请选择机构所属地区",trigger:"blur"}],
        isDisabled: [{type: "boolean",required: true,message: "请选择是否启用",trigger: "change"}],
        address:[
          {min:1,max:100,message:'备注不能超过100字符',trigger:'change,blur'}
        ]
      },
      //机构类型数据
      orgoptions: [{
          value:1,
          label:'本科'
        },{
          value:2,
          label:'医院'
        },{
          value:3,
          label:'职教'
        },{
          value:4,
          label:'本科、职教'
        }],
      //搜索所属机构用户
      OrgNameList: [],
      loading: false,
      // 机构用户 搜索，传输参数
      params: {
        pageSize: 20,
        pageNumber: 1,
        // username: "",
        orgName: "",
        name: "",
        orgTypeName:'',
        isHospital: 0
      },
      totalPages: 0,// 数据总量
			visible1: false,
      visible2: false,
			schoolDialogVisible: false,// 学校委托书弹窗
			imgsrc:'', // 委托书图片路径
      value: '全部',
			schoolTableData: [], // 审核管理员数据
      // 审核管理员
      dataTotal:0,
      orgName:'',
      realname:'',
      progress:'',
      pageSize:10,
      pageNumber:1,
      // 机构类型
      orgniztionType: 1,
      orgTypeList: [],
      // 新增机构类型弹窗表单
      // addOrgTypeForm:{
      //   typeName:'',
      //   sort:''
      // },
      detailVisible:false, // 查看详情弹窗
      detailData: {
        orgName:"",
        address:"",
        email:"",
        handphone:"",
        note:"",
        orgTypeName:"",
        realname:"",
        position:"",
        title:"",
        username:"",
        isDisabled: false
      }, // 详情数据
      uploadLoading:false,
      excelVisible: false,
      excelTableData:[],
      uuid:''
    };
  },
  computed:{
   dialogTitle(){
     return this.isNew?"新建机构用户":'修改用户信息';
   },
   isSelected() {
      if (this.selections.length > 0) {
        return false;
      } else {
        return true;
      }
    }
  },
  watch:{
    dialogVisible(val){
      if(!val){
        this.closeDialog();
      }
    }
  },
  methods: {
          /** 导出Excel */
          exportExcel(){
            let url = '/pmpheep/orgUserExportEcel?orgName='+this.params.orgName+'&name='+this.params.name

      +'&orgTypeName='+this.params.orgTypeName+'&isHospital='+this.params.isHospital;
            // console.log(url)
            this.$commonFun.downloadFile(url);
          },
    //点击新增按钮
    addBtn(val) {
      // this.isAddSchool=val;
      this.isNew = true;
      this.dialogVisible = true;
    },
    // 点击机构类型设置
    // setOrgsType(){
    //   this.dialogVisible2 = true;
    // },
    /**
       * 获取机构类型
       */
    getOrgTypeData(){
      this.$axios.get('/pmpheep/orgType/list/orgtype',{params: {typeName:''}})
        .then(response=>{
          let res = response.data;
          let data = res.data;
          if (res.code == 1) {
            data.map(iterm=>{
              iterm.id = iterm.id+'';
            });
            this.orgTypeList = data;
            if(this.orgTypeList.length>0){
              this.form.orgTypeId = this.orgTypeList[0].id;
            }
          } else {
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
          this.$confirm('获取机构类型数据失败', "提示",{
          	confirmButtonText: "确定",
          	cancelButtonText: "取消",
          	showCancelButton: false,
          	type: "error"
          });
        });
    },
    //点击修改按钮执行方法
    eidtInfoBtn(index) {
      this.isNew = false;
      for (let key in this.form) {
        this.form[key] = this.tableData[index][key];
      }
      // console.log(this.form.orgTypeId)
      // delete this.form.disabled;
      this.form.orgTypeId+='';
      this.form.areaId+='';
      // this.form.isDisabled = this.tableData[index].disabled;
      // console.log(this.form.isDisabled)
      this.dialogVisible = true;
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
        .get("/pmpheep/users/org/list/orgUser", { params: this.params })
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
    /* 重置密码 */
    resetPassword(obj){
        this.$confirm('确定重置机构<'+obj.orgName+'>的登录密码?', '提示', {
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

    /**
     * 搜索医院、本科、职教、本科&职教
     */
    specialSearch(){
//      if (this.params.orgTypeName == '医院') {
//        this.params.isHospital = 1;
        this.refreshTableData();
//      } if (this.params.orgTypeName == ''){
//        this.params.isHospital = 0;
//      }else {
//        this.params.isHospital = 2;
//        this.refreshTableData();
//      }
    },

    /**
     * 按医院和学校查询
     */
    orgSearch(){
//      console.log(this.params.isHospital);
      if (this.params.isHospital === 1) {
        this.params.orgTypeName = '医院';
        this.refreshTableData();
      } else if(this.params.isHospital === 2){
        this.params.orgTypeName = '';
        this.orgoptions = [{
          value:1,
          label:'本科'
        },{
          value:3,
          label:'职教'
        },{
          value:4,
          label:'本科、职教'
        }]
        this.refreshTableData();
      } else {
        this.orgoptions = [{
          value:1,
          label:'本科'
        },{
          value:2,
          label:'医院'
        },{
          value:3,
          label:'职教'
        },{
          value:4,
          label:'本科、职教'
        }]
        this.params.orgTypeName = '';
        this.refreshTableData();
      }
    },
    /**
       * 获取所属部门信息
       */
    getAreaData(){
      this.$axios.get('/pmpheep/area/areachirldren',{params: {parentId:0}})
        .then(response=>{
          let res = response.data;
          let data = res.data;
          if (res.code == 1) {
            data.map(iterm=>{
              iterm.id = iterm.id+'';
            });
            this.area = data;
            // console.log(this.area)
          } else {
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
          this.$confirm('获取机构类型数据失败', "提示",{
          	confirmButtonText: "确定",
          	cancelButtonText: "取消",
          	showCancelButton: false,
          	type: "error"
          });
        });
    },
    /**
           * 修改新增弹出点击确认按钮时触发提交表单操作
           */
    submit() {
      console.log(this.form.orgId)
      this.form.orgId += ''
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
    /**
           * 新增用户
           */
    addUser() {
      var self = this;
      this.form.orgId -= 0
      this.$axios({
        method: "POST",
        url: "/pmpheep/users/org/add/orgAndUser",
        data: this.$initPostData(this.form)
      })
        .then((response)=> {
          let res = response.data;
          //修改成功
          if (res.code == 1) {
            self.refreshTableData();
            self.dialogVisible = false;
            self.$message({
              type: "success",
              message: "添加成功"
            });
          } else {
            self.$confirm(res.msg.msgTrim(), "提示",{
            	confirmButtonText: "确定",
            	cancelButtonText: "取消",
            	showCancelButton: false,
            	type: "error"
            });
          }
        })
        .catch(function(error) {
          self.$message({
            type: "error",
            message: "添加失败，请重试"
          });
        });
    },
    /**
           * 更新用户
           */
    updateUser() {
      var self = this;
      this.form.orgId -= 0
      this.$axios({
        method: "put",
        url: "/pmpheep/users/org/updateUser",
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
          } else {
            self.$confirm(res.msg.msgTrim(), "提示",{
            	confirmButtonText: "确定",
            	cancelButtonText: "取消",
            	showCancelButton: false,
            	type: "error"
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
    resetForm(done) {
      this.$refs.ruleForm.resetFields();
      done();
    },
    /**
     * 监听弹出层关闭事件
     */
    closeDialog() {
     this.form =  {
        id: "",
        realname: "",
        username: "",
        orgId: "",
        orgName: "",
        orgTypeId:"",
        // orgTypeName:'',
        areaId: "",
        handphone: "",
        email: "",
        isDisabled: false,
        address: ""
      }
    },
      /**
     * 请求初始化列表
     */
    getOrgsList() {
      this.$axios
        .get("/pmpheep/auth/orgList", {
          params: {
            orgName: this.orgName,
            realname: this.realname,
            progress: this.progress,
            pageSize: this.pageSize,
            pageNumber: this.pageNumber
          }
        })
        .then(response => {
          let res = response.data;
          if (res.code == "1") {
            this.dataTotal = res.data.total;
            console.log(res);
            this.schoolTableData = res.data.rows;
          }
        })
        .catch(error => {
          console.log(error.msg);
        });
    },
    /**
     *
     *  管理员导出
     *  */

    exportAdminExcel(){
      let url = '/pmpheep/auth/exportOrgUser?orgName='+this.orgName+'&realname='+this.realname+"&progress="+this.progress;
      // console.log(url)
      this.$commonFun.downloadFile(url);
    },
    /**
     * 搜索
     */
    search() {
      this.pageSize = 10;
      this.pageNumber = 1;
      this.getOrgsList();
    },
    searchOrg(){
      this.params.pageSize = 10;
      this.params.pageNumber = 1;
      this.refreshTableData()
    },
    /**
		 *审核
		 */
    check(progress) {
      this.visible1 = false;
      this.visible2 = false;
      let self = this;
      //console.log(this.selections)
      var orgUserIds = [];
      this.selections.forEach(item => {
        // console.log(item)
        orgUserIds.push(item.id);
        //console.log(orgUserIds)
      });
      var title='';
      if(progress==1) {
        title = "是否确认通过?"
        this.$confirm(title, "提示",{
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let param = {
            progress: progress,
            orgUserIds: orgUserIds,
            backReason:''
          };
          this.passorback(param);
        })
      }
      else {

      //  title = "是否确认退回?"
        this.$prompt('请输入退回原因', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          if(value&&value.length<=40||!value){
            let param = {
              progress: progress,
              orgUserIds: orgUserIds,
              backReason:value
            };
            this.passorback(param);
          }else{
            this.$message.warning('不能超过40个字');
          }

        })

      }

    },
    passorback(param) {
      this.$axios.put("/pmpheep/auth/orgCheck",
      this.$initPostData(param)
    )
      .then(response => {
        let res = response.data;
        console.log(res.code)
        if (res.code == "1") {
          //console.log(res)
          this.getOrgsList();
          this.$message({
            showClose: true,
            message: param.progress==1?"审核成功!":"退回成功",
            type: "success"
          });
        }else if (res.code == '2') {
          this.$message({
            showClose: true,
            message: res.msg.msgTrim(),
            type: "warning"
          });
        }
        // console.log(res.code)
      })
      .catch(error => {
        console.log(error.msg);
      })
    },
    /**@argument val 当选中项 */
    handleSelectionChange(val) {
      this.selections = val;
      // console.log(val)
    },
    orgHandleSizeChange(val){
     this.params.pageSize=val;
     this.params.pageNumber=1;
     this.refreshTableData();
    },
    orgHandleCurrentChange(val){
     this.params.pageNumber=val;
     this.refreshTableData();
    },
    /**@argument val pageSize */
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.pageNumber=1;
      this.getOrgsList();
    },
    /**@argument val pageNumber */
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.pageNumber = val;
      this.getOrgsList();
    },
    /**
		 * 预览教师资格证
		 * @argument index */
    preview(proxy) {
      this.schoolDialogVisible = true;
      if(proxy&&proxy!='DEFAULT'){
        this.imgsrc = "/pmpheep/image/"+proxy;
      }else{
        this.imgsrc='static/default_image.png';
      }
    },
    /**
     * 查看详情
     * @param index 索引
     */
    showDetail(index) {
      this.detailVisible = true;
      // this.detailData.push(this.tableData[index]);
      for (var key in this.detailData) {
        this.detailData[key] = this.tableData[index][key]
      }
    },
    /**
     * 弹窗关闭，清空详情表格
     */
    clearDetailTable(){
      this.detailData ={
        orgName:"",
        address:"",
        email:"",
        handphone:"",
        note:"",
        orgTypeName:"",
        realname:"",
        position:"",
        title:"",
        username:"",
        isDisabled: false
      }
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
          userType: 2
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
    },
    /**
     * 清空搜索条件
     */
    clearSearch(){
      this.params = {
        pageSize: 10,
          pageNumber: 1,
          // username: "",
          orgName: "",
          name: "",
          orgTypeName:'',
          isHospital: 0
      };
      this.realname = '';
      this.orgName = '';
      this.progress = '';
    },
    /**
     * 当上传按钮添加excel
     * @param file
     */
    beforeUploadFile(file){
      let flag = true;

      var filedata = file.raw;
      var ext=file.name.substring(file.name.lastIndexOf(".")+1).toLowerCase();
      // 类型判断
      if(!(ext=='xls'||ext=='xlsx')){
        this.$confirm("请按照模板格式的文档上传文件", "提示",{
        	confirmButtonText: "确定",
        	cancelButtonText: "取消",
        	showCancelButton: false,
        	type: "error"
        });
        return;
      }
      //文件名不超过40个字符
      /* if(file.name.length>40){
       this.$confirm("文件名不能超过40个字符", "提示",{
       	confirmButtonText: "确定",
       	cancelButtonText: "取消",
       	showCancelButton: false,
       	type: "error"
       });
       return;
       } */
      // 判断文件大小是否符合 文件不为0
      if(file.size<1){
        this.$confirm("文件大小不能小于1bt", "提示",{
        	confirmButtonText: "确定",
        	cancelButtonText: "取消",
        	showCancelButton: false,
        	type: "error"
        });
        return;
      }
      // 判断文件大小是否符合 文件不大于100M
      if(file.size/1024/1024 > 100){
        this.$confirm("文件大小不能超过100M！", "提示",{
        	confirmButtonText: "确定",
        	cancelButtonText: "取消",
        	showCancelButton: false,
        	type: "error"
        });
        return;
      }

      this.uploadLoading=flag;
      return flag;
    },
    /**
     * 上传文件请求成功的回调
     */
    upLoadFileSuccess(res, file, fileList){
      if (res.code == '1') {
        this.excelVisible = true;
        this.excelTableData = res.data.list;
        this.uuid=res.data.uuid;
        console.log(res);
      }else{
        this.$confirm(res.msg.msgTrim(), "提示",{
        	confirmButtonText: "确定",
        	cancelButtonText: "取消",
        	showCancelButton: false,
        	type: "error"
        });
      }
      this.uploadLoading = false;
    },
    /**
     * 上传文件请求失败的回调
     */
    uploadError(err, file, fileList){
      console.log(err);
      this.$confirm(err.msg.msgTrim(), "提示",{
      	confirmButtonText: "确定",
      	cancelButtonText: "取消",
      	showCancelButton: false,
      	type: "error"
      });
      this.uploadLoading = false;
    },
    importExcel(){
      let url = '/pmpheep/org/exportOrgInfo?uuid='+this.uuid;
       console.log(url);
      this.$commonFun.downloadFile(url);
      this.excelVisible=false;
    }
  },
  created() {
    if(this.$route.params.activeName){
      this.activeName=this.$route.params.activeName;
    }
    this.refreshTableData();
    this.getOrgsList();
    this.getAreaData();
    this.getOrgTypeData();
  },
  mounted() {
    this.screenWidth_lg_computed = this.screenWidth_lg;
  }
};
</script>
<style scoped>
  .searchBtn{
    float: right;
    text-align:right;
    width:500px;
    padding-right: 5px;
  }
.orgUser .header_p {
  overflow: hidden;
  padding-right: 5px;
}
.orgUser .header_p .input {
  width: 190px;
  margin-bottom:10px;
  margin-right: 10px;
}
.orgUser .el-tabs--border-card{
  border:0;
  box-shadow: none;
}
.title{
  cursor: pointer;
}

.searchBox-radio {
  width: 150px;
}
.radio-group {
  margin-top: 9px;
  margin-left: 5px;
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
  width: 100px;
  text-align: justify;
}
.detail-info-item .info{
  flex: 1;
}
  .orgUser .searchName1{
    width: 120px;
  }
  .orgUser .searchInput1{
    margin-left: 120px;
  }
.ChatInputFileBtn{
  float: right;
}
</style>
