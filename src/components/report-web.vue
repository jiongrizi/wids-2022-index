<template>
  <el-row class="echart-container" v-loading.fullscreen.lock="loadingPage">
    <el-col :span="24">
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="12">
            <h3>基础安全报表</h3>
            
        </el-col>
        <el-col :span="12" class="text-align-right">
          <div class="echart-select">
            <el-select
              v-model="domain"
              placeholder="请选择"
              @change="onChangeDomain"
              size="small"
            >
              <el-option
                v-for="item in domainList"
                :key="item.domain"
                :label="item.domain"
                :value="item.domain"
              >
              </el-option>
            </el-select>

            <el-select
              v-model="timeZone"
              placeholder="请选择"
              @change="onChangeTime"
              size="small"
            >
              <el-option
                v-for="item in timeList"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              >
              </el-option>
            </el-select>
          </div>
          
        </el-col>
      </el-row>

      <el-divider />
      <div class="margin-4x"></div>
      <el-row>
        <el-col :span="12">
          <el-card
            class="box-card"
            shadow="never"
            v-loading="loading.requestCountTotle"
          >
            <template #header>
              <div class="card-header">
                <span>攻击总数</span>
              </div>
            </template>
            <div class="card-text">
              <span>{{ requestCountTotle }}</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card
            class="box-card"
            shadow="never"
            v-loading="loading.requestIpTotle"
          >
            <template #header>
              <div class="card-header">
                <span>攻击IP总数</span>
              </div>
            </template>
            <div class="card-text">
              <span>{{ requestIpTotle }}</span>
            </div>
          </el-card>
          <div class="margin-4x"></div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span = "12">
          <div id="request-count-trend"></div>
        </el-col>
        <el-col :span = "12">
          <div id="ip-count-trend"></div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span = "12">
          <div id="att-type-top"></div>
        </el-col>
        <el-col :span = "12">
          <div id="att-ip-top"></div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span = "12">
          <div id="att-uri-top"></div>
        </el-col>
        <el-col :span = "12">
          <div id="att-ip-country-top"></div>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>
