<template>
	<div class="material-result">
    <el-tabs v-model="activeChilidName" @tab-click="handleTabsClick" ref="tabs">
      <el-tab-pane label="学科分类" name="subject" >
        <div class="applicationStatistics-byBookName">
        <!--搜索-->
        <div class="clearfix">
          <div class="searchBox-wrapper">
            <div class="searchName">学科分类：<span></span></div>
            <div class="searchInput">
              <el-input placeholder="请输入" class="searchInputEle" v-model.trim="subject.type_name" @keyup.enter.native="getSubjectTableDataFun"></el-input>
            </div>
          </div>
          <div class="searchBox-wrapper searchBtn">
            <el-button  type="primary" icon="search" @click="getSubjectTableDataFun">搜索</el-button>
          </div>
          <el-button type="primary" class="pull-right" @click="exportSubjectExcel">
            <i class="fa fa-cloud-upload" aria-hidden="true"></i>
            导出
          </el-button>
        </div>
        <!--表格-->
        <div class="table-wrapper">
          <el-table
            :data="subjectTableData"
            border
            style="width: 100%">
            <el-table-column
              prop="typeName"
              label="学科分类">
            </el-table-column>
            <el-table-column
              prop="countSubmit"
              label="申报人数"
              align="center"
              width="110">
            </el-table-column>
            <el-table-column
              prop="countSuccess"
              label="通过人数"
              align="center"
              width="120">
            </el-table-column>
          </el-table>
        </div>
        <!--分页-->
        <div class="pagination-wrapper">
          <el-pagination
            v-if="subjectTotal>subject.pageSize"
            @size-change="subjectSizeChange"
            @current-change="subjectCurrentChange"
            :page-sizes="[10,20,30, 50, 100]"
            :page-size="subject.pageSize"
            :current-page="subject.pageNumber"
            layout="total, sizes, prev, pager, next, jumper"
            :total="subjectTotal">
          </el-pagination>
        </div>
       <div class="echart-wrapper" ref="echart_wrapper">
          <div id="echarts1" style="width: 100%;height:600px;" ref="echarts1"></div>
        </div>
      </div>
      </el-tab-pane>
      <el-tab-pane label="申报专业" name="profession" >
        <div class="applicationStatistics-byBookName">
          <!--搜索-->
          <div class="clearfix">
            <div class="searchBox-wrapper">
              <div class="searchName">申报专业：<span></span></div>
              <div class="searchInput">
                <el-input placeholder="请输入" class="searchInputEle" v-model.trim="profession.type_name" @keyup.enter.native="getProfessionTableDataFun"></el-input>
              </div>
            </div>
            <div class="searchBox-wrapper searchBtn">
              <el-button  type="primary" icon="search" @click="getProfessionTableDataFun">搜索</el-button>
            </div>
            <el-button type="primary" class="pull-right" @click="exportProfessionExcel">
              <i class="fa fa-cloud-upload" aria-hidden="true"></i>
              导出
            </el-button>
          </div>
          <!--表格-->
          <div class="table-wrapper">
            <el-table
              :data="professionTableData"
              border
              style="width: 100%">
              <el-table-column
                prop="typeName"
                label="申报专业">
              </el-table-column>
              <el-table-column
                prop="countSubmit"
                label="申报人数"
                align="center"
                width="110">
              </el-table-column>
              <el-table-column
                prop="countSuccess"
                label="通过人数"
                align="center"
                width="120">
              </el-table-column>
            </el-table>
          </div>
          <!--分页-->
          <div class="pagination-wrapper">
            <el-pagination
              v-if="professionTotal>profession.pageSize"
              @size-change="professionSizeChange"
              @current-change="professionCurrentChange"
              :page-sizes="[10,20,30, 50, 100]"
              :page-size="profession.pageSize"
              :current-page="profession.pageNumber"
              layout="total, sizes, prev, pager, next, jumper"
              :total="professionTotal">
            </el-pagination>
          </div>
          <div class="echart-wrapper" ref="echart_wrapper">
            <div id="echarts3" style="width: 100%;height:600px;" ref="echarts3"></div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="内容分类" name="content" ref="content" >
        <div class="applicationStatistics-byContent">
          <!--搜索-->
          <div class="clearfix">
            <div class="searchBox-wrapper">
              <div class="searchName">内容分类：<span></span></div>
              <div class="searchInput">
                <el-input placeholder="请输入" class="searchInputEle" v-model.trim="content.type_name" @keyup.enter.native="getContentTableDataFun"></el-input>
              </div>
            </div>
            <div class="searchBox-wrapper searchBtn">
              <el-button  type="primary" icon="search" @click="getContentTableDataFun">搜索</el-button>
            </div>
            <el-button type="primary" class="pull-right marginL10" @click="exportContentExcel">
              <i class="fa fa-cloud-upload" aria-hidden="true"></i>
              导出
            </el-button>
          </div>
          <!--表格-->
          <div class="table-wrapper">
            <el-table
              :data="contentTableData"
              border
              style="width: 100%">
              <el-table-column
                prop="typeName"
                label="内容分类">
              </el-table-column>
              <el-table-column
                prop="countSubmit"
                label="申报人数"
                align="center"
                width="110">
              </el-table-column>
              <el-table-column
                prop="countSuccess"
                label="通过人数"
                align="center"
                width="120">
              </el-table-column>
            </el-table>
          </div>
          <!--分页-->
          <div class="pagination-wrapper">
            <el-pagination
              v-if="contentTotal>content.pageSize"
              @size-change="contentSizeChange"
              @current-change="contentCurrentChange"
              :page-sizes="[10,20,30, 50,100]"
              :page-size="content.pageSize"
              :current-page="content.pageNumber"
              layout="total, sizes, prev, pager, next, jumper"
              :total="contentTotal">
            </el-pagination>
          </div>
         <div class="echart-wrapper">
            <div id="echarts2" style="width: 100%;height:600px;" ref="echarts2"></div>
          </div>
        </div>
      </el-tab-pane>


    </el-tabs>
	</div>
