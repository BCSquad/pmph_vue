<template>
  <div class="point_rule" style="height:100%;">
		<el-row>
            <div class="searchBox-wrapper">
                <div class="searchName">活动规则名称:<span></span></div>
                <div class="searchInput">
                    <el-input v-model.trim="name" placeholder="请输入" @keyup.enter.native="search"></el-input>
                </div>
            </div>

            <div class="searchBox-wrapper searchBtn">
                <el-button  type="primary"  icon="search" @click="search">搜索</el-button>
            </div>


			  <el-button type="primary" class="pull-right" @click="openRuleList">新建活动</el-button>
        </el-row>
        <el-row>
            <el-col>
                <el-table :data="tableData" stripe border style="width: 100%">
                    <el-table-column prop="name" label="活动名称">
                    </el-table-column>
                    <el-table-column prop="ruleName" label="积分规则名称" >
                    </el-table-column>
                  <el-table-column prop="point" label="积分" >
                  </el-table-column>
                  <el-table-column prop="originalExchangePoint" label="原始积分兑换" >
                  </el-table-column>

                  <el-table-column prop="exchangePoint" label="活动积分兑换" >
                  </el-table-column>
                    <el-table-column prop="note" label="活动描述">
                    </el-table-column>
										<el-table-column  label="活动开始时间" align="center">

                      <template scope="scope">
                        {{$commonFun.formatDate(scope.row.startGmt,"yyyy-MM-dd")}}
                      </template>
                    </el-table-column>
                    <el-table-column  label="活动结束时间"  align="center">
                      <template scope="scope">
                        {{$commonFun.formatDate(scope.row.endGmt,"yyyy-MM-dd")}}
                      </template>
                    </el-table-column>
                  <el-table-column  label="是否启用" prop="status" >
                    <template scope="scope">
                     {{scope.row.status?"是":"否"}}
                    </template>
                  </el-table-column>
                  <el-table-column  label="操作" >

                  <template scope="scope">
                    <el-button type="text" style="color:#337ab7;" @click="editActivity(scope.row)">修改</el-button>

                  </template>
                </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <el-pagination
					v-if="total>20"
					class="pull-right marginT10"
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:current-page="pageNumber"
					:page-sizes="[10, 20, 30, 40]"
					:page-size="pageSize"
					layout="total, sizes, prev, pager, next, jumper"
					:total="total">
        </el-pagination>

    <el-dialog title="选择兑换规则" :visible.sync="ruleDiaLog"     >
          <el-table :data="ruleTableData" stripe border style="width: 100%"highlight-current-row
                    @current-change="handleCurrentChange"  >

            <el-table-column
              type="index"
              width="50" >
            </el-table-column>

            <el-table-column prop="ruleName" label="积分规则名称">
            </el-table-column>
            <el-table-column prop="ruleCode" label="积分规则标识" width="120">
            </el-table-column>
            <el-table-column prop="point" label="积分值" >
            </el-table-column>
            <el-table-column prop="thirdName" label="目标平台名称" width="120">
            </el-table-column>
            <el-table-column prop="exchangePoint" label="兑换三方积分" width="120">
            </el-table-column>
            <el-table-column prop="description" label="规则描述">
            </el-table-column>
            <el-table-column prop="isExchange" label="是否用于平台兑换" width="150" align="center">
              <template scope="scope">
                <p>{{scope.row.isExchange?'是':'否'}}</p>
              </template>
            </el-table-column>
            <el-table-column prop="isDisabled" label="启用状态" width="100" align="center">
              <template scope="scope">
                <p>{{scope.row.isDisabled?'否':'是'}}</p>
              </template>
            </el-table-column>
          </el-table>

      <div class="bottom_button">
        <el-button type="primary"  style="display:block;margin:0 auto" @click="newRuleActivity">下一步</el-button>
      </div>
    </el-dialog>




				<!-- 积分规则新增/修改 -->
				<el-dialog title="添加积分活动兑换规则" :visible.sync="dialogFormVisible" size="tiny" @close="resetForm" >

          <el-form :model="form" :rules="rules" ref="ruleForm" label-width="130px">
            <el-form-item label="id:"  hidden>
              <el-input v-model="form.id"></el-input>
            </el-form-item>
            <el-form-item label="活动规则名称:" prop="name">
              <el-input  v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="积分规则名称:" prop="ruleName">
              <el-input :disabled="true" v-model="form.ruleName"></el-input>
            </el-form-item>
            <el-form-item label="积分:" prop="point">
              <el-input :disabled="true" v-model="form.point" ></el-input>
            </el-form-item>
            <el-form-item label="兑换三方积分:" prop="exchangePoint" >
              <el-input v-model="form.exchangePoint"></el-input>
            </el-form-item>

            <el-form-item label="活动开始时间:" prop="startGmt" >
              <el-date-picker
                v-model="form.startGmt"
                format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="活动结束时间:" prop="endGmt" >
              <el-date-picker
                v-model="form.endGmt"
                  format="yyyy-MM-dd"
                  type="date"
                placeholder="选择日期">
              </el-date-picker>

            </el-form-item>
            <el-form-item label="活动描述:" prop="note">
              <el-input type="textarea" v-model="form.note"></el-input>
            </el-form-item>

            <el-form-item label="是否启用:" v-if="form.status!=null">
              <el-radio v-model="form.status" label="0">否</el-radio>
              <el-radio v-model="form.status" label="1" >是</el-radio>
            </el-form-item>
          </el-form>
          <div class="bottom_button">
            <el-button type="primary"  style="display:block;margin:0 auto" @click="submit()">保存</el-button>
          </div>

				</el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    var checkNum = (rule, value, callback) => {
      if (value > 99999999999999999999) {
        callback(new Error('输入的数字过大!'));
      } else {
        callback();
      }
    };
		return {
			type: 'new', // new 新增，modify 修改
			name: '', // 规则名称
			tag:'', // 标识
			pageSize: 20, // 每页条数
			pageNumber: 1,// 当前页
			total:0, // 数据总数
			tableData: [
				{ruleName:'创建话题'}
			], // 表格数据
      multipleSelection:'',

      ruleTableData:[],
			dialogFormVisible: false, // 弹出层显示/隐藏
      ruleDiaLog:false,
			form: {
				name: '',
        ruleName:'',
				ruleId: '', // 积分规则名称
				point: '', // 积分值
				exchangePoint:'', // 是否用于兑换三方平台
			  startGmt:'',
        endGmt:'',
				note: '', // 规则描述
        status:'1',
			}, // 表单数据

			rules: {
				name: [
					{ required: true, message: '活动名称不能为空', trigger: 'blur' },
					{ min: 1, max: 20, message: '活动名称不能超过20个字符', trigger: 'blur' }
				],
        ruleId: [
					{ required: true, message: '规则名称不能为空', trigger: 'blur' },
				],
        exchangePoint: [
					{ required: true, message: '兑换第三方积分不能为空'},
				],
				// 规则描述
				note: [
					{ required: true, message: '请输入活动描述', trigger: 'blur' },
					{ min: 1, max: 100, message: '内容长度不超过100个字符', trigger: 'blur' }
				],
        startGmt: [
          { required: true, message: '活动开始时间不能为空', trigger: 'blur' },
        ]
        ,
        endGmt: [
          { required: true, message: '活动结束时间不能为空', trigger: 'blur' },
        ]
			} // 表单验证
		}
	},
	created(){
		this.getPointRuleActivity();
	},
	methods:{

    editActivity(row){
      this.type="modify";
      this.form.name=row.name;
      this.form.id=row.id;
      this.form.ruleName=row.ruleName;
      this.form.ruleId=row.ruleId;
      this.form.point=row.point;
      this.form.startGmt=this.$commonFun.formatDate(row.startGmt);
      this.form.endGmt=this.$commonFun.formatDate(row.endGmt);
      this.form.note=row.note;
      this.form.status=row.status?'1':'0';
      this.form.exchangePoint=row.exchangePoint;
      this.dialogFormVisible=true;
      console.log(this.form);
    },
    /**
     * 修改新增弹出点击确认按钮时触发提交表单操作
     */
    submit() {

      if (this.type == 'new') {
        this.addRuleActivity(1);
      } else if (this.type == 'modify') {
        this.addRuleActivity(2);

      } else {
        console.log("error submit!!");
        return false;
      }

    },
    formatTime(val){
      var date = new Date(val);;
      var date_value=date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
      return date_value;
    },
    addRuleActivity(type){
      this.form.startGmt=this.formatTime(this.form.startGmt);
      this.form.endGmt=this.formatTime(this.form.endGmt);

      this.$axios.post('/pmpheep/writerpoint/ruleActivity/add',this.$commonFun.initPostData(this.form)).then(response => {
        let res = response.data;
        if (res.code == '1') {
          console.log(this.dialogFormVisible)
          this.$message.success('增加成功!');
          this.dialogFormVisible = false;
          this.getPointRuleActivity();
        } else{
          this.$confirm('新增失败,稍后再试!', "提示",{
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            showCancelButton: false,
            type: "error"
          });
        }
      }).catch(err => {
        this.$confirm('请求错误，请稍后再试!', "提示",{
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          showCancelButton: false,
          type: "error"
        });
      })
    },


    handleCurrentChange(val) {
      this.multipleSelection = val;
      console.log(val);

    },

    /**点击新增积分规则 */
    openRuleList(){
      this.ruleDiaLog=true;
      this.getPointRule();

    },
    newRuleActivity(){
      this.type ='new';
      if(this.multipleSelection==null){

        this.$message.error('请选择一个兑换规则!');
        return;
      }
      this.form.ruleName= this.multipleSelection.ruleName;
      this.form.ruleId= this.multipleSelection.id;
      this.form.point= this.multipleSelection.point;
      this.ruleDiaLog=false;
      this.dialogFormVisible=true;


    },

    /**获取积分规则活动 */
    getPointRuleActivity(){
      this.$axios.get('/pmpheep/writerpoint/listActivity',{
        params:{
          sessionId:this.$getUserData().sessionId,
          pageSize: this.pageSize,
          pageNumber: this.pageNumber,
          name: this.name,
          ruleCode: this.tag,

        }
      }).then(response => {
        let res = response.data;
        if (res.code == '1') {
          this.tableData = res.data.rows;

        }
      }).catch(err => {
        this.$confirm('请稍后再试！', "提示",{
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          showCancelButton: false,
          type: "error"
        });
      })
    },

    getPointRule(){
      this.$axios.get('/pmpheep/writerPoint/exchangeList',{
        params:{
          sessionId:this.$getUserData().sessionId,
          pageSize: this.pageSize,
          pageNumber: this.pageNumber,
          ruleName: this.name,
          ruleCode: this.tag
        }
      }).then(response => {
        let res = response.data;
        if (res.code == '1') {
          this.ruleTableData = res.data.rows;
        }
      }).catch(err => {
        this.$confirm('请稍后再试！', "提示",{
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          showCancelButton: false,
          type: "error"
        });
      })
    },
		/**搜索 */
		search(){
			this.pageSize = 20;// 每页条数
			this.pageNumber =  1;// 当前页
			this.getPointRuleActivity();
		},


		/**删除积分规则 */
		deleteRule(id){
			this.$confirm("确定删除选中文件吗?", "提示",{
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
					this.$axios.delete('/pmpheep/writerPoint/pointrule/delete',{
						params:{
							id: id
						}
					}).then(response => {
						let res = response.data;
						if (res.code == '1') {
							this.$message.success('删除成功!');
							this.getPointRule();
						} else {
							this.$confirm(res.msg.msgTrim(), "提示",{
								confirmButtonText: "确定",
								cancelButtonText: "取消",
								showCancelButton: false,
								type: "error"
							});
						}
					}).catch(err => {
						this.$confirm('请求错误,请稍后再试!', "提示",{
							confirmButtonText: "确定",
							cancelButtonText: "取消",
							showCancelButton: false,
							type: "error"
						});
					})
				})
		},
		/**重置表单 */
		resetForm() {
			this.$refs.ruleForm.resetFields();
			this.form = {
        name: '',
        ruleName:'',
        ruleId: '', // 积分规则名称
        point: '', // 积分值
        exchangePoint:'', // 是否用于兑换三方平台
        startGmt:'',
        endGmt:'',
        status:'',
        note: '', // 规则描述
			};
		},
		// 分页查询
		handleSizeChange(val){
			this.pageSize = val;
			this.getPointRuleActivity()
		},
		handleSizeChange(val){
			this.pageNumber = val;
			this.getPointRuleActivity()
		},
	}
};
</script>
<style>

</style>
