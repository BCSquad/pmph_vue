/**
* 封装一个临床的树的组件：提供两个功能 查询和删除 查询树节点数据，删除节点数据
*
* defaultProps：
      参数	说明	类型	可选值	默认值
      label	指定节点标签为节点对象的某个属性值	string, function(data, node)	—	—
      children	指定子树为节点对象的某个属性值	string	—	—
      disabled	指定节点选择框是否禁用为节点对象的某个属性值	boolean, function(data, node)	—	—
      isLeaf	指定节点是否为叶子节点，仅在指定了 lazy 属性的情况下生效	boolean, function(data, node)	—	—

expand-on-click-node:
        是否在点击节点的时候展开或者收缩节点，
        默认值为 true，
        如果为 false，则只有点箭头图标的时候才会展开或者收缩节点。	boolean	—	true
show-checkbox:
        节点是否可被选择 boolean false
check-on-click-node:
        是否在点击节点的时候选中节点，默认值为 false，即只有在点击复选框时才会选中节点。
filter-node-method:
        对树节点进行筛选时执行的方法，返回 true 表示这个节点可以显示，返回 false 则表示这个节点会被隐藏  Function(value, data, node)
load:
        加载子树数据的方法，仅当 lazy 属性为true 时生效  function(node, resolve)
node-key:
        每个树节点用来作为唯一标识的属性，整棵树应该是唯一的  String
empty-text:
        内容为空的时候展示的文本  String
highlight-current:
        是否高亮当前选中节点，默认值是 false。 boolean
auto-expand-parent:
        展开子节点的时候是否自动展开父节点 boolean true
default-expanded-keys:
        默认展开的节点的 key 的数组 array
node-click:
        节点被点击时的回调  共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身。

**/

<template>
  <div class="pmph-tree">
    <div class="clearfix">
      <div style="float:left;width: 320px" >
        <el-input placeholder="输入关键字进行过滤" style="float:left;width: 220px" v-model="filterText" class="searchClass">
        </el-input>
        <div style="float:right;width: 80px">
          <el-button type="primary"  >查询</el-button>
        </div>

      </div>

      <div class="operation-wrapper">
        <span class="pull-right"><a style="color: #337ab7;line-height:36px;margin-left:10px;" href="/static/内容分类导入模板.xlsx">模板下载.xls</a></span>
        <my-upload
          class="pull-right "
          ref="upload"
          :action="api_upload_content"
          :before-upload="beforeUploadFile"
          :on-success="upLoadFileSuccess"
          :on-error="uploadError"
          :show-file-list="false">
          <el-button type="primary" :disabled="uploadLoading"  :loading="uploadLoading" >{{uploadLoading?'上传解析中...':'点击导入'}}</el-button>
        </my-upload>
        <el-button type="danger" @click="_del" style="margin-right:20px;" :disabled="!hasSelected"> 删除 </el-button>
      </div>
    </div>
    <div  class="table-wrapper">
     <!--
     构建内容分类树 需要用到查询 查询在懒加载中无法实现
     lazy
      :load="loadNode1"
      :default-expanded-keys="default_expanded_keys"

      -->
      <el-tree
        class="filter-tree"
        :data="treeData"
        :props="defaultProps"
        :expand-on-click-node=false
        default-expand-all
        node-key="id"
        empty-text="暂无数据，请先导入"
        :filter-node-method="filterNode"
        :highlight-current=true
        @node-click="_handleNodeClick"
        ref="tree2">
        <!--
        highlight-current=true

        auto-expand-parent
         :filter-node-method="filterNode" 引用懒加载的方式 不能查询 这里采用其他方法
          show-checkbox
        check-on-click-node="true"  复选框不要
        -->
        <!-- solt scope 组件 没法用 需要升级组件到2.3.7版本，升级版本后会出现多个问题 除样式 还有一些组件的属性变了
        <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
                <span>
                 &lt;!&ndash; <el-button
                    type="text"
                    size="mini"
                    @click="() => append(data)">
                    Append
                  </el-button>&ndash;&gt;
                  <el-button
                    type="text"
                    size="mini"
                    @click="() => remove(node, data)">
                    Delete
                  </el-button>
                </span>
              </span>-->
      </el-tree>
    </div>
  </div>

</template>

