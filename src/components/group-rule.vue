<template>
  <el-row v-loading.fullscreen.lock="loadingPage">
    <el-col :span="24">
      <el-row class="text-align-right">
        <div class="domain-search-input">
          <el-input placeholder="请输入规则名进行搜索" prefix-icon="el-icon-search" v-model="ruleSearch"></el-input>
        </div>
        <el-button type="success" @click="onClickChangeOrder()">优先级调整</el-button>
        <a class="el-button el-button--primary"
          :href="'/#/' + backUrl +'-edit/' + ruleGroupUuid + '/group_rule/new'">添加规则</a>
        
        <a class="el-button el-button--primary is-plain" :href="'/#/' + backUrl +'/group_rule'">返回</a>
      </el-row>
      <div class="demo-block">
        <el-table :data="
          tableData.filter(
            (data) =>
              !ruleSearch ||
              data.domain.toLowerCase().includes(ruleSearch.toLowerCase())
          )
        " style="width: 100%">
          <el-table-column prop="rule_name" label="规则名称"></el-table-column>
          <el-table-column prop="rule_detail" label="规则描述"></el-table-column>

          <el-table-column label="操作" align="right">
            <template #default="scope">
              <el-button size="mini" @click="handleEdit(scope.row)" class="button-block" type="text">编辑
              </el-button>


              <el-popover placement="top" width="160" v-model:visible="scope.row.isVisiblePopover">
                <p>确定删除吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="scope.row.isVisiblePopover = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="handleDelete(scope.row)" :loading="loading">确定
                  </el-button>
                </div>
                <template #reference>
                  <el-button type="text" size="mini" @click="scope.row.isVisiblePopover = true">删除</el-button>
                </template>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="优先级" align="right" v-if="!isShowOrder">
            <template #default="scope">
              <el-button type="success" class="icon iconfont iconxiangshang" circle
                @click="onClickChangeOrderSubmit(scope.$index, scope.row, 'up')" title="上移" :loading="orderLoading" />
              <el-button type="success" class="icon iconfont iconxiangxia" circle
                @click="onClickChangeOrderSubmit(scope.$index, scope.row, 'down')" title="下移"
                :loading="orderLoading" />
              <el-button type="success" class="icon iconfont iconzhiding" circle
                @click="onClickChangeOrderSubmit(scope.$index, scope.row, 'top')" title="置顶"
                :loading="orderLoading" />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import { mixin, JXAjax } from "../assets/scripts/common";
import { useRoute } from 'vue-router'
export default {
  mixins: [mixin],
  data() {
    return {
      ruleSearch: "",
      loadingPage: false,
      loading: false,
      tableData: [],
      ruleGroupUuid: "",
      isShowOrder: true,
      orderLoading: false,
      backUrl:"sys-web-relate-rule-check",
    };
  },

  mounted() {
    const route = useRoute()
    this.ruleGroupUuid = route.params.ruleGroupUuid;
    this.backUrl = route.params.backUrl;
    this.getData();
  },
  methods: {
    getData() {
      var t = this;
      var postUrl = "/sys/waf_get_sys_web_relate_rule_check_list";

      JXAjax(
        "post",
        postUrl,
        { rule_type: "group_rule", rule_group_name: t.ruleGroupUuid },
        function (response) {
          t.loadingPage = false;
          t.tableData = response.data.message;
          t.tableData.forEach(item => {
            item.isVisiblePopover = false;
          })
        },
        function () {
          t.loadingPage = false;
        },
        "no-message"
      );
    },
    handleEdit(data) { 
      window.location.href = '/#/' + this.backUrl + '-edit/' + this.ruleGroupUuid + '/group_rule/' + data.rule_name;
    },

    handleDelete(data) {
      var t = this;
      t.loading = true;
      JXAjax(
        "post",
        "/sys/waf_del_sys_web_relate_rule_check",
        { rule_name: data.rule_name },
        function (response) {
          data.isVisiblePopover = false;
          t.loading = false;
          t.getData();
        },
        function () {
          t.loading = false;
        }
      );
    },

    onClickChangeOrder() { 
      var t = this;
      t.isShowOrder = !t.isShowOrder;
    },
    onClickChangeOrderSubmit(index, value, operate) { 
      var t = this;
      
      var oData = {
        rule_name: value.rule_name,
        rule_group_name: value.rule_group_name,
      };
      if (index > 0) { 
        if (operate == "top") {
          oData.type = "top";
        }
        if (operate == "up") {
          oData.type = "exchange";
          oData.exchange_name = t.tableData[index - 1].rule_name;
        }
      }

      if (index < t.tableData.length - 1) { 
        if (operate == "down") {
          oData.type = "exchange";
          oData.exchange_name = t.tableData[index + 1].rule_name;
        }
      }
      var postUrl = "/sys/waf_exchange_sys_web_relate_rule_check_priority";

      
      if (oData.type == "top" || oData.type == "exchange") { 
        t.orderLoading = true;  
        JXAjax(
          "post",
          postUrl,
          oData,
          function (response) {
            t.orderLoading = false;
            t.getData();
          },
          function () {
            t.orderLoading = false;
          },
          "no-message"
        );
      }
      
    },
    
  },
};
</script>
<style>
.el-button.button-block {
  display: block;
  margin-left: 0px;
  text-align: right;
  width: 100%;
}
.icon-success {
  color: #67c23a;
  margin-right: 5px;
}
.icon-error {
  color: #f56c6c;
  margin-right: 5px;
}
.icon-warning {
  color: #e6a23c;
  margin-right: 5px;
}
.domain-setting {
  float: right;
}
.domain-redirect {
  margin-top: 5px;
  margin-bottom: 0px !important;
}

.el-form-item.is-required .redirect-box .el-form-item__label:before {
  content: "";
}
.domain-search-input {
  display: block;
  float: left;
  text-align: left;
}
.domain-search-input .el-input {
  width: 100%;
}
.no-padding {
  padding: 0;
}
.node-detail span {
  font-size: 12px;
}
.domain-tabs {
  margin-bottom: 18px;
}
</style>
