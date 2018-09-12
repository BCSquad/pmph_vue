<template>
  <div class="school-query">
    <clinical-choose-school ref="chooseSchool" @selectChange="selectChange" :default-history-id="productId">
      <!--<el-checkbox v-model="is_active" class="check" >查看当前公告<span style="color:red;">*</span></el-checkbox>-->
      <el-button type="primary" @click="exportExcel"  size="large">导出已发布学校名单</el-button>

      <el-button type="primary" @click="publishBtn" size="large" :disabled="!hasCheckedOrgList.length>0">
        发布
        <span v-if="hasCheckedOrgList.length>0">({{hasCheckedOrgList.length}})</span>
      </el-button>
      <el-button type="primary"   icon="arrow-left" @click="backHistory">返回上一步</el-button>
    </clinical-choose-school>


    <!--已选择院校预览-->
    <el-dialog
      title="已选中机构"
      :visible.sync="dialogVisible"
      size="tiny"
      >
      <div class=" marginB10">
        <el-button type="primary" :disabled="able" @click="submit">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>

      </div>
      <div class="table-wrapper" style="height: 700px; overflow-y: scroll;">
        <el-table
          :data="hasCheckedOrgList"
          stripe
          border
          style="width: 100%">
          <el-table-column
            label="序号"
          width="100"
          align="center">
            <template scope="scope">
              <p class="bg-none">{{scope.$index + 1}}</p>
            </template>
          </el-table-column>
          <el-table-column
            label="学校/医院名称">
            <template scope="scope">
              <p class="bg-none" v-html="scope.row.name"></p>
            </template>
          </el-table-column>
        </el-table>
      </div>


    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import ClinicalChooseSchool from "../../../../components/clinicalChooseSchool";
  export default {
    data() {
      return {
        api_export_excel:'/pmpheep/clinical/excel/published/org',
        type:'new',
        product_type:'',
        //is_active:true,
        able: false,
        reissueFormData:{
          id:'',
          title:'',
          content:'',
          file:'',
          sendType:1,
          orgIds:'',
          userIds:'',
          bookIds:'',
          senderId:''
        },
        formdata:{
          title:'',
          content:'',
          file:'',
          sendType:1,
          orgIds:'',
          userIds:'',
          bookIds:'',
        },
        dialogVisible:false,
        hasCheckedOrgList:[],
        productId: '',
        orgIds:[]
      };
    },
    methods: {
      /**
       * 点击发布按钮
       */
      publishBtn(){
        this.hasCheckedOrgList = this.$refs.chooseSchool.getSelectData();
        var arr = this.$refs.chooseSchool.getSelectData();
        this.orgIds=[];
        arr.forEach(item=>{
          this.orgIds.push(item.id)
        })
        // console.log(this.hasCheckedOrgList)
        this.dialogVisible=true;
      },
      /**
       * 选中学校发生变化时
       */
      selectChange(list){
        this.hasCheckedOrgList = list;
        this.able=false;
      },
      back(){
        //let queryName = '';
        switch (parseInt(this.product_type)) {
          case 1 : this.$router.push({name:'临床决策专家申报列表'});break;
          case 2 : this.$router.push({name:'用药助手专家申报列表'});break;
          case 3 : this.$router.push({name:'中医助手专家申报列表'});break;
          default: this.$router.push({name:'临床决策专家申报列表'});
        }
        //this.$router.push({name:'临床决策专家申报列表',query:{clinicaltype:this.product_type,queryName:queryName}});
      },
      backHistory(){
        this.$router.push({name:'临床决策专家申报',query:{product_id: this.productId,clinicaltype:this.product_type}})
      },
      /**
       * 确认提交表单
       */
      submit(){
        this.able = true;
        this.$axios.post('/pmpheep/product/published',this.$initPostData({
          productId: this.productId,
          orgIds: this.orgIds,
          sessionId:this.$getUserData().sessionId/*,
          is_active:this.is_active*/
        })).then(response => {
          let res = response.data
          if (res.code == '1') {
            this.$message.success('发布成功！');

            //this.$router.go(-1);
            this.back();
          } else {
            this.$confirm(res.msg.msgTrim(), "提示",{
            	confirmButtonText: "确定",
            	cancelButtonText: "取消",
            	showCancelButton: false,
            	type: "error"
            });

          }
          this.dialogVisible = false;
        }).catch(err => {
          this.$confirm('发布失败，请稍后再试！', "提示",{
          	confirmButtonText: "确定",
          	cancelButtonText: "取消",
          	showCancelButton: false,
          	type: "error"
          });
          this.dialogVisible = false;
        })
      },
      /**
       * 导出学校列表
       * @param id 教材id
       */
      exportExcel(){
        let url = this.api_export_excel+"?productId="+this.productId;
        this.$commonFun.downloadFile(url);
      }
    },
    components:{
      ClinicalChooseSchool
    },
    created(){
      this.productId = this.$route.query.productId;
      this.product_type = this.$route.query.product_type;
      // console.log(this.$route.params)
    },

  }
</script>

<style scoped>

</style>
