<template>
    <div class="new_book_release">
        <el-form ref="form" :model="formData" class="release_form" label-width="110px">
            <el-form-item label="教材名称：" class="marginB10">
                <span class="grey_span">{{formData.materialName}}</span>
            </el-form-item>
            <el-form-item label="教材轮次：" class="marginB10">
                <span class="grey_span">第{{formData.materialRound}}轮</span>
            </el-form-item>
            <el-form-item label="教材分类：" class="marginB10">
                <span class="grey_span">{{formData.materialType.join(' > ')}}</span>
            </el-form-item>

            <el-form-item label="教材调研表：" class="marginB10">
              <div class="material-survey">
                <div class="pull-right">
                  <el-button type="primary" size="small" @click="toModelList(true)" >添加模板</el-button>
                  <el-button type="primary" size="small" @click="saveSurveylist(true)" >保存关联</el-button>
                </div>
                <el-table
                  ref="multipleTable3"
                  border
                  stripe
                  :data="materialSurveyList"
                  tooltip-effect="dark"
                  style="width: 100%">

                  <el-table-column
                    prop="title"
                    label="调研表名称"
                    min-width="160">
                    <template scope="scope">
                      <el-input
                        placeholder="请输入"
                        class="searchInputEle border-radius-4"
                        icon="edit"
                        v-model.trim="scope.row.title"
                        :class="{'border-red':(!scope.row.title||scope.row.duplicateTitle)}"
                      ></el-input>
                      <span class="error fontsize-sm table-input-tips" v-if="!scope.row.title" style="left: 1.5em;bottom: 0em;line-height: 12px;">请输入调研表名称</span>
                      <span class="error fontsize-sm table-input-tips" v-if="scope.row.duplicateTitle" style="left: 1.5em;bottom: 0em;line-height: 12px;">调研表名称已存在</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="surveyName"
                    label="调研对象"
                    width="160">
                  </el-table-column>
                  <el-table-column
                    prop="requiredForMaterial"
                    label="是否必填"
                    width="100">
                    <template scope="scope">
                      <div class="paddingB15 paddingT10 relative">
                        <el-checkbox v-model="scope.row.requiredForMaterial"></el-checkbox>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="操作"
                    width="80">
                    <template scope="scope">
                      <el-button type="text" @click="deleteSurveyItem(scope.$index,true)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>


                <el-dialog title="调研表模板选择"
                           :visible.sync="modelDialogVislble"
                           size="large">

                  <chooseSurveyModel v-if="modelDialogVislble"
                                     :duplicateIdsSet="duplicateIdsSet"
                                     :selectedIdsSet="selectedIdsSet"
                                     ref="chooseSurveyModel">
                  </chooseSurveyModel>

                  <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="confrimModel">确 定</el-button>
                        <el-button @click="modelDialogVislble = false">取 消</el-button>

                      </span>
                </el-dialog>



              </div>
            </el-form-item>
            <el-form-item label="书籍调研表:">
              <div class="pull-left book-tab" :class="bookOrSurveySwitch?'underline':''" @click="bookOrSurveySwitch=true;">书目录</div>
              <div class="pull-left survey-tab" v-if="!bookOrSurveySwitch" :class="!bookOrSurveySwitch?'underline':''">调研表</div>
              <div class="survey_wrapper">
              <!--表格-->
              <div v-show="bookOrSurveySwitch" class="table-wrapper book-list-catalogue">

                <el-table
                  ref="multipleTable"
                  border
                  stripe
                  :data="extendListData"
                  tooltip-effect="dark"
                  style="width: 100%;float:left;">
                  <el-table-column
                    prop="sort"
                    label="书序"
                    width="160">
                  </el-table-column>
                  <el-table-column
                    prop="textbookName"
                    label="书籍名称"
                    width="420">
                  </el-table-column>
                  <el-table-column
                    prop="textbookRound"
                    label="版次"
                    width="160">
                  </el-table-column>
                  <el-table-column
                    prop="surveyNum"
                    label="调研表数量"
                    width="160">
                  </el-table-column>
                  <el-table-column
                    label="操作">
                    <template scope="scope">
                      <el-button type="text" :disabled="!(scope.row.textbookName&&scope.row.sort&&scope.row.textbookRound)" style="text-align-last: justify;width: 6.9em;margin: 0px;"
                                 @click="toSetServeyForBook(scope.row)">配置调研表</el-button>
                    </template>
                  </el-table-column>
                </el-table>

                <div class="out_bottom_box marginT60">
                  <div class="bottom_box">
                    <el-button type="primary" class="bottom_button" @click="save(true)" >保存，下一步</el-button>
                  </div>
                </div>
              </div>
              <div v-show="!bookOrSurveySwitch" >


                  <div class="pull-left surveyBookName">书籍名称：{{curSurveyBook.textbookName}}</div>
                  <div >
                    <div class="pull-right">
                      <el-button type="primary" size="small" @click="toModelList(false)" >添加模板</el-button>
                      <el-button type="primary" size="small" @click="saveSurveylist(false)" >保存关联</el-button>
                    </div>
                    <el-table
                      ref="multipleTable2"
                      border
                      stripe
                      :data="bookSurveyList"
                      tooltip-effect="dark"
                      style="width: 100%">
                      <el-table-column
                        prop="preVersionMaterialName"
                        label="上本教材名称"
                        min-width="160">
                        <template scope="scope">
                          <div class="paddingB15 paddingT10 relative">
                            <el-input
                              placeholder="请输入"
                              class="searchInputEle border-radius-4"
                              icon="edit"
                              v-model.trim="scope.row.preVersionMaterialName"
                            ></el-input>
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="preVersionMaterialRound"
                        label="上本教材版次"
                        width="160">
                        <template scope="scope">
                          <div class="paddingB15 paddingT10 relative">
                            <el-input
                              placeholder="请输入"
                              class="searchInputEle border-radius-4"
                              icon="edit"
                              v-model.trim="scope.row.preVersionMaterialRound"
                            ></el-input>
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="title"
                        label="调研表名称"
                        min-width="160">
                        <template scope="scope">
                          <el-input
                            placeholder="请输入"
                            class="searchInputEle border-radius-4"
                            icon="edit"
                            v-model.trim="scope.row.title"
                            :class="{'border-red':(!scope.row.title||scope.row.duplicateTitle)}"
                          ></el-input>
                          <span class="error fontsize-sm table-input-tips" v-if="!scope.row.title" style="left: 1.5em;bottom: 0em;line-height: 12px;">请输入调研表名称</span>
                          <span class="error fontsize-sm table-input-tips" v-if="scope.row.duplicateTitle" style="left: 1.5em;bottom: 0em;line-height: 12px;">调研表名称已存在</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="surveyName"
                        label="调研对象"
                        width="160">
                      </el-table-column>
                      <el-table-column
                        prop="requiredForWriter"
                        label="是否必填"
                        width="100">
                        <template scope="scope">
                          <div class="paddingB15 paddingT10 relative">
                            <el-checkbox v-model="scope.row.requiredForWriter"></el-checkbox>
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="操作"
                        width="80">
                        <template scope="scope">
                          <el-button type="text" @click="deleteSurveyItem(scope.$index,false)">删除</el-button>
                        </template>
                      </el-table-column>
                    </el-table>



                  </div>
                </div>
              </div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script type="text/javascript">

  import chooseSurveyModel from "../navContent/chooseSurveyModel";
  export default {
    data() {
        return {
            api_book_list:'/pmpheep/textBook/list/textbooks',
            api_save:'/pmpheep/textBook/add/textbook',
            api_save_book_survey:'/pmpheep/materialSurvey/saveBookSurvey',
            api_get_survey:'/pmpheep/materialSurvey/getSurveyByTextbook',
            api_get_titles:'/pmpheep/materialSurvey/getTitleAndTemplateId',
            api_upload:'/pmpheep/textBook/import/excel',
            formData: {
              materialId:'',
              materialName: '',
              materialType: [],
              materialRound: undefined,
              isPublic:false
            },
            modelDialogVislble:false,
            selectedIdsSet:new Set(),
            duplicateIdsSet:new Set(),
            selectedIdsMap:new Map(),
            bookOrSurveySwitch:true,
            allTextbookUsed:false,
            curSurveyBook:{
              id:'',
              textbookName:'testbookname中文'
            },
            bookSurveyList:[

            ],
            materialSurveyList:[],
            existedTitleList:[],
            uploadLoading:false,
            extendListData: [{
              id:'',
              sort: '',
              textbookName: '',
              textbookRound: '',
              sortIsOk : true,
              nameIsOk : true,
              roundIsOk : true,
            }],
            currentUserId:this.$getUserData().userInfo.id,
        }
    },
    methods: {
      /**
       * 获取当前教材下所有书籍
       * @param val
       */
      getBookList(){
        let _this = this;
        this.$axios.get(this.api_book_list,{params:{
          materialId:this.formData.materialId
        }})
          .then(response=>{
            var res = response.data;
            if(res.code==1){
              this.formData.materialName = res.data[0].materialName;
              this.formData.materialType = res.data[0].materialType;
              this.formData.materialRound = res.data[0].materialRound;
              this.formData.isPublic = !res.data[0].isPublic;
              var bookList =[];
              res.data.map(iterm=>{
                if(!!iterm.textbook){
                  iterm.textbook.sortIsOk = true;
                  iterm.textbook.nameIsOk = true;
                  iterm.textbook.roundIsOk = true;
                  bookList.push(iterm.textbook);
                }
              });
              if(bookList.length>0){
                this.extendListData = bookList;
                this.extendListData.forEach(function (item) {
                  if(item.textbookName == _this.curSurveyBook.textbookName){
                    _this.curSurveyBook = item;
                  }
                });
              }
            }
          })
          .catch(e=>{
            console.log(e);
          })
      },

      /**
       * 从书目录切换到调研表配置列表
       * */
      toSetServeyForBook(curSurveyBook){//id,textbookName){
        this.curSurveyBook = curSurveyBook;
        this.getSurveyList(false);
      },
      getSurveyList(allTextbookUsed){
        this.getTitleAndTemplateId();
        this.$axios.post(this.api_get_survey,this.$commonFun.initPostData({
          materialId:this.formData.materialId,
          textbookId:this.curSurveyBook.id,
          allTextbookUsed:allTextbookUsed
        }))
          .then((response) => {
            let res = response.data;
            console.log(res)
            if (res.code == '1') {
              console.log(res.data);
              if(allTextbookUsed){
                this.materialSurveyList = res.data;
              }else{
                this.bookSurveyList = res.data;
                this.bookOrSurveySwitch = false;
              }
            }
          })



      },
      /**
       * 打开选择模板对话框
       * */
      toModelList(allTextbookUsed){
        let _this = this;
        _this.selectedIdsSet.clear();
        _this.duplicateIdsSet.clear();

        if(allTextbookUsed){
          this.materialSurveyList.forEach(function(item){
            if(!_this.selectedIdsSet.has(item.templateId)){
              _this.selectedIdsSet.add(item.templateId);
            }
          });
        }else{
          this.materialSurveyList.forEach(function(item){
            _this.duplicateIdsSet.add(item.templateId);
          });

          this.bookSurveyList.forEach(function(item){
            if(!_this.selectedIdsSet.has(item.templateId)&&!_this.duplicateIdsSet.has(item.templateId)){
              _this.selectedIdsSet.add(item.templateId);
            }
          });

        }
        this.modelDialogVislble = true;
        this.allTextbookUsed = allTextbookUsed;
        console.log(_this.selectedIdsSet);



      },
      /**
       * 确认模板选择
       * */
      confrimModel(){
        let _this = this;
        this.selectedIdsSet = this.$refs.chooseSurveyModel.selectedIdsSet;
        this.selectedIdsMap = this.$refs.chooseSurveyModel.selectedIdsMap;

        let textBookId = _this.curSurveyBook.id;

        let nowSurveylist= _this.allTextbookUsed?_this.materialSurveyList:_this.bookSurveyList;


        _this.selectedIdsMap.forEach(function (value, key, map) {


          let isNewModel = true;
          nowSurveylist.forEach(function(item){
            if(item.templateId == key){
              isNewModel = false;
            }
          });
          /*新模板*/
          if(isNewModel){
            let temp = {templateId:key,
              title:value.templateName||'',
              templateName:value.templateName||'',
              intro:value.intro||'',
              typeId:value.typeId||2,
              userId:_this.currentUserId,
              materialId:_this.formData.materialId,
              surveyName:value.surveyName,
              preVersionMaterialName:_this.formData.materialName,
              preVersionMaterialId:_this.formData.materialId,
              preVersionMaterialRound:(_this.formData.materialRound>1?_this.formData.materialRound-1:1),
              allTextbookUsed:_this.allTextbookUsed
            };
            nowSurveylist.push(temp);
          }
        });

        this.modelDialogVislble = false;
      },

      /**
       * 删除入行
       * @param index
       */
      deleteSurveyItem(index,allTextbookUsed) {
        if(allTextbookUsed){
          this.materialSurveyList.splice(index, 1);
        }else{
          this.bookSurveyList.splice(index, 1);
        }

      },

      /**
       * 保存关联（产生调研表，与书籍相关联）
       * */
      saveSurveylist(allTextbookUsed){

        let nowSurveyList = allTextbookUsed?this.materialSurveyList:this.bookSurveyList;
        this.$axios.post(this.api_save_book_survey,this.$commonFun.initPostData({
          textbookId:this.curSurveyBook.id,
          materialId:this.formData.materialId,
          surveyListJson:JSON.stringify(nowSurveyList),
          allTextbookUsed:allTextbookUsed
        }))
          .then((response) => {
            let res = response.data;
            console.log(res)
            if (res.code == '1') {
                this.$message.success('保存成功！');

                if(!allTextbookUsed){
                  this.bookOrSurveySwitch = true;
                  this.getBookList();
                }else{
                  this.getSurveyList(allTextbookUsed);
                }
                //this.bookOrSurveySwitch = true;
            }else{
              this.$confirm(res.msg.msgTrim(), "提示",{
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                showCancelButton: false,
                type: "error"
              });
            }
          })
          .catch((error) => {
            this.$confirm('保存失败，请重试', "提示",{
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              showCancelButton: false,
              type: "error"
            });
          });
      },

      /**
       *
       */
      save(next){
        this.$router.push({name:'教材申报选择学校'});
      },
      getTitleAndTemplateId(){
        this.$axios.get(this.api_get_titles)
          .then((response) => {
            let res = response.data;
            console.log(res)
            if (res.code == '1') {
              this.existedTitleList = res.data;
            }
          })
      },
    },
  created(){
    this.formData.materialId = this.$route.params.materialId;
    //如果没有教材id则跳转到通知列表
    if(!this.formData.materialId){
      this.$router.push({name:'通知列表'});
    }
    if(this.formData.materialId!='new'){
      this.getBookList();
    }
    this.getSurveyList(true);
  },
  watch:{
    materialSurveyList:{
      //注意：当观察的数据为对象或数组时，curVal和oldVal是相等的，因为这两个形参指向的是同一个数据对象
      handler:function(newValue,oldVal){
        let _this = this;
        newValue.forEach(function (it) {
          it.duplicateTitle = false;
          _this.existedTitleList.forEach(function (et) {
            if(et.title == it.title && et.id!=it.id && et.templateId != it.templateId ){
              it.duplicateTitle = true;
              return false;
            }
          })
        })
      },
      deep:true
    },
    bookSurveyList:{
      //注意：当观察的数据为对象或数组时，curVal和oldVal是相等的，因为这两个形参指向的是同一个数据对象
      handler:function(newValue,oldVal){
        let _this = this;
        newValue.forEach(function (it) {
          it.duplicateTitle = false;
          _this.existedTitleList.forEach(function (et) {
            if(et.title == it.title && et.id!=it.id && et.templateId != it.templateId ){
              it.duplicateTitle = true;
              return false;
            }
          })
        })
      },
      deep:true
    },
  },

  components:{
    chooseSurveyModel
  },
}