</template>

<script>
  import echarts from "../../../../../../static/echarts/echarts.common.min";
	export default {
    props:['productType','product_id'],
		data() {
			return {
        activeChilidName: 'subject',
        contentSituationUrl:'/pmpheep/expertation/count/2/'   ,  //内容统计URL
        subjectSituationUrl:'/pmpheep/expertation/count/1/',   //学科统计URL
        professionSituationUrl:'/pmpheep/expertation/count/3/',   //申报专业统计URL
        stSubjects:[], // 申报情况统计 - 按学科统计 - 书籍
        stPresetPersons:[], // 申报情况统计 - 按学科统计 - 申报人数
        stChosenPersons:[], // 申报情况统计 - 按学科统计 - 通过人数

        stContents:[], // 申报情况统计 - 按内容统计 - 内容
        stContentPresetPersons:[], // 申报情况统计 - 按内容统计 - 申报人数
        stContentChosenPersons:[], // 申报情况统计 - 按内容统计 - 通过人数

        stProfessions:[], // 申报情况统计 - 按申报专业统计 - 申报专业
        stProfessionPresetPersons:[], // 申报情况统计 - 按申报专业统计 - 申报人数
        stProfessionChosenPersons:[], // 申报情况统计 - 按申报专业统计 - 通过人数

        content:{
          pageNumber:1,
          pageSize:10,
          type_name:'',
          id:this.product_id,
      },
        contentTotal:1,
        contentTableData:[],
        subject:{
          pageNumber:1,
          pageSize:10,
          type_name:'',
          id:this.product_id
      },
        subjectTotal:1,
        subjectTableData:[],

        profession:{
          pageNumber:1,
          pageSize:10,
          type_name:'',
          id:this.product_id,
        },

        professionTotal:1,
        professionTableData:[],



        // subjectShow:true,
        // contentShow:true,
        // professionShow:true

    };
		},methods: {
      /*subjectShowFun(){
        this.subjectShow = false;
      },
      contentShowFun(){
        this.contentShow = false;
      },
      professionShowFun(){
        this.professionShow = false;
      },
      activeFun(activeName){
        this.activeChilidName = activeName;
      },*/
      getContentTableDataFun(){
        this.content.pageNumber=1;
        this.getContentTableData();
      },
      /* 获取内容申报情况统计数据 */
      getContentTableData(){
        this.$axios.get(this.contentSituationUrl+this.productType,{
          params:this.content
        }).then((res)=>{
          if(res.data.code==1){
            var resData = res.data.data;
            this.contentTotal=resData.total;
            this.contentTableData=resData.rows;
          }
        })
      },
      /* 获取内容申报情况统计数据图表 */
      getContentEchart(){
        var myChart2 = echarts.init(this.$refs.echarts2);
        this.$axios.get(this.contentSituationUrl+this.productType,{
          params:this.content
        }).then((res)=>{
          if(res.data.code==1){
            var resData = res.data.data;
            this.stContents = [];
            this.stContentPresetPersons =[];
            this.stContentChosenPersons = [];
            resData.rows.forEach(item => {
              this.stContents.push(item.typeName)
              this.stContentPresetPersons.push(item.countSubmit)
              this.stContentChosenPersons.push(item.countSuccess)
            })
            console.log(myChart2);
            myChart2.clear();
            myChart2.setOption({
              title: {
                show: "true",
                text: "申报人数统计图表"
              },
              tooltip: {
                show: true,
                trigger: "axis",
                axisPointer: {
                  type: "cross",
                  crossStyle: {
                    color: "#999"
                  }
                }
              },
              toolbox: {
                show: true,
                right: '5%',
                feature: {
                  dataView: { show: true, readOnly: false,optionToContent: function(opt) {
                      var axisData = opt.xAxis[0].data;
                      var series = opt.series;
                      var table = '<table border="1" style="width:50%;margin-left:20px;border-collapse:collapse;font-size:14px;text-align:center"><tbody><tr>'
                        + '<td></td>'
                        + '<td style="padding: 0 10px">' + series[0].name + '</td>'
                        + '<td style="padding: 0 10px">' + series[1].name + '</td>'
                        + '</tr>';
                      for (var i = 0, l = axisData.length; i < l; i++) {
                        table += '<tr>'
                          + '<td style="padding: 0 10px">' + axisData[i] + '</td>'
                          + '<td style="padding: 0 10px">' + series[0].data[i] + '</td>'
                          + '<td style="padding: 0 10px">' + series[1].data[i] + '</td>'
                          + '</tr>';
                      }
                      table += '</tbody></table>';
                      return table;
                    } },
                  magicType: { show: true, type: ["line", "bar"] },
                  restore: { show: true },
                  saveAsImage: { show: true }
                }
              },
              legend: {
                data: ["申报人数", "通过人数"]
              },
              xAxis: [
                {
                  name: "内容分类",
                  type: "category",
                  data: this.stContents,
                  nameTextStyle:{padding:[0,0,0,20]},
                  axisPointer: {
                    type: "shadow"
                  },
                  axisLabel: {
                    interval: 0,
                    boundaryGap: [0, 0.01],
                    formatter: function(value) {
                      var ret = "";//拼接加\n返回的类目项
                      var maxLength = 2;//每项显示文字个数
                      var valLength = value.length;//X轴类目项的文字个数
                      var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
                      if (rowN > 1)//如果类目项的文字大于3,
                      {
                        for (var i = 0; i < rowN; i++) {
                          var temp = "";//每次截取的字符串
                          var start = i * maxLength;//开始截取的位置
                          var end = start + maxLength;//结束截取的位置
                          //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                          temp = value.substring(start, end) + "\n";
                          ret += temp; //凭借最终的字符串
                        }
                        return ret;
                      }
                      else {
                        return value;
                      }

                    }
                  }
                }
              ],
              grid: {
                left: "10%",
                bottom: "35%"
              },
              yAxis: [
                {
                  type: "value",
                  name: "申报人数",
                  min: 0,

                  max: Math.max.apply(null, this.stContentPresetPersons),
                  minInterval: 1,
                  axisLabel: {
                    formatter: "{value} 人"
                  }
                },
                {
                  type: "value",
                  name: "通过人数",
                  min: 0,
                  max: Math.max.apply(null, this.stContentChosenPersons),
                  minInterval: 1,
                  axisLabel: {
                    formatter: "{value} 人"
                  }
                }
              ],
              series: [
                {
                  name: "申报人数",
                  type: "bar",
                  data: this.stContentPresetPersons
                },
                {
                  name: "通过人数",
                  type: "line",
                  yAxisIndex: 1,
                  data: this.stContentChosenPersons
                }
              ]
            })
            console.log(this.stContents,this.stContentPresetPersons,this.stContentChosenPersons);
          }
        })
      },
      getSubjectTableDataFun(){
        this.subject.pageNumber=1;
        this.getSubjectTableData();
      },
      /* 获取按学科统计申报情况 */
      getSubjectTableData(){
        this.$axios.get(this.subjectSituationUrl+this.productType,{
          params:this.subject
        }).then((res)=>{
          console.log(res)
          console.log(this.subjectTableData)
          if(res.data.code==1){
            this.subjectTotal=res.data.data.total;
            this.subjectTableData=res.data.data.rows;
          }
        })
      },
      /* 获取按学科统计申报情况图表 */
      getSubjectEchart(){
        var myChart = echarts.init(this.$refs.echarts1);
        this.$axios.get(this.subjectSituationUrl+this.productType,{
          params:this.subject
        }).then((res)=>{
          if(res.data.code==1){
            this.stSubjects = [];
            this.stPresetPersons =[];
            this.stChosenPersons =[];
            res.data.data.rows.forEach(item => {
              this.stSubjects.push(item.typeName); // 书籍
              this.stPresetPersons.push(item.countSubmit); // 申报人数
              this.stChosenPersons.push(item.countSuccess); // 当选人数
            })
            myChart.setOption({
              title: {
                show: "true",
                text: "申报人数统计图表"
              },
              tooltip: {
                show: true,
                trigger: "axis",
                axisPointer: {
                  type: "cross",
                  crossStyle: {
                    color: "#999"
                  }
                }
              },
              toolbox: {
                show: true,
                right: '5%',
                feature: {
                  dataView: { show: true, readOnly: false,optionToContent: function(opt) {
                      var axisData = opt.xAxis[0].data;
                      var series = opt.series;
                      var table = '<table border="1" style="width:50%;margin-left:20px;border-collapse:collapse;font-size:14px;text-align:center"><tbody><tr>'
                        + '<td></td>'
                        + '<td style="padding: 0 10px">' + series[0].name + '</td>'
                        + '<td style="padding: 0 10px">' + series[1].name + '</td>'
                        + '</tr>';
                      for (var i = 0, l = axisData.length; i < l; i++) {
                        table += '<tr>'
                          + '<td style="padding: 0 10px">' + axisData[i] + '</td>'
                          + '<td style="padding: 0 10px">' + series[0].data[i] + '</td>'
                          + '<td style="padding: 0 10px">' + series[1].data[i] + '</td>'
                          + '</tr>';
                      }
                      table += '</tbody></table>';
                      return table;
                    } },
                  magicType: { show: true, type: ["line", "bar"] },
                  restore: { show: true },
                  saveAsImage: { show: true }
                }
              },
              legend: {
                data: ["申报人数", "通过人数"]
              },
              xAxis: [
                {
                  name: "学科分类",
                  left:"10px;",
                  type: "category",
                  nameTextStyle:{padding:[0,0,0,20]},
                  data: this.stSubjects,
                  axisPointer: {
                    type: "shadow"
                  },
                  axisLabel: {
                    interval: 0,
                    boundaryGap: [0, 0.01],textStyle:{

                    },
                    formatter: function(value) {
                      var ret = "";//拼接加\n返回的类目项
                      var maxLength = 2;//每项显示文字个数
                      var valLength = value.length;//X轴类目项的文字个数
                      var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
                      if (rowN > 1)//如果类目项的文字大于3,
                      {
                        for (var i = 0; i < rowN; i++) {
                          var temp = "";//每次截取的字符串
                          var start = i * maxLength;//开始截取的位置
                          var end = start + maxLength;//结束截取的位置
                          //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                          temp = value.substring(start, end) + "\n";
                          ret += temp; //凭借最终的字符串
                        }
                        return ret;
                      }
                      else {
                        return value;
                      }

                    }
                  }
                }
              ],
              grid: {
                left: "10%",
                bottom: "35%"
              },
              yAxis: [
                {
                  type: "value",
                  name: "申报人数",
                  min: 0,
                  max: Math.max.apply(null, this.stPresetPersons),
                  minInterval:1,
                  axisLabel: {
                    formatter: "{value} 人"
                  }
                },
                {
                  type: "value",
                  name: "通过人数",
                  min: 0,
                  max: Math.max.apply(null, this.stChosenPersons),
                  minInterval:1,
                  axisLabel: {
                    formatter: "{value} 人"
                  }
                }
              ],
              series: [
                {
                  name: "申报人数",
                  type: "bar",
                  data: this.stPresetPersons
                },
                {
                  name: "通过人数",
                  type: "line",
                  yAxisIndex: 1,
                  data: this.stChosenPersons
                }
              ]
            })
          }
        })
      },

      getProfessionTableDataFun(){
        this.subject.pageNumber=1;
        this.getProfessionTableData();
      },
      /* 获取按学科统计申报情况 */
      getProfessionTableData(){
        this.$axios.get(this.professionSituationUrl+this.productType,{
          params:this.profession
        }).then((res)=>{
          //console.log(res)
          //console.log(this.professionTableData)
          if(res.data.code==1){
            this.professionTotal=res.data.data.total;
            this.professionTableData=res.data.data.rows;
          }
        })
      },
      /* 获取按学科统计申报情况图表 */
      getProfessionEchart(){
        var myChart = echarts.init(this.$refs.echarts3);
        this.$axios.get(this.professionSituationUrl+this.productType,{
          params:this.profession
        }).then((res)=>{
          if(res.data.code==1){
            this.stProfessions = [];
            this.stProfessionPresetPersons =[];
            this.stProfessionChosenPersons =[];
            res.data.data.rows.forEach(item => {
              this.stProfessions.push(item.typeName); // 书籍
              this.stProfessionPresetPersons.push(item.countSubmit); // 申报人数
              this.stProfessionChosenPersons.push(item.countSuccess); // 当选人数
            })
            myChart.setOption({
              title: {
                show: "true",
                text: "申报人数统计图表"
              },
              tooltip: {
                show: true,
                trigger: "axis",
                axisPointer: {
                  type: "cross",
                  crossStyle: {
                    color: "#999"
                  }
                }
              },
              toolbox: {
                show: true,
                right: '5%',
                feature: {
                  dataView: { show: true, readOnly: false,optionToContent: function(opt) {
                      var axisData = opt.xAxis[0].data;
                      var series = opt.series;
                      var table = '<table border="1" style="width:50%;margin-left:20px;border-collapse:collapse;font-size:14px;text-align:center"><tbody><tr>'
                        + '<td></td>'
                        + '<td style="padding: 0 10px">' + series[0].name + '</td>'
                        + '<td style="padding: 0 10px">' + series[1].name + '</td>'
                        + '</tr>';
                      for (var i = 0, l = axisData.length; i < l; i++) {
                        table += '<tr>'
                          + '<td style="padding: 0 10px">' + axisData[i] + '</td>'
                          + '<td style="padding: 0 10px">' + series[0].data[i] + '</td>'
                          + '<td style="padding: 0 10px">' + series[1].data[i] + '</td>'
                          + '</tr>';
                      }
                      table += '</tbody></table>';
                      return table;
                    } },
                  magicType: { show: true, type: ["line", "bar"] },
                  restore: { show: true },
                  saveAsImage: { show: true }
                }
              },
              legend: {
                data: ["申报人数", "通过人数"]
              },
              xAxis: [
                {
                  name: "申报专业",
                  left:"10px;",
                  type: "category",
                  nameTextStyle:{padding:[0,0,0,20]},
                  data: this.stProfessions,
                  axisPointer: {
                    type: "shadow"
                  },
                  axisLabel: {
                    interval: 0,
                    boundaryGap: [0, 0.01],textStyle:{

                    },
                    formatter: function(value) {
                      var ret = "";//拼接加\n返回的类目项
                      var maxLength = 2;//每项显示文字个数
                      var valLength = value.length;//X轴类目项的文字个数
                      var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
                      if (rowN > 1)//如果类目项的文字大于3,
                      {
                        for (var i = 0; i < rowN; i++) {
                          var temp = "";//每次截取的字符串
                          var start = i * maxLength;//开始截取的位置
                          var end = start + maxLength;//结束截取的位置
                          //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                          temp = value.substring(start, end) + "\n";
                          ret += temp; //凭借最终的字符串
                        }
                        return ret;
                      }
                      else {
                        return value;
                      }

                    }
                  }
                }
              ],
              grid: {
                left: "10%",
                bottom: "35%"
              },
              yAxis: [
                {
                  type: "value",
                  name: "申报人数",
                  min: 0,
                  max: Math.max.apply(null, this.stProfessionPresetPersons),
                  minInterval:1,
                  axisLabel: {
                    formatter: "{value} 人"
                  }
                },
                {
                  type: "value",
                  name: "通过人数",
                  min: 0,
                  max: Math.max.apply(null, this.stProfessionChosenPersons),
                  minInterval:1,
                  axisLabel: {
                    formatter: "{value} 人"
                  }
                }
              ],
              series: [
                {
                  name: "申报人数",
                  type: "bar",
                  data: this.stProfessionPresetPersons
                },
                {
                  name: "通过人数",
                  type: "line",
                  yAxisIndex: 1,
                  data: this.stProfessionChosenPersons
                }
              ]
            })
          }
        })
      },


      /* 分页切换 */
      contentSizeChange(val){
        //this.content.pageSize=val;
        this.content.pageNumber=1;
        this.getContentTableData();
      },
      contentCurrentChange(val){
        this.content.pageNumber=val;
        this.getContentTableData();
      },
      subjectSizeChange(val){
        //this.subject.pageSize=val;
        this.subject.pageNumber=1;
        this.getSubjectTableData();
      },
      subjectCurrentChange(val){
        this.subject.pageNumber=val;
        this.getSubjectTableData();
      },

      professionSizeChange(val){
        this.profession.pageSize=val;
        this.profession.pageNumber=1;
        this.getProfessionTableData();
      },
      professionCurrentChange(val){
        this.profession.pageNumber=val;
        this.getProfessionTableData();
      },
      /**
       * 点击tabs切换
       */
      handleTabsClick(tab, event) {
        //console.log(tab,event);
        this.subject.type_name='';
        this.content.type_name='';
        if(tab.name=='subject'){
          this.getSubjectTableData();
          this.getSubjectEchart();
        }else if(tab.name=='content'){
          this.getContentTableData();
          this.getContentEchart();
        }
        else{
          this.getProfessionTableData();
          this.getProfessionEchart();
        }
      },
      /** 导出Excel */
      exportSubjectExcel(){
        let url = '/pmpheep/expertation/exportExpertationCount/?ptype='+ this.productType + '&type_name=' + this.subject.type_name+"&productId="+this.product_id;
        // //console.log(url)
        this.$commonFun.downloadFile(url);
      },
      exportContentExcel(){
        let url = '/pmpheep/expertation/exportExpertationCount/?ptype='+ this.productType + '&type_name=' + this.content.type_name +"&productId="+this.product_id ;
        // //console.log(url)
        this.$commonFun.downloadFile(url);
      },
      exportProfessionExcel(){
        let url = '/pmpheep/expertation/exportExpertationCount/?ptype='+ this.productType + '&type_name=' + this.profession.type_name  +"&productId="+this.product_id;
        // //console.log(url)
        this.$commonFun.downloadFile(url);
      }
    },
    components:{


    },
    created(){
      this.getSubjectTableData();
      this.getContentTableData();
      this.getProfessionTableData();

    },
    mounted() {
      var echartWidth =
        (document.documentElement.clientWidth || document.body.clientWeight) -
        300;
     this.$refs.echarts1.style.width = echartWidth + "px";
      this.$refs.echarts2.style.width = echartWidth + "px";
      this.$refs.echarts3.style.width = echartWidth + "px";
      //console.log(echartWidth);
      // 指定图表的配置项和数据
      this.getContentEchart();
      this.getSubjectEchart();
      this.getProfessionEchart();
    }
	}
