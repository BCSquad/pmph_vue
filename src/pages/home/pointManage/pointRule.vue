<template>
  <div class="point_rule" style="height:100%;">
		<el-row>
            <div class="searchBox-wrapper">
                <div class="searchName">积分规则名称:<span></span></div>
                <div class="searchInput">
                    <el-input v-model.trim="name" placeholder="请输入" @keyup.enter.native="search"></el-input>
                </div>
            </div>
            <div style="display: none;" class="searchBox-wrapper">
                <div class="searchName">积分规则标识:<span></span></div>
								<div class="searchInput">
                	<el-input v-model.trim="tag" placeholder="请输入" @keyup.enter.native="search"></el-input>
								</div>
            </div>
            <div class="searchBox-wrapper searchBtn">
                <el-button  type="primary"  icon="search" @click="search">搜索</el-button>
            </div>
			<!--<el-button type="primary" class="pull-right" @click="newRule">新建积分规则</el-button>	-->
        </el-row>
        <el-row>
            <el-col>
                <el-table :data="tableData" stripe border style="width: 100%">
                    <el-table-column prop="ruleName" label="积分规则名称">
                    </el-table-column>
                    <el-table-column prop="point" label="积分值" >
                    </el-table-column>
                    <el-table-column prop="description" label="规则描述">
                    </el-table-column>
										<el-table-column prop="isExchange" label="是否用于平台兑换" align="center">
                      <template scope="scope">
                        <p>{{scope.row.isExchange?'是':'否'}}</p>
                      </template>
                    </el-table-column>
                    <el-table-column prop="isDisabled" label="启用状态" width="100" align="center">
                      <template scope="scope">
                        <p>{{scope.row.isDisabled?'否':'是'}}</p>
                      </template>
                    </el-table-column>
										<el-table-column label="操作" width="80" align="center">
											<template scope="scope">
												<el-button type="text" class="link" @click="modifyRule(scope.$index)">修改</el-button>
												<!-- <el-button type="text" class="link" @click="deleteRule(scope.row.id)">删除</el-button> -->
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

				<!-- 积分规则新增/修改 -->
				<el-dialog title="积分规则修改" :visible.sync="dialogFormVisible" size="tiny" @close="resetForm">
					<el-form :model="form" :rules="rules" ref="ruleForm" label-width="130px">
						<el-form-item label="积分规则名称:" prop="ruleName">
							<el-input :disabled="true" v-model="form.ruleName"></el-input>
						</el-form-item>
						<el-form-item label="积分规则标识:" prop="ruleCode">
							<el-input :disabled="true" v-model="form.ruleCode"></el-input>
						</el-form-item>
						<el-form-item label="积分值:" prop="point" >
							<el-input v-model.number="form.point"></el-input>
						</el-form-item>
						<!-- <el-form-item label="是否用于平台兑换:" prop="isExchange">
							<el-radio-group v-model="form.isExchange">
								<el-radio :label="true">是</el-radio>
								<el-radio :label="false">否</el-radio>
							</el-radio-group>
						</el-form-item> -->
						<el-form-item label="启用状态:" prop="isDisabled">
							<el-radio-group v-model="form.isDisabled">
								<el-radio :label="false">启用</el-radio>
								<el-radio :label="true">禁用</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item label="规则描述:" prop="description">
							<el-input type="textarea" v-model="form.description"></el-input>
						</el-form-item>
					</el-form>
					<div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submit">确 定</el-button>
						<el-button @click="dialogFormVisible = false">取 消</el-button>

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
			dialogFormVisible: false, // 弹出层显示/隐藏
			form: {
				id: '',
				ruleName: '', // 积分规则名称
				ruleCode: '', // 积分规则标识
				point: '', // 积分值
				isExchange: false, // 是否用于兑换三方平台
				isDisabled: false, // 是否禁用
				description: '', // 规则描述
			}, // 表单数据

			rules: {
				ruleName: [
					{ required: true, message: '请输入积分规则名称', trigger: 'blur' },
					{ min: 1, max: 20, message: '规则名称不能超过20个字符', trigger: 'blur' }
				],
				ruleCode: [
					{ required: true, message: '请输入积分规则标识', trigger: 'blur' },
					{ min: 1, max: 20, message: '规则标识不能超过20个字符', trigger: 'blur' }
				],
				point: [
					{ required: true, message: '积分值不能为空'},
          { type: 'number', message: '积分值必须为数字值'},
          { validator: checkNum, trigger: 'change' }
				],
				// 是否禁用
				isDisabled: [
					{type: "boolean",required: true,message: "请选择是否启用",trigger: "change"}
				],
				// 是否用于平台兑换
				isExchange: [
					{type: "boolean",required: true,message: "请选择是否用于平台兑换",trigger: "change"}
				],
				// 规则描述
				description: [
					{ required: true, message: '请输入规则描述', trigger: 'blur' },
					{ min: 1, max: 100, message: '内容长度不超过100个字符', trigger: 'blur' }
				]
			} // 表单验证
		}
	},
	created(){
		this.getPointRule();
	},
	methods:{
		/**获取积分规则 */
		getPointRule(){
			this.$axios.get('/pmpheep/writerPoint/pointrule/list',{
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
		/**搜索 */
		search(){
			this.pageSize = 20;// 每页条数
			this.pageNumber =  1;// 当前页
			this.getPointRule();
		},
		/**点击新增积分规则 */
		newRule(){
			this.type = 'new'; // 将type标志置为new
			this.dialogFormVisible = true; // 弹出层显示
		},
		/**点击修改积分规则 */
		modifyRule(index){
			this.type = 'modify'; // 将type标志置为modify
			this.dialogFormVisible = true; // 弹出层显示
			for (let key in this.form) {
        this.form[key] = this.tableData[index][key];
      }
		},
		/**新增积分规则 */
		addRule(){
			console.log(this.form);
			this.form.isExchange = false;
			this.$axios.post('/pmpheep/writerPoint/pointrule/add',this.$commonFun.initPostData(this.form)).then(response => {
				let res = response.data;
				if (res.code == '1') {
					console.log(this.dialogFormVisible)
					this.$message.success('成功增加一条积分规则!');
					this.dialogFormVisible = false;
					this.getPointRule();
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
		/**修改积分规则 */
		updateRule(){
			this.$axios.put('/pmpheep/writerPoint/pointrule/update',this.$initPostData({
					id : this.form.id,
					ruleName: this.form.ruleName,
					ruleCode: this.form.ruleCode,
					point: this.form.point,
					isExchange: this.form.isExchange,
					isDisabled: this.form.isDisabled,
					description: this.form.description
			})).then(response => {
				let res = response.data;
				if (res.code == '1') {
					this.$message.success('修改成功!');
					this.dialogFormVisible = false;
					this.getPointRule();
				} else{
					this.$confirm('修改失败!', "提示",{
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
		/**
		* 修改新增弹出点击确认按钮时触发提交表单操作
		*/
    submit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.type == 'new') {
            this.addRule();
          } else if (this.type == 'modify') {
          	this.updateRule();
					}
        } else {
          console.log("error submit!!");
          return false;
        }
      });
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
				id: '',
				ruleName: '', // 积分规则名称
				ruleCode: '', // 积分规则标识
				point: '', // 积分值
				isExchange: false, // 是否用于兑换三方平台
				isDisabled: false, // 是否禁用
				description: '', // 规则描述
			};
		},
		// 分页查询
		handleSizeChange(val){
			this.pageSize = val;
			this.getPointRule()
		},
		handleSizeChange(val){
			this.pageNumber = val;
			this.getPointRule()
		},
	}
};
</script>
<style>

</style>