</script>
<style scoped>
 .book-list-catalogue{
   /*max-width: 900px;*/
 }


.new_book_release .grey_span {
    color: #9c9c9c;
}

.new_book_release .grey_span .grey_button {
    color: #337ab7;
}

.new_book_release .grey_span .grey_button:hover {
    color: #23527c;
}

.new_book_release .upload {
    float: left;
}

.new_book_release .red_span {
    color: #f5596e;
}

.release_form .classify_input {
    width: 600px;
    margin-right: 20px;
}

.release_form .classify_button {
    color: #1abb9c;
}

.release_form .classify_button:hover {
    opacity: .9;
}

.new_book_release .checkTree_dialog .el-dialog__body{
    overflow: hidden;
}
.new_book_release .checkTree_dialog .tree_box {
    box-sizing: border-box;
    width: calc(100% - 100px);
    height: 200px;
    overflow-y: scroll;
    overflow-x: hidden;
    float: left;
}

.new_book_release .checkTree_dialog .tree_box::-webkit-scrollbar {
    display: none;
}

.new_book_release .checkTree_dialog .button {
    float: right;
}

.extend_list {
    width: 80%;
}

.extend_list tr {
    border: 1px solid #d4d4d4;
}

.extend_list tr td {
    width: 25%;
    color: #5e5e5e;
    text-align: center;
    padding: 5px 0;
}

.extend_list tr td i {
    margin-left: 5px;
    cursor: pointer;
}

.extend_list .add_button {
    color: #1ab194;
}

.extend_list .delete_button {
    color: #e57e2f;
}

.out_bottom_box {
    width: 100%;
    overflow: hidden;
    float:left;
}

.out_bottom_box .bottom_box {
    float: left;
    margin-left: 50%;
    transform: translateX(-50%);

}
  .table-input-tips{
    position: absolute;
    bottom: 7px;
    height: 12px;
    left: 0;
  }
  .surveyBookName{
    color: #148c75;
  }
  .survey_wrapper{
    /*float:left;*/
    border-top: 1px solid rgb(131, 143, 165);
    clear:left;
  }
 .survey_wrapper .pull-left{
   margin:0.5em 0em;
 }.survey_wrapper .pull-right{
    margin:0.5em 0em;
  }
  .book-tab{
    padding:0em 1em;
  }
  .survey-tab{
    padding:0em 1em;
  }
  .underline{
    border-bottom: 2px solid black;
  }
 tr.el-table__row {
   height: 5em;
 }
</style>