</script>

<style scoped>
  .title {
    margin-bottom: 18px;
    margin-left: 20px;
    font-size: 15px;
    color: #8a8585;
  }
  .num-chart-iterm {
    display: inline-block;
    width: 180px;
  }
  .num-chart-iterm > div {
    margin: 0 auto;
    width: 104px;
    height: 62px;
    border-bottom: none !important;
    border-radius: 68px 68px 0 0;
    text-align: center;
    line-height: 20px;
  }
  .num-chart-iterm > div > span {
    font-size: 14px;
    font-weight: bold;
  }
  .num-chart-iterm > div > span.small {
    font-size: 18px;
  }
  .num-chart-iterm > p {
    background: #fff;
    border: 1px solid #ccc;
    height: 20px;
    line-height: 20px;
    border-radius: 10px;
    width: 140px;
    margin: 0 auto;
    text-align: center;
  }
  .num-chart-iterm:nth-of-type(n + 1) > div {
    border: 8px solid #c24fb7;
    color: #c24fb7;
  }
  .num-chart-iterm:nth-of-type(n + 2) > div {
    border: 8px solid #ff9f40;
    color: #ff9f40;
  }
  .num-chart-iterm:nth-of-type(n + 3) > div {
    border: 8px solid #ff685f;
    color: #ff685f;
  }
  .num-chart-iterm:nth-of-type(n + 4) > div {
    border: 8px solid #25a3de;
    color: #25a3de;
  }
  .num-chart-iterm:nth-of-type(n + 5) > div {
    border: 8px solid #2dc183;
    color: #2dc183;
  }
  .num-chart-iterm:nth-of-type(n + 6) > div {
    border: 8px solid #357ab3;
    color: #357ab3;
  }
  .echart-wrapper {
    padding: 60px 0 0;
  }
  .gray{
    color:#8a8585;
    font-weight: normal;
  }
  .marginspan{
    display: inline-block;
    margin-top: 27px;
  }
</style>
