
<template>
	<div class="bookManage">
    <div class="clearfix" :class="{powerSearch:powerSearch}">
      <!--高级搜索-->
      <div  v-if="powerSearch">
        <div class="searchBox-wrapper powerSearch" :class="{lg:powerSearchValue===2}">
          <el-select v-model="powerSearchValue" @change="powerSearchTypeChange" class="searchName" placeholder="请选择">
            <el-option
              v-for="item in powerSearchList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <div class="searchInput">
            <el-select v-model="searchForm.isNew" @change="search" placeholder="请选择" v-if="powerSearchValue===3">
              <el-option
                v-for="item in FilterNameList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>

            <el-select v-model="searchForm.isPromote" @change="search" placeholder="请选择" v-else-if="powerSearchValue===4">
              <el-option
                v-for="item in FilterNameList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>

            <el-select v-model="searchForm.isOnSale" placeholder="请选择" @change="search" v-else-if="powerSearchValue===5">
              <el-option
                v-for="item in FilterNameList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-cascader
              class="searchInputEle bookType"
              v-else-if="powerSearchValue===2"
              :options="bookTypeList"
              :props="{ label: 'typeName', value:'id', children: 'childrenMaterialTypeVO' }"
              :value="searchForm.typeId"
              @change="bookTypeChange"
              :change-on-select="true"
            ></el-cascader>
            <el-input placeholder="请输入" class="searchInputEle" v-model.trim="searchForm.name" @keyup.enter.native="search" v-else-if="powerSearchValue===1"></el-input>
          </div>
        </div>
        <div class="searchBox-wrapper searchBtn">
          <el-button  type="primary" icon="search" @click="getTableData">搜索</el-button>
        </div>
        <div class="searchBox-wrapper searchBtn">
          <el-button type="text" @click="toggleSearchType">高级搜索</el-button>
        </div>
      </div>
      <div v-else>
        <!--书名选择框-->
        <div class="searchBox-wrapper">
          <div class="searchName">书籍名称/ISBN：<span></span></div>
          <div class="searchInput">
            <el-input placeholder="请输入" class="searchInputEle"  @keyup.enter.native="search" v-model.trim="searchForm.name"></el-input>
          </div>
        </div>
        <!--书名选择框-->
        <div class="searchBox-wrapper lg">
          <div class="searchName">书籍类别：<span></span></div>
          <div class="searchInput">
            <el-cascader
              class="searchInputEle bookType"
              :options="bookTypeList"
              :props="{ label: 'typeName', value:'id', children: 'childrenMaterialTypeVO' }"
              :value="searchForm.typeId"
              @change="bookTypeChange"
              :change-on-select="true"
            ></el-cascader>
          </div>
        </div>
        <!--书名选择框-->
        <div class="searchBox-wrapper">
          <div class="searchName">是否新书推荐：<span></span></div>
          <div class="searchInput">
            <el-select v-model="searchForm.isNew" placeholder="请选择" @change="search">
              <el-option
                v-for="item in FilterNameList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <!--书名选择框-->
        <div class="searchBox-wrapper">
          <div class="searchName">是否重磅推荐：<span></span></div>
          <div class="searchInput">
            <el-select v-model="searchForm.isPromote" placeholder="请选择" @change="search">
              <el-option
                v-for="item in FilterNameList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <!--书名选择框-->
        <div class="searchBox-wrapper">
          <div class="searchName">是否上架：<span></span></div>
          <div class="searchInput">
            <el-select v-model="searchForm.isOnSale" placeholder="请选择" @change="search">
              <el-option
                v-for="item in FilterNameList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <!--搜索按钮-->
        <div class="searchBox-wrapper searchBtn">
          <el-button  type="primary" icon="search" @click="search">搜索</el-button>
        </div>
        <!--姓名搜索-->
        <div class="searchBox-wrapper searchBtn">
          <el-button type="text" @click="toggleSearchType">收起搜索区</el-button>
        </div>
      </div>
      <div class="operation-wrapper">
        <el-button type="primary" style="margin-right: 50px" @click="toSellWell()">图书畅销榜管理</el-button>
        <el-tooltip class="item" effect="dark" content="请按照模板格式上传!" placement="top">
          <my-upload
            class="ChatInputFileBtn"
            ref="upload"
            :action="api_upload"
            :before-upload="beforeUploadFile"
            :on-success="upLoadFileSuccess"
            :on-error="uploadError"
            :show-file-list="false">
            <el-button type="primary" :disabled="uploadLoading"  :loading="uploadLoading">{{uploadLoading?'正在上传解析中...':'配套图书导入'}}</el-button>
          </my-upload>
        </el-tooltip>
        <a href="/static/配套图书导入模版.xls"><el-button type="primary">配套图书导入模板下载</el-button></a>
        <!--<el-button type="primary" @click="syncBook(1)" :disabled="bookSyncVisible">{{bookSyncVisible?'正在同步中...':'图书全量同步'}}<i v-if="bookSyncVisible" class="fa fa-spinner fa-pulse loading"></i></el-button>-->
        <el-button type="primary" @click="syncBook(2)" :disabled="bookSyncVisible">{{bookSyncVisible?'正在同步中...':'图书增量同步'}}<i v-if="bookSyncVisible" class="fa fa-spinner fa-pulse loading"></i></el-button>
        <el-button type="primary" :disabled="!selectData.length" @click="bulkEditInfo">批量修改</el-button>
    </div>
    </div>
    <div class="table-wrapper clearfix">
      <el-table
        :data="tableData"
        ref="myMsgTable"
        border
        @row-click="bookClick"
        stripe
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="bookname"
          label="书籍名称" min-width="120">
        </el-table-column>
        <el-table-column
          prop="isbn"
          label="ISBN"
          width="200">
        </el-table-column>
        <el-table-column
          label="是否新书推荐"
          width="130">
          <template scope="scope">
            {{scope.row.isNew?'是':'否'}}
          </template>
        </el-table-column>
        <el-table-column
          label="是否重点推荐"
          width="130">
          <template scope="scope">
            {{scope.row.isPromote?'是':'否'}}
          </template>
        </el-table-column>
        <el-table-column
          label="是否上架"
          width="100">
          <template scope="scope">
            {{scope.row.isOnSale?'是':'否'}}
          </template>
        </el-table-column>
        <el-table-column
          label="书籍类别"
          min-width="120">
          <template scope="scope">
            {{scope.row.typeName}}
          </template>
        </el-table-column>
        <el-table-column
          label="书籍封面"
          min-width="120">
          <template scope="scope">
            <img style="width: 62px;height: 86px;" :src="scope.row.imageUrl">
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="120">
          <template scope="scope">
            <el-button type="text" @click="recommend(scope.row)">推荐</el-button>
            <el-button type="text" @click="editInfo(scope.row)">修改</el-button>
            <el-button type="text" @click="deleteBook(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--分页-->
    <div class="pagination-wrapper">
      <el-pagination
        v-if="totalNum > searchForm.pageSize"
        :page-sizes="[10,20,30, 40]"
        :page-size="searchForm.pageSize"
        :current-page.sync="searchForm.pageNumber"
        @size-change="paginationSizeChange"
        @current-change="getTableData"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum">
      </el-pagination>
    </div>

    <!--弹窗-->
    <el-dialog
      title="修改"
      :visible.sync="dialogVisible"
      size="tiny">
      <div>
        <el-form ref="form" :model="form" :rules="dialogRules" label-width="140px" class="form">
          <el-form-item label="是否首页置顶：" required>
            <el-radio-group v-model="form.isStick">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否新书推荐：" required>
            <el-radio-group v-model="form.isNew">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否重点推荐：" required>
            <el-radio-group v-model="form.isPromote">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否上架：" required>
            <el-radio-group v-model="form.isOnSale">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否重点学科：" required>
            <el-radio-group v-model="form.isKey">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <!--没有书签字段，暂时先去掉-->
          <!--<el-form-item label="标签：">-->
            <!--<el-select v-model="form.tags" multiple placeholder="请选择" class="searchInputEle bookType">-->
              <!--<el-option-->
                <!--v-for="item in tagsList"-->
                <!--:key="item.value"-->
                <!--:label="item.label"-->
                <!--:value="item.value">-->
              <!--</el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <el-form-item label="书籍类别：">
            <el-cascader
              class="searchInputEle bookType"
              :options="bookTypeList"
              :props="bookTypeProps"
              :value="form.typeId"
              @change="bookTypeChange_form"
              change-on-select
            ></el-cascader>
          </el-form-item>

          <el-form-item label="所属教材：">
            <el-select v-model="form.materialId" clearable filterable placeholder="请选择">
              <el-option
                v-for="item in materialList"
                :key="item.id"
                :label="item.materialName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="update">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>


    <el-dialog

      :visible.sync="recommendDialogVisible"
      fullscreen = "true"
      width="100%"

     >
      <span slot="title" class="el-dialog__title">{{recommendBookName}}</span>
      <div class="searchBox-wrapper" style="display:inline-block;">
        <div class="searchName">书籍名称/ISBN：<span></span></div>
        <div class="searchInput" >
          <el-input placeholder="请输入" class="searchInputEle"  @keyup.enter.native="recommendSearch" v-model.trim="recommendSearchForm.name"></el-input>
        </div>

      </div>
      <div style="display:inline-block;line-height: 36px;">
        <el-checkbox-group v-model="recommendSearchForm.checkList">
          <el-checkbox label="教材关联图书"></el-checkbox>
          <el-checkbox label="相关推荐"></el-checkbox>
          <el-checkbox label="人卫推荐"></el-checkbox>
        </el-checkbox-group>
      </div>



      <div style="text-align:right;margin-bottom:15px;display:inline-block;float:right;">
       <!-- <el-button @click="recommendDialogVisible = false">取 消</el-button>-->
        <el-button  @click="recommendSearch"  type="primary" icon="search" >搜索</el-button>
      </div>
      <el-table :data="recommendData" border  >
        <el-table-column property="bookname" label="书籍名称" width="150" align="center"></el-table-column>
        <el-table-column property="isbn" label="ISBN" width="150" align="center"></el-table-column>
        <el-table-column   label="教材关联图书" width="150" align="center">
          <template scope="scope">
          <el-checkbox v-model="scope.row.ischeckteachbook" @change="checkboxChange(1,scope.row)"></el-checkbox>
        </template>
        </el-table-column>
        <el-table-column   label="相关推荐"width="200" align="center">
          <template scope="scope">
            <el-checkbox v-model="scope.row.ischeckxgcommend" @change="checkboxChange(2,scope.row)"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column     label="人卫推荐" align="center" >
          <template scope="scope">
          <el-checkbox  v-model="scope.row.ischeckrwcommend" @change="checkboxChange(3,scope.row)"></el-checkbox>
        </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <div class="pagination-wrapper" style="padding-top:10px;padding-bottom:10px;">
        <el-pagination
          v-if="recommendTotalNum "
          :page-sizes="[10,20,30, 40]"
          :page-size="recommendSearchForm.recommendPageSize"
          :current-page.sync="recommendSearchForm.recommendPageNumber"
          @size-change="recommendPaginationSizeChange"
          @current-change="getRecommendTableData"
          layout="total, sizes, prev, pager, next, jumper"
          :total="recommendTotalNum">
        </el-pagination>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="sellWellDialogVisible"
      fullscreen = "true"
      width="100%"
    >

      <span slot="title" class="el-dialog__title">热销列表</span>

      <div class="divf" style="width: 45%" >
        <el-tabs  v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="教材" name="first"  ></el-tab-pane>
          <el-tab-pane label="考试用书" name="second"></el-tab-pane>
        </el-tabs>
      <div class="searchBox-wrapper" style="display:inline-block;">
        <div class="searchName">书籍名称/ISBN：<span></span></div>
        <div class="searchInput" >
          <el-input placeholder="请输入" class="searchInputEle"  @keyup.enter.native="sellWellSearch" v-model.trim="sellWellSearchForm.name"></el-input>
        </div>
      </div>
      <div style="text-align:right;margin-bottom:15px;display:inline-block;float:right;">
        <!-- <el-button @click="recommendDialogVisible = false">取 消</el-button>-->
        <el-button  @click="sellWellSearch"  type="primary" icon="search" >搜索</el-button>
      </div>
      <el-table :data="sellWellData" border  >
        <el-table-column property="bookname" label="书籍名称" width="150" align="center"></el-table-column>
        <el-table-column property="isbn" label="ISBN" width="150" align="center"></el-table-column>
        <el-table-column property="sales" label="销量" width="100" align="center"></el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button type="text" style="color:#337ab7;" @click="addSellWell(scope.row)" >添加</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <div class="pagination-wrapper" style="padding-top:10px;padding-bottom:10px;margin-top: 15px">
        <el-pagination
          v-if="sellWellTotalNum "
          :page-sizes="[10,20,30,40]"
          :page-size="sellWellSearchForm.sellWellPageSize"
          :current-page.sync="sellWellSearchForm.sellWellPageNumber"
          @size-change="sellWellPaginationSizeChange"
          @current-change="getSellWellTableDate"
          layout="total, sizes, prev, pager, next, jumper"
          :total="sellWellTotalNum">
        </el-pagination>
      </div>



      </div>
      <div class="divf" style="width: 50%;margin-left: 50px;margin-top: 55px;margin-bottom: 25px" >
        <div class="searchBox-wrapper" style="display:inline-block;">
          <div class="searchName">教材畅销榜：<span></span></div>
          <div class="searchInput" >

          </div>
        </div>
        <div style="text-align:right;margin-bottom:15px;display:inline-block;float:right;">
          <!-- <el-button @click="recommendDialogVisible = false">取 消</el-button>-->
          <el-button    type="primary" icon="save" @click="saveSellWell()" >保存</el-button>
        </div>
        <el-table :data="sellWelljcList" border  >
          <el-table-column property="bookname" label="书籍名称" width="150" align="center"></el-table-column>
          <el-table-column property="isbn" label="ISBN" width="150" align="center"></el-table-column>
          <el-table-column property="sales" label="销量" width="100" align="center"></el-table-column>
          <el-table-column label="操作">
            <template scope="scope">
              <el-button type="text" style="color:#337ab7;" @click="rmbyId(scope.$index,scope.row,1)"  >删除</el-button>
              <a  style="color:#337ab7;font-size: 18px" v-if="scope.$index!=0">|</a>
              <el-button type="text" style="color:#337ab7;"  v-if="scope.$index!=0" @click="sortUp(scope.$index,1)">上移</el-button>
              <a  style="color:#337ab7;font-size: 18px"  v-if="scope.$index<sellWelljcList.length-1">|</a>
              <el-button type="text" style="color:#337ab7;"   v-if="scope.$index<sellWelljcList.length-1" @click="sortDown(scope.$index,1)"> 下移</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="searchBox-wrapper" style="display:inline-block;">
          <div class="searchName">考试用书<span></span></div>
          <div class="searchInput" >

          </div>
        </div>
        <el-table :data="sellWellksysList" border  >
          <el-table-column property="bookname" label="书籍名称" width="150" align="center"></el-table-column>
          <el-table-column property="isbn" label="ISBN" width="150" align="center"></el-table-column>
          <el-table-column property="sales" label="销量" width="100" align="center"></el-table-column>
          <el-table-column label="操作">
            <template scope="scope">
              <el-button type="text" style="color:#337ab7;" @click="rmbyId(scope.$index,scope.row,2)"  >删除</el-button>
              <a  style="color:#337ab7;font-size: 18px" v-if="scope.$index!=0">|</a>
              <el-button type="text" style="color:#337ab7;"  v-if="scope.$index!=0" @click="sortUp(scope.$index,2)">上移</el-button>
              <a  style="color:#337ab7;font-size: 18px"  v-if="scope.$index<sellWellksysList.length-1">|</a>
              <el-button type="text" style="color:#337ab7;"   v-if="scope.$index<sellWellksysList.length-1" @click="sortDown(scope.$index,2)"> 下移</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--分页-->

      </div>
    </el-dialog>


     <!--同步弹窗-->
    <div class="shade" v-if="bookSyncVisible">
      <h1 class="text-center sync-title"><i class="fa fa-spinner fa-pulse loading"></i>正在同步……</h1>
      <el-progress class="progress" :text-inside="true" :stroke-width="18" :percentage="progresspoint" status="success"></el-progress>
    </div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
        activeName:'first',
        api_upload: '/pmpheep/books/bookExcel',
			  form:{
			    bookId:'',
          isStick:true,
          isNew:true,
          isPromote:true,
          isOnSale:true,
          isKey:true,
          typeId:[],
          materialId:'',
        },
        recommendData: [],
        sellWellData: [],
        sellWelljcList:[],
        sellWellksysList:[],
        sellWellSearchForm:{
          name:'',
          sellWellPageSize:10,
          sellWellPageNumber:1,
        },
        nameType:1,
        recommendSearchForm:{
          currentBookId:0,
          checkList:[],
          name:'',
          recommendPageSize:10,
          recommendPageNumber:1
        },
        checkNameArray:['教材关联图书','相关推荐','人卫推荐'],
        bookSyncVisible:false,
        bookSyncData:[],
			  searchForm:{
          typeId:[],
          isNew:'',
          isPromote:'',
          isOnSale:'',
          pageSize:30,
          pageNumber:1
        },
        totalNum:0,
        recommendTotalNum:0,
        sellWellTotalNum:0,
        sellWellDialogVisible:false,
        recommendDialogVisible:false,
        recommendBookName:'',
        dialogVisible:false,
        powerSearch:true,
        powerSearchValue:1,
        powerSearchList:[
          {value:1,
            label:'书籍名称/ISBN'},
          {value:2,
            label:'书籍类别'},
          {value:3,
            label:'是否新书推荐'},
          {value:4,
            label:'是否重磅推荐'},
          {value:5,
            label:'是否上架'
          }],
        tagsList:[{
          value: '1',
          label: '心理学'
        }, {
          value: '2',
          label: '护理'
        }, {
          value: '3',
          label: '临床'
        }],
        FilterNameList:[{
          value:'',
          label:'全部'
        },{
          value:true,
          label:'是'
        },{
          value:false,
          label:'否'
        }],
        tableData:[],
        selectData:[],
        bookTypeList: [],
        bookTypeProps: {
        children: "childrenMaterialTypeVO",
        label: "typeName",
        value:'id'
        },
        bookTypeSelected:[],
        materialList:[],
        uploadLoading:false,
        isUpload: false, // 是否同步
        progresspoint: 0,
        handleExportWordtimer: '',
        dialogRules:{
            typeId:[
              {type:'array',required:true,message:'请选择书籍类别',trigger:'change'}
            ]
        }
      }
		},
    methods:{
      getSellWellList(type){
        let _this=this;
        this.$axios.get('/pmpheep/books/getsellWellList',{params:{
            type:type
          }})
          .then(response=>{
            var res = response.data;

            if(res.code==1){
              console.log(res.data.rows);
              if(type==1){
                _this.sellWelljcList = res.data.rows;
              }else{
                _this.sellWellksysList= res.data.rows;
              }


            }
          }).catch(e=>{
          console.log(e);
        })
      },

      saveSellWell(){
        this.sellWelljcList.forEach((iterm,index)=>{
          iterm.sortSellWell = index;
          iterm.isSellWell=true;
        });
        this.sellWellksysList.forEach((iterm,index)=>{
          iterm.sortSellWell = index;
          iterm.isSellWell=true;
        });
        console.log(this.sellWelljcList);
        console.log(this.sellWellksysList);
        let list=this.sellWelljcList.concat(this.sellWellksysList);

        console.log(list);


        this.$axios.post('/pmpheep/books/addSellwell',list).then(response => {
          let res = response.data;
          if (res.code == '1') {

          } else{
            this.$confirm('保存失败,稍后再试!', "提示",{
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
		  sortDown(index,type){
        if(type==1) {
          var tempOption = this.sellWelljcList[index+1];
          this.$set(this.sellWelljcList, index+1, this.sellWelljcList[index]);
          this.$set(this.sellWelljcList, index, tempOption)
        }else {
          var tempOption2 = this.sellWellksysList[index+1];
          this.$set(this.sellWellksysList, index+1, this.sellWellksysList[index]);
          this.$set(this.sellWellksysList, index, tempOption2)
        }


      },
      sortUp(index,type){
        if(type==1) {
          var tempOption = this.sellWelljcList[index - 1];
          this.$set(this.sellWelljcList, index - 1, this.sellWelljcList[index]);
          this.$set(this.sellWelljcList, index, tempOption)
        }else {
          var tempOption2 = this.sellWellksysList[index - 1];
          this.$set(this.sellWellksysList, index - 1, this.sellWellksysList[index]);
          this.$set(this.sellWellksysList, index, tempOption2)
        }
      },

		  rmbyId(index,row,type){
        if(type==1) {
          this.sellWelljcList.splice(index,1)

        }else {
          this.sellWellksysList.splice(index,1)
        }
        this.$axios.get('/pmpheep/books/delSellWellById',{params:{
            id:row.id
          }})
          .then(response=>{
            var res = response.data;
            if(res.code==1){
              his.$message.success('删除成功');
            }
          }).catch(e=>{
          console.log(e);
        })

      },
      addSellWell(row){
        if (this.nameType != 1) {

          if(this.sellWellksysList.find((n) => n.id == row.id)){
            this.$message.error('请不要重复添加');
          }else{
            if(this.sellWellksysList.length<6){
              this.sellWellksysList.push(row)
            }else{
              this.$message.error('热销榜最多只能添加6本图书');
            }

          }
        } else {
          if(this.sellWelljcList.find((n) => n.id == row.id)){
            this.$message.error('请不要重复添加');
          }else{
            if(this.sellWelljcList.length<6){
              this.sellWelljcList.push(row)
            }else{
              this.$message.error('热销榜最多只能添加6本图书');
            }
          }

        }
      },
      handleClick(tab, event) {
        this.nameType=parseInt(tab.index)+1;
        this.getSellWellTableDate();
      },
      toSellWell(){
        this.sellWellDialogVisible=true;
        this.getSellWellList(1);
        this.getSellWellList(2);
        this.getSellWellTableDate()
      },
		  typeZh(val){
		    switch(typeof(val)){
          case 'boolean':
            return val;
          case 'String':
            if(val='true'){
              return true;
            }else{
              return false;
            }
        }
        return false;
      },
      recommendPaginationSizeChange(val){
        this.recommendSearchForm.recommendPageSize=val;
        this.recommendSearchForm.recommendPageNumber=1;
        this.getRecommendTableData();
      },
      checkboxChange(selectType,row){
        this.$axios.get('/pmpheep/books/recommendcheck',{params:{
            currentBookId:this.recommendSearchForm.currentBookId,
            selectType:selectType,
            recommendBookId:row.id,
            ischeckteachbook:row.ischeckteachbook,
            ischeckxgcommend:row.ischeckxgcommend,
            ischeckrwcommend:row.ischeckrwcommend
          }}).then(response=>{
          var res = response.data;
          if(res.code==1){ // 返回数据没有异常 回显数据 避免重复点击 数据操作异常
            switch (selectType) {
              case 1:
                row.ischeckteachbook = res.data;break;
              case 2:
                row.ischeckxgcommend = res.data; break;
              case 3:
                row.ischeckrwcommend = res.data;break;
            }
          }

        })
      },
      sellWellPaginationSizeChange(val){
        this.sellWellSearchForm.sellWellPageSize=val;
        this.sellWellSearchForm.sellWellPageNumber=1;
        this.getSellWellTableDate();
      },
      getSellWellTableDate(){
        let _this=this;
        this.$axios.get('/pmpheep/books/sellWellList',{params:{
            name:this.sellWellSearchForm.name,
            pageSize:this. sellWellSearchForm.sellWellPageSize,
            pageNumber:this. sellWellSearchForm.sellWellPageNumber,
            type:this.nameType
          }})
          .then(response=>{
            var res = response.data;
            if(res.code==1){
              _this.sellWellTotalNum = res.data.total;
              _this.sellWellData = res.data.rows;
            }
          }).catch(e=>{
          console.log(e);
        })
      },
      sellWellSearch(){
        this.sellWellSearchForm.sellWellPageNumber=1;
        this.getSellWellTableDate();
      },
      getRecommendTableData(){
        console.log(this.recommendSearchForm.checkList);
        let ischeckteachbook ;
        let ischeckxgcommend ;
        let ischeckrwcommend ;
        //debugger;
       if(this.recommendSearchForm.checkList.find((n)=>n=='教材关联图书') != undefined){
         ischeckteachbook = true;
       }
       if(this.recommendSearchForm.checkList.find((n)=>n=='相关推荐') != undefined){
         ischeckxgcommend = true;
       }

        if(this.recommendSearchForm.checkList.find((n)=>n=='人卫推荐') != undefined){
          ischeckrwcommend = true;
        }
        this.$axios.get('/pmpheep/books/recommendlist',{params:{
          name:this.recommendSearchForm.name,
            currentBookId:this.recommendSearchForm.currentBookId,
            recommendPageSize:this.recommendSearchForm.recommendPageSize,
            recommendPageNumber:this.recommendSearchForm.recommendPageNumber,
            ischeckteachbook:ischeckteachbook,
            ischeckxgcommend:ischeckxgcommend,
            ischeckrwcommend:ischeckrwcommend
          }})
          .then(response=>{
              var res = response.data;
              if(res.code==1){
                this.recommendTotalNum = res.data.total;
                this.recommendData = res.data.rows;

              }

          }).catch(e=>{
          console.log(e);
        })
      },
      recommendSearch(){
        this.recommendSearchForm.recommendPageNumber=1;
        this.getRecommendTableData();
      },
      /**
       * 获取表格数据
       */
      getTableData(){
        let id = this.bookTypeSelected[this.bookTypeSelected.length-1];
        let path = '';

        this.$commonFun.recurveList(this.bookTypeList,'childrenMaterialTypeVO',(iterm)=>{
            if(id==iterm.id){
                path=iterm.path;
            }
        })
        this.$axios.get('/pmpheep/books/list',{params:{
          name:this.searchForm.name,
          path:path,
          type:id,
          isNew:this.searchForm.isNew,
          isPromote:this.searchForm.isPromote,
          isOnSale:this.searchForm.isOnSale,
          pageSize:this.searchForm.pageSize,
          pageNumber:this.searchForm.pageNumber
        }})
          .then(response=>{
            var res = response.data;
            if(res.code==1){
              this.totalNum = res.data.total;
              res.data.rows.map(iterm=>{
                  iterm.path = iterm.path + '-' + iterm.type;
//                  iterm.isbn = iterm.isbn?iterm.isbn.replace('ISBN ',''):'';
              });
              this.tableData = res.data.rows;
            }
          })
          .catch(e=>{
            console.log(e);
          })
      },
      search(){
        this.searchForm.pageNumber=1;
        this.getTableData();
      },
      /**
       * 获取书籍类别树数据
       */
      getBookType(){
        console.log(111);
        this.$axios.get('/pmpheep/books/list/materialType')
          .then((response)=>{
            var res = response.data;
            if(res.code==1){
              res.data.typeName='全部';
              res.data.path='';
              this.bookTypeList = res.data.childrenMaterialTypeVO;
            }
          })
          .catch(e=>{
            console.log(e);
          })
      },
      /**
       * 点击展开收起高级搜索文字按钮
       */
      toggleSearchType(){
        //表单重置
        this.searchForm.name='';
        this.searchForm.typeId=[];
        this.searchForm.isNew='';
        this.searchForm.isPromote='';
        this.searchForm.isOnSale='';

        this.bookTypeSelected=[];
        this.powerSearch=!this.powerSearch;
      },
      /**
       * 表格复选框发生变化触发事件
       */
      handleSelectionChange(val) {
        this.selectData = val;
      },

      recommend(row){
        this.recommendSearchForm.recommendPageNumber=1;
        this.recommendBookName = row.bookname;
        this.recommendSearchForm.currentBookId = row.id;
        this.recommendDialogVisible = true;
        this.getRecommendTableData();
      },
      /**
       * 点击表格中的修改按钮
       * @param row
       */
      editInfo(row){
        var typelist = []
        this.form.bookId = row.id;
        this.form.isNew = row.isNew;
        this.form.isKey=row.isKey;
        this.form.isOnSale = row.isOnSale;
        this.form.isPromote = row.isPromote;
        this.form.materialId = row.materialId;
        this.form.isStick = row.stick;
        typelist = row.path?row.path.split('-'):[];
        typelist.forEach((t,i)=>{
          typelist[i]=parseInt(t);
        });
        typelist.shift();
        this.form.typeId = typelist;
        console.log(row.path,this.form.typeId);
        this.dialogVisible=true;
      },
      /**
       * 批量修改
       */
      bulkEditInfo(){
        this.dialogVisible=true;
        var ids = [];
        this.selectData.forEach(iterm=>{
          ids.push(iterm.id);
        })
        this.form.bookId = ids.join(',');
        this.form.isNew = true;
        this.form.isOnSale = true;
        this.form.isPromote = true;
        this.form.isStick = true;
        this.form.typeId = [];
      },
      /**
       * 级联下拉值变化时触发此方法
       * @param res
       */
      bookTypeChange(res){
        this.bookTypeSelected=res;
      },
      bookTypeChange_form(res){
        console.log('11111',res);
        this.form.typeId=res;
      },
      /**
       * update
       */
      update(){
        if(!this.form.typeId.length){
            this.$confirm('请选择书籍类别！', "提示",{
            	confirmButtonText: "确定",
            	cancelButtonText: "取消",
            	showCancelButton: false,
            	type: "error"
            });
            return;
        }
        let type = this.form.typeId[this.form.typeId.length-1];
        type=type?type:0;
        console.log(this.form,type);
        this.$axios.put('/pmpheep/books/update',this.$commonFun.initPostData({
          ids:this.form.bookId,
          isNew:this.form.isNew,
          isPromote:this.form.isPromote,
          isOnSale:this.form.isOnSale,
          isKey:this.form.isKey,
          isStick:this.form.isStick,
          type:type,
          materialId:this.form.materialId||'',
        }))
          .then(response=>{
            let res = response.data;
            if(res.code==1){
              this.$message.success('修改成功');
              this.dialogVisible=false;
              this.getTableData();
            }else{
              this.$confirm('修改失败，请重试！', "提示",{
              	confirmButtonText: "确定",
              	cancelButtonText: "取消",
              	showCancelButton: false,
              	type: "error"
              });
            }
          })
          .catch(e=>{
            console.log(e);
            this.$confirm('修改失败，请重试！', "提示",{
            	confirmButtonText: "确定",
            	cancelButtonText: "取消",
            	showCancelButton: false,
            	type: "error"
            });
          })
      },
      /**
       *
       * @param row
       */
      deleteBook(row){
        this.$confirm("确定删除该图书?", "提示",{
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(()=>{
            this.$axios.delete('/pmpheep/books/delete',{params:{
              id:row.id
            }})
              .then(response=>{
                let res = response.data;
                if(res.code==1){
                  this.$message.success('删除成功');
                  this.getTableData();
                }else{
                  this.$confirm('删除失败，请重试！', "提示",{
                  	confirmButtonText: "确定",
                  	cancelButtonText: "取消",
                  	showCancelButton: false,
                  	type: "error"
                  });
                }
              })
              .catch(e=>{
                console.log(e);
                this.$confirm('删除失败，请重试！', "提示",{
                	confirmButtonText: "确定",
                	cancelButtonText: "取消",
                	showCancelButton: false,
                	type: "error"
                });
              })
          })
          .catch(e=>{})

      },
      /**
       * 分页每页显示条数发生改变
       * @param val
       */
      paginationSizeChange(val){
        this.searchForm.pageSize=val;
        this.searchForm.pageNumber=1;
        this.getTableData();
      },
      /**
       * 高级搜索切换搜索条件时
       */
      powerSearchTypeChange(val){
        this.searchForm.name='';
        this.searchForm.typeId=[];
        this.searchForm.isNew='';
        this.searchForm.isPromote='';
        this.searchForm.isOnSale='';
      },
      /**
       *
       * @param row
       */
      bookClick(row){
        console.log(row);
        _hmt.push(['_trackPageview', '/book/'+row.bookname]);
        _hmt.push(['_trackEvent’', 'book', 'pageView', row.bookname])
      },
      /**
       * 获取教材列表
       */
      getMaterialList(){
        this.$axios.get('/pmpheep/material/published')
          .then((response)=>{
            var res = response.data;
            if(res.code==1){
              this.materialList = res.data;
              console.log(this.materialList);
            }
          })
          .catch(e=>{
            console.log(e);
          })
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
        if(file.name.length>40){
          this.$confirm("文件名不能超过40个字符", "提示",{
          	confirmButtonText: "确定",
          	cancelButtonText: "取消",
          	showCancelButton: false,
          	type: "error"
          });
          return;
        }
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
          this.$message.success('上传成功!');
        }else{
          this.$confirm(res.data.msg.msgTrim(), "提示",{
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
      /**
       * 图书同步
       * @param type 1 - 全量同步 2- 增量同步
       */
      syncBook(type) {
        this.isUpload = true;
        this.bookSyncVisible = true;
        this.syncProgress();
        this.$axios.get('/pmpheep/books/allsynchronization',{
          params: {
            type : type
          }
        }).then(response => {
          let res = response.data;
          if (res.code == 1) {
          } else {
            this.$confirm(res.msg.msgTrim(), "提示",{
            	confirmButtonText: "确定",
            	cancelButtonText: "取消",
            	showCancelButton: false,
            	type: "error"
            });
          }
        }).catch(error => {
       /*   this.$confirm('同步错误，请稍后再试!', "提示",{
          	confirmButtonText: "确定",
          	cancelButtonText: "取消",
          	showCancelButton: false,
          	type: "error"
          });*/
        })
      },
      syncProgress(){
//        this.progress();
        this.isUpload = true;
        this.continueSync();
      },
      continueSync(){
        var timeout = 3*60*1000;//设置3分钟超时
        var useTime = 0;
        window.handleExportWordtimer = setInterval(()=>{
          useTime+=30000;
          this.$axios.get('/pmpheep/books/isEnd')
            .then(response=>{
              let res = response.data;
              if(res.code==1){
                if (res.data == 0) {
                  clearInterval(window.handleExportWordtimer);
                  this.isUpload = false;
                }else {
                  this.progresspoint = res.data;
                }
              }
            })
//            .catch(e=>{
//              console.log(e);
//              if(this.isUpload){
//                this.$message.error('同步失败，请重试！');
//                clearInterval(this.handleExportWordtimer);
//              }
//            })
//          //超时提醒
//          if(useTime>timeout){
//            this.$message.error('同步请求超时，请重试！');
//            clearInterval(this.handleExportWordtimer);
//          }
        },30000)
      },
      progress(){
        this.$axios.get('/pmpheep/books/isEnd')
          .then(response=>{
            let res = response.data;
            if(res.code==1){
              if (res.data == 0) {
                this.bookSyncVisible = false;
              } else {
                this.bookSyncVisible = true;
                this.progresspoint = res.data;
                this.continueSync();
              }
            }
          })
//          .catch(e=>{
//            console.log(e);
//            if(this.isUpload){
//              this.$message.error('导出失败，请重试！');
//            }
//          })
      }
    },
    destroyed () {
      clearInterval(window.handleExportWordtimer);
    },
    created(){
		  this.getTableData();
		  this.getBookType();
      this.getMaterialList();
      this.progress();
		  if(window._hmt){
        _hmt.push(['_trackPageview', '/index']);
      }
    },
	}
</script>

<style>
  .el-dialog--small {
    width: 70% !important;
  }
</style>
<style   scoped>

  .searchBox-wrapper{
      width: 340px;
    padding-left:0px;
    }
  .searchBox-wrapper .searchName{
    width: 110px;
  }
  .searchBox-wrapper .searchInput{
    margin-left: 114px;
  }
  .searchBox-wrapper.searchBtn{
    width: 100px;
  }
  .powerSearch .searchName{
    width: 140px;
  }
  .powerSearch .searchBox-wrapper .searchInput{
    margin-left: 144px;
  }
  .searchBox-wrapper.lg{
    width: 500px;

  }
  .bookType{
    width: 100% !important;
    max-width: 100% !important;
  }
  .form .bookType{
    width: 100% !important;
    max-width: 320px !important;
  }
  .ChatInputFileBtn{
    position: relative;
    top: 13px;
    margin-right: 10px;
  }
  .shade{
    position: absolute;
    z-index:10000;
    background: rgba(0,0,0,.5);
    width: 100%;
    height:100%;
    top:0;
    left:0;
  }
  .progress{
    position: relative;
    top:25%;
    width: 80%;
    margin:0 auto;
    z-index: 10001;
  }
  .sync-title{
    color: #ffffff;
    position: relative;
    top:24%;
  }
  .divf{
    float: left;
  }
</style>