<script>
  export default {
    name: "clic_tree",
    props:['productType'],
    data() {
      return {
        id : 1000,
        api_lazyclic_list:'/pmpheep/productType/clic/tree',
        api_notlazyclic_list:'/pmpheep/productType/clic/notLazytree',
        api_upload_content: '/pmpheep/productType/'+this.productType+'/content/importExcel',
        api_clic_delete:'/pmpheep/productType/clic/delete',
        filterText: '',
        treeData: [],
        hasSelected: false,
        uploadLoading:false,
        default_expanded_keys:[0], //默认展开树节点
        dialogForm: {
          typeName: "",
          parent_id: "",
          //path: ""
        },
        defaultProps: {
          children: 'childType',
          label: 'type_name',
          isLeaf: 'isLeaf',
         // disabled:this.ishaveChildFun
        }
      };
    },
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },
    created(){
      this._getTreeNotLazy();
    },
    methods: {
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
        this.uploadLoading=flag;
        return flag;
      },
      /**
       * 上传文件请求成功的回调
       */
      upLoadFileSuccess(res, file, fileList){
        if (res.code == '1') {
          //this._getTree("-1");
          this._getTreeNotLazy();
          this.$message.success("导入成功");
          console.log(res);
        }else{
          this.$confirm(res.msg.msgTrim(), "提示",{
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            showCancelButton: false,
            type: "error"
          });
        }
        var _this = this;

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
        var _this = this;
        this.uploadLoading = false;
      },

      _search(){
        this._getTreeNotLazy()
      },
      /**
       * 非懒加载的方式加载树
       * */
      _getTreeNotLazy(){
        this.$axios.get(this.api_notlazyclic_list,{params:{
            parentId:0,
            productType:this.productType,
            type_name:this.filterText
          }})
          .then(response => {
            let res = response.data;
            if (res.code == 1) {
              this.treeData = [res.data];
              // if(this.treeData.length>0){
              //   this.default_expanded_keys = [this.treeData[0].id];
              // }
            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      /**
       * 懒加载的方式请求组织树
       */
      _getTree(id='-1',callback) {
        this.$axios.get(this.api_lazyclic_list,{params:{
            parentId:id,
            productType:this.productType
          }})
          .then(response => {
            let res = response.data;
            if (res.code == 1) {
              if(callback){
                callback(res.data);
              }
              if(id!='-1'){
                return;
              }
              this.treeData = [res.data];
              if(this.treeData.length>0){
                this.default_expanded_keys = [this.treeData[0].id];
              }
            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      /**
       * 点击节点
       */
      _handleNodeClick(data,node){
        this.hasSelected = true;
        //this.dialogForm.path = data.path;
        //console.log(data)
        this.dialogForm.parent_id = data.id;
        //this.$emit('node-click',data)
        //console.log(data,node);
      },
     /* ishaveChildFun(data, node){
        if(node.children&&!node.leaf){
          return true;
        }else{
          return false;
        }
      },*/
      loadNode1(node, resolve) {
        console.log(node);
        this._getTree(node.key,(data)=>{
          resolve(data.childType);
        })
      },
      /**
       * 删除子节点
       */
      _del(){
        this.$confirm("确定删除选中分类吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$axios
              .delete(this.api_clic_delete, {
                params: {
                  id: this.dialogForm.parent_id
                }
              })
              .then(res => {
                console.log(res);
                if (res.data.code == 1) {
                  this.$message.success("删除成功");
                  //this._getTree();
                  this._getTreeNotLazy();
                  //this.$emit('delete-node');
                }else{
                  this.$confirm(res.data.msg.msgTrim(), "提示",{
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    showCancelButton: false,
                    type: "error"
                  });
                }
              })
              .catch(e=>{console.log(e)})
          })
          .catch(() => {});
      },
      filterNode(value, data) {
        if (!value) return true;
        //console.log(data);
        return data.type_name.indexOf(value) !== -1; //这里还缺少一个正则表达式匹配红字
      },
      /*append(data) {
        const newChild = { id: this.id++, label: 'testtest', children: [] };
        if (!data.children) {
          this.$set(data, 'children', []);
        }
        data.children.push(newChild);
      },*/
      // remove(node, data) {
      //   const parent = node.parent;
      //   const children = parent.data.children || parent.data;
      //   const index = children.findIndex(d => d.id === data.id);
      //   children.splice(index, 1);
      // },
    },


  };
</script>

<style scoped>
  .treeContent{
    position: relative;
    padding-left:20px;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .searchClass{
    padding: 0px 20px;
    /*width: 50%;*/
    /*margin: 0 auto;*/
    position: relative;
    /*left: 25%;*/
    box-sizing: border-box;
  }
</style>