<script>
import echarts  from "../assets/scripts/echart";
import { mixin, JXAjax } from "../assets/scripts/common";
export default {
  mixins: [mixin],
  data() {
    return {
      loadingPage: false,
      logSource: "",
      domainList: [],
      domain: "",
      timeZone: "7day",
      timeList: [
        { key: "7day", value: "7天" },
        { key: "24hour", value:"24小时"  },
        { key: "1hour", value: "1小时" },
      ],
      loading: {
        requestCountTotle: true,
        requestIpTotle: true,

      },
      requestCountTotle: "0",
      requestIpTotle:"0",
    };
  },
  computed: {
    rules() {
      return {      
        public_key: [
          { required: true, message: '请输入公钥', trigger: "blur" },
        ],
      }
    }
  },
  
  mounted() {
    
    this.getdomainListData();
    this.getData();
  },
  methods: { 
    getdomainListData() {
      var t = this;
      JXAjax(
        "get",
        "/waf/waf_get_domain_list",
        {},
        function (response) {
          t.loadingPage = false;
          t.domainList = response.data.message;
          t.domainList.unshift({ domain: "All" });
          t.domain = t.domainList[0].domain;
        },
        function () {
          t.loadingPage = false;
        },
        
      );
    },
    getData() {
      var t = this;
      JXAjax(
        "get",
        "/waf/waf_get_sys_report_conf",
        {},
        function (response) {
          t.loadingPage = false;
          t.logSource = response.data.message.log_source;
          t.getRequestCountTotle();
          t.getRequestIpTotle();
          t.getRequestCountTrend();
          t.getIpCountTrend();
          t.getAttTypeTop();
          t.getAttIpTop();
          t.getAttUriTop();
          t.getAttIpCountryTop();
        },
        function () {
          t.loadingPage = false;
        }
      );
    },
    
    getRequestCountTotle() {
      var t = this;
      var postUrl = "/report/cls_web_request_count_totle";
      if (t.logSource == "sls") { 
        postUrl = "/report/sls_web_request_count_totle";
      }
      JXAjax(
        "post",
        postUrl,
        {time_zone: t.timeZone},
        function (response) {  
          if (t.logSource == "cls") {
            var _data = response.data.message.AnalysisResults;
            t.requestCountTotle = _data[0].Data[0].Value;
          } else if (t.logSource == "sls") { 
            t.requestCountTotle = response.data.message[0].count;
          }
          
          t.loading.requestCountTotle = false;
          
        },
        function () {
          
        },
        "no-message"
      );
    },
    getRequestIpTotle() {
      var t = this;
      var postUrl = "/report/cls_web_request_ip_totle";
      if (t.logSource == "sls") { 
        postUrl = "/report/sls_web_request_ip_totle";
      }
      JXAjax(
        "post",
        postUrl,
        {time_zone: t.timeZone},
        function (response) {
          if (t.logSource == "cls") {
            var _data = response.data.message.AnalysisResults;
            t.requestIpTotle = _data[0].Data[0].Value;
          } else if (t.logSource == "sls") { 
            t.requestIpTotle = response.data.message[0].count;
          }
          
          t.loading.requestIpTotle = false;
        },
        function () {
          
        },
        "no-message"
      );
    },
    getRequestCountTrend() {
      var t = this;
      var postUrl = "/report/cls_web_request_count_trend";
      if (t.logSource == "sls") { 
        postUrl = "/report/sls_web_request_count_trend";
      }
      JXAjax(
        "post",
        postUrl,
        {time_zone: t.timeZone},
        function (response) {
          t.requestCountTrend = response.data.message;

          t.initLineChart(t.requestCountTrend, "request-count-trend", "攻击流量趋势图");
        },
        function () {
          
        },
        "no-message"
      );
    },
    getIpCountTrend() {
      var t = this;
      var postUrl = "/report/cls_web_ip_count_trend";
      if (t.logSource == "sls") { 
        postUrl = "/report/sls_web_ip_count_trend";
      }
      JXAjax(
        "post",
        postUrl,
        {time_zone: t.timeZone},
        function (response) {
          t.ipCountTrend = response.data.message;
          t.initLineChart(t.ipCountTrend, "ip-count-trend", "攻击IP数量趋势图");
        },
        function () {
          
        },
        "no-message"
      );
    },
    
    getAttTypeTop() {
      var t = this;
      var postUrl = "/report/cls_web_att_type_top10";
      if (t.logSource == "sls") { 
        postUrl = "/report/sls_web_att_type_top10";
      }
      JXAjax(
        "post",
        postUrl,
        {time_zone: t.timeZone},
        function (response) {
          t.attTypeTop = response.data.message;
          t.initBarChart(t.attTypeTop, "att-type-top", "命中防护-TOP10");
        },
        function () {
          
        },
        "no-message"
      );
    },
    getAttIpTop() {
      var t = this;
      var postUrl = "/report/cls_web_att_ip_top10";
      if (t.logSource == "sls") { 
        postUrl = "/report/sls_web_att_ip_top10";
      }
      JXAjax(
        "post",
        postUrl,
        {time_zone: t.timeZone},
        function (response) {
          t.attIpTop = response.data.message;
          t.initBarChart(t.attIpTop, "att-ip-top", "攻击IP-TOP10");
        },
        function () {
          
        },
        "no-message"
      );
    },
    getAttUriTop() {
      var t = this;
      var postUrl = "/report/cls_web_att_uri_top10";
      if (t.logSource == "sls") { 
        postUrl = "/report/sls_web_att_ip_top10";
      }
      JXAjax(
        "post",
        postUrl,
        {time_zone: t.timeZone},
        function (response) {
          t.attUriTop = response.data.message;
          t.initBarChart(t.attUriTop, "att-uri-top", "攻击URL-TOP10");
        },
        function () {
          
        },
        "no-message"
      );
    },
    getAttIpCountryTop() {
      var t = this;
      var postUrl = "/report/cls_web_att_ip_country_top10";
      if (t.logSource == "sls") { 
        postUrl = "/report/sls_web_att_ip_top10";
      }
      JXAjax(
        "post",
        postUrl,
        {time_zone: t.timeZone},
        function (response) {
          t.attIpCountryTop = response.data.message;
          t.initBarChart(t.attIpCountryTop, "att-ip-country-top", "攻击来源地区-TOP10");
        },
        function () {
          
        },
        "no-message"
      );
    },
    onChangeDomain(value) {
      var obj = {};
      obj = this.domainList.find((item) => {
        return item.domain === value;
      });
      this.domain = obj.domain;
      this.getData();
    },
    onChangeTime(value) {
      var obj = {};
      obj = this.timeList.find((item) => {
        return item.key === value;
      });
      this.timeZone = obj.key;
      this.getData();
    },
    initLineChart(message, id, text) {
      var x = [];
      var y = [];
      var title = text || "";

      if (this.logSource == "cls") { 
        var data = message.AnalysisResults;
        var col =  message.ColNames;

        for (var i = 0; i < data.length; i++) {
          var dataItem = data[i].Data;
          for (var j = 0; j < dataItem.length; j++) { 
            if (dataItem[j].Key == col[0]) { 
              x.push(dataItem[j].Value);
            }
            if (dataItem[j].Key == col[1]) { 
              y.push(dataItem[j].Value);
            }
          }
        }
      }

      if (this.logSource == "sls") { 
        var slsdata = message;
        for (var m = 0; m < slsdata.length; m++) {
          x.push(slsdata[m].time)
          y.push(slsdata[m].count)
        }
      }
      
      var option = {
        title: {
          text: title
        },
        // 全局调色盘。
        color: [
          '#c23531',
        ],
        tooltip: {
          trigger: "axis",
          // formatter: "{c}",
        },

        xAxis: {
          type: "category",
          data: x,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: y,
            type: "line",
          },
        ],
      };
      this.buildChart(id, option);
    },
    initBarChart(message, id, text) {
      var x = [];
      var y = [];
      var title = text || "";
      var data = message.AnalysisResults;
      var col =  message.ColNames;

      for (var i = 0; i < data.length; i++) {
        var dataItem = data[i].Data;
        for (var j = 0; j < dataItem.length; j++) { 
          if (dataItem[j].Key == col[0]) { 
            y.push(dataItem[j].Value);
          }
          if (dataItem[j].Key == col[1]) { 
            x.push(dataItem[j].Value);
          }
        }
      }

      var option = {
        title: {
          text: title
        },
        // 全局调色盘。
        color: [
          '#c23531',
          '#2f4554',
          '#61a0a8',
          '#d48265',
          '#91c7ae',
          '#749f83',
          '#ca8622',
          '#bda29a',
          '#6e7074',
          '#546570',
          '#c4ccd3'
        ],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: 'shadow'
          }
        },
        
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        yAxis: {
          type: "category",
          data: y,
        },
        xAxis: {
          type: "value",
          
        },
        series: [
          {
            data: x,
            type: "bar",
          },
        ],
      };
      this.buildChart(id, option);
    },
    buildChart(id, option) {
      //var theme = theme || "macarons";
      if (document.querySelector("#" + id)) {
        var _option = option || [];
        var myChart = echarts.init(document.getElementById(id));
        if (_option && typeof _option === "object") {
          myChart.setOption(_option, true);
        }
      }
    },
  },
};
</script>
<style>
#request-count-trend,
#ip-count-trend,
#att-type-top,
#att-ip-top,
#att-uri-top,
#att-ip-country-top
{
  width: 100%;
  height: 300px;
}
.echart-container .echart-select .el-select{
  margin-left: 10px;
}
.echart-container .el-card__header {
  border-bottom: none;
}
.echart-container .el-card__body {
  padding: 0px;
}
.echart-container .card-text {
  height: 160px;
  font-weight: bold;
  color: #f56c6c;
  text-align: center;
  font-size: 50px;
  line-height: 160px;
}
.echart-container .el-col-12 {
  padding: 0 10px;
}
</style>
